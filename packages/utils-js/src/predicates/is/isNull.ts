/** ---------------------------------------------------------
 * * ***Type guard: `isNull`.***
 * ----------------------------------------------------------
 * **Checks if a value is **[`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)**.**
 * - **Behavior:**
 *    - Narrows type to `null` when true.
 *    - Strictly compares the value against `null`.
 * @param {*} val - The value to check.
 * @returns {boolean} Returns `true` if the value is `null`, otherwise `false`.
 * @example
 * isNull(null);      // ➔ true
 * isNull(0);         // ➔ false
 * isNull(undefined); // ➔ false
 */
export const isNull = (val: unknown): val is null => val === null;
