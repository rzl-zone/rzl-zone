import { describe, it, expect } from "vitest";
import { isLength } from "@/predicates/is/isLength";

describe("isLength", () => {
  it("returns true for valid lengths", () => {
    expect(isLength(0)).toBe(true);
    expect(isLength(1)).toBe(true);
    expect(isLength(4294967295)).toBe(true); // MAX_SAFE_LENGTH (2^32 - 1)
  });

  it("returns false for negative numbers", () => {
    expect(isLength(-1)).toBe(false);
    expect(isLength(-100)).toBe(false);
  });

  it("returns false for non-integer numbers", () => {
    expect(isLength(3.14)).toBe(false);
    expect(isLength(Math.PI)).toBe(false);
  });

  it("returns true for values is same as MAX_SAFE_LENGTH", () => {
    expect(isLength(4294967296)).toBe(true);
    expect(isLength(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it("returns false for Infinity and NaN", () => {
    expect(isLength(Infinity)).toBe(false);
    expect(isLength(NaN)).toBe(false);
  });

  it("returns false for non-number values", () => {
    expect(isLength("3")).toBe(false);
    expect(isLength(null)).toBe(false);
    expect(isLength(undefined)).toBe(false);
    expect(isLength({})).toBe(false);
    expect(isLength([])).toBe(false);
    expect(isLength(() => {})).toBe(false);
  });

  it("returns false for Number.MIN_VALUE (too small)", () => {
    expect(isLength(Number.MIN_VALUE)).toBe(false);
  });
  it("returns false for more than `Number.MAX_SAFE_INTEGER`", () => {
    expect(isLength(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });
});
