/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { areURLsIdentical } from "@/predicates/are/areURLsIdentical";

describe("areURLsIdentical", () => {
  it("should return true for identical URLs", () => {
    const url1 = new URL("https://example.com/path?query=123");
    const url2 = new URL("https://example.com/path?query=123");

    expect(areURLsIdentical(url1, url2)).toBe(true);
  });

  it("should return false for different protocols", () => {
    const url1 = new URL("https://example.com/path?query=123");
    const url2 = new URL("http://example.com/path?query=123");

    expect(areURLsIdentical(url1, url2)).toBe(false);
  });

  it("should return false for different hosts", () => {
    const url1 = new URL("https://example.com/path?query=123");
    const url2 = new URL("https://other.com/path?query=123");

    expect(areURLsIdentical(url1, url2)).toBe(false);
  });

  it("should return false for different paths", () => {
    const url1 = new URL("https://example.com/path1?query=123");
    const url2 = new URL("https://example.com/path2?query=123");

    expect(areURLsIdentical(url1, url2)).toBe(false);
  });

  it("should return false for different query strings", () => {
    const url1 = new URL("https://example.com/path?query=123");
    const url2 = new URL("https://example.com/path?query=456");

    expect(areURLsIdentical(url1, url2)).toBe(false);
  });

  it("should return true when both URLs have empty query", () => {
    const url1 = new URL("https://example.com/path");
    const url2 = new URL("https://example.com/path");

    expect(areURLsIdentical(url1, url2)).toBe(true);
  });

  it("should throw TypeError if arguments are not URL instances", () => {
    expect(() =>
      areURLsIdentical(
        "https://example.com" as any,
        new URL("https://example.com")
      )
    ).toThrow(TypeError);

    expect(() =>
      areURLsIdentical(
        new URL("https://example.com"),
        "https://example.com" as any
      )
    ).toThrow(TypeError);
  });
});
