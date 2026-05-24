/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";

import * as Utils from "@/strings/sanitizations/removeSpaces";
import { normalizePathname } from "@/urls/pathname/normalizePathname";
import { NormalizePathnameError } from "@/urls/_private/NormalizePathnameError";

describe("normalizePathname", () => {
  it("should return defaultPath if pathname is null, undefined, empty or whitespace", () => {
    expect(normalizePathname(undefined)).toBe("/");
    expect(normalizePathname(null)).toBe("/");
    expect(
      normalizePathname("", {
        defaultPath: " localhost ",
        localhostDomain: true
      })
    ).toBe("/");
    expect(normalizePathname("    ")).toBe("/");
  });

  it("should use provided defaultPath if pathname is invalid", () => {
    expect(normalizePathname(null, { defaultPath: "/home" })).toBe("/home");
    expect(normalizePathname(undefined, { defaultPath: "/dashboard" })).toBe(
      "/dashboard"
    );
  });

  it("should throw TypeError if defaultPath is not valid", () => {
    expect(() => normalizePathname("test", { defaultPath: "" })).toThrow(
      TypeError
    );

    expect(() => normalizePathname("test", { defaultPath: "   " })).toThrow(
      TypeError
    );

    expect(() => normalizePathname("test", null as any)).toThrow(TypeError);

    expect(() => normalizePathname("test", 123 as any)).toThrow(TypeError);
    expect(() => normalizePathname("http://")).toThrow(Error);
  });

  it("should prepend slash to relative pathnames", () => {
    expect(normalizePathname("test")).toBe("/test");
    expect(normalizePathname("folder/sub")).toBe("/folder/sub");
    expect(normalizePathname("/*.dom.test/already/starts")).toBe(
      "/already/starts"
    );
    expect(normalizePathname("/test.dom.com/already/starts")).toBe(
      "/already/starts"
    );
    expect(normalizePathname("///multiple/slashes")).toBe("/multiple/slashes");
  });

  it("should normalize full URLs and extract pathname + search + hash", () => {
    expect(normalizePathname("/dashboard///stats?view=all#top")).toBe(
      "/dashboard/stats?view=all#top"
    );
    expect(normalizePathname("https://sub.example.com/path?query=1#hash")).toBe(
      "/path?query=1#hash"
    );
    expect(normalizePathname("/sub.example.com/path?query=1#hash")).toBe(
      "/path?query=1#hash"
    );
    expect(normalizePathname("https://example.com/path?query=1#hash")).toBe(
      "/path?query=1#hash"
    );
    expect(normalizePathname("http://localhost:3000/test")).toBe("/test");
  });

  it("should handle URL with only query and hash", () => {
    expect(normalizePathname("https://domain.com/?x=1#top")).toBe("/?x=1#top");
    expect(normalizePathname("http://site/#anchor")).toBe("/#anchor");
  });

  it("should handle emoji and unicode in pathname", () => {
    expect(normalizePathname("path/🔥/测试")).toBe("/path/🔥/测试");
    expect(normalizePathname("🌍/world")).toBe("/🌍/world");
  });

  it("should strip leading/trailing spaces and collapse internal spaces/slashes", () => {
    expect(normalizePathname("   my/path  ")).toBe("/my/path");
    expect(normalizePathname("   a / b / c ")).toBe("/a/b/c");
  });

  it("should fallback to defaultPath for input like whitespace strings", () => {
    expect(normalizePathname("    ", { defaultPath: "/alt" })).toBe("/alt");
  });

  it("should handle complex combinations", () => {
    expect(normalizePathname("http://site.com///multi////slashes")).toBe(
      "/multi/slashes"
    );
    expect(normalizePathname("/double//slashes")).toBe("/double/slashes");
    expect(normalizePathname("/double///slashes///")).toBe("/double/slashes");
    expect(normalizePathname("nested/path/🚀")).toBe("/nested/path/🚀");
  });

  it("should respect keepTrailingSlash option", () => {
    expect(normalizePathname("////", { keepTrailingSlash: true })).toBe("/");

    expect(
      normalizePathname("/double///slashes", { keepTrailingSlash: true })
    ).toBe("/double/slashes");
    expect(
      normalizePathname("/double///slashes///", { keepTrailingSlash: true })
    ).toBe("/double/slashes/");
    expect(
      normalizePathname("/single/slash/", { keepTrailingSlash: false })
    ).toBe("/single/slash");
  });

  it("should handle query search and hash", () => {
    expect(normalizePathname("🚀#hash")).toBe("/🚀#hash");
    expect(normalizePathname("🚀?test=🚀&foo=bar")).toBe("/🚀?test=🚀&foo=bar");

    expect(normalizePathname("nested/path/🚀#hash")).toBe(
      "/nested/path/🚀#hash"
    );
    expect(normalizePathname("nested/path/🚀?test=🚀&foo=bar")).toBe(
      "/nested/path/🚀?test=🚀&foo=bar"
    );

    expect(normalizePathname("nested/path/🚀?test=🚀&foo=bar#hash")).toBe(
      "/nested/path/🚀?test=🚀&foo=bar#hash"
    );

    expect(
      normalizePathname("nested/path/🚀?test=🚀&foo=bar#hash", {
        keepTrailingSlash: true
      })
    ).toBe("/nested/path/🚀?test=🚀&foo=bar#hash");

    expect(normalizePathname("nested/path/🚀/?test=🚀&foo=bar#hash")).toBe(
      "/nested/path/🚀?test=🚀&foo=bar#hash"
    );
    expect(
      normalizePathname("nested/path/🚀/?test=🚀&foo=bar#hash", {
        keepTrailingSlash: true
      })
    ).toBe("/nested/path/🚀/?test=🚀&foo=bar#hash");
  });

  it("should handle query search and hash (with https? domain includes)", () => {
    expect(
      normalizePathname("http://domain.com/❤️#hash", { keepNullable: true })
    ).toBe("/❤️#hash");
    expect(
      normalizePathname("http://domain.com/❤️?test=❤️&foo=bar", {
        keepNullable: true
      })
    ).toBe("/❤️?test=❤️&foo=bar");

    expect(
      normalizePathname("http://domain.com/nested/path/❤️#hash‼️", {
        keepNullable: true
      })
    ).toBe("/nested/path/❤️#hash‼️");
    expect(
      normalizePathname("http://domain.com/nested/path/❤️?test=❤️&foo=bar", {
        keepNullable: true
      })
    ).toBe("/nested/path/❤️?test=❤️&foo=bar");

    expect(
      normalizePathname(
        "http://domain.com/nested/path/❤️?test=❤️&foo=bar#hash‼️",
        {
          keepTrailingSlash: false,
          keepNullable: true
        }
      )
    ).toBe("/nested/path/❤️?test=❤️&foo=bar#hash‼️");

    expect(
      normalizePathname(
        "http://domain.com/nested/path/%E2%9D%A4%EF%B8%8F?test=%E2%9D%A4%EF%B8%8F&foo=bar#hash‼️",
        {
          keepTrailingSlash: true,
          keepNullable: true
        }
      )
    ).toBe("/nested/path/❤️?test=❤️&foo=bar#hash‼️");

    expect(
      normalizePathname(
        "http://domain.com/nested/path/❤️/?test=❤️&foo=bar#hash‼️",
        {
          keepTrailingSlash: false,
          keepNullable: true
        }
      )
    ).toBe("/nested/path/❤️?test=❤️&foo=bar#hash‼️");
    expect(
      normalizePathname(
        "http://domain.com/nested/path/❤️/?test=❤️&foo=bar#hash‼️",
        {
          keepTrailingSlash: true,
          keepNullable: true
        }
      )
    ).toBe("/nested/path/❤️/?test=❤️&foo=bar#hash‼️");
  });

  it("should preserve null or undefined if keepNullable is true", () => {
    let a = undefined as unknown as string | null;
    expect(
      normalizePathname("/search/%2Bitem%2B", { keepNullable: false })
    ).toBe("/search/%2Bitem%2B");
    expect(normalizePathname(a, { keepNullable: true })).toBeUndefined();
    expect(normalizePathname("  ", { keepNullable: true })).toBe("/");
    expect(normalizePathname(null, { keepNullable: true })).toBeNull();
    expect(
      normalizePathname(undefined, { keepNullable: true })
    ).toBeUndefined();
  });

  it("should throw NormalizePathnameError for internal unexpected errors", () => {
    const spy = vi.spyOn(Utils, "removeSpaces").mockImplementation(() => {
      throw new Error("fake error");
    });

    expect(() => normalizePathname("test")).toThrow(NormalizePathnameError);
    expect(() => normalizePathname("test")).toThrow(/fake error/);

    spy.mockRestore();
  });
});

