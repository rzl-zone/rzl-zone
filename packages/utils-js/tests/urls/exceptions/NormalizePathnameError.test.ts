import { NormalizePathnameError } from "@/urls/_private/NormalizePathnameError";
import { describe, it, expect } from "vitest";

describe("NormalizePathnameError", () => {
  it("should create an error with the correct name and message", () => {
    const original = new Error("Original failure");
    const err = new NormalizePathnameError(
      "Failed to normalize pathname",
      original
    );

    expect(err).toBeInstanceOf(NormalizePathnameError);
    expect(err.name).toBe("NormalizePathnameError");
    expect(err.message).toBe("Failed to normalize pathname");
    expect(err.originalError).toBe(original);
  });

  it("should preserve the stack trace", () => {
    const original = new Error("Original error for stack");
    const err = new NormalizePathnameError("Stack preservation", original);

    expect(err.stack).toBeDefined();
    expect(typeof err.stack).toBe("string");
    expect(err.stack).toContain("NormalizePathnameError");
  });

  it("should correctly store originalError even if it has no message", () => {
    const emptyError = new Error();
    const err = new NormalizePathnameError("Test message", emptyError);

    expect(err.originalError).toBe(emptyError);
    expect(err.originalError.message).toBe("");
  });
});
