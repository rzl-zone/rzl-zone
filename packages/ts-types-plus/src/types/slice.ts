import type { IsEqual } from "./equal";
import type { Abs, IfPositive, IsNegative, ParseNumber } from "./number";
import type { IfGreaterOrEqual, IsGreaterOrEqual } from "./greater-than";
import type { Sum } from "./sum";
import type { Or } from "./or";
import type { Push } from "./push";
import type { IsEmptyArray } from "./array";
import type { And } from "./and";
import type { If } from "./if";
import type { IsLowerThan } from "./lower-than";
import type { IsArrayIndex } from "./is-array-index";

type SliceRemovedItemValue = Record<"__type-rzl_internal__", symbol>;

type FilterRemoved<
  T extends readonly unknown[],
  Result extends unknown[] = []
> = T extends readonly [infer First, ...infer Rest extends unknown[]]
  ? FilterRemoved<
      Rest,
      First extends SliceRemovedItemValue ? Result : Push<Result, First>
    >
  : Result;

/** -------------------------------------------------------
 * * ***Utility Type: `Slice`.***
 * -------------------------------------------------------
 * **Type-level version of `Array.prototype.slice()`.**
 * @description
 * Returns a shallow copy of a portion of an array, selected from `Start` to `End` (not including `End`).
 * - **Behavior:**
 *     - `Start` defaults to `0`.
 *     - `End` defaults to `T["length"]`.
 *     - Negative indices are interpreted as `T["length"] + index`.
 *     - If `Start >= T["length"]` or `End <= Start`, returns an empty array `[]`.
 *     - If the full range is selected, returns `T` as-is.
 * @template T - The array type to slice.
 * @template Start - The start index (inclusive). Defaults to `0`.
 * @template End - The end index (exclusive). Defaults to `T["length"]`.
 * @example
 * ```ts
 * // Slice from index 1 to end
 * type T0 = Slice<[1, 2, 3, 4], 1>;
 * // ➔ [2, 3, 4]
 *
 * // Slice from index 1 to 3
 * type T1 = Slice<[1, 2, 3, 4], 1, 3>;
 * // ➔ [2, 3]
 *
 * // Slice with negative start
 * type T2 = Slice<[1, 2, 3, 4], -2>;
 * // ➔ [3, 4]
 *
 * // Slice with negative end
 * type T3 = Slice<[1, 2, 3, 4], 1, -1>;
 * // ➔ [2, 3]
 *
 * // Slice exceeding array length
 * type T4 = Slice<[1, 2, 3], 0, 10>;
 * // ➔ [1, 2, 3]
 *
 * // Slice resulting in empty array
 * type T5 = Slice<[1, 2, 3], 3, 2>;
 * // ➔ []
 * ```
 */
export type Slice<
  T extends readonly unknown[],
  Start extends number = 0,
  End extends number = T["length"]
> = (
  IsEmptyArray<T> extends true
    ? "self"
    : IsGreaterOrEqual<Start, T["length"]> extends true
      ? "empty"
      : IsNegative<End> extends true
        ? IsGreaterOrEqual<Abs<End>, T["length"]> extends true
          ? "empty"
          : [
              IfPositive<Start, Start, Sum<T["length"], Start>>,
              Sum<T["length"], End>
            ]
        : And<
              Or<IsEqual<Start, 0>, IsGreaterOrEqual<Abs<Start>, T["length"]>>,
              IsGreaterOrEqual<End, T["length"]>
            > extends true
          ? "self"
          : [IfPositive<Start, Start, Sum<T["length"], Start>>, End]
) extends infer Indexes
  ? Indexes extends "self"
    ? T
    : Indexes extends "empty"
      ? []
      : Indexes extends [
            infer NewStart extends number,
            infer NewEnd extends number
          ]
        ? IfGreaterOrEqual<NewStart, NewEnd> extends true
          ? []
          : FilterRemoved<{
              [K in keyof T]: IsArrayIndex<K> extends true
                ? If<
                    And<
                      IsGreaterOrEqual<ParseNumber<K>, NewStart>,
                      IsLowerThan<ParseNumber<K>, NewEnd>
                    >,
                    T[K],
                    SliceRemovedItemValue
                  >
                : T[K];
            }>
        : T
  : T;
