import type { IsEmptyArray } from "./array";
import type { IfEqual } from "./equal";
import type { Shift } from "./shift";

/** -------------------------------------------------------
 * * ***Utility Type: `Includes`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the second argument is in the first array argument.**
 * @template T - The array to check.
 * @template Pivot - The value to look for.
 * @example
 * ```ts
 * type Case1 = Includes<[1, 2, 3], 1>; // ➔ true
 * type Case2 = Includes<[1, 2, 3], 4>; // ➔ false
 * ```
 */
export type Includes<T extends readonly unknown[], Pivot> =
  IsEmptyArray<T> extends true
    ? false
    : Shift<T, { includeRemoved: true }> extends [
          infer Rest extends readonly unknown[],
          infer Removed
        ]
      ? IfEqual<Pivot, Removed, true, Includes<Rest, Pivot>>
      : false;
