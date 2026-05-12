/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { getRandomItem } from "@/generators/random/array/getRandomItem";

describe("getRandomItem", () => {
  it("should return a random element from the array", () => {
    const array = [100, 200, 300, 400, 500];

    // Mock Math.random to produce predictable outputs
    vi.spyOn(Math, "random").mockReturnValue(0.1); // 0.1 * 5 = 0.5 -> floor = 0
    expect(getRandomItem(array)).toBe(100);

    vi.spyOn(Math, "random").mockReturnValue(0.6); // 0.6 * 5 = 3 -> floor = 3
    expect(getRandomItem(array)).toBe(400);

    vi.restoreAllMocks();
  });

  it("should return undefined for an empty array", () => {
    expect(getRandomItem([])).toBeUndefined();
  });

  it("should return undefined if input is not an array", () => {
    // @ts-expect-error tests only for unset value
    expect(getRandomItem()).toBeUndefined();
    expect(getRandomItem(null)).toBeUndefined();
    expect(getRandomItem(undefined)).toBeUndefined();

    // intentionally invalid to test robustness
    const value: string | string[] | number[] | number[][] | string[][][] =
      "not-an-array" as any;
    expect(getRandomItem(value)).toBeUndefined();
  });

  it("should handle arrays with a single element", () => {
    expect(getRandomItem([0])).toBe(0);
    expect(getRandomItem([42])).toBe(42);
    expect(getRandomItem([true])).toBe(true);
    expect(getRandomItem([false])).toBe(false);
  });
});
