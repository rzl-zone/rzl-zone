// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import { enableUserInteraction } from "@/events/actions/enableUserInteraction";

describe("enableUserInteraction", () => {
  beforeEach(() => {
    // reset document root classList before every test
    document.documentElement.className = "";
  });

  it("should remove default class 'on_processing' from document.documentElement", () => {
    document.documentElement.classList.add("on_processing");
    enableUserInteraction();
    expect(document.documentElement.classList.contains("on_processing")).toBe(
      false
    );
  });

  it("should remove custom class from document.documentElement", () => {
    document.documentElement.classList.add("my_class");
    enableUserInteraction("my_class");
    expect(document.documentElement.classList.contains("my_class")).toBe(false);
  });

  it("should do nothing if the class does not exist", () => {
    enableUserInteraction("not_present");
    expect(document.documentElement.classList.contains("not_present")).toBe(
      false
    );
  });

  it("should throw TypeError if className is not a string", () => {
    // @ts-expect-error intentionally wrong type
    expect(() => enableUserInteraction(123)).toThrow(TypeError);
  });

  it("should do nothing if window or document is undefined (simulated server)", () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    // @ts-ignore delete for test only
    delete globalThis.window;
    // @ts-ignore delete for test only
    delete globalThis.document;

    expect(() => enableUserInteraction("test")).not.toThrow();

    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  });
});
