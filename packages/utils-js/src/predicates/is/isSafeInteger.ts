/** --------------------------------------------------
 * * ***Type guard: `isSafeInteger`.***
 * --------------------------------------------------
 * **Checks if `value` is a **[`Safe-Integer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)**.**
 * - **Behavior:**
 *    - Narrows type to `number` when true.
 * - **An integer is considered *safe* if:**
 *    - It is an `IEEE-754` **double precision number**.
 *    - It can be exactly represented without rounding errors.
 *    - It lies within the range **-(2^53 - 1) to 2^53 - 1**.
 * - **Note:**
 *    - This method is based on **{@link Number.isSafeInteger | `Number.isSafeInteger`}**.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if `value` is a safe integer, otherwise `false`.
 * @example
 * isSafeInteger(3);
 * // ➔ true
 * isSafeInteger(Number.MIN_VALUE);
 * // ➔ false
 * isSafeInteger(Infinity);
 * // ➔ false
 * isSafeInteger('3');
 * // ➔ false
 */
export function isSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}
