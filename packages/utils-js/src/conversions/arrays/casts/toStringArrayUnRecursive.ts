import type {
  ToStringArrayUnRecursiveOptions,
  ToStringArrayUnRecursiveReturn
} from "./toStringArrayUnRecursive.types";

import { isNull } from "@/predicates/is/isNull";
import { isArray } from "@/predicates/is/isArray";
import { isString } from "@/predicates/is/isString";
import { isFinite } from "@/predicates/is/isFinite";
import { isBigInt } from "@/predicates/is/isBigInt";
import { isBoolean } from "@/predicates/is/isBoolean";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

import { filterNilArray } from "../transforms/filterNilArray";

/** ---------------------------------------------
 * * ***Utility: `toStringArrayUnRecursive`.***
 * ---------------------------------------------
 * **Converts all values in a flat array into string representations.**
 * - **Behavior:**
 *    - Only processes **flat arrays** (non-recursive).
 *    - Supports input values: `string`, `number`, `bigint`, `boolean`,
 *      `null`, `undefined`.
 *    - Invalid values (`null` and `undefined`) can be **removed** or **kept**
 *      depending on the option.
 *    - Other unsupported types will be converted to `undefined` (and removed
 *      if `removeInvalidValue=true`).
 * - **ℹ️ Note:**
 *    - _For recursive / nested arrays, use ***`toStringDeep` utility function*** instead._
 * @template T - Element type of the input array.
 * @template R - Whether invalid values should be removed (`true`) or kept (`false`).
 * @param {Array<string | number | bigint | boolean | null | undefined> | null | undefined} [array] - The array to convert, returns `undefined` if not an array.
 * @param {ToStringArrayUnRecursiveOptions<RemoveInvalidValue>} [options] - Options to control transformation behavior, defaults to `{ removeInvalidValue: true }`.
 * @param {RemoveInvalidValue extends true ? boolean : boolean} [options.removeInvalidValue=true] Whether to remove invalid values (`null`, `undefined`, or unsupported types), default: `true`.
 * @returns {RemoveInvalidValue extends true ? string[] : (string | null | undefined)[]} A new array of string representations, with invalid values optionally removed.
 * @example
 * ```ts
 * // Convert numbers and strings
 * toStringArrayUnRecursive([1, 2, '3']);
 * // ➔ ['1', '2', '3']
 * // Remove null and undefined
 * toStringArrayUnRecursive([1, null, undefined, 'abc'], {
 *   removeInvalidValue: true
 * });
 * // ➔ ['1', 'abc']
 * // Keep null and undefined
 * toStringArrayUnRecursive([1, null, undefined, 'abc'], {
 *   removeInvalidValue: false
 * });
 * // ➔ ['1', null, undefined, 'abc']
 * // Convert boolean and bigint
 * toStringArrayUnRecursive([true, false, 10n]);
 * // ➔ ['true', 'false', '10']
 * // Not an array ➔ returns undefined
 * toStringArrayUnRecursive(null);
 * // ➔ undefined
 * toStringArrayUnRecursive(undefined);
 * // ➔ undefined
 * toStringArrayUnRecursive(1);
 * // ➔ undefined
 * toStringArrayUnRecursive("string");
 * // ➔ undefined
 * ```
 */
export function toStringArrayUnRecursive(
  array?: undefined | null,
  options?: ToStringArrayUnRecursiveOptions<boolean>
): undefined;
export function toStringArrayUnRecursive(
  array?: Array<never>,
  options?: ToStringArrayUnRecursiveOptions<boolean>
): [];
export function toStringArrayUnRecursive<T, R extends boolean = true>(
  array?: Array<T> | readonly T[] | null,
  options?: ToStringArrayUnRecursiveOptions<R>
): ToStringArrayUnRecursiveReturn<T, R>;
export function toStringArrayUnRecursive<T = unknown>(
  array?: T,
  options?: ToStringArrayUnRecursiveOptions<boolean>
): undefined;
export function toStringArrayUnRecursive<T>(
  array?: Array<T> | readonly T[] | null,
  options: ToStringArrayUnRecursiveOptions<boolean> = {}
) {
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const riv = hasOwnProp(options, "removeInvalidValue")
    ? options.removeInvalidValue
    : true;

  assertIsBoolean(riv, {
    message: ({ currentType, validType }) =>
      `Parameter \`removeInvalidValue\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  if (isArray(array)) {
    // Convert each item in the array to a string, or null/undefined if it's not a valid value.
    const result = Array.from(array, (x) => {
      // Convert finite number, boolean, bigInt or string to string
      if (isString(x) || isFinite(x) || isBoolean(x) || isBigInt(x))
        return String(x);

      // Handle null or undefined values
      return isNull(x) ? null : undefined;
    });

    // Remove invalid values (null, undefined) if specified in options
    if (riv) return filterNilArray(result);

    return result;
  }

  // Return undefined if no array is provided
  return undefined;
}
