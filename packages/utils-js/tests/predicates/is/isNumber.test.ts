import { describe, it, expect } from "vitest";
import { isNumber } from "@/predicates/is/isNumber";

describe("isNumber", () => {
  it("should return true for valid numbers", () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(42)).toBe(true);
    expect(isNumber(-10.5)).toBe(true);
    expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it("should return false for NaN (default)", () => {
    expect(isNumber(NaN)).toBe(false);
  });
  it("should return true for NaN (includeNaN)", () => {
    expect(isNumber(NaN, { includeNaN: true })).toBe(true);
  });

  it("should return false for strings", () => {
    expect(isNumber("42")).toBe(false);
    expect(isNumber("")).toBe(false);
  });

  it("should return false for booleans", () => {
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
  });

  it("should return false for null and undefined", () => {
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
  });

  it("should return false for objects and arrays", () => {
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
  });

  it("should return false for functions", () => {
    expect(isNumber(() => {})).toBe(false);
  });
});
