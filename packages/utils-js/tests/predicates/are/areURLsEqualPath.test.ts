/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { areURLsEqualPath } from "@/predicates/are/areURLsEqualPath";

describe("areURLsEqualPath", () => {
  it("should return true for identical URLs with identical query", () => {
    const url1 = new URL("https://example.com/path?foo=1&bar=2");
    const url2 = new URL("https://example.com/path?foo=1&bar=2");

    expect(areURLsEqualPath(url1, url2)).toBe(true);
  });

  it("should return true for identical URLs with different queries", () => {
    const url1 = new URL("https://example.com/path?foo=1");
    const url2 = new URL("https://example.com/path?bar=2");

    expect(areURLsEqualPath(url1, url2)).toBe(true);
  });

  it("should return true when both URLs have no query", () => {
    const url1 = new URL("https://example.com/path");
    const url2 = new URL("https://example.com/path");

    expect(areURLsEqualPath(url1, url2)).toBe(true);
  });

  it("should return false for different protocols", () => {
    const url1 = new URL("https://example.com/path");
    const url2 = new URL("http://example.com/path");

    expect(areURLsEqualPath(url1, url2)).toBe(false);
  });

  it("should return false for different hosts", () => {
    const url1 = new URL("https://example.com/path");
    const url2 = new URL("https://other.com/path");

    expect(areURLsEqualPath(url1, url2)).toBe(false);
  });

  it("should return false for different paths", () => {
    const url1 = new URL("https://example.com/path1");
    const url2 = new URL("https://example.com/path2");

    expect(areURLsEqualPath(url1, url2)).toBe(false);
  });

  it("should throw TypeError if arguments are not URL instances", () => {
    expect(() =>
      areURLsEqualPath(
        "https://example.com" as any,
        new URL("https://example.com")
      )
    ).toThrow(TypeError);

    expect(() =>
      areURLsEqualPath(
        new URL("https://example.com"),
        "https://example.com" as any
      )
    ).toThrow(TypeError);
  });
});
