import { describe, expect, it } from "vitest";

import { AbortError } from "@/errors/AbortError";

describe("AbortError", () => {
  // ---------------------------------------------------------------------------
  // DEFAULTS
  // ---------------------------------------------------------------------------

  describe("default values", () => {
    it("should create AbortError with default values", () => {
      const error = new AbortError();

      expect(error).toBeInstanceOf(AbortError);

      expect(error).toBeInstanceOf(Error);

      expect(error.message).toBe("The operation was aborted");

      expect(error.name).toBe("AbortError");
    });
  });

  // ---------------------------------------------------------------------------
  // CUSTOM VALUES
  // ---------------------------------------------------------------------------

  describe("custom values", () => {
    it("should override message", () => {
      const error = new AbortError("Request cancelled");

      expect(error.message).toBe("Request cancelled");

      expect(error.name).toBe("AbortError");
    });

    it("should apply prefix", () => {
      const error = new AbortError("Cancelled", {
        prefix: "Delay"
      });

      expect(error.name).toBe("DelayAbortError");
    });

    it("should apply suffix", () => {
      const error = new AbortError("Cancelled", {
        suffix: ":Queue"
      });

      expect(error.name).toBe("AbortError:Queue");
    });

    it("should apply prefix and suffix", () => {
      const error = new AbortError("Cancelled", {
        prefix: "Fetch",
        suffix: ":Timeout"
      });

      expect(error.name).toBe("FetchAbortError:Timeout");
    });

    it("should trim prefix and suffix", () => {
      const error = new AbortError("Cancelled", {
        prefix: "  Fetch  ",
        suffix: "  :Queue  "
      });

      expect(error.name).toBe("FetchAbortError:Queue");
    });

    it("should ignore empty values", () => {
      const error = new AbortError("Cancelled", {
        prefix: "   ",
        suffix: ""
      });

      expect(error.name).toBe("AbortError");
    });
  });

  // ---------------------------------------------------------------------------
  // ERROR CONTRACT
  // ---------------------------------------------------------------------------

  describe("error contract", () => {
    it("should preserve stack trace", () => {
      const error = new AbortError();

      expect(error.stack).toBeDefined();

      expect(typeof error.stack).toBe("string");
    });

    it("should work with instanceof checks", () => {
      const error = new AbortError();

      expect(error instanceof AbortError).toBe(true);

      expect(error instanceof Error).toBe(true);
    });

    it("should preserve constructor reference", () => {
      const error = new AbortError();

      expect(error.constructor).toBe(AbortError);
    });

    it("should stringify correctly", () => {
      const error = new AbortError();

      expect(String(error)).toBe("AbortError: The operation was aborted");
    });

    it("should stringify with custom names", () => {
      const error = new AbortError("Cancelled", {
        prefix: "Delay"
      });

      expect(String(error)).toBe("DelayAbortError: Cancelled");
    });
  });

  // ---------------------------------------------------------------------------
  // THROWING
  // ---------------------------------------------------------------------------

  describe("throw behavior", () => {
    it("should be catch-able as AbortError", () => {
      expect(() => {
        throw new AbortError();
      }).toThrow(AbortError);
    });

    it("should preserve instance inside catch block", () => {
      try {
        throw new AbortError("Cancelled");
      } catch (error) {
        expect(error).toBeInstanceOf(AbortError);

        expect((error as AbortError).message).toBe("Cancelled");
      }
    });
  });
});
