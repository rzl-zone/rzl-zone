import { isSet } from "@/predicates/is/isSet";
import { describe, expect, it } from "vitest";

describe("isSet", () => {
  it("returns true for Set instances", () => {
    expect(isSet(new Set())).toBe(true);
    expect(isSet(new Set([1, 2, 3]))).toBe(true);
  });

  it("returns false for non-Set values", () => {
    expect(isSet(new WeakSet())).toBe(false);
    expect(isSet(new Map())).toBe(false);
    expect(isSet([])).toBe(false);
    expect(isSet({})).toBe(false);
    expect(isSet("set")).toBe(false);
    expect(isSet(123)).toBe(false);
    expect(isSet(null)).toBe(false);
    expect(isSet(undefined)).toBe(false);
  });

  it("narrows type correctly", () => {
    const maybeSet: unknown = new Set(["a", "b"]);
    if (isSet(maybeSet)) {
      expect(maybeSet.has("a")).toBe(true); // TS now knows maybeSet is Set<unknown>
    }
  });
});
