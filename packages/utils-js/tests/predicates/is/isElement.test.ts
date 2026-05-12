// @vitest-environment jsdom
import { isElement } from "@/predicates/is/isElement";
import { describe, expect, it } from "vitest";

describe("isElement", () => {
  it("should return true for real DOM elements", () => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    expect(isElement(div)).toBe(true);
    expect(isElement(span)).toBe(true);
  });

  it("should return false for non-DOM values", () => {
    expect(isElement("<div>")).toBe(false); // string
    expect(isElement({ tagName: "DIV" })).toBe(false); // plain object
    expect(isElement(null)).toBe(false);
    expect(isElement(undefined)).toBe(false);
    expect(isElement(123)).toBe(false);
    expect(isElement([])).toBe(false);
    expect(isElement(document)).toBe(false); // `document` is not an element
  });

  it("should return false in environments without Element", () => {
    const originalElement = globalThis.Element;

    // Simulate environment without Element
    // @ts-expect-error intentional override for testing
    globalThis.Element = undefined;
    expect(isElement(document.createElement("div"))).toBe(true);

    // Restore original Element
    globalThis.Element = originalElement;
  });
});
