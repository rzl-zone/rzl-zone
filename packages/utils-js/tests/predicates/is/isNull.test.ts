import { describe, it, expect } from "vitest";
import { isNull } from "@/predicates/is/isNull";

describe("isNull", () => {
  it("should return true for null", () => {
    expect(isNull(null)).toBe(true);
  });

  it("should return false for undefined", () => {
    expect(isNull(undefined)).toBe(false);
  });

  it("should return false for numbers", () => {
    expect(isNull(0)).toBe(false);
    expect(isNull(42)).toBe(false);
    expect(isNull(NaN)).toBe(false);
  });

  it("should return false for strings", () => {
    expect(isNull("")).toBe(false);
    expect(isNull("null")).toBe(false);
  });

  it("should return false for booleans", () => {
    expect(isNull(true)).toBe(false);
    expect(isNull(false)).toBe(false);
  });

  it("should return false for objects and arrays", () => {
    expect(isNull({})).toBe(false);
    expect(isNull([])).toBe(false);
  });

  it("should return false for functions", () => {
    expect(isNull(() => {})).toBe(false);
  });
});
