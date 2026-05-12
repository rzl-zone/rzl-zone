// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { disableUserInteraction } from "@/events/actions/disableUserInteraction";

describe("disableUserInteraction", () => {
  let originalDocument: typeof document;
  let originalWindow: typeof window;

  beforeEach(() => {
    // Backup
    originalDocument = global.document;
    originalWindow = global.window;

    // Reset document
    document.documentElement.className = "";
  });

  afterEach(() => {
    // Restore
    global.document = originalDocument;
    global.window = originalWindow;

    document.documentElement.className = "";
  });

  it("should add default class 'on_processing' to document.documentElement", () => {
    disableUserInteraction();
    expect(document.documentElement.classList.contains("on_processing")).toBe(
      true
    );
  });

  it("should add custom class to document.documentElement", () => {
    disableUserInteraction("my_custom_class");
    expect(document.documentElement.classList.contains("my_custom_class")).toBe(
      true
    );
  });

  it("should not add class if already present", () => {
    document.documentElement.classList.add("on_processing");
    disableUserInteraction();
    expect(document.documentElement.classList.length).toBe(1);
    expect(document.documentElement.classList.contains("on_processing")).toBe(
      true
    );
  });

  it("should throw TypeError if className is not a string", () => {
    // @ts-expect-error intentionally wrong type
    expect(() => disableUserInteraction(123)).toThrow(TypeError);
  });

  it("should do nothing if window or document is undefined (server-side)", () => {
    // @ts-ignore delete for test only
    delete global.window;
    // @ts-ignore delete for test only
    delete global.document;

    // Should not throw
    expect(() => disableUserInteraction()).not.toThrow();
  });
});
