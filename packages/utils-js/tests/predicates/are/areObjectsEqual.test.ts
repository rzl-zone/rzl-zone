import { describe, it, expect } from "vitest";
import { areObjectsEqual } from "@/predicates/are/areObjectsEqual";

describe("areObjectsEqual", () => {
  it("should return true for equal flat objects", () => {
    expect(areObjectsEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it("should return false for different flat objects", () => {
    expect(areObjectsEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("should return true for deeply equal nested objects", () => {
    expect(
      areObjectsEqual({ a: { b: { c: 3 } } }, { a: { b: { c: 3 } } })
    ).toBe(true);
  });

  it("should return false for differently nested objects", () => {
    expect(areObjectsEqual({ a: { b: 2 } }, { a: { b: 3 } })).toBe(false);
  });

  it("should return true for equal arrays", () => {
    expect(areObjectsEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it("should return false for different arrays", () => {
    expect(areObjectsEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it("should return true for equal primitives", () => {
    expect(areObjectsEqual(42, 42)).toBe(true);
    expect(areObjectsEqual("hello", "hello")).toBe(true);
    expect(areObjectsEqual(true, true)).toBe(true);
  });

  it("should return false for different primitives", () => {
    expect(areObjectsEqual(42, "42")).toBe(false);
    expect(areObjectsEqual(true, false)).toBe(false);
  });

  it("should handle null and undefined correctly", () => {
    expect(areObjectsEqual(null, null)).toBe(true);
    expect(areObjectsEqual(undefined, undefined)).toBe(true);
    expect(areObjectsEqual(null, undefined)).toBe(false);
  });

  it("should handle mixed types correctly", () => {
    expect(areObjectsEqual({ a: 1 }, [1])).toBe(false);
    expect(areObjectsEqual(42, [42])).toBe(false);
  });

  it("should treat objects with undefined property explicitly as different if not present", () => {
    expect(areObjectsEqual({ a: 1, b: undefined }, { a: 1 })).toBe(false);
  });
});
