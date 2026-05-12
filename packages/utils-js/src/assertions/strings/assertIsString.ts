import { isString } from "@/predicates/is/isString";
import {
  resolveErrorMessageAssertions,
  type OptionsAssertIs
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsString`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **primitive-string**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `primitive-string`.
 *    - ✅ If `value` is a `primitive-string` ➔ execution continues normally.
 *    - ❌ If `value` is not a `primitive-string` ➔ throws a built-in error with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * - **ℹ️ Note:**
 *    - A "string" refers strictly to a JavaScript `primitive-string` type (e.g., `"hello"`, `""`, `"123"`).
 *    - This function excludes `String` objects created with `new String()`.
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
 *    - `errorType`: Built-in JavaScript error type to throw on failure (default `"TypeError"`).
 *    - `formatCase`: Controls how detected type names are formatted case in error messages.
 *    - `useAcronyms`: Control uppercase preservation of recognized acronyms during formatting.
 * @returns {boolean} Narrows `value` to `string` if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not a primitive string.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsString("hello");
 * // No error, value is string
 *
 * // ❌ Throws TypeError (default behavior)
 * // Case 1: Invalid input type — received a string instead of a string
 * assertIsString(42);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `string`, but received: `number`."
 *
 * // Case 3: The new String() is a String object (constructor), not a primitive string
 * assertIsString(new String("abc"));
 * // ➔ TypeError: "Parameter input (`value`) must be of type `string`, but received: `string-constructor`."
 *
 * // ❌ Throws custom error type (e.g., RangeError)
 * assertIsString(async function () {}, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `string`, but received: `async-function`."
 *
 * // ❌ Throws a TypeError with a custom string static message
 * assertIsString(123, { message: "Must be a string!" });
 * // ➔ TypeError: "Must be a string!"
 *
 * // ❌ Throws a TypeError with a custom message function and formatCase
 * assertIsString(/regex/, {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 *   formatCase: "toPascalCaseSpace"
 * });
 * // ➔ TypeError: "Expected string but got (Reg Exp)."
 *
 * // ❌ Throws a TypeError with a custom useAcronyms option
 * // Case 1:
 * assertIsString(new URL("https://example.com"),{
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected string but got (url)."
 * assertIsString(new URL("https://example.com"), {
 *   useAcronyms: true,
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected string but got (URL)."
 *
 * // Case 2:
 * assertIsString(new URLSearchParams, {
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected string but got (UrlSearchParams)."
 * assertIsString(new URLSearchParams, {
 *   useAcronyms: true,
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected string but got (URLSearchParams)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage with generic narrowing***:
 * ```ts
 * const mixedValue: string | boolean | undefined = getUserInput();
 *
 * // Runtime assertion: throws if `mixedValue` is not a `string`
 * assertIsString(mixedValue, {
 *   errorType: "RangeError",
 *   message: "Must be a string!"
 * });
 *
 * // ✅ If no error thrown, TypeScript narrows `mixedValue` to `string` here
 * const result: string = mixedValue; // ➔ Safe type assignment
 * console.log(result.toUpperCase()); // ➔ Safe to call String.prototype methods
 * ```
 */
export const assertIsString: (
  value: unknown,
  options?: OptionsAssertIs
) => asserts value is string = (
  value: unknown,
  options: OptionsAssertIs = {}
): asserts value is string => {
  if (isString(value)) return;

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "string"
  });
};
