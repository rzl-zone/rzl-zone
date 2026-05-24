import { describe, it, expect } from "vitest";
import { isEmptyString } from "@/predicates/is/isEmptyString";

describe("isEmptyString", () => {
  it("should return true for undefined or null", () => {
    expect(isEmptyString(undefined)).toBe(true);
    expect(isEmptyString(null as unknown as string)).toBe(true);
  });

  it("should return true for empty string", () => {
    expect(isEmptyString("")).toBe(true);
  });

  it("should return true for string with only spaces when trim is enabled", () => {
    expect(isEmptyString("   ")).toBe(true);
  });

  it("should return false for string with only spaces when trim is disabled", () => {
    expect(isEmptyString("   ", { trim: false })).toBe(false);
  });

  it("should return false for non-empty string", () => {
    expect(isEmptyString("hello")).toBe(false);
    expect(isEmptyString(" hello ")).toBe(false); // trims to "hello"
  });

  it("should return false for non-empty string when trim is false", () => {
    expect(isEmptyString(" hello ", { trim: false })).toBe(false); // not trimmed
  });

  it("should return true for non-string values like number, array, object", () => {
    expect(isEmptyString({} as unknown as string)).toBe(true);
    expect(isEmptyString([] as unknown as string)).toBe(true);
    expect(isEmptyString(123 as unknown as string)).toBe(true);
  });

  // it("should handle invalid options except undefined input to throw", () => {
  //   expect(isEmptyString("   ", undefined as any)).toBe(true); // fallback to trim: true
  //   expect(() => isEmptyString("   ", 123 as any)).toThrow(TypeError);
  //   expect(() => isEmptyString("   ", null as any)).toThrow(TypeError);
  // });
});
