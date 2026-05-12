/** ----------------------------------------------------------
 * * ***Type guard: `PropertyKey`.***
 * ----------------------------------------------------------
 * **Checks if a value is a valid `PropertyKey`.**
 * - **In JavaScript/TypeScript, a **`PropertyKey`** is any of:**
 *    - **`string`**
 *    - **`number`**
 *    - **`symbol`**
 * - **This function ensures the given `value` is one of these types.**
 *    - Narrows type to {@link PropertyKey | ***`PropertyKey`***} when true.
 *    - Useful for working with dynamic object keys.
 *    - Strictly rejects `null`, `undefined`, `boolean`, `object`, `function`, etc.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if `value` is a valid property key, otherwise `false`.
 * @example
 * isPropertyKey("foo");
 * // ➔ true
 * isPropertyKey(123);
 * // ➔ true
 * isPropertyKey(Symbol("id"));
 * // ➔ true
 * isPropertyKey({});
 * // ➔ false
 * isPropertyKey(null);
 * // ➔ false
 */
export function isPropertyKey(value: unknown): value is PropertyKey {
  const type = typeof value;
  return type === "string" || type === "number" || type === "symbol";
}
