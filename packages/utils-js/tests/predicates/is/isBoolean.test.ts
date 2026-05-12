import { describe, it, expect } from "vitest";
import { isBoolean } from "@/predicates/is/isBoolean";

describe("isBoolean", () => {
  it("should return true for true", () => {
    expect(isBoolean(true)).toBe(true);
  });

  it("should return true for false", () => {
    expect(isBoolean(false)).toBe(true);
  });

  it("should return false for string 'true' and 'false'", () => {
    expect(isBoolean("true")).toBe(false);
    expect(isBoolean("false")).toBe(false);
  });

  it("should return false for numbers", () => {
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean(-1)).toBe(false);
  });

  it("should return false for null and undefined", () => {
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
  });

  it("should return false for objects", () => {
    expect(isBoolean({})).toBe(false);
    expect(isBoolean({ value: true })).toBe(false);
  });

  it("should return false for arrays", () => {
    expect(isBoolean([])).toBe(false);
    expect(isBoolean([true, false])).toBe(false);
  });

  it("should return false for functions", () => {
    expect(
      isBoolean(function () {
        return true;
      })
    ).toBe(false);

    expect(isBoolean(() => false)).toBe(false);
  });

  it("should return false for symbols and BigInt", () => {
    expect(isBoolean(Symbol("test"))).toBe(false);
    expect(isBoolean(BigInt(10))).toBe(false);
  });
});
