import { describe, it, expect } from "vitest";
import { isDate } from "@/predicates/is/isDate";

describe("isDate", () => {
  it("should return true for valid Date instances", () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date("2025-01-01"))).toBe(true);
  });

  it("should return false for invalid Date instances", () => {
    expect(isDate(new Date("invalid-date"))).toBe(false);
  });

  it("should return true for invalid Date instances with skipInvalidDate is true", () => {
    expect(isDate(new Date("invalid-date"), { skipInvalidDate: true })).toBe(
      true
    );
  });

  it("should return false for string representations of dates", () => {
    expect(isDate("2025-01-01")).toBe(false);
    expect(isDate("invalid-date")).toBe(false);
  });

  it("should return false for non-date types", () => {
    expect(isDate(undefined)).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(123)).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate(() => {})).toBe(false);
  });

  it("should return false for Date-like objects", () => {
    const fakeDate = { getTime: () => 123456 };
    expect(isDate(fakeDate)).toBe(false);
  });
});
