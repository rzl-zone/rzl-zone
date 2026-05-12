/** ---------------------------------------------------------
 * * ***Type guard: `isString`.***
 * ----------------------------------------------------------
 * **Checks if a value is of type
 * **[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**.**
 * - **Behavior:**
 *    - Narrows type to `string` when true.
 *    - Uses the `typeof` operator for strict checking.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a string, otherwise `false`.
 * @example
 * isString("hello"); // ➔ true
 * isString(123);     // ➔ false
 *
 * // Usage in type narrowing
 * const value: unknown = getValue();
 * if (isString(value)) {
 *   // TypeScript now knows `value` is a string
 *   console.log(value.toUpperCase());
 * }
 */
export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};
