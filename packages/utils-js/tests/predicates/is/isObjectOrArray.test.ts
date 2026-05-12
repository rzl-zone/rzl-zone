// tests/isObjectOrArray.test.ts
import { describe, it, expect } from "vitest";
import { expectTypeOf } from "vitest";
import { isObjectOrArray } from "@/predicates/is/isObjectOrArray";

describe("isObjectOrArray", () => {
  it("returns true for plain objects and objects with null prototype", () => {
    expect(isObjectOrArray({})).toBe(true);

    const objNullProto = Object.create(null) as object;
    expect(isObjectOrArray(objNullProto)).toBe(true);
  });

  it("returns true for custom objects and built-ins (Map, typed arrays, Date, RegExp, Error)", () => {
    class Foo {}
    expect(isObjectOrArray(new Foo())).toBe(true);
    expect(isObjectOrArray(new Map())).toBe(true);
    expect(isObjectOrArray(new Set())).toBe(true);
    expect(isObjectOrArray(new Uint8Array())).toBe(true);
    expect(isObjectOrArray(new Date())).toBe(true);
    expect(isObjectOrArray(/abc/)).toBe(true);
    expect(isObjectOrArray(new Error("x"))).toBe(true);
  });

  it("returns true for arrays", () => {
    expect(isObjectOrArray([])).toBe(true);
    expect(isObjectOrArray([1, 2, 3])).toBe(true);
    expect(isObjectOrArray(new Array(3))).toBe(true);
  });

  it("returns false for null/undefined", () => {
    expect(isObjectOrArray(null)).toBe(false);
    expect(isObjectOrArray(undefined)).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(isObjectOrArray("hello")).toBe(false);
    expect(isObjectOrArray(123)).toBe(false);
    expect(isObjectOrArray(true)).toBe(false);
    expect(isObjectOrArray(10n)).toBe(false);
    expect(isObjectOrArray(Symbol("x"))).toBe(false);
  });

  it("returns false for functions", () => {
    // regular function
    expect(isObjectOrArray(function f() {})).toBe(false);
    // arrow
    expect(isObjectOrArray(() => {})).toBe(false);
    // class constructor (typeof function)
    class Bar {}
    expect(isObjectOrArray(Bar)).toBe(false);
  });

  // -------- Type narrowing checks --------

  it("narrows unknown to Record<PropertyKey, unknown> | unknown[]", () => {
    // eslint-disable-next-line no-unassigned-vars
    let value: unknown;

    if (isObjectOrArray(value)) {
      // inside: should be object or array-like object union
      expectTypeOf(value).toExtend<Record<PropertyKey, unknown> | unknown[]>();
    } else {
      // outside: still unknown
      expectTypeOf(value).toEqualTypeOf<unknown>();
    }
  });

  it("narrows union with array correctly", () => {
    let maybeArr: number[] | null = Math.random() > 0.5 ? [1, 2, 3] : null;

    if (isObjectOrArray(maybeArr)) {
      // should become number[]
      expectTypeOf(maybeArr).toEqualTypeOf<number[]>();
      expect(Array.isArray(maybeArr)).toBe(true);
    } else {
      // should be null
      expectTypeOf(maybeArr).toEqualTypeOf<null>();
      expect(maybeArr).toBeNull();
    }
  });

  it("narrows union with object correctly", () => {
    type ObjOrString = { a: number } | string;
    let val: ObjOrString = (
      Math.random() > 0.5 ? { a: 1 } : "x"
    ) as ObjOrString;

    if (isObjectOrArray(val)) {
      // arrays are not part of the original union, so we should get the object branch
      expectTypeOf(val).toEqualTypeOf<{ a: number }>();
      expect("a" in val).toBe(true);
    } else {
      // else branch should be string
      expectTypeOf(val).toEqualTypeOf<string>();
    }
  });

  it("keeps array element type after narrowing", () => {
    const input = (Math.random() > 0.5 ? ["a", "b"] : 42) as string[] | number;

    if (isObjectOrArray(input)) {
      // narrowed to string[] (not just unknown[])
      expectTypeOf(input).toEqualTypeOf<string[]>();
      expect(Array.isArray(input)).toBe(true);
      expect(input.every((s) => typeof s === "string")).toBe(true);
    } else {
      expectTypeOf(input).toEqualTypeOf<number>();
      expect(input).toBeTypeOf("number");
    }
  });

  it("keeps object shape after narrowing", () => {
    const value = (Math.random() > 0.5 ? { id: 1, name: "Alice" } : 0) as
      | { id: number; name: string }
      | number;

    if (isObjectOrArray(value)) {
      // narrowed to the object shape
      expectTypeOf(value).toEqualTypeOf<{ id: number; name: string }>();
      expect((value as { id: number }).id).toBe(1);
    } else {
      expectTypeOf(value).toEqualTypeOf<number>();
    }
  });
});
