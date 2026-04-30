import type { Extends, IfExtends } from "./extends";
import type { If } from "./if";
import type { IfNot } from "./if-not";
import type { IsNever } from "./never";
import type { Not } from "./not";
import type { OrArr } from "./or";
import type { Repeat } from "./repeat";
import type { Trim } from "./trim";

/** -------------------------------------------------------
 * * ***Utility Type: `OddDigit`.***
 * -------------------------------------------------------
 * **A union of string literal digits considered ***odd***.**
 * - Includes: `"1" | "3" | "5" | "7" | "9"`.
 * @example
 * ```ts
 * type A = OddDigit; // ➔ "1" | "3" | "5" | "7" | "9"
 * ```
 */
export type OddDigit = "1" | "3" | "5" | "7" | "9";

/** -------------------------------------------------------
 * * ***Utility Type: `EvenDigit`.***
 * -------------------------------------------------------
 * **A union of string literal digits considered ***even***.**
 * - Includes: `"0" | "2" | "4" | "6" | "8"`.
 * @example
 * ```ts
 * type A = EvenDigit; // ➔ "0" | "2" | "4" | "6" | "8"
 * ```
 */
export type EvenDigit = "0" | "2" | "4" | "6" | "8";

/** -------------------------------------------------------
 * * ***Utility Type: `Integer`.***
 * -------------------------------------------------------
 * **A type-level utility that validates if `T` is an ***integer***.**
 * - **Behavior:**
 *      - Returns `T` if it is an integer.
 *      - Returns `never` if `T` is a ***float*** (decimal).
 * @template T - A number type to validate.
 * @example
 * ```ts
 * type A = Integer<42>;   // ➔ 42
 * type B = Integer<-10>;  // ➔ -10
 * type C = Integer<3.14>; // ➔ never
 * ```
 */
export type Integer<T extends number> = `${T}` extends `${string}.${string}`
  ? never
  : T;

/** -------------------------------------------------------
 * * ***Utility Type: `Float`.***
 * -------------------------------------------------------
 * **A type-level utility that validates if `T` is a ***float***.**
 * - **Behavior:**
 *      - Returns `T` if it is a float.
 *      - Returns `never` if `T` is an ***integer***.
 * @template T - A number type to validate.
 * @example
 * ```ts
 * type A = Float<3.14>; // ➔ 3.14
 * type B = Float<42>;   // ➔ never
 * ```
 */
export type Float<T extends number> = If<IsNever<Integer<T>>, T, never>;

/** -------------------------------------------------------
 * * ***Utility Type: `Negative`.***
 * -------------------------------------------------------
 * **Extracts `T` if it is ***negative***, otherwise `never`.**
 * @template T - A number type to check.
 * @example
 * ```ts
 * type A = Negative<-10>; // ➔ -10
 * type B = Negative<5>;   // ➔ never
 * type C = Negative<0>;   // ➔ never
 * ```
 */
export type Negative<T extends number> = `${T}` extends `-${string}`
  ? T
  : never;

/** -------------------------------------------------------
 * * ***Utility Type: `Positive`.***
 * -------------------------------------------------------
 * **Extracts `T` if it is ***positive*** (or zero), otherwise `never`.**
 * @template T - A number type to check.
 * @example
 * ```ts
 * type A = Positive<10>; // ➔ 10
 * type B = Positive<0>;  // ➔ 0
 * type C = Positive<-5>; // ➔ never
 * ```
 */
export type Positive<T extends number> = If<IsNever<Negative<T>>, T, never>;

/** -------------------------------------------------------
 * * ***Utility Type: `PositiveInteger`.***
 * -------------------------------------------------------
 * **Restricts `T` to ***positive integers*** only.**
 * @template T - A number type.
 * @example
 * ```ts
 * type A = PositiveInteger<42>;   // ➔ 42
 * type B = PositiveInteger<0>;    // ➔ 0
 * type C = PositiveInteger<-5>;   // ➔ never
 * type D = PositiveInteger<3.14>; // ➔ never
 * ```
 */
export type PositiveInteger<T extends number> = Positive<Integer<T>>;

/** -------------------------------------------------------
 * * ***Utility Type: `NegativeInteger`.***
 * -------------------------------------------------------
 * **Restricts `T` to ***negative integers*** only.**
 * @template T - A number type.
 * @example
 * ```ts
 * type A = NegativeInteger<-42>;   // ➔ -42
 * type B = NegativeInteger<5>;     // ➔ never
 * type C = NegativeInteger<-3.14>; // ➔ never
 * ```
 */
