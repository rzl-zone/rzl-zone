/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirstPrefixPathname } from "@/urls/pathname/getFirstPrefixPathname";
import { describe, it, expect } from "vitest";

describe("getFirstPrefixPathname", () => {
  it("should return first element if result is an array of strings", () => {
    expect(getFirstPrefixPathname(["/settings", "/admin"])).toBe("/settings");
    expect(getFirstPrefixPathname(["/onlyOne"])).toBe("/onlyOne");
    expect(getFirstPrefixPathname([])).toBe("/");
  });

  it("should normalize first element even if array has weird slashes or spaces", () => {
    expect(getFirstPrefixPathname(["   /foo///bar  "])).toBe("/foo/bar");
    expect(getFirstPrefixPathname(["   "])).toBe("/");
  });

  it("should process multi fallback in array until get valid", () => {
    expect(getFirstPrefixPathname(["   ", "", "/final/path"])).toBe(
      "/final/path"
    );
    expect(getFirstPrefixPathname(["   ", "", "     "], "/alt")).toBe("/alt");
  });

  it("should return string itself if result is a string", () => {
    expect(getFirstPrefixPathname("/profile/settings")).toBe(
      "/profile/settings"
    );
    expect(getFirstPrefixPathname("   /weird/slash//path ")).toBe(
      "/weird/slash/path"
    );
  });

  it("should normalize and fallback to default if string is empty or spaces", () => {
    expect(getFirstPrefixPathname("")).toBe("/");
    expect(getFirstPrefixPathname("     ")).toBe("/");
  });

  it("should return normalized default if result is null", () => {
    expect(getFirstPrefixPathname(null)).toBe("/");
    expect(getFirstPrefixPathname(null, "/home")).toBe("/home");
    expect(getFirstPrefixPathname(null, "  /dashboard  ")).toBe("/dashboard");
  });

  it("should throw TypeError if defaultValue is not a valid non-empty string", () => {
    expect(() => getFirstPrefixPathname(null, "")).toThrow(TypeError);
    expect(() => getFirstPrefixPathname(null, "   ")).toThrow(TypeError);
    expect(() => getFirstPrefixPathname(null, 123 as any)).toThrow(TypeError);
    expect(() => getFirstPrefixPathname(null, null as any)).toThrow(TypeError);
    expect(() => getFirstPrefixPathname(null, {} as any)).toThrow(TypeError);
  });

  it("should throw TypeError if result is invalid type (number, object, or mixed array)", () => {
    expect(() => getFirstPrefixPathname(123 as any)).toThrow(TypeError);
    expect(() => getFirstPrefixPathname({ path: "/foo" } as any)).toThrow(
      TypeError
    );
    expect(() => getFirstPrefixPathname([1, 2, 3] as any)).toThrow(TypeError);
    expect(() => getFirstPrefixPathname(["/foo", 123] as any)).toThrow(
      TypeError
    );
  });

  it("should handle edge case of array with empty string or spaces and return normalized default", () => {
    expect(getFirstPrefixPathname(["   "], "/alt")).toBe("/alt");
    expect(getFirstPrefixPathname([""], "/alt")).toBe("/alt");
  });

  it("should handle multiple levels of fallback cleanly", () => {
    expect(getFirstPrefixPathname([], "/start")).toBe("/start");
    expect(getFirstPrefixPathname(null, "/start")).toBe("/start");
  });

  it("should fully normalize returned path using normalizePathname", () => {
    expect(getFirstPrefixPathname("/path//to///here")).toBe("/path/to/here");
    expect(getFirstPrefixPathname(["/a//b///c"])).toBe("/a/b/c");
    expect(getFirstPrefixPathname(["   /messy///path   "])).toBe("/messy/path");
  });

  it("should fallback cleanly even on exotic unicode paths", () => {
    expect(getFirstPrefixPathname(["/emoji/🔥/🚀"])).toBe("/emoji/🔥/🚀");
    expect(getFirstPrefixPathname(["  /ユニコード//テスト "])).toBe(
      "/ユニコード/テスト"
    );
  });
});
