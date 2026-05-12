import { describe, it, expect } from "vitest";
import { formatDateTime } from "@/formatters/times/formatDateTime";

describe("formatDateTime", () => {
  const dateSample = new Date("2023-07-01T14:30:45");

  it("should format with default format when no format is provided", () => {
    expect(formatDateTime(dateSample)).toBe("2023-07-01 14:30:45");
    expect(formatDateTime(dateSample)).toBe("2023-07-01 14:30:45");
  });

  it("should return null for invalid date string", () => {
    expect(formatDateTime("invalid-date")).toBeNull();
  });

  it("should return null for null or undefined", () => {
    expect(formatDateTime(null)).toBeNull();
    expect(formatDateTime(undefined)).toBeNull();
  });

  it("should handle custom format correctly", () => {
    expect(formatDateTime(dateSample, "DD/MM/YYYY")).toBe("01/07/2023");
    expect(formatDateTime(dateSample, "YYYY/MM/DD hh-mm-ss")).toBe(
      "2023/07/01 14-30-45"
    );
    expect(formatDateTime(dateSample, "hh:mm")).toBe("14:30");
  });

  it("should not replace substrings that don't exist", () => {
    expect(formatDateTime(dateSample, "DATE: YYYY.MM.DD")).toBe(
      "DATE: 2023.07.01"
    );
    expect(formatDateTime(dateSample, "Year: YYYY, Time: hh:mm:ss")).toBe(
      "Year: 2023, Time: 14:30:45"
    );
  });

  it("should not error on partial format templates", () => {
    expect(formatDateTime(dateSample, "YYYY-MM")).toBe("2023-07");
  });

  it("should handle edge case repeated keys properly (replaces only intended tokens)", () => {
    // intentionally weird format
    expect(formatDateTime(dateSample, "YYYYYYYY")).toBe("20232023");
    expect(formatDateTime(dateSample, "hh:mm:ss:ss")).toBe("14:30:45:45");
  });

  it("should return null if constructed Date is invalid", () => {
    expect(formatDateTime(new Date("invalid date string"))).toBeNull();
  });

  it("should safely handle non-string format input", () => {
    // @ts-expect-error intentionally wrong type
    expect(formatDateTime(dateSample, 123)).toBeNull();
  });
});
