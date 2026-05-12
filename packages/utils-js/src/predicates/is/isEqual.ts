import { baseDeepEqual } from "@/predicates/is/_private/baseDeepEqual";

/** ----------------------------------------------------
 * * ***Predicate: `isEqual`.***
 * ----------------------------------------------------------
 * **Performs a deep comparison between two values to determine if they are equivalent.**
 * @description
 * Checks whether two values are **deeply equal**, not just reference-equal (`===`).
 * - **✅ This method compares:**
 *   - Arrays and TypedArrays
 *   - ArrayBuffers
 *   - Plain objects (`Object`) ➔ own enumerable properties only
 *   - Booleans, Numbers, Strings, Symbols
 *   - Dates
 *   - Errors
 *   - Maps
 *   - Sets
 *   - Regular expressions
 * - ❌ `Functions` and `DOM nodes` are ***not supported***.
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 * const obj1 = { user: "fred" };
 * const obj2 = { user: "fred" };
 *
 * isEqual(obj1, obj2);
 * // ➔ true
 * obj1 === obj2;
 * // ➔ false (different references)
 * isEqual([1, 2, 3], [1, 2, 3]);
 * // ➔ true
 * isEqual(new Date("2020-01-01"), new Date("2020-01-01"));
 * // ➔ true
 * isEqual(new Set([1, 2]), new Set([2, 1]));
 * // ➔ true
 * isEqual(/abc/i, new RegExp("abc", "i"));
 * // ➔ true
 * isEqual({ a: 1 }, { a: 1, b: undefined });
 * // ➔ false
 */
export function isEqual(value: unknown, other: unknown): boolean {
  return baseDeepEqual(value, other, undefined, new WeakMap());
}
