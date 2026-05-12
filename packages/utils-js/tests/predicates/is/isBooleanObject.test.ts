import { isBooleanObject } from "@/predicates/is/isBooleanObject";
import { describe, it, expect } from "vitest";

describe("isBooleanObject", () => {
  it("returns true for Boolean objects", () => {
    expect(isBooleanObject(new Boolean(true))).toBe(true);
    expect(isBooleanObject(new Boolean(false))).toBe(true);
  });

  it("returns false for primitive booleans", () => {
    expect(isBooleanObject(true)).toBe(false);
    expect(isBooleanObject(false)).toBe(false);
  });

  it("returns false for other types", () => {
    expect(isBooleanObject(1)).toBe(false);
    expect(isBooleanObject("true")).toBe(false);
    expect(isBooleanObject(new Number(0))).toBe(false);
  });
});
