import { describe, expect, it } from "vitest";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";

describe("isEmptyArray", () => {
  it("should return true for undefined", () => {
    expect(isEmptyArray(undefined)).toBe(true);
  });

  it("should return true for null", () => {
    expect(isEmptyArray(null)).toBe(true);
  });

  it("should return true for non-array values", () => {
    expect(isEmptyArray("")).toBe(true);
    expect(isEmptyArray(123)).toBe(true);
    expect(isEmptyArray({})).toBe(true);
    expect(isEmptyArray(() => [])).toBe(true);
  });

  it("should return true for empty array", () => {
    expect(isEmptyArray([])).toBe(true);
  });

  it("should return false for non-empty array", () => {
    expect(isEmptyArray([1])).toBe(false);
    expect(isEmptyArray([""])).toBe(false);
    expect(isEmptyArray([null])).toBe(false);
    expect(isEmptyArray([undefined])).toBe(false);
  });
});
