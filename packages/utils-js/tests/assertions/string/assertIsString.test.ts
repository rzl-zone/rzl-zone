import { describe, it, expect } from "vitest";
import { assertIsString } from "@/assertions/strings/assertIsString";
import { getPreciseType } from "@/predicates/type/getPreciseType";

describe("assertIsString", () => {
  it("should not throw for valid string", () => {
    expect(() => assertIsString("hello")).not.toThrow();
    expect(() => assertIsString("")).not.toThrow();
  });

  it("should throw with default message for non-string", () => {
    expect(() => assertIsString(42)).toThrow(
      "Parameter input (`value`) must be of type `string`, but received: `number`."
    );
    expect(() => assertIsString(null)).toThrow(
      "Parameter input (`value`) must be of type `string`, but received: `null`."
    );
  });

  it("should use custom string message if provided", () => {
    expect(() => assertIsString(42, { message: "Must be a string!" })).toThrow(
      "Must be a string!"
    );
    expect(() =>
      assertIsString(42, { message: "    Must be a string!   " })
    ).toThrow("Must be a string!");
  });

  it("should use custom function message if provided", () => {
    expect(() =>
      assertIsString(42, {
        message: (type) =>
          `Expected ${type.validType} but received ${type.currentType}`
      })
    ).toThrow("Expected string but received number");

    expect(() =>
      assertIsString(
        {},
        {
          message: (type) =>
            `Expected ${type.validType} but received ${type.currentType}`
        }
      )
    ).toThrow("Expected string but received object");
  });

  it("should fallback to default message if empty string given", () => {
    expect(() => assertIsString(42, { message: "   " })).toThrow(
      "Parameter input (`value`) must be of type `string`, but received: `number`."
    );
  });
});

describe("assertIsString - respect to errorType options", () => {
  it("throws the correct error type when errorType is specified", () => {
    const val = 42 as unknown;
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
      expect(() => assertIsString(val, { errorType: type })).toThrow(
        new globalThis[type](
          `Parameter input (\`value\`) must be of type \`string\`, but received: \`${getPreciseType(
            val
          )}\`.`
        )
      );
    });
  });

  it("falls back to TypeError if invalid errorType is provided", () => {
    const val = 42 as unknown;
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsString(val, { errorType: "SomeUnknownError" })
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsString(val, { errorType: "SomeUnknownError" })
    ).toThrow(
      `Parameter input (\`value\`) must be of type \`string\`, but received: \`${getPreciseType(
        val
      )}\`.`
    );
  });
});
