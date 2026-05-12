/** ----------------------------------------------------------
 * * ***Type guard: `isError`.***
 * ----------------------------------------------------------
 * **Checks whether the given value is an ****[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** object**.**
 * - **Behavior:**
 *    - Ensures that the provided value is a valid JavaScript error instance.
 *    - Useful in TypeScript for narrowing types during error handling.
 * @param {*} error - The value to check.
 * @returns {boolean} Returns `true` if `value` is instance of **[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)**, else `false`.
 * @example
 * isError(new Error("Something went wrong"));
 * // ➔ true
 * isError("Error message");
 * // ➔ false
 * isError(null);
 * // ➔ false
 */
export const isError = (error: unknown): error is Error => {
  return (
    Object.prototype.toString.call(error) === "[object Error]" ||
    error instanceof Error
  );
};
