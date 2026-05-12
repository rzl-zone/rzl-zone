import { isWeakMap } from "@/predicates/is/isWeakMap";
import { describe, expect, it } from "vitest";

describe("isWeakMap", () => {
  it("should return true for WeakMap", () => {
    expect(isWeakMap(new WeakMap())).toBe(true);
  });

  it("should return false for Map", () => {
    expect(isWeakMap(new Map())).toBe(false);
  });

  it("should return false for plain object", () => {
    expect(isWeakMap({})).toBe(false);
  });

  it("should return false for null", () => {
    expect(isWeakMap(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isWeakMap(undefined)).toBe(false);
  });

  it("should return false for array", () => {
    expect(isWeakMap([])).toBe(false);
  });

  it("should return false for string", () => {
    expect(isWeakMap("weakmap")).toBe(false);
  });

  it("should return false for number", () => {
    expect(isWeakMap(123)).toBe(false);
  });

  it("should return false for boolean", () => {
    expect(isWeakMap(true)).toBe(false);
  });
});
