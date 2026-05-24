// @vitest-environment jsdom

import { copyText } from "@/operations/copyText";
import * as predicates from "@/predicates";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("copyText", () => {
  const originalClipboard = navigator.clipboard;
  const originalExecCommand = document.execCommand;

  const mockClipboard = (implementation?: ReturnType<typeof vi.fn>) => {
    const writeText = implementation ?? vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });

    return writeText;
  };

  const removeClipboard = () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined
    });
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(predicates, "isServer").mockReturnValue(false);
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard
    });

    document.execCommand = originalExecCommand;

    document.body.innerHTML = "";

    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // SSR
  // ---------------------------------------------------------------------------

  describe("server environments", () => {
    it("should safely return no-browser", async () => {
      vi.spyOn(predicates, "isServer").mockReturnValue(true);

      const result = await copyText("SSR");

      expect(result).toStrictEqual({
        status: "error",
        success: false,
        method: "manual",
        reason: "no-browser",
        attempts: 0,
        duration: expect.any(Number),
        timestamp: expect.any(Number)
      });
    });
  });

  // ---------------------------------------------------------------------------
  // CLIPBOARD API
  // ---------------------------------------------------------------------------

  describe("clipboard api", () => {
    it("should copy text", async () => {
      const writeText = mockClipboard();

      const result = await copyText("hello");

      expect(writeText).toHaveBeenCalledOnce();
      expect(writeText).toHaveBeenCalledWith("hello");

      expect(result).toStrictEqual({
        status: "success",
        success: true,
        method: "clipboard",
        attempts: 1,
        duration: expect.any(Number),
        timestamp: expect.any(Number)
      });
    });

    it.each(["", "Line1\nLine2", "🔥 Hello 世界 🚀", "A".repeat(100000)])(
      "should preserve text: %s",
      async (text) => {
        const writeText = mockClipboard();

        await copyText(text);

        expect(writeText).toHaveBeenCalledWith(text);
      }
    );
  });

  // ---------------------------------------------------------------------------
  // RETRIES
  // ---------------------------------------------------------------------------

  describe("retries", () => {
    it("should retry before success", async () => {
      const writeText = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce(undefined);

      mockClipboard(writeText);

      const result = await copyText("retry", {
        retries: 1
      });

      expect(writeText).toHaveBeenCalledTimes(2);

      expect(result.attempts).toBe(2);
    });

    it("should stop at max retries", async () => {
      const writeText = vi.fn().mockRejectedValue(new Error("fail"));

      mockClipboard(writeText);

      document.execCommand = vi.fn().mockReturnValue(true);

      await copyText("x", {
        retries: 2
      });

      expect(writeText).toHaveBeenCalledTimes(3);
    });

    it("should clamp negative retries", async () => {
      const writeText = vi.fn().mockRejectedValue(new Error("fail"));

      mockClipboard(writeText);

      document.execCommand = vi.fn().mockReturnValue(true);

      await copyText("x", {
        retries: -100
      });

      expect(writeText).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // TIMEOUT
  // ---------------------------------------------------------------------------

  describe("timeouts", () => {
    it("should timeout", async () => {
      vi.useFakeTimers();

      const writeText = vi.fn(() => new Promise<void>(() => {}));

      mockClipboard(writeText);

      const promise = copyText("timeout", {
        timeout: 100
      });

      await vi.advanceTimersByTimeAsync(150);

      const result = await promise;

      expect(result).toMatchObject({
        status: "error",
        success: false,
        method: "clipboard",
        reason: "timeout"
      });
    });

    it("should clear timeout after success", async () => {
      const clearSpy = vi.spyOn(global, "clearTimeout");

      mockClipboard();

      await copyText("cleanup");

      expect(clearSpy).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // FALLBACK
  // ---------------------------------------------------------------------------

  describe("fallback", () => {
    it("should use fallback when clipboard fails", async () => {
      mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));

      document.execCommand = vi.fn().mockReturnValue(true);

      const result = await copyText("x");

      expect(document.execCommand).toHaveBeenCalledWith("copy");

      expect(result).toMatchObject({
        status: "success",
        method: "fallback",
        reason: "clipboard-error"
      });
    });

    it("should use fallback when clipboard unavailable", async () => {
      removeClipboard();

      document.execCommand = vi.fn().mockReturnValue(true);

      const result = await copyText("x");

      expect(result).toMatchObject({
        method: "fallback",
        reason: "no-clipboard"
      });
    });

    it("should cleanup textarea", async () => {
      vi.useFakeTimers();

      removeClipboard();

      document.execCommand = vi.fn().mockReturnValue(true);

      await copyText("x");

      await vi.runAllTimersAsync();

      expect(document.querySelector("textarea")).toBeNull();
    });

    it("should focus and select textarea", async () => {
      removeClipboard();

      const focusSpy = vi.spyOn(HTMLTextAreaElement.prototype, "focus");

      const selectSpy = vi.spyOn(HTMLTextAreaElement.prototype, "select");

      document.execCommand = vi.fn().mockReturnValue(true);

      await copyText("x");

      expect(focusSpy).toHaveBeenCalled();

      expect(selectSpy).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // MANUAL MODE
  // ---------------------------------------------------------------------------

  describe("manual mode", () => {
    it("should return manual mode", async () => {
      removeClipboard();

      document.execCommand = vi.fn().mockReturnValue(false);

      const result = await copyText("x");

      expect(result).toMatchObject({
        status: "error",
        success: false,
        method: "manual",
        reason: "fallback-failed"
      });
    });

    it("should count attempts correctly", async () => {
      mockClipboard(vi.fn().mockRejectedValue(new Error("fail")));

      document.execCommand = vi.fn().mockReturnValue(false);

      const result = await copyText("attempt", {
        retries: 1
      });

      expect(result.attempts).toBe(4);

      /*
        clipboard
        clipboard retry
        fallback
        manual
      */
    });

    it("should cleanup manual textarea", async () => {
      vi.useFakeTimers();

      removeClipboard();

      document.execCommand = vi.fn().mockReturnValue(false);

      await copyText("x");

      await vi.advanceTimersByTimeAsync(3000);

      expect(document.querySelector("textarea")).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // DEBUG
  // ---------------------------------------------------------------------------

  describe("debugging", () => {
    it("should log when enabled", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      mockClipboard();

      await copyText("debug", {
        debug: true
      });

      expect(logSpy).toHaveBeenCalled();
    });

    it("should not log when disabled", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      mockClipboard();

      await copyText("debug");

      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
