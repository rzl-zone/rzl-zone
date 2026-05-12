import { isStringObject } from "@/predicates/is/isStringObject";
import { describe, it, expect } from "vitest";

describe("isStringObject", () => {
  it("returns true for String objects", () => {
    expect(isStringObject(new String("abc"))).toBe(true);
    expect(isStringObject(new String(""))).toBe(true);
  });

  it("returns false for primitive strings", () => {
    expect(isStringObject("abc")).toBe(false);
    expect(isStringObject("")).toBe(false);
  });

  it("returns false for other types", () => {
    expect(isStringObject(123)).toBe(false);
    expect(isStringObject(new Number(123))).toBe(false);
    expect(isStringObject(true)).toBe(false);
  });
});
