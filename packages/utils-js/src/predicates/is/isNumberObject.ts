/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { isObject } from "./isObject";

/** ----------------------------------------------------
 * * ***Type guard: `isNumberObject`.***
 * ----------------------------------------------------
 * **Checks if a value is a **`Number` object wrapper**
 * (`new Number(...)`), not a primitive number.**
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a `Number` object.
 * @example
 * isNumberObject(new Number(42));
 * // ➔ true
 * isNumberObject(42);
 * // ➔ false
 */
export function isNumberObject(value: unknown): value is Number {
  return (
    isObject(value) &&
    Object.prototype.toString.call(value) === "[object Number]"
  );
}
