import { isNumberObject } from "./isNumberObject";

/** ----------------------------------------------------
 * * ***Type guard: `isInfinityNumber`.***
 * ----------------------------------------------------
 * **Checks if a value is positive or negative
 * [`Infinity`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity).**
 * - **ℹ️ Note:**
 *    - This is stricter than the global `isFinite`,
 *      because it only returns `true` for `Infinity` or `-Infinity`,
 *      not other non-finite values.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `Infinity` or `-Infinity`, else `false`.
 * @example
 * import * as RzlUtilsJs from "@rzl-zone/utils-js/predicates";
 *
 * RzlUtilsJs.isInfinityNumber(Infinity);
 * // ➔ true
 * RzlUtilsJs.isInfinityNumber(-Infinity);
 * // ➔ true
 * RzlUtilsJs.isInfinityNumber(new Number(Infinity));
 * // ➔ true
 * RzlUtilsJs.isInfinityNumber(NaN);
 * // ➔ false
 * RzlUtilsJs.isInfinityNumber(123);
 * // ➔ false
 */
export function isInfinityNumber(value: unknown): boolean {
  if (typeof value === "number" || isNumberObject(value)) {
    const num = Number(value);
    return num === Infinity || num === -Infinity;
  }
  return false;
}
