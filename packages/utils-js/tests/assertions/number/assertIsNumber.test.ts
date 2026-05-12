import { describe, it, expect } from "vitest";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { assertIsNumber } from "@/assertions/number/assertIsNumber";

describe("assertIsNumber", () => {
  it("should not throw if value is a number", () => {
    expect(() => assertIsNumber(123)).not.toThrow();
    expect(() => assertIsNumber(0)).not.toThrow();
    expect(() => assertIsNumber(-999.99)).not.toThrow();
  });

  it("should throw if value is not a number", () => {
    expect(() => assertIsNumber("123")).toThrow(TypeError);
    expect(() => assertIsNumber(123n)).toThrow(TypeError);
    expect(() => assertIsNumber(null)).toThrow(TypeError);
    expect(() => assertIsNumber(undefined)).toThrow(TypeError);
    expect(() => assertIsNumber({})).toThrow(TypeError);
    expect(() => assertIsNumber([])).toThrow(TypeError);
  });

  it("should throw for NaN if includeNaN = false (default)", () => {
    expect(() => assertIsNumber(NaN)).toThrow(TypeError);
  });

  it("should not throw for NaN if includeNaN = true", () => {
    expect(() => assertIsNumber(NaN, { includeNaN: true })).not.toThrow();
  });

  it("should narrow type correctly", () => {
    const maybe: unknown = 42;
    assertIsNumber(maybe);

    const doubled = maybe * 2;
    expect(doubled).toBe(84);
  });
});

describe("assertIsNumber - respect to errorType options", () => {
  it("throws the correct error type when errorType is specified", () => {
    const val = "not a number" as unknown;
    const errorTypes = [
      "Error",
      "EvalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError"
    ] as const;

    errorTypes.forEach((type) => {
      expect(() => assertIsNumber(val, { errorType: type })).toThrow(
        new globalThis[type](
          `Parameter input (\`value\`) must be of type \`number\`, but received: \`${getPreciseType(
            val
          )}\`.`
        )
      );
    });
  });

  it("falls back to TypeError if invalid errorType is provided", () => {
    const val = "not a number" as unknown;
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsNumber(val, { errorType: "SomeUnknownError" })
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsNumber(val, { errorType: "SomeUnknownError" })
    ).toThrow(
      `Parameter input (\`value\`) must be of type \`number\`, but received: \`${getPreciseType(
        val
      )}\`.`
    );
  });
});
