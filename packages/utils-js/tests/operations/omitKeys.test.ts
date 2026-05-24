import { describe, it, expect } from "vitest";
import { omitKeys } from "@/operations/omitKeys";
import { createMessage } from "@/_private/logger";

describe("omitKeys", () => {
  it("should omit a single key", () => {
    const result = omitKeys({ a: 1, b: 2 }, ["a"]);
    expect(result).toEqual({ b: 2 });
  });

  it("should omit multiple keys", () => {
    const result = omitKeys({ a: 1, b: 2, c: 3 }, ["b", "c"]);
    expect(result).toEqual({ a: 1 });
  });

  it("should return empty object if all keys are omitted", () => {
    const result = omitKeys({ x: 10 }, ["x"]);
    expect(result).toEqual({});
  });

  it("should handle omitting non-existent keys gracefully", () => {
    const obj = { a: 1, b: 2 };
    // @ts-expect-error Invalid seconds params (non-existent key).
    const result = omitKeys(obj, ["c"]);
    expect(result).toEqual(obj);
  });

  it("should throw error if duplicate keys in keysToOmit", () => {
    expect(() => omitKeys({ a: 1, b: 2 }, ["a", "a"])).toThrow(
      createMessage("omitKeys", "Duplicate keys detected - `a`")
    );
  });

  it("should handle empty keysToOmit array (no changes)", () => {
    const obj = { x: 5, y: 6 };
    expect(omitKeys(obj, [])).toEqual(obj);
  });

  it("should not mutate original object", () => {
    const obj = { a: 1, b: 2 };
    const copy = { ...obj };
    omitKeys(obj, ["a"]);
    expect(obj).toEqual(copy);
  });

  it("should throw TypeError if keysToOmit is not array type", () => {
    // @ts-expect-error - passing string instead of string[]
    expect(() => omitKeys({ a: 1 }, "a")).toThrow(TypeError);

    // @ts-expect-error - passing null instead of string[]
    expect(() => omitKeys({ a: 1 }, null)).toThrow(TypeError);

    // @ts-expect-error - passing number instead of string[]
    expect(() => omitKeys({ a: 1 }, 123)).toThrow(TypeError);

    // @ts-expect-error - passing undefined instead of string[]
    expect(() => omitKeys({ a: 1 }, undefined)).toThrow(TypeError);
  });

  it("should work with various value types in the object", () => {
    const obj = {
      num: 42,
      str: "hello",
      arr: [1, 2, 3],
      nested: { x: 1 }
    };
    const result = omitKeys(obj, ["arr", "nested"]);
    expect(result).toEqual({
      num: 42,
      str: "hello"
    });
  });

  it("should work with duplicate values across keys (different keys, same value)", () => {
    const obj = { a: 1, b: 1, c: 2 };
    const result = omitKeys(obj, ["a", "b"]);
    expect(result).toEqual({ c: 2 });
  });

  it("should handle empty object input", () => {
    // @ts-expect-error Invalid seconds params (non-existent key).
    const result = omitKeys({}, ["a"]);
    expect(result).toEqual({});
  });

  it("should handle objects with undefined and null values", () => {
    const obj = { a: undefined, b: null, c: 3 };
    const result = omitKeys(obj, ["a"]);
    expect(result).toEqual({ b: null, c: 3 });
  });

  it("should omit keys with value as another object", () => {
    const obj = { a: { nested: true }, b: 2 };
    const result = omitKeys(obj, ["a"]);
    expect(result).toEqual({ b: 2 });
  });

  it("should omit keys with array values", () => {
    const obj = { a: [1, 2, 3], b: "hello" };
    const result = omitKeys(obj, ["a"]);
    expect(result).toEqual({ b: "hello" });
  });

  it("should return original object if keysToOmit contains only non-existent keys", () => {
    const obj = { a: 1, b: 2 };
    // @ts-expect-error Invalid seconds params (non-existent key).
    const result = omitKeys(obj, ["x", "y"]);
    expect(result).toEqual(obj);
  });

  it("should work with deeply nested object structure but only omit top-level keys", () => {
    const obj = {
      a: {
        b: {
          c: 1
        }
      },
      x: 10
    };
    const result = omitKeys(obj, ["a"]);
    expect(result).toEqual({ x: 10 });
  });

  it("should work with Date values", () => {
    const date = new Date();
    const obj = { createdAt: date, name: "test" };
    const result = omitKeys(obj, ["createdAt"]);
    expect(result).toEqual({ name: "test" });
  });

  it("should not omit anything if keysToOmit is an empty array and object has many properties", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omitKeys(obj, []);
    expect(result).toEqual(obj);
  });
});
