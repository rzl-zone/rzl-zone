/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { isObject } from "./isObject";

/** ----------------------------------------------------
 * * ***Type guard: `isStringObject`.***
 * ----------------------------------------------------
 * **Checks if a value is a **`String` object wrapper**
 * (`new String(...)`), not a primitive string.**
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a `String` object.
 * @example
 * isStringObject(new String("hello"));
 * // ➔ true
 * isStringObject("hello");
 * // ➔ false
 */
export function isStringObject(value: unknown): value is String {
  return (
    isObject(value) &&
    Object.prototype.toString.call(value) === "[object String]"
  );
}
