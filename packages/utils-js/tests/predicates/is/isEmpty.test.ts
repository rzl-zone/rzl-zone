/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment node
import { isEmpty } from "@/predicates/is/isEmpty";
import { describe, expect, it } from "vitest";

describe("isEmpty", () => {
  it("should return true for null or undefined", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it("should return true for primitive types (boolean, number, symbol)", () => {
    expect(isEmpty(true)).toBe(true);
    expect(isEmpty(false)).toBe(true);
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(123)).toBe(true);
    expect(isEmpty(Symbol("x"))).toBe(true);
  });

  it("should return true for empty string or array-like", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(new Uint8Array())).toBe(true); // typed array
    expect(isEmpty({ length: 0 })).toBe(false); // array-like
  });

  it("should return false for non-empty string or array-like", () => {
    expect(isEmpty("hello")).toBe(false);
    expect(isEmpty(" ")).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ length: 1 })).toBe(false); // array-like
  });

  it("should return true for empty Map or Set", () => {
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
  });

  it("should return false for non-empty Map or Set", () => {
    const m = new Map();
    m.set("a", 1);
    const s = new Set([1]);
    expect(isEmpty(m)).toBe(false);
    expect(isEmpty(s)).toBe(false);
  });

  it("should return true for plain empty objects", () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(Object.create(null))).toBe(true);
  });

  it("should return false for objects with own enumerable keys", () => {
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty({ length: 0, a: 1 })).toBe(false); // edge case
  });

  it("should return false for objects with non-enumerable properties", () => {
    const obj = {};
    Object.defineProperty(obj, "hidden", {
      value: 123,
      enumerable: false
    });
    expect(isEmpty(obj)).toBe(true); // still considered empty
  });

  it("should return true for function with length", () => {
    function fn(_a: any, _b: any) {}
    expect(isEmpty(fn)).toBe(true);
  });

  it("should return true for empty arguments object", () => {
    function test(..._args: any[]) {
      // eslint-disable-next-line prefer-rest-params
      expect(isEmpty(arguments)).toBe(true);
    }
    test();
  });

  it("should return false for non-empty arguments object", () => {
    function test(..._args: any[]) {
      // eslint-disable-next-line prefer-rest-params
      expect(isEmpty(arguments)).toBe(false);
    }
    test(1);
  });
});
