import type { _Increment } from "./increment";
import type { LastCharacter } from "./last-character";
import type { Abs, IsNegative, Negate, ParseNumber } from "./number";
import type { Stringify } from "./stringify";

type DecrementMap = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
type NegativeCarryMap = {
  "-1": 9;
};

/** -------------------------------------------------------
 * * ***Internal Utility Type: `_Decrement (Internal / Deprecated)`***
 * -------------------------------------------------------
 * **Internal type-level utility to decrement a numeric string by 1.**
 * - **⚠️ Deprecated:**
 *      - Do **not** use this directly.
 *      - Use the public {@link Decrement | **`Decrement`**} type instead.
 * - Processes the string recursively digit by digit.
 * - Handles borrow/carry using internal `DecrementMap` and `NegativeCarryMap`.
 * @template Number - The numeric string to decrement.
 * @template Result - (Internal) Accumulator used during recursion.
 * @deprecated Use {@link Decrement | **`Decrement`**} instead.
 * @example
 * ```ts
 * // ❌ Avoid using _Decrement directly
 * type R1 = _Decrement<"23">;
 *
 * // ✅ Use Decrement instead
 * type R2 = Decrement<"23">; // ➔ 22
 * ```
 */
export type _Decrement<
  Number extends string,
  Result extends string = ""
> = Number extends ""
  ? ParseNumber<Result>
  : ParseNumber<LastCharacter<Number>> extends infer LastDigit extends number
    ? DecrementMap[LastDigit] extends infer Decremented extends number
      ? Number extends `${infer Rest}${LastDigit}`
        ? `${Decremented}` extends keyof NegativeCarryMap
          ? _Decrement<Rest, `${NegativeCarryMap[`${Decremented}`]}${Result}`>
          : `${Rest}${Decremented}${Result}` extends infer FinalResult extends
                string
            ? ParseNumber<
                FinalResult extends `0${infer FinalResultWithoutLeadingZero extends string}`
                  ? FinalResultWithoutLeadingZero extends ""
                    ? FinalResult
                    : FinalResultWithoutLeadingZero
                  : FinalResult
              >
            : never
        : never
      : never
    : never;

type _DecrementNegativeOrZero<T extends number> =
  _Increment<Stringify<T>> extends infer PositiveDecrementResult extends number
    ? PositiveDecrementResult extends 0
      ? PositiveDecrementResult
      : Negate<PositiveDecrementResult>
    : never;

/** -------------------------------------------------------
 * * ***Utility Type: `Decrement`.***
 * --------------------------------------------------------
 * **A type-level utility that returns the decremented value of an integer.**
 * - Works for numbers in the range `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template T - The number type to decrement.
 * @example
 * ```ts
 * type A = Decrement<6>;   // ➔ 5
 * type B = Decrement<0>;   // ➔ -1
 * type C = Decrement<-6>;  // ➔ -7
 * type D = Decrement<123>; // ➔ 122
 * type E = Decrement<-1>;  // ➔ -2
 * ```
 */
export type Decrement<T extends number> =
  IsNegative<T> extends true
    ? _DecrementNegativeOrZero<Abs<T>>
    : T extends 0
      ? _DecrementNegativeOrZero<T>
      : _Decrement<Stringify<T>>;
