import { describe, it, expect } from "vitest";
import { isFinite } from "@/predicates/is/isFinite";

describe("isFinite", () => {
  it("returns true for finite numbers", () => {
    expect(isFinite(0)).toBe(true);
    expect(isFinite(42)).toBe(true);
    expect(isFinite(-42)).toBe(true);
    expect(isFinite(Number.MIN_VALUE)).toBe(true);
    expect(isFinite(Number.MAX_VALUE)).toBe(true);
    expect(isFinite(1e100)).toBe(true);
  });

  it("returns false for Infinity and -Infinity", () => {
    expect(isFinite(Infinity)).toBe(false);
    expect(isFinite(-Infinity)).toBe(false);
  });

  it("returns false for NaN", () => {
    expect(isFinite(NaN)).toBe(false);
  });

  it("returns false for non-number types", () => {
    expect(isFinite("123")).toBe(false);
    expect(isFinite(true)).toBe(false);
    expect(isFinite(null)).toBe(false);
    expect(isFinite(undefined)).toBe(false);
    expect(isFinite([])).toBe(false);
    expect(isFinite({})).toBe(false);
    expect(isFinite(() => 1)).toBe(false);
    expect(isFinite(Symbol("sym"))).toBe(false);
  });

  it("returns false for missing argument", () => {
    // @ts-expect-error unset value for tests
    expect(isFinite()).toBe(false);
  });
});
