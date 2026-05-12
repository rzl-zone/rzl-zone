import type {
  FilterNilArray,
  FilterNilArrayFromTuple,
  PreserveMutability
} from "./_private/filterNilArray.types";

import { isNil } from "@/predicates/is/isNil";
import { isArray } from "@/predicates/is/isArray";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";

/** ----------------------------------------------------------
 * * ***Utility: `filterNilArray`.***
 * ---------------------------------------------
 * **Removes `null` and `undefined` values from an array, including nested arrays.**
 * - **Behavior:**
 *    - Returns `undefined` if the input is explicitly `undefined` or `null`.
 *    - Returns `[]` if input is empty or all elements are removed after filtering.
 *    - Recursively filters nested arrays while preserving structure.
 *    - Ensures proper type inference for safer downstream operations.
 * @template A - The type of elements in the array.
 * @param {T[]|null|undefined} input - The array to be filtered.
 * @returns {T[] | undefined} A new array with `null` and `undefined` values removed,
 * or `undefined` if the input is explicitly `undefined` or `null`.
 * @example
 * ```ts
 * filterNilArray([1, null, 2, undefined, 3]);
 * // ➔ [1, 2, 3]
 * filterNilArray([null, undefined]);
 * // ➔ []
 * filterNilArray(undefined);
 * // ➔ undefined
 * filterNilArray(null);
 * // ➔ undefined
 * filterNilArray([]); // or
 * filterNilArray([[[]]]); // or
 * filterNilArray([[[],undefined,null]]);
 * // ➔ []
 * filterNilArray([1, [null, 2, [undefined, 3]]]);
 * // ➔ [1, [2, [3]]]
 * ```
 */
export function filterNilArray(input: null | undefined): undefined;
export function filterNilArray<A extends readonly unknown[]>(
  input: A
): PreserveMutability<A, FilterNilArrayFromTuple<A>>;
export function filterNilArray<A extends readonly unknown[]>(
  input: A | null | undefined
): PreserveMutability<A, FilterNilArrayFromTuple<A>> | undefined;
export function filterNilArray<A>(
  input: (A | null | undefined)[] | null | undefined
): FilterNilArray<A> | undefined;
export function filterNilArray(
  input: readonly unknown[] | null | undefined
): unknown[] | undefined;
export function filterNilArray(input: unknown[]): unknown[];
export function filterNilArray(input: unknown): unknown {
  if (isNil(input)) return undefined;
  if (!isArray(input)) return [];

  const filtered = input.reduce<unknown[]>((output, element) => {
    if (!isNil(element)) {
      if (isArray(element)) {
        const cleanedNested = filterNilArray(element);
        if (cleanedNested && !isEmptyArray(cleanedNested)) {
          output.push(cleanedNested);
        }
      } else {
        output.push(element);
      }
    }
    return output;
  }, []);

  return filtered;
}
