import { describe, it, expect } from "vitest";
import { textContainsAll } from "@/predicates/contains/textContainsAll";

describe("textContainsAll - comprehensive tests", () => {
  it("should return true if all words are found in the text (default options)", () => {
    expect(
      textContainsAll("Hello world, WithAI APP", ["Hello", "world"], {})
    ).toBe(true);
    expect(
      textContainsAll("JavaScript and TypeScript", ["Java", "Script"], {})
    ).toBe(true);
  });

  it("should return false if any word is missing", () => {
    expect(textContainsAll("Machine Learning", ["AI", "Learning"], {})).toBe(
      false
    );
    expect(textContainsAll("Hello there", ["Hello", "world"], {})).toBe(false);
  });

  it("should respect exactMatch option", () => {
    expect(textContainsAll("open-source", ["open"], { exactMatch: true })).toBe(
      false
    );
    expect(textContainsAll("open source", ["open"], { exactMatch: true })).toBe(
      true
    );
  });

  it("should work with custom regex flags", () => {
    expect(textContainsAll("Hello WORLD", ["world"], { flags: "" })).toBe(
      false
    ); // case-sensitive
    expect(textContainsAll("Hello WORLD", ["world"], { flags: "i" })).toBe(
      true
    ); // case-insensitive
  });

  it("should escape special regex characters in searchWords", () => {
    expect(textContainsAll("Price is $15.99", ["$15.99"], {})).toBe(true);
    expect(textContainsAll("RegExp test (a+b)*", ["(a+b)*"], {})).toBe(true);
  });

  it("should trim empty strings and ignore them", () => {
    expect(textContainsAll("Hello world", ["", "Hello"], {})).toBe(true);
    expect(textContainsAll("Hello world", ["", ""], {})).toBe(false);
  });

  it("should return false for empty text or non-string text", () => {
    expect(textContainsAll(null, ["test"], {})).toBe(false);
    expect(textContainsAll("", ["test"], {})).toBe(false);
    // @ts-expect-error Invalid type props for test only
    expect(textContainsAll(123, ["test"], {})).toBe(false);
  });

  it("should return false if searchWords is not an array or empty", () => {
    expect(textContainsAll("Hello", null, {})).toBe(false);
    expect(textContainsAll("Hello", [], {})).toBe(false);
  });

  it("should throw if options is not an object", () => {
    expect(() =>
      // @ts-expect-error Invalid type props for test only
      textContainsAll("Hello", ["Hello"], "invalid")
    ).toThrow(
      "Third parameter (`options`) must be of type `plain-object`, but received: `string`."
    );
  });

  it("should throw if exactMatch is not a boolean", () => {
    expect(() =>
      // @ts-expect-error Invalid type props for test only
      textContainsAll("Hello", ["Hello"], { exactMatch: "yes" })
    ).toThrow(
      "Parameter `exactMatch` property of the `options` (third parameter) must be of type `boolean`, but received: `string`."
    );
  });

  it("should throw if flags is not a string", () => {
    expect(() =>
      // @ts-expect-error Invalid type props for test only
      textContainsAll("Hello", ["Hello"], { flags: 123 })
    ).toThrow(
      "Parameter `flags` property of the `options` (third parameter) must be of type `string`, but received: `number`."
    );
  });

  // ⬇️ Tambahan test
  it("should return true with multiple spaces and line breaks", () => {
    expect(
      textContainsAll("Hello    world\nNew Line", ["Hello", "world"], {})
    ).toBe(true);
  });

  it("should return true with partial words if exactMatch is false", () => {
    expect(
      textContainsAll("Javascript", ["Script"], { exactMatch: false })
    ).toBe(true);
  });

  it("should return false with partial words if exactMatch is true", () => {
    expect(
      textContainsAll("Javascript", ["Script"], { exactMatch: true })
    ).toBe(false);
  });

  it("should handle complex combination of special characters and spaces", () => {
    expect(textContainsAll("Price: 12,000.50 USD", ["12,000.50"], {})).toBe(
      true
    );
    expect(
      textContainsAll(
        "Math formula: (a+b)^2 = a^2 + 2ab + b^2",
        ["(a+b)^2"],
        {}
      )
    ).toBe(true);
  });

  it("should work with symbols and unicode characters", () => {
    expect(textContainsAll("Emoji test 😃👍🏽", ["😃", "👍🏽"], {})).toBe(true);
    expect(textContainsAll("中文测试", ["测试"], {})).toBe(true);
  });

  it("should handle hyphen or dash properly with exactMatch", () => {
    expect(
      textContainsAll("re-use and re-enter", ["use"], {
        exactMatch: true
      })
    ).toBe(false);
    expect(
      textContainsAll("re use and re enter", ["use"], {
        exactMatch: true
      })
    ).toBe(true);
  });

  it("should match words adjacent to punctuation with exactMatch false", () => {
    expect(
      textContainsAll("Hello, world!", ["world"], { exactMatch: false })
    ).toBe(true);
    expect(
      textContainsAll("Hello, world!", ["world"], { exactMatch: true })
    ).toBe(false);
  });

  it("should be able to handle tabs and multiple lines", () => {
    expect(
      textContainsAll("Hello\tworld\nnext line", ["Hello", "world"], {})
    ).toBe(true);
  });

  it("should correctly return false when words are scrambled order", () => {
    expect(
      textContainsAll("Hello world test string", ["test", "world", "foo"], {})
    ).toBe(false);
  });

  it("should be able to use regex flags like global and multiline", () => {
    expect(
      textContainsAll("Hello\nworld\nHello\nworld", ["Hello"], {
        flags: "gm"
      })
    ).toBe(true);
  });
});
