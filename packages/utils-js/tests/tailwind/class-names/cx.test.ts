/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { cx } from "@/tailwind/class-names/cx";

describe("cx (TypeScript) - standalone tests", () => {
  it("strings and numbers", () => {
    expect(cx("a", "b", 1, 0, NaN)).toBe("a b 1");
  });

  it("falsy values", () => {
    expect(cx(false, null, undefined, "", 0)).toBe("");
  });

  it("arrays and nested arrays", () => {
    expect(cx(["a", 0, "b"], null, ["c", ["d", false]])).toBe("a b c d");
  });

  it("objects with truthy/falsy values", () => {
    expect(cx({ a: true, b: false, c: 1, d: 0, e: null, f: undefined })).toBe(
      "a c"
    );
  });

  it("nested arrays and objects", () => {
    expect(
      cx(["a", ["b", { c: true, d: false }], { e: 1, f: 0 }, null, undefined])
    ).toBe("a b c e");
  });

  it("inherited object keys", () => {
    const proto = { inherited: true };
    const obj = Object.create(proto);
    obj.own = true;
    expect(cx(obj)).toBe("own inherited");
  });

  it("mixed arguments", () => {
    expect(
      cx("a", ["b", { c: true, d: false }, " "], { e: 1, f: 0 }, null, 2)
    ).toBe("a b c e 2");
  });

  it("no arguments", () => {
    expect(cx()).toBe("");
  });

  it("boxed primitives", () => {
    expect(
      cx(
        new String("foo"),
        new String(""),
        new Number(42),
        new Boolean(true),
        new Boolean(false),
        new Number(0)
      )
    ).toBe("foo 42 true");
  });

  it("NaN and Infinity", () => {
    expect(cx(NaN, Infinity, -Infinity)).toBe("Infinity -Infinity");
  });

  it("empty objects and arrays", () => {
    expect(cx({}, [], [[], [{}], [null, undefined]])).toBe("");
  });

  it("symbol values", () => {
    const sym = Symbol("s");
    // symbols are ignored since toStringValue only supports string/number/bigint
    expect(cx(sym as any, { [sym]: true } as any)).toBe("");
  });

  it("nested falsy and truthy mix", () => {
    expect(
      cx([0, false, ["a", [null, "b", undefined]], { c: true, d: false }])
    ).toBe("a b c");
  });
});
