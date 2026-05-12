import { isBoolean } from "@/predicates/is/isBoolean";
import {
  type OptionsAssertIs,
  resolveErrorMessageAssertions
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsBoolean`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **boolean**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `boolean`.
 *    - ✅ If `value` is a `boolean` ➔ execution continues normally.
 *    - ❌ If `value` is not a `boolean` ➔ throws a built-in error with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * - **⚠️ Error type selection (`options.errorType`):**
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
 *    - `errorType`: A custom built-in JavaScript error type to throw.
 *    - `formatCase`: Controls how detected type names are formatted case in error messages.
 *    - `useAcronyms`: Control uppercase preservation of recognized acronyms during formatting.
 * @returns {boolean} Narrows `value` to `boolean` if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not a boolean.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsBoolean(true);
 * // No error, value is boolean
 *
 * // ❌ Throws TypeError (default behavior)
 * // Case 1: Invalid input type — received a string instead of a boolean
 * assertIsBoolean("hello");
 * // ➔ TypeError: "Parameter input (`value`) must be of type `boolean`, but received: `number`."
 *
 * // Case 2: The new Boolean() is a Boolean object (constructor), not a primitive boolean
 * assertIsBoolean(new Boolean(true));
 * // ➔ TypeError: "Parameter input (`value`) must be of type `boolean`, but received: `boolean-constructor`."
 *
 * // ❌ Throws a TypeError with a custom string static message
 * assertIsBoolean(42, { message: "Must be boolean!" });
 * // ➔ TypeError: "Must be boolean!"
 *
 * // ❌ Throws RangeError (custom error type)
 * assertIsBoolean(42, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `boolean`, but received: `number`."
 *
 * // ❌ Throws a TypeError with a custom message function and formatCase
 * assertIsBoolean(/regex/, {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 *   formatCase: "toPascalCaseSpace"
 * });
 * // ➔ TypeError: "Expected boolean but got (Reg Exp)."
 *
 * // ❌ Throws a TypeError with a custom useAcronyms option
 * // Case 1:
 * assertIsBoolean(new URL("https://example.com"),{
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected boolean but got (url)."
 * assertIsBoolean(new URL("https://example.com"), {
 *   useAcronyms: true,
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected boolean but got (URL)."
 *
 * // Case 2:
 * assertIsBoolean(new URLSearchParams, {
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected boolean but got (UrlSearchParams)."
 * assertIsBoolean(new URLSearchParams, {
 *   useAcronyms: true,
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected boolean but got (URLSearchParams)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage example***:
 * ```ts
 * const mixedValue: string | boolean | number | undefined = getUserInput();
 *
 * // Runtime assertion: throws if `mixedValue` is not a `boolean`
 * assertIsBoolean(mixedValue, {
 *   errorType: "RangeError",
 *   message: "Must be boolean!"
 * });
 *
 * // ✅ If no error thrown, TypeScript narrows `mixedValue` to `boolean` here
 * const result: boolean = mixedValue; // ➔ Safe type assignment
 * ```
 */
export const assertIsBoolean: (
  value: unknown,
  options?: OptionsAssertIs
) => asserts value is boolean = (
  value: unknown,
  options: OptionsAssertIs = {}
): asserts value is boolean => {
  if (isBoolean(value)) return;

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "boolean"
  });
};
