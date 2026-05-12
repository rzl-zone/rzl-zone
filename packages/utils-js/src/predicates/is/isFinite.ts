import { isNumber } from "./isNumber";

/** ----------------------------------------------------------
 * * ***Type guard: `isFinite`.***
 * -----------------------------------------------------------
 * **Checks if a value is a finite primitive number.**
 * @description
 * This function verifies that `value` is a **primitive number** and is **finite**
 * (i.e., not `NaN`, `Infinity`, or `-Infinity`).
 * - **Behavior:**
 *    - Behaves like
 *      [`Number.isFinite()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite).
 *    - But also works as a **TypeScript type guard**.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite primitive number, else `false`.
 * @example
 * import * as RzlUtilsJs from "@rzl-zone/utils-js/predicates";
 *
 * // Strict finite number check (only primitive numbers)
 * RzlUtilsJs.isFinite(3);
 * // ➔ true
 * RzlUtilsJs.isFinite(Number.MIN_VALUE);
 * // ➔ true
 * RzlUtilsJs.isFinite("3");
 * // ➔ false (string is not a number)
 * RzlUtilsJs.isFinite(NaN);
 * // ➔ false
 * RzlUtilsJs.isFinite(Infinity);
 * // ➔ false
 * RzlUtilsJs.isFinite(new Number(3));
 * // ➔ false (Number object is not primitive)
 *
 * // Comparison with global isFinite()
 * isFinite("3");
 * // ➔ true (global coerces string to number)
 * isFinite(new Number(3));
 * // ➔ true (object coerced to primitive number)
 */
export function isFinite(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value);
}
