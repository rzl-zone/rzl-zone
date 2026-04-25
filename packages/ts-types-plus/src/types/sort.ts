import type { Decrement } from "./decrement";
import type { IsEqual } from "./equal";
import type { IsGreaterThan } from "./greater-than";
import type { Increment } from "./increment";
import type { IsLowerOrEqual, IsLowerThan } from "./lower-than";
import type { Swap } from "./swap";

type _SortSingle<
  Result extends readonly number[],
  PivotIndex extends number,
  CurrentIndex extends number
> =
  IsEqual<PivotIndex, CurrentIndex> extends true
    ? Result
    : Increment<CurrentIndex> extends infer NextCurrentIndex extends number
      ? _SortSingle<
          IsGreaterThan<
            Result[CurrentIndex],
            Result[NextCurrentIndex]
          > extends true
            ? Swap<
                Result,
                CurrentIndex,
                NextCurrentIndex
              > extends infer NewResult extends readonly number[]
              ? NewResult
              : Result
            : Result,
          PivotIndex,
          NextCurrentIndex
        >
      : never;

type _Sort<T extends readonly number[], CurrentIndex extends number> =
  IsLowerOrEqual<CurrentIndex, 0> extends true
    ? T
    : _SortSingle<T, CurrentIndex, 0> extends infer NewT extends
          readonly number[]
      ? _Sort<NewT, Decrement<CurrentIndex>>
      : T;

/** -------------------------------------------------------
 * * ***Utility Type: `Sort`.***
 * -------------------------------------------------------
 * **Type-level function that sorts a **tuple of numbers** in **ascending order**.**
 * - **Behavior:**
 *      - Tuples with length `< 2` are returned as-is.
 *      - Works only on **tuple literal types**, not on general arrays (`number[]`).
 * @template T - Tuple of numbers to sort.
 * @example
 * ```ts
 * // Sort positive numbers
 * type T0 = Sort<[3, 2, 1]>;
 * // ➔ [1, 2, 3]
 *
 * // Sort numbers with negative values
 * type T1 = Sort<[1, -1, 0]>;
 * // ➔ [-1, 0, 1]
 *
 * // Already sorted
 * type T2 = Sort<[0, 1, 2]>;
 * // ➔ [0, 1, 2]
 *
 * // Single element tuple
 * type T3 = Sort<[42]>;
 * // ➔ [42]
 *
 * // Empty tuple
 * type T4 = Sort<[]>;
 * // ➔ []
 * ```
 */
export type Sort<T extends readonly number[]> =
  IsLowerThan<T["length"], 2> extends true
    ? T
    : _Sort<T, Decrement<T["length"]>>;
