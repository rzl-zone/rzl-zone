import type { IsEqual } from "./equal";
import type { ParseNumber } from "./number";
import type { IsBetween } from "./is-between";
import type { And } from "./and";
import type { IsTuple } from "./is-tuple";

/** -------------------------------------------------------
 * * ***Utility Type: `Swap`.***
 * -------------------------------------------------------
 * **Swaps the positions of two elements in a tuple at the type level.**
 * - **Behavior:**
 *      - Only works on tuple types. Non-tuple arrays are returned as-is.
 *      - Validates that `FromIndex` and `ToIndex` are within bounds of the tuple.
 *      - If `FromIndex` and `ToIndex` are equal, the tuple remains unchanged.
 * @template T - The tuple type.
 * @template FromIndex - The index of the first element to swap.
 * @template ToIndex - The index of the second element to swap.
 * @example
 * ```ts
 * // Swap first and last element
 * type Case1 = Swap<[1, 2, 3], 0, 2>;
 * // ➔ [3, 2, 1]
 *
 * // Swap same index (no change)
 * type Case2 = Swap<[1, 2, 3], 0, 0>;
 * // ➔ [1, 2, 3]
 *
 * // Swap middle elements
 * type Case3 = Swap<["a", "b", "c"], 1, 2>;
 * // ➔ ["a", "c", "b"]
 *
 * // Non-tuple array remains unchanged
 * type Case4 = Swap<number[], 0, 1>;
 * // ➔ number[]
 * ```
 */
export type Swap<
  T extends readonly unknown[],
  FromIndex extends number,
  ToIndex extends number
> =
  IsTuple<T> extends true
    ? And<
        IsBetween<FromIndex, 0, T["length"]>,
        IsBetween<ToIndex, 0, T["length"]>
      > extends true
      ? T[FromIndex] extends infer From
        ? T[ToIndex] extends infer To
          ? {
              [K in keyof T]: ParseNumber<K> extends infer NumK
                ? IsEqual<FromIndex, NumK> extends true
                  ? To
                  : IsEqual<ToIndex, NumK> extends true
                    ? From
                    : T[K]
                : never;
            }
          : never
        : never
      : never
    : T;