describe("normalizePathname - ignoreDomainExtensions (extended tests)", () => {
  it("should preserve first segment only basic", () => {
    expect(
      normalizePathname("image.png", { ignoreDomainExtensions: [".png"] })
    ).toBe("/image.png");
  });

  it("should preserve first segment with query and hash", () => {
    expect(
      normalizePathname("image.png?version=2#top", {
        ignoreDomainExtensions: [".png"]
      })
    ).toBe("/image.png?version=2#top");

    expect(
      normalizePathname("archive.tar.gz#download?x=1", {
        ignoreDomainExtensions: [".tar.gz"]
      })
    ).toBe("/archive.tar.gz#download?x=1");
  });

  it("should preserve filenames with unicode and emoji", () => {
    expect(
      normalizePathname("🔥.png#section", { ignoreDomainExtensions: [".png"] })
    ).toBe("/🔥.png#section");

    expect(
      normalizePathname("测试.tar.gz?file=1", {
        ignoreDomainExtensions: [".tar.gz"]
      })
    ).toBe("/测试.tar.gz?file=1");
  });

  it("should respect keepTrailingSlash when first segment is preserved", () => {
    expect(
      normalizePathname("image.png/", {
        ignoreDomainExtensions: [".png"],
        keepTrailingSlash: true
      })
    ).toBe("/image.png/");

    expect(
      normalizePathname("archive.tar.gz///", {
        ignoreDomainExtensions: [".tar.gz"],
        keepTrailingSlash: true
      })
    ).toBe("/archive.tar.gz/");
  });

  it("should handle multi-segment path, only first segment checked", () => {
    expect(
      normalizePathname("folder/image.png/file.txt", {
        ignoreDomainExtensions: [".png"]
      })
    ).toBe("/folder/image.png/file.txt"); // first segment is folder ➔ domain stripped normally

    expect(
      normalizePathname("image.png/folder/file.txt", {
        ignoreDomainExtensions: [".png"]
      })
    ).toBe("/image.png/folder/file.txt"); // first segment matches ➔ preserved
  });

  it("should ignore extensions option if first segment is full domain or has protocol", () => {
    expect(normalizePathname("https://example.com/image.png", {})).toBe(
      "/image.png"
    );

    expect(normalizePathname("example.com/image.png")).toBe("/image.png");

    expect(normalizePathname("http://localhost/test.png")).toBe("/test.png");
  });

  it("should throw TypeError for invalid entries in Set or array", () => {
    expect(() =>
      normalizePathname("image.png", { ignoreDomainExtensions: [""] })
    ).toThrow(TypeError);

    expect(() =>
      normalizePathname("image.png", { ignoreDomainExtensions: ["png"] })
    ).toThrow(TypeError);

    expect(() =>
      normalizePathname("image.png", { ignoreDomainExtensions: new Set([""]) })
    ).toThrow(TypeError);

    expect(() =>
      normalizePathname("image.png", {
        ignoreDomainExtensions: new Set(["png", ".png"])
      })
    ).toThrow(TypeError);
  });
});

