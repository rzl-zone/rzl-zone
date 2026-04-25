import type { IsEmptyArray } from "./array";
import type { IsTuple } from "./is-tuple";
import type { IfLowerThan } from "./lower-than";
import type { ReturnItselfIfNotExtends } from "./return-itself-extends";
import type { Shift } from "./shift";

/** -------------------------------------------------------
 * * ***Utility Type: `Max`.***
 * -------------------------------------------------------
 * **Accepts two integers and returns the **maximum** among them.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - First integer to compare.
 * @template Num2 - Second integer to compare.
 * @example
 * ```ts
 * type Case1 = Max<1, 10>;  // ➔ 10
 * type Case2 = Max<1, -10>; // ➔ 1
 * ```
 */
export type Max<Num1 extends number, Num2 extends number> = IfLowerThan<
  Num1,
  Num2,
  Num2,
  Num1
>;

/** * ***Recursively computes the maximum number in a tuple of integers.***
 *
 * @private ***Private internal type for {@link MaxArr | **`MaxArr`**}.***
 * @template T - Tuple of numbers to process.
 * @template CurrentMax - Current maximum value, defaults to the first element of T.
 */
type _MaxArr<
  T extends readonly number[],
  CurrentMax extends number = ReturnItselfIfNotExtends<T[0], undefined, never>
> =
  IsEmptyArray<T> extends true
    ? CurrentMax
    : Shift<T, { includeRemoved: true }> extends [
          infer Rest extends number[],
          infer First extends number
        ]
      ? _MaxArr<Rest, Max<First, CurrentMax>>
      : never;

/** -------------------------------------------------------
 * * ***Utility Type: `MaxArr`.***
 * -------------------------------------------------------
 * **Accepts a tuple of integers and returns the **maximum** among its elements.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template T - Tuple of numbers to evaluate.
 * - Only tuples are supported; arrays of unknown length will return `never`.
 * @example
 * ```ts
 * type Case1 = MaxArr<[1, 2, 4, 10]>; // ➔ 10
 * type Case2 = MaxArr<[-1, 4, -10]>;  // ➔ 4
 * type Case3 = MaxArr<number[]>;      // ➔ never (not a tuple)
 * ```
 */
export type MaxArr<T extends readonly number[]> =
  IsTuple<T> extends true ? _MaxArr<T> : never;
