import { describe, expect, it } from "vitest";
import { getDisplayName } from "@/strings/utils/getDisplayName";

describe("getDisplayName", () => {
  it("should format two-word names with correct capitalization", () => {
    expect(getDisplayName("john doe")).toBe("John Doe");
    expect(getDisplayName("JOHN DOE")).toBe("John Doe");
    expect(getDisplayName("jOhN dOe")).toBe("John Doe");
  });

  it("should return correct names for more than two words (default: useLastWord = true)", () => {
    expect(getDisplayName("john michael doe")).toBe("John Doe");
    expect(getDisplayName("Lord John Doe Moe")).toBe("Lord Moe");
  });

  it("should return correct names for more than two words when useLastWord is false", () => {
    expect(getDisplayName("john michael doe", { useLastWord: false })).toBe(
      "John Michael"
    );
    expect(getDisplayName("Lord John Doe Moe", { useLastWord: false })).toBe(
      "Lord John"
    );
  });

  it("should handle single word names", () => {
    expect(getDisplayName("jo")).toBe("Jo");
    expect(getDisplayName("jo", { useLastWord: false })).toBe("Jo");
    expect(getDisplayName("j")).toBe("J");
    expect(getDisplayName("ALICE")).toBe("Alice");
    expect(getDisplayName("j", { useLastWord: false })).toBe("J");
    expect(
      getDisplayName("j", { useLastWord: false, capitalizeFirst: false })
    ).toBe("j");
    expect(getDisplayName("john")).toBe("John");
    expect(getDisplayName("jOhn", { useLastWord: false })).toBe("John");
    expect(
      getDisplayName("jOhn", { useLastWord: false, capitalizeFirst: false })
    ).toBe("jOhn");
  });

  it("should respect capitalizeFirst option when false", () => {
    expect(getDisplayName("JOHN DOE", { capitalizeFirst: false })).toBe(
      "JOHN DOE"
    );
    expect(getDisplayName("john doe", { capitalizeFirst: false })).toBe(
      "john doe"
    );
    expect(getDisplayName("jOhN dOe", { capitalizeFirst: false })).toBe(
      "jOhN dOe"
    );
  });

  it("should return empty string for empty or whitespace-only input", () => {
    expect(getDisplayName("")).toBe("");
    expect(getDisplayName("    ")).toBe("");
  });

  it("should handle null or undefined inputs gracefully", () => {
    expect(getDisplayName(null)).toBe("");
    expect(getDisplayName(undefined)).toBe("");
  });

  it("should ignore multiple spaces between words", () => {
    expect(getDisplayName("  john    doe  ")).toBe("John Doe");
  });
});
