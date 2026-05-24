import type {
  IsArray,
  IsReadonlyArray,
  IsUnknown
} from "@rzl-zone/ts-types-plus";
import type { ArrayFallback } from "@/_private/types.arrays";

import { isArray } from "@/predicates/is/isArray";

import {
  resolveErrorMessageAssertions,
  type OptionsAssertIs
} from "../_private/assertIs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AssertIsArrayResult<T> =
  IsUnknown<T> extends true
    ? unknown[] & T
    : IsReadonlyArray<T> extends true
      ? T
      : T extends []
        ? T
        : IsArray<T> extends true
          ? T
          : Extract<T, unknown[] | [] | readonly []>;

/** --------------------------------------------------------------------------------
 * * ***Type guard assertion: `assertIsArray`.***
 * ---------------------------------------------------------------------------------
 * **This function is an **assertion function**.**
 *
 * - **Behavior:**
 *     - Validates that the given `value` is an **array**.
 *     - After it returns successfully, TypeScript narrows the type of `value` to `array` **(generic support)**.
 *     - If `value` is an `array` ➔ execution continues normally.
 *     - If `value` is not an `array` ➔ throws a built-in error with either:
 *       - A custom error message (`options.message`), or
 *       - A default message including the actual type.
 * - **Error type selection (`options.errorType`):**
 *     - You can override the type of error thrown when validation fails.
 *     - Must be one of the standard JavaScript built-in errors:
 *       - [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) |
 *         [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) |
 *         [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) |
 *         [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) |
 *         [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) |
 *         [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) |
 *         [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
 *     - **Default:** `"TypeError"` if not provided or invalid.
 *
 * @template T - The input type being asserted.
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIs} [options]
 *  ***Optional configuration:***
 *     - `message`: A custom error message (`string` or `function`).
 *     - `errorType`: Built-in JavaScript error type to throw on failure (default `"TypeError"`).
 *     - `formatCase`: Controls how detected type names are formatted case in error messages.
 *     - `useAcronyms`: Control uppercase preservation of recognized acronyms during formatting.
 *
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not an array.
 * @returns {boolean} Narrows `value` to an `array` **(generic support)** if no error is thrown.
 *
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsArray([]);
 * assertIsArray(["123", 456]);
 * assertIsArray(Array.from(["abc"]));
 * // No error, value is array
 *
 * // ❌ Throws TypeError (default behavior)
 * // Case 1: Invalid input type — received a string instead of a array
 * assertIsArray("42");
 * // ➔ TypeError: "Parameter input (`value`) must be of type `array`, but received: `string`."
 *
 * // ❌ Throws custom error type (e.g., RangeError)
 * assertIsArray(async function () {}, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `array`, but received: `async-function`."
 *
 * // ❌ Throws a TypeError with a custom string static message
 * assertIsArray("123", { message: "Must be a array!" });
 * // ➔ TypeError: "Must be a array!"
 *
 * // ❌ Throws a TypeError with a custom message function and formatCase
 * assertIsArray(/regex/, {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 *   formatCase: "toPascalCaseSpace"
 * });
 * // ➔ TypeError: "Expected array but got (Reg Exp)."
 *
 * // ❌ Throws a TypeError with a custom useAcronyms option
 * // Case 1:
 * assertIsArray(new URL("https://example.com"),{
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected array but got (url)."
 * assertIsArray(new URL("https://example.com"), {
 *   useAcronyms: true,
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected array but got (URL)."
 *
 * // Case 2:
 * assertIsArray(new URLSearchParams, {
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected array but got (UrlSearchParams)."
 * assertIsArray(new URLSearchParams, {
 *   useAcronyms: true,
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected array but got (URLSearchParams)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage example***:
 * ```ts
 * const mixedValue: string | number[] | undefined = getUserInput();
 *
 * // Runtime assertion: throws if `mixedValue` is not a `number[]`
 * assertIsArray(mixedValue, {
 *   errorType: "RangeError",
 *   message: "Must be array!"
 * });
 *
 * // ✅ If no error thrown, TypeScript narrows `mixedValue` to `number[]` here
 * const result: number[] = mixedValue; // ➔ Safe type assignment
 * console.log(result.push(1, 2, 3));   // ➔ Safe to use array methods
 * ```
 */
export function assertIsArray(
  value: [],
  options?: OptionsAssertIs
): asserts value is [];
export function assertIsArray<T>(
  value: T,
  options?: OptionsAssertIs
): asserts value is ArrayFallback<T>;
export function assertIsArray(
  value: unknown,
  options?: OptionsAssertIs
): asserts value is unknown[];
export function assertIsArray<T>(value: T, options?: OptionsAssertIs) {
  if (isArray(value)) return;

  resolveErrorMessageAssertions({ value, options, requiredValidType: "array" });
}
