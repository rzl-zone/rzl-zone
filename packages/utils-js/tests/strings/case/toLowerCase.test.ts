/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { toLowerCase } from "@/strings/cases/toLowerCase";

describe("toLowerCase", () => {
  it("should convert simple strings with spaces to pure lower case", () => {
    expect(toLowerCase("hello world")).toBe("hello world");
    expect(toLowerCase("this is a test")).toBe("this is a test");
  });

  it("should handle strings with hyphens and underscores", () => {
    expect(toLowerCase("convert_to-pascal case")).toBe(
      "convert to pascal case"
    );
    expect(toLowerCase("another-test_example")).toBe("another test example");
  });

  it("should remove unwanted characters", () => {
    expect(toLowerCase("hello@world!#")).toBe("hello world");
    expect(toLowerCase("convert%to^pascal&case")).toBe(
      "convert to pascal case"
    );
  });

  it("should return empty string for null or undefined", () => {
    expect(toLowerCase(null)).toBe("");
    expect(toLowerCase(undefined)).toBe("");
  });

  it("should handle empty or whitespace-only strings", () => {
    expect(toLowerCase("")).toBe("");
    expect(toLowerCase("     ")).toBe("");
  });

  it("should lowercase single word", () => {
    expect(toLowerCase("single")).toBe("single");
    expect(toLowerCase("WORD")).toBe("word");
  });

  it("should handle mixed case input", () => {
    expect(toLowerCase("HeLLo WoRLd")).toBe("hello world");
    expect(toLowerCase("ANother-EXAMPLE_case")).toBe("another example case");
  });

  it("should handle multiple consecutive delimiters", () => {
    expect(toLowerCase("hello--world__test")).toBe("hello world test");
    expect(toLowerCase("convert    to    pascal")).toBe("convert to pascal");
  });

  it("should handle strings with numbers", () => {
    expect(toLowerCase("test 123 case")).toBe("test 123 case");
    expect(toLowerCase("convert_4_times")).toBe("convert 4 times");
  });

  it("should handle complex combined input", () => {
    expect(toLowerCase("   ___hello--world__ again!!   ")).toBe(
      "hello world again"
    );
    expect(toLowerCase("   mix_of-ALL kinds___of Things!!")).toBe(
      "mix of all kinds of things"
    );
  });

  it("should handle input with mixed symbols and emojis", () => {
    expect(toLowerCase("hello 🌍 world 🚀")).toBe("hello world");
    expect(toLowerCase("🔥fire___and--ice❄️")).toBe("fire and ice");
  });

  it("should handle input with numbers and symbols together", () => {
    expect(toLowerCase("order #123 for user_456")).toBe(
      "order 123 for user 456"
    );
    expect(toLowerCase("99 bottles-of_beer!!")).toBe("99 bottles of beer");
  });

  it("should handle multiple leading and trailing delimiters", () => {
    expect(toLowerCase("---___   hello-world   ___---")).toBe("hello world");
    expect(toLowerCase("///...:::pascal-case---___")).toBe("pascal case");
  });

  it("should handle only delimiters as input", () => {
    expect(toLowerCase("____----____")).toBe("");
    expect(toLowerCase("   - _ -   ")).toBe("");
  });

  it("should handle strings with only numbers", () => {
    expect(toLowerCase("123 456 789")).toBe("123 456 789");
    expect(toLowerCase("12-34_56")).toBe("12 34 56");
  });

  it("should handle crazy mixed input", () => {
    expect(toLowerCase("!!@@##$$%%^^&&**((__++--==~~``||")).toBe("");
    expect(toLowerCase("heLLo---WORLD___Again&&Again")).toBe(
      "hello world again again"
    );
  });

  it("should handle unicode words mixed with ascii", () => {
    expect(toLowerCase("こんにちは world")).toBe("こんにちは world");
    expect(toLowerCase("добрый день hello")).toBe("добрый день hello");
  });

  it("should handle repeated emojis as delimiters", () => {
    expect(toLowerCase("hello🌟🌟world🌟🌟again")).toBe("hello world again");
    expect(toLowerCase("🚀launch___the---rocket🚀")).toBe("launch the rocket");
  });

  it("should handle mix of digits, symbols, and spaces", () => {
    expect(toLowerCase(" 99 bottles--of_beer!! on_the_wall")).toBe(
      "99 bottles of beer on the wall"
    );
    expect(toLowerCase("load_data-4-2023__test")).toBe("load data 4 2023 test");
  });

  it("should handle very long strings with many delimiters", () => {
    const longInput =
      "___this--is__a--very___long---string__with--many___delimiters____in___between___";
    expect(toLowerCase(longInput)).toBe(
      "this is a very long string with many delimiters in between"
    );
  });

  it("should handle symbols in between digits and words", () => {
    expect(toLowerCase("ver$ion_2.0.1-beta")).toBe("ver ion 2 0 1 beta");
    expect(toLowerCase("temp#42&deg")).toBe("temp 42 deg");
  });

  it("should handle complex mixed unicode + ascii + symbols", () => {
    expect(toLowerCase("привет---hello___世界")).toBe("привет hello 世界");
    expect(toLowerCase("🌸🌸日本-hello-world🌸🌸")).toBe("日本 hello world");
  });

  it("should handle crazy nested symbols mixed with words", () => {
    expect(toLowerCase("___he##llo---wo!!rld&&&&again__123___")).toBe(
      "he llo wo rld again 123"
    );
  });

  it("should handle string with only emojis", () => {
    expect(toLowerCase("🎉🎉🎉🎉")).toBe("");
    expect(toLowerCase("🚀🔥❄️")).toBe("");
  });

  it("should handle camel-ish input and just lower everything", () => {
    expect(toLowerCase("camelCaseExample")).toBe("camelcaseexample");
    expect(toLowerCase("PascalCaseInput")).toBe("pascalcaseinput");
  });
});

