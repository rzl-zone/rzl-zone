/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { toPascalCaseSpace } from "@/strings/cases/toPascalCaseSpace";

describe("toPascalCaseSpace", () => {
  it("should convert simple strings with spaces to PascalCase", () => {
    expect(toPascalCaseSpace("hello world")).toBe("Hello World");
    expect(toPascalCaseSpace("this is a test")).toBe("This Is A Test");
  });

  it("should handle strings with hyphens and underscores", () => {
    expect(toPascalCaseSpace("convert_to-pascal case")).toBe(
      "Convert To Pascal Case"
    );
    expect(toPascalCaseSpace("another-test_example")).toBe(
      "Another Test Example"
    );
  });

  it("should remove unwanted characters", () => {
    expect(toPascalCaseSpace("hello@world!#")).toBe("Hello World");
    expect(toPascalCaseSpace("convert%to^pascal&case")).toBe(
      "Convert To Pascal Case"
    );
  });

  it("should return empty string for null or undefined", () => {
    expect(toPascalCaseSpace(null)).toBe("");
    expect(toPascalCaseSpace(undefined)).toBe("");
  });

  it("should handle empty or whitespace-only strings", () => {
    expect(toPascalCaseSpace("")).toBe("");
    expect(toPascalCaseSpace("     ")).toBe("");
  });

  it("should capitalize single word", () => {
    expect(toPascalCaseSpace("single")).toBe("Single");
    expect(toPascalCaseSpace("WORD")).toBe("Word");
  });

  it("should handle mixed case input", () => {
    expect(toPascalCaseSpace("HeLLo WoRLd")).toBe("Hello World");
    expect(toPascalCaseSpace("ANother-EXAMPLE_case")).toBe(
      "Another Example Case"
    );
  });

  it("should handle multiple consecutive delimiters", () => {
    expect(toPascalCaseSpace("hello--world__test")).toBe("Hello World Test");
    expect(toPascalCaseSpace("convert    to    pascal")).toBe(
      "Convert To Pascal"
    );
  });

  it("should handle strings with numbers", () => {
    expect(toPascalCaseSpace("test 123 case")).toBe("Test 123 Case");
    expect(toPascalCaseSpace("convert_4_times")).toBe("Convert 4 Times");
  });

  it("should handle complex combined input", () => {
    expect(toPascalCaseSpace("   ___hello--world__ again!!   ")).toBe(
      "Hello World Again"
    );
    expect(toPascalCaseSpace("   mix_of-ALL kinds___of Things!!")).toBe(
      "Mix Of All Kinds Of Things"
    );
  });

  it("should handle input with mixed symbols and emojis", () => {
    expect(toPascalCaseSpace("hello 🌍 world 🚀")).toBe("Hello World");
    expect(toPascalCaseSpace("🔥fire___and--ice❄️")).toBe("Fire And Ice");
  });

  it("should handle input with numbers and symbols together", () => {
    expect(toPascalCaseSpace("order #123 for user_456")).toBe(
      "Order 123 For User 456"
    );
    expect(toPascalCaseSpace("99 bottles-of_beer!!")).toBe(
      "99 Bottles Of Beer"
    );
  });

  it("should handle multiple leading and trailing delimiters", () => {
    expect(toPascalCaseSpace("---___   hello-world   ___---")).toBe(
      "Hello World"
    );
    expect(toPascalCaseSpace("///...:::pascal-case---___")).toBe("Pascal Case");
  });

  it("should handle only delimiters as input", () => {
    expect(toPascalCaseSpace("____----____")).toBe("");
    expect(toPascalCaseSpace("   - _ -   ")).toBe("");
  });

  it("should handle strings with only numbers", () => {
    expect(toPascalCaseSpace("123 456 789")).toBe("123 456 789");
    expect(toPascalCaseSpace("12-34_56")).toBe("12 34 56");
  });

  it("should handle crazy mixed input", () => {
    expect(toPascalCaseSpace("!!@@##$$%%^^&&**((__++--==~~``||")).toBe("");
    expect(toPascalCaseSpace("heLLo---WORLD___Again&&Again")).toBe(
      "Hello World Again Again"
    );
  });

  it("should handle unicode words mixed with ascii", () => {
    expect(toPascalCaseSpace("こんにちは world")).toBe("こんにちは World");
    expect(toPascalCaseSpace("добрый день hello")).toBe("Добрый День Hello");
  });

  it("should handle repeated emojis as delimiters", () => {
    expect(toPascalCaseSpace("hello🌟🌟world🌟🌟again")).toBe(
      "Hello World Again"
    );
    expect(toPascalCaseSpace("🚀launch___the---rocket🚀")).toBe(
      "Launch The Rocket"
    );
  });

  it("should handle mix of digits, symbols, and spaces", () => {
    expect(toPascalCaseSpace(" 99 bottles--of_beer!! on_the_wall")).toBe(
      "99 Bottles Of Beer On The Wall"
    );
    expect(toPascalCaseSpace("load_data-4-2023__test")).toBe(
      "Load Data 4 2023 Test"
    );
  });

  it("should handle very long strings with many delimiters", () => {
    const longInput =
      "___this--is__a--very___long---string__with--many___delimiters____in___between___";
    expect(toPascalCaseSpace(longInput)).toBe(
      "This Is A Very Long String With Many Delimiters In Between"
    );
  });

  it("should handle symbols in between digits and words", () => {
    expect(toPascalCaseSpace("ver$ion_2.0.1-beta")).toBe("Ver Ion 2 0 1 Beta");
    expect(toPascalCaseSpace("temp#42&deg")).toBe("Temp 42 Deg");
  });

  it("should handle complex mixed unicode + ascii + symbols", () => {
    expect(toPascalCaseSpace("привет---hello___世界")).toBe(
      "Привет Hello 世界"
    );
    expect(toPascalCaseSpace("🌸🌸日本-hello-world🌸🌸")).toBe(
      "日本 Hello World"
    );
  });

  it("should handle crazy nested symbols mixed with words", () => {
    expect(toPascalCaseSpace("___he##llo---wo!!rld&&&&again__123___")).toBe(
      "He Llo Wo Rld Again 123"
    );
  });

  it("should handle string with only emojis", () => {
    expect(toPascalCaseSpace("🎉🎉🎉🎉")).toBe("");
    expect(toPascalCaseSpace("🚀🔥❄️")).toBe("");
  });

  it("should handle camel-ish input and reformat to Pascal", () => {
    expect(toPascalCaseSpace("camelCaseExample")).toBe("Camelcaseexample");
    expect(toPascalCaseSpace("PascalCaseInput")).toBe("Pascalcaseinput");
  });
});

