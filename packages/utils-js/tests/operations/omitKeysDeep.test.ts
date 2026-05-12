import { describe, it, expect } from "vitest";
import { omitKeysDeep } from "@/operations/omitKeysDeep";

describe("omitKeysDeep", () => {
  it("should omit a nested key using dot notation", () => {
    const obj = { a: { b: { c: 1 }, d: 2 }, e: 3 };
    const result = omitKeysDeep(obj, ["a.b.c"]);
    expect(result).toEqual({ a: { d: 2 }, e: 3 });
  });

  it("should omit multiple keys including nested", () => {
    const obj = { a: { b: { c: 1 }, d: 2 }, x: { y: 5 }, z: 6 };
    const result = omitKeysDeep(obj, ["a.b.c", "x.y"]);
    expect(result).toEqual({ a: { d: 2 }, z: 6 });
  });

  it("should omit array index property", () => {
    const obj = { arr: [{ a: 1 }, { b: 2 }] };
    const result = omitKeysDeep(obj, ["arr.0.a"]);
    expect(result).toEqual({ arr: [{ b: 2 }] });
  });

  it("should omit deep keys inside array of objects", () => {
    const obj = { e: [{ f: 4 }, { g: 5 }] };
    const result = omitKeysDeep(obj, ["e.0.f"]);
    expect(result).toEqual({ e: [{ g: 5 }] });
  });

  it("should omit deep keys inside array of objects", () => {
    const obj = {
      e: [{ f: 4 }, { g: 5 }],
      f: [
        { a: 4 },
        { b: 5, c: [{ c0: 4 }, { c1: 5 }], d: [{ d1: 4 }, { d2: 5 }] }
      ]
    };
    const objRes = {
      e: [{ f: 4 }, { g: 5 }],
      f: [{ a: 4 }, { b: 5, c: [{ c0: 4 }, { c1: 5 }], d: [{ d1: 4 }] }]
    };

    const result = omitKeysDeep(obj, ["f.1.d.1.d2"]);
    expect(result).toEqual(objRes);
  });

  it("should not mutate the original object", () => {
    const obj = {
      a: {
        b: { c: 1 }
      },
      d: 2
    };

    const copy = JSON.parse(JSON.stringify(obj));
    omitKeysDeep(obj, ["a.b.c"]);
    expect(obj).toEqual(copy);
  });

  it("should handle removing non-existent keys gracefully", () => {
    const obj = { a: 1, b: 2 };
    // @ts-expect-error Invalid seconds params (non-existent key).
    const result = omitKeysDeep(obj, ["c.d", "x"]);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should handle empty object input", () => {
    // @ts-expect-error Invalid seconds params (non-existent key).
    const result = omitKeysDeep({}, ["a"]);
    expect(result).toEqual({});
  });

  it("should throw TypeError if keysToOmit is not an array", () => {
    // @ts-expect-error Invalid type props for test only
    expect(() => omitKeysDeep({ a: 1 }, "a")).toThrow(TypeError);
    // @ts-expect-error Invalid type props for test only
    expect(() => omitKeysDeep({ a: 1 }, null)).toThrow(TypeError);
    // @ts-expect-error Invalid type props for test only
    expect(() => omitKeysDeep({ a: 1 }, 123)).toThrow(TypeError);
    // @ts-expect-error Invalid type props for test only
    expect(() => omitKeysDeep({ a: 1 }, undefined)).toThrow(TypeError);
  });

  it("should throw error if keysToOmit contains duplicates", () => {
    expect(() => omitKeysDeep({ a: { b: 2 } }, ["a.b", "a.b"])).toThrow(
      // eslint-disable-next-line quotes
      'Function "omitKeysDeep" Error: Duplicate keys detected - `["a.b"]`'
    );
  });

  it("should work with complex nested structures", () => {
    const obj = {
      a: { b: { c: 1, d: 2 } },
      e: [{ f: 3, g: { h: 4 } }],
      i: "string"
    };
    const result = omitKeysDeep(obj, ["a.b.c", "e.0.g.h"]);
    expect(result).toEqual({
      a: { b: { d: 2 } },
      e: [{ f: 3 }],
      i: "string"
    });
  });

  it("should handle array index that does not exist", () => {
    const obj = { arr: [{ a: 1 }] };
    const result = omitKeysDeep(obj, ["arr.10.a"]);
    expect(result).toEqual({ arr: [{ a: 1 }] });
  });

  it("should work with deeply nested arrays", () => {
    const obj = { x: [[{ y: 1 }, { z: 2 }]] };
    const result = omitKeysDeep(obj, ["x.0.1.z"]);
    expect(result).toEqual({ x: [[{ y: 1 }]] });
  });

  it("should remove multiple array keys correctly", () => {
    const obj = {
      list: [
        { a: 1, b: 2 },
        { c: 3, d: 4 }
      ]
    };
    const result = omitKeysDeep(obj, ["list.0.a", "list.1.d"]);
    expect(result).toEqual({ list: [{ b: 2 }, { c: 3 }] });
  });
});

