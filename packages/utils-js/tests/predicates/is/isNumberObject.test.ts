import { isNumberObject } from "@/predicates/is/isNumberObject";
import { describe, it, expect } from "vitest";

describe("isNumberObject", () => {
  it("returns true for Number objects", () => {
    expect(isNumberObject(new Number(123))).toBe(true);
    expect(isNumberObject(new Number(NaN))).toBe(true);
    expect(isNumberObject(new Number(Infinity))).toBe(true);
  });

  it("returns false for primitive numbers", () => {
    expect(isNumberObject(123)).toBe(false);
    expect(isNumberObject(NaN)).toBe(false);
    expect(isNumberObject(Infinity)).toBe(false);
  });

  it("returns false for other types", () => {
    expect(isNumberObject("123")).toBe(false);
    expect(isNumberObject(new String("123"))).toBe(false);
    expect(isNumberObject(true)).toBe(false);
  });
});
