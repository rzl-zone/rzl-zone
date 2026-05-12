import { describe, it, expect } from "vitest";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { assertIsBigInt } from "@/assertions/number/assertIsBigInt";

describe("assertIsBigInt", () => {
  it("should pass when value is bigint", () => {
    expect(() => assertIsBigInt(123n)).not.toThrow();
    const value: unknown = 999n;
    assertIsBigInt(value);
    // after assertion, TS knows value is bigint
    const result: bigint = value;
    expect(result).toBe(999n);
  });

  it("should throw when value is not bigint", () => {
    expect(() => assertIsBigInt(42)).toThrow(TypeError);
    expect(() => assertIsBigInt("123")).toThrow(TypeError);
    expect(() => assertIsBigInt(null)).toThrow(TypeError);
    expect(() => assertIsBigInt(undefined)).toThrow(TypeError);
    expect(() => assertIsBigInt({})).toThrow(TypeError);
  });

  it("should use custom string error message", () => {
    expect(() =>
      assertIsBigInt(42, { message: "Must be a bigint!" })
    ).toThrowError("Must be a bigint!");
  });

  it("should use custom function error message", () => {
    expect(() =>
      assertIsBigInt(42, {
        message: (type) =>
          `Expected ${type.validType} but got (${type.currentType}).`
      })
    ).toThrowError(/Expected bigint but got \(number\)/);
  });

  it("should respect formatCase option", () => {
    expect(() =>
      assertIsBigInt(42, {
        message: (type) =>
          `Expected ${type.validType} but got (${type.currentType}).`,
        formatCase: "toKebabCase"
      })
    ).toThrowError("Expected bigint but got (number).");
  });
});

describe("assertIsBigInt - respect to errorType options", () => {
  it("throws the correct error type when errorType is specified", () => {
    const val = 123 as unknown;
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
      expect(() => assertIsBigInt(val, { errorType: type })).toThrowError(
        new globalThis[type](
          `Parameter input (\`value\`) must be of type \`bigint\`, but received: \`${getPreciseType(
            val
          )}\`.`
        )
      );
    });
  });

  it("falls back to TypeError if invalid errorType is provided", () => {
    const val = 123 as unknown;
    // @ts-expect-error: testing invalid errorType
    expect(() =>
      assertIsBigInt(val, { errorType: "SomeUnknownError" })
    ).toThrowError(TypeError);
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsBigInt(val, { errorType: "SomeUnknownError" })
    ).toThrow(
      `Parameter input (\`value\`) must be of type \`bigint\`, but received: \`${getPreciseType(
        val
      )}\`.`
    );
  });
});
