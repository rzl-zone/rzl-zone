import {
  isPlainObject,
  type IsPlainObjectResult
} from "@/predicates/is/isPlainObject";
import {
  type OptionsAssertIs,
  resolveErrorMessageAssertions
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsPlainObject`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **plain-object**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `plain-object` **(generic support)**.
 *    - ✅ If `value` is a `plain-object` ➔ execution continues normally.
 *    - ❌ If `value` is not a `plain-object` ➔ throws a built-in error with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * - **A valid `plain object` is:**
 *    - Created by the `Object` constructor, or
 *    - Has a `[[Prototype]]` of `null` (e.g. `Object.create(null)`).
 *     - **✅ Returns `undefined` (valid) for:**
 *         - Empty object literals: `{}`
 *         - Objects with null prototype: `Object.create(null)`
 *     - **❌ Returns `throws` for:**
 *         - Arrays (`[]`, `new Array()`)
 *         - Functions (regular, arrow, or class constructors)
 *         - Built-in objects: `Date`, `RegExp`, `Error`, `Map`, `Set`, `WeakMap`, `WeakSet`
 *         - Boxed primitives: `new String()`, `new Number()`, `new Boolean()`
 *         - `null` or `undefined`
 *         - Symbols
 *         - Class instances
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
 * @template T - The input type being asserted.
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIs} [options]
 *  ***Optional configuration:***
 *    - `message`: A custom error message (`string` or `function`).
 *    - `errorType`: Built-in JavaScript error type to throw on failure (default `"TypeError"`).
 *    - `formatCase`: Controls how detected type names are formatted case in error messages.
 *    - `useAcronyms`: Control uppercase preservation of recognized acronyms during formatting.
 * @returns {boolean} Narrows `value` to a `plain-object` **(generic support)** if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if `value` is not a plain-object.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsPlainObject({ a: 1, b: 2 });
 * // No error, value is plain-object
 *
 * // ❌ Throws TypeError (default behavior)
 * // Case 1: Invalid input type — received a string instead of a plain-object
 * assertIsPlainObject("42");
 * // ➔ TypeError: "Parameter input (`value`) must be of type `plain-object`, but received: `string`."
 *
 * // ❌ Throws custom error type (e.g., RangeError)
 * assertIsPlainObject(async function () {}, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `plain-object`, but received: `async-function`."
 *
 * // ❌ Throws a TypeError with a custom string static message
 * assertIsPlainObject("123", { message: "Must be a plain-object!" });
 * // ➔ TypeError: "Must be a plain-object!"
 *
 * // ❌ Throws a TypeError with a custom message function and formatCase
 * assertIsPlainObject(/regex/, {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 *   formatCase: "toPascalCaseSpace"
 * });
 * // ➔ TypeError: "Expected plain-object but got (Reg Exp)."
 *
 * // ❌ Throws a TypeError with a custom useAcronyms option
 * // Case 1:
 * assertIsPlainObject(new URL("https://example.com"),{
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected plain-object but got (url)."
 * assertIsPlainObject(new URL("https://example.com"), {
 *   useAcronyms: true,
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected plain-object but got (URL)."
 *
 * // Case 2:
 * assertIsPlainObject(new URLSearchParams, {
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected plain-object but got (UrlSearchParams)."
 * assertIsPlainObject(new URLSearchParams, {
 *   useAcronyms: true,
 *   formatCase: "toPascalCase",
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`
 *   },
 * });
 * // ➔ TypeError: "Expected plain-object but got (URLSearchParams)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage with generic narrowing***:
 * ```ts
 * type User = { name: string; email: string };
 * const mixedValue: string | User | boolean | number | undefined = getUserInput();
 *
 * // Runtime assertion: throws if `mixedValue` is not a `plain-object`
 * assertIsPlainObject(mixedValue, {
 *   errorType: "RangeError",
 *   message: "Must be plain object!"
 * });
 *
 * // ✅ If no error thrown, TypeScript narrows `mixedValue` to `User` here
 * const user: User = mixedValue; // ➔ Safe type assignment
 * console.log(user.email);       // ➔ Safe to access object properties
 * ```
 */
export function assertIsPlainObject<T>(
  value: T,
  options: OptionsAssertIs = {}
): asserts value is IsPlainObjectResult<T> {
  if (isPlainObject(value)) return;

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "plain object"
  });
}
