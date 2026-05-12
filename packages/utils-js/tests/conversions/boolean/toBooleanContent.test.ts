import { describe, expect, it } from "vitest";
import { toBooleanContent } from "@/conversions/boolean/toBooleanContent";

const stringifyForTest = (value: unknown): string => {
  if (typeof value === "symbol") return value.toString();
  if (typeof value === "function") return "[Function]";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

describe("toBooleanContent ", () => {
  const cases: [unknown, boolean][] = [
    [null, false],
    [undefined, false],
    ["", false],
    ["   ", false],
    ["  asd ", true],
    ["abc", true],
    [0, false],
    [NaN, true],
    [Infinity, true],
    [-Infinity, true],
    [Number.MIN_VALUE, true],
    [42, true],
    [[], false],
    [[1], true],
    [{}, false],
    [{ a: 1 }, true]
  ];

  cases.forEach(([input, expected]) => {
    it(`should convert ${stringifyForTest(input)} to ${expected}`, () => {
      expect(toBooleanContent(input)).toBe(expected);
    });
  });

  it("should convert Symbol to true", () => {
    expect(toBooleanContent(Symbol("s"))).toBe(true);
  });

  it("should convert function to true", () => {
    expect(toBooleanContent(() => {})).toBe(true);
  });

  it("mixed", () => {
    expect(toBooleanContent("")).toBe(false);
    expect(toBooleanContent("   ")).toBe(false);
    expect(toBooleanContent(" has ")).toBe(true);
  });
});
