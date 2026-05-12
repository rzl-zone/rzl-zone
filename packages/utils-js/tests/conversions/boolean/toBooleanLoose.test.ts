import { describe, it, expect } from "vitest";
import { toBooleanLoose } from "@/conversions/boolean/toBooleanLoose";

describe("toBooleanLoose", () => {
  it("should return false for null and undefined", () => {
    expect(toBooleanLoose(null)).toBe(false);
    expect(toBooleanLoose(undefined)).toBe(false);
  });

  it("should handle strings", () => {
    expect(toBooleanLoose("")).toBe(false);
    expect(toBooleanLoose("   ")).toBe(false);
    expect(toBooleanLoose("hello")).toBe(true);
    expect(toBooleanLoose(" false ")).toBe(true);
  });

  it("should handle booleans", () => {
    expect(toBooleanLoose(true)).toBe(true);
    expect(toBooleanLoose(false)).toBe(false);
  });

  it("should handle numbers", () => {
    expect(toBooleanLoose(0)).toBe(false);
    expect(toBooleanLoose(42)).toBe(true);
    expect(toBooleanLoose(NaN)).toBe(true);
    expect(toBooleanLoose(-1)).toBe(true);
  });

  it("should handle arrays", () => {
    expect(toBooleanLoose([])).toBe(false);
    expect(toBooleanLoose([1, 2, 3])).toBe(true);
  });

  it("should fallback to Boolean coercion for other types", () => {
    expect(toBooleanLoose({})).toBe(true);
    expect(toBooleanLoose({ a: 1 })).toBe(true);
    expect(toBooleanLoose(Symbol("x"))).toBe(true);
    expect(toBooleanLoose(() => {})).toBe(true);
  });
});
