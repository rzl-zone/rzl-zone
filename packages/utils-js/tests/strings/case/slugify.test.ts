/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { slugify } from "@/strings/cases/slugify";

describe("slugify", () => {
  it("should handle simple sentence", () => {
    expect(slugify("hello world")).toBe("hello-world");
    expect(slugify("This is A Test")).toBe("this-is-a-test");
  });

  it("should collapse multiple spaces", () => {
    expect(slugify("   hello    world   again  ")).toBe("hello-world-again");
  });

  it("should remove special characters and symbols", () => {
    expect(slugify("hello@world!# ok$%")).toBe("hello-world-ok");
    expect(slugify("100% guaranteed *awesome*")).toBe("100-guaranteed-awesome");
  });

  it("should handle mixed hyphens and underscores", () => {
    expect(slugify("hello_world---again")).toBe("hello-world-again");
    expect(slugify("__this--is__CRAZY")).toBe("this-is-crazy");
  });

  it("should handle emojis and keep only words", () => {
    expect(slugify("🔥 fire world 🌍")).toBe("fire-world");
    expect(slugify("🚀 rocket to the moon 🌕")).toBe("rocket-to-the-moon");
  });

  it("should handle numbers inside text", () => {
    expect(slugify("order 123 for user 456")).toBe("order-123-for-user-456");
    expect(slugify("9 lives of a cat")).toBe("9-lives-of-a-cat");
  });

  it("should produce empty for only symbols", () => {
    expect(slugify("$$$###!!!")).toBe("");
    expect(slugify("___---")).toBe("");
  });

  it("should handle extreme complex input", () => {
    const input = "  ___hello__--WORLD!! 🚀 🚀 🔥🔥     go--crazy_123__  ";
    expect(slugify(input)).toBe("hello-world-go-crazy-123");
  });

  it("should handle unicode non-latin characters (preserve them)", () => {
    expect(slugify("こんにちは 世界")).toBe("こんにちは-世界");
    expect(slugify("добрый день world")).toBe("добрый-день-world");
  });

  // 🔹 Tambahan edge cases
  it("should return empty string for null, undefined, or empty input", () => {
    expect(slugify(null as any)).toBe("");
    expect(slugify(undefined as any)).toBe("");
    expect(slugify("")).toBe("");
  });

  it("should handle single word input", () => {
    expect(slugify("Hello")).toBe("hello");
    expect(slugify("WORLD")).toBe("world");
  });

  it("should return same result if already slugified", () => {
    expect(slugify("already-slugified-text")).toBe("already-slugified-text");
  });

  it("should trim leading/trailing symbols and spaces", () => {
    expect(slugify("   ---hello-world---   ")).toBe("hello-world");
  });

  it("should handle very long input gracefully", () => {
    const longInput = "word ".repeat(1000); // 1000 words
    const result = slugify(longInput);
    expect(result.startsWith("word-word-word")).toBe(true);
    expect(result.split("-").length).toBe(1000);
  });
});

describe("non-string inputs", () => {
  it("should return empty string for arrays", () => {
    expect(slugify(["hello", "world"])).toBe("hello-world");
    expect(slugify(["🔥", "fire", "🌍"])).toBe("fire");
  });

  it("should return empty string for nested arrays", () => {
    expect(slugify([["hello"], ["world", "again"]] as any)).toBe("");
  });

  it("should return empty string for Set", () => {
    expect(slugify(new Set(["hello", "world"]) as any)).toBe("");
  });

  it("should return empty string for Map", () => {
    const map = new Map([
      ["k1", "hello"],
      ["k2", "world"]
    ]);
    expect(slugify(map as any)).toBe("");
  });

  it("should return empty string for plain objects", () => {
    expect(slugify({ a: "hello", b: "world" } as any)).toBe("");
    expect(slugify({ foo: 123, bar: "baz" } as any)).toBe("");
  });

  it("should return empty string for numbers and booleans", () => {
    expect(slugify(123 as any)).toBe("");
    expect(slugify(true as any)).toBe("");
    expect(slugify(false as any)).toBe("");
  });

  it("should return empty string for Date objects", () => {
    const date = new Date("2025-08-20T12:34:56Z");
    expect(slugify(date as any)).toBe("");
  });

  it("should return empty string for Symbol values", () => {
    expect(slugify(Symbol("test") as any)).toBe("");
  });
});
