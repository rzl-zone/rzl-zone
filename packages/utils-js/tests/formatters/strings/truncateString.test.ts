/* eslint-disable quotes */
import { describe, expect, it } from "vitest";
import { truncateString } from "@/formatters/strings/truncateString";

describe("truncateString", () => {
  // --- Test cases for invalid or edge-case inputs ---
  describe("should return an empty string for invalid or insufficient input", () => {
    it('should return "" for null text', () => {
      expect(truncateString(null, { length: 5 })).toBe("");
    });

    it('should return "" for undefined text', () => {
      expect(truncateString(undefined, { length: 5 })).toBe("");
    });

    it('should return "" for an empty string', () => {
      expect(truncateString("", { length: 5 })).toBe("");
    });

    it('should return "" for text consisting only of spaces', () => {
      expect(truncateString("   ", { length: 5 })).toBe("");
    });

    it('should return "" when length is 0', () => {
      expect(truncateString("hello world", { length: 0 })).toBe("");
    });

    it('should return "" when length is a negative number', () => {
      expect(truncateString("hello world", { length: -5 })).toBe("");
    });
  });

  // --- Test cases for default behavior (length=10, ending="...", trim=true) ---
  describe("should handle default parameters correctly", () => {
    it("should not truncate if text length is less than or equal to default length (10)", () => {
      expect(truncateString("short", { length: 10 })).toBe("short");
      expect(truncateString("ten chars.", { length: 10 })).toBe("ten chars."); // 10 chars
    });

    it("should truncate and append default ending if text is longer than default length", () => {
      expect(truncateString("a very long string", { length: 10 })).toBe(
        "a very lon..."
      );
    });

    it("should trim by default when not truncated", () => {
      expect(truncateString("   trimmed   ", { length: 20 })).toBe("trimmed");
    });

    it("should trim by default when truncated", () => {
      expect(truncateString("   a very long string   ", { length: 10 })).toBe(
        "a very lon..."
      );
    });
  });

  // --- Test cases for custom length ---
  describe("should truncate to specified length", () => {
    it("should truncate correctly with a smaller length", () => {
      expect(truncateString("hello world", { length: 5 })).toBe("hello...");
    });

    it("should truncate correctly with a length equal to text length", () => {
      expect(truncateString("exactly", { length: 7 })).toBe("exactly");
    });

    it("should truncate correctly with a length greater than text length", () => {
      expect(truncateString("short", { length: 20 })).toBe("short");
    });
  });

  // --- Test cases for custom ending ---
  describe("should append custom ending", () => {
    it("should use a custom ending when truncated", () => {
      expect(truncateString("hello world", { length: 5, ending: "---" })).toBe(
        "hello---"
      );
    });

    it("should not append ending if not truncated", () => {
      expect(truncateString("short", { length: 10, ending: "---" })).toBe(
        "short"
      );
    });

    it("should handle empty string as ending", () => {
      expect(truncateString("hello world", { length: 5, ending: "" })).toBe(
        "hello..."
      );
    });
  });

  // --- Test cases for trim option ---
  describe("should handle trim option", () => {
    it("should trim when trim is true (and not truncated)", () => {
      expect(
        truncateString("   data   ", { length: 15, ending: "...", trim: true })
      ).toBe("data");
    });

    it("should trim when trim is true (and truncated)", () => {
      expect(
        truncateString("   long data string   ", {
          length: 8,
          ending: "...",
          trim: true
        })
      ).toBe("long dat...");
    });

    it("should not trim when trim is false (and not truncated)", () => {
      expect(
        truncateString("   data   ", { length: 15, ending: "...", trim: false })
      ).toBe("   data   ");
    });

    it("should not trim when trim is false (and truncated)", () => {
      expect(
        truncateString("   long data string   ", {
          length: 8,
          ending: "...",
          trim: false
        })
      ).toBe("   long...");
    });

    it("should handle mixed leading/trailing spaces with truncation and no trim", () => {
      expect(
        truncateString(" text with spaces ", {
          length: 11,
          ending: "...",
          trim: false
        })
      ).toBe(" text with...");
    });
  });

  // --- Test cases for combined scenarios ---
  describe("should handle combined scenarios", () => {
    it("should truncate a very long string with specific length and ending", () => {
      expect(
        truncateString("SuperDuperLongStringThatNeedSomeCutting", {
          length: 15,
          ending: "---",
          trim: true
        })
      ).toBe("SuperDuperLongS---");
    });

    it("should handle text exactly at truncation point without ending if original trimmed length is not greater", () => {
      // Original: "abc def" (len 7). Truncate to 7. Trimmed original length is 7.
      // Truncated "abc def". No ending.
      expect(
        truncateString("abc def", { length: 7, ending: "...", trim: true })
      ).toBe("abc def");
    });

    it("should add ending if original trimmed text is longer than length, even if truncated string is same length", () => {
      // Original: "abcde fgh" (len 9). Trimmed: "abcde fgh".
      // Truncate to 7: "abcde f". Result "abcde f..." because original TRIMMED length (9) > length (7)
      expect(
        truncateString("abcde fgh", { length: 7, ending: "...", trim: true })
      ).toBe("abcde f...");
    });
  });

  // --- Test cases for TypeErrors ---
  describe("should throw TypeError for invalid parameter types", () => {
    it("should throw TypeError if length is not a number", () => {
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", { length: "5" })).toThrow(TypeError);
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", { length: "5" })).toThrow(
        'Parameter `length` property of the `options` (second parameter) must be of type `integer-number`, but received: `string`, with value: `"5"`.'
      );
    });

    it("should throw TypeError if ending is not a string", () => {
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", { length: 5, ending: 123 })).toThrow(
        TypeError
      );
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", { length: 5, ending: 123 })).toThrow(
        "Parameter `ending` property of the `options` (second parameter) must be of type `string`, but received: `number`."
      );
    });

    it("should throw TypeError if trim is not a boolean", () => {
      expect(() =>
        // @ts-ignore: Intentionally passing invalid type for testing
        truncateString("text", { length: 5, ending: "...", trim: "true" })
      ).toThrow(TypeError);
      expect(() =>
        // @ts-ignore: Intentionally passing invalid type for testing
        truncateString("text", { length: 5, ending: "...", trim: "true" })
      ).toThrow(
        "Parameter `trim` property of the `options` (second parameter) must be of type `boolean`, but received: `string`."
      );
    });
  });
});
