import { describe, it, expect } from "vitest";
import { isCurrencyLike } from "@/predicates/is/isCurrencyLike";

describe("isCurrencyLike", () => {
  it("should return true for European format strings", () => {
    expect(isCurrencyLike("15.000,10")).toBe(true);
  });

  it("should return true for US format strings", () => {
    expect(isCurrencyLike("15,000.10")).toBe(true);
  });

  it("should return true for Swiss format strings", () => {
    expect(isCurrencyLike("15'000.10")).toBe(true);
  });

  it("should return true for French format strings", () => {
    expect(isCurrencyLike("15 000,10")).toBe(true);
  });

  it("should return true for strings with currency symbols", () => {
    expect(isCurrencyLike("Rp 15.000,10")).toBe(true);
    expect(isCurrencyLike("$15,000.10")).toBe(true);
    expect(isCurrencyLike("€15 000,10")).toBe(true);
    expect(isCurrencyLike("£15,000.10")).toBe(true);
  });

  it("should return true for parentheses formatted currency (negative)", () => {
    expect(isCurrencyLike("(15'000.10)")).toBe(true);
  });

  it("should return true for simple numbers", () => {
    expect(isCurrencyLike(15300.95)).toBe(true);
    expect(isCurrencyLike(0)).toBe(true);
  });

  it("should return true for string '0'", () => {
    expect(isCurrencyLike("0")).toBe(true);
  });

  it("should return false for empty strings", () => {
    expect(isCurrencyLike("")).toBe(false);
    expect(isCurrencyLike("   ")).toBe(false);
  });

  it("should return false for non-numeric strings", () => {
    expect(isCurrencyLike("abc")).toBe(false);
    expect(isCurrencyLike("hello world")).toBe(false);
    expect(isCurrencyLike("Rp abc")).toBe(false);
  });

  it("should return false for completely invalid types", () => {
    expect(isCurrencyLike(null)).toBe(false);
    expect(isCurrencyLike(undefined)).toBe(false);
    expect(isCurrencyLike({})).toBe(false);
    expect(isCurrencyLike([])).toBe(false);
    expect(isCurrencyLike(() => 123)).toBe(false);
  });
});
