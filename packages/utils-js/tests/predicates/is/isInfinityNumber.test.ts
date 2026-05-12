import { isInfinityNumber } from "@/predicates/is/isInfinityNumber";
import { describe, it, expect } from "vitest";

describe("isInfinityNumber", () => {
  it("returns true for primitive Infinity values", () => {
    expect(isInfinityNumber(Infinity)).toBe(true);
    expect(isInfinityNumber(-Infinity)).toBe(true);
  });

  it("returns true for boxed Number Infinity values", () => {
    expect(isInfinityNumber(new Number(Infinity))).toBe(true);
    expect(isInfinityNumber(new Number(-Infinity))).toBe(true);
  });

  it("returns false for NaN", () => {
    expect(isInfinityNumber(NaN)).toBe(false);
    expect(isInfinityNumber(new Number(NaN))).toBe(false);
  });

  it("returns false for finite numbers", () => {
    expect(isInfinityNumber(123)).toBe(false);
    expect(isInfinityNumber(0)).toBe(false);
    expect(isInfinityNumber(-9999)).toBe(false);
    expect(isInfinityNumber(new Number(42))).toBe(false);
  });

  it("returns false for non-number types", () => {
    expect(isInfinityNumber("Infinity")).toBe(false);
    expect(isInfinityNumber(true)).toBe(false);
    expect(isInfinityNumber(null)).toBe(false);
    expect(isInfinityNumber(undefined)).toBe(false);
    expect(isInfinityNumber({})).toBe(false);
    expect(isInfinityNumber([])).toBe(false);
  });
});
