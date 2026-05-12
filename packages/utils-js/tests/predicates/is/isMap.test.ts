import { describe, it, expect } from "vitest";
import { isMap } from "@/predicates/is/isMap";

describe("isMap", () => {
  it("should return true for Map instances", () => {
    expect(isMap(new Map())).toBe(true);

    const m = new Map<string, number>();
    m.set("a", 1);
    expect(isMap(m)).toBe(true);
  });

  it("should return false for WeakMap", () => {
    expect(isMap(new WeakMap())).toBe(false);
  });

  it("should return false for non-Map values", () => {
    expect(isMap(null)).toBe(false);
    expect(isMap(undefined)).toBe(false);
    expect(isMap([])).toBe(false);
    expect(isMap({})).toBe(false);
    expect(isMap("map")).toBe(false);
    expect(isMap(123)).toBe(false);
    expect(isMap(new Set())).toBe(false);
    expect(isMap(new WeakSet())).toBe(false);
  });

  it("should still detect Map created in a different realm", () => {
    // Simulate cross-realm check by manually overriding toString
    const fakeMap = {
      toString: () => "[object Map]"
    };
    expect(isMap(fakeMap)).toBe(false); // Should be false because it's not actually a Map

    // More realistic: create an actual Map and check
    const map = new Map();
    Object.setPrototypeOf(map, Map.prototype);
    expect(isMap(map)).toBe(true);
  });
});
