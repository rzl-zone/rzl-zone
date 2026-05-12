import type { CustomizerIsEqualWith } from "./_private/types.isEqualWith";
import { baseDeepEqual } from "@/predicates/is/_private/baseDeepEqual";

/** ----------------------------------------------------
 * * ***Predicate: `isEqualWith`.***
 * ----------------------------------------------------
 * **Performs a deep comparison between two values with support for a
 * customizer function.**
 * @description
 * This method is like ***`isEqual` utility function*** except that it
 * accepts a `customizer` which is invoked to compare values.
 * - **Behavior:**
 *     - If `customizer` returns `undefined`, the comparison is handled by
 *       the default deep equality algorithm.
 *     - The `customizer` is invoked with up to six arguments:
 *       - `(value, other, indexOrKey, parent, otherParent, stack)`,
 *         see **{@link CustomizerIsEqualWith | `CustomizerIsEqualWith`}**.
 *     - Supports comparing `arrays`, `objects`, `maps`, `sets`, `dates`,
 *       `regexes`, `typed arrays`, `etc`.
 *     - Functions and DOM nodes are **not** supported.
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {CustomizerIsEqualWith} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 * function isGreeting(value: unknown) {
 *   return typeof value === "string" && /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue: unknown, othValue: unknown) {
 *   if (isGreeting(objValue) && isGreeting(othValue)) {
 *     return true;
 *   }
 * }
 *
 * const array = ["hello", "goodbye"];
 * const other = ["hi", "goodbye"];
 *
 * isEqualWith(array, other, customizer);
 * // ➔ true
 */
export function isEqualWith(
  value: unknown,
  other: unknown,
  customizer?: CustomizerIsEqualWith
): boolean {
  return baseDeepEqual(value, other, customizer, new WeakMap());
}
