import { isBuffer } from "@/predicates/is/isBuffer";
import { describe, expect, it } from "vitest";

describe("isBuffer", () => {
  it("should return true for Buffer", () => {
    expect(isBuffer(Buffer.from([1, 2, 3]))).toBe(true);
    expect(isBuffer(Buffer.alloc(10))).toBe(true);
    expect(isBuffer(Buffer.allocUnsafe(5))).toBe(true);
  });

  it("should return false for non-Buffer types", () => {
    expect(isBuffer(null)).toBe(false);
    expect(isBuffer(undefined)).toBe(false);
    expect(isBuffer(123)).toBe(false);
    expect(isBuffer("string")).toBe(false);
    expect(isBuffer([1, 2, 3])).toBe(false);
    expect(isBuffer(new Uint8Array(10))).toBe(false);
    expect(isBuffer(new ArrayBuffer(10))).toBe(false);
    expect(isBuffer({})).toBe(false);
  });
});