describe("normalizePathname - ignoreDomainExtensions (extended tests v2)", () => {
  it("should preserve first segment with query only", () => {
    expect(
      normalizePathname("image.png?version=3", {
        ignoreDomainExtensions: [".png"]
      })
    ).toBe("/image.png?version=3");
  });

  it("should preserve first segment with hash only", () => {
    expect(
      normalizePathname("image.png#anchor", {
        ignoreDomainExtensions: [".png"]
      })
    ).toBe("/image.png#anchor");
  });

  it("should preserve first segment with query + hash + trailing slash", () => {
    expect(
      normalizePathname("archive.tar.gz?x=1#top/", {
        ignoreDomainExtensions: [".tar.gz"],
        keepTrailingSlash: true
      })
    ).toBe("/archive.tar.gz?x=1#top/");
  });

  it("should preserve first segment with emoji in filename", () => {
    expect(
      normalizePathname("🚀.js?module=true", {
        ignoreDomainExtensions: [".js"]
      })
    ).toBe("/🚀.js?module=true");
  });

  it("should preserve first segment when relative path looks like domain", () => {
    expect(
      normalizePathname("example.com.js/path/file", {
        ignoreDomainExtensions: [".js"]
      })
    ).toBe("/example.com.js/path/file");
  });

  it("should ignore ignoreDomainExtensions if first segment is protocol + domain", () => {
    expect(
      normalizePathname("https://example.com/script.js", {
        ignoreDomainExtensions: [".js"]
      })
    ).toBe("/script.js");

    expect(
      normalizePathname("http://sub.domain.com/archive.tar.gz", {
        ignoreDomainExtensions: [".tar.gz"]
      })
    ).toBe("/archive.tar.gz");
  });

  it("should throw TypeError when ignoreDomainExtensions contains non-string or invalid string", () => {
    expect(() =>
      normalizePathname("file.png", { ignoreDomainExtensions: [123 as any] })
    ).toThrow(TypeError);

    expect(() =>
      normalizePathname("file.png", { ignoreDomainExtensions: [""] })
    ).toThrow(TypeError);

    expect(() =>
      normalizePathname("file.png", { ignoreDomainExtensions: [".png", "jpg"] })
    ).toThrow(TypeError);
  });

  it("should handle Set<string> correctly", () => {
    expect(
      normalizePathname("archive.tar.bz#download", {
        ignoreDomainExtensions: new Set([".tar.bz"])
      })
    ).toBe("/archive.tar.bz#download");
  });
});