export type NegativeInteger<T extends number> = Negative<Integer<T>>;

/** -------------------------------------------------------
 * * ***Utility Type: `PositiveFloat`.***
 * -------------------------------------------------------
 * **Restricts `T` to ***positive floats*** only.**
 * @template T - A number type.
 * @example
 * ```ts
 * type A = PositiveFloat<3.14>; // ➔ 3.14
 * type B = PositiveFloat<-2.5>; // ➔ never
 * type C = PositiveFloat<5>;    // ➔ never
 * ```
 */
export type PositiveFloat<T extends number> = Positive<Float<T>>;

/** -------------------------------------------------------
 * * ***Utility Type: `NegativeFloat`.***
 * -------------------------------------------------------
 * **Restricts `T` to ***negative floats*** only.**
 * @template T - A number type.
 * @example
 * ```ts
 * type A = NegativeFloat<-3.14>; // ➔ -3.14
 * type B = NegativeFloat<2.5>;   // ➔ never
 * type C = NegativeFloat<-5>;    // ➔ never
 * ```
 */
export type NegativeFloat<T extends number> = Negative<Float<T>>;

/** -------------------------------------------------------
 * * ***Utility Type: `Even`.***
 * -------------------------------------------------------
 * **A type-level utility that extracts `T` if it is an ***even integer***.**
 * @template T - A number type to check.
 * @example
 * ```ts
 * type A = Even<0>;    // ➔ 0
 * type B = Even<4>;    // ➔ 4
 * type C = Even<5>;    // ➔ never
 * type D = Even<24>;   // ➔ 24
 * type E = Even<27>;   // ➔ never
 * type F = Even<3.14>; // ➔ never
 * ```
 */
export type Even<T extends number> = IfNot<
  IsNever<Integer<T>>,
  `${T}` extends `${string}${EvenDigit}` ? T : never,
  never
>;

/** -------------------------------------------------------
 * * ***Utility Type: `Odd`.***
 * -------------------------------------------------------
 * **A type-level utility that extracts `T` if it is an ***odd integer***.**
 * @template T - A number type to check.
 * @example
 * ```ts
 * type A = Odd<0>;   // ➔ never
 * type B = Odd<5>;   // ➔ 5
 * type C = Odd<4>;   // ➔ never
 * type D = Odd<23>;  // ➔ 23
 * type E = Odd<26>;  // ➔ never
 * type F = Odd<4.2>; // ➔ never
 * ```
 */
export type Odd<T extends number> = IfNot<
  IsNever<Integer<T>>,
  If<IsNever<Even<T>>, T, never>,
  never
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsInteger`.***
 * -------------------------------------------------------
 * **Whether `T` is an ***integer***.**
 * @example
 * ```ts
 * type A = IsInteger<-2>;   // ➔ true
 * type B = IsInteger<0>;    // ➔ true
 * type C = IsInteger<42>;   // ➔ true
 * type D = IsInteger<3.14>; // ➔ false
 * ```
 */
export type IsInteger<T extends number> = Not<IsNever<Integer<T>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsFloat`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***float***.**
 * @example
 * ```ts
 * type A = IsFloat<3.14>;  // ➔ true
 * type B = IsFloat<-3.14>; // ➔ true
 * type C = IsFloat<0>;     // ➔ false
 * type D = IsFloat<42>;    // ➔ false
 * type E = IsFloat<-42>;   // ➔ false
 * ```
 */
export type IsFloat<T extends number> = Not<IsNever<Float<T>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsEven`.***
 * -------------------------------------------------------
 * **Whether `T` is ***even***.**
 * @example
 * ```ts
 * type A = IsEven<0>;    // ➔ true
 * type B = IsEven<4>;    // ➔ true
 * type C = IsEven<5>;    // ➔ false
 * type D = IsEven<24>;   // ➔ true
 * type E = IsEven<27>;   // ➔ false
 * type F = IsEven<3.14>; // ➔ false
 * ```
 */
export type IsEven<T extends number> = If<
  IsInteger<T>,
  `${T}` extends `${string}${EvenDigit}` ? true : false
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsOdd`.***
 * -------------------------------------------------------
 * **Whether `T` is ***odd***.**
 * @example
 * ```ts
 * type A = IsEven<0>;    // ➔ false
 * type B = IsEven<4>;    // ➔ false
 * type C = IsEven<5>;    // ➔ true
 * type D = IsEven<24>;   // ➔ false
 * type E = IsEven<27>;   // ➔ true
 * type F = IsEven<3.14>; // ➔ true
 * ```
 */
