import { isNonEmptyString } from "./isNonEmptyString";

type IsEmptyStringOptions = {
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
 * * ***Predicate: `isEmptyString`.***
 * -----------------------------------------------------------
 * **Checks whether a given value is an **empty-string**.**
 *
 * ---
 * - **Behavior:**
 *     - Considers `""` and whitespace-only strings as
 *       empty (if `trim` is enabled, which is the default).
 *     - Non-string inputs are also considered empty.
 *
 * ---
 * @param {*} value - The value to check.
 * @param {IsEmptyStringOptions} [options]
 *        Optional settings (non-plain object values are ignored and replaced with default options).
 * @param {IsEmptyStringOptions["trim"]} [options.trim=true]
 *        If `true`, trims the string before checking (non-boolean values fall back to the default behavior), defaults: `true`.
 *
 * ---
 * @returns {boolean} Returns `true` if the value is string not a string or value string is considered empty.
 *
 * ---
 * @example
 * isEmptyString("");
 * // ➔ true
 * isEmptyString("   ");
 * // ➔ true (default trims)
 * isEmptyString("   ", { trim: false });
 * // ➔ false
 * isEmptyString("hello");
 * // ➔ false
 * isEmptyString(undefined);
 * // ➔ true
 * isEmptyString(null);
 * // ➔ true
 * isEmptyString(123 as any);
 * // ➔ true
 *
 * // Used in validation
 * if (isEmptyString(form.name)) {
 *   throw new Error("Name cannot be empty.");
 * }
 */
export const isEmptyString = (
  value: unknown,
  options?: IsEmptyStringOptions
): boolean => {
  return !isNonEmptyString(value, options);
};
