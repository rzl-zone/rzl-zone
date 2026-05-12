/** ----------------------------------------
 * * ***Predicate: `isLength`.***
 * ----------------------------------------------------------
 * **Checks whether the given value is a **valid array-like length**.**
 * - **Behavior:**
 *    - ✅ Ensures the value is a **non-negative integer**.
 *    - ✅ Ensures the value is **not greater than `Number.MAX_SAFE_INTEGER`**.
 *    - ❌ Excludes non-numeric values, `Infinity`, and fractional numbers.
 * - **ℹ️ Note:**
 *    - This method is loosely based-on
 *      [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *    - A valid length must be a non-negative integer and **not greater
 *      than `Number.MAX_SAFE_INTEGER`**.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 * isLength(3);
 * // ➔ true
 * isLength(Number.MAX_SAFE_INTEGER);
 * // ➔ true
 * isLength(Number.MAX_SAFE_INTEGER + 1);
 * // ➔ false
 * isLength("3");
 * // ➔ false
 * isLength(-1);
 * // ➔ false
 * isLength(3.14);
 * // ➔ false
 * isLength(Infinity);
 * // ➔ false
 * isLength(-Infinity);
 * // ➔ false
 * isLength(Number.MIN_VALUE);
 * // ➔ false
 */
export function isLength(value: unknown): boolean {
  return (
    typeof value === "number" &&
    value > -1 &&
    Number.isInteger(value) &&
    value <= Number.MAX_SAFE_INTEGER
  );
}
