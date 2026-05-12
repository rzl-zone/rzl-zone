import { isNull } from "./isNull";
import { isObject } from "./isObject";

/** --------------------------------------------------
 * * ***Type guard: `isWeakMap`.***
 * ----------------------------------------------------------
 * **Checks if a value is a **[`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/WeakMap)** object.**
 * - **Behavior:**
 *    - Narrows type to `WeakMap<K, V>` when true.
 *    - Excludes `Map`, `arrays`, `plain-objects,` and `other non-WeakMap values`.
 * @template K - Keys must be objects.
 * @template V - Type of values stored in the WeakMap.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a `WeakMap`, otherwise `false`.
 * @example
 * isWeakMap(new WeakMap);
 * // ➔ true
 * isWeakMap(new Map);
 * // ➔ false
 */
export function isWeakMap<K extends object = object, V = unknown>(
  value: unknown
): value is WeakMap<K, V> {
  return isObject(value) && !isNull(value) && value instanceof WeakMap;
}
