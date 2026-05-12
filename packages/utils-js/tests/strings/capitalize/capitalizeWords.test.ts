import { describe, it, expect } from "vitest";
import { capitalizeWords } from "@/strings/capitalizations/capitalizeWords";

describe("capitalizeWords with options", () => {
  it("should capitalize normally without options", () => {
    expect(capitalizeWords("hello world")).toBe("Hello World");
    expect(capitalizeWords("  hello   world  ", { trim: true })).toBe(
      "Hello   World"
    );
  });

  it("should trim spaces at start and end if trim option is true", () => {
    expect(capitalizeWords("  hello   world  ", { trim: true })).toBe(
      "Hello   World"
    );
    expect(capitalizeWords("   openai    ", { trim: true })).toBe("Openai");
  });

  it("should collapse multiple spaces into one if collapseSpaces is true", () => {
    expect(capitalizeWords("  hello   world  ", { collapseSpaces: true })).toBe(
      "  Hello World  "
    );
    expect(
      capitalizeWords("this    is   a test", { collapseSpaces: true })
    ).toBe("This Is A Test");
  });

  it("should do both trim and collapseSpaces if both options are true", () => {
    expect(
      capitalizeWords("  hello   world  ", {
        trim: true,
        collapseSpaces: true
      })
    ).toBe("Hello World");
    expect(
      capitalizeWords("   multiple    spaces   here  ", {
        trim: true,
        collapseSpaces: true
      })
    ).toBe("Multiple Spaces Here");
  });

  it("should handle empty string", () => {
    expect(capitalizeWords("", { trim: true, collapseSpaces: true })).toBe("");
    expect(capitalizeWords("    ", { trim: true, collapseSpaces: true })).toBe(
      ""
    );
  });

  it("should handle null or undefined input", () => {
    expect(capitalizeWords(null, { trim: true })).toBe("");
    expect(capitalizeWords(undefined, { collapseSpaces: true })).toBe("");
  });

  it("should handle single word input", () => {
    expect(capitalizeWords("hello", { trim: true })).toBe("Hello");
    expect(capitalizeWords("HELLO", { collapseSpaces: true })).toBe("Hello");
  });

  it("should handle strings with numbers and special chars", () => {
    expect(capitalizeWords("123 abc", { collapseSpaces: true })).toBe(
      "123 Abc"
    );
    expect(capitalizeWords("!hello @world", { trim: true })).toBe(
      "!hello @world"
    );
  });
});

describe("capitalizeWords with options", () => {
  it("should capitalize normally without options on long sentences", () => {
    expect(capitalizeWords("this is a long sentence with many words")).toBe(
      "This Is A Long Sentence With Many Words"
    );

    expect(
      capitalizeWords(" another   example    with    excessive    spaces ")
    ).toBe(" Another   Example    With    Excessive    Spaces ");
  });

  it("should handle multiple sentences separated by periods or exclamation marks", () => {
    expect(capitalizeWords("hello world. this is a test! do it now.")).toBe(
      "Hello World. This Is A Test! Do It Now."
    );

    expect(capitalizeWords(" wait... is this working? yes, it is ")).toBe(
      " Wait... Is This Working? Yes, It Is "
    );
  });

  it("should process text with special characters, emojis and mixed punctuation", () => {
    expect(capitalizeWords("hello 😊 world! how's everything?")).toBe(
      "Hello 😊 World! How's Everything?"
    );

    expect(capitalizeWords("@user #hashtag $dollar ^caret &and *star")).toBe(
      "@user #hashtag $dollar ^caret &and *star"
    );
  });

  it("should correctly process three or more sentences combined", () => {
    const input =
      "this is sentence one. here comes sentence two! finally, sentence three?";
    expect(capitalizeWords(input)).toBe(
      "This Is Sentence One. Here Comes Sentence Two! Finally, Sentence Three?"
    );
  });

  it("should work properly when both trim and collapseSpaces are enabled on complex input", () => {
    const input =
      "   this    is   a   long    line   with    weird   spacing.   next   line?    done.    ";
    expect(capitalizeWords(input, { trim: true, collapseSpaces: true })).toBe(
      "This Is A Long Line With Weird Spacing. Next Line? Done."
    );
  });

  it("should handle input with numbers interleaved with text", () => {
    expect(capitalizeWords("123 testing 456 number 789 sequences")).toBe(
      "123 Testing 456 Number 789 Sequences"
    );

    expect(
      capitalizeWords("  42 is    the answer   ", {
        trim: true,
        collapseSpaces: true
      })
    ).toBe("42 Is The Answer");
  });

  it("should handle mix of upper and lower case and strange spacing", () => {
    const input = "  hELLo    WOrLD    tHiS    is     A     tESt  ";
    expect(capitalizeWords(input, { trim: true, collapseSpaces: true })).toBe(
      "Hello World This Is A Test"
    );
  });

  it("should handle edge case of only special characters", () => {
    expect(capitalizeWords(" @#$%^&*()_+ ")).toBe(" @#$%^&*()_+ ");
    expect(
      capitalizeWords(" @#$%^&*()_+ ", { trim: true, collapseSpaces: true })
    ).toBe("@#$%^&*()_+");
  });
});
