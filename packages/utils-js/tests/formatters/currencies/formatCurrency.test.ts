import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/formatters/currencies/formatCurrency";

describe("formatCurrency", () => {
  it("formats international style", () => {
    expect(formatCurrency(1234567.89, { decimal: true })).toBe("1.234.567,89");
  });

  it("formats indian style explicitly", () => {
    expect(
      formatCurrency(1234567.89, { decimal: true, indianFormat: true })
    ).toBe("12,34,567.89");
    expect(
      formatCurrency("12.34.567,89", { decimal: true, indianFormat: true })
    ).toBe("12,34,567.89");
  });

  it("formats with negative dash", () => {
    expect(formatCurrency(-1234.56, { decimal: true })).toBe("-1.234,56");
  });

  it("formats with negative brackets", () => {
    expect(
      formatCurrency(-1234.56, { decimal: true, negativeFormat: "brackets" })
    ).toBe("(1.234,56)");
  });

  it("supports suffixCurrency", () => {
    expect(
      formatCurrency(1234.56, { decimal: true, suffixCurrency: "Rp " })
    ).toBe("Rp 1.234,56");
  });
  it("decimal tester", () => {
    expect(
      formatCurrency("-1.121.234,561", {
        decimal: true,
        suffixCurrency: "Rp ",
        totalDecimal: 2,
        roundedDecimal: "ceil",
        negativeFormat: {
          style: "brackets"
        }
      })
    ).toBe("(Rp 1.121.234,57)");
    expect(
      formatCurrency("-1.121.234,561", {
        decimal: false,
        suffixCurrency: "Rp ",
        // totalDecimal: 2,
        roundedDecimal: "ceil",
        negativeFormat: {
          style: "brackets"
        }
      })
    ).toBe("(Rp 1.121.234)");
    expect(
      formatCurrency("1.121.234", {
        decimal: true,
        suffixCurrency: "Rp ",
        roundedDecimal: "ceil"
      })
    ).toBe("Rp 1.121.234,00");
    expect(
      formatCurrency("1,121,234", {
        decimal: true,
        suffixCurrency: "Rp ",
        roundedDecimal: "ceil"
      })
    ).toBe("Rp 1.121.234,00");
    expect(
      formatCurrency("1,121,234.00", {
        decimal: true,
        suffixCurrency: "Rp ",
        roundedDecimal: "ceil"
      })
    ).toBe("Rp 1.121.234,00");
    expect(
      formatCurrency("1.121.234,00", {
        decimal: true,
        totalDecimal: 0,
        suffixCurrency: "Rp ",
        roundedDecimal: "ceil"
      })
    ).toBe("Rp 1.121.234");
  });
  it("supports custom separators", () => {
    expect(
      formatCurrency(1234567.89, {
        decimal: true,
        separator: "'",
        separatorDecimals: "."
      })
    ).toBe("1'234'567.89");
  });

  it("handles zero correctly", () => {
    expect(formatCurrency(0, { decimal: true })).toBe("0,00");
  });

  it("handles empty string input", () => {
    expect(formatCurrency("", { decimal: true, suffixCurrency: "$" })).toBe(
      "$0,00"
    );
  });

  it("handles string with mixed separators", () => {
    expect(formatCurrency("1,234.567,89", { decimal: true })).toBe("1.234,57");
  });

  it("rounds decimals correctly with floor", () => {
    expect(
      formatCurrency(1234.567, {
        decimal: true,
        totalDecimal: 2,
        roundedDecimal: "floor"
      })
    ).toBe("1.234,56");
  });

  it("rounds decimals correctly with round", () => {
    expect(
      formatCurrency(1234.567, {
        decimal: true,
        totalDecimal: 2,
        roundedDecimal: "round"
      })
    ).toBe("1.234,57");
  });

  it("returns plain integer if decimals disabled", () => {
    expect(formatCurrency(1234.567)).toBe("1.234");
  });

  it("Negative numbers (custom function)", () => {
    const test = formatCurrency(-1234.56, {
      decimal: true,
      negativeFormat: { custom: (val) => `NEGATIVE[${val}]` }
    });

    expect(test).toBe("NEGATIVE[1.234,56]");
  });
});
