import type { AnyString, PickStrict, Prettify } from "@rzl-zone/ts-types-plus";

import { isFunction } from "@/predicates/is/isFunction";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import {
  type GetPreciseTypeOptions,
  getPreciseType
} from "@/predicates/type/getPreciseType";
import { toKebabCase } from "@/strings/cases/toKebabCase";
import { PreciseType } from "@/predicates/type/_private/getPreciseType.utils";

type FixedRaw = (typeof PreciseType)["fixesRaw"] & {
  plainobject: "plain object";
};
type RequiredValidType =
  | Lowercase<FixedRaw[keyof FixedRaw]>
  | Capitalize<FixedRaw[keyof FixedRaw]>
  | Uppercase<FixedRaw[keyof FixedRaw]>
  | AnyString;

/** -----------------------------------------------------------------------------
 * * ***Shape of the object passed to custom error message functions.***
 * ------------------------------------------------------------------------------
 * **This type describes the parameters received when `options.message`
 * is defined as a function in {@link OptionsAssertIs | `OptionsAssertIs`}.**
 *
 * - **Parameter:**
 *      - `currentType` ➔ the actual detected runtime type of the value.
 *      - `validType`   ➔ the required/expected type name that the value must match.
 *
 * @example
 * ```ts
 * const options: OptionsAssertIs = {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got ${currentType}`;
 *   };
 * };
 * ```
 */
export type OptionsMessageFunctionAssertIs = {
  /** ---------------------------------------------------------------------------
   * * ***The actual runtime type of the value being checked.***
   * ----------------------------------------------------------------------------
   * - ***Example:***
   *      - `"number"`, `"big-int"`, `"plain-object"`, (depends-on `formatCase` options).
   */
  currentType: string;

  /** ---------------------------------------------------------------------------
   * * ***The required/expected type that the value must conform to.***
   * ----------------------------------------------------------------------------
   * - ***Example:***
   *      - `"boolean"`, `"string"`, `"big-int"`, `"plain-object"`, (will force format to `kebab-case`).
   */
  validType: string;
};

/** -------------------------------------------------------
 * * ***Custom error-message type for assertions option {@link OptionsAssertIs | `OptionsAssertIs`}.***
 * -------------------------------------------------------
 * - ***Accepts:***
 *      - A static string message.
 *      - A function receiving `{ currentType, validType }` and returning a string.
 */
type OptionsMessageAssertIs =
  | (({ currentType, validType }: OptionsMessageFunctionAssertIs) => string)
  | string;

/** ---------------------------------------------------------------------------
 * * ***Base options for `assertIs*` functions.***
 * ----------------------------------------------------------------------------
 */
export type OptionsAssertIs = Prettify<
  {
    /** -----------------------------------------------------------------------
     * * ***Custom error message for assertion failures.***
     * ------------------------------------------------------------------------
     * **This option allows overriding the **default error message** when a value
     * does not match the required type.**
     *
     * - If a **string** is provided:
     *      - Must be non-empty after trimming.
     *      - Will be used directly as the error message.
     * - If a **function** is provided:
     *      - Receives an object containing:
     *          - `currentType` ➔ the detected runtime type of the value (depends-on `formatCase` options, e.g., `"number"`).
     *          - `validType`  ➔ the expected type name (with format `kebab-case`, e.g., `"boolean"`, `"big-int"`, `"plain-object"`).
     *      - **Must** return a **string**:
     *          - **If** the **returned string is** `empty` or `whitespace`,
     *            the **default message** will be used instead.
     *
     * @example
     * ```ts
     * // Static message
     * { message: "Must be a boolean!" }
     *
     * // Dynamic message
     * {
     *   message: ({ currentType, validType }) => {
     *     return `Expected ${validType} but got ${currentType}`;
     *   };
     * }
     * ```
     */
    message?: OptionsMessageAssertIs;

    /** -----------------------------------------------------------------------
     * * ***Custom error type for assertion failures.***
     * ------------------------------------------------------------------------
     * **This option allows overriding the default error type** that will be thrown
     * when a value does not match the required type.
     *
     * - **Behavior:**
     *     - Must be one of the standard JavaScript built-in error types:
     *       `"Error" | "EvalError" | "RangeError" | "ReferenceError" | "SyntaxError" | "TypeError" | "URIError"`.
     *     - **Default:** `"TypeError"` if not provided or if an invalid value is passed.
     *     - The assertion function will **always throw a valid built-in error**, ensuring
     *       fallback to `TypeError` in case of an unknown or incorrect type.
     *
     * @example
     * ```ts
     * // Valid: Throw a RangeError instead of TypeError
     * { errorType: "RangeError" }
     *
     * // Valid: Throw a ReferenceError
     * { errorType: "ReferenceError" }
     *
     * // Invalid value ➔ fallback to TypeError
     * { errorType: "SomeUnknownError" as ErrorType }
     * ```
     */
    errorType?: ErrorType;
  } & PickStrict<GetPreciseTypeOptions, "formatCase" | "useAcronyms">,
  { recursive: false }
>;

type ErrorType =
  | "Error"
  | "EvalError"
  | "RangeError"
  | "ReferenceError"
  | "SyntaxError"
  | "TypeError"
  | "URIError";

