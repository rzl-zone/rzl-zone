import { describe, expect, it } from "vitest";
import { stripHtmlTags } from "@/strings/sanitizations/stripHtmlTags";

describe("stripHtmlTags", () => {
  it("removes simple HTML tags", () => {
    expect(stripHtmlTags("<p>Hello</p>")).toBe("Hello");
  });

  it("removes nested HTML tags", () => {
    expect(stripHtmlTags("<div><span>Test</span>value</div>")).toBe(
      "Test value"
    );
  });

  it("removes self-closing tags", () => {
    expect(stripHtmlTags("Line<br />Break")).toBe("Line Break");
  });

  it("removes multiple tags in a string", () => {
    expect(stripHtmlTags("<h1>Title</h1><p>Paragraph</p>")).toBe(
      "Title Paragraph"
    );
  });

  it("returns the input if it is null", () => {
    expect(stripHtmlTags(null)).toBeUndefined();
  });

  it("returns the input if it is undefined", () => {
    expect(stripHtmlTags(undefined)).toBeUndefined();
  });

  it("returns empty string if input is empty string", () => {
    expect(stripHtmlTags("")).toBe("");
  });

  it("returns empty string if input is string with only whitespace", () => {
    expect(stripHtmlTags("   ")).toBe("");
  });

  it("preserves text without HTML", () => {
    expect(stripHtmlTags("No tags here")).toBe("No tags here");
  });

  it("removes malformed or incomplete tags", () => {
    expect(stripHtmlTags("<b>Bold")).toBe("Bold");
    expect(stripHtmlTags("Text < unknown > content")).toBe(
      "Text < unknown > content"
    );
  });

  it("works with attributes inside tags", () => {
    // eslint-disable-next-line quotes
    expect(stripHtmlTags('<a href="https://example.com">Link</a>')).toBe(
      "Link"
    );

    expect(
      stripHtmlTags(
        // prettier-ignore
        "<div id='id-test' style='top: calc(var(--spacing) * 0);'>Test</div>"
      )
    ).toBe("Test");
  });

  it("does not strip angle brackets not part of tags", () => {
    expect(stripHtmlTags("2 < 5 and 5 > 2")).toBe("2 < 5 and 5 > 2");
  });
});
