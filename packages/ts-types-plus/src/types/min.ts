import type { IsEmptyArray } from "./array";
import type { IsTuple } from "./is-tuple";
import type { IfLowerThan } from "./lower-than";
import type { ReturnItselfIfNotExtends } from "./return-itself-extends";
import type { Shift } from "./shift";

/** -------------------------------------------------------
 * * ***Utility Type: `Min`.***
 * -------------------------------------------------------
 * **Accepts two integers and returns the **minimum** among them.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - First integer.
 * @template Num2 - Second integer.
 * @example
 * ```ts
 * type Case1 = Min<1, 10>;  // ➔ 1
 * type Case2 = Min<1, -10>; // ➔ -10
 * ```
 */
export type Min<Num1 extends number, Num2 extends number> = IfLowerThan<
  Num1,
  Num2,
  Num1,
  Num2
>;

/** * ***Helper type for computing the minimum of a tuple of numbers recursively.***
 *
 * @private ***Private internal type for {@link MinArr | **`MinArr`**}.***
 * @template T - Array of numbers
 * @template CurrentMin - Current minimum in recursion
 */
type _MinArr<
  T extends readonly number[],
  CurrentMin extends number = ReturnItselfIfNotExtends<T[0], undefined, never>
> =
  IsEmptyArray<T> extends true
    ? CurrentMin
    : Shift<T, { includeRemoved: true }> extends [
          infer Rest extends number[],
          infer First extends number
        ]
      ? _MinArr<Rest, Min<First, CurrentMin>>
      : never;

/** -------------------------------------------------------
 * * ***Utility Type: `MinArr`.***
 * -------------------------------------------------------
 * **Accepts an array of integers and returns the **minimum** among its elements.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template T - Tuple of numbers.
 * @example
 * ```ts
 * type Case1 = MinArr<[1, 2, 4, 10]>; // ➔ 1
 * type Case2 = MinArr<[-1, 4, -10]>;  // ➔ -10
 * ```
 */
export type MinArr<T extends readonly number[]> =
  IsTuple<T> extends true ? _MinArr<T> : never;