/** -------------------------------------------------------
 * * ***Throws a JavaScript built-in error based on type.***
 * -------------------------------------------------------
 * **This function asserts and throws a specific built-in error (`ErrorType`) with an optional message.**
 *
 * - **Behavior:**
 *      1. Throws the error corresponding to the `type` argument:
 *          - `"Error"` ➔ `Error`.
 *          - `"EvalError"` ➔ `EvalError`.
 *          - `"RangeError"` ➔ `RangeError`.
 *          - `"ReferenceError"` ➔ `ReferenceError`.
 *          - `"SyntaxError"` ➔ `SyntaxError`.
 *          - `"TypeError"` ➔ `TypeError`.
 *          - `"URIError"` ➔ `URIError`.
 *      2. **Default fallback**: If `type` does not match any case, a `TypeError` is thrown.
 * @param {ErrorType} type - The type of error to throw.
 * @param {string} [message] - Optional error message to include in the thrown error.
 * @returns {never} This function never returns; it always throws.
 * @example
 * ```ts
 * // Throw a RangeError with a custom message
 * determineErrorTypeAssertion("RangeError", "Value out of range!");
 *
 * // Throw a TypeError with default message
 * determineErrorTypeAssertion("TypeError");
 *
 * // Fallback to TypeError for unknown type (should not occur with proper ErrorType)
 * determineErrorTypeAssertion("UnknownType" as ErrorType, "Fallback to TypeError");
 * ```
 * @internal
 */
const determineErrorTypeAssertion = (
  type?: ErrorType,
  message?: string
): never => {
  switch (type) {
    case "Error":
      throw new Error(message);
    case "EvalError":
      throw new EvalError(message);
    case "RangeError":
      throw new RangeError(message);
    case "ReferenceError":
      throw new ReferenceError(message);
    case "SyntaxError":
      throw new SyntaxError(message);
    case "URIError":
      throw new URIError(message);
    case "TypeError":
      throw new TypeError(message);
    default:
      throw new TypeError(message); // default fallback TypeError
  }
};

type ParamsResolveErrorMessageAssertions<T> = {
  value: T;
  options?: OptionsAssertIs;
  requiredValidType: RequiredValidType;
};

/** ------------------------------------------------------------------------------
 * * ***Resolve a custom error message for type assertions.***
 * -------------------------------------------------------------------------------
 * **Produces the **final error message** used by assertion functions (`assertIs*`).**
 *
 * - **Message resolution follows this order:**
 *      1. **Function message** ➔ If `options.message` is a function, it is invoked with:
 *            - `currentType`: the detected runtime type of `value`.
 *            - `validType`: the required/expected type name.
 *            - If the function returns a non-empty string, it is used, otherwise, the default message is used.
 *      2. **String message** ➔ If `options.message` is a non-empty string, it is used directly.
 *      3. **Fallback** ➔ If no valid message is provided, a default message is generated:
 *          ```ts
 *          "Parameter input (`value`) must be of type `<validType>`, but received: `<currentType>`."
 *          ```
 * @template T - The type of the value being checked.
 * @param {ParamsResolveErrorMessageAssertions<T>} params - Parameters object.
 * @param {ParamsResolveErrorMessageAssertions<T>["value"]} params.value - The value being asserted.
 * @param {ParamsResolveErrorMessageAssertions<T>["options"]} [params.options] - Optional configuration for message and type formatting.
 * @param {ParamsResolveErrorMessageAssertions<T>["requiredValidType"]} [params.requiredValidType] - The required type name that the value should have.
 * @returns A non-empty, trimmed error message string.
 * @example
 * ```ts
 * // 1. Using a static string message
 * const msg = resolveErrorMessageAssertions({
 *   value: 42,
 *   options: { message: "Must be a boolean!" },
 *   requiredValidType: "boolean"
 * });
 * // ➔ "Must be a boolean!"
 *
 * // 2. Using a function to dynamically generate the message
 * const msgFn = resolveErrorMessageAssertions({
 *   value: 42,
 *   options: {
 *     message: ({ currentType, validType }) =>
 *       `Expected ${validType} but got ${currentType}.`
 *   },
 *   requiredValidType: "boolean"
 * });
 * // ➔ "Expected boolean but got number."
 *
 * // 3. Without providing a custom message ➔ uses default
 * const defaultMsg = resolveErrorMessageAssertions({
 *   value: 42,
 *   requiredValidType: "boolean"
 * });
 * // ➔ "Parameter input (`value`) must be of type `boolean`, but received: `number`."
 * ```
 *
 * @internal
 */
export function resolveErrorMessageAssertions<T>(
  params: ParamsResolveErrorMessageAssertions<T>
): never {
  const { requiredValidType, value, options } = params || {};

  const {
    message,
    formatCase,
    useAcronyms,
    errorType = "TypeError"
  } = isPlainObject(options) ? options : {};

  const validType = toKebabCase(requiredValidType);
  const currentType = getPreciseType(value, { formatCase, useAcronyms });
  const messageFnOptions = { currentType, validType };

  const defaultMessage = `Parameter input (\`value\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`;

  const errorMessage = isFunction(message)
    ? isNonEmptyString(message(messageFnOptions))
      ? message(messageFnOptions).trim()
      : defaultMessage
    : isNonEmptyString(message)
      ? message.trim()
      : defaultMessage;

  return determineErrorTypeAssertion(errorType, errorMessage);
}
