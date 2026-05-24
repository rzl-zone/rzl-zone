import { describe, it, expect } from "vitest";
import { extractFileName } from "@/parsers/extractFileName";
import {
  DOUBLE_EXTENSIONS_FILE,
  EXTENSIONS_FILE,
  SPECIAL_FILENAMES
} from "@/parsers/_private/extensions";

describe("extractFileName - Super Ultimate Suite", () => {
  // =======================================================
  // === CORE TESTS ===
  // =======================================================
  it("should handle single known extensions", () => {
    for (const ext of EXTENSIONS_FILE) {
      const base = "testfile";
      const filename = `${base}.${ext}?test=abc`;

      expect(extractFileName(filename)).toBe(base);
      expect(extractFileName("/" + filename)).toBe(base);
      expect(extractFileName(`https://example.com/${filename}`)).toBe(base);
      expect(extractFileName(`/local/path/${filename}`)).toBe(base);
      expect(extractFileName(`local/path/${filename}`)).toBe(base);
    }
  });

  it("should handle double extensions", () => {
    for (const ext of DOUBLE_EXTENSIONS_FILE) {
      const base = "archivefile";
      const filename = `${base}.${ext}?test=abc`;

      expect(extractFileName(filename)).toBe(base);
      expect(extractFileName("/" + filename)).toBe(base);
      expect(extractFileName(`https://example.com/${filename}`)).toBe(base);
      expect(extractFileName(`/local/path/to/${filename}`)).toBe(base);
      expect(extractFileName(`local/path/to/${filename}`)).toBe(base);
    }
  });

  it("should ignore unknown extensions", () => {
    for (const ext of ["foo", "bar", "xyz"]) {
      const filename = `file.${ext}`;
      expect(extractFileName(filename)).toBe(filename);
    }
  });

  it("should handle hidden files (dotfiles)", () => {
    for (const f of [".env", ".gitignore", ".bashrc"]) {
      expect(extractFileName(f)).toBe(f);
      expect(extractFileName(`/path/${f}`)).toBe(f);
    }
  });

  it("should handle trailing slashes and folders", () => {
    expect(extractFileName("/path/to/")).toBeNull();
    expect(extractFileName("folder/")).toBeNull();
    expect(extractFileName("https://example.com/path/")).toBeNull();
  });

  it("should handle URLs with query params and hash", () => {
    expect(extractFileName("https://example.com/file.txt?ver=1")).toBe("file");
    expect(extractFileName("https://example.com/archive.tar.gz#part")).toBe(
      "archive"
    );
  });

  it("should handle weird chars and unicode", () => {
    expect(extractFileName("emoji-😊.png")).toBe("emoji-😊");
    expect(extractFileName("my file name.tar.xz")).toBe("my file name");
  });

  it("should return null for invalid inputs file name (without extension)", () => {
    expect(extractFileName("invalid-file")).toBeNull();
    expect(extractFileName("/invalid-file")).toBeNull();
    expect(extractFileName("invalid-file/")).toBeNull();
    expect(extractFileName("/invalid-file/")).toBeNull();

    const invalids = [null, undefined, 123, {}, [], () => {}, "   "];
    for (const v of invalids) {
      // @ts-expect-error testing invalid input
      expect(extractFileName(v)).toBeNull();
    }
  });

  // =======================================================
  // === SPECIAL FILENAMES ===
  // =======================================================
  it("should keep special filenames intact", () => {
    for (const special of SPECIAL_FILENAMES) {
      expect(extractFileName(special)).toBe(special);
      expect(extractFileName(`/dir/${special}`)).toBe(special);
      expect(extractFileName(`https://example.com/${special}`)).toBe(special);
    }
  });
});

