/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { toPascalCase } from "@/strings/cases/toPascalCase";

describe("toPascalCase", () => {
  it("should convert simple strings with spaces to PascalCase", () => {
    expect(toPascalCase("hello world")).toBe("HelloWorld");
    expect(toPascalCase("this is a test")).toBe("ThisIsATest");
  });

  it("should handle strings with hyphens and underscores", () => {
    expect(toPascalCase("convert_to-pascal case")).toBe("ConvertToPascalCase");
    expect(toPascalCase("another-test_example")).toBe("AnotherTestExample");
  });

  it("should remove unwanted characters", () => {
    expect(toPascalCase("hello@world!#")).toBe("HelloWorld");
    expect(toPascalCase("convert%to^pascal&case")).toBe("ConvertToPascalCase");
  });

  it("should return empty string for null or undefined", () => {
    expect(toPascalCase(null)).toBe("");
    expect(toPascalCase(undefined)).toBe("");
  });

  it("should handle empty or whitespace-only strings", () => {
    expect(toPascalCase("")).toBe("");
    expect(toPascalCase("     ")).toBe("");
  });

  it("should capitalize single word", () => {
    expect(toPascalCase("single")).toBe("Single");
    expect(toPascalCase("WORD")).toBe("Word");
  });

  it("should handle mixed case input", () => {
    expect(toPascalCase("HeLLo WoRLd")).toBe("HelloWorld");
    expect(toPascalCase("ANother-EXAMPLE_case")).toBe("AnotherExampleCase");
  });

  it("should handle multiple consecutive delimiters", () => {
    expect(toPascalCase("hello--world__test")).toBe("HelloWorldTest");
    expect(toPascalCase("convert    to    pascal")).toBe("ConvertToPascal");
  });

  it("should handle strings with numbers", () => {
    expect(toPascalCase("test 123 case")).toBe("Test123Case");
    expect(toPascalCase("convert_4_times")).toBe("Convert4Times");
  });

  it("should handle complex combined input", () => {
    expect(toPascalCase("   ___hello--world__ again!!   ")).toBe(
      "HelloWorldAgain"
    );
    expect(toPascalCase("   mix_of-ALL kinds___of Things!!")).toBe(
      "MixOfAllKindsOfThings"
    );
  });

  it("should handle input with mixed symbols and emojis", () => {
    expect(toPascalCase("hello 🌍 world 🚀")).toBe("HelloWorld");
    expect(toPascalCase("🔥fire___and--ice❄️")).toBe("FireAndIce");
  });

  it("should handle input with numbers and symbols together", () => {
    expect(toPascalCase("order #123 for user_456")).toBe("Order123ForUser456");
    expect(toPascalCase("99 bottles-of_beer!!")).toBe("99BottlesOfBeer");
  });

  it("should handle multiple leading and trailing delimiters", () => {
    expect(toPascalCase("---___   hello-world   ___---")).toBe("HelloWorld");
    expect(toPascalCase("///...:::pascal-case---___")).toBe("PascalCase");
  });

  it("should handle only delimiters as input", () => {
    expect(toPascalCase("____----____")).toBe("");
    expect(toPascalCase("   - _ -   ")).toBe("");
  });

  it("should handle strings with only numbers", () => {
    expect(toPascalCase("123 456 789")).toBe("123456789");
    expect(toPascalCase("12-34_56")).toBe("123456");
  });

  it("should handle crazy mixed input", () => {
    expect(toPascalCase("!!@@##$$%%^^&&**((__++--==~~``||")).toBe("");
    expect(toPascalCase("heLLo---WORLD___Again&&Again")).toBe(
      "HelloWorldAgainAgain"
    );
  });

  it("should handle unicode words mixed with ascii", () => {
    expect(toPascalCase("こんにちは world")).toBe("こんにちはWorld");
    expect(toPascalCase("добрый день hello")).toBe("ДобрыйДеньHello");
  });

  it("should handle repeated emojis as delimiters", () => {
    expect(toPascalCase("hello🌟🌟world🌟🌟again")).toBe("HelloWorldAgain");
    expect(toPascalCase("🚀launch___the---rocket🚀")).toBe("LaunchTheRocket");
  });

  it("should handle mix of digits, symbols, and spaces", () => {
    expect(toPascalCase(" 99 bottles--of_beer!! on_the_wall")).toBe(
      "99BottlesOfBeerOnTheWall"
    );
    expect(toPascalCase("load_data-4-2023__test")).toBe("LoadData42023Test");
  });

  it("should handle very long strings with many delimiters", () => {
    const longInput =
      "___this--is__a--very___long---string__with--many___delimiters____in___between___";
    expect(toPascalCase(longInput)).toBe(
      "ThisIsAVeryLongStringWithManyDelimitersInBetween"
    );
  });

  it("should handle symbols in between digits and words", () => {
    expect(toPascalCase("ver$ion_2.0.1-beta")).toBe("VerIon201Beta");
    expect(toPascalCase("temp#42&deg")).toBe("Temp42Deg");
  });

  it("should handle complex mixed unicode + ascii + symbols", () => {
    expect(toPascalCase("привет---hello___世界")).toBe("ПриветHello世界");
    expect(toPascalCase("🌸🌸日本-hello-world🌸🌸")).toBe("日本HelloWorld");
  });

  it("should handle crazy nested symbols mixed with words", () => {
    expect(toPascalCase("___he##llo---wo!!rld&&&&again__123___")).toBe(
      "HeLloWoRldAgain123"
    );
  });

  it("should handle string with only emojis", () => {
    expect(toPascalCase("🎉🎉🎉🎉")).toBe("");
    expect(toPascalCase("🚀🔥❄️")).toBe("");
  });

  it("should handle camel-ish input and reformat to Pascal", () => {
    expect(toPascalCase("camelCaseExample")).toBe("Camelcaseexample");
    expect(toPascalCase("PascalCaseInput")).toBe("Pascalcaseinput");
  });
});

