// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { isArrayLikeObject } from "@/predicates/is/isArrayLikeObject";

describe("isArrayLikeObject", () => {
  it("should return true for array", () => {
    expect(isArrayLikeObject([1, 2, 3])).toBe(true);
  });

  it("should return true for array-like DOM collections", () => {
    const div = document.createElement("div");
    div.appendChild(document.createElement("span"));
    div.appendChild(document.createElement("span"));
    expect(isArrayLikeObject(div.children)).toBe(true);
  });

  it("should return false for string", () => {
    expect(isArrayLikeObject("abc")).toBe(false);
  });

  it("should return false for function", () => {
    expect(isArrayLikeObject(function () {})).toBe(false);
    expect(isArrayLikeObject(() => {})).toBe(false);
  });

  it("should return false for non-objects", () => {
    expect(isArrayLikeObject(null)).toBe(false);
    expect(isArrayLikeObject(undefined)).toBe(false);
    expect(isArrayLikeObject(true)).toBe(false);
    expect(isArrayLikeObject(123)).toBe(false);
  });

  it("should return false for plain object without length", () => {
    expect(isArrayLikeObject({})).toBe(false);
  });

  it("should return true for object with valid length", () => {
    expect(isArrayLikeObject({ length: 0 })).toBe(true);
    expect(isArrayLikeObject({ length: 3, 0: "a", 1: "b" })).toBe(true);
  });

  it("should return false for object with invalid length", () => {
    expect(isArrayLikeObject({ length: -1 })).toBe(false);
    expect(isArrayLikeObject({ length: Number.MAX_SAFE_INTEGER + 1 })).toBe(
      false
    );
    expect(isArrayLikeObject({ length: "3" })).toBe(false);
    expect(isArrayLikeObject({ length: 1.5 })).toBe(false); // Optional: if mimicking lodash
  });

  it("should return false for Buffer (Node.js)", () => {
    expect(isArrayLikeObject(Buffer.from("hi"))).toBe(true); // optional: based on runtime
  });
});
