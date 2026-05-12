import { describe, expect, it } from "vitest";
import { isBigInt } from "@/predicates/is/isBigInt";

describe("isBigInt", () => {
  it("should return true for primitive bigint", () => {
    expect(isBigInt(123n)).toBe(true);
    expect(isBigInt(BigInt(456))).toBe(true);
  });

  it("should return false for object-wrapped BigInt", () => {
    expect(isBigInt(Object(123n))).toBe(false);
    expect(isBigInt(new Object(BigInt(789)))).toBe(false);
  });

  it("should return false for non-bigint values", () => {
    expect(isBigInt("123")).toBe(false);
    expect(isBigInt(123)).toBe(false);
    expect(isBigInt(null)).toBe(false);
    expect(isBigInt(undefined)).toBe(false);
    expect(isBigInt(true)).toBe(false);
    expect(isBigInt(Symbol("123"))).toBe(false);
    expect(isBigInt({})).toBe(false);
    expect(isBigInt([])).toBe(false);
  });
});
