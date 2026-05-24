import { isString } from "./isString";
import { isBoolean } from "./isBoolean";
import { isPlainObject } from "./isPlainObject";

type IsNonEmptyStringOptions = {
  /** ----------------------------------------------------------
   * * ***Whether to trim leading and trailing whitespace before checking.***
   * -----------------------------------------------------------
   *
   * @note
   * Non-boolean values fall back to the default behavior.
   *
   * ---
   * @default true
   */
  trim?: boolean;
};

/** ----------------------------------------------------------
 * * ***Type guard: `isNonEmptyString`.***
 * -----------------------------------------------------------
 * **Checks if a value is a **non-empty string**.**
 *
 * ---
 * @description
 * Determines whether the given `value` is a string containing at least one non-whitespace character, with optional trimming behavior.
 *
 * ---
 * - **Behavior:**
 *     - Ensures the value is a string using ***`isString` utility function***.
 *     - Optionally trims whitespace before checking (`trim` defaults to `true`).
 *     - Narrows type to `string` when true.
 *
 * ---
 * @param {*} value - The value to test.
 * @param {IsNonEmptyStringOptions} [options]
 *        Optional settings (non-plain object values are ignored and replaced with default options).
 * @param {boolean} options.trim
 *        If `true`, trims the string before checking (non-boolean values fall back to the default behavior), defaults: `true`.
 *
 * ---
 * @returns {boolean} Return `true` if `value` is a non-empty string, otherwise `false`.
 *
 * ---
 * @example
 * isNonEmptyString("hello");
 * // ➔ true
 * isNonEmptyString("   ", { trim: true });
 * // ➔ false
 * isNonEmptyString("   ", { trim: false });
 * // ➔ true
 * isNonEmptyString("");
 * // ➔ false
 * isNonEmptyString(123);
 * // ➔ false
 * isNonEmptyString(undefined);
 * // ➔ false
 * isNonEmptyString(null);
 * // ➔ false
 * isNonEmptyString({});
 * // ➔ false
 * isNonEmptyString([]);
 * // ➔ false
 */
export const isNonEmptyString = (
  value: unknown,
  options?: IsNonEmptyStringOptions
): value is string => {
  if (!isString(value)) return false;
  if (!isPlainObject(options)) options = {};

  const trim = isBoolean(options.trim) ? options.trim : true;

  const str = trim ? value.trim() : value;

  return str.length > 0;
};
