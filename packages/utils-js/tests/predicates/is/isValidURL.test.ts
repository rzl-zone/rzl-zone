/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { isValidURL } from "@/predicates/is/isValidURL";

describe("isValidURL", () => {
  it("should return true for valid http URLs", () => {
    expect(isValidURL("http://example.com")).toBe(true);
    expect(isValidURL("http://www.example.com")).toBe(true);
    expect(isValidURL("http://sub.example.com/path")).toBe(true);
    expect(isValidURL("http://example.com:8080/path")).toBe(true);
    expect(isValidURL("http://example.com/path?query=123#fragment")).toBe(true);
  });

  it("should return true for valid https URLs", () => {
    expect(isValidURL("https://example.com")).toBe(true);
    expect(isValidURL("https://www.example.com")).toBe(true);
    expect(isValidURL("https://sub.example.com/path")).toBe(true);
    expect(isValidURL("https://example.com:443/path")).toBe(true);
    expect(isValidURL("https://example.com/path?query=123#fragment")).toBe(
      true
    );
  });

  it("should return true for valid localhost URLs", () => {
    expect(isValidURL("http://localhost")).toBe(true);
    expect(isValidURL("http://localhost:3000")).toBe(true);
    expect(isValidURL("http://localhost:3000/path")).toBe(true);
    expect(isValidURL("https://localhost:3000/path")).toBe(true);
  });

  it("should return false for missing protocol", () => {
    expect(isValidURL("example.com")).toBe(false);
    expect(isValidURL("www.example.com")).toBe(false);
    expect(isValidURL("/relative/path")).toBe(false);
  });

  it("should return false for unsupported protocols", () => {
    expect(isValidURL("ftp://example.com")).toBe(false);
    expect(isValidURL("mailto:someone@example.com")).toBe(false);
    expect(isValidURL("file:///path/to/file")).toBe(false);
  });

  it("should return false for clearly malformed URLs", () => {
    expect(isValidURL("https://")).toBe(false);
    expect(isValidURL("http://")).toBe(false);
    expect(isValidURL("http:/example.com")).toBe(false);
    expect(isValidURL("://example.com")).toBe(false);
  });

  it("should return false for non-string inputs", () => {
    expect(isValidURL(undefined)).toBe(false);
    expect(isValidURL(null)).toBe(false);
    expect(isValidURL("")).toBe(false);
    expect(isValidURL("    ")).toBe(false);
    expect(isValidURL(123 as any)).toBe(false);
    expect(isValidURL({} as any)).toBe(false);
  });

  it("should decode percent-encoded URLs before validation", () => {
    expect(isValidURL("https%3A%2F%2Fexample.com")).toBe(true);
    expect(isValidURL("https%3A%2F%2Fexample.com%2Fpath%3Fq%3D1")).toBe(true);
  });

  it("should return false if decoding fails", () => {
    expect(isValidURL("https%AZ")).toBe(false);
  });

  // Additional edge cases
  it("should return true for valid IPv4 and IPv6 URLs", () => {
    expect(isValidURL("http://127.0.0.1")).toBe(true);
    expect(isValidURL("https://127.0.0.1:8080/path")).toBe(true);
    // IPv6 in bracket format generally not caught by your regex
    expect(isValidURL("http://[::1]:3000")).toBe(false); // your regex does not support [::1]
  });

  it("should handle long subdomains and multiple levels", () => {
    expect(isValidURL("https://a.b.c.d.example.com/path")).toBe(true);
    expect(isValidURL("https://very.long.sub.domain.example.com")).toBe(true);
  });

  it("should accept URLs without www but valid TLD", () => {
    expect(isValidURL("https://google.com")).toBe(true);
    expect(isValidURL("https://api.example.com")).toBe(true);
  });

  it("should return false for overly long TLDs", () => {
    expect(isValidURL("https://example.abcdefghi")).toBe(false); // TLD >6
  });

  it("should return true for URLs with complex paths", () => {
    expect(
      isValidURL("https://example.com/path/with-$-chars_and~weird~stuff")
    ).toBe(true);
  });

  it("should accept fake filesystem paths only if with valid http(s)", () => {
    expect(isValidURL("http://localhost/C:/path/to/file")).toBe(true);
    expect(isValidURL("file:///C:/path/to/file")).toBe(false);
  });

  it("should return false for domains ending with dot", () => {
    expect(isValidURL("https://example.com.")).toBe(false);
  });

  it("should accept trailing slashes", () => {
    expect(isValidURL("https://example.com/")).toBe(true);
    expect(isValidURL("https://example.com/path/")).toBe(true);
  });
});
