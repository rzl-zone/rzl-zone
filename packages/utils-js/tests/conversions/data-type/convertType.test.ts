import { convertType } from "@/conversions/data-type/convert";
import { describe, it, expect } from "vitest";

describe("convertType", () => {
  it("converts strings to booleans", () => {
    expect(convertType("true")).toBe(true);
    expect(convertType("false")).toBe(false);
    expect(convertType("TRUE")).toBe(true);
    expect(convertType(" FaLsE ")).toBe(false);
    expect(convertType("yes")).toBe(true);
    expect(convertType(" no ")).toBe(false);
  });

  it("converts strings to null or undefined", () => {
    expect(convertType("null")).toBeNull();
    expect(convertType("undefined")).toBeUndefined();
    expect(convertType(" NULL ")).toBeNull();
  });

  it("converts numeric strings to numbers", () => {
    expect(convertType("42")).toBe(42);
    expect(convertType("NaN")).toBe(NaN);
    expect(convertType(" 3.14 ")).toBeCloseTo(3.14);
    expect(convertType(" 3,123.14 ")).toBeCloseTo(3123.14);
    expect(convertType(" 3,567,890.14 ")).toBeCloseTo(3567890.14);
    expect(convertType("-10")).toBe(-10);
    expect(convertType("0")).toBe(0);
  });

  it("returns empty strings after trimming", () => {
    expect(convertType("")).toBe("");
    expect(convertType("   ")).toBe("");
    expect(convertType("  \n\t ")).toBe("");
  });

  it("returns trimmed lowercase strings for other text", () => {
    expect(convertType(" Hello World ")).toBe("Hello World");
    expect(convertType("FOO Bar")).toBe("FOO Bar");
    expect(convertType(" Bar  \n Baz")).toBe("Bar  \n Baz");
  });

  it("returns non-string values unchanged", () => {
    expect(convertType(100)).toBe(100);
    expect(convertType(true)).toBe(true);
    expect(convertType(NaN)).toBe(NaN);
    expect(convertType(null)).toBeNull();
    expect(convertType(undefined)).toBeUndefined();
    const obj = { a: 1 };
    expect(convertType(obj)).toBe(obj);
  });
});
