import { isNative } from "@/predicates/is/isNative";
import { describe, expect, it } from "vitest";

describe("isNative", () => {
  it("should return true for built-in native functions", () => {
    expect(isNative(Array.prototype.push)).toBe(true);
    expect(isNative(Object.prototype.toString)).toBe(true);
    expect(isNative(Number.isNaN)).toBe(true);
    expect(isNative(Math.max)).toBe(true);
  });

  it("should return false for user-defined functions", () => {
    function customFn() {}
    const arrowFn = () => {};

    expect(isNative(customFn)).toBe(false);
    expect(isNative(arrowFn)).toBe(false);
    expect(isNative(function () {})).toBe(false);
  });

  it("should return false for non-function values", () => {
    expect(isNative(null)).toBe(false);
    expect(isNative(undefined)).toBe(false);
    expect(isNative(42)).toBe(false);
    expect(isNative("function")).toBe(false);
    expect(isNative({})).toBe(false);
    expect(isNative([])).toBe(false);
  });

  it("should handle functions wrapped with core-js (mocked)", () => {
    const fakeCoreJsFn = () => {};
    fakeCoreJsFn.toString = () => "function () { [native code] }";

    expect(isNative(fakeCoreJsFn)).toBe(false); // This test demonstrates the limitation
  });

  it("should return false if funcToString throws", () => {
    const badFn = function () {};
    Object.defineProperty(badFn, "toString", {
      get() {
        throw new Error("Access denied");
      }
    });

    expect(isNative(badFn)).toBe(false);
  });
});
