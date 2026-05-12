/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { describe, expect, it } from "vitest";

describe("isPlainObject", () => {
  it("returns true for plain object literals", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
  });

  it("returns true for objects created with Object.create(null)", () => {
    const obj = Object.create(null);
    obj.a = 1;
    expect(isPlainObject(obj)).toBe(true);
  });

  it("returns false for arrays", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it("returns false for functions", () => {
    expect(isPlainObject(function () {})).toBe(false);
    expect(isPlainObject(() => {})).toBe(false);
  });

  it("returns false for class instances", () => {
    class MyClass {
      a = 1;
    }
    expect(isPlainObject(new MyClass())).toBe(false);
  });

  it("returns false for constructed objects", () => {
    function Foo(this: any) {
      this.a = 1;
    }
    expect(isPlainObject(new (Foo as any)())).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("returns false for primitive types", () => {
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(Symbol("sym"))).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });

  it("returns false for built-in objects", () => {
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new RegExp("abc"))).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
    expect(isPlainObject(new Set())).toBe(false);
  });

  it("returns false for object with custom prototype", () => {
    const proto = { foo: 1 };
    const obj = Object.create(proto);
    obj.bar = 2;
    expect(isPlainObject(obj)).toBe(false);
  });
});
