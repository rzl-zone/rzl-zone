import type { And } from "./and";
import type { Decrement } from "./decrement";
import type { IfEqual, IsEqual, IsNotEqual } from "./equal";
import type { IfGreaterThan } from "./greater-than";
import type { If } from "./if";
import type { Increment } from "./increment";
import type { IsLowerThan } from "./lower-than";
import type { Multi } from "./multi";
import type { IsNever } from "./never";
import type {
  Abs,
  IsNegative,
  IsPositive,
  Negate,
  ParseNumber
} from "./number";
import type { Or } from "./or";
import type { IsEmptyString } from "./string";
import type { Stringify } from "./stringify";
import type { Sub } from "./sub";

type _FindQuotient<
  Dividend extends number,
  Divisor extends number,
  CurrentQuotient extends number
> =
  Multi<Divisor, CurrentQuotient> extends infer Product extends number
    ? IsEqual<Dividend, Product> extends true
      ? CurrentQuotient
      : IsLowerThan<Dividend, Product> extends true
        ? _FindQuotient<Dividend, Divisor, Decrement<CurrentQuotient>>
        : CurrentQuotient
    : never;

type _Div<
  Dividend extends string,
  Divisor extends number,
  Result extends string = "",
  CurrentDividend extends string = "",
  IterationsWithoutDivision extends number = 0,
  HadFirstDivision extends boolean = false
> =
  Or<
    IsEmptyString<CurrentDividend>,
    IsLowerThan<ParseNumber<CurrentDividend>, Divisor>
  > extends true
    ? IsEmptyString<Dividend> extends true
      ? ParseNumber<
          If<
            And<HadFirstDivision, IsNotEqual<IterationsWithoutDivision, 0>>,
            `${Result}0`,
            Result
          >
        >
      : Dividend extends `${infer FirstDigit extends string}${infer Rest extends string}`
        ? _Div<
            Rest,
            Divisor,
            If<
              And<HadFirstDivision, IsNotEqual<IterationsWithoutDivision, 0>>,
              `${Result}0`,
              Result
            >,
            IfEqual<
              CurrentDividend,
              "0",
              FirstDigit,
              `${CurrentDividend}${FirstDigit}`
            >,
            Increment<IterationsWithoutDivision>,
            HadFirstDivision
          >
        : never
    : _FindQuotient<
          ParseNumber<CurrentDividend>,
          Divisor,
          10
        > extends infer Quotient extends number
      ? IsNever<Quotient> extends true
        ? ParseNumber<Result>
        : Sub<
              ParseNumber<CurrentDividend>,
              Multi<Quotient, Divisor>
            > extends infer Remainder extends number
          ? _Div<
              Dividend,
              Divisor,
              `${Result}${Quotient}`,
              IfGreaterThan<Remainder, 0, `${Remainder}`, "">,
              0,
              true
            >
          : never
      : never;

/** -------------------------------------------------------
 * * ***Utility Type: `Div`.***
 * -------------------------------------------------------
 * **A type-level utility that returns the integer division of two numbers.
 * Handles negative numbers correctly and returns `never` if dividing by zero.**
 * - **Behavior:**
 *      - Returns `0` if the absolute value of dividend is smaller than divisor.
 *      - Preserves the sign according to standard integer division rules.
 * @template Dividend - The dividend number.
 * @template Divisor - The divisor number.
 * @example
 * ```ts
 * type A = Div<10, 2>;  // ➔ 5
 * type B = Div<7, 3>;   // ➔ 2
 * type C = Div<-7, 3>;  // ➔ -2
 * type D = Div<7, -3>;  // ➔ -2
 * type E = Div<-7, -3>; // ➔ 2
 * type F = Div<2, 5>;   // ➔ 0
 * type G = Div<0, 5>;   // ➔ 0
 * type H = Div<5, 0>;   // ➔ never
 * ```
 */
export type Div<Dividend extends number, Divisor extends number> =
  IsEqual<Divisor, 0> extends true
    ? never
    : IsEqual<Dividend, 0> extends true
      ? 0
      : IsEqual<Dividend, Divisor> extends true
        ? 1
        : IsLowerThan<Abs<Dividend>, Abs<Divisor>> extends true
          ? 0
          : _Div<
                Stringify<Abs<Dividend>>,
                Abs<Divisor>
              > extends infer Quotient extends number
            ? If<
                Or<
                  And<IsNegative<Dividend>, IsNegative<Divisor>>,
                  And<IsPositive<Dividend>, IsPositive<Divisor>>
                >,
                Quotient,
                Negate<Quotient>
              >
            : never;
