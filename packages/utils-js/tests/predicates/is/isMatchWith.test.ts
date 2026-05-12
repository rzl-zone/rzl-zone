/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { isMatchWith } from "@/predicates/is/isMatchWith";
import type { CustomizerIsMatchWith } from "@/predicates/is/_private/types.isMatchWith";

function isGreeting(value: unknown): boolean {
  return typeof value === "string" && /^h(?:i|ello)$/.test(value);
}

describe("isMatchWith (extended cases)", () => {
  it("should match nested arrays with customizer", () => {
    const object = { a: [1, 2, "hi"] };
    const source = { a: [1, 2, "hello"] };

    const customizer: CustomizerIsMatchWith = (objVal, srcVal) => {
      if (isGreeting(objVal) && isGreeting(srcVal)) return true;
    };

    expect(isMatchWith(object, source, customizer)).toBe(true);
  });

  it("should handle symbol keys", () => {
    const sym = Symbol("key");
    const object = { [sym]: "hello" };
    const source = { [sym]: "hi" };

    const customizer: CustomizerIsMatchWith = (objVal, srcVal) => {
      if (isGreeting(objVal) && isGreeting(srcVal)) return true;
    };

    expect(isMatchWith(object, source, customizer)).toBe(true);
  });

  it("should compare Date values correctly", () => {
    const now = new Date();
    const object = { d: now };
    const source = { d: new Date(now.getTime()) };

    const customizer: CustomizerIsMatchWith = () => undefined;

    expect(isMatchWith(object, source, customizer)).toBe(true);
  });

  it("should compare RegExp values correctly", () => {
    const object = { r: /abc/i };
    const source = { r: /abc/i };

    const customizer: CustomizerIsMatchWith = () => undefined;

    expect(isMatchWith(object, source, customizer)).toBe(true);
  });

  it("should treat different function instances as not equal", () => {
    const object = { fn: () => {} };
    const source = { fn: () => {} };

    const customizer: CustomizerIsMatchWith = () => undefined;

    expect(isMatchWith(object, source, customizer)).toBe(false);
  });

  it("should allow customizer to override function equality", () => {
    const object = { fn: () => {} };
    const source = { fn: () => {} };

    const customizer: CustomizerIsMatchWith = (objVal, srcVal) => {
      if (typeof objVal === "function" && typeof srcVal === "function")
        return true;
    };

    expect(isMatchWith(object, source, customizer)).toBe(true);
  });

  it("should compare Map instances with customizer", () => {
    const object = { map: new Map([["a", 1]]) };
    const source = { map: new Map([["a", 1]]) };

    const customizer: CustomizerIsMatchWith = (objVal, srcVal) => {
      if (objVal instanceof Map && srcVal instanceof Map) {
        return (
          JSON.stringify(Array.from(objVal)) ===
          JSON.stringify(Array.from(srcVal))
        );
      }
    };

    expect(isMatchWith(object, source, customizer)).toBe(true);
  });

  it("should compare Set instances with customizer", () => {
    const object = { set: new Set([1, 2]) };
    const source = { set: new Set([2, 1]) };

    const customizer: CustomizerIsMatchWith = (objVal, srcVal) => {
      if (objVal instanceof Set && srcVal instanceof Set) {
        return [...objVal].sort().toString() === [...srcVal].sort().toString();
      }
    };

    expect(isMatchWith(object, source, customizer)).toBe(true);
  });

  it("should compare null and undefined correctly", () => {
    const object = { a: null };
    const source = { a: undefined };

    const customizer: CustomizerIsMatchWith = () => undefined;

    expect(isMatchWith(object, source, customizer)).toBe(false);
  });

  it("should short-circuit on primitive root value", () => {
    const object = 42;
    const source = 42;

    const customizer: CustomizerIsMatchWith = () => undefined;

    expect(isMatchWith(object as any, source as any, customizer)).toBe(true);
  });
});