export type IsOdd<T extends number> = If<IsInteger<T>, Not<IsEven<T>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsPositive`.***
 * -------------------------------------------------------
 * **Whether `T` is ***positive***.**
 * @example
 * ```ts
 * type A = IsPositive<10>;   // ➔ true
 * type B = IsPositive<0>;    // ➔ true
 * type C = IsPositive<-5>;   // ➔ false
 * type D = IsPositive<3.5>;  // ➔ true
 * type E = IsPositive<-3.5>; // ➔ false
 * ```
 */
export type IsPositive<T extends number> = Not<IsNever<Positive<T>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsNegative`.***
 * -------------------------------------------------------
 * **Whether `T` is ***negative***.**
 * @example
 * ```ts
 * type A = IsNegative<-10>;  // ➔ true
 * type B = IsNegative<5>;    // ➔ false
 * type C = IsNegative<0>;    // ➔ false
 * type D = IsPositive<3.5>;  // ➔ false
 * type E = IsPositive<-3.5>; // ➔ true
 * ```
 */
export type IsNegative<T extends number> = Not<IsNever<Negative<T>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsPositiveInteger`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***positive integer***.**
 * @example
 * ```ts
 * type A = IsPositiveInteger<42>;   // ➔ true
 * type B = IsPositiveInteger<0>;    // ➔ true
 * type C = IsPositiveInteger<-5>;   // ➔ false
 * type D = IsPositiveInteger<3.14>; // ➔ false
 * ```
 */
export type IsPositiveInteger<T extends number> = Not<
  IsNever<PositiveInteger<T>>
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsNegativeInteger`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***negative integer***.**
 * @example
 * ```ts
 * type A = IsNegativeInteger<-42>;   // ➔ true
 * type B = IsNegativeInteger<5>;     // ➔ false
 * type C = IsNegativeInteger<-3.14>; // ➔ false
 * ```
 */
export type IsNegativeInteger<T extends number> = Not<
  IsNever<NegativeInteger<T>>
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsPositiveFloat`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***positive float***.**
 * @example
 * ```ts
 * type A = IsPositiveFloat<3.14>; // ➔ true
 * type B = IsPositiveFloat<-2.5>; // ➔ false
 * type C = IsPositiveFloat<5>;    // ➔ false
 * ```
 */
export type IsPositiveFloat<T extends number> = Not<IsNever<PositiveFloat<T>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsNegativeFloat`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***negative float***.**
 * @example
 * ```ts
 * type A = IsNegativeFloat<-3.14>; // ➔ true
 * type B = IsNegativeFloat<2.5>;   // ➔ false
 * type C = IsNegativeFloat<-5>;    // ➔ false
 * ```
 */
