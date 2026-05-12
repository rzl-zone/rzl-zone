import { describe, it, expect } from "vitest";
import { toStringDeepForce } from "@/conversions/values/toStringDeepForce";

describe("toStringDeepForce", () => {
  it("should convert string and number to string with 'stringOrNumber'", () => {
    expect(toStringDeepForce(42, "stringOrNumber")).toBe("42");
    expect(toStringDeepForce("hello", "stringOrNumber")).toBe("hello");
    expect(toStringDeepForce(true, "stringOrNumber")).toBe(true);

    const numberObj = new Number(123);
    const stringObj = new String(123);
    const booleanObj = new Boolean(123);

    expect(toStringDeepForce(numberObj, "stringOrNumber")).toBeInstanceOf(
      Number
    );
    expect(toStringDeepForce(stringObj, "stringOrNumber")).toBeInstanceOf(
      String
    );
    expect(toStringDeepForce(booleanObj, "stringOrNumber")).toBeInstanceOf(
      Boolean
    );
  });

  it("should convert all primitives to string with 'primitives'", () => {
    const numberObj = new Number(123);
    const stringObj = new String(123);
    const booleanObj = new Boolean(123);

    expect(toStringDeepForce(numberObj, "primitives")).toBeInstanceOf(Number);
    expect(toStringDeepForce(stringObj, "primitives")).toBeInstanceOf(String);
    expect(toStringDeepForce(booleanObj, "primitives")).toBeInstanceOf(Boolean);

    expect(toStringDeepForce(42, "primitives")).toBe("42");
    expect(toStringDeepForce("hello", "primitives")).toBe("hello");
    expect(toStringDeepForce(true, "primitives")).toBe("true");
    expect(toStringDeepForce(undefined, "primitives")).toBe("undefined");
    expect(toStringDeepForce(BigInt(10), "primitives")).toBe("10");
    expect(toStringDeepForce(NaN, "primitives")).toBe("NaN");
  });

  it("should convert everything to string with 'all'", () => {
    const sym = Symbol("x");
    const fn = () => 1;
    const date = new Date("2025-01-01");
    const regex = /abc/;
    const map = new Map();
    const set = new Set();
    const err = new Error("err");
    const promise = Promise.resolve(1);

    const numberObj = new Number(123);
    const stringObj = new String(123);
    const booleanObj = new Boolean(123);

    expect(toStringDeepForce(numberObj, "all")).toBe("123");
    expect(toStringDeepForce(stringObj, "all")).toBe("123");
    expect(toStringDeepForce(booleanObj, "all")).toBe("true");

    expect(toStringDeepForce(sym, "all")).toBe("Symbol(x)");
    expect(toStringDeepForce(fn, "all")).toContain("=> 1");
    expect(toStringDeepForce(date, "all")).toBe(date.toISOString());
    expect(toStringDeepForce(regex, "all")).toBe("/abc/");
    expect(toStringDeepForce(map, "all")).toStrictEqual([]);
    expect(toStringDeepForce(set, "all")).toStrictEqual([]);
    expect(toStringDeepForce(err, "all")).toBe("Error: err");
    expect(toStringDeepForce(promise, "all")).toBe("[object Promise]");
  });

  it("should deeply convert objects and arrays", () => {
    const input = { a: 1, b: [true, { c: NaN }] };
    const output = toStringDeepForce(input, "primitives");
    expect(output).toEqual({ a: "1", b: ["true", { c: "NaN" }] });

    const all = toStringDeepForce(input, "all");
    expect(all).toEqual({ a: "1", b: ["true", { c: "NaN" }] });
  });

  it("should not convert anything if forceToString is false", () => {
    const sym = Symbol("x");
    const fn = () => 1;
    const date = new Date("2025-01-01");
    const regex = /abc/;

    const numberObj = new Number(123);
    const stringObj = new String(123);
    const booleanObj = new Boolean(123);

    expect(toStringDeepForce(numberObj, false)).toBeInstanceOf(Number);
    expect(toStringDeepForce(stringObj, false)).toBeInstanceOf(String);
    expect(toStringDeepForce(booleanObj, false)).toBeInstanceOf(Boolean);

    expect(toStringDeepForce(42, false)).toBe(42);
    expect(toStringDeepForce("hello", false)).toBe("hello");
    expect(toStringDeepForce(true, false)).toBe(true);
    expect(toStringDeepForce(undefined, false)).toBeUndefined();
    expect(toStringDeepForce(NaN, false)).toBeNaN();
    expect(toStringDeepForce(sym, false)).toBe(sym);
    expect(toStringDeepForce(fn, false)).toBe(fn);
    expect(toStringDeepForce(date, false)).toBe(date);
    expect(toStringDeepForce(regex, false)).toBe(regex);
  });

  it("should handle nested complex structures with 'all'", () => {
    const complex = {
      x: [1, { y: new Date("2025-01-01"), z: Symbol("z") }],
      w: () => "hi"
    };
    const result = toStringDeepForce(complex, "all");
    expect(result).toEqual({
      x: ["1", { y: "2025-01-01T00:00:00.000Z", z: "Symbol(z)" }],
      w: expect.stringContaining("=>")
    });
  });
});
