/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { extractURLs } from "@/urls/extractors/extractURLs";

describe("extractURLs", () => {
  it("should return an array with a single URL when input is a standalone URL", () => {
    expect(extractURLs("https://example.com")).toEqual(["https://example.com"]);
  });

  it("should extract multiple URLs from a string", () => {
    const input =
      "Visit https://example.com and also check http://other.com/path.";
    expect(extractURLs(input)).toEqual([
      "https://example.com",
      "http://other.com/path"
    ]);
  });

  it("should handle URLs with query and fragments", () => {
    const input = "https://example.com/path?query=123#hash";
    expect(extractURLs(input)).toEqual([
      "https://example.com/path?query=123#hash"
    ]);
  });

  it("should handle URLs with subdomains and ports", () => {
    const input = "Go to http://sub.example.com:8080/test.";
    expect(extractURLs(input)).toEqual(["http://sub.example.com:8080/test"]);
  });

  it("should decode percent-encoded strings before extracting", () => {
    const encoded =
      "Check%20this%20link:%20https%3A%2F%2Fexample.com%2Fpath%3Fq%3D1";
    expect(extractURLs(encoded)).toEqual(["https://example.com/path?q=1"]);
  });

  it("should return null if no valid URLs are found", () => {
    expect(extractURLs("this string has no url")).toBeNull();
  });

  it("should return null if decoding fails due to bad encoding", () => {
    expect(extractURLs("https%AZ")).toBeNull();
  });

  it("should return null for non-string inputs", () => {
    expect(extractURLs(null)).toBeNull();
    expect(extractURLs(undefined)).toBeNull();
    expect(extractURLs({} as any)).toBeNull();
    expect(extractURLs(123 as any)).toBeNull();
  });

  it("should return null for empty or whitespace strings", () => {
    expect(extractURLs("")).toBeNull();
    expect(extractURLs("    ")).toBeNull();
  });

  it("should ignore ftp and other protocols", () => {
    const input = "ftp://example.com http://example.com";
    expect(extractURLs(input)).toEqual(["http://example.com"]);
  });

  it("should extract complex paths with symbols", () => {
    const input = "Here: https://example.com/path/with-$-chars_and~weird~stuff";
    expect(extractURLs(input)).toEqual([
      "https://example.com/path/with-$-chars_and~weird~stuff"
    ]);
  });

  it("should extract multiple URLs even if joined without spaces", () => {
    const input = "https://a.comhttps://b.com";
    expect(extractURLs(input)).toEqual(["https://a.com", "https://b.com"]);
  });

  it("should support international domain names (IDN)", () => {
    const input = "Visit https://münich.de and https://例子.公司 for examples.";
    expect(extractURLs(input)).toEqual([
      "https://münich.de",
      "https://例子.公司"
    ]);
  });
});

describe("extractURLs - extended international tests", () => {
  it("should extract internationalized domain names (IDN)", () => {
    const input = "Check https://münich.de and https://例子.公司 for examples.";
    expect(extractURLs(input)).toEqual([
      "https://münich.de",
      "https://例子.公司"
    ]);
  });

  it("should extract URLs with emoji in path", () => {
    const input = "Fun link: https://example.com/🎉/page";
    expect(extractURLs(input)).toEqual(["https://example.com/🎉/page"]);
  });

  it("should extract very long URLs", () => {
    const longUrl = `https://example.com/${"a".repeat(500)}`;
    const input = `Go to ${longUrl}`;
    expect(extractURLs(input)).toEqual([longUrl]);
  });

  it("should extract URLs with hashbang", () => {
    const input = "Try https://example.com/#!/section";
    expect(extractURLs(input)).toEqual(["https://example.com/#!/section"]);
  });

  it("should extract URLs with multiple query params and complex fragments", () => {
    const input = "Visit https://example.com/path?foo=1&bar=2#section-💡-42";
    expect(extractURLs(input)).toEqual([
      "https://example.com/path?foo=1&bar=2#section-💡-42"
    ]);
  });

  it("should extract URLs with unicode characters in path", () => {
    const input = "Go to https://example.com/你好/世界";
    expect(extractURLs(input)).toEqual(["https://example.com/你好/世界"]);
  });
});
