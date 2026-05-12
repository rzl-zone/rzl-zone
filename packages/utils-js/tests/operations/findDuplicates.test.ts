import { describe, it, expect } from "vitest";
import { findDuplicates } from "@/operations/findDuplicates";

describe("findDuplicates", () => {
  it("should find duplicate numbers", () => {
    expect(findDuplicates([1, 2, 2, 3, 4, 4])).toEqual([2, 4]);
  });

  it("should find duplicate strings", () => {
    expect(findDuplicates(["apple", "banana", "apple", "orange"])).toEqual([
      "apple"
    ]);
  });

  it("should find duplicate booleans", () => {
    expect(findDuplicates([true, false, true])).toEqual([true]);
  });

  it("should return empty array if no duplicates", () => {
    expect(findDuplicates([1, 2, 3, 4])).toEqual([]);
  });

  it("should handle empty array", () => {
    expect(findDuplicates([])).toEqual([]);
  });

  it("should detect duplicate objects by deep equality", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1 };
    const obj3 = { a: 2 };
    expect(findDuplicates([obj1, obj2, obj3])).toEqual([{ a: 1 }]);
  });

  it("should detect duplicate arrays by deep equality", () => {
    expect(
      findDuplicates([
        [1, 2],
        [1, 2],
        [3, 4]
      ])
    ).toEqual([[1, 2]]);
  });

  it("should detect multiple duplicates of different kinds", () => {
    expect(findDuplicates([1, "1", 1, "1"])).toEqual([1, "1"]);
  });

  it("should handle nested arrays with same reference", () => {
    const arr = [1, 2];
    expect(findDuplicates([arr, arr, arr])).toEqual([[1, 2]]);
  });

  it("should not consider distinct object references with same values twice", () => {
    const a = { x: 1 };
    const b = { x: 1 };
    const c = { x: 1 };
    expect(findDuplicates([a, b, c])).toEqual([{ x: 1 }]);
  });

  it("should work with undefined values", () => {
    expect(findDuplicates([undefined, undefined, null, null])).toEqual([
      undefined,
      null
    ]);
  });

  it("should work with NaN values (lodash isEqual treats NaN equal)", () => {
    expect(findDuplicates([NaN, NaN, 1])).toEqual([NaN]);
  });

  it("should handle mixed types properly", () => {
    const result = findDuplicates([1, "1", true, false, true, "1", 1]);
    expect(result).toEqual(expect.arrayContaining([true, "1", 1]));
    expect(result.length).toBe(3); // ensure exactly total
  });

  it("should handle mixed types properly with controlled order", () => {
    const result = findDuplicates([true, false, true, "1", 1, "1", 1]);
    expect(result).toEqual([true, "1", 1]);
  });

  it("should handle very large array", () => {
    const large = Array(10000)
      .fill(0)
      .map((_, i) => i % 100);
    expect(findDuplicates(large).length).toBeGreaterThan(0);
  });

  it("should throw TypeError if input is not array", () => {
    // @ts-expect-error Invalid type props for test only
    expect(() => findDuplicates(null)).toThrow(TypeError);
    // @ts-expect-error Invalid type props for test only
    expect(() => findDuplicates({})).toThrow(TypeError);
    // @ts-expect-error Invalid type props for test only
    expect(() => findDuplicates("string")).toThrow(TypeError);
    // @ts-expect-error Invalid type props for test only
    expect(() => findDuplicates(123)).toThrow(TypeError);
    // @ts-expect-error Invalid type props for test only
    expect(() => findDuplicates(undefined)).toThrow(TypeError);
  });

  it("should not mutate original array", () => {
    const arr = [1, 2, 2, 3];
    const copy = [...arr];
    findDuplicates(arr);
    expect(arr).toEqual(copy);
  });

  it("should work with identical date objects", () => {
    const d1 = new Date("2023-01-01");
    const d2 = new Date("2023-01-01");
    expect(findDuplicates([d1, d2])).toEqual([d1]);
  });

  it("should detect duplicate null values", () => {
    expect(findDuplicates([null, null, null])).toEqual([null]);
  });
});
