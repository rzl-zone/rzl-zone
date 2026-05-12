/** ----------------------------------------------------------
 * * ***Type guard: `isSymbol`.***
 * ----------------------------------------------------------
 * **Checks if a value is of type
 * **[`symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/Symbol)**.**
 * - **Behavior:**
 *    - Narrows type to `symbol` when true.
 *    - Uses the `typeof` operator for strict checking.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a symbol, otherwise `false`.
 * @example
 * isSymbol(Symbol("id"));   // ➔ true
 * isSymbol("not a symbol"); // ➔ false
 * isSymbol(123);            // ➔ false
 * isSymbol(undefined);      // ➔ false
 */
export const isSymbol = (value: unknown): value is symbol => {
  return typeof value === "symbol";
};
