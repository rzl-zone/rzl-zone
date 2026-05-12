/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from "@/predicates/is/isEqual";
import { describe, expect, it } from "vitest";

describe("isEqual", () => {
  it("compares primitive values", () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual("abc", "abc")).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(0, -0)).toBe(true);
    expect(isEqual(1, "1")).toBe(false);
  });

  it("compares simple objects and arrays", () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
    expect(isEqual([1, 2], [2, 1])).toBe(false);
  });

  it("handles nested structures", () => {
    const a = { foo: { bar: [1, 2, 3] } };
    const b = { foo: { bar: [1, 2, 3] } };
    expect(isEqual(a, b)).toBe(true);
  });

  it("compares Date objects", () => {
    expect(isEqual(new Date("2020-01-01"), new Date("2020-01-01"))).toBe(true);
    expect(isEqual(new Date("2020-01-01"), new Date("2021-01-01"))).toBe(false);
  });

  it("compares RegExp objects", () => {
    expect(isEqual(/abc/gi, /abc/gi)).toBe(true);
    expect(isEqual(/abc/g, /abc/i)).toBe(false);
  });

  it("compares Error objects", () => {
    expect(isEqual(new Error("fail"), new Error("fail"))).toBe(true);
    expect(isEqual(new Error("fail"), new Error("other"))).toBe(false);
  });

  it("compares ArrayBuffer and TypedArray", () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([1, 2, 3]);
    const c = new Uint8Array([1, 2, 4]);
    expect(isEqual(a, b)).toBe(true);
    expect(isEqual(a, c)).toBe(false);

    const ab1 = a.buffer.slice(0);
    const ab2 = b.buffer.slice(0);
    expect(isEqual(ab1, ab2)).toBe(true);
  });

  it("compares Map", () => {
    const a = new Map([["key", 123]]);
    const b = new Map([["key", 123]]);
    const c = new Map([["key", 321]]);
    expect(isEqual(a, b)).toBe(true);
    expect(isEqual(a, c)).toBe(false);
  });

  it("compares Set", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([3, 2, 1]);
    const c = new Set([1, 2]);
    expect(isEqual(a, b)).toBe(true); // order doesn't matter
    expect(isEqual(a, c)).toBe(false);
  });

  it("supports symbol keys", () => {
    const sym = Symbol("x");
    const obj1 = { [sym]: 123 };
    const obj2 = { [sym]: 123 };
    expect(isEqual(obj1, obj2)).toBe(true);
  });

  it("handles circular references", () => {
    const a: any = { foo: 1 };
    const b: any = { foo: 1 };
    a.self = a;
    b.self = b;
    expect(isEqual(a, b)).toBe(true);
  });

  it("returns false for different types", () => {
    expect(isEqual({}, [])).toBe(false);
    expect(isEqual(new Date(), {})).toBe(false);
    expect(isEqual(/abc/, {})).toBe(false);
    expect(isEqual(new Set([1]), [1])).toBe(false);
  });

  it("returns false for objects with same props but different prototypes", () => {
    class A {
      a = 1;
    }
    class B {
      a = 1;
    }
    expect(isEqual(new A(), new B())).toBe(false);
  });
});
