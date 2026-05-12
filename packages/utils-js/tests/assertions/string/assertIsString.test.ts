import { describe, it, expect } from "vitest";
import { assertIsString } from "@/assertions/strings/assertIsString";
import { getPreciseType } from "@/predicates/type/getPreciseType";

// describe("assertIsString vs typeof === 'string' - benchmark", () => {
//   it("compares performance", { timeout: 30000 }, () => {
//     const loop = 1000;
//     const validInput = "hello world";
//     const invalidInput = "12345";

//     console.log(`\n🚀 Running with ${loop.toLocaleString()} iterations...\n`);

//     // typeof === "string"
//     let t1 = performance.now();
//     for (let i = 0; i < loop; i++) {
//       if (typeof validInput !== "string") throw new Error("Expected string");
//     }
//     let t2 = performance.now();

//     console.log(
//       `🧪 typeof valid took ${(t2 - t1).toFixed(2)} ms ` +
//         `(~${(((t2 - t1) * 1_000) / loop).toFixed(3)} μs/op)`
//     );

//     // assertIsString
//     let t3 = performance.now();
//     for (let i = 0; i < loop; i++) {
//       assertIsString(validInput);
//     }
//     let t4 = performance.now();

//     console.log(
//       `✅ assertIsString valid took ${(t4 - t3).toFixed(2)} ms ` +
//         `(~${(((t4 - t3) * 1_000) / loop).toFixed(3)} μs/op)`
//     );

//     // typeof fail
//     let caughtTypeof = 0;
//     let t5 = performance.now();
//     for (let i = 0; i < loop; i++) {
//       if (typeof invalidInput !== "string") caughtTypeof++;
//     }
//     let t6 = performance.now();

//     console.log(
//       `🛑 typeof invalid took ${(t6 - t5).toFixed(2)} ms ` +
//         `(~${(((t6 - t5) * 1_000) / loop).toFixed(3)} μs/op)`
//     );

//     // assertIsString fail
//     let caughtAssert = 0;
//     let t7 = performance.now();
//     for (let i = 0; i < loop; i++) {
//       try {
//         assertIsString(invalidInput, { formatCase: "toKebabCase" });
//       } catch {
//         caughtAssert++;
//       }
//     }
//     let t8 = performance.now();

//     console.log(
//       `❌ assertIsString invalid took ${(t8 - t7).toFixed(2)} ms ` +
//         `(~${(((t8 - t7) * 1_000) / loop).toFixed(3)} μs/op)`
//     );

//     console.log(`⚠️  caught typeof: ${caughtTypeof}, caught assert: ${caughtAssert}\n`);
//   });
// });

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
      expect(() => assertIsString(val, { errorType: type })).toThrowError(
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
    ).toThrowError(TypeError);
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