export type IsNegativeFloat<T extends number> = Not<IsNever<NegativeFloat<T>>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfInteger`.***
 * -------------------------------------------------------
 * **Conditional: `If` branch if `T` is an ***integer***.**
 * @example
 * ```ts
 * type A = IfInteger<42>;                // ➔ true
 * type B = IfInteger<3.14>;              // ➔ false
 * type C = IfInteger<42, "yes", "no">;   // ➔ "yes"
 * type D = IfInteger<3.14, "yes", "no">; // ➔ "no"
 * ```
 */
export type IfInteger<T extends number, IfTrue = true, IfFalse = false> = If<
  IsInteger<T>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfFloat`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***float***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfFloat<3.14>;              // ➔ true
 * type B = IfFloat<42>;                // ➔ false
 * type C = IfFloat<3.14, "yes", "no">; // ➔ "yes"
 * type D = IfFloat<42, "yes", "no">;   // ➔ "no"
 * ```
 */
export type IfFloat<T extends number, IfTrue = true, IfFalse = false> = If<
  IsFloat<T>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfEven`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is ***even***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfEven<4>;                // ➔ true
 * type B = IfEven<5>;                // ➔ false
 * type C = IfEven<4, "even", "odd">; // ➔ "even"
 * type D = IfEven<5, "even", "odd">; // ➔ "odd"
 * ```
 */
export type IfEven<T extends number, IfTrue = true, IfFalse = false> = If<
  IsEven<T>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfOdd`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is ***odd***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfOdd<5>;                // ➔ true
 * type B = IfOdd<4>;                // ➔ false
 * type C = IfOdd<5, "odd", "even">; // ➔ "odd"
 * type D = IfOdd<4, "odd", "even">; // ➔ "even"
 * ```
 */
export type IfOdd<T extends number, IfTrue = true, IfFalse = false> = If<
  IsOdd<T>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfPositive`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is ***positive***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfPositive<10>;              // ➔ true
 * type B = IfPositive<-5>;              // ➔ false
 * type C = IfPositive<10, "yes", "no">; // ➔ "yes"
 * type D = IfPositive<-5, "yes", "no">; // ➔ "no"
 * ```
 */
export type IfPositive<T extends number, IfTrue = true, IfFalse = false> = If<
  IsPositive<T>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfNegative`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is ***negative***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfNegative<-10>;              // ➔ true
 * type B = IfNegative<5>;                // ➔ false
 * type C = IfNegative<-10, "yes", "no">; // ➔ "yes"
 * type D = IfNegative<5, "yes", "no">;   // ➔ "no"
 * ```
 */
export type IfNegative<T extends number, IfTrue = true, IfFalse = false> = If<
  IsNegative<T>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfPositiveInteger`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***positive integer***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfPositiveInteger<42>;              // ➔ true
 * type B = IfPositiveInteger<-5>;              // ➔ false
 * type C = IfPositiveInteger<42, "yes", "no">; // ➔ "yes"
 * type D = IfPositiveInteger<-5, "yes", "no">; // ➔ "no"
 * ```
 */
export type IfPositiveInteger<
  T extends number,
  IfTrue = true,
  IfFalse = false
> = If<IsPositiveInteger<T>, IfTrue, IfFalse>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfNegativeInteger`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***negative integer***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`) .
 * @example
 * ```ts
 * type A = IfNegativeInteger<-42>;              // ➔ true
 * type B = IfNegativeInteger<5>;                // ➔ false
 * type C = IfNegativeInteger<-42, "yes", "no">; // ➔ "yes"
 * type D = IfNegativeInteger<5, "yes", "no">;   // ➔ "no"
 * ```
 */
export type IfNegativeInteger<
  T extends number,
  IfTrue = true,
  IfFalse = false
> = If<IsNegativeInteger<T>, IfTrue, IfFalse>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfPositiveFloat`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***positive float***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfPositiveFloat<3.14>;              // ➔ true
 * type B = IfPositiveFloat<-2.5>;              // ➔ false
 * type C = IfPositiveFloat<3.14, "yes", "no">; // ➔ "yes"
 * type D = IfPositiveFloat<-2.5, "yes", "no">; // ➔ "no"
 * ```
 */
export type IfPositiveFloat<
  T extends number,
  IfTrue = true,
  IfFalse = false
> = If<IsPositiveFloat<T>, IfTrue, IfFalse>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfNegativeFloat`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***negative float***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfNegativeFloat<-3.14>;              // ➔ true
 * type B = IfNegativeFloat<2.5>;                // ➔ false
 * type C = IfNegativeFloat<-3.14, "yes", "no">; // ➔ "yes"
 * type D = IfNegativeFloat<2.5, "yes", "no">;   // ➔ "no"
 * ```
 */
export type IfNegativeFloat<
  T extends number,
  IfTrue = true,
  IfFalse = false
> = If<IsNegativeFloat<T>, IfTrue, IfFalse>;

/** -------------------------------------------------------
 * * ***Utility Type: `ParseNumber`.***
 * --------------------------------------------------------
 * **Converts a string or property key literal into a ***number literal***.**
 * - **Behavior:**
 *      - Supports decimal numbers only.
 *      - Automatically trims whitespace.
 *      - Returns the number literal if valid.
 *      - Supports scientific notation strings (e.g., `"2e-3"`, `"-5e2"`, `"2E-3"`, `"-5E2"`).
 *        - **Note:**
 *            - TypeScript cannot represent very small (`< 1e-6`) or very large (`> 1e15`)
 *              numbers as literal types:
 *              - In such cases, scientific notation strings return `0`.
 *      - Returns `0` for strings representing hexadecimal (`0x...`), octal (`0o...`), or
 *        binary (`0b...`) if they are string literals.
 * - Returns `never` for non-numeric strings or unsupported formats.
 * @template T - A string, number, or symbol (property key).
 * @example
 * ```ts
 * // Number:
 * type A = ParseNumber<0>;     // ➔ 0
 * type B = ParseNumber<-0>;    // ➔ 0
 * type C = ParseNumber<-0.>;   // ➔ 0
 * type D = ParseNumber<42>;    // ➔ 42
 * type E = ParseNumber<0.42>;  // ➔ 0.42
 * type F = ParseNumber<-5>;    // ➔ -5
 * type G = ParseNumber<-2.5>;  // ➔ -2.5
 * type H = ParseNumber<2.5e3>; // ➔ 2500
 * type I = ParseNumber<-2.5e3>;// ➔ -2500
 * type J = ParseNumber<5e3>;   // ➔ 5000
 * type K = ParseNumber<-5e3>;  // ➔ -5000
 * type L = ParseNumber<5e21>;  // ➔ 5e+21
 * type M = ParseNumber<5e-3>;  // ➔ 0.005
 * type N = ParseNumber<5e-21>; // ➔ 5e-21
 * type O = ParseNumber<-5e-3>; // ➔ -0.005
 *
 * // Numeric String:
 * type A = ParseNumber<"0">;     // ➔ 0
 * type B = ParseNumber<"-0">;    // ➔ 0
 * type C = ParseNumber<"42">;    // ➔ 42
 * type D = ParseNumber<"0.42">;  // ➔ 0.42
 * type E = ParseNumber<"-42">;   // ➔ -42
 * type F = ParseNumber<"-0.42">; // ➔ -0.42
 * type G = ParseNumber<" 42 ">;  // ➔ 42
 * type H = ParseNumber<" -42 ">; // ➔ -1
 *
 * // Scientific notation string:
 * type S1 = ParseNumber<"2e3">;    // ➔  2000
 * type S2 = ParseNumber<"-2e3">;   // ➔  -2000
 * type S3 = ParseNumber<"2e-3">;   // ➔  0.002
 * type S4 = ParseNumber<"-2e-3">;  // ➔  -0.002
 * type S5 = ParseNumber<"2.5e3">;  // ➔  0
 * type S6 = ParseNumber<"2.5e-3">; // ➔  0
 * type S7 = ParseNumber<"2e-7">;   // ➔  0 (too small include "-2e-7" for TypeScript literal)
 * type S8 = ParseNumber<"5e21">;   // ➔  0 (too large include "-5e21" for TypeScript literal)
 *
 * // Number representing hexadecimal, octal or binary:
 * type A = ParseNumber<"011">;    // ➔ 9 (same as octal but deprecated)
 * type B = ParseNumber<"0o11">;   // ➔ 9 (octal)
 * type C = ParseNumber<"-0o11">;  // ➔ -9 (octal)
 * type D = ParseNumber<"0x12">;   // ➔ 18 (hexadecimal)
 * type E = ParseNumber<"-0x12">;  // ➔ -18 (hexadecimal)
 * type F = ParseNumber<"0b111">;  // ➔ 7 (binary)
 * type G = ParseNumber<"-0b111">; // ➔ -7 (binary)
 *
 * // String representing hexadecimal, octal or binary:
 * type A = ParseNumber<"0x2A">;     // ➔ 0 (hex on string not supported)
 * type B = ParseNumber<"0o52">;     // ➔ 0 (octal on string not supported)
 * type C = ParseNumber<"0b101010">; // ➔ 0 (binary on string not supported)
 *
 * // Never Result
 * type A = ParseNumber<string>; // ➔ never
 * type B = ParseNumber<number>; // ➔ never
 * type C = ParseNumber<"abc">;  // ➔ never
 * type D = ParseNumber<"a1">;   // ➔ never
 * type E = ParseNumber<"3b">;   // ➔ never
 * ```
 */
export type ParseNumber<T extends PropertyKey | bigint> = T extends bigint
  ? T
  : If<
      number extends T ? false : true,
      IfExtends<
        OrArr<
          [
            Extends<"-0", Trim<Extract<T, PropertyKey>>>,
            Extends<-0, T>,
            Extends<T, `${"-" | ""}${"0"}.`>
          ]
        >,
        true,
        0,
        T extends `${"-" | ""}0${"x" | "b" | "o"}${number}`
          ? 0
          : Trim<
                Extract<T, PropertyKey>
              > extends `${infer NumT extends number | string}`
            ? T extends `${infer N extends number}.`
              ? N
              : NumT extends string
                ? ParseScientificNumber<NumT>
                : NumT
            : Trim<Extract<T, PropertyKey>> extends number
              ? T
              : never
      >,
      never
    >;

/** -------------------------------------------------------
 * * ***Utility Type: `IsScientificNumber`.***
 * -------------------------------------------------------
 * **Checks if a string literal `T` represents a **scientific number**.**
 * - **A scientific number is defined as a number in the form of:**
 *      - Optional negative sign (`-`).
 *      - Mantissa (digits, can be integer or decimal).
 *      - Exponent indicated by `e` or `E`.
 *      - Exponent value (digits, optional negative sign).
 *      - **Important:**
 *         - TypeScript cannot detect numeric literals in scientific notation
 *            at type-level because number literals are normalized to decimals:
 *            - Only string literals like `"2.5E3"` or `"-1e-5"` can be detected.
 * @template T - A string literal to check.
 * @example
 * ```ts
 * type A = IsScientificNumber<"1e5">;   // ➔ true
 * type B = IsScientificNumber<"-1e-5">; // ➔ true
 * type C = IsScientificNumber<"2.5E3">; // ➔ true
 * type D = IsScientificNumber<"42">;    // ➔ false
 * type E = IsScientificNumber<"-0.42">; // ➔ false
 * type F = IsScientificNumber<string>;  // ➔ false
 * ```
 * @remarks
 * - Uses template literal types and conditional type {@link Extends | **`Extends`**}.
 * - Returns `true` if `T` is scientific number string literal, otherwise `false`.
 * - Returns `boolean` if `T` is generic `string`.
 */
export type IsScientificNumber<T extends string> = Extends<
  T,
  `${"-" | ""}${number}${"e" | "E"}${number}`
>;

/** * ***Helper for {@link ParseScientificNumber | **`ParseScientificNumber`**}.***
 *
 */
type BuildTuple<
  L extends number,
  T extends unknown[] = []
> = T["length"] extends L ? T : BuildTuple<L, [...T, unknown]>;
/** * ***Helper for {@link ParseScientificNumber | **`ParseScientificNumber`**}.***
 *
 */
type _DecrementParseScientific<N extends number> =
  BuildTuple<N> extends [infer _, ...infer Rest] ? Rest["length"] : never;

/** -------------------------------------------------------
 * * ***Utility Type: `ParseScientificNumber`.***
 * -------------------------------------------------------
 * **Converts a numeric string in scientific notation (e.g., `"2e-3"`, `"-5e2"`)
 * into a literal number type.**
 * - **Important:**
 *      - TypeScript cannot represent very small or very large numbers
 *        as literal types:
 *        - In such cases, this utility will return `0`.
 * @template T - A numeric string to parse. Can be in:
 * - Positive or negative scientific notation (e.g., `"1e3"`, `"-2e-2"`).
 * - Regular number literal (e.g., `"42"`, `"-5"`).
 * @example
 * ```ts
 * type A1 = ParseScientificNumber<"2e-3">;  // ➔ 0.002
 * type A2 = ParseScientificNumber<"-2e-3">; // ➔ -0.002
 * type A3 = ParseScientificNumber<"5e2">;   // ➔ 500
 * type A4 = ParseScientificNumber<"-5e2">;  // ➔ -500
 * type A5 = ParseScientificNumber<"2e-7">;  // ➔ 0 (TypeScript cannot represent literal)
 * type A6 = ParseScientificNumber<"5e21">;  // ➔ 0 (TypeScript cannot represent literal)
 * type A7 = ParseScientificNumber<"42">;    // ➔ 42
 * type A8 = ParseScientificNumber<"-42">;   // ➔ -42
 * ```
 * @remarks
 * - Uses type-level string manipulation to handle scientific notation.
 * - Negative exponents are adjusted with {@link _DecrementParseScientific | **`_DecrementParseScientific`**} and
 *  {@link Repeat | **`Repeat`**}.
 * - Returns `0` if TypeScript cannot infer the exact numeric literal.
 */
export type ParseScientificNumber<T extends string> =
  T extends `-${infer Mantissa}${"e" | "E"}-${infer Exp extends number}`
    ? `-${"0."}${Repeat<
        "0",
        _DecrementParseScientific<Exp>
      >}${Mantissa}` extends `${infer N extends number}`
      ? number extends N
        ? 0
        : N
      : never
    : T extends `${infer Mantissa}${"e" | "E"}-${infer Exp extends number}`
      ? `0.${Repeat<
          "0",
          _DecrementParseScientific<Exp>
        >}${Mantissa}` extends `${infer N extends number}`
        ? number extends N
          ? 0
          : N
        : never
      : T extends `-${infer Mantissa}${"e" | "E"}${infer Exp extends number}`
        ? `-${Mantissa}${Repeat<"0", Exp>}` extends `${infer N extends number}`
          ? number extends N
            ? 0
            : N
          : never
        : T extends `${infer Mantissa}${"e" | "E"}${infer Exp extends number}`
          ? `${Mantissa}${Repeat<"0", Exp>}` extends `${infer N extends number}`
            ? number extends N
              ? 0
              : N
            : never
          : T extends `${infer N extends number}`
            ? number extends N
              ? 0
              : N
            : never;

/** -------------------------------------------------------
 * * ***Utility Type: `Abs`.***
 * -------------------------------------------------------
 * **Computes the ***absolute value*** of `T`.**
 * - **Behavior:**
 *      - Accepts `number` literals or numeric `string` literals.
 *      - Returns the ***absolute value*** as a `number`.
 *      - If `T` is not a valid number, ***`like`***:
 *        - `hex`, `binary`, `octal`, or `non-numeric string` will return `never`.
 * @template T - A number type or string literal representing a number.
 * @example
 * ```ts
 * type A = Abs<-42>;   // ➔ 42
 * type B = Abs<10>;    // ➔ 10
 * type C = Abs<"11">;  // ➔ 11
 * type D = Abs<"-11">; // ➔ 11
 *
 * // Not a number
 * type Invalid1 = Abs<"1a">;    // ➔ never
 * type Invalid2 = Abs<"a1">;    // ➔ never
 * type Invalid3 = Abs<"a1a">;   // ➔ never
 * type Invalid4 = Abs<"abc">;   // ➔ never
 * type Invalid5 = Abs<string>;  // ➔ never
 * type Invalid6 = Abs<number>;  // ➔ never
 * ```
 */
export type Abs<T extends PropertyKey | bigint> = `${Exclude<
  T,
  symbol
>}` extends `-${infer PositiveT extends number}`
  ? ParseNumber<PositiveT>
  : ParseNumber<T>;

/** -------------------------------------------------------
 * * ***Utility Type: `Negate`.***
 * -------------------------------------------------------
 * **Produces the ***negated value*** of `T` (multiplies by `-1`).**
 * - **Behavior:**
 *      - Only supports valid **number literals** or **numeric-strings**.
 *      - Invalid numeric-strings (***like***: `"1a"`, `"abc"`, `hex`, `binary`, `octal`)
 *        or `non-numeric` types, ***`like`***:
 *        - `string`, `number`, `symbol` will return `0`.
 * @template T - A number type or numeric-string.
 * @example
 * ```ts
 * type A = Negate<5>;     // ➔ -5
 * type B = Negate<-10>;   // ➔ -10
 * type C = Negate<0>;     // ➔ 0
 * type D = Negate<-0>;    // ➔ 0
 * type E = Negate<"123">; // ➔ -123
 *
 * // Not a number or numeric-string:
 * type Invalid1 = Negate<string>;  // ➔ 0
 * type Invalid2 = Negate<number>;  // ➔ 0
 * type Invalid3 = Negate<"abc">;   // ➔ 0
 * type Invalid4 = Negate<"1a">;    // ➔ 0
 * type Invalid5 = Negate<"2b">;    // ➔ 0
 * type Invalid6 = Negate<"0x1f">;  // ➔ 0
 * type Invalid7 = Negate<"0b101">; // ➔ 0
 * type Invalid8 = Negate<"0o77">;  // ➔ 0
 * ```
 */
export type Negate<T extends PropertyKey> =
  ParseNumber<`-${Abs<ParseNumber<T>>}`>;