// =======================================================
// === DOMAIN-AWARE MODE TESTS ===
// =======================================================
describe("extractFileName - Domain-aware Mode", () => {
  it("should return null for exact domain match", () => {
    expect(
      extractFileName("example.com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();

    expect(
      extractFileName("https://example.com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();

    expect(
      extractFileName("www.example.com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();
  });

  it("should return null for subdomain of same domain", () => {
    expect(
      extractFileName("cdn.example.com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();

    expect(
      extractFileName("sub.blog.example.com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();
  });

  it("should extract filename for unrelated domains", () => {
    expect(
      extractFileName("resume.com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("resume");

    expect(
      extractFileName("portfolio.net", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("portfolio");

    expect(
      extractFileName("resume.co.id", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("resume.co.id");
  });

  it("should extract file name from same-domain URL with path", () => {
    expect(
      extractFileName("https://example.com/file.txt", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("file");

    expect(
      extractFileName("https://www.example.com/files/image.jpg", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("image");
  });

  it("should handle subdomain with file path", () => {
    expect(
      extractFileName("https://cdn.example.com/video.mp4", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("video");
  });

  it("should treat domainAware=false as normal file parsing", () => {
    expect(
      extractFileName("example.com", {
        domainAware: false,
        domainName: "example.com"
      })
    ).toBe("example");

    expect(
      extractFileName("resume.com", {
        domainAware: false,
        domainName: "example.com"
      })
    ).toBe("resume");
  });

  it("should handle domains with trailing slash", () => {
    expect(
      extractFileName("https://example.com/", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();

    expect(
      extractFileName("resume.com/", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("resume");
  });

  it("should ignore case in domain comparison", () => {
    expect(
      extractFileName("HTTPS://WWW.Example.Com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();
  });

  it("should handle ports correctly", () => {
    expect(
      extractFileName("https://example.com:8080", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();

    expect(
      extractFileName("https://cdn.example.com:3000/image.webp", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("image");
  });

  it("should throw if domainAware=true but domainName is missing", () => {
    expect(() => extractFileName("resume.com", { domainAware: true })).toThrow(
      TypeError
    );
  });

  it("should handle domain with query or hash", () => {
    expect(
      extractFileName("https://example.com/?v=2", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();

    expect(
      extractFileName("resume.com?v=3", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("resume");
  });

  it("should allow uncommon TLDs (.local, .dev) to behave normally", () => {
    expect(
      extractFileName("project.local", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("project.local");

    expect(
      extractFileName("build.dev", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("build.dev");
  });
});

// =======================================================
// === TYPE + PLATFORM EDGE CASES ===
// =======================================================
describe("extractFileName - Type & Platform Edge Cases", () => {
  it("should set back to default and not throw TypeError if options is not a plain object", () => {
    const invalidOptions = [
      123,
      "abc",
      null,
      undefined,
      [],
      new Set(),
      () => {}
    ];

    for (const opt of invalidOptions) {
      if (opt) {
        // @ts-expect-error testing invalid option type
        expect(() => extractFileName("file.txt", opt)).not.toThrow(TypeError);
      }
    }
  });

  it("should throw TypeError if domainName is not string when domainAware=true", () => {
    const invalidDomainNames = [123, null, {}, [], true, Symbol("x")];

    for (const v of invalidDomainNames) {
      expect(() =>
        // @ts-expect-error testing invalid domainName type
        extractFileName("resume.com", { domainAware: true, domainName: v })
      ).toThrow(TypeError);
    }
  });

  it("should throw TypeError if domainAware is not boolean", () => {
    const invalidBools = ["yes", 1, null, {}, [], Symbol("y")];

    for (const v of invalidBools) {
      expect(() =>
        extractFileName("resume.com", {
          // @ts-expect-error testing invalid domainAware type
          domainAware: v,
          domainName: "example.com"
        })
      ).toThrow(TypeError);
    }
  });

  it("should correctly parse Windows-style paths with backslashes", () => {
    expect(extractFileName("C:\\Users\\rzl\\Documents\\file.txt")).toBe("file");
    expect(extractFileName("C:\\temp\\archive.tar.gz")).toBe("archive");
    expect(extractFileName("C:\\folder.with.dots\\hidden\\.gitignore")).toBe(
      ".gitignore"
    );
    expect(extractFileName("C:\\path\\to\\folder\\")).toBeNull();
  });

  it("should handle mixed slash styles gracefully", () => {
    expect(extractFileName("C:/Users\\rzl/mix\\test.pdf")).toBe("test");
    expect(extractFileName("D:\\project\\assets/image.png")).toBe("image");
  });

  it("should handle UNC paths (Windows network paths)", () => {
    expect(extractFileName("\\\\SERVER\\share\\logs\\output.log")).toBe(
      "output"
    );
    expect(extractFileName("\\\\MACHINE\\dir\\folder\\")).toBeNull();
  });
});

// =======================================================
// === EXTREME EDGE CASES ===
// =======================================================
describe("extractFileName - Extreme Edge Cases", () => {
  it("should handle protocol-relative URLs", () => {
    expect(extractFileName("//example.com/file.txt")).toBe("file");
    expect(extractFileName("//cdn.example.com/archive.tar.gz")).toBe("archive");
  });

  it("should handle URLs containing encoded characters", () => {
    expect(extractFileName("https://example.com/my%20file%20name.txt")).toBe(
      "my file name"
    );
    expect(extractFileName("https://example.com/special%2Echars.tar.gz")).toBe(
      "special.chars"
    );
  });

  it("should handle filenames with multiple dots but no extension", () => {
    expect(extractFileName("data.v1.backup")).toBe("data.v1.backup");
    expect(extractFileName("archive.2023.09")).toBe("archive.2023.09");
  });

  it("should handle filenames with leading/trailing spaces", () => {
    expect(extractFileName("  file.txt  ")).toBe("file");
    expect(extractFileName("   folder/archive.tar.gz   ")).toBe("archive");
  });

  it("should handle numeric and special char filenames", () => {
    expect(extractFileName("12345.pdf")).toBe("12345");
    expect(extractFileName("$$$money.xlsx")).toBe("$$$money");
    expect(extractFileName("hello_world!.zip")).toBe("hello_world!");
  });

  it("should handle files inside dotfolders", () => {
    expect(extractFileName(".config/settings.json")).toBe("settings");
    expect(extractFileName("C:\\Users\\rzl\\.vscode\\tasks.json")).toBe(
      "tasks"
    );
  });

  it("should handle URLs with long query and hash", () => {
    expect(
      extractFileName(
        "https://example.com/image.png?utm_source=abc&v=2#section-1"
      )
    ).toBe("image");
  });

  it("should correctly strip complex local paths", () => {
    expect(extractFileName("/usr/local/bin/script.sh")).toBe("script");
    expect(extractFileName("/var/www/html/index.html")).toBe("index");
    expect(extractFileName("~/Downloads/archive.tar.xz")).toBe("archive");
  });

  it("should handle internationalized domain names (IDN / punycode)", () => {
    expect(
      extractFileName("https://xn--fsqu00a.xn--0zwm56d/image.png", {
        domainAware: true,
        domainName: "例子.测试"
      })
    ).toBe("image");

    expect(
      extractFileName("xn--fsqu00a.xn--0zwm56d", {
        domainAware: true,
        domainName: "例子.测试"
      })
    ).toBeNull();
  });

  it("should handle paths with dot in folder names", () => {
    expect(extractFileName("/folder.name.with.dots/file.txt")).toBe("file");
    expect(extractFileName("C:\\folder.name\\sub.folder\\note.log")).toBe(
      "note"
    );
  });

  it("should handle multiple consecutive slashes", () => {
    expect(
      extractFileName("https://example.com//double//slash//test.txt")
    ).toBe("test");
    expect(extractFileName("C:\\\\temp\\\\files\\\\archive.zip")).toBe(
      "archive"
    );
  });

  it("should handle filenames without extension but ending with dot", () => {
    expect(extractFileName("filename.")).toBe("filename.");
    expect(extractFileName("C:\\path\\weirdfile.")).toBe("weirdfile.");
  });

  it("should handle mixed unicode & emoji in filenames", () => {
    expect(extractFileName("C:\\path\\📄_報告書.pdf")).toBe("📄_報告書");
    expect(extractFileName("https://example.com/🔥project.tar.gz")).toBe(
      "🔥project"
    );
  });

  it("should return null for empty string or only slashes", () => {
    expect(extractFileName("")).toBeNull();
    expect(extractFileName("/")).toBeNull();
    expect(extractFileName("\\\\")).toBeNull();
  });

  it("should handle very long file names safely", () => {
    const longName = "a".repeat(255) + ".txt";
    expect(extractFileName(longName)).toBe("a".repeat(255));
  });

  it("should handle filename with dot but no ext in URL", () => {
    expect(extractFileName("https://example.com/version.1")).toBe("version.1");
  });

  it("should handle root domain with file path that mimics TLD", () => {
    expect(extractFileName("https://example.com/file.net")).toBe("file");
    expect(extractFileName("https://example.com/app.com")).toBe("app");
  });
});

// =======================================================
// === EXTRA INSANE TESTS (Edge + Negative + Intl + URL) ===
// =======================================================
describe("extractFileName - Extra Insane Edge Cases", () => {
  it("should not break with protocol-like strings without slashes", () => {
    expect(extractFileName("mailto:user@domain.com")).toBe("user@domain");
    expect(extractFileName("tel:+6212345678")).toBe("+6212345678");
    expect(extractFileName("data:text/plain;base64,SGVsbG8=")).toBe("SGVsbG8=");
  });

  it("should handle unusual protocols (ftp, file, mailto, custom)", () => {
    expect(extractFileName("ftp://example.com/image.jpeg")).toBe("image");
    expect(extractFileName("file:///C:/path/to/document.pdf")).toBe("document");
    expect(extractFileName("mailto:resume.com")).toBe("resume");
    expect(extractFileName("custom-scheme://example.com/video.mp4")).toBe(
      "video"
    );
  });

  it("should handle domain containing dash, underscore, and numbers", () => {
    expect(
      extractFileName("sub-01.example.com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();
    expect(
      extractFileName("app_dev.example.com", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBeNull();
    expect(
      extractFileName("app-01.dev", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("app-01.dev");
  });

  it("should correctly handle mixed unicode domain and ASCII/Unicode file", () => {
    expect(
      extractFileName("https://пример.рф/photo.png", {
        domainAware: true,
        domainName: "пример.рф"
      })
    ).toBe("photo");

    expect(
      extractFileName("https://ドメイン例.com/ファイル名.pdf", {
        domainAware: true,
        domainName: "ドメイン例.com"
      })
    ).toBe("ファイル名");
    expect(
      extractFileName("tést-ドメイン.com/file.txt", {
        domainAware: true,
        domainName: "ドメイン.com"
      })
    ).toBe("file");
  });

  it("should decode tricky URL encodings with dots and slashes", () => {
    expect(extractFileName("https://example.com/folder%2Finner/file.txt")).toBe(
      "file"
    );
    expect(extractFileName("https://example.com/%66%69%6C%65.txt")).toBe(
      "file"
    );
    expect(extractFileName("https://example.com/folder%2Ename/data.csv")).toBe(
      "data"
    );
  });

  it("should handle file with space and plus signs", () => {
    expect(extractFileName("my file+.txt")).toBe("my file+");
    expect(extractFileName("/path/to/sum+chart.csv")).toBe("sum+chart");
  });

  it("should not strip part of filename that only looks like extension but isn’t", () => {
    expect(extractFileName("mydomain.com.jpgart")).toBe("mydomain.com.jpgart");
    expect(extractFileName("datafile.tarbackup")).toBe("datafile.tarbackup");
  });

  it("should handle mixed forward/backslashes with queries", () => {
    expect(extractFileName("C:\\path/mixed\\slashed/file.pdf?x=1")).toBe(
      "file"
    );
  });

  it("should not strip when unknown double extensions appear", () => {
    expect(extractFileName("backup.tar.bak")).toBe("backup.tar.bak");
    expect(extractFileName("archive.gz.zipx")).toBe("archive.gz.zipx");
  });

  it("should treat .localdomain as a domain only if domainName matches", () => {
    expect(
      extractFileName("example.local", {
        domainAware: true,
        domainName: "example.local"
      })
    ).toBeNull();
    expect(
      extractFileName("example.local", {
        domainAware: true,
        domainName: "example.com"
      })
    ).toBe("example.local");
  });

  it("should return null for invalid but parseable URLs", () => {
    expect(extractFileName("http://")).toBeNull();
    expect(extractFileName("https:///test-file.txt")).toBe("test-file");
    expect(extractFileName("file://")).toBeNull();
  });

  it("should support percent-encoded emoji filenames", () => {
    expect(extractFileName("https://site.com/%F0%9F%94%A5report.txt")).toBe(
      "🔥report"
    );
  });

  it("should handle query params containing fake extensions", () => {
    expect(
      extractFileName("https://example.com/file-test.txt?download=.jpg")
    ).toBe("file-test");
    expect(extractFileName("https://example.com/video.mp4?type=.zip")).toBe(
      "video"
    );
  });

  it("should safely handle backslash in domain (malformed URL)", () => {
    expect(extractFileName("https:\\example.com\\file.log")).toBe("file");
  });

  it("should handle special reserved filenames correctly", () => {
    expect(extractFileName("CON")).toBe("CON");
    expect(extractFileName("NUL.txt")).toBe("NUL");
    expect(extractFileName("PRN.pdf")).toBe("PRN");
  });

  it("should handle mixed dots and extensions like file.min.js.map", () => {
    expect(extractFileName("app.min.js.map")).toBe("app.min");
    expect(extractFileName("bundle.min.css.map")).toBe("bundle.min");
  });

  it("should strip uppercase extensions case-insensitively", () => {
    expect(extractFileName("REPORT.PDF")).toBe("REPORT");
    expect(extractFileName("DATA.TAR.GZ")).toBe("DATA");
  });

  it("should handle multiple encoded dots combined with special chars", () => {
    expect(extractFileName("https://example.com/a%2Eb%2Ec.txt")).toBe("a.b.c");
  });

  it("should treat URL path containing emoji folder as valid", () => {
    expect(extractFileName("https://example.com/🔥/data.json")).toBe("data");
  });

  it("should ignore trailing dots after extension", () => {
    expect(extractFileName("file.txt....")).toBe("file.txt....");
  });

  it("should handle dot at beginning and end of filename", () => {
    expect(extractFileName(".weirdname.")).toBe(".weirdname.");
  });

  it("should handle file with triple extensions correctly", () => {
    expect(extractFileName("package.tar.gz.bak")).toBe("package.tar.gz.bak");
  });

  it("should decode URL with encoded slashes and dots safely", () => {
    expect(
      extractFileName("https://example.com/folder%2Fsub%2Ffile.tar.gz")
    ).toBe("file");
  });

  it("should not strip file if extension is part of folder name", () => {
    expect(extractFileName("/downloads.zip/archive.txt")).toBe("archive");
  });

  it("should handle trailing question mark in URLs gracefully", () => {
    expect(extractFileName("https://example.com/file.txt?")).toBe("file");
  });

  it("should not crash when filename is extremely long with no dot and return null", () => {
    const long = "a".repeat(5000);
    expect(extractFileName(long)).toBeNull();
  });

  it("should return dotfiles and special/reserved filenames as-is", () => {
    // Dotfiles
    const dotfiles = [".env", ".gitignore", ".bashrc"];
    for (const file of dotfiles) {
      expect(extractFileName(file)).toBe(file);
      expect(extractFileName(`/path/to/${file}`)).toBe(file);
      expect(extractFileName(`https://example.com/${file}`)).toBe(file);
      expect(extractFileName(`${file}?version=1`)).toBe(file);
      expect(extractFileName(`${file}#hash`)).toBe(file);
    }

    // Special/reserved filenames
    const specialFiles = [
      "CON",
      "NUL",
      "PRN",
      "AUX",
      "COM1",
      "COM2",
      "COM3",
      "COM4",
      "COM5",
      "COM6",
      "COM7",
      "COM8",
      "COM9",
      "LPT1",
      "LPT2",
      "LPT3",
      "LPT4",
      "LPT5",
      "LPT6",
      "LPT7",
      "LPT8",
      "LPT9"
    ];

    for (const file of specialFiles) {
      expect(extractFileName(file)).toBe(file);
      expect(extractFileName(`${file}.txt`)).toBe(file);
      expect(extractFileName(`/dir/${file}`)).toBe(file);
      expect(extractFileName(`https://example.com/${file}`)).toBe(file);
      expect(extractFileName(`${file}?param=123`)).toBe(file);
      expect(extractFileName(`${file}#section`)).toBe(file);
    }
  });
});
