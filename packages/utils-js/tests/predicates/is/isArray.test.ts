import { describe, it, expect } from "vitest";
import { isArray } from "@/predicates/is/isArray";

describe("isArray", () => {
  it("should return true for regular arrays of numbers", () => {
    expect(isArray([1, 2, 3])).toBe(true);
  });

  it("should return true for empty arrays", () => {
    expect(isArray([])).toBe(true);
  });

  it("should return true for arrays of objects", () => {
    expect(isArray([{ a: 1 }, { b: 2 }])).toBe(true);
  });

  it("should return false for strings", () => {
    expect(isArray("hello")).toBe(false);
  });

  it("should return false for plain objects", () => {
    expect(isArray({ key: "value" })).toBe(false);
  });

  it("should return false for null", () => {
    expect(isArray(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isArray(undefined)).toBe(false);
  });

  it("should return false for numbers", () => {
    expect(isArray(123)).toBe(false);
    expect(isArray(NaN)).toBe(false);
  });

  it("should return false for booleans", () => {
    expect(isArray(true)).toBe(false);
    expect(isArray(false)).toBe(false);
  });

  it("should return false for functions", () => {
    expect(
      isArray(function () {
        return "test";
      })
    ).toBe(false);

    expect(isArray(() => "arrow")).toBe(false);
  });
});
