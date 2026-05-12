import { describe, expect, it } from "vitest";
import { isArrayLike } from "@/predicates/is/isArrayLike";

describe("isArrayLike", () => {
  it("should return true for arrays", () => {
    expect(isArrayLike([1, 2, 3])).toBe(true);
    expect(isArrayLike([])).toBe(true);
  });

  it("should return false for strings", () => {
    expect(isArrayLike("abc")).toBe(false);
    expect(isArrayLike("")).toBe(false);
  });

  it("should return true for array-like objects", () => {
    expect(isArrayLike({ 0: "a", 1: "b", length: 2 })).toBe(true);
  });

  it("should return true for DOM collections (simulated)", () => {
    const fakeHTMLCollection = { length: 1, 0: {} };
    expect(isArrayLike(fakeHTMLCollection)).toBe(true);
  });

  it("should return false for functions", () => {
    expect(isArrayLike(function () {})).toBe(false);
    expect(isArrayLike(() => {})).toBe(false);
  });

  it("should return false for null and undefined", () => {
    expect(isArrayLike(null)).toBe(false);
    expect(isArrayLike(undefined)).toBe(false);
  });

  it("should return false for plain objects without length", () => {
    expect(isArrayLike({ a: 1, b: 2 })).toBe(false);
  });

  it("should return false for negative or too large length", () => {
    expect(isArrayLike({ length: -1 })).toBe(false);
    expect(isArrayLike({ length: Number.MAX_SAFE_INTEGER + 1 })).toBe(false);
  });

  it("should return false for fractional length within bounds", () => {
    expect(isArrayLike({ length: 1.5 })).toBe(false); // not-allowed by current logic
  });

  it("should return false for non-number length", () => {
    expect(isArrayLike({ length: "3" })).toBe(false);
    expect(isArrayLike({ length: NaN })).toBe(false);
  });
});