// ignoreWord sections stay the same because output already matches lowercase
describe("toLowerCase - ignoreWord as string", () => {
  it("should leave the ignoreWord unchanged", () => {
    expect(toLowerCase("this URL path will ignore", "URL")).toBe(
      "this URL path will ignore"
    );
    expect(toLowerCase("keep API key", "API")).toBe("keep API key");
    expect(toLowerCase("ignore the WORD", "WORD")).toBe("ignore the WORD");
  });

  it("should trim ignoreWord and ignore empty ignoreWord", () => {
    expect(toLowerCase("this URL path", " URL ")).toBe("this URL path");
    expect(toLowerCase("this URL path", "   ")).toBe("this url path");
  });

  it("should not affect other words", () => {
    expect(toLowerCase("API test URL example", "API")).toBe(
      "API test url example"
    );
    expect(toLowerCase("API test URL example", "URL")).toBe(
      "api test URL example"
    );
  });
});

describe("toLowerCase - ignoreWord as array or Set", () => {
  it("should handle array of ignoreWords", () => {
    expect(toLowerCase("ignore API and URL", ["API", "URL"])).toBe(
      "ignore API and URL"
    );
    expect(toLowerCase("keep HTTP and HTTPS keys", ["HTTP", "HTTPS"])).toBe(
      "keep HTTP and HTTPS keys"
    );
  });

  it("should handle Set of ignoreWords", () => {
    expect(toLowerCase("ignore API and URL", new Set(["API", "URL"]))).toBe(
      "ignore API and URL"
    );
    expect(
      toLowerCase("keep HTTP and HTTPS keys", new Set(["HTTP", "HTTPS"]))
    ).toBe("keep HTTP and HTTPS keys");
  });
});

describe("toLowerCase - extra edge cases", () => {
  it("should handle non-string inputs gracefully", () => {
    expect(toLowerCase(123 as any)).toBe("");
    expect(toLowerCase(true as any)).toBe("");
    expect(toLowerCase(false as any)).toBe("");
    expect(toLowerCase({} as any)).toBe("");
    expect(toLowerCase([] as any)).toBe("");
    expect(toLowerCase(Symbol("x") as any)).toBe("");
    expect(toLowerCase((() => {}) as any)).toBe("");
    expect(toLowerCase(new Date() as any)).toBe("");
    expect(toLowerCase(/regex/ as any)).toBe("");
  });

  it("should handle very large input string", () => {
    const long = "word ".repeat(1000);
    const result = toLowerCase(long);
    expect(result.startsWith("word word word")).toBe(true);
    expect(result.length).toBe(4999);
  });

  it("should handle surrogate pairs and grapheme clusters", () => {
    expect(toLowerCase("👩‍👩‍👧‍👦 family test")).toBe("family test");
    expect(toLowerCase("🇯🇵 japan flag")).toBe("japan flag");
    expect(toLowerCase("man👨‍🚀space")).toBe("man space");
  });

  it("should handle ignoreWord case sensitivity test", () => {
    expect(toLowerCase("this url path", "URL")).toBe("this url path");
    expect(toLowerCase("this URL path", "url")).toBe("this url path");
  });

  it("should ignore duplicate words in array or Set", () => {
    expect(toLowerCase("keep API and API", ["API", "API"])).toBe(
      "keep API and API"
    );
    expect(toLowerCase("keep URL path", new Set(["URL", "URL"]))).toBe(
      "keep URL path"
    );
  });

  it("should ignoreWord not present in string (no effect)", () => {
    expect(toLowerCase("this is normal text", "MISSING")).toBe(
      "this is normal text"
    );
  });

  it("should not partially match ignoreWord inside another word", () => {
    expect(toLowerCase("specialAPIcase", "API")).toBe("specialapicase");
    expect(toLowerCase("superURLman", "URL")).toBe("superurlman");
  });

  it("should preserve consecutive ignored words", () => {
    expect(toLowerCase("API URL key", ["API", "URL"])).toBe("API URL key");
  });

  it("should work with ignoreWord as mixed collection types", () => {
    const mixed = new Set(["API", "URL", "HTTP"]);
    expect(toLowerCase("API URL and HTTP", mixed)).toBe("API URL and HTTP");
  });

  it("should handle nested delimiters with ignoreWord", () => {
    expect(toLowerCase("__API---URL___path", ["API", "URL"])).toBe(
      "API URL path"
    );
  });
});
