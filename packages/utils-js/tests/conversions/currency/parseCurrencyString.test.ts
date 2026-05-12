import { describe, it, expect } from "vitest";
import { formatNumber } from "@/formatters/numbers/formatNumber";
import { parseCurrencyString } from "@/conversions/currency/parsing";

describe("parseCurrencyString - quirky realistic edge cases ++", () => {
  it("handles emoji money and text noise", () => {
    expect(parseCurrencyString("💰1.234,56 dollars")).toBeCloseTo(1234.56);
  });

  it("handles currency in middle of digits", () => {
    expect(parseCurrencyString("1Rp234,56")).toBeCloseTo(1234.56);
  });

  it("handles long mixed decimal with trailing currency", () => {
    expect(parseCurrencyString("1,123,234.571 Rp")).toBeCloseTo(1123234.571);
    expect(parseCurrencyString("1,123,234.12 Rp")).toBeCloseTo(1123234.12);
    expect(parseCurrencyString("1,123,234.1234 Rp")).toBeCloseTo(1123234.1234);
    expect(parseCurrencyString("1,123,234.12345 Rp")).toBeCloseTo(
      1123234.12345
    );
    expect(parseCurrencyString("1,123,234.19191919 Rp")).toBeCloseTo(
      1123234.19191919
    );
  });

  it("handles leading emoji, spaces, newlines and euro symbol at end", () => {
    expect(parseCurrencyString("  \n💸 1.234,56 €\t")).toBeCloseTo(1234.56);
  });

  it("handles repeated currency symbols front and back", () => {
    expect(parseCurrencyString("USD $1.234,56 EUR")).toBeCloseTo(1234.56);
  });

  it("handles multiple brackets nested weird", () => {
    expect(parseCurrencyString("((-1.234,56))")).toBeCloseTo(-1234.56);
  });

  it("handles mixed thousands separators with emoji in between", () => {
    expect(parseCurrencyString("1.2,3'4💵5 6\u00A07,89")).toBeCloseTo(
      1.23456789
    );
  });

  it("handles space heavy with symbols sprinkled", () => {
    expect(parseCurrencyString("   $   1 2 3 4,5 6   €")).toBeCloseTo(1234.56);
  });

  it("handles decimals without leading zero", () => {
    expect(parseCurrencyString(".56")).toBeCloseTo(0.56);
    expect(parseCurrencyString(",56")).toBeCloseTo(0.56);
  });

  it("handles only symbols and spaces with digits at end", () => {
    expect(parseCurrencyString("$$$,,,'''   123")).toBeCloseTo(123);
    expect(parseCurrencyString("!!!@@##   1.2.3,4")).toBeCloseTo(123.4);
  });

  it("handles bracket with negative and currency inside", () => {
    expect(parseCurrencyString("(€-1.234,56)")).toBeCloseTo(-1234.56);
  });

  it("handles extremely long numbers with multiple separators", () => {
    const input = "1,234,567,890,123,456,789.987654321";
    // eslint-disable-next-line no-loss-of-precision
    const expected = 1234567890123456789.987654321;
    expect(parseCurrencyString(input)).toBeCloseTo(expected, 10);
  });

  it("benchmarks parseCurrencyString vs parseFloat", { timeout: 30000 }, () => {
    const messyInput = "CHF 1'234'567.89";
    const cleanInput = "1234567.89";

    const _tryIn = 100_000;
    let t1 = performance.now();
    for (let i = 0; i < 100_000; i++) {
      parseCurrencyString(messyInput);
    }
    let t2 = performance.now();

    let t3 = performance.now();
    for (let i = 0; i < 100_000; i++) {
      parseFloat(cleanInput);
    }
    let t4 = performance.now();

    let t5 = performance.now();
    for (let i = 0; i < 100_000; i++) {
      formatNumber(cleanInput);
    }
    let t6 = performance.now();

    console.log("formatNumber:", (t6 - t5).toFixed(2), "ms");
    console.log("parseCurrencyString:", (t2 - t1).toFixed(2), "ms");
    console.log("parseFloat:", (t4 - t3).toFixed(2), "ms");
  });
});
