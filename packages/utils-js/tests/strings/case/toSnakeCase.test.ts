/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { toSnakeCase } from "@/strings/cases/toSnakeCase";

describe("toSnakeCase - comprehensive", () => {
  it("should return empty string for nullish/empty input", () => {
    expect(toSnakeCase("")).toBe("");
    expect(toSnakeCase(null as any)).toBe("");
    expect(toSnakeCase(undefined as any)).toBe("");
  });

  it("should handle single words", () => {
    expect(toSnakeCase("Hello")).toBe("hello");
    expect(toSnakeCase("world")).toBe("world");
    expect(toSnakeCase("SNAKE")).toBe("snake");
  });

  it("should handle multiple spaces", () => {
    expect(toSnakeCase("   hello   world   ")).toBe("hello_world");
    expect(toSnakeCase("this    is    snake")).toBe("this_is_snake");
  });

  it("should replace punctuation/symbols with underscores", () => {
    expect(toSnakeCase("hello-world")).toBe("hello_world");
    expect(toSnakeCase("foo_bar")).toBe("foo_bar");
    expect(toSnakeCase("foo@bar#baz$qux")).toBe("foo_bar_baz_qux");
  });

  it("should collapse consecutive separators", () => {
    expect(toSnakeCase("hello---world")).toBe("hello_world");
    expect(toSnakeCase("__foo__bar__")).toBe("foo_bar");
    expect(toSnakeCase("foo___---bar")).toBe("foo_bar");
  });

  it("should handle mixed case properly", () => {
    expect(toSnakeCase("camelCaseTest")).toBe("camelcasetest");
    expect(toSnakeCase("camelCaseTest", "Case")).toBe("camelcasetest");
    expect(toSnakeCase("camelCaseTest", ["Case", "Test"])).toBe(
      "camelcasetest"
    );
    expect(toSnakeCase("PascalCaseTest")).toBe("pascalcasetest");
    expect(toSnakeCase("snake_case_test")).toBe("snake_case_test");
    expect(toSnakeCase("kebab-case-test")).toBe("kebab_case_test");
  });

  it("should handle numbers correctly", () => {
    expect(toSnakeCase("order 66")).toBe("order_66");
    expect(toSnakeCase("9lives")).toBe("9lives");
    expect(toSnakeCase("version2update")).toBe("version2update");
    expect(toSnakeCase("win95 vs winXP")).toBe("win95_vs_winxp");
  });

  it("should ignore emojis and symbols", () => {
    expect(toSnakeCase("hello 🌍 world 🚀")).toBe("hello_world");
    expect(toSnakeCase("🔥 fire_and_ice ❄️")).toBe("fire_and_ice");
  });

  it("should preserve non-latin scripts", () => {
    expect(toSnakeCase("こんにちは 世界")).toBe("こんにちは_世界"); // Japanese
    expect(toSnakeCase("добрый день")).toBe("добрый_день"); // Cyrillic
    expect(toSnakeCase("안녕하세요 세상")).toBe("안녕하세요_세상"); // Korean
    expect(toSnakeCase("مرحبا بالعالم")).toBe("مرحبا_بالعالم"); // Arabic
  });

  it("should normalize ultra dirty input", () => {
    const dirty = " 🚀__HELLO--world 😅 123 --_ test   ";
    expect(toSnakeCase(dirty)).toBe("hello_world_123_test");
  });

  it("should handle mixed alphanumeric sequences", () => {
    expect(toSnakeCase("abc123def")).toBe("abc123def");
    expect(toSnakeCase("file2025version03")).toBe("file2025version03");
  });

  it("should handle array input", () => {
    expect(toSnakeCase(["hello", "world"] as any)).toBe("hello_world");
    expect(toSnakeCase(["  foo  ", "BAR!!", "123 "] as any)).toBe(
      "foo_bar_123"
    );
  });

  it("should handle Set input", () => {
    expect(toSnakeCase(new Set(["hello", "world"]) as any)).toBe("");
    expect(toSnakeCase(new Set(["FOO", "BAR", "baz"]) as any)).toBe("");
  });

  it("should handle weird edge cases", () => {
    expect(toSnakeCase("___---$$$")).toBe("");
    expect(toSnakeCase("   ")).toBe("");
    expect(toSnakeCase("__123__")).toBe("123");
    expect(toSnakeCase("foo__123__bar")).toBe("foo_123_bar");
  });

  it("should not duplicate underscores", () => {
    expect(toSnakeCase("foo__bar")).toBe("foo_bar");
    expect(toSnakeCase("foo--bar")).toBe("foo_bar");
  });

  it("should handle leading/trailing underscores correctly", () => {
    expect(toSnakeCase("_foo_")).toBe("foo");
    expect(toSnakeCase("-foo-")).toBe("foo");
    expect(toSnakeCase("__foo__bar__")).toBe("foo_bar");
  });

  it("should handle very long input", () => {
    const longInput = "Hello_".repeat(1000);
    const result = toSnakeCase(longInput);
    expect(result.startsWith("hello")).toBe(true);
    expect(result.includes("_")).toBe(true);
  });

  // ✅ Ignore word tests
  it("should preserve single ignore word", () => {
    expect(toSnakeCase("ignore URL here", "URL")).toBe("ignore_URL_here");
  });

  it("should preserve multiple ignore words (array)", () => {
    expect(toSnakeCase("ignore API and URL", ["API", "URL"])).toBe(
      "ignore_API_and_URL"
    );
  });

  it("should preserve multiple ignore words (Set)", () => {
    expect(toSnakeCase("ignore API and URL", new Set(["API", "URL"]))).toBe(
      "ignore_API_and_URL"
    );
  });

  it("should ignore case-sensitive mismatch test", () => {
    expect(toSnakeCase("ignore url case", "URL")).toBe("ignore_url_case");
    expect(toSnakeCase("ignore URL case", "url")).toBe("ignore_url_case"); // normalized preserve
  });

  it("should clean dirty ignore words", () => {
    expect(toSnakeCase("ignore API and URL", [" API ", "-URL-"])).toBe(
      "ignore_API_and_URL"
    );
    expect(toSnakeCase("ignore FOO bar", new Set(["   FOO!!  "]))).toBe(
      "ignore_FOO_bar"
    );
  });

  it("should ignore empty ignoreWord inputs", () => {
    expect(toSnakeCase("hello world", "")).toBe("hello_world");
    expect(toSnakeCase("hello world", [])).toBe("hello_world");
    expect(toSnakeCase("hello world", new Set())).toBe("hello_world");
  });

  it("should handle array input with ignoreWord", () => {
    expect(toSnakeCase(["Join", "API", "Words"], ["API"])).toBe(
      "join_API_words"
    );
  });

  it("should handle Set input with ignoreWord", () => {
    expect(
      toSnakeCase(new Set(["API", "test", "URL"]) as any, ["API", "URL"])
    ).toBe("");
  });
});
