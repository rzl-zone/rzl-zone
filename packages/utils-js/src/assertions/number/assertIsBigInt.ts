import { isBigInt } from "@/predicates/is/isBigInt";

import {
  resolveErrorMessageAssertions,
  type OptionsAssertIs
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsBigInt`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **bigint**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `bigint`.
 *    - ✅ If `value` is a `bigint` ➔ execution continues normally.
 *    - ❌ If `value` is not a `bigint` ➔ throws a built-in error with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 *  - **ℹ️ Note:**
 *    - A `bigint` refers strictly to the JavaScript `bigint` primitive type (e.g., `123n`, `0n`, `-999999999999999999999n`).
 *    - This excludes `BigInt` objects created with `Object(BigInt(123))`.
 *  - **⚠️ Error type selection (`options.errorType`):**
 *    - You can override the type of error thrown when validation fails.
 *    - Must be one of the standard JavaScript built-in errors:
 *      - [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) |
 *        [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) |
 *        [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) |
 *        [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) |
 *        [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) |
 *        [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) |
 *        [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)
 *    - **Default:** `"TypeError"` if not provided or invalid.
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIs} [options]
 *  ***Optional configuration:***
 *    - `message`: A custom error message (`string` or `function`).
 *    - `errorType`: Built-in JavaScript error type to throw on failure (default `"TypeError"`).
 *    - `formatCase`: Controls how detected type names are formatted case in error messages.
 *    - `useAcronyms`: Control uppercase preservation of recognized acronyms during formatting.
 * @returns {boolean} Narrows `value` to `bigint` if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not a bigint.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsBigInt(123n);
 * // No error, value is bigint
 *
 * // ❌ Throws TypeError (default behavior)
 * assertIsBigInt(42);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `bigint`, but received: `number`."
 *
 * // ❌ Throws a TypeError with a custom string static message
 * assertIsBigInt("123", { message: "Must be a bigint!" });
 * // ➔ TypeError: "Must be a bigint!"
 *
 * // ❌ Throws custom error type (e.g., RangeError)
 * assertIsBigInt(async function () {}, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `bigint`, but received: `async-function`."
 *
 * // ❌ Throws a TypeError with a custom message function and formatCase
 * assertIsBigInt(/regex/, {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 *   formatCase: "toPascalCaseSpace"
 * });
 * // ➔ TypeError: "Expected bigint but got (Reg Exp)."
 *
 * // ❌ Throws a TypeError with a custom useAcronyms option
 * // Case 1:
 * assertIsBigInt(new URL("https://example.com"),{
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected bigint but got (url)."
 * assertIsBigInt(new URL("https://example.com"), {
 *   useAcronyms: true,
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected bigint but got (URL)."
 *
 * // Case 2:
 * assertIsBigInt(new URLSearchParams, {
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected bigint but got (UrlSearchParams)."
 * assertIsBigInt(new URLSearchParams, {
 *   useAcronyms: true,
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected bigint but got (URLSearchParams)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage example***:
 * ```ts
 * const mixedValue: string | bigint | undefined = getUserInput();
 *
 * // Runtime assertion: throws if `mixedValue` is not a `bigint`
 * assertIsBigInt(mixedValue, {
 *   errorType: "RangeError",
 *   message: "Must be bigint!"
 * });
 *
 * // ✅ If no error thrown, TypeScript narrows `mixedValue` to `bigint` here
 * const result: bigint = mixedValue; // ➔ Safe type assignment
 * console.log(result + 100n);        // ➔ Safe to operation
 * ```
 */
export const assertIsBigInt: (
  value: unknown,
  options?: OptionsAssertIs
) => asserts value is bigint = (
  value: unknown,
  options: OptionsAssertIs = {}
): asserts value is bigint => {
  if (isBigInt(value)) return;

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "bigint"
  });
};
