/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { filterNilArray } from "@/conversions/arrays/transforms/filterNilArray";

describe("filterNilArray", () => {
  it("should remove null and undefined in flat array", () => {
    expect(filterNilArray([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
    expect(filterNilArray(["a", null, "b", undefined, "c"])).toEqual([
      "a",
      "b",
      "c"
    ]);
  });

  it("should return empty array if all elements are null or undefined", () => {
    expect(filterNilArray([null, undefined, null])).toEqual([]);
    expect(
      filterNilArray([null, [null, [undefined]], undefined, null])
    ).toEqual([]);
  });

  it("should return undefined if input is undefined or null", () => {
    expect(filterNilArray(undefined)).toBeUndefined();
    expect(filterNilArray(null)).toBeUndefined();
  });

  it("should return empty array if input is empty", () => {
    expect(filterNilArray([])).toEqual([]);
    expect(filterNilArray([[[]], [], undefined])).toEqual([]);
  });

  it("should handle nested arrays and preserve structure", () => {
    expect(filterNilArray([1, [null, 2, [undefined, 3]]])).toEqual([
      1,
      [2, [3]]
    ]);
    expect(filterNilArray([null, [undefined, [null, [undefined]]]])).toEqual(
      []
    );
    type Elem = Array<string | null | boolean | Array<string | undefined>>;
    const test: Elem[] = [
      ["a", null, true],
      ["b", [undefined, "c"]]
    ];

    expect(filterNilArray(test)).toEqual([
      ["a", true],
      ["b", ["c"]]
    ]);
  });

  it("should return array as-is if no null or undefined present", () => {
    expect(filterNilArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(filterNilArray(["x", "y", "z"])).toEqual(["x", "y", "z"]);
  });

  it("should return empty array for non-array input", () => {
    expect(filterNilArray("string" as any)).toEqual([]);
    expect(filterNilArray(123 as any)).toEqual([]);
    expect(filterNilArray({} as any)).toEqual([]);
  });

  it("should handle deeply nested arrays that become empty", () => {
    expect(filterNilArray([[[null, undefined]]])).toEqual([]);
    expect(filterNilArray([[null], [undefined]])).toEqual([]);
  });
});
