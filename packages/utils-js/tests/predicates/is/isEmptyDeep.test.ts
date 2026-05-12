import { describe, it, expect } from "vitest";
import { isEmptyDeep } from "@/predicates/is/isEmptyDeep";

describe("isEmptyDeep", () => {
  it("should return true for null, undefined, false, empty string, NaN", () => {
    expect(isEmptyDeep(null)).toBe(true);
    expect(isEmptyDeep(undefined)).toBe(true);
    expect(isEmptyDeep(false)).toBe(true);
    expect(isEmptyDeep("")).toBe(true);
    expect(isEmptyDeep(NaN)).toBe(true);
  });

  it("should return false for non-zero numbers", () => {
    expect(isEmptyDeep(0)).toBe(false);
    expect(isEmptyDeep(42)).toBe(false);
    expect(isEmptyDeep(-5)).toBe(false);
  });

  it("should return true for empty array and empty object", () => {
    expect(isEmptyDeep([])).toBe(true);
    expect(isEmptyDeep({})).toBe(true);
  });

  it("should return false for non-empty arrays and objects", () => {
    expect(isEmptyDeep([1])).toBe(false);
    expect(isEmptyDeep({ a: 1 })).toBe(false);
  });

  it("should handle nested empty structures", () => {
    expect(isEmptyDeep({ a: {}, b: [] })).toBe(true);
    expect(isEmptyDeep([[], {}, [{}, []]])).toBe(true);
  });

  it("should handle nested non-empty structures", () => {
    expect(isEmptyDeep([{ a: {}, b: [0] }])).toBe(false);
    expect(isEmptyDeep({ a: [[], {}, [0]] })).toBe(false);
  });

  it("should return false for non-empty strings", () => {
    expect(isEmptyDeep("hello")).toBe(false);
    expect(isEmptyDeep(" ")).toBe(true); // space is not trimmed to empty
    expect(isEmptyDeep("   ")).toBe(true); // because we trim()
  });

  it("should return false for functions and symbols", () => {
    expect(isEmptyDeep(() => {})).toBe(false);
    expect(isEmptyDeep(Symbol("x"))).toBe(false);
  });
});