describe("toPascalCaseSpace - ignoreWord as string", () => {
  it("should leave the ignoreWord unchanged", () => {
    expect(toPascalCaseSpace("this URL path will ignore", "URL")).toBe(
      "This URL Path Will Ignore"
    );
    expect(toPascalCaseSpace("keep API key", "API")).toBe("Keep API Key");
    expect(toPascalCaseSpace("ignore the WORD", "WORD")).toBe(
      "Ignore The WORD"
    );
  });

  it("should trim ignoreWord and ignore empty ignoreWord", () => {
    expect(toPascalCaseSpace("this URL path", " URL ")).toBe("This URL Path");
    expect(toPascalCaseSpace("this URL path", "   ")).toBe("This Url Path");
  });

  it("should not affect other words", () => {
    expect(toPascalCaseSpace("API test URL example", "API")).toBe(
      "API Test Url Example"
    );
    expect(toPascalCaseSpace("API test URL example", "URL")).toBe(
      "Api Test URL Example"
    );
  });
});

describe("toPascalCaseSpace - ignoreWord as array or Set", () => {
  it("should handle array of ignoreWords", () => {
    expect(toPascalCaseSpace("ignore API and URL", ["API", "URL"])).toBe(
      "Ignore API And URL"
    );
    expect(
      toPascalCaseSpace("keep HTTP and HTTPS keys", ["HTTP", "HTTPS"])
    ).toBe("Keep HTTP And HTTPS Keys");
  });

  it("should handle Set of ignoreWords", () => {
    expect(
      toPascalCaseSpace("ignore API and URL", new Set(["API", "URL"]))
    ).toBe("Ignore API And URL");
    expect(
      toPascalCaseSpace("keep HTTP and HTTPS keys", new Set(["HTTP", "HTTPS"]))
    ).toBe("Keep HTTP And HTTPS Keys");
  });
});

describe("toPascalCaseSpace - extra edge cases", () => {
  it("should handle non-string inputs gracefully", () => {
    expect(toPascalCaseSpace(123 as any)).toBe("");
    expect(toPascalCaseSpace(true as any)).toBe("");
    expect(toPascalCaseSpace(false as any)).toBe("");
    expect(toPascalCaseSpace({} as any)).toBe("");
    expect(toPascalCaseSpace([] as any)).toBe("");
    expect(toPascalCaseSpace(Symbol("x") as any)).toBe("");
    expect(toPascalCaseSpace((() => {}) as any)).toBe("");
    expect(toPascalCaseSpace(new Date() as any)).toBe("");
    expect(toPascalCaseSpace(/regex/ as any)).toBe("");
  });

  it("should handle very large input string", () => {
    const long = "word ".repeat(1000); // 1000 words
    const result = toPascalCaseSpace(long);
    expect(result.startsWith("Word Word Word")).toBe(true);
    expect(result.length).toBe(4999);
  });

  it("should handle surrogate pairs and grapheme clusters", () => {
    expect(toPascalCaseSpace("👩‍👩‍👧‍👦 family test")).toBe("Family Test");
    expect(toPascalCaseSpace("🇯🇵 japan flag")).toBe("Japan Flag");
    expect(toPascalCaseSpace("man👨‍🚀space")).toBe("Man Space");
  });

  it("should handle ignoreWord case sensitivity test", () => {
    expect(toPascalCaseSpace("this url path", "URL")).toBe("This Url Path");
    expect(toPascalCaseSpace("this URL path", "url")).toBe("This Url Path");
  });

  it("should ignore duplicate words in array or Set", () => {
    expect(toPascalCaseSpace("keep API and API", ["API", "API"])).toBe(
      "Keep API And API"
    );
    expect(toPascalCaseSpace("keep URL path", new Set(["URL", "URL"]))).toBe(
      "Keep URL Path"
    );
  });

  it("should ignoreWord not present in string (no effect)", () => {
    expect(toPascalCaseSpace("this is normal text", "MISSING")).toBe(
      "This Is Normal Text"
    );
  });

  it("should not partially match ignoreWord inside another word", () => {
    expect(toPascalCaseSpace("specialAPIcase", "API")).toBe("Specialapicase");
    expect(toPascalCaseSpace("superURLman", "URL")).toBe("Superurlman");
  });

  it("should preserve consecutive ignored words", () => {
    expect(toPascalCaseSpace("API URL key", ["API", "URL"])).toBe(
      "API URL Key"
    );
  });

  it("should work with ignoreWord as mixed collection types", () => {
    const mixed = new Set(["API", "URL", "HTTP"]);
    expect(toPascalCaseSpace("API URL and HTTP", mixed)).toBe(
      "API URL And HTTP"
    );
  });

  it("should handle nested delimiters with ignoreWord", () => {
    expect(toPascalCaseSpace("__API---URL___path", ["API", "URL"])).toBe(
      "API URL Path"
    );
  });
});
