import { describe, it, expect } from "vitest";
import { formatDateIntl } from "@/formatters/times/formatDateIntl";

describe("formatDateIntl", () => {
  const sampleDate = new Date("2023-07-01T14:30:45Z");

  it("should format using default locale and options when no options provided", () => {
    const result = formatDateIntl(sampleDate);
    // default locale en-US
    expect(result).toBe("7/1/2023");
  });

  it("should format using custom locale", () => {
    const result = formatDateIntl(sampleDate, { locale: "id-ID" });
    expect(result).toBe("1/7/2023");
  });

  it("should format with custom date options", () => {
    const result = formatDateIntl(sampleDate, {
      locale: "en-GB",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    expect(result).toBe("01 July 2023");
  });

  it("should format with time options", () => {
    const result = formatDateIntl(sampleDate, {
      locale: "en-US",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC"
    });
    expect(result).toBe("14:30:45");
  });

  it("should handle options without locale", () => {
    const result = formatDateIntl(sampleDate, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    expect(result).toBe("07/01/2023"); // default en-US format still
  });

  it("should return null for invalid date string", () => {
    expect(formatDateIntl("invalid-date")).toBeNull();
  });

  it("should return null for null, undefined, or empty input", () => {
    expect(formatDateIntl(null)).toBeNull();
    expect(formatDateIntl(undefined)).toBeNull();
    expect(formatDateIntl("")).toBeNull();
  });

  it("should fallback gracefully if options is invalid type", () => {
    // @ts-expect-error intentionally wrong type
    expect(formatDateIntl(sampleDate, "not-an-object")).toBe("7/1/2023");
  });

  it("should default locale to en-US if empty locale string given", () => {
    const result = formatDateIntl(sampleDate, {
      locale: "   ",
      day: "2-digit",
      month: "short",
      year: "2-digit"
    });
    expect(result).toMatch(/\w{3} \d{2}, \d{2}/);
  });

  it("should work with string date input", () => {
    const result = formatDateIntl("2023-07-01T14:30:45Z", {
      locale: "en-US"
    });
    expect(result).toBe("7/1/2023");
  });
});
