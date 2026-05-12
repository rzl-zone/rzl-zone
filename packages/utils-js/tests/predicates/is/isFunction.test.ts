import { describe, expect, it } from "vitest";
import { isFunction } from "@/predicates/is/isFunction";

describe("isFunction", () => {
  it("should return true for normal functions", () => {
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(() => {})).toBe(true);
  });

  it("should return true for async and generator functions", () => {
    expect(isFunction(async () => {})).toBe(true);
    expect(isFunction(function* () {})).toBe(true);
    expect(isFunction(async function* () {})).toBe(true);
  });

  it("should return false for non-functions", () => {
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction("string")).toBe(false);
    expect(isFunction(123)).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction(Symbol("s"))).toBe(false);
    expect(isFunction(BigInt(10))).toBe(false);
  });

  it("should narrow the type correctly", () => {
    const maybeFn: unknown = () => "ok";

    if (isFunction(maybeFn)) {
      const result = maybeFn(); // ✅ result is `unknown`
      expect(typeof result).toBe("string");
    }
  });
});
