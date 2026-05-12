import { describe, it, expect } from "vitest";
import { arrayHasAnyMatch } from "@/predicates/has/arrayHasAnyMatch";

describe("arrayHasAnyMatch", () => {
  it("should return true if at least one element matches (strings)", () => {
    expect(
      arrayHasAnyMatch(["apple", "banana", "cherry"], ["banana", "grape"])
    ).toBe(true);
  });

  it("should return false if no elements match (strings)", () => {
    expect(arrayHasAnyMatch(["red", "blue"], ["green", "yellow"])).toBe(false);
  });

  it("should return true if at least one element matches (numbers)", () => {
    expect(arrayHasAnyMatch([1, 2, 3], [3, 4, 5])).toBe(true);
  });

  it("should return false if source array is empty", () => {
    expect(arrayHasAnyMatch([], ["test"])).toBe(false);
  });

  it("should return false if target array is empty", () => {
    expect(arrayHasAnyMatch(["A", "B", "C"], [])).toBe(false);
  });

  it("should return false if both arrays are empty", () => {
    expect(arrayHasAnyMatch([], [])).toBe(false);
  });

  it("should return false if either parameter is not an array", () => {
    // @ts-expect-error invalid type props for test only
    expect(arrayHasAnyMatch("not array", ["A"])).toBe(false);
    expect(arrayHasAnyMatch(["A"], null)).toBe(false);
    expect(arrayHasAnyMatch(undefined, ["A"])).toBe(false);
    // @ts-expect-error invalid type props for test only
    expect(arrayHasAnyMatch(["A"], {})).toBe(false);
  });

  it("should support mixed types (boolean, null, undefined)", () => {
    expect(arrayHasAnyMatch([true, false, null], [null])).toBe(true);
    expect(arrayHasAnyMatch([undefined, 0], [1, undefined])).toBe(true);
    // @ts-expect-error invalid props targetArray.
    expect(arrayHasAnyMatch([0, ""], [false])).toBe(false);
  });

  it("should support object reference equality", () => {
    const obj = { a: 1 };
    const arr = [obj, { b: 2 }];
    expect(arrayHasAnyMatch(arr, [{ a: 1 }])).toBe(false); // different reference
    expect(arrayHasAnyMatch(arr, [obj])).toBe(true); // same reference
  });

  it("should support nested arrays by reference (array inside array)", () => {
    const inner = [1, 2];
    expect(
      arrayHasAnyMatch(
        [
          [1, 2],
          [3, 4]
        ],
        [[1, 2]]
      )
    ).toBe(false);
    expect(
      arrayHasAnyMatch(
        [
          [1, 2],
          [3, 4]
        ],
        [inner]
      )
    ).toBe(false);
    expect(arrayHasAnyMatch([inner, [3, 4]], [inner])).toBe(true);
  });

  it("should return false if nested structure looks equal but not same reference", () => {
    expect(arrayHasAnyMatch([[1, 2]], [[1, 2]])).toBe(false);
  });

  it("should support complex mixed references (number, string, object, array, function)", () => {
    const fn = () => "test";
    const obj = { foo: "bar" };
    const arr = [42, "hello", obj, fn];
    expect(arrayHasAnyMatch(arr, [43, "world"])).toBe(false);
    expect(arrayHasAnyMatch(arr, ["hello"])).toBe(true);
    expect(arrayHasAnyMatch(arr, [obj])).toBe(true); // same object reference
    expect(arrayHasAnyMatch(arr, [{ foo: "bar" }])).toBe(false); // different object ref
    expect(arrayHasAnyMatch(arr, [fn])).toBe(true); // same function reference
    expect(arrayHasAnyMatch(arr, [() => "test"])).toBe(false); // different function ref
  });

  it("should return false if values are deeply equal objects but not same reference", () => {
    const obj1 = { nested: { a: 1 } };
    const obj2 = { nested: { a: 1 } };
    expect(arrayHasAnyMatch([obj1], [obj2])).toBe(false);
  });
});
