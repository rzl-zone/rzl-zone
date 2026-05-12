import { describe, it, expect } from "vitest";
import { isError } from "@/predicates/is/isError";

describe("isError", () => {
  it("should return true for Error instance", () => {
    expect(isError(new Error("Something went wrong"))).toBe(true);
  });

  it("should return true for custom Error subclasses", () => {
    class CustomError extends Error {}
    expect(isError(new CustomError("Custom error"))).toBe(true);
  });

  it("should return false for strings that look like errors", () => {
    expect(isError("Error: Something went wrong")).toBe(false);
    expect(isError("Some error message")).toBe(false);
  });

  it("should return false for plain objects that mimic errors", () => {
    expect(isError({ message: "error", name: "Error" })).toBe(false);
  });

  it("should return false for null, undefined, and other primitives", () => {
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError(123)).toBe(false);
    expect(isError(false)).toBe(false);
  });

  it("should return false for functions and arrays", () => {
    expect(isError(() => {})).toBe(false);
    expect(isError([])).toBe(false);
  });
});
