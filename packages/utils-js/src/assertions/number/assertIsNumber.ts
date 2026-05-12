import { isNumber, type IsNumberOptions } from "@/predicates/is/isNumber";

import {
  resolveErrorMessageAssertions,
  type OptionsAssertIs
} from "../_private/assertIs";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";

type OptionsAssertIsNumber = OptionsAssertIs & IsNumberOptions;

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsNumber`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **number**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `number`.
 *    - ✅ If `value` is a `number` ➔ execution continues normally.
 *    - ❌ If `value` is not a `number` ➔ throws a built-in error with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * - **ℹ️ Note:**
 *    - A `number` refers strictly to the JavaScript `number` primitive type (e.g., `42`, `3.14`, `-1`, `0`).
 *    - This excludes `Number` objects created with `new Number(123)`.
 *    - By default, `NaN` is **not considered** valid, you can allow it with `{ includeNaN: true }`.
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
 * @param {OptionsAssertIsNumber} [options]
 *  ***Optional configuration:***
 *    - `message`: A custom error message (`string` or `function`).
 *    - `errorType`: Built-in JavaScript error type to throw on failure (default `"TypeError"`).
 *    - `formatCase`: Controls how detected type names are formatted case in error messages.
 *    - `useAcronyms`: Control uppercase preservation of recognized acronyms during formatting.
 *    - `includeNaN`: Whether to treat `NaN` as valid.
 * @returns {boolean} Narrows `value` to `number` if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not a number (or is `NaN` when `includeNaN` is `false`).
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsNumber(123);
 * assertIsNumber(NaN, { includeNaN: true });
 * // No error, value is number
 *
 * // ❌ Throws TypeError (default behavior)
 * // Case 1: Invalid input type — received a string instead of a number
 * assertIsNumber("42");
 * // ➔ TypeError: "Parameter input (`value`) must be of type `number`, but received: `string`."
 *
 * // Case 2: Default option includeNaN is false
 * assertIsNumber(NaN);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `number`, but received: `NaN`."
 *
 * // Case 3: The new Number() is a Number object (constructor), not a primitive number
 * assertIsNumber(new Number("123"));
 * // ➔ TypeError: "Parameter input (`value`) must be of type `number`, but received: `number-constructor`."
 *
 * // ❌ Throws custom error type (e.g., RangeError)
 * assertIsNumber(async function () {}, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `number`, but received: `async-function`."
 *
 * // ❌ Throws a TypeError with a custom string static message
 * assertIsNumber("123", { message: "Must be a number!" });
 * // ➔ TypeError: "Must be a number!"
 *
 * // ❌ Throws a TypeError with a custom message function and formatCase
 * assertIsNumber(/regex/, {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 *   formatCase: "toPascalCaseSpace"
 * });
 * // ➔ TypeError: "Expected number but got (Reg Exp)."
 *
 * // ❌ Throws a TypeError with a custom useAcronyms option
 * // Case 1:
 * assertIsNumber(new URL("https://example.com"),{
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected number but got (url)."
 * assertIsNumber(new URL("https://example.com"), {
 *   useAcronyms: true,
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected number but got (URL)."
 *
 * // Case 2:
 * assertIsNumber(new URLSearchParams, {
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected number but got (UrlSearchParams)."
 * assertIsNumber(new URLSearchParams, {
 *   useAcronyms: true,
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected number but got (URLSearchParams)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage example***:
 * ```ts
 * const mixedValue: string | number | undefined = getUserInput();
 *
 * // Runtime assertion: throws if `mixedValue` is not a `number`
 * assertIsNumber(mixedValue, {
 *   errorType: "RangeError",
 *   message: "Must be number!"
 * });
 *
 * // ✅ If no error thrown, TypeScript narrows `mixedValue` to `number` here
 * const result: number = mixedValue; // ➔ Safe type assignment
 * console.log(result + 100);         // ➔ Safe to operation
 * ```
 */
export const assertIsNumber: (
  value: unknown,
  options?: OptionsAssertIsNumber
) => asserts value is number = (
  value: unknown,
  options: OptionsAssertIsNumber = {}
): asserts value is number => {
  const includeNaN = hasOwnProp(options, "includeNaN")
    ? options.includeNaN
    : undefined;

  if (isNumber(value, { includeNaN })) return;

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "number"
  });
};
