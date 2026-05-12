import { describe, it, expect } from "vitest";
import { isString } from "@/predicates/is/isString";

describe("isString", () => {
  it("should return true for string literals", () => {
    expect(isString("hello")).toBe(true);
    expect(isString("")).toBe(true);
    expect(isString("template")).toBe(true);
  });

  it("should return false for non-string types", () => {
    expect(isString(123)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(Symbol("s"))).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(() => {})).toBe(false);
  });
});
