import type { _Decrement } from "./decrement";
import type { LastCharacter } from "./last-character";
import type { Abs, IsNegative, Negate, ParseNumber } from "./number";
import type { IsEmptyString } from "./string";
import type { Stringify } from "./stringify";

type IncrementMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type LastDigitMap = {
  10: 0;
};

/** -------------------------------------------------------
 * * ***Internal Utility Type: `_Increment (Internal / Deprecated)`***
 * -------------------------------------------------------
 * **Internal type-level utility to increment a numeric string by 1.**
 * - **⚠️ Deprecated:**
 *       - Do **not** use this directly.
 *       - Use the public {@link Increment | **`Increment`**} type instead.
 * - Processes the string recursively digit by digit.
 * - Handles carry-over using internal `IncrementMap` and `LastDigitMap`.
 * @template Number - The numeric string to increment.
 * @template Result - (Internal) Accumulator used during recursion.
 * @deprecated Use {@link Increment | **`Increment`**} instead.
 * @example
 * ```ts
 * // ❌ Avoid using _Increment directly
 * type R1 = _Increment<"23">;
 *
 * // ✅ Use Increment instead
 * type R2 = Increment<"23">; // ➔ 24
 * ```
 */
export type _Increment<Number extends string, Result extends string = ""> =
  IsEmptyString<Number> extends true
    ? ParseNumber<`1${Result}`>
    : LastCharacter<Number> extends `${infer LastDigit extends number}`
      ? IncrementMap[LastDigit] extends infer Incremented extends number
        ? Number extends `${infer Rest}${LastDigit}`
          ? Incremented extends keyof LastDigitMap
            ? _Increment<Rest, `${LastDigitMap[Incremented]}${Result}`>
            : ParseNumber<`${Rest}${Incremented}${Result}`>
          : never
        : never
      : never;

/** -------------------------------------------------------
 * * ***Utility Type: `Increment`.***
 * -------------------------------------------------------
 * **Accepts an integer and returns the incremented value of it.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`
 * @template T - The input number to increment.
 * @example
 * ```ts
 * type Case1 = Increment<1>; // ➔ 2
 * type Case2 = Increment<-10>; // ➔ -9
 * ```
 */
export type Increment<T extends number> =
  IsNegative<T> extends true
    ? _Decrement<
        Stringify<Abs<T>>
      > extends infer NegativeIncrementResult extends number
      ? NegativeIncrementResult extends 0
        ? NegativeIncrementResult
        : Negate<NegativeIncrementResult>
      : never
    : _Increment<Stringify<T>>;
