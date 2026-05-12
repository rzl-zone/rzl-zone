/** ----------------------------------------------------------
 * * ***Type guard: `isBigInt`.***
 * ----------------------------------------------------------
 * **Checks if a value is of type **[`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)**.**
 * - **Behavior:**
 *    - Uses `typeof value === "bigint"` for strict type checking.
 *    - Supports TypeScript type narrowing with `value is bigint`.
 *    - Returns `false` for `BigInt` object (object-wrapped), e.g:
 *      - `Object(BigInt(123))`.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if value is a primitive bigint.
 * @example
 * isBigInt(123n);
 * // ➔ true
 * isBigInt(BigInt(123));
 * // ➔ true
 * isBigInt("123");
 * // ➔ false
 * isBigInt(Object(BigInt(1)));
 * // ➔ false
 */
export const isBigInt = (value: unknown): value is bigint => {
  return typeof value === "bigint";
};
