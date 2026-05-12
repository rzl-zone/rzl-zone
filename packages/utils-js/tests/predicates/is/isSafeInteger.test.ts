import { isSafeInteger } from "@/predicates/is/isSafeInteger";
import { describe, expect, it } from "vitest";

describe("isSafeInteger", () => {
  it("returns true for safe integers", () => {
    expect(isSafeInteger(0)).toBe(true);
    expect(isSafeInteger(42)).toBe(true);
    expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
  });

  it("returns false for unsafe integers", () => {
    expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    expect(isSafeInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(false);
  });

  it("returns false for non-integer numbers", () => {
    expect(isSafeInteger(1.1)).toBe(false);
    expect(isSafeInteger(Number.MIN_VALUE)).toBe(false); // Very small float
  });

  it("returns false for Infinity and NaN", () => {
    expect(isSafeInteger(Infinity)).toBe(false);
    expect(isSafeInteger(-Infinity)).toBe(false);
    expect(isSafeInteger(NaN)).toBe(false);
  });

  it("returns false for non-number types", () => {
    expect(isSafeInteger("3")).toBe(false);
    expect(isSafeInteger(true)).toBe(false);
    expect(isSafeInteger(null)).toBe(false);
    expect(isSafeInteger(undefined)).toBe(false);
    expect(isSafeInteger({})).toBe(false);
    expect(isSafeInteger([])).toBe(false);
    expect(isSafeInteger(() => {})).toBe(false);
  });
});
