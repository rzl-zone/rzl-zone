import { describe, expect, it } from "vitest";
import { isArrayBuffer } from "@/predicates/is/isArrayBuffer";

describe("isArrayBuffer", () => {
  it("should return true for an actual ArrayBuffer", () => {
    expect(isArrayBuffer(new ArrayBuffer(2))).toBe(true);
  });

  it("should return false for arrays", () => {
    expect(isArrayBuffer(new Array(2))).toBe(false);
  });

  it("should return false for plain objects", () => {
    expect(isArrayBuffer({})).toBe(false);
  });

  it("should return false for typed arrays", () => {
    expect(isArrayBuffer(new Uint8Array(2))).toBe(false);
    expect(isArrayBuffer(new Float32Array(2))).toBe(false);
  });

  it("should return false for strings, numbers, null, and undefined", () => {
    expect(isArrayBuffer("buffer")).toBe(false);
    expect(isArrayBuffer(123)).toBe(false);
    expect(isArrayBuffer(null)).toBe(false);
    expect(isArrayBuffer(undefined)).toBe(false);
  });
});
