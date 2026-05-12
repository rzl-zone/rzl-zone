/** ---------------------------------------------------------
 * * ***Type guard: `isUndefined`.***
 * ----------------------------------------------------------
 * **Checks if a value is
 * **[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)**.**
 * - **Behavior:**
 *    - Narrows type to `undefined` when true.
 *    - Excludes `null`, `objects`, `arrays`, `strings`, `numbers`, and
 *      `all other values`.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `undefined`, otherwise `false`.
 * @example
 * isUndefined(undefined); // ➔ true
 * isUndefined([]);        // ➔ false
 * isUndefined(123);       // ➔ false
 * isUndefined(null);      // ➔ false
 * isUndefined("abc");     // ➔ false
 */
export const isUndefined = (value: unknown): value is undefined => {
  return typeof value === "undefined";
};
