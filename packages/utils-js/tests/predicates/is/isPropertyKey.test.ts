import { describe, it, expect } from "vitest";
import { isPropertyKey } from "@/predicates/is/isPropertyKey";

describe("isPropertyKey", () => {
  it("returns true for strings", () => {
    expect(isPropertyKey("foo")).toBe(true);
    expect(isPropertyKey("")).toBe(true);
  });

  it("returns true for numbers", () => {
    expect(isPropertyKey(0)).toBe(true);
    expect(isPropertyKey(123)).toBe(true);
    expect(isPropertyKey(-999)).toBe(true);
    expect(isPropertyKey(NaN)).toBe(true);
  });

  it("returns true for symbols", () => {
    expect(isPropertyKey(Symbol("id"))).toBe(true);
    expect(isPropertyKey(Symbol.iterator)).toBe(true);
  });

  it("returns false for booleans", () => {
    expect(isPropertyKey(true)).toBe(false);
    expect(isPropertyKey(false)).toBe(false);
  });

  it("returns false for null and undefined", () => {
    expect(isPropertyKey(null)).toBe(false);
    expect(isPropertyKey(undefined)).toBe(false);
  });

  it("returns false for objects", () => {
    expect(isPropertyKey({})).toBe(false);
    expect(isPropertyKey([])).toBe(false);
    expect(isPropertyKey(new Date())).toBe(false);
  });

  it("returns false for functions", () => {
    expect(isPropertyKey(() => {})).toBe(false);
    expect(isPropertyKey(function test() {})).toBe(false);
  });
});
