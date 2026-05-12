import { isObjectLoose } from "@/predicates/is/isObjectLoose";
import { describe, expect, it } from "vitest";

describe("isObjectLoose", () => {
  it("should return true for plain object", () => {
    expect(isObjectLoose({})).toBe(true);
  });

  it("should return true for array", () => {
    expect(isObjectLoose([1, 2, 3])).toBe(true);
  });

  it("should return true for function", () => {
    expect(isObjectLoose(() => {})).toBe(true);
  });

  it("should return true for RegExp", () => {
    expect(isObjectLoose(/abc/)).toBe(true);
  });

  it("should return true for new Number", () => {
    expect(isObjectLoose(new Number(1))).toBe(true);
  });

  it("should return true for new String", () => {
    expect(isObjectLoose(new String("test"))).toBe(true);
  });

  it("should return false for null", () => {
    expect(isObjectLoose(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isObjectLoose(undefined)).toBe(false);
  });

  it("should return false for number literal", () => {
    expect(isObjectLoose(123)).toBe(false);
  });

  it("should return false for string literal", () => {
    expect(isObjectLoose("abc")).toBe(false);
  });

  it("should return false for boolean literal", () => {
    expect(isObjectLoose(true)).toBe(false);
  });

  it("should return false for symbol", () => {
    expect(isObjectLoose(Symbol("sym"))).toBe(false);
  });

  it("should return false for bigint", () => {
    expect(isObjectLoose(BigInt(100))).toBe(false);
  });
});
