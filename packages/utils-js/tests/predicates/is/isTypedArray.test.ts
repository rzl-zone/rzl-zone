import { isTypedArray } from "@/predicates/is/isTypedArray";
import { describe, expect, it } from "vitest";

describe("isTypedArray", () => {
  it("returns true for all typed arrays", () => {
    expect(isTypedArray(new Uint8Array())).toBe(true);
    expect(isTypedArray(new Int16Array())).toBe(true);
    expect(isTypedArray(new Float32Array())).toBe(true);
    expect(isTypedArray(new Uint8ClampedArray())).toBe(true);
    expect(isTypedArray(new BigInt64Array())).toBe(true);
    expect(isTypedArray(new BigUint64Array())).toBe(true);
  });

  it("returns false for non-typed arrays", () => {
    expect(isTypedArray([])).toBe(false);
    expect(isTypedArray({})).toBe(false);
    expect(isTypedArray(Buffer.from("hi"))).toBe(true);
    expect(isTypedArray(null)).toBe(false);
    expect(isTypedArray(undefined)).toBe(false);
    expect(isTypedArray("hello")).toBe(false);
    expect(isTypedArray(123)).toBe(false);
  });
});
