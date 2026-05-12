import { describe, it, expect } from "vitest";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { assertIsArray } from "@/assertions/objects/assertIsArray";

describe("assertIsArray", () => {
  it("should not throw for a valid array", () => {
    expect(() => assertIsArray([1, 2, 3])).not.toThrow();
    const arr: unknown = [1, 2];
    assertIsArray(arr);
    // after assertion, arr is number[]
    expect(Array.isArray(arr)).toBe(true);
  });

  it("should throw TypeError with default message for non-array", () => {
    expect(() => assertIsArray(123)).toThrow(
      /Parameter input \(`value`\) must be of type `array`, but received: `number`\./
    );
  });

  it("should throw with custom string message", () => {
    expect(() =>
      assertIsArray("hello", { message: "Must be an array!" })
    ).toThrow("Must be an array!");
  });

  it("should throw with custom function message", () => {
    expect(() =>
      assertIsArray(42, {
        message: (type) =>
          `Expected ${type.validType} but got ${type.currentType}`
      })
    ).toThrow("Expected array but got number");
  });

  it("should throw with custom function + formatCase", () => {
    expect(() =>
      assertIsArray(123n, {
        message: (type) =>
          `Expected ${type.validType} but got (${type.currentType}).`,
        formatCase: "toKebabCase"
      })
    ).toThrow("Expected array but got (bigint).");
  });

  it("should work with union narrowing", () => {
    const mixed: string | number[] | undefined = [1, 2];
    assertIsArray(mixed);
    // TS should know it's number[] now
    expect(mixed.every((x) => typeof x === "number")).toBe(true);
  });
});

describe("assertIsArray - respect to errorType options", () => {
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
      expect(() => assertIsArray(val, { errorType: type })).toThrow(
        new globalThis[type](
          `Parameter input (\`value\`) must be of type \`array\`, but received: \`${getPreciseType(
            val
          )}\`.`
        )
      );
    });
  });

  it("falls back to TypeError if invalid errorType is provided", () => {
    const val = 123 as unknown;
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsArray(val, { errorType: "SomeUnknownError" })
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsArray(val, { errorType: "SomeUnknownError" })
    ).toThrow(
      `Parameter input (\`value\`) must be of type \`array\`, but received: \`${getPreciseType(
        val
      )}\`.`
    );
  });
});
