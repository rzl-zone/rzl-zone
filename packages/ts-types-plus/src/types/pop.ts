import type { IsEmptyArray } from "./array";
import type { If } from "./if";

/** ---------------------------------------------------------------------------
 * * ***Options for {@link Pop|`Pop`}.***
 * ---------------------------------------------------------------------------
 * **Configuration options for the {@link Pop | **`Pop`**} type utility.**
 */
export type PopOptions = {
  /**
   * If `true`, {@link Pop | **`Pop`**} will return a tuple `[Rest, Removed]`
   * instead of just the remaining array, default: `false`.
   *
   * @example
   * ```ts
   * type Options = { includeRemoved: true };
   * type Result = Pop<[1, 2, 3], Options>; // ➔ [[1, 2], 3]
   * ```
   */
  includeRemoved: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `Pop`.***
 * -------------------------------------------------------
 * **Removes the last element from a tuple/array type.**
 * - If the `includeRemoved` option is `true`, it returns a tuple `[Rest, Removed]`
 *   where `Rest` is the array without the last element, and `Removed` is the last
 *   element.
 * @template T - The tuple or array to pop from.
 * @template Options - Configuration object. Default `{ includeRemoved: false }`.
 * @example
 * ```ts
 * // Removes last element
 * type Case1 = Pop<[1, 2, 3]>
 * // ➔ [1, 2]
 *
 * // Removes last element and includes the removed value
 * type Case2 = Pop<[1, 2, 3], { includeRemoved: true }>
 * // ➔ [[1, 2], 3]
 *
 * // Edge case: empty array
 * type Case3 = Pop<[]>
 * // ➔ never
 * ```
 */
export type Pop<
  T extends readonly unknown[],
  Options extends PopOptions = {
    includeRemoved: false;
  }
> =
  IsEmptyArray<T> extends true
    ? never
    : T extends readonly [
          ...infer Rest extends readonly unknown[],
          infer Removed
        ]
      ? If<Options["includeRemoved"], [Rest, Removed], Rest>
      : never;
