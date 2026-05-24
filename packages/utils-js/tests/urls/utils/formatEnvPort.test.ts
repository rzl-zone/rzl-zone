/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatEnvPort } from "@/urls/utils/formatEnvPort";
import { describe, it, expect } from "vitest";

describe("formatEnvPort", () => {
  it("should return empty string for undefined, null, empty or whitespace strings", () => {
    // @ts-expect-error test only for unset value.
    expect(formatEnvPort()).toBe("");
    expect(formatEnvPort(undefined)).toBe("");
    expect(formatEnvPort(null)).toBe("");
    expect(formatEnvPort("")).toBe("");
    expect(formatEnvPort("    ")).toBe("");
  });

  it("should extract digits and NOT prefix colon by default", () => {
    expect(formatEnvPort("8080")).toBe("8080");
    expect(formatEnvPort(":8080")).toBe("8080");
    expect(formatEnvPort("::8080")).toBe("8080");
    expect(formatEnvPort("server:8080")).toBe("8080");
    expect(formatEnvPort("abc123def456")).toBe("123456");
  });

  it("should remove all non-digit characters", () => {
    expect(formatEnvPort("a:b:c:1234_x-y")).toBe("1234");
    expect(formatEnvPort("port:!@#$%^&*()_+8080")).toBe("8080");
  });

  it("should return empty string if no digits present", () => {
    expect(formatEnvPort("abcdef")).toBe("");
    expect(formatEnvPort("::---__")).toBe("");
    expect(formatEnvPort("🔥💀🚀")).toBe("");
  });

  it("should honor prefixColon option", () => {
    expect(formatEnvPort("8080", { prefixColon: true })).toBe(":8080");
    expect(formatEnvPort("8080", { prefixColon: false })).toBe("8080");
  });

  it("should default to prefixColon: false", () => {
    expect(formatEnvPort("8080")).toBe("8080");
    expect(formatEnvPort("8080", {})).toBe("8080");
  });

  it("should not throw if options is not a proper object", () => {
    expect(() => formatEnvPort("8080", 123 as any)).toThrow(TypeError);
    expect(() => formatEnvPort("8080", "string" as any)).toThrow(TypeError);
    expect(() => formatEnvPort("8080", null as any)).toThrow(TypeError);
    expect(() => formatEnvPort("8080", [1, 2, 3] as any)).toThrow(TypeError);
  });

  it("should not throw if prefixColon is not boolean", () => {
    expect(() => formatEnvPort("8080", { prefixColon: "yes" as any })).toThrow(
      TypeError
    );
    expect(() => formatEnvPort("8080", { prefixColon: 1 as any })).toThrow(
      TypeError
    );
    expect(() => formatEnvPort("8080", { prefixColon: null as any })).toThrow(
      TypeError
    );
  });

  it("should handle complex strings with multiple colons and symbols", () => {
    expect(formatEnvPort(":::1234")).toBe("1234");
    expect(formatEnvPort("host:::5678", { prefixColon: false })).toBe("5678");
    expect(formatEnvPort("path/to/port:9999", { prefixColon: true })).toBe(
      ":9999"
    );
  });

  it("should handle mixed unicode or emoji input with digits", () => {
    expect(formatEnvPort("🔥8080")).toBe("8080");
    expect(formatEnvPort("port🚀123", { prefixColon: true })).toBe(":123");
  });

  it("should handle strings with numbers scattered", () => {
    expect(formatEnvPort("port-12-34-56")).toBe("123456");
    expect(formatEnvPort("number: 6 5 4 3")).toBe("6543");
  });

  it("should still return empty string if no digits even with options", () => {
    expect(formatEnvPort("no port here", { prefixColon: false })).toBe("");
    expect(formatEnvPort("only symbols!!", { prefixColon: true })).toBe("");
  });
});
