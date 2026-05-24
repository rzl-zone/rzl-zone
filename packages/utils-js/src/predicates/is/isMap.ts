/** ---------------------------------------------------------
 * * ***Type guard: `isMap`.***
 * ----------------------------------------------------------
 * **Checks whether the given value is a **[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object**.**
 *
 * ---
 * - **Behavior:**
 *     - Ensures that the provided value is an instance of **[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)**.
 *     - Useful in TypeScript for narrowing types when working with collections.
 *
 * ---
 * @param {*} value The value to check.
 *
 * ---
 * @returns {boolean} Returns `true` if `value` is instance of **[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)**, else `false`.
 *
 * ---
 * @example
 * isMap(new Map());
 * // ➔ true
 * isMap(new WeakMap());
 * // ➔ false
 * isMap({});
 * // ➔ false
 */
export function isMap<K = unknown, V = unknown>(
  value: Map<K, V>
): value is Map<K, V>;
export function isMap(value: unknown): value is Map<unknown, unknown>;
export function isMap(value: unknown): boolean {
  return (
    Object.prototype.toString.call(value) === "[object Map]" ||
    value instanceof Map
  );
}
