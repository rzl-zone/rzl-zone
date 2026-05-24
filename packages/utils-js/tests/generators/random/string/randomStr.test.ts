/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { randomStr } from "@/generators/random/string/randomStr";
import { createMessage } from "@/_private/logger";
import { joinLines } from "@rzl-zone/build-tools/utils";

describe("randomStr", () => {
  it("should generate a string with exact length when minLength equals maxLength", () => {
    const str = randomStr({ minLength: 10, maxLength: 10 });
    expect(str.length).toBe(10);
  });

  it("should generate a string within the specified length range", () => {
    const str = randomStr({ minLength: 5, maxLength: 15 });
    expect(str.length).toBeGreaterThanOrEqual(5);
    expect(str.length).toBeLessThanOrEqual(15);
  });

  it("should generate numeric strings when type is 'number'", () => {
    const str = randomStr({ minLength: 10, maxLength: 10, type: "number" });
    expect(/^[0-9]+$/.test(str)).toBe(true);
  });

  it("should respect avoidWhiteSpace = false (allow custom whitespace chars)", () => {
    const str = randomStr({
      minLength: 10,
      maxLength: 10,
      replaceGenStr: "A B\nC\t",
      avoidWhiteSpace: false
    });
    expect(/[ \n\t]/.test(str)).toBe(true);
  });

  it("should clean out whitespace when avoidWhiteSpace = true", () => {
    const str = randomStr({
      minLength: 10,
      maxLength: 10,
      replaceGenStr: "A B\nC\t",
      avoidWhiteSpace: true
    });
    expect(/[ \n\t]/.test(str)).toBe(false);
  });

  it("should add extra characters from addChar", () => {
    let found = false;
    for (let i = 0; i < 20; i++) {
      const str = randomStr({
        minLength: 20,
        maxLength: 20,
        addChar: "#$%"
      });
      if (/[#$%]/.test(str)) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it("should throw an error for invalid parameters (type)", () => {
    expect(() => randomStr({ type: [] as any })).toThrow(
      // eslint-disable-next-line quotes
      'Parameter `type` must be of type `string` with value one of "string" | "number", but received: `array`, with value: [].'
    );
    expect(() => randomStr({ type: "invalid" as any })).toThrow(
      // eslint-disable-next-line quotes
      'Parameter `type` must be of type `string` with value one of "string" | "number", but received: `string`, with value: "invalid".'
    );
  });

  it("should throw an error for invalid minLength and maxLength", () => {
    expect(() => randomStr({ minLength: -1 })).toThrow();
    expect(() => randomStr({ maxLength: 6000 })).toThrow();
    expect(() => randomStr({ minLength: 10, maxLength: 5 })).toThrow();
  });

  it("should throw an error if character set becomes empty", () => {
    expect(() => {
      randomStr({
        minLength: 5,
        maxLength: 5,
        replaceGenStr: " ",
        avoidWhiteSpace: true
      });
    }).toThrow(
      createMessage(
        "randomStr",
        joinLines(
          "Character set is empty.",
          "  > Ensure `replaceGenStr` has valid characters and non empty string."
        )
      )
    );
  });

  it("should use predictable output with mocked Math.random", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    const str = randomStr({ minLength: 5, maxLength: 5 });
    expect(str.length).toBe(5);
    vi.restoreAllMocks();
  });
});
