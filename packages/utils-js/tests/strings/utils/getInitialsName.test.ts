import { describe, expect, it } from "vitest";
import { getInitialsName } from "@/strings/utils/getInitialsName";

describe("getInitialsName", () => {
  it("should return initials for two-word names", () => {
    expect(getInitialsName("John Doe")).toBe("JD");
    expect(getInitialsName(" Bob Marley ")).toBe("BM");
    expect(getInitialsName("First Last")).toBe("FL");
  });

  it("should return first two letters for single-word name", () => {
    expect(getInitialsName("Alice")).toBe("AL");
    expect(getInitialsName("David")).toBe("DA");
  });

  it("should return single character if only one letter", () => {
    expect(getInitialsName("A")).toBe("A");
    expect(getInitialsName("X")).toBe("X");
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
    expect(getInitialsName("  Anna     Karenina  ")).toBe("AK");
  });

  it("should return correct initials for names with more than two words", () => {
    expect(getInitialsName("John Ronald Donal")).toBe("JR"); // only first and second word
  });

  it("should return correct result even with special characters", () => {
    expect(getInitialsName("Jean-Luc Picard")).toBe("JP");
    expect(getInitialsName("O'Neill Connor")).toBe("OC");
  });
});
