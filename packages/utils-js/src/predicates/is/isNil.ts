/** ----------------------------------------------------
 * * ***Type guard: `isNil`.***
 * ----------------------------------------------------------
 * **Checks if a value is **[`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)** or **[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)**.**
 * - **Behavior:**
 *    - Narrows type to `null` or `undefined` when true.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `null` or `undefined`, otherwise `false`.
 * @example
 * isNil(null);
 * // ➔ true
 * isNil(undefined);
 * // ➔ true
 * isNil(void 0);
 * // ➔ true
 * isNil(NaN);
 * // ➔ false
 */
export function isNil(value: unknown): value is null | undefined {
  return value == null;
}
