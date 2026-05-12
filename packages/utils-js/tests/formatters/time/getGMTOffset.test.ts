import { describe, it, expect } from "vitest";

import { getGMTOffset } from "@/formatters/times/getGMTOffset";

describe("getGMTOffset", () => {
  it("should return offset for current date if no input", () => {
    const result = getGMTOffset();
    expect(result).toMatch(/^[+-]\d{4}$/);
  });

  it("should return offset for Date object", () => {
    const result = getGMTOffset(new Date());
    expect(result).toMatch(/^[+-]\d{4}$/);
  });

  it("should return offset for ISO date string", () => {
    const result = getGMTOffset("2025-07-14T10:25:42Z");
    expect(result).toMatch(/^[+-]\d{4}$/);
  });

  it("should default to current date for empty string", () => {
    const result = getGMTOffset("");
    expect(result).toMatch(/^[+-]\d{4}$/);
  });

  it("should default to current date for null or undefined", () => {
    expect(getGMTOffset(null)).toMatch(/^[+-]\d{4}$/);
    expect(getGMTOffset(undefined)).toMatch(/^[+-]\d{4}$/);
  });

  it("should return '0' for invalid date string", () => {
    expect(getGMTOffset("not-a-date")).toBe("0");
  });

  it("should return '0' for invalid type (object or number)", () => {
    // @ts-expect-error intentionally wrong type
    expect(getGMTOffset({})).toBe("0");
    // @ts-expect-error intentionally wrong type
    expect(getGMTOffset(123)).toBe("0");
  });

  it("should format offset correctly as ±HHMM", () => {
    const offset = getGMTOffset();
    expect(offset).toMatch(/^[+-]\d{4}$/);

    // Check sign and digits
    const sign = offset[0];
    const hours = parseInt(offset.slice(1, 3), 10);
    const minutes = parseInt(offset.slice(3, 5), 10);

    expect(["+", "-"]).toContain(sign);
    expect(hours).toBeGreaterThanOrEqual(0);
    expect(hours).toBeLessThan(24);
    expect(minutes).toBeGreaterThanOrEqual(0);
    expect(minutes).toBeLessThan(60);
  });

  it("should return consistent value for same date", () => {
    const date = new Date("2025-07-14T10:25:42Z");
    const offset1 = getGMTOffset(date);
    const offset2 = getGMTOffset(date.toISOString());
    expect(offset1).toBe(offset2);
  });
});