describe("toPascalCase - ignoreWord as string", () => {
  it("should leave the ignoreWord unchanged", () => {
    expect(toPascalCase("this URL path will ignore", "URL")).toBe(
      "ThisURLPathWillIgnore"
    );
    expect(toPascalCase("keep API key", "API")).toBe("KeepAPIKey");
    expect(toPascalCase("ignore the WORD", "WORD")).toBe("IgnoreTheWORD");
  });

  it("should trim ignoreWord and ignore empty ignoreWord", () => {
    expect(toPascalCase("this URL path", " URL ")).toBe("ThisURLPath");
    expect(toPascalCase("this URL path", "   ")).toBe("ThisUrlPath");
  });

  it("should not affect other words", () => {
    expect(toPascalCase("API test URL example", "API")).toBe(
      "APITestUrlExample"
    );
    expect(toPascalCase("API test URL example", "URL")).toBe(
      "ApiTestURLExample"
    );
  });
});

describe("toPascalCase - ignoreWord as array or Set", () => {
  it("should handle array of ignoreWords", () => {
    expect(toPascalCase("ignore API and URL", ["API", "URL"])).toBe(
      "IgnoreAPIAndURL"
    );
    expect(toPascalCase("keep HTTP and HTTPS keys", ["HTTP", "HTTPS"])).toBe(
      "KeepHTTPAndHTTPSKeys"
    );

    expect(toPascalCase("keep HTTP and HTTPS keys", ["HTTP", "HTTPS"])).toBe(
      "KeepHTTPAndHTTPSKeys"
    );
  });

  it("should handle Set of ignoreWords", () => {
    expect(toPascalCase("ignore API and URL", new Set(["API", "URL"]))).toBe(
      "IgnoreAPIAndURL"
    );
    expect(
      toPascalCase("keep HTTP and HTTPS keys", new Set(["HTTP", "HTTPS"]))
    ).toBe("KeepHTTPAndHTTPSKeys");
  });
});

describe("toPascalCase - extra edge cases", () => {
  it("should handle non-string inputs gracefully", () => {
    expect(toPascalCase(123 as any)).toBe("");
    expect(toPascalCase(true as any)).toBe("");
    expect(toPascalCase(false as any)).toBe("");
    expect(toPascalCase({} as any)).toBe("");
    expect(toPascalCase([] as any)).toBe("");
    expect(toPascalCase(Symbol("x") as any)).toBe("");
    expect(toPascalCase((() => {}) as any)).toBe("");
    expect(toPascalCase(new Date() as any)).toBe("");
    expect(toPascalCase(/regex/ as any)).toBe("");
  });

  it("should handle very large input string", () => {
    const long = "word ".repeat(1000); // 1000 words
    const result = toPascalCase(long);
    expect(result.startsWith("WordWordWord")).toBe(true);
    expect(result.length).toBe(4000);
  });

  it("should handle surrogate pairs and grapheme clusters", () => {
    expect(toPascalCase("👩‍👩‍👧‍👦 family test")).toBe("FamilyTest");
    expect(toPascalCase("🇯🇵 japan flag")).toBe("JapanFlag");
    expect(toPascalCase("man👨‍🚀space")).toBe("ManSpace");
  });

  it("should handle ignoreWord case sensitivity test", () => {
    expect(toPascalCase("this url path", "URL")).toBe("ThisUrlPath");
    expect(toPascalCase("this URL path", "url")).toBe("ThisUrlPath");
  });

  it("should ignore duplicate words in array or Set", () => {
    expect(toPascalCase("keep API and API", ["API", "API"])).toBe(
      "KeepAPIAndAPI"
    );
    expect(toPascalCase("keep URL path", new Set(["URL", "URL"]))).toBe(
      "KeepURLPath"
    );
  });

  it("should ignoreWord not present in string (no effect)", () => {
    expect(toPascalCase("this is normal text", "MISSING")).toBe(
      "ThisIsNormalText"
    );
  });

  it("should not partially match ignoreWord inside another word", () => {
    expect(toPascalCase("specialAPIcase", "API")).toBe("Specialapicase");
    expect(toPascalCase("superURLman", "URL")).toBe("Superurlman");
  });

  it("should preserve consecutive ignored words", () => {
    expect(toPascalCase("API URL key", ["API", "URL"])).toBe("APIURLKey");
  });

  it("should work with ignoreWord as mixed collection types", () => {
    const mixed = new Set(["API", "URL", "HTTP"]);
    expect(toPascalCase("API URL and HTTP", mixed)).toBe("APIURLAndHTTP");
  });

  it("should handle nested delimiters with ignoreWord", () => {
    expect(toPascalCase("__API---URL___path", ["API", "URL"])).toBe(
      "APIURLPath"
    );
  });
});
