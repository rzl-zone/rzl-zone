import { describe, expect, it } from "vitest";
import { toBooleanContentDeep } from "@/conversions/boolean/toBooleanContentDeep";

describe("toBooleanContentDeep", () => {
  const cases: Array<[unknown, boolean]> = [
    [null, false],
    [undefined, false],
    ["", false],
    ["   ", false],
    [0, false],
    [false, false],
    [[], false],
    [{}, false],
    [[[], {}], false],
    [{ a: [], b: {} }, false],
    [{ a: { b: [] } }, false],

    ["abc", true],
    ["   abc", true],
    [42, true],
    [NaN, true],
    [true, true],
    [[0, "", 5], true],
    [[NaN, "", 0], true],
    [{ a: 1 }, true],
    [{ a: { b: "x" } }, true],
    [[[], {}, "nonempty"], true],
    [[0, "", null], false]
  ];

  it.each(cases)("should convert %p to %p", (input, expected) => {
    expect(toBooleanContentDeep(input)).toBe(expected);
  });
});
