// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { isURL } from "@/predicates/is/isURL";

describe("isURL", () => {
  it("should return true for URL instance", () => {
    expect(isURL(new URL("https://example.com"))).toBe(true);
  });

  it("should return false for string URL", () => {
    expect(isURL("https://example.com")).toBe(false);
  });

  it("should return false for non-URL values", () => {
    expect(isURL(undefined)).toBe(false);
    expect(isURL(null)).toBe(false);
    expect(isURL({})).toBe(false);
    expect(isURL(123)).toBe(false);
    expect(isURL([])).toBe(false);
  });

  it("should return false for object mimicking URL", () => {
    const fakeURL = { href: "https://example.com", hostname: "example.com" };
    expect(isURL(fakeURL)).toBe(false);
  });
});
