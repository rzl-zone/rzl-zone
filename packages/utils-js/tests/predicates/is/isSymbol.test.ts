import { describe, expect, it } from "vitest";
import { isSymbol } from "@/predicates/is/isSymbol";

describe("isSymbol", () => {
  it("should return true for symbols", () => {
    expect(isSymbol(Symbol())).toBe(true);
    expect(isSymbol(Symbol("test"))).toBe(true);
  });

  it("should return false for non-symbol values", () => {
    expect(isSymbol("test")).toBe(false);
    expect(isSymbol(123)).toBe(false);
    expect(isSymbol({})).toBe(false);
    expect(isSymbol([])).toBe(false);
    expect(isSymbol(null)).toBe(false);
    expect(isSymbol(undefined)).toBe(false);
    expect(isSymbol(true)).toBe(false);
    expect(isSymbol(() => {})).toBe(false);
  });
});
