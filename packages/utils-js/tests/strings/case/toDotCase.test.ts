/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { toDotCase } from "@/strings/cases/toDotCase";

describe("toDotCase", () => {
  // --- Basic behavior ---
  it("should join words with dots", () => {
    expect(toDotCase("hello world")).toBe("hello.world");
    expect(toDotCase("This is A Test")).toBe("this.is.a.test");
  });

  it("should collapse multiple spaces", () => {
    expect(toDotCase("   hello    world   again  ")).toBe("hello.world.again");
  });

  it("should remove special characters", () => {
    expect(toDotCase("hello@world!# ok$%")).toBe("hello.world.ok");
  });

  it("should handle underscores and hyphens", () => {
    expect(toDotCase("hello_world---again")).toBe("hello.world.again");
  });

  it("should process numbers mixed in words", () => {
    expect(toDotCase("file 123 name")).toBe("file.123.name");
    expect(toDotCase("9 lives of a cat")).toBe("9.lives.of.a.cat");
  });

  it("should deal with emojis and weird unicode", () => {
    expect(toDotCase("hello 🌍 world 🚀")).toBe("hello.world");
    expect(toDotCase("🔥 fire_and_ice ❄️")).toBe("fire.and.ice");
  });

  it("should collapse repeated delimiters", () => {
    expect(toDotCase("___this---is___DOT___case")).toBe("this.is.dot.case");
  });

  it("should produce empty string for symbols only", () => {
    expect(toDotCase("$$$###!!!")).toBe("");
  });

  it("should handle completely non-latin input", () => {
    expect(toDotCase("こんにちは 世界")).toBe("こんにちは.世界");
    expect(toDotCase("добрый день")).toBe("добрый.день");
  });

  it("should handle extreme mixed input", () => {
    const input = " 🚀  -- hello__WORLD 😅 123 ---ok";
    expect(toDotCase(input)).toBe("hello.world.123.ok");
  });

  // --- Array input ---
  it("should join array input with dashes before processing", () => {
    expect(toDotCase(["hello", "world"])).toBe("hello.world");
    expect(toDotCase(["  spaced ", "", " again "] as any)).toBe("spaced.again");
  });

  // --- Null & undefined ---
  it("should return empty string for nullish values", () => {
    expect(toDotCase(null as any)).toBe("");
    expect(toDotCase(undefined as any)).toBe("");
  });

  // --- ignoreWord (string) ---
  it("should ignore a single provided word", () => {
    expect(toDotCase("this URL path", "URL")).toBe("this.URL.path");
    expect(toDotCase("Keep API here", "API")).toBe("keep.API.here");
  });

  it("should normalize ignoreWord before matching", () => {
    expect(toDotCase("this URL path", "  URL ")).toBe("this.URL.path");
    expect(toDotCase("ignore API-test", "API")).toBe("ignore.API.test");
  });

  // --- ignoreWord (array) ---
  it("should ignore multiple words in array", () => {
    expect(toDotCase("ignore API and URL", ["API", "URL"])).toBe(
      "ignore.API.and.URL"
    );
  });

  it("should filter out invalid entries in array", () => {
    expect(toDotCase("api url ok", ["", "   ", null as any, "URL"])).toBe(
      "api.url.ok"
    );
  });

  // --- ignoreWord (Set) ---
  it("should ignore multiple words in Set", () => {
    expect(toDotCase("ignore API and URL", new Set(["API", "URL"]))).toBe(
      "ignore.API.and.URL"
    );
  });

  it("should ignore words case-sensitively in Set", () => {
    expect(toDotCase("this Api path", new Set(["API"]))).toBe("this.api.path");
    expect(toDotCase("this API path", new Set(["API"]))).toBe("this.API.path");
  });

  // --- Edge cases ---
  it("should return empty string if array input is empty", () => {
    expect(toDotCase([])).toBe("");
  });

  it("should trim around words", () => {
    expect(toDotCase("   hello   ")).toBe("hello");
  });

  it("should handle single character words", () => {
    expect(toDotCase("a b c")).toBe("a.b.c");
  });

  it("should handle already dot.case input", () => {
    expect(toDotCase("already.dot.case")).toBe("already.dot.case");
  });
});
