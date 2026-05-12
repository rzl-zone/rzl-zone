/** ---------------------------------------------------------
 * * ***Type guard: `isInteger`.***
 * ----------------------------------------------------------
 * **Checks if a value is an integer number.**
 * - **ℹ️ Note:**
 *    - This method is based on
 *      [`Number.isInteger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger).
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 * isInteger(3);
 * // ➔ true
 * isInteger(Number.MIN_VALUE);
 * // ➔ false
 * isInteger(NaN);
 * // ➔ false
 * isInteger(Infinity);
 * // ➔ false
 * isInteger(-Infinity);
 * // ➔ false
 * isInteger('3');
 * // ➔ false
 */
export function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}
