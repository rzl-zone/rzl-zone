import { isNaN } from "@/predicates/is/isNaN";
import { describe, expect, it } from "vitest";

describe("isNaN", () => {
  it("returns true for NaN primitives", () => {
    expect(isNaN(NaN)).toBe(true);
  });

  it("returns true for Number objects with NaN", () => {
    expect(isNaN(new Number(NaN))).toBe(true);
  });

  it("returns false for other numbers", () => {
    expect(isNaN(123)).toBe(false);
    expect(isNaN(-Infinity)).toBe(false);
    expect(isNaN(0)).toBe(false);
  });

  it("returns false for other types", () => {
    expect(isNaN(undefined)).toBe(false);
    expect(isNaN(null)).toBe(false);
    expect(isNaN("NaN")).toBe(false);
    expect(isNaN([])).toBe(false);
    expect(isNaN({})).toBe(false);
  });

  it("matches lodash behavior", () => {
    expect(isNaN(new Number(NaN))).toBe(true);
    expect(isNaN(new Number("foo"))).toBe(true); // new Number("foo") ➔ NaN
  });
});
