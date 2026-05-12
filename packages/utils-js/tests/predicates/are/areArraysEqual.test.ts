import { areArraysEqual } from "@/predicates/are/areArraysEqual";
import { describe, it, expect } from "vitest";

describe("areArraysEqual", () => {
  it("should return true for identical primitive arrays", () => {
    expect(areArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it("should return false for arrays with different order if ignoreOrder is false", () => {
    expect(areArraysEqual([1, 2, 3], [3, 2, 1])).toBe(false);
  });

  it("should return true for arrays with same elements in different order if ignoreOrder is true", () => {
    expect(areArraysEqual([1, 2, 3], [3, 2, 1], true)).toBe(true);
  });

  it("should return false if arrays have different lengths", () => {
    expect(areArraysEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it("should deeply compare arrays with objects", () => {
    expect(areArraysEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(
      true
    );
  });

  it("should return false for deeply unequal arrays", () => {
    expect(areArraysEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(
      false
    );
  });

  it("should deeply compare nested arrays", () => {
    expect(
      areArraysEqual(
        [
          [1, 2],
          [3, 4]
        ],
        [
          [1, 2],
          [3, 4]
        ]
      )
    ).toBe(true);
  });

  it("should return false if nested array values differ", () => {
    expect(
      areArraysEqual(
        [
          [1, 2],
          [3, 4]
        ],
        [
          [1, 2],
          [4, 3]
        ]
      )
    ).toBe(false);
  });

  it("should sort nested primitives if ignoreOrder is true", () => {
    expect(
      areArraysEqual(
        [
          [2, 1],
          [4, 3]
        ],
        [
          [1, 2],
          [3, 4]
        ],
        true
      )
    ).toBe(true);
  });

  it("should throw TypeError if arr1 or arr2 is not array", () => {
    // @ts-expect-error Invalid type prop for test only
    expect(() => areArraysEqual(123, [1, 2, 3])).toThrow(
      "Parameters `array1` and `array2` property of the `options` (second parameter) must be of type `array`, but received: ['array1': `number`, 'array2': `array`]."
    );
    // @ts-expect-error Invalid type prop for test only
    expect(() => areArraysEqual([1, 2, 3], null)).toThrow(
      "Parameters `array1` and `array2` property of the `options` (second parameter) must be of type `array`, but received: ['array1': `array`, 'array2': `null`]."
    );
  });

  it("should throw TypeError if ignoreOrder is not boolean", () => {
    // @ts-expect-error Invalid type prop for test only
    expect(() => areArraysEqual([1], [1], "yes")).toThrow(
      "Third parameter `ignoreOrder` must be of type `boolean`, but received: `string`."
    );
  });

  // ✅ Additional tests

  it("should return true for two empty arrays", () => {
    expect(areArraysEqual([], [])).toBe(true);
  });

  it("should return false if one array is empty and other is not", () => {
    expect(areArraysEqual([], [1])).toBe(false);
  });

  it("should deeply sort nested arrays of objects if ignoreOrder is true", () => {
    expect(
      areArraysEqual(
        [
          [{ a: 2 }, { a: 1 }],
          [4, 3]
        ],
        [
          [{ a: 1 }, { a: 2 }],
          [3, 4]
        ],
        true
      )
    ).toBe(true);
  });

  it("should return false if nested objects have different properties", () => {
    expect(
      areArraysEqual(
        [
          [{ a: 2 }, { b: 1 }],
          [4, 3]
        ],
        [
          [{ a: 1 }, { a: 2 }],
          [3, 4]
        ],
        true
      )
    ).toBe(false);
  });

  it("should return true for nested identical object arrays ignoring order", () => {
    expect(
      areArraysEqual(
        [[{ x: 1 }, { y: 2 }], [{ z: 3 }]],
        [[{ z: 3 }], [{ y: 2 }, { x: 1 }]],
        true
      )
    ).toBe(true);
  });

  it("should return false for nested identical object arrays if ignoreOrder is false", () => {
    expect(
      areArraysEqual(
        [[{ x: 1 }, { y: 2 }], [{ z: 3 }]],
        [[{ z: 3 }], [{ y: 2 }, { x: 1 }]],
        false
      )
    ).toBe(false);
  });
});
