/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqualWith } from "@/predicates/is/isEqualWith";
import { describe, it, expect } from "vitest";

describe("isEqualWith", () => {
  it("returns true for deeply equal values without customizer", () => {
    expect(isEqualWith({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] })).toBe(true);
  });

  it("returns false for different values without customizer", () => {
    expect(isEqualWith({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });

  it("uses customizer when provided and respects its return", () => {
    const obj1 = { value: "hello" };
    const obj2 = { value: "hi" };

    const customizer = (a: any, b: any) => {
      const isGreeting = (v: string) => /^h(?:i|ello)$/.test(v);
      if (isGreeting(a) && isGreeting(b)) return true;
    };

    expect(isEqualWith(obj1, obj2, customizer)).toBe(true);
  });

  it("falls back to default comparison if customizer returns undefined", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1 };

    const customizer = () => undefined;

    expect(isEqualWith(obj1, obj2, customizer)).toBe(true);
  });

  it("respects customizer return false", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1 };

    const customizer = () => false;

    expect(isEqualWith(obj1, obj2, customizer)).toBe(false);
  });

  it("works with arrays and index passed to customizer", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 9, 3];

    const indices: any[] = [];

    const customizer = (a: any, b: any, key?: any) => {
      indices.push(key);
      if (key === 1) return true;
    };

    expect(isEqualWith(arr1, arr2, customizer)).toBe(true);
    expect(indices).toContain(1);
  });

  it("supports deeply nested overrides", () => {
    const obj1 = { a: { b: { c: "hello" } } };
    const obj2 = { a: { b: { c: "hi" } } };

    expect(
      isEqualWith(obj1, obj2, (a, b) => {
        if (typeof a === "string" && typeof b === "string") {
          return /^h(?:i|ello)$/.test(a) && /^h(?:i|ello)$/.test(b);
        }
      })
    ).toBe(true);
  });

  it("detects circular references and handles correctly", () => {
    const obj1: any = { name: "foo" };
    const obj2: any = { name: "foo" };
    obj1.self = obj1;
    obj2.self = obj2;

    expect(isEqualWith(obj1, obj2)).toBe(true);
  });

  it("allows customizer to skip only specific keys", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 99 };

    expect(
      isEqualWith(obj1, obj2, (a, b, key) => {
        if (key === "b") return true;
      })
    ).toBe(true);
  });

  it("does not treat objects with different prototypes as equal if customizer not used", () => {
    class A {
      a = 1;
    }
    class B {
      a = 1;
    }

    const a = new A();
    const b = new B();

    expect(isEqualWith(a, b)).toBe(false);
  });

  it("treats equal Date objects as equal", () => {
    const d1 = new Date("2022-01-01");
    const d2 = new Date("2022-01-01");
    expect(isEqualWith(d1, d2)).toBe(true);
  });

  it("treats different RegExp as unequal", () => {
    const r1 = /abc/i;
    const r2 = /abc/g;
    expect(isEqualWith(r1, r2)).toBe(false);
  });

  it("treats equal Set instances as equal", () => {
    const s1 = new Set([1, 2, 3]);
    const s2 = new Set([1, 2, 3]);
    expect(isEqualWith(s1, s2)).toBe(true);
  });

  it("treats different Map instances as unequal", () => {
    const m1 = new Map([["a", 1]]);
    const m2 = new Map([["a", 2]]);
    expect(isEqualWith(m1, m2)).toBe(false);
  });

  it("considers NaN and NaN as equal", () => {
    expect(isEqualWith(NaN, NaN)).toBe(true);
  });

  it("treats undefined and null as different", () => {
    expect(isEqualWith(undefined, null)).toBe(false);
  });

  it("treats identical strings as equal", () => {
    expect(isEqualWith("hello", "hello")).toBe(true);
  });

  it("treats different function references as unequal", () => {
    const f1 = () => {};
    const f2 = () => {};
    expect(isEqualWith(f1, f2)).toBe(false);
  });

  it("handles nested circular structures", () => {
    const a: any = { foo: "bar" };
    const b: any = { foo: "bar" };
    a.self = { inner: a };
    b.self = { inner: b };

    expect(isEqualWith(a, b)).toBe(true);
  });

  it("compares symbol properties", () => {
    const sym = Symbol("x");
    const obj1 = { [sym]: 123 };
    const obj2 = { [sym]: 123 };

    expect(isEqualWith(obj1, obj2)).toBe(true);
  });
});
