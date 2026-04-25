import type { If } from "./if";

/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link Shift | `Shift`}.***
 * ---------------------------------------------------------------------------
 */
export type ShiftOptions = {
  /**
   * If `true`, return both the rest of the array and the removed element
   * as a tuple `[Rest, Removed]`.
   *
   * Default is `false`.
   *
   * @default false
   */
  includeRemoved: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `Shift`.***
 * -------------------------------------------------------
 * **Removes the first element from the array type `T`.**
 * - **Behavior:**
 *      - By default (`includeRemoved: false`), returns the array without the first element.
 *      - If `includeRemoved: true`, returns a tuple `[Rest, Removed]`:
 *        - `Rest`: the remaining array.
 *        - `Removed`: the removed first element.
 * @template T - The array type to operate on.
 * @template Options - Optional flags. Default `{ includeRemoved: false }`.
 * @example
 * ```ts
 * // Default: just remove first element
 * type Case1 = Shift<[1, 2, 3]>;
 * // ➔ [2, 3]
 *
 * // Include removed element
 * type Case2 = Shift<[1, 2, 3], { includeRemoved: true }>;
 * // ➔ [[2, 3], 1]
 *
 * // Empty array
 * type Case3 = Shift<[]>;
 * // ➔ never
 * ```
 */
export type Shift<
  T extends readonly unknown[],
  Options extends ShiftOptions = { includeRemoved: false }
> = T extends readonly [infer Removed, ...infer Rest extends readonly unknown[]]
  ? If<Options["includeRemoved"], [Rest, Removed], Rest>
  : never;
