import { describe, it, expect, vi } from "vitest";
import { randomInt } from "@/generators/random/integer/randomInt";

/**
 * Tests for randomInt function
 *
 * Ensures that randomInt:
 * - Returns a random integer within the given range (inclusive).
 * - Always returns `min` if `min` equals `max`.
 * - Throws an error for invalid inputs (non-integers, or `min > max`).
 * - Constrains `min` to be at least 1, and `max` to not exceed Number.MAX_SAFE_INTEGER.
 * - Uses predictable outputs when Math.random is mocked.
 */
describe("randomInt", () => {
  it("should return a value equal to min when min equals max", () => {
    expect(randomInt(5, 5)).toBe(5);
    expect(randomInt(100, 100)).toBe(100);
  });

  it("should generate a random integer within the range (inclusive)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0); // Should give min
    expect(randomInt(10, 20)).toBe(10);

    vi.spyOn(Math, "random").mockReturnValue(0.999999999); // Should give max
    expect(randomInt(10, 20)).toBe(20);

    vi.spyOn(Math, "random").mockReturnValue(0.5); // Should give mid value
    expect(randomInt(10, 20)).toBe(15);

    vi.restoreAllMocks();
  });

  it("should adjust min to be at least 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(randomInt(-10, 5)).toBe(1); // because min is adjusted to 1

    vi.spyOn(Math, "random").mockReturnValue(0.9);
    expect(randomInt(-10, 5)).toBeGreaterThanOrEqual(1);
    vi.restoreAllMocks();
  });

  it("should adjust max to not exceed Number.MAX_SAFE_INTEGER", () => {
    const hugeMax = Number.MAX_SAFE_INTEGER + 100000;
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(randomInt(1, hugeMax)).toBe(1);

    vi.spyOn(Math, "random").mockReturnValue(0.99999);
    expect(randomInt(1, hugeMax)).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);

    vi.restoreAllMocks();
  });

  it("should throw an error if min or max is an Number.MIN_VALUE", () => {
    expect(() => randomInt(Number.MIN_VALUE, 10)).toThrow(Error);
    expect(() => randomInt(Number.MIN_VALUE, 10.7)).toThrow(Error);
    expect(() => randomInt("1" as unknown as number, 10)).toThrow(Error);
  });

  it("should throw an error if min or max is not an integer", () => {
    expect(() => randomInt(1.5, 10)).toThrow(Error);
    expect(() => randomInt(1, 10.7)).toThrow(Error);
    expect(() => randomInt("1" as unknown as number, 10)).toThrow(Error);
  });

  it("should throw an error if min is greater than max", () => {
    expect(() => randomInt(20, 10)).toThrow(Error);
    expect(() => randomInt(100, 50)).toThrow(Error);
  });
});
