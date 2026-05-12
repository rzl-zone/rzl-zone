/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { isMatch } from "@/predicates/is/isMatch";

describe("isMatch", () => {
  it("returns true when object matches source", () => {
    const obj = { a: 1, b: 2 };
    expect(isMatch(obj, { b: 2 })).toBe(true);
  });

  it("returns false when object does not match source", () => {
    const obj = { a: 1, b: 2 };
    expect(isMatch(obj, { b: 1 })).toBe(false);
  });

  it("matches deeply nested values", () => {
    const obj = { a: { b: { c: 3 } }, d: 4 };
    expect(isMatch(obj, { a: { b: { c: 3 } } })).toBe(true);
  });

  it("returns false for partial deep mismatch", () => {
    const obj = { a: { b: { c: 3 } } };
    expect(isMatch(obj, { a: { b: { c: 4 } } })).toBe(false);
  });

  it("treats empty source as match", () => {
    const obj = { a: 1 };
    expect(isMatch(obj, {})).toBe(true);
  });

  it("returns false if object is not actually an object", () => {
    expect(isMatch(null as any, { a: 1 })).toBe(false);
    expect(isMatch(undefined as any, { a: 1 })).toBe(false);
  });

  it("handles array-like matching", () => {
    expect(isMatch([1, 2, 3], [1, 2])).toBe(true);
    expect(isMatch({ 0: 1, 1: 2, length: 2 }, { 0: 1 })).toBe(true);
  });

  it("handles symbol keys", () => {
    const sym = Symbol("x");
    const obj = { [sym]: 42 };
    expect(isMatch(obj, { [sym]: 42 })).toBe(true);
    expect(isMatch(obj, { [sym]: 99 })).toBe(false);
  });

  it("handles NaN comparisons", () => {
    expect(isMatch({ a: NaN }, { a: NaN })).toBe(true); // NaN should match NaN
  });

  it("matches -0 and +0 as equal (like lodash)", () => {
    expect(isMatch({ a: -0 }, { a: +0 })).toBe(true);
  });

  it("treats functions as values (not executed)", () => {
    const fn = () => 1;
    expect(isMatch({ a: fn }, { a: fn })).toBe(true);
    expect(isMatch({ a: () => 1 }, { a: fn })).toBe(false);
  });

  it("ignores inherited properties of object", () => {
    const proto = { a: 1 };
    const obj = Object.create(proto);
    obj.b = 2;
    expect(isMatch(obj, { b: 2 })).toBe(true);
    expect(isMatch(obj, { a: 1 })).toBe(true); // because `a` is inherited
  });

  it("matches empty array source against any array", () => {
    expect(isMatch([1, 2, 3], [])).toBe(true);
  });

  it("matches empty object source against any object", () => {
    expect(isMatch({ x: 1, y: 2 }, {})).toBe(true);
  });

  it("performs partial matches on array of objects", () => {
    const arr = [
      { id: 1, name: "A" },
      { id: 2, name: "B" }
    ];
    expect(isMatch(arr, [{ id: 1 }])).toBe(true);
  });

  it("does not match when source contains keys not in target", () => {
    expect(isMatch({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });
});
