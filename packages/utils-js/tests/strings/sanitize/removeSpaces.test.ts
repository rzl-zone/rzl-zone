import { removeSpaces } from "@/strings/sanitizations/removeSpaces";
import { describe, expect, it } from "vitest";

describe("removeSpaces", () => {
  it("returns empty string if input is null", () => {
    expect(removeSpaces(null)).toBe("");
  });

  it("returns empty string if input is undefined", () => {
    expect(removeSpaces(undefined)).toBe("");
  });

  it("removes all whitespace characters by default", () => {
    const input = "  Hello\t  World \n Nice ";
    const expected = "HelloWorldNice";
    expect(removeSpaces(input)).toBe(expected);
  });

  it("trims only when trimOnly = true", () => {
    const input = "  Hello\t  World \n Nice ";
    const expected = "Hello\t  World \n Nice";
    expect(removeSpaces(input, { trimOnly: true })).toBe(expected);
  });

  it("returns the same string if it's already without whitespace", () => {
    expect(removeSpaces("NoSpacesHere")).toBe("NoSpacesHere");
  });

  it("handles empty string input", () => {
    expect(removeSpaces("")).toBe("");
  });

  it("does not throw if options is null", () => {
    // @ts-expect-error testing robustness
    expect(removeSpaces("  X Y  ", null)).toBe("XY");
  });

  it("respects explicitly set trimOnly: false", () => {
    const input = " a \n b ";
    const expected = "ab";
    expect(removeSpaces(input, { trimOnly: false })).toBe(expected);
  });

  it("returns string trimmed without touching internal whitespace", () => {
    const input = "   A    B   ";
    const expected = "A    B";
    expect(removeSpaces(input, { trimOnly: true })).toBe(expected);
  });

  it("removes tabs and newlines", () => {
    const input = " \tHello\nWorld \r\n!";
    expect(removeSpaces(input)).toBe("HelloWorld!");
  });
});
