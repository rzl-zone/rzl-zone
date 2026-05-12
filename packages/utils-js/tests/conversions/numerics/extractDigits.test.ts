import { describe, it, expect } from "vitest";
import { extractDigits } from "@/conversions/numerics/extractDigits";

describe("extractDigits", () => {
  it("should remove all non-numeric characters from string input", () => {
    expect(extractDigits("123abc456")).toBe(123456);
    expect(extractDigits("$1,234.56")).toBe(123456);
    expect(extractDigits("9A8B7C6")).toBe(9876);
    expect(extractDigits("  00012ab34  ")).toBe(1234);
  });

  it("should handle number input by returning the number itself", () => {
    expect(extractDigits(12345)).toBe(12345);
    expect(extractDigits(0)).toBe(0);
    expect(extractDigits(9876543210)).toBe(9876543210);
  });

  it("should return 0 for null or undefined", () => {
    expect(extractDigits(null)).toBe(0);
    expect(extractDigits(undefined)).toBe(0);
  });

  it("should return 0 for empty strings or strings with only non-digits", () => {
    expect(extractDigits("")).toBe(0);
    expect(extractDigits("    ")).toBe(0);
    expect(extractDigits("abcxyz!@#")).toBe(0);
    expect(extractDigits("$%^&*()")).toBe(0);
  });

  it("should correctly process strings with leading zeros", () => {
    expect(extractDigits("000123")).toBe(123);
    expect(extractDigits("00a0b0c0")).toBe(0);
  });

  it("should trim whitespace properly", () => {
    expect(extractDigits("   12 34  ")).toBe(1234);
  });

  it("should handle extremely large strings of digits", () => {
    const longDigits = "1".repeat(1000); // 1000 times '1'
    expect(extractDigits(longDigits)).toBe(Number(longDigits));
  });

  it("should fallback to 0 if after cleaning it becomes empty", () => {
    expect(extractDigits("abc")).toBe(0);
    expect(extractDigits("$$$")).toBe(0);
  });
});
