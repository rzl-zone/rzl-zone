import { describe, it, expect, vi } from "vitest";
import { randomIntByLength } from "@/generators/random/integer/randomIntByLength";

describe("randomIntByLength", () => {
  it("should generate a number with the exact number of digits when minLength equals maxLength", () => {
    for (let digits = 1; digits <= 5; digits++) {
      const num = randomIntByLength({ minLength: digits, maxLength: digits });
      expect(num.toString().length).toBe(digits);
    }
  });

  it("should generate a number between minLength and maxLength digits", () => {
    const minLength = 2;
    const maxLength = 4;
    for (let i = 0; i < 10; i++) {
      const num = randomIntByLength({ minLength, maxLength });
      expect(num.toString().length).toBeGreaterThanOrEqual(minLength);
      expect(num.toString().length).toBeLessThanOrEqual(maxLength);
    }
  });

  it("should default to minLength=1 and maxLength=16 when no options provided", () => {
    const num = randomIntByLength();
    expect(num.toString().length).toBeGreaterThanOrEqual(1);
    expect(num.toString().length).toBeLessThanOrEqual(16);
  });

  it("should respect avoidZero=true and never return zero", () => {
    vi.spyOn(Math, "random").mockReturnValue(0); // Force min
    const num = randomIntByLength({
      minLength: 1,
      maxLength: 1,
      avoidZero: true
    });
    expect(num).not.toBe(0);
    vi.restoreAllMocks();
  });

  it("should throw an error for invalid minLength or maxLength values", () => {
    expect(() => randomIntByLength({ minLength: 0, maxLength: 2 })).toThrow(
      Error
    );
    expect(() => randomIntByLength({ minLength: 1, maxLength: 20 })).toThrow(
      Error
    );
    expect(() => randomIntByLength({ minLength: 5, maxLength: 2 })).toThrow(
      Error
    );
    expect(() => randomIntByLength({ minLength: 1.5, maxLength: 4 })).toThrow(
      Error
    );
  });

  it("should handle case where minLength equals maxLength with avoidZero", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const num = randomIntByLength({
      minLength: 3,
      maxLength: 3,
      avoidZero: true
    });
    expect(num.toString().length).toBe(3);
    expect(num).not.toBe(0);
    vi.restoreAllMocks();
  });

  it("should generate minimal value when Math.random returns 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const num = randomIntByLength({ minLength: 4, maxLength: 4 });
    expect(num).toBe(1000); // 10^(4-1)
    vi.restoreAllMocks();
  });

  it("should generate maximal value when Math.random returns ~1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9999999);
    const num = randomIntByLength({ minLength: 3, maxLength: 3 });
    expect(num).toBe(999);
    vi.restoreAllMocks();
  });
});
