/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

describe("isNonEmptyString", () => {
  it("should return true for a non-empty string", () => {
    expect(isNonEmptyString("hello")).toBe(true);
    expect(isNonEmptyString("   world  ")).toBe(true);
  });

  it("should return false for an empty string", () => {
    expect(isNonEmptyString("")).toBe(false);
  });

  it("should return false for whitespace only when trim = true", () => {
    expect(isNonEmptyString("   ", { trim: true })).toBe(false);
  });

  it("should return true for whitespace only when trim = false", () => {
    expect(isNonEmptyString("   ", { trim: false })).toBe(true);
  });

  it("should return false for non-string values", () => {
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(undefined)).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
    expect(isNonEmptyString({})).toBe(false);
    expect(isNonEmptyString([])).toBe(false);
  });

  it("should default to trim = true if options is not provided", () => {
    expect(isNonEmptyString("   ")).toBe(false);
    expect(isNonEmptyString(" a ")).toBe(true);
  });

  it("should handle invalid options object to throw error type", () => {
    expect(() => isNonEmptyString("x", null as any)).toThrow(TypeError);
    expect(() => isNonEmptyString("  ", 123 as any)).toThrow(TypeError);
  });
});
