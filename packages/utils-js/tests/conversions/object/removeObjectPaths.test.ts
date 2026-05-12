import { describe, it, expect } from "vitest";
import { removeObjectPaths } from "@/conversions/object/removeObjectPaths";

describe("removeObjectPaths - extreme variations and edge cases", () => {
  it("handles deeply nested structures across many levels", () => {
    const obj = {
      a: { b: { c: { d: { e: { f: { g: 100, h: 200 } } } } } }
    };
    const result = removeObjectPaths(obj, [{ key: "a.b.c.d.e.f.g" }]);
    expect(result).toEqual({
      a: { b: { c: { d: { e: { f: { h: 200 } } } } } }
    });
  });

  it("handles array of array of objects", () => {
    const obj = {
      matrix: [
        [
          { value: 1, remove: true },
          { value: 2, remove: true }
        ],
        [{ value: 3, remove: true }]
      ]
    };
    const result = removeObjectPaths(obj, [
      { key: "matrix.remove", deep: true }
    ]);
    expect(result).toEqual({
      matrix: [[{ value: 1 }, { value: 2 }], [{ value: 3 }]]
    });

    const obj2 = {
      items: [
        {
          data: {
            sensitive: "one",
            keep: true
          }
        },
        {
          data: {
            sensitive: "two",
            keep: true
          }
        },
        {
          other: {
            sensitive: "other"
          }
        }
      ]
    };

    // Removes all "items.sensitive" occurrences inside items[]
    const result2 = removeObjectPaths(obj2, [
      { key: "items.data.sensitive", deep: true }
    ]);
    expect(result2).toEqual({
      items: [
        { data: { keep: true } },
        { data: { keep: true } },
        { other: { sensitive: "other" } }
      ]
    });
  });

  it("does not break when given empty keys array", () => {
    const obj = { x: 1, y: 2 };
    const result = removeObjectPaths(obj, []);
    expect(result).toEqual({ x: 1, y: 2 });
  });

  it("handles deleting key that is an array itself", () => {
    const obj = {
      users: [
        { id: 1, name: "A" },
        { id: 2, name: "B" }
      ],
      meta: "info"
    };
    const result = removeObjectPaths(obj, [{ key: "users" }]);
    expect(result).toEqual({ meta: "info" });
  });

  it("does nothing if array is empty inside object", () => {
    const obj = {
      logs: [],
      status: "ok"
    };
    const result = removeObjectPaths(obj, [
      // @ts-expect-error trying nonExistsKey
      { key: "logs.entries", deep: true }
    ]);
    expect(result).toEqual({ logs: [], status: "ok" });
  });

  it("works with multiple unrelated nested keys", () => {
    const obj = {
      a: { val: 1, keep: true },
      b: { x: 2, del: 100 },
      c: { nested: { remove: "bye" }, stay: "ok" }
    };
    const result = removeObjectPaths(obj, [
      { key: "b.del", deep: true },
      { key: "c.nested.remove", deep: true }
    ]);
    expect(result).toEqual({
      a: { val: 1, keep: true },
      b: { x: 2 },
      c: { nested: {}, stay: "ok" }
    });
  });

  it("handles shallow delete where key is root level property", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = removeObjectPaths(obj, [{ key: "b" }]);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("handles multiple deep deletes across different branches", () => {
    const obj = {
      left: {
        data: { sensitive: "secret", id: 1 }
      },
      right: {
        data: { debug: true, keep: "yes" }
      }
    };
    const result = removeObjectPaths(obj, [
      { key: "left.data.sensitive" },
      { key: "right.data.debug" }
    ]);
    expect(result).toEqual({
      left: { data: { id: 1 } },
      right: { data: { keep: "yes" } }
    });
  });

  it("handles deepClone=false by mutating original object", () => {
    const obj = { a: { b: { c: 1, d: 2 } } };
    const result = removeObjectPaths(
      obj,
      [{ key: "a.b.d", deep: true }],
      false
    );
    expect(result).toBe(obj);
    expect(obj).toEqual({ a: { b: { c: 1 } } });
  });

  it("handles deepClone=true by not mutating original object", () => {
    const obj = { a: { b: { c: 1, d: 2 } } };
    const result = removeObjectPaths(obj, [{ key: "a.b.d", deep: true }]);
    expect(result).not.toBe(obj);
    expect(obj).toEqual({ a: { b: { c: 1, d: 2 } } });
    expect(result).toEqual({ a: { b: { c: 1 } } });
  });

  it("safe with completely empty object and no keys", () => {
    const result = removeObjectPaths({}, []);
    expect(result).toEqual({});
  });

  it("safe with completely empty object and some keys", () => {
    // @ts-expect-error Invalid type for test only
    const result = removeObjectPaths({}, [{ key: "whatever" }]);
    expect(result).toEqual({});
  });

  it("handles deleting nested deeply repeated structures", () => {
    const obj = {
      systems: [
        { id: 1, config: { mode: "auto", temp: 30 } },
        { id: 2, config: { mode: "manual", temp: 40 } }
      ]
    };
    const result = removeObjectPaths(obj, [
      { key: "systems.config.temp", deep: true }
    ]);
    expect(result).toEqual({
      systems: [
        { id: 1, config: { mode: "auto" } },
        { id: 2, config: { mode: "manual" } }
      ]
    });
  });
});
