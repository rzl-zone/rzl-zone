// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { scrollToTop } from "@/events/actions/scrollToTop";

describe("scrollToTop", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock window.scrollTo
    global.window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should do nothing if window or document is undefined (server-side)", () => {
    const originalWindow = global.window;
    const originalDocument = global.document;

    // @ts-ignore Delete for test only
    delete global.window;
    // @ts-ignore Delete for test only
    delete global.document;

    expect(() => scrollToTop()).not.toThrow();

    global.window = originalWindow;
    global.document = originalDocument;
  });

  it("should call window.scrollTo with smooth behavior and 1ms delay by default", () => {
    scrollToTop();

    // Not called immediately
    expect(window.scrollTo).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });

  it("should use behavior option", () => {
    scrollToTop({ behavior: "auto" });

    vi.advanceTimersByTime(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  });

  it("should use timeout option", () => {
    scrollToTop({ timeout: 500 });

    vi.advanceTimersByTime(499);
    expect(window.scrollTo).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("should treat negative timeout as 1", () => {
    scrollToTop({ timeout: -100 });

    vi.advanceTimersByTime(0);
    expect(window.scrollTo).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("should handle non-object or null options gracefully", () => {
    // @ts-expect-error test wrong types
    scrollToTop(null);
    vi.advanceTimersByTime(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    vi.clearAllTimers();

    // @ts-expect-error test wrong types
    scrollToTop("string");
    vi.advanceTimersByTime(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });
});
