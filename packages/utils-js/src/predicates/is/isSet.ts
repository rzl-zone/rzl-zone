/** ---------------------------------------------------------
 * * ***Type guard: `isSet`.***
 * ----------------------------------------------------------
 * **Checks if a value is a **[`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/Set)** object.**
 *
 * ---
 * - **Behavior:**
 *     - Narrows type to `Set<T>` when true.
 *     - Excludes `WeakSet`, arrays, plain objects, and other non-Set values.
 *
 * ---
 * @template T - The type of the value being checked.
 *
 * ---
 * @param {*} value - The value to check.
 *
 * ---
 * @returns {boolean} Returns `true` if the value is a `Set`, otherwise `false`.
 *
 * ---
 * @example
 * isSet(new Set);
 * // ➔ true
 * isSet(new WeakSet);
 * // ➔ false
 */
export function isSet<T = unknown>(value: Set<T>): value is Set<T>;
export function isSet(value: unknown): value is Set<unknown>;
export function isSet(value: unknown): boolean {
  return (
    Object.prototype.toString.call(value) === "[object Set]" ||
    value instanceof Set
  );
}
