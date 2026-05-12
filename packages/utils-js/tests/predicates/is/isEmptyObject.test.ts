import { describe, it, expect } from "vitest";
import { isEmptyObject } from "@/predicates/is/isEmptyObject";

describe("isEmptyObject", () => {
  it("returns true for empty plain object", () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({}, { checkSymbols: true })).toBe(true);
  });

  it("returns false for object with string keys", () => {
    expect(isEmptyObject({ a: 1 })).toBe(false);
    expect(isEmptyObject({ a: 1 }, { checkSymbols: true })).toBe(false);
  });

  it("returns true for object with only symbol keys if checkSymbols is false", () => {
    const sym = Symbol("foo");
    expect(isEmptyObject({ [sym]: 123 })).toBe(true);
  });

  it("returns false for object with symbol keys if checkSymbols is true", () => {
    const sym = Symbol("foo");
    expect(isEmptyObject({ [sym]: 123 }, { checkSymbols: true })).toBe(false);
  });

  it("returns true for null, arrays, map, set, and non-objects", () => {
    expect(isEmptyObject(null)).toBe(true);
    expect(isEmptyObject([])).toBe(true);
    expect(isEmptyObject(123)).toBe(true);
    expect(isEmptyObject("string")).toBe(true);
    expect(isEmptyObject(new Set([123]))).toBe(true);
    expect(isEmptyObject(new Map().set("theKey", "123"))).toBe(true);
  });
});
