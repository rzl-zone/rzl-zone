import { describe, expect, it } from "vitest";
import { getInitialsName } from "@/strings/utils/getInitialsName";

describe("getInitialsName", () => {
  it("should return initials for two-word names", () => {
    expect(getInitialsName("John Doe")).toBe("JD");
    expect(getInitialsName(" Bob Marley ")).toBe("BM");
    expect(getInitialsName("First Last")).toBe("FL");
  });

  it("should return first two letters for single-word name (default: lowercaseSecondLetter = true)", () => {
    expect(getInitialsName("Alice")).toBe("Al");
    expect(getInitialsName("David")).toBe("Da");
  });

  it("should return uppercase second letter for single-word name when lowercaseSecondLetter is false", () => {
    expect(getInitialsName("Alice", { lowercaseSecondLetter: false })).toBe(
      "AL"
    );
    expect(getInitialsName("David", { lowercaseSecondLetter: false })).toBe(
      "DA"
    );
  });

  it("should return single character if only one letter", () => {
    expect(getInitialsName("A")).toBe("A");
    expect(getInitialsName("x")).toBe("X"); // Also good to verify it capitalizes lowercase single chars
  });

  it("should return empty string for empty or whitespace-only input", () => {
    expect(getInitialsName("")).toBe("");
    expect(getInitialsName("    ")).toBe("");
  });

  it("should handle null or undefined inputs gracefully", () => {
    expect(getInitialsName(null)).toBe("");
    expect(getInitialsName(undefined)).toBe("");
  });

  it("should ignore multiple spaces between words", () => {
    expect(getInitialsName("  Anna    Karenina  ")).toBe("AK");
  });

  it("should return correct initials for names with more than two words (default: useLastWord = true)", () => {
    // "John" and "Donal" -> JD
    expect(getInitialsName("John Ronald Donal")).toBe("JD");
    // "Lord", "John", "Doe", "Moe" -> LM
    expect(getInitialsName("Lord John Doe Moe")).toBe("LM");
  });

  it("should return correct initials for names with more than two words when useLastWord is false", () => {
    // "John" and "Ronald" -> JR
    expect(getInitialsName("John Ronald Donal", { useLastWord: false })).toBe(
      "JR"
    );
    // "Lord" and "John" -> LJ
    expect(getInitialsName("Lord John Doe Moe", { useLastWord: false })).toBe(
      "LJ"
    );
  });

  it("should return correct result even with special characters", () => {
    expect(getInitialsName("Jean-Luc Picard")).toBe("JP");
    expect(getInitialsName("O'Neill Connor")).toBe("OC");
  });
});
