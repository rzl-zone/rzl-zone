/** ---------------------------------------------------------
 * * ***Type guard: `isURL`.***
 * ----------------------------------------------------------
 * **Checks if a value is an instance of the
 * **[`URL`](https://developer.mozilla.org/docs/Web/API/URL)** class.**
 * - **Behavior:**
 *    - Narrows type to `URL` when true.
 *    - Excludes `strings`, `plain-objects`, and `other non-URL values`.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is an instance of `URL`, otherwise `false`.
 * @example
 * isURL(new URL("https://example.com"));
 * // ➔ true
 * isURL("https://example.com");
 * // ➔ false
 */
export const isURL = (value: unknown): value is URL => {
  return value instanceof URL;
};
