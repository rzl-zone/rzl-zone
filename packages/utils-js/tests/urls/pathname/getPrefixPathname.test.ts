/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getPrefixPathname } from "@/urls/pathname/getPrefixPathname";

describe("getPrefixPathname", () => {
  it("should extract prefix with single URL and single base", () => {
    expect(getPrefixPathname("/settings/profile", "/settings")).toBe(
      "/settings"
    );
    expect(getPrefixPathname("/admin/dashboard", "/admin")).toBe("/admin");
  });

  it("should extract prefix with single URL and multiple bases", () => {
    expect(
      getPrefixPathname("/settings/profile", ["/settings", "/admin"])
    ).toBe("/settings");
    expect(getPrefixPathname("/admin/dashboard", ["/settings", "/admin"])).toBe(
      "/admin"
    );
  });

  it("should return null if URL does not match any base", () => {
    expect(getPrefixPathname("/other-path/profile", "/settings")).toBe(null);
    expect(
      getPrefixPathname("/other-path/profile", ["/settings", "/admin"])
    ).toBe(null);
  });

  it("should autodetect prefix with single URL when no base provided", () => {
    expect(getPrefixPathname("/settings/profile")).toBe("/settings");
    expect(getPrefixPathname("/admin/dashboard")).toBe("/admin");
  });

  it("should autodetect prefix with levels > 1", () => {
    expect(
      getPrefixPathname("/settings/profile/info", null, { levels: 2 })
    ).toBe("/settings/profile");
  });

  it("should process multiple URLs and single base", () => {
    expect(
      getPrefixPathname(
        ["/settings/profile", "/settings/password"],
        "/settings"
      )
    ).toEqual("/settings");
  });

  it("should process multiple URLs and multiple bases", () => {
    expect(
      getPrefixPathname(
        ["/settings/profile", "/admin/password"],
        ["/settings", "/admin"]
      )
    ).toEqual(["/settings", "/admin"]);
  });

  it("should process multiple URLs with auto-detection", () => {
    expect(getPrefixPathname(["/admin/profile", "/settings/password"])).toEqual(
      ["/admin", "/settings"]
    );
  });

  it("should respect levels in auto-detection for multiple URLs", () => {
    expect(
      getPrefixPathname(
        ["/settings/profile/info", "/admin/dashboard/logs"],
        null,
        {
          levels: 2
        }
      )
    ).toEqual(["/settings/profile", "/admin/dashboard"]);
  });

  it("should remove duplicates by default", () => {
    expect(
      getPrefixPathname(
        ["/settings/profile", "/settings/password"],
        "/settings"
      )
    ).toEqual("/settings");
  });

  it("should choose by single base", () => {
    expect(
      getPrefixPathname(["/settings/profile", "/other/password"], ["other"], {
        levels: 1
      })
    ).toEqual("/other");
  });

  it("should keep duplicates if removeDuplicates is false", () => {
    expect(
      getPrefixPathname(
        ["/settings/profile", "/settings/profile", "/admin/settings"],
        ["/settings", "/admin"],
        { levels: 1, removeDuplicates: false }
      )
    ).toEqual(["/settings", "/settings", "/admin"]);
  });

  it("should normalize duplicate-looking paths", () => {
    expect(getPrefixPathname("/settings//profile///info")).toBe("/settings");
    expect(
      getPrefixPathname(["/settings//profile", "/settings///password"])
    ).toEqual("/settings");
  });

  it("should throw TypeError for invalid parameters", () => {
    expect(() => getPrefixPathname(123 as any)).toThrow(TypeError);
    expect(() =>
      getPrefixPathname("/settings", {} as any, "not object" as any)
    ).toThrow(TypeError);
    expect(() =>
      getPrefixPathname("/settings", "/settings", { levels: "two" as any })
    ).toThrow(TypeError);
    expect(() =>
      getPrefixPathname("/settings", "/settings", {
        removeDuplicates: "nope" as any
      })
    ).toThrow(TypeError);
  });

  it("should support returning a single string if only one unique result exists", () => {
    expect(
      getPrefixPathname(
        ["/settings/profile", "/settings/password"],
        "/settings"
      )
    ).toBe("/settings");
  });

  it("should support explicit auto-detection with no base and options", () => {
    expect(getPrefixPathname("/foo/bar/baz", null, { levels: 2 })).toBe(
      "/foo/bar"
    );
  });

  it("should support array input with no base and options", () => {
    expect(
      getPrefixPathname(["/foo/bar", "/foo/baz"], null, { levels: 1 })
    ).toBe("/foo");
  });
});
