import { isNumberObject } from "./isNumberObject";

/** ----------------------------------------------------
 * * ***Type guard: `isNaN`.***
 * ----------------------------------------------------
 * **Checks if a value is [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).**
 * - **ℹ️ Note:**
 *    - This method is based on
 *      [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)
 *      and is **not** the same as the global
 *      [`isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN),
 *      which returns `true` for `undefined` and other non-number values.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 * import * as RzlUtilsJs from "@rzl-zone/utils-js/predicates";
 *
 * RzlUtilsJs.isNaN(NaN);
 * // ➔ true
 * RzlUtilsJs.isNaN(new Number(NaN));
 * // ➔ true
 * RzlUtilsJs.isNaN(undefined);
 * // ➔ false
 *
 * // This global isNaN:
 * isNaN(undefined);
 * // ➔ true
 */
export function isNaN(value: unknown): boolean {
  return typeof value === "number"
    ? Number.isNaN(value)
    : isNumberObject(value) && Number.isNaN(value.valueOf());
}
