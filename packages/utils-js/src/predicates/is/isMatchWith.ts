import type { CustomizerIsMatchWith } from "./_private/types.isMatchWith";
import { baseIsMatch } from "@/predicates/is/_private/baseIsMatch";

/** ----------------------------------------------------
 * * ***Predicate: `isMatchWith`.***
 * ----------------------------------------------------
 * **Performs a partial deep comparison between `object` and `source`, like `isMatch`, but with a `customizer` function to control comparisons.**
 * @description
 * If `customizer` returns a value other than `undefined`, that value is used
 * as the result of the comparison for the current property. Otherwise,
 * the comparison falls back to the default deep equality logic.
 * - **Behavior:**
 *    - The `customizer` function is invoked with up to **five** arguments:
 *        - `(objValue, srcValue, keyOrIndex, object, source)`,
 *        see **{@link CustomizerIsMatchWith | `CustomizerIsMatchWith`}**.
 *    - Returning `true` from `customizer` will short-circuit further comparison
 *      for that key.
 *    - Returning `false` will cause `isMatchWith` to return `false` immediately.
 *    - Returning `undefined` allows default comparison to proceed.
 * @param {object} value - The object to inspect.
 * @param {object} other - The object of property values to match.
 * @param {CustomizerIsMatchWith} [customizer] - The function to customize comparisons.
 * @returns Returns `true` if `object` is a match, else `false`.
 * @example
 * function isGreeting(value: unknown) {
 *   return typeof value === 'string' && /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue: unknown, srcValue: unknown) {
 *   if (isGreeting(objValue) && isGreeting(srcValue)) {
 *     return true;
 *   }
 * }
 *
 * const object = { greeting: 'hello' };
 * const source = { greeting: 'hi' };
 *
 * isMatchWith(object, source, customizer);
 * // ➔ true
 */
export function isMatchWith(
  value: object,
  other: object,
  customizer?: CustomizerIsMatchWith
): boolean {
  return baseIsMatch(value, other, customizer);
}
