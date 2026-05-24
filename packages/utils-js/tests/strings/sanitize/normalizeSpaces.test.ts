import { describe, expect, it } from "vitest";
import { normalizeSpaces } from "@/strings/sanitizations/normalizeSpaces";

describe("normalizeSpaces", () => {
  it("returns empty string if input is null", () => {
    expect(normalizeSpaces(null)).toBe("");
  });

  it("returns empty string if input is undefined", () => {
    expect(normalizeSpaces(undefined)).toBe("");
  });

  it("collapses all whitespace into a single space by default (withTrim = true)", () => {
    const input = "   Hello    World\tthis   is\n\nok ";
    const expected = "Hello World this is ok";
    expect(normalizeSpaces(input)).toBe(expected);
  });

  it("preserves original spacing if trimOnly = true (trims only leading/trailing)", () => {
    const input = "   Hello    World\tthis   is\n\nok ";
    const expected = "Hello    World\tthis   is\n\nok";
    expect(normalizeSpaces(input, { trimOnly: true })).toBe(expected);
  });

  it("does not trim if withTrim = false", () => {
    const input = "   Hello    World   ";
    const expected = " Hello World ";
    expect(normalizeSpaces(input, { withTrim: false })).toBe(expected);
  });

  it("ignores withTrim if trimOnly = true (still trims)", () => {
    const input = "   Hello  World   ";
    const expected = "Hello  World";
    expect(normalizeSpaces(input, { trimOnly: true, withTrim: false })).toBe(
      expected
    );
  });

  it("collapses whitespaces and trims by default (withTrim = true)", () => {
    const input = "\t   a   b \n  c ";
    const expected = "a b c";
    expect(normalizeSpaces(input)).toBe(expected);
  });

  it("returns input as-is if no collapse or trim happens (trimOnly = false, withTrim = false)", () => {
    const input = "   a   b \n  c ";
    const expected = " a b c ";
    expect(normalizeSpaces(input, { withTrim: false })).toBe(expected);
  });

  it("returns empty string for empty string input", () => {
    expect(normalizeSpaces("")).toBe("");
  });

  it("does not throw if options is null", () => {
    const input = "   Test  string ";
    // @ts-expect-error intentionally passing invalid options for test only
    expect(normalizeSpaces(input, null)).toBe("Test string");
  });
});
