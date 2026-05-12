import { describe, it, expect } from "vitest";
import { normalizeString } from "@/strings/sanitizations/normalizeString";

describe("normalizeString", () => {
  it("should trim a valid non-empty string", () => {
    expect(normalizeString("   Hello World   ")).toBe("Hello World");
  });

  it("should return empty string for input with only spaces", () => {
    expect(normalizeString("     ")).toBe("");
  });

  it("should return empty string for empty string input", () => {
    expect(normalizeString("")).toBe("");
  });

  it("should return empty string for null input", () => {
    expect(normalizeString(null)).toBe("");
  });

  it("should return empty string for undefined input", () => {
    expect(normalizeString(undefined)).toBe("");
  });

  it("should return trimmed string for input with tabs and newlines", () => {
    expect(normalizeString("\n\t  Hello \t\n")).toBe("Hello");
  });

  it("should not modify already clean string", () => {
    expect(normalizeString("Clean")).toBe("Clean");
  });
});
