import type {
  NormalizeInputToNumberArrayUnRecursive,
  ToNumberArrayUnRecursiveOptions,
  ToNumberArrayUnRecursiveReturn
} from "./toNumberArrayUnRecursive.types";

import { createMessage } from "@/_private/logger";

import { isNull } from "@/predicates/is/isNull";
import { isArray } from "@/predicates/is/isArray";
import { isBigInt } from "@/predicates/is/isBigInt";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";

import { filterNilArray } from "../transforms/filterNilArray";

/** ----------------------------------------------------------------------
 * * ***Utility: `toNumberArrayUnRecursive`.***
 * -----------------------------------------------------------------------
 * **Converts a flat array of strings, numbers, nulls, or
 * undefineds into numbers.**
 *
 * ---
 * - **Behavior:**
 *     - Only supports **flat arrays** (non-recursive).
 *     - Valid inputs: `string`, `number`, `null`, `undefined`.
 *     - `BigInt` will be converted to `number`.
 *     - Other values ➔ coerced into `undefined`.
 *     - Invalid values can be **removed**
 *       (`removeInvalidValueNumber: true`) or **kept** (`false`).
 *
 * ---
 * - **Note:**
 *     - *For recursive / nested arrays,
 *       use ***`toNumberDeep` utility function*** instead.*
 *
 * ---
 * @template T - Element type of the input array.
 * @template R - Whether invalid values should be removed (`true`) or
 *               kept (`false`).
 *
 * ---
 * @param {Array<T> | readonly T[] | null | undefined} [array]
 *         The array to convert, returns `undefined` if not an array.
 * @param {ToNumberArrayUnRecursiveOptions<RemoveInvalidValue>} [options]
 *         Options to control transformation behavior,
 *         defaults to `{ removeInvalidValueNumber: true }`.
 *
 * ---
 * @returns {ToNumberArrayUnRecursiveReturn<NormalizeInput<T>, RemoveInvalidValue>}
 *         A new array of string representations, with invalid values
 *         optionally removed.
 *
 * ---
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
 *
 * toNumberArrayUnRecursive(null);
 * // ➔ undefined
 * toNumberArrayUnRecursive(undefined);
 * // ➔ undefined
 * toNumberArrayUnRecursive(1);
 * // ➔ undefined
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
  if (!isPlainObject(options)) options = {};

  const riv = options.removeInvalidValueNumber ?? true;

  assertIsBoolean(riv, {
    message: ({ currentType, validType }) =>
      createMessage(
        "toNumberArrayUnRecursive",
        `Parameter \`removeInvalidValueNumber\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      )
  });

  if (isArray(array)) {
    const result = Array.from(array, (x) => {
      if (isBigInt(x)) return Number(x);

      const str = String(x).trim();
      const match = str.match(/-?\d+(\.\d+)?/);
      return match ? Number(match[0]) : isNull(x) ? null : undefined;
    });

    return riv ? filterNilArray(result) : result;
  }

  return undefined;
}
