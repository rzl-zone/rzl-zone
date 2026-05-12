import { describe, it, expect } from "vitest";
import { isNonEmptyValue } from "@/predicates/is/isNonEmptyValue";

describe("isNonEmptyValue", () => {
  it("should return false for null, undefined, false, NaN", () => {
    expect(isNonEmptyValue(null)).toBe(false);
    expect(isNonEmptyValue(undefined)).toBe(false);
    expect(isNonEmptyValue(false)).toBe(false);
    expect(isNonEmptyValue(NaN)).toBe(false);
  });

  it("should return false for empty strings and strings with only whitespace", () => {
    expect(isNonEmptyValue("")).toBe(false);
    expect(isNonEmptyValue("   ")).toBe(false);
    expect(isNonEmptyValue("\n\t")).toBe(false);
  });

  it("should return true for non-empty strings", () => {
    expect(isNonEmptyValue("hello")).toBe(true);
    expect(isNonEmptyValue("  hi  ")).toBe(true);
  });

  it("should return false for empty arrays", () => {
    expect(isNonEmptyValue([])).toBe(false);
  });

  it("should return true for non-empty arrays", () => {
    expect(isNonEmptyValue([1, 2, 3])).toBe(true);
    expect(isNonEmptyValue([""])).toBe(true);
  });

  it("should return false for empty objects", () => {
    expect(isNonEmptyValue({})).toBe(false);
  });

  it("should return true for objects with keys", () => {
    expect(isNonEmptyValue({ a: 1 })).toBe(true);
    expect(isNonEmptyValue({ length: 0 })).toBe(true);
  });

  it("should return false for objects with symbols and without options `checkSymbols` (default:false)", () => {
    const sym = Symbol("x");
    const obj = { [sym]: 123 };
    expect(isNonEmptyValue(obj)).toBe(false);
  });
  it("should return true for objects with symbols and with options `checkSymbols` as true", () => {
    const sym = Symbol("x");
    const obj = { [sym]: 123 };
    expect(isNonEmptyValue(obj, { checkSymbols: true })).toBe(true);
  });

  it("should return true for numbers except 0", () => {
    expect(isNonEmptyValue(0)).toBe(true); // 0 is falsy so true
    expect(isNonEmptyValue(42)).toBe(true);
    expect(isNonEmptyValue(-1)).toBe(true);
  });

  it("should return true for functions", () => {
    expect(isNonEmptyValue(() => {})).toBe(true);
  });
});

describe("isNonEmptyValue test 2", () => {
  it("should return false for empty objects", () => {
    expect(isNonEmptyValue({})).toBe(false);
  });

  it("should return false for empty arrays", () => {
    expect(isNonEmptyValue([])).toBe(false);
  });

  it("should return true for objects with properties", () => {
    expect(isNonEmptyValue({ key: "value" })).toBe(true);
    expect(isNonEmptyValue({ a: 1 })).toBe(true);
  });

  it("should return true for non-empty arrays", () => {
    expect(isNonEmptyValue([1, 2, 3])).toBe(true);
  });

  it("should return false for null and undefined", () => {
    expect(isNonEmptyValue(null)).toBe(false);
    expect(isNonEmptyValue(undefined)).toBe(false);
  });

  it("should return false for empty strings or strings with only spaces", () => {
    expect(isNonEmptyValue("")).toBe(false);
    expect(isNonEmptyValue("   ")).toBe(false);
  });

  it("should return true for non-empty strings", () => {
    expect(isNonEmptyValue("hello")).toBe(true);
    expect(isNonEmptyValue("  text ")).toBe(true);
  });

  it("should return false for NaN", () => {
    expect(isNonEmptyValue(NaN)).toBe(false);
  });

  it("should return false for false", () => {
    expect(isNonEmptyValue(false)).toBe(false);
  });

  it("should return true for 0", () => {
    expect(isNonEmptyValue(0)).toBe(true);
  });

  it("should return true for functions", () => {
    expect(isNonEmptyValue(() => {})).toBe(true);
    expect(isNonEmptyValue(function () {})).toBe(true);
  });

  it("should handle objects with symbol properties and options settings", () => {
    const sym = Symbol("test");
    const objWithSym = { [sym]: 123 };
    expect(isNonEmptyValue(objWithSym)).toBe(false);
    expect(isNonEmptyValue(objWithSym, { checkSymbols: true })).toBe(true);

    const emptySymObj = Object.create(null);
    Object.defineProperty(emptySymObj, Symbol("foo"), {
      enumerable: false,
      value: 42
    });

    expect(isNonEmptyValue(emptySymObj)).toBe(false);
    expect(isNonEmptyValue(emptySymObj, { checkSymbols: true })).toBe(true);
  });
});
