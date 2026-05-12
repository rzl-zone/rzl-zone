import { describe, it, expect } from "vitest";
import { capitalizeFirst } from "@/strings/capitalizations/capitalizeFirst";

describe("capitalizeFirst", () => {
  it("should capitalize first letter and lowercase the rest by default", () => {
    expect(capitalizeFirst("hello WORLD")).toBe("Hello world");
    expect(capitalizeFirst("JAVA script")).toBe("Java script");
    expect(capitalizeFirst("m")).toBe("M");
    expect(capitalizeFirst("HELLO")).toBe("Hello");
    expect(capitalizeFirst("heLLo")).toBe("Hello");
    expect(capitalizeFirst("hELLO")).toBe("Hello");
  });

  it("should keep the rest intact if lowerCaseNextRest is false", () => {
    expect(
      capitalizeFirst("hello WORLD", {
        lowerCaseNextRest: false
      })
    ).toBe("Hello WORLD");
    expect(
      capitalizeFirst("javaScript", {
        lowerCaseNextRest: false
      })
    ).toBe("JavaScript");
    expect(
      capitalizeFirst("hELLo WOrLD", {
        lowerCaseNextRest: false
      })
    ).toBe("HELLo WOrLD".replace(/^./, (c) => c.toUpperCase()));
  });

  it("should trim when trim option is true", () => {
    expect(capitalizeFirst("   hello WORLD   ", { trim: true })).toBe(
      "Hello world"
    );
    expect(
      capitalizeFirst("   JAVA script   ", {
        lowerCaseNextRest: false,
        trim: true
      })
    ).toBe("JAVA script");
    expect(capitalizeFirst("   m   ", { trim: true })).toBe("M");
    expect(capitalizeFirst("    ", { trim: true })).toBe("");
  });

  it("should handle strings that are only whitespace", () => {
    expect(capitalizeFirst("     ")).toBe("");
    expect(capitalizeFirst("     ", { trim: true })).toBe("");
  });

  it("should handle non-latin & accented characters", () => {
    expect(capitalizeFirst("ñandú")).toBe("Ñandú");
    expect(capitalizeFirst("éclair")).toBe("Éclair");
    expect(capitalizeFirst("čokoláda")).toBe("Čokoláda");
    expect(capitalizeFirst("中華")).toBe("中華");
    expect(capitalizeFirst("ñandú", { lowerCaseNextRest: false })).toBe(
      "Ñandú"
    );
  });

  it("should handle strings that start with numbers or symbols", () => {
    expect(capitalizeFirst("123abc")).toBe("123abc");
    expect(capitalizeFirst("!hello")).toBe("!hello");
    expect(capitalizeFirst("👍 cool")).toBe("👍 cool");
  });

  it("should collapse multi-space with trim", () => {
    expect(capitalizeFirst("   many     spaces   here  ", { trim: true })).toBe(
      "Many     spaces   here"
    );
  });

  it("should return empty string for null, undefined, or empty input", () => {
    expect(capitalizeFirst(null)).toBe("");
    expect(capitalizeFirst(undefined)).toBe("");
    expect(capitalizeFirst("")).toBe("");
  });

  it("should return empty string for non-string input types", () => {
    // @ts-expect-error invalid type for Test only
    expect(capitalizeFirst(123)).toBe("");
    // @ts-expect-error invalid type for Test only
    expect(capitalizeFirst({})).toBe("");
    // @ts-expect-error invalid type for Test only
    expect(capitalizeFirst([])).toBe("");
    // @ts-expect-error invalid type for Test only
    expect(capitalizeFirst(true)).toBe("");
    // @ts-expect-error invalid type for Test only
    expect(capitalizeFirst(() => {})).toBe("");
  });

  it("should fallback to default options if options is invalid", () => {
    // @ts-expect-error invalid type for Test only
    expect(capitalizeFirst("hello WORLD", "invalid")).toBe("Hello world");
    // @ts-expect-error invalid type for Test only
    expect(capitalizeFirst("FOO", 123)).toBe("Foo");
    // @ts-expect-error invalid type for Test only
    expect(capitalizeFirst("BAR", null)).toBe("Bar");
  });

  it("should handle single character strings correctly", () => {
    expect(capitalizeFirst("h")).toBe("H");
    expect(capitalizeFirst("H")).toBe("H");
    expect(capitalizeFirst("ñ")).toBe("Ñ");
    expect(capitalizeFirst("z", { lowerCaseNextRest: false })).toBe("Z");
  });

  it("should handle strings that are already properly capitalized", () => {
    expect(capitalizeFirst("Hello world")).toBe("Hello world");
    expect(
      capitalizeFirst("Hello World", {
        lowerCaseNextRest: false
      })
    ).toBe("Hello World");
  });

  it("should lowercase the rest even if already uppercase", () => {
    expect(capitalizeFirst("FOOBAR")).toBe("Foobar");
    expect(capitalizeFirst("FOOBAR baz")).toBe("Foobar baz");
  });

  it("should handle multi-script mixes", () => {
    expect(capitalizeFirst("абв ABC")).toBe("Абв abc");
    expect(
      capitalizeFirst("абв ABC", {
        lowerCaseNextRest: false
      })
    ).toBe("Абв ABC");
  });

  it("should preserve emojis / symbols intact", () => {
    expect(capitalizeFirst("😄hello")).toBe("😄hello");
    expect(capitalizeFirst("🤯HELLO WORLD")).toBe("🤯hello world");
  });
});
