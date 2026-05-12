import { describe, it, expect } from "vitest";

import { id } from "date-fns/locale";
import { formatDateFns } from "@/formatters/times/formatDateFns";

describe("formatDateFns", () => {
  const sampleDate = new Date("2025-07-14T10:25:42Z"); // UTC

  it("should format using default format and locale", () => {
    const result = formatDateFns(sampleDate);
    expect(result).toMatch(/\d{2} \w{3} \d{4} - \d{2}:\d{2}:\d{2}/);
  });

  it("should format using custom format string", () => {
    const result = formatDateFns(sampleDate, {
      format: "yyyy/MM/dd HH:mm"
    });
    expect(result).toMatch(/2025\/07\/14 \d{2}:\d{2}/);
  });

  it("should format using locale string 'id'", () => {
    const result = formatDateFns(sampleDate, {
      locale: "id",
      format: "dd MMMM yyyy"
    });
    expect(result).toMatch(/14 Juli 2025/);
  });

  it("should format using locale string 'en'", () => {
    const result = formatDateFns(sampleDate, {
      locale: "en",
      format: "dd MMMM yyyy"
    });
    expect(result).toMatch(/14 July 2025/);
  });

  it("should format using date-fns Locale object", () => {
    const result = formatDateFns(sampleDate, {
      locale: id,
      format: "dd MMMM yyyy"
    });
    expect(result).toMatch(/14 Juli 2025/);
  });

  it("should parse string date with inputFormat & inputLocale string", () => {
    const result = formatDateFns("14 Juli 2025 10:25:42", {
      inputFormat: "dd MMMM yyyy HH:mm:ss",
      inputLocale: "id",
      format: "yyyy-MM-dd HH:mm:ss"
    });
    expect(result).toBe("2025-07-14 10:25:42");
  });

  it("should parse string date with inputFormat & inputLocale as Locale object", () => {
    const result = formatDateFns("14 Juli 2025 10:25:42", {
      inputFormat: "dd MMMM yyyy HH:mm:ss",
      inputLocale: id,
      format: "dd/MM/yyyy"
    });
    expect(result).toBe("14/07/2025");
  });

  it("should return null for invalid date string without inputFormat", () => {
    expect(formatDateFns("invalid date")).toBeNull();
  });

  it("should return null for invalid formatted string even with inputFormat", () => {
    expect(
      formatDateFns("blabla", {
        inputFormat: "dd MMMM yyyy",
        inputLocale: "id"
      })
    ).toBeNull();
  });

  it("should return null for null, undefined, or empty input", () => {
    expect(formatDateFns(null)).toBeNull();
    expect(formatDateFns(undefined)).toBeNull();
    expect(formatDateFns("")).toBeNull();
  });

  it("should fallback gracefully if options is invalid type", () => {
    // @ts-expect-error intentionally wrong type
    expect(formatDateFns(sampleDate, "not-an-object")).toMatch(
      /\d{2} \w{3} \d{4} - \d{2}:\d{2}:\d{2}/
    );
  });

  it("should default to id if locale is 'id', enUS if 'en'", () => {
    const resId = formatDateFns(sampleDate, {
      locale: "id",
      format: "dd MMMM yyyy"
    });
    const resEn = formatDateFns(sampleDate, {
      locale: "en",
      format: "dd MMMM yyyy"
    });
    expect(resId).toMatch(/Juli/);
    expect(resEn).toMatch(/July/);
  });

  it("should ignore inputFormat if not a string date", () => {
    const result = formatDateFns(sampleDate, {
      inputFormat: "dd/MM/yyyy",
      inputLocale: "id",
      format: "yyyy-MM-dd"
    });
    expect(result).toBe("2025-07-14");
  });
});
