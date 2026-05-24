import { describe, it, expect, vi } from "vitest";
import { CustomPromise } from "@/promises/CustomPromise";

type User = { id: number; name: string };
type ApiError = { message: string };

describe("CustomPromise: 1", () => {
  it("resolves and finish receives (result, undefined)", async () => {
    const spy = vi.fn();

    const p = new CustomPromise<User, ApiError>((resolve) =>
      resolve({ id: 1, name: "Alice" })
    );

    // attach finish and also await to ensure settle
    p.finish(spy);

    // awaiting ensures the promise microtask queue flushed
    await p;

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ id: 1, name: "Alice" }, undefined);
  });

  it("rejects and finish receives (undefined, error)", async () => {
    const spy = vi.fn();
    const err: ApiError = { message: "boom" };

    const p = new CustomPromise<User, ApiError>((_res, reject) => reject(err));

    // Avoid unhandled rejection: attach catch
    p.catch(() => {
      /* swallow for test */
    });

    p.finish(spy);

    // Wait a tick so rejection settles
    try {
      await p;
    } catch {
      /* ignore */
    }

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(undefined, err);
  });

  it("then chaining still returns CustomPromise and finish is available", async () => {
    const spy = vi.fn();

    const p = new CustomPromise<number, string>((resolve) => resolve(1));

    const chained = p
      .then((n) => n + 1) // should return CustomPromise<number, string>
      .then((n) => n * 3);

    // attach finish to chained
    chained.finish(spy);

    const result = await chained;
    expect(result).toBe(6);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(6, undefined);
  });

  it("catch chaining still returns CustomPromise and finish is available after error handling", async () => {
    const spy = vi.fn();

    const p = new CustomPromise<number, string>((_res, reject) =>
      reject("err-1")
    );

    // recover in catch and continue chain
    const chained = p
      .catch(() => {
        // return fallback value
        return 10;
      })
      .then((v) => v + 5); // should be 15

    chained.finish(spy);

    const result = await chained;
    expect(result).toBe(15);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(15, undefined);
  });

  it("multiple finish handlers are called (and can be chained)", async () => {
    const spyA = vi.fn();
    const spyB = vi.fn();

    const p = new CustomPromise<number, never>((resolve) => resolve(7));

    // chaining finish calls and ensure both run
    p.finish(spyA).finish(spyB);

    await p;
    expect(spyA).toHaveBeenCalledTimes(1);
    expect(spyB).toHaveBeenCalledTimes(1);
    expect(spyA).toHaveBeenCalledWith(7, undefined);
    expect(spyB).toHaveBeenCalledWith(7, undefined);
  });

  it("finish receives final state even if then/catch transform types", async () => {
    const spy = vi.fn();

    const p = new CustomPromise<number, string>((resolve) => resolve(2));

    const transformed = p
      .then((n) => `value-${n}`) // transforms to string
      .then((s) => `${s}-ok`);

    // ensure finish on final chain sees final resolved value
    transformed.finish(spy);

    const result = await transformed;
    expect(result).toBe("value-2-ok");
    expect(spy).toHaveBeenCalledWith("value-2-ok", undefined);
  });
});

describe("CustomPromise: 2", () => {
  it("resolves value like a normal Promise", async () => {
    const p = new CustomPromise<number>((resolve) => resolve(42));
    const v = await p;
    expect(v).toBe(42);
  });

  it("rejects error like a normal Promise", async () => {
    const err = new Error("boom");
    const p = new CustomPromise<number>((_, reject) => reject(err));
    await expect(p).rejects.toThrow("boom");
  });

  it("calls finish after resolve", async () => {
    const results: Array<[number | undefined, Error | undefined]> = [];
    const p = new CustomPromise<number, Error>((resolve) => {
      setTimeout(() => resolve(123), 10);
    }).finish((v, e) => results.push([v, e]));

    const value = await p;
    expect(value).toBe(123);
    expect(results).toEqual([[123, undefined]]);
  });

  it("calls finish after reject", async () => {
    const myErr = new Error("fail");
    const results: Array<[number | undefined, Error | undefined]> = [];
    const p = new CustomPromise<number, Error>((_, reject) => {
      setTimeout(() => reject(myErr), 10);
    }).finish((v, e) => results.push([v, e]));

    await expect(p).rejects.toThrow("fail");
    expect(results).toEqual([[undefined, myErr]]);
  });

  it("finish added after settled fires immediately", async () => {
    const p = new CustomPromise<string>((resolve) => resolve("done"));
    const v = await p;
    expect(v).toBe("done");

    const out: Array<[string | undefined, unknown | undefined]> = [];
    p.finish((val, err) => out.push([val, err]));

    expect(out).toEqual([["done", undefined]]);
  });

  it("then/catch chain keeps CustomPromise type", async () => {
    const p = new CustomPromise<number>((resolve) => resolve(10));
    const chained = p.then((n) => n * 2);
    expect(chained).toBeInstanceOf(CustomPromise);
    const v = await chained;
    expect(v).toBe(20);
  });
});

