import { baseIsMatch } from "@/predicates/is/_private/baseIsMatch";

/** ----------------------------------------------------
 * * ***Predicate: `isMatch`.***
 * ----------------------------------------------------
 * **Performs a partial deep comparison between `object` and `source`.**
 * @description
 * Determines whether `object` contains equivalent property values from `source`.
 * - **Behavior:**
 *    - ✅ Returns `true` if **all properties** in `source` exist in `object` and are deeply equal.
 *    - ❌ Does **not** require `object` and `source` to be the same shape—`object` may have extra properties.
 *    - ⚠️ Arrays are treated as objects: only matching indexed keys are compared.
 * - **Remarks:**
 *    - This is functionally equivalent to a partially applied `matches(source)` predicate.
 *    - Special cases:
 *      - An empty array (`[]`) in `source` matches any array in `object`.
 *      - An empty object (`{}`) in `source` matches any object in `object`.
 * @param {object} object - The object to inspect.
 * @param {object} source - The object containing property values to match.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 * const object = { a: 1, b: 2 };
 *
 * isMatch(object, { b: 2 });
 * // ➔ true
 * isMatch(object, { b: 1 });
 * // ➔ false
 * isMatch([1, 2, 3], [1, 2]);
 * // ➔ true (treats arrays as objects with index keys)
 */
export function isMatch(object: object, source: object): boolean {
  return baseIsMatch(object, source);
}
