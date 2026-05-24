/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { isObject } from "./isObject";

/** ----------------------------------------------------
 * * ***Type guard: `isBooleanObject`.***
 * -----------------------------------------------------
 * **Checks if a value is a **`Boolean` object wrapper**
 * (`new Boolean(...)`), not a primitive boolean.**
 *
 * ---
 * @param {*} value The value to check.
 *
 * ---
 * @returns {value is Boolean} Returns `true` if `value` is a `Boolean` object.
 *
 * ---
 * @example
 * isBooleanObject(new Boolean(true));
 * // ➔ true
 * isBooleanObject(true);
 * // ➔ false
 */
export const isBooleanObject = (value: unknown): value is Boolean => {
  return (
    isObject(value) &&
    Object.prototype.toString.call(value) === "[object Boolean]"
  );
};
