import { describe, it, expect } from "vitest";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";

import type { OptionsMessageFunctionAssertIs } from "@/assertions/_private/assertIs";

describe("assertIsBoolean", () => {
  const validValues = [true, false];
  const invalidValues = [
    42,
    "hello",
    null,
    undefined,
    [],
    {},
    Symbol(),
    BigInt(10)
  ];

  it("passes for valid boolean values", () => {
    validValues.forEach((val) => {
      expect(() => assertIsBoolean(val)).not.toThrow();
    });
  });

  it("throws TypeError for invalid values with default message", () => {
    invalidValues.forEach((val) => {
      expect(() => assertIsBoolean(val)).toThrow(TypeError);
      const expectedMsg = `Parameter input (\`value\`) must be of type \`boolean\`, but received: \`${getPreciseType(
        val
      )}\`.`;
      expect(() => assertIsBoolean(val)).toThrow(expectedMsg);
    });
  });

  it("throws TypeError with string custom message", () => {
    invalidValues.forEach((val) => {
      const msg = "Must be boolean!";
      expect(() => assertIsBoolean(val, { message: msg })).toThrow(msg);
    });
  });

  it("throws TypeError with function custom message", () => {
    invalidValues.forEach((val) => {
      const fnMsg = ({
        currentType,
        validType
      }: OptionsMessageFunctionAssertIs) =>
        `Expected ${validType} but got ${currentType}`;
      const expected = `Expected boolean but got ${getPreciseType(val)}`;
      expect(() => assertIsBoolean(val, { message: fnMsg })).toThrow(expected);
    });
  });

  it("applies formatCase to actualType when using function message", () => {
    const val = 42;
    const fnMsg = ({
      currentType,
      validType
    }: OptionsMessageFunctionAssertIs) =>
      `Expected ${validType} but got ${currentType}`;
    expect(() =>
      assertIsBoolean(val, { message: fnMsg, formatCase: "toKebabCase" })
    ).toThrow(
      `Expected boolean but got ${getPreciseType(val, { formatCase: "toKebabCase" })}`
    );

    expect(() =>
      assertIsBoolean(val, { message: fnMsg, formatCase: "toPascalCase" })
    ).toThrow(
      `Expected boolean but got ${getPreciseType(val, { formatCase: "toPascalCase" })}`
    );
  });

  it("trims messages when provided as non-empty strings or function results", () => {
    const val = 42;
    const fnMsg = ({
      currentType,
      validType
    }: OptionsMessageFunctionAssertIs) =>
      `  Expected ${validType} but got ${currentType}   `;
    expect(() => assertIsBoolean(val, { message: fnMsg })).toThrow(
      `Expected boolean but got ${getPreciseType(val)}`
    );
  });
});

describe("assertIsBoolean - respect to errorType options", () => {
  it("throws the correct error type when errorType is specified", () => {
    const val = 42;
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
      expect(() => assertIsBoolean(val, { errorType: type })).toThrow(
        new globalThis[type](
          `Parameter input (\`value\`) must be of type \`boolean\`, but received: \`${getPreciseType(
            val
          )}\`.`
        )
      );
    });
  });

  it("falls back to TypeError if invalid errorType is provided", () => {
    const val = 42;
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsBoolean(val, { errorType: "SomeUnknownError" })
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error: testing invalid errorType
      assertIsBoolean(val, { errorType: "SomeUnknownError" })
    ).toThrow(
      `Parameter input (\`value\`) must be of type \`boolean\`, but received: \`${getPreciseType(
        val
      )}\`.`
    );
  });
});
