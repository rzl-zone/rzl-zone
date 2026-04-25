import type { IsEqual } from "./equal";
import type { If } from "./if";
import type { Not } from "./not";
import type { Abs, IsNegative } from "./number";
import type { CompareNumberLength } from "./number-length";
import type { Stringify } from "./stringify";

type LowerThanMap = {
  "0": ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  "1": ["2", "3", "4", "5", "6", "7", "8", "9"];
  "2": ["3", "4", "5", "6", "7", "8", "9"];
  "3": ["4", "5", "6", "7", "8", "9"];
  "4": ["5", "6", "7", "8", "9"];
  "5": ["6", "7", "8", "9"];
  "6": ["7", "8", "9"];
  "7": ["8", "9"];
  "8": ["9"];
  "9": [];
};

type _IsLowerThan<
  Num1 extends string,
  Num2 extends string
> = Num1 extends `${infer Num1Character extends keyof LowerThanMap}${infer Num1Rest extends string}`
  ? Num2 extends `${infer Num2Character extends string}${infer Num2Rest extends string}`
    ? IsEqual<Num1Character, Num2Character> extends true
      ? _IsLowerThan<Num1Rest, Num2Rest>
      : Num2Character extends LowerThanMap[Num1Character][number]
        ? true
        : false
    : true
  : false;

/** -------------------------------------------------------
 * * ***Utility Type: `IsLowerThan`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether `Num1` is strictly lower than `Num2`.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer to compare.
 * @template Num2 - The second integer to compare.
 * @example
 * type Case1 = IsLowerThan<1, 10>;  // ➔ true
 * type Case2 = IsLowerThan<1, -10>; // ➔ false
 */
export type IsLowerThan<Num1 extends number, Num2 extends number> =
  IsEqual<Num1, Num2> extends true
    ? false
    : IsNegative<Num1> extends true
      ? IsNegative<Num2> extends false
        ? true
        : CompareNumberLength<
            Num1,
            Num2,
            false,
            true,
            Not<_IsLowerThan<Stringify<Abs<Num1>>, Stringify<Abs<Num2>>>>
          >
      : IsNegative<Num2> extends true
        ? false
        : CompareNumberLength<
            Num1,
            Num2,
            true,
            false,
            _IsLowerThan<Stringify<Abs<Num1>>, Stringify<Abs<Num2>>>
          >;

/** -------------------------------------------------------
 * * ***Utility Type: `IfLowerThan`.***
 * -------------------------------------------------------
 * **Returns `IfTrue` if `Num1` is lower than `Num2`, otherwise returns `IfFalse`.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer to compare.
 * @template Num2 - The second integer to compare.
 * @template IfTrue - Value to return if `Num1 < Num2`.
 * @template IfFalse - Value to return if `Num1 >= Num2`.
 * @example
 * type Case1 = IfLowerThan<1, 10, 'valid'>;
 * // ➔ 'valid'
 * type Case2 = IfLowerThan<1, -10, 'valid', 'invalid'>;
 * // ➔ 'invalid'
 */
export type IfLowerThan<
  Num1 extends number,
  Num2 extends number,
  IfTrue = true,
  IfFalse = false
> = If<IsLowerThan<Num1, Num2>, IfTrue, IfFalse>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsLowerOrEqual`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether `Num1` is lower than or equal to `Num2`.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer to compare.
 * @template Num2 - The second integer to compare.
 * @example
 * type Case1 = IsLowerOrEqual<1, 10>;
 * // ➔ true
 * type Case2 = IsLowerOrEqual<1, -10>;
 * // ➔ false
 */
export type IsLowerOrEqual<Num1 extends number, Num2 extends number> =
  IsEqual<Num1, Num2> extends true ? true : IsLowerThan<Num1, Num2>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfLowerOrEqual`.***
 * -------------------------------------------------------
 * **Returns the third argument if the first argument (integer) is lower than
 * the second argument (integer) or equal (defaults to `true`), otherwise returns
 * the fourth argument (defaults to `false`).**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer to compare.
 * @template Num2 - The second integer to compare.
 * @template IfTrue - Value to return if `Num1 <= Num2`.
 * @template IfFalse - Value to return if `Num1 > Num2`.
 * @example
 * type Case1 = IfLowerOrEqual<1, 10, 'valid'>;
 * // ➔ 'valid'
 * type Case2 = IfLowerOrEqual<23, 1, 'valid', 'invalid'>;
 * // ➔ 'invalid'
 */
export type IfLowerOrEqual<
  Num1 extends number,
  Num2 extends number,
  IfTrue = true,
  IfFalse = false
> = If<
  IsEqual<Num1, Num2> extends true ? true : IsLowerThan<Num1, Num2>,
  IfTrue,
  IfFalse
>;
