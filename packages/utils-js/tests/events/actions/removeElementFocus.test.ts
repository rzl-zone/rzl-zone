// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { removeElementFocus } from "@/events/actions/removeElementFocus";

describe("removeElementFocus", () => {
  beforeEach(() => {
    // Reset focus before each test
    document.body.innerHTML = `
      <input id="input1" />
      <button id="button1">Button</button>
    `;
    document.body.focus();
  });

  it("should call blur() on the active HTMLElement", () => {
    const input = document.getElementById("input1")!;
    input.focus();

    const blurSpy = vi.spyOn(input, "blur");
    removeElementFocus();
    expect(blurSpy).toHaveBeenCalled();
  });

  it("should do nothing if activeElement is not an HTMLElement", () => {
    // Simulate activeElement that is not HTMLElement (null)
    // jsdom sets activeElement to body if none focused, so forcibly mock:
    Object.defineProperty(document, "activeElement", {
      configurable: true,
      get: () => null
    });

    // Spy console.warn
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    removeElementFocus();

    // Uncomment if console.warn is used in the function, currently we nothing to do...
    // expect(warnSpy).toHaveBeenCalledWith(
    //   "removeElementFocus: No active element to blur or is not supported on null element."
    // );
    warnSpy.mockRestore();
  });

  it("should do nothing if window or document is undefined (server-side)", () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;

    // @ts-ignore delete for test only
    delete globalThis.window;
    // @ts-ignore delete for test only
    delete globalThis.document;

    expect(() => removeElementFocus()).not.toThrow();

    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  });
});
