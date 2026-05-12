import { describe, it, expect } from "vitest";
import { parseCustomDate } from "@/conversions/json/parseCustomDate";

describe("parseCustomDate", () => {
  it("should parse 'DD/MM/YYYY' format correctly", () => {
    const date = parseCustomDate("25/12/2000", "DD/MM/YYYY");
    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2000);
    expect(date?.getMonth()).toBe(11); // December (0-based)
    expect(date?.getDate()).toBe(25);
  });

  it("should parse 'MM/DD/YYYY' format correctly", () => {
    const date = parseCustomDate("12/25/2000", "MM/DD/YYYY");
    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2000);
    expect(date?.getMonth()).toBe(11); // December
    expect(date?.getDate()).toBe(25);
  });

  it("should parse 'MM-YYYY' format as fallback (returns null because parseCustomDate does not support it natively)", () => {
    const date = parseCustomDate("01-2025", "MM-YYYY");
    expect(date).toBeNull();
  });

  it("should return null for invalid format string", () => {
    const date = parseCustomDate("25-12-2000", "YY/MM/DD");
    expect(date).toBeNull();
  });

  it("should return null for completely invalid date strings", () => {
    const date = parseCustomDate("not-a-date", "DD/MM/YYYY");
    expect(date).toBeNull();
  });

  it("should return null if date parts are not numbers", () => {
    const date = parseCustomDate("25/Dec/2000", "DD/MM/YYYY");
    expect(date).toBeNull();
  });

  it("should throw if inputs are not strings", () => {
    // @ts-expect-error intentionally invalid
    expect(() => parseCustomDate(12345, "DD/MM/YYYY")).toThrow(TypeError);

    // @ts-expect-error intentionally invalid
    expect(() => parseCustomDate("25/12/2000", null)).toThrow(TypeError);
  });

  it("should return null for out of range month/day", () => {
    const date = parseCustomDate("99/99/2000", "DD/MM/YYYY");
    expect(date).toBeNull();
  });
});