describe("CustomPromise: 3", () => {
  // BASIC RESOLVE / REJECT
  it("resolves value like a normal Promise", async () => {
    const p = new CustomPromise<number>((resolve) => resolve(42));
    const v = await p;
    expect(v).toBe(42);
  });

  it("rejects error like a normal Promise", async () => {
    const err = new Error("boom");
    const p = new CustomPromise<number>((_, reject) => reject(err));
    await expect(p).rejects.toThrow("boom");
  });

  // FINISH BEHAVIOR (resolve & reject)
  it("resolves and finish receives (result, undefined)", async () => {
    const spy = vi.fn();
    const p = new CustomPromise<User, ApiError>((resolve) =>
      resolve({ id: 1, name: "Alice" })
    );
    p.finish(spy);
    await p;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ id: 1, name: "Alice" }, undefined);
  });

  it("rejects and finish receives (undefined, error)", async () => {
    const spy = vi.fn();
    const err: ApiError = { message: "boom" };
    const p = new CustomPromise<User, ApiError>((_res, reject) => reject(err));
    p.catch(() => {}); // prevent unhandled
    p.finish(spy);
    await expect(p).rejects.toEqual(err);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(undefined, err);
  });

  it("calls finish after resolve (async)", async () => {
    const results: Array<[number | undefined, Error | undefined]> = [];
    const p = new CustomPromise<number, Error>((resolve) =>
      setTimeout(() => resolve(123), 10)
    ).finish((v, e) => results.push([v, e]));
    const value = await p;
    expect(value).toBe(123);
    expect(results).toEqual([[123, undefined]]);
  });

  it("calls finish after reject (async)", async () => {
    const myErr = new Error("fail");
    const results: Array<[number | undefined, Error | undefined]> = [];
    const p = new CustomPromise<number, Error>((_, reject) =>
      setTimeout(() => reject(myErr), 10)
    ).finish((v, e) => results.push([v, e]));
    await expect(p).rejects.toThrow("fail");
    expect(results).toEqual([[undefined, myErr]]);
  });

  it("finish added after settled fires immediately", async () => {
    const p = new CustomPromise<string>((resolve) => resolve("done"));
    const v = await p;
    expect(v).toBe("done");
    const out: Array<[string | undefined, unknown | undefined]> = [];
    p.finish((val, err) => out.push([val, err]));
    expect(out).toEqual([["done", undefined]]);
  });

  // CHAINING (then / catch) + TYPE PRESERVATION
  it("then chaining still returns CustomPromise and finish is available", async () => {
    const spy = vi.fn();
    const p = new CustomPromise<number, string>((resolve) => resolve(1));
    const chained = p.then((n) => n + 1).then((n) => n * 3);
    chained.finish(spy);
    const result = await chained;
    expect(result).toBe(6);
    expect(chained).toBeInstanceOf(CustomPromise);
    expect(spy).toHaveBeenCalledWith(6, undefined);
  });

  it("catch chaining still returns CustomPromise and finish works after recovery", async () => {
    const spy = vi.fn();
    const p = new CustomPromise<number, string>((_res, reject) =>
      reject("err-1")
    );
    const chained = p.catch(() => 10).then((v) => v + 5);
    chained.finish(spy);
    const result = await chained;
    expect(result).toBe(15);
    expect(chained).toBeInstanceOf(CustomPromise);
    expect(spy).toHaveBeenCalledWith(15, undefined);
  });

  it("multiple finish handlers are called (and can be chained)", async () => {
    const spyA = vi.fn();
    const spyB = vi.fn();
    const p = new CustomPromise<number, never>((resolve) => resolve(7));
    p.finish(spyB).finish(spyA);
    await p;
    expect(spyA).toHaveBeenCalledWith(7, undefined);
    expect(spyB).toHaveBeenCalledWith(7, undefined);
  });

  it("finish receives final state even if then/catch transform types", async () => {
    const spy = vi.fn();
    const p = new CustomPromise<number, string>((resolve) => resolve(2));
    const transformed = p.then((n) => `value-${n}`).then((s) => `${s}-ok`);
    transformed.finish(spy);
    const result = await transformed;
    expect(result).toBe("value-2-ok");
    expect(spy).toHaveBeenCalledWith("value-2-ok", undefined);
  });
});
