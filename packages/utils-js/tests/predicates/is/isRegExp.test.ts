// @vitest-environment node
import { describe, it, expect } from "vitest";
import { isRegExp } from "@/predicates/is/isRegExp";

describe("isRegExp", () => {
  it("should return true for RegExp literals", () => {
    expect(isRegExp(/abc/)).toBe(true);
  });

  it("should return true for RegExp objects", () => {
    expect(isRegExp(new RegExp("abc"))).toBe(true);
  });

  it("should return false for strings", () => {
    expect(isRegExp("abc")).toBe(false);
  });

  it("should return false for numbers", () => {
    expect(isRegExp(123)).toBe(false);
  });

  it("should return false for plain objects", () => {
    expect(isRegExp({})).toBe(false);
  });

  it("should return false for null and undefined", () => {
    expect(isRegExp(null)).toBe(false);
    expect(isRegExp(undefined)).toBe(false);
  });

  it("should return false for arrays", () => {
    expect(isRegExp([])).toBe(false);
  });
});
