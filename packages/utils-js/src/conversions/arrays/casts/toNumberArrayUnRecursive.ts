import type {
  NormalizeInputToNumberArrayUnRecursive,
  ToNumberArrayUnRecursiveOptions,
  ToNumberArrayUnRecursiveReturn
} from "./toNumberArrayUnRecursive.types";

import { isNull } from "@/predicates/is/isNull";
import { isArray } from "@/predicates/is/isArray";
import { isBigInt } from "@/predicates/is/isBigInt";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

import { filterNilArray } from "../transforms/filterNilArray";

/** -------------------------------------------------------
 * * ***Utility: `toNumberArrayUnRecursive`.***
 * -------------------------------------------------------
 * **Converts a flat array of strings, numbers, nulls, or undefineds into numbers.**
 * - **Behavior:**
 *    - Only supports **flat arrays** (non-recursive).
 *    - Valid inputs: `string`, `number`, `null`, `undefined`.
 *    - `BigInt` will be converted to `number`.
 *    - Other values ➔ coerced into `undefined`.
 *    - Invalid values can be **removed** (`removeInvalidValueNumber: true`) or **kept** (`false`).
 * - **ℹ️ Note:**
 *    - _For recursive / nested arrays, use ***`toNumberDeep` utility function*** instead._
 * @template T - Element type of the input array.
 * @template R - Whether invalid values should be removed (`true`) or kept (`false`).
 * @param {Array<T> | readonly T[] | null | undefined} [array] - The array to convert, returns `undefined` if not an array.
 * @param {ToNumberArrayUnRecursiveOptions<RemoveInvalidValue>} [options] - Options to control transformation behavior, defaults to `{ removeInvalidValueNumber: true }`.
 * @returns {ToNumberArrayUnRecursiveReturn<NormalizeInput<T>, RemoveInvalidValue>} A new array of string representations, with invalid values optionally removed.
 * @example
 * ```ts
 * toNumberArrayUnRecursive(['1', 2, '3']);
 * // ➔ [1, 2, 3]
 * toNumberArrayUnRecursive([1, null, undefined, 'abc']);
 * // ➔ [1]
 * toNumberArrayUnRecursive(['1', null, undefined, 'abc'], {
 *   removeInvalidValueNumber: false
 * });
 * // ➔ [1, null, undefined, undefined]
 * toNumberArrayUnRecursive(null);      // ➔ undefined
 * toNumberArrayUnRecursive(undefined); // ➔ undefined
 * toNumberArrayUnRecursive(1);         // ➔ undefined
 * ```
 */
export function toNumberArrayUnRecursive(
  array?: null | undefined,
  options?: ToNumberArrayUnRecursiveOptions<boolean>
): undefined;
export function toNumberArrayUnRecursive(
  array?: Array<never>,
  options?: ToNumberArrayUnRecursiveOptions<boolean>
): [];
export function toNumberArrayUnRecursive<T, R extends boolean = true>(
  array?: Array<T> | readonly T[] | null,
  options?: ToNumberArrayUnRecursiveOptions<R>
): ToNumberArrayUnRecursiveReturn<NormalizeInputToNumberArrayUnRecursive<T>, R>;
export function toNumberArrayUnRecursive<T = unknown>(
  array?: T,
  options?: ToNumberArrayUnRecursiveOptions<boolean>
): undefined;
export function toNumberArrayUnRecursive<T>(
  array?: Array<T> | readonly T[] | null,
  options: ToNumberArrayUnRecursiveOptions<boolean> = {}
) {
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const riv = hasOwnProp(options, "removeInvalidValueNumber")
    ? options.removeInvalidValueNumber
    : true;

  assertIsBoolean(riv, {
    message: ({ currentType, validType }) =>
      `Parameter \`removeInvalidValueNumber\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  if (isArray(array)) {
    const result = Array.from(array, (x) => {
      if (isBigInt(x)) return Number(x);

      const str = String(x).trim();
      const match = str.match(/-?\d+(\.\d+)?/);
      // const match = str.match(/^-?\d+(\.\d+)?$/); // ➔ full string match, stricter
      return match ? Number(match[0]) : isNull(x) ? null : undefined;
    });

    return riv ? filterNilArray(result) : result;
  }

  return undefined;
}