describe("omitKeysDeep - examples from JSDoc", () => {
  it("should omit deep nested property", () => {
    const obj = { a: { b: { c: 1 }, d: 2 }, e: 3 };
    expect(omitKeysDeep(obj, ["a.b.c"])).toEqual({ a: { d: 2 }, e: 3 });
  });

  it("should omit nested property inside array of objects", () => {
    const obj = { a: [{ b: 1 }, { c: 2 }] };
    expect(omitKeysDeep(obj, ["a.0.b"])).toEqual({ a: [{ c: 2 }] });
  });

  it("should remove entire object if array becomes empty", () => {
    const obj = { a: [{ b: 1 }] };
    expect(omitKeysDeep(obj, ["a.0.b"])).toEqual({});
  });

  it("should omit nested property inside deep array structure", () => {
    const obj = { complex: [{ deep: [{ x: 1, y: 2 }] }] };
    expect(omitKeysDeep(obj, ["complex.0.deep.0.x"])).toEqual({
      complex: [{ deep: [{ y: 2 }] }]
    });
  });

  it("should collapse chain if deep array emptied completely", () => {
    const obj = { complex: [{ deep: [{ x: 1 }] }] };
    expect(omitKeysDeep(obj, ["complex.0.deep.0.x"])).toEqual({});
  });

  it("should omit property inside nested double arrays", () => {
    const obj = { data: [[{ foo: 1, bar: 2 }]] };
    expect(omitKeysDeep(obj, ["data.0.0.foo"])).toEqual({
      data: [[{ bar: 2 }]]
    });
  });

  it("should clean up fully nested arrays when emptied", () => {
    const obj = { data: [[{ foo: 1 }]] };
    expect(omitKeysDeep(obj, ["data.0.0.foo"])).toEqual({});
  });

  it("should omit property inside nested array of objects", () => {
    const obj = { x: [{ y: [{ z: 1 }, { w: 2 }] }] };
    expect(omitKeysDeep(obj, ["x.0.y.0.z"])).toEqual({
      x: [{ y: [{ w: 2 }] }]
    });
  });

  it("should remove entire nested array if emptied", () => {
    const obj = { x: [{ y: [{ z: 1 }] }] };
    expect(omitKeysDeep(obj, ["x.0.y.0.z"])).toEqual({});
  });

  it("should omit nested property and clean up empty parent", () => {
    const obj = { p: { q: { r: 5 } }, s: 6 };
    expect(omitKeysDeep(obj, ["p.q.r"])).toEqual({ s: 6 });
  });

  it("should omit shallow property in array of objects", () => {
    const obj = { arr: [{ a: 1, b: 2 }, { c: 3 }] };
    expect(omitKeysDeep(obj, ["arr.0.a"])).toEqual({
      arr: [{ b: 2 }, { c: 3 }]
    });
  });

  it("should clean up nested chain to root when fully emptied", () => {
    const obj = { root: [{ sub: [{ leaf: 10 }] }] };
    expect(omitKeysDeep(obj, ["root.0.sub.0.leaf"])).toEqual({});
  });

  it("should omit shallow property inside nested object", () => {
    const obj = { meta: { tags: ["x", "y"], count: 2 } };
    expect(omitKeysDeep(obj, ["meta.count"])).toEqual({
      meta: { tags: ["x", "y"] }
    });
  });

  it("should omit property inside double nested arrays", () => {
    const obj = { arr: [[{ a: 1 }, { b: 2 }]] };
    expect(omitKeysDeep(obj, ["arr.0.0.a"])).toEqual({
      arr: [[{ b: 2 }]]
    });
  });

  it("should clean up double nested arrays when emptied", () => {
    const obj = { arr: [[{ a: 1 }]] };
    expect(omitKeysDeep(obj, ["arr.0.0.a"])).toEqual({});
  });

  it("should omit property inside nested object array structure", () => {
    const obj = { nested: [{ list: [{ id: 1, val: 2 }] }] };
    expect(omitKeysDeep(obj, ["nested.0.list.0.val"])).toEqual({
      nested: [{ list: [{ id: 1 }] }]
    });
  });

  it("should clean up nested object array completely", () => {
    const obj = { nested: [{ list: [{ id: 1 }] }] };
    expect(omitKeysDeep(obj, ["nested.0.list.0.id"])).toEqual({});
  });

  it("should omit nested property but preserve sibling data", () => {
    const obj = { mixed: { a: [1, 2, 3], b: { c: 4 } } };
    expect(omitKeysDeep(obj, ["mixed.b.c"])).toEqual({
      mixed: { a: [1, 2, 3] }
    });
  });
});
