import { describe, expect, it } from "vitest";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";

describe("isNonEmptyArray", () => {
  it("should return true for non-empty arrays", () => {
    expect(isNonEmptyArray([1])).toBe(true);
    expect(isNonEmptyArray(["a", "b"])).toBe(true);
    expect(isNonEmptyArray([null])).toBe(true);
  });

  it("should return false for empty arrays", () => {
    expect(isNonEmptyArray([])).toBe(false);
  });

  it("should return false for non-array values", () => {
    expect(isNonEmptyArray(undefined)).toBe(false);
    expect(isNonEmptyArray(null)).toBe(false);
    expect(isNonEmptyArray({})).toBe(false);
    expect(isNonEmptyArray("string")).toBe(false);
    expect(isNonEmptyArray(123)).toBe(false);
    expect(isNonEmptyArray(true)).toBe(false);
  });

  it("should narrow type correctly", () => {
    const data = [1, 2, 3];
    if (isNonEmptyArray(data)) {
      // Within this block, TypeScript knows data is number[]
      const sum = data.reduce((a, b) => a + b, 0);
      expect(sum).toBe(6);
    }
  });
});
