import { describe, it, expect } from "vitest";
import { isInteger } from "@/predicates/is/isInteger";

describe("isInteger", () => {
  it("returns true for integer numbers", () => {
    expect(isInteger(0)).toBe(true);
    expect(isInteger(1)).toBe(true);
    expect(isInteger(-100)).toBe(true);
    expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(isInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
  });

  it("returns false for non-integer numbers", () => {
    expect(isInteger(1.1)).toBe(false);
    expect(isInteger(-0.5)).toBe(false);
    expect(isInteger(Math.PI)).toBe(false);
    expect(isInteger(Number.MIN_VALUE)).toBe(false); // very small, not integer
  });

  it("returns false for special numeric values", () => {
    expect(isInteger(Infinity)).toBe(false);
    expect(isInteger(-Infinity)).toBe(false);
    expect(isInteger(NaN)).toBe(false);
  });

  it("returns false for non-number types", () => {
    expect(isInteger("3")).toBe(false);
    expect(isInteger(true)).toBe(false);
    expect(isInteger(null)).toBe(false);
    expect(isInteger(undefined)).toBe(false);
    expect(isInteger([])).toBe(false);
    expect(isInteger({})).toBe(false);
    expect(isInteger(() => {})).toBe(false);
    expect(isInteger(Symbol("x"))).toBe(false);
  });

  it("returns false for missing argument", () => {
    // @ts-expect-error unset value for tests
    expect(isInteger()).toBe(false);
  });
});
