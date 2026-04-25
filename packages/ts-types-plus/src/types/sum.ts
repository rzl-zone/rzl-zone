import type { _Increment } from "./increment";
import type { IsNegativeInteger, Abs, ParseNumber, Negate } from "./number";
import type { LastCharacter } from "./last-character";
import type { Stringify } from "./stringify";
import type { IsEmptyString } from "./string";
import type { Pop } from "./pop";
import type { IsTuple } from "./is-tuple";
import type { IsNever } from "./never";
import type { Sub } from "./sub";
import type { IsEmptyArray } from "./array";

type SumIncrementMap = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19
];

type SumLastDigitMap = {
  10: 0;
  11: 1;
  12: 2;
  13: 3;
  14: 4;
  15: 5;
  16: 6;
  17: 7;
  18: 8;
  19: 9;
};

type SumMap = {
  0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  3: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  4: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  5: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  6: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  7: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  8: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  9: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
};

/** -------------------------------------------------------
 * * ***Private Utility Type: `_Sum`.***
 * -------------------------------------------------------
 * **Internal helper type for summing two integer numbers represented as strings.**
 * - Performs digit-by-digit addition with carry handling.
 * @deprecated This is internal helper, use {@link Sum | **`Sum`**} instead.
 * @template Num1 - First number as string.
 * @template Num2 - Second number as string.
 * @template Carry - Carry flag (0 or 1), defaults to 0.
 * @template Result - Accumulated result string, defaults to empty string.
 */
export type _Sum<
  Num1 extends string,
  Num2 extends string,
  Carry extends 0 | 1 = 0,
  Result extends string = ""
> =
  IsEmptyString<Num1> extends true
    ? Carry extends 0
      ? ParseNumber<`${Num2}${Result}`>
      : _Increment<Num2, Result>
    : IsEmptyString<Num2> extends true
      ? Carry extends 0
        ? ParseNumber<`${Num1}${Result}`>
        : _Increment<Num1, Result>
      : LastCharacter<Num1> extends `${infer Num1LastDigit extends keyof SumMap & number}`
        ? LastCharacter<Num2> extends `${infer Num2LastDigit extends
            keyof SumMap[Num1LastDigit] & number}`
          ? SumMap[Num1LastDigit][Num2LastDigit] extends infer DigitsSum extends
              number
            ? (
                Carry extends 1 ? SumIncrementMap[DigitsSum] : DigitsSum
              ) extends infer DigitsSumWithCarry extends number
              ? Num1 extends `${infer Num1Rest}${Num1LastDigit}`
                ? Num2 extends `${infer Num2Rest}${Num2LastDigit}`
                  ? DigitsSumWithCarry extends keyof SumLastDigitMap
                    ? _Sum<
                        Num1Rest,
                        Num2Rest,
                        1,
                        `${SumLastDigitMap[DigitsSumWithCarry]}${Result}`
                      >
                    : _Sum<
                        Num1Rest,
                        Num2Rest,
                        0,
                        `${DigitsSumWithCarry}${Result}`
                      >
                  : never
                : never
              : never
            : never
          : never
        : never;

/** -------------------------------------------------------
 * * ***Utility Type: `Sum`.***
 * -------------------------------------------------------
 * **Adds two integers at the type level. Handles positive and negative numbers.**
 * - Supports numbers in the range:
 *    - `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - First number.
 * @template Num2 - Second number.
 * @example
 * ```ts
 * // Positive + positive
 * type Case1 = Sum<4, 9>;   // ➔ 13
 *
 * // Negative + positive
 * type Case2 = Sum<-4, 9>;  // ➔ 5
 *
 * // Positive + negative
 * type Case3 = Sum<4, -9>;  // ➔ -5
 *
 * // Negative + negative
 * type Case4 = Sum<-4, -9>; // ➔ -13
 * ```
 */
export type Sum<Num1 extends number, Num2 extends number> =
  IsNegativeInteger<Num1> extends true
    ? IsNegativeInteger<Num2> extends true
      ? Negate<_Sum<Stringify<Abs<Num1>>, Stringify<Abs<Num2>>>>
      : Sub<Num2, Abs<Num1>>
    : IsNegativeInteger<Num2> extends true
      ? Sub<Num1, Abs<Num2>>
      : _Sum<Stringify<Num1>, Stringify<Num2>>;

type _safeSumArr<
  Rest extends number[],
  CurrentSum extends number,
  Num1 extends number
> =
  // prettier-ignore
  /** @ts-expect-error this still safe not to much deep */
  _SumArr<Rest, Sum<CurrentSum, Num1>>;

type _SumArr<T extends readonly number[], CurrentSum extends number = 0> =
  IsEmptyArray<T> extends true
    ? CurrentSum
    : Pop<T, { includeRemoved: true }> extends infer PopResult
      ? IsNever<PopResult> extends true
        ? CurrentSum
        : PopResult extends [
              infer Rest extends number[],
              infer Num1 extends number
            ]
          ? _safeSumArr<Rest, CurrentSum, Num1>
          : never
      : CurrentSum;

/** -------------------------------------------------------
 * * ***Utility Type: `SumArr`.***
 * -------------------------------------------------------
 * **Accepts a tuple of numbers and returns their sum.**
 *
 * - **Behavior:**
 *     - Only works on tuple types (not general arrays).
 *     - Supports numbers in the range:
 *        - `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template T - Tuple of numbers to sum.
 * @example
 * ```ts
 * // Sum all elements in a tuple
 * type Case1 = SumArr<[1, 2, 3, 4]>;  // ➔ 10
 *
 * // Tuple with negative number
 * type Case2 = SumArr<[1, 2, 3, -4]>; // ➔ 2
 * ```
 */
export type SumArr<T extends readonly number[]> =
  IsTuple<T> extends true ? _SumArr<T> : never;
