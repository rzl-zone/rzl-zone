import type { Extends } from "./extends";
import type { If } from "./if";
import type { IsBaseType } from "./is-base-type";
import type { Not } from "./not";
import type { Or, OrArr } from "./or";
import type { ReplaceAll } from "./replace-all";
import type { CompareStringLength, StringLength } from "./string-length";
import type { Stringify } from "./stringify";

/** -------------------------------------------------------
 * * ***Type Options for {@link NumberLength | **`NumberLength`**}.***
 */
export type TypeNumberLengthOptions = {
  /** * ***Removes the leading minus `-` from negative numbers, default: `true`.***
   *
   * @default true
   */
  stripSign?: boolean;
  /** * ***Removes the decimal point `.` from floats, default: `true`.***
   *
   * @default true
   */
  stripDot?: boolean;
  /** * ***Removes the trailing `n` from BigInt literals, default: `true`.***
   *
   * @default true
   */
  stripBigInt?: boolean;
};

/** -------------------------------------------------------
 * * ***Default options for {@link NumberLength | **`NumberLength`**} (all `true`).***
 */
export type DefaultNumberLengthOptions = {
  stripSign: true;
  stripDot: true;
  stripBigInt: true;
};

/** -------------------------------------------------------
 * * ***Merge provided options with defaults for {@link NumberLength | **`NumberLength`**}.***
 */
type MergeOptions<Opts extends TypeNumberLengthOptions> = {
  [K in keyof DefaultNumberLengthOptions]: K extends keyof Opts
    ? Opts[K]
    : DefaultNumberLengthOptions[K];
};

/** -------------------------------------------------------
 * * ***Utility Type: `NumberLength`.***
 * -------------------------------------------------------
 * **A type-level utility that returns the **number of digits/characters**
 * of a numeric literal type, with optional cleaning.**
 * - **Supports:**
 *      - Integers (positive & negative).
 *      - Floats (`.` optionally removed).
 *      - Scientific notation (`e`/`E`, TypeScript normalizes to number).
 *      - BigInts (`n` suffix optionally removed).
 * @template T - A numeric literal (`number` or `bigint`).
 * @template Options - Optional configuration (default: all `true`):
 * - `stripSign` ➔ Removes the leading `-` (default `true`).
 * - `stripDot` ➔ Removes the decimal point `.` (default `true`).
 * - `stripBigInt` ➔ Removes trailing `n` (default `true`).
 * @example
 * **✅ Valid Examples:**
 * ```ts
 * // Integers
 * type A = NumberLength<100>;  // ➔ 3
 * type B = NumberLength<-100>; // ➔ 3 (minus stripped by default)
 * type C = NumberLength<-100, { stripSign: false }>; // ➔ 4 (minus kept)
 *
 * // Floats
 * type D = NumberLength<0.25>;  // ➔ 2 (dot removed)
 * type E = NumberLength<-0.25>; // ➔ 2 (minus & dot removed)
 * type F = NumberLength<12.34, { stripDot: false }>; // ➔ 5 (12.34)
 *
 * // Scientific notation
 * type G = NumberLength<5e4>;  // ➔ 5 (50000)
 * type H = NumberLength<-5e4>; // ➔ 5 (-50000, minus stripped)
 * type I = NumberLength<-5e4,{ stripSign:false }>; // ➔ 6 (-50000, minus not stripped)
 *
 * // BigInts
 * type J = NumberLength<12n>;    // ➔ 2
 * type K = NumberLength<-2125n>; // ➔ 4 (- & n removed)
 * type L = NumberLength<-2125n, { stripSign: false }>;
 * // ➔ 5 (minus kept)
 * type M = NumberLength<123n, { stripBigInt: false }>;
 * // ➔ 4 (123n)
 * type N = NumberLength<-123n, { stripBigInt: false, stripSign: false }>;
 * // ➔ 5 (minus & n kept ➔ -123n)
 * ```
 * ---
 * **❌ Invalid Examples:**
 * ```ts
 * type Invalid1 = NumberLength<string>;   // ➔ never
 * type Invalid2 = NumberLength<boolean>;  // ➔ never
 * type Invalid3 = NumberLength<"123">;    // ➔ never (string literal)
 * type Invalid4 = NumberLength<number>;   // ➔ never (not literal)
 * type Invalid5 = NumberLength<bigint>;   // ➔ never (not literal)
 * type Invalid6 = NumberLength<any>;      // ➔ never
 * type Invalid7 = NumberLength<unknown>;  // ➔ never
 * type Invalid8 = NumberLength<never>;    // ➔ never
 * ```
 * ---
 * @remarks
 * - Uses type-level string manipulation to "clean" numeric literal according to options.
 * - Removes `-`, `.`, or `n` if corresponding option is true.
 * - Works reliably for literal numbers, floats, and BigInt.
 * - Scientific notation is normalized by TypeScript, so `5e4` becomes `50000`.
 */
export type NumberLength<
  T extends number | bigint,
  Options extends Partial<TypeNumberLengthOptions> = DefaultNumberLengthOptions
> =
  If<
    OrArr<[IsBaseType<T>, Extends<T, string>, Not<Extends<T, number | bigint>>]>
  > extends true
    ? never
    : StringLength<
        ReplaceAll<
          Stringify<T>,
          [
            MergeOptions<Options>["stripSign"] extends true ? "-" : "",
            MergeOptions<Options>["stripDot"] extends true ? "." : "",
            MergeOptions<Options>["stripBigInt"] extends true ? "n" : ""
          ],
          ""
        >
      >;

/** -------------------------------------------------------
 * * ***Utility Type: `CompareNumberLength`.***
 * -------------------------------------------------------
 * **Compares the **number of digits** of two numeric literal types.**
 * - **Returns:**
 *      - `IfNum1Shorter` if the first number has fewer digits than the second (default: `never`).
 *      - `IfNum2Shorter` if the second number has fewer digits than the first (default: `never`).
 *      - `IfEqual` if both numbers have the same number of digits (default: `never`).
 * - **Important:**
 *      - This utility only works with **literal numbers**.
 *      - Using non-literal numbers (`number`) will return `never`.
 * @template Num1 - The first number literal to compare.
 * @template Num2 - The second number literal to compare.
 * @template IfNum1Shorter - Return type if the first number is shorter (default: `never`).
 * @template IfNum2Shorter - Return type if the second number is shorter (default: `never`).
 * @template IfEqual - Return type if both numbers have the same length (default: `never`).
 * @example
 * ```ts
 * // First number shorter than second
 * type Case1 = CompareNumberLength<1, 12, 'first shorter'>;
 * // ➔ 'first shorter'
 *
 * // First number longer than second
 * type Case2 = CompareNumberLength<123, 12, 'first shorter', 'first longer'>;
 * // ➔ 'first longer'
 *
 * // Both numbers have equal length
 * type Case3 = CompareNumberLength<12, 12, 'first shorter', 'first longer', 'equal'>;
 * // ➔ 'equal'
 *
 * // Defaults (no custom return types)
 * type Case4 = CompareNumberLength<1, 12>;
 * // ➔ never
 *
 * // Non-literal numbers
 * type NumA = number;
 * type NumB = 12;
 * type Case4 = CompareNumberLength<NumA, NumB, 'first shorter', 'first longer', 'equal'>;
 * // ➔ never
 * ```
 * ---
 * @remarks
 * - Internally uses {@link Stringify | **`Stringify`**} and {@link CompareStringLength | **`CompareStringLength`**}.
 * - Works for `positive`, `negative`, and `floating-point literal numbers`.
 */
export type CompareNumberLength<
  Num1 extends number,
  Num2 extends number,
  IfNum1Shorter = never,
  IfNum2Shorter = never,
  IfEqual = never
> =
  If<Or<Extends<number, Num1>, Extends<number, Num2>>> extends true
    ? never
    : CompareStringLength<
        Stringify<Num1>,
        Stringify<Num2>,
        IfNum1Shorter,
        IfNum2Shorter,
        IfEqual
      >;

/** -------------------------------------------------------
 * * ***Utility Type: `IsShorterNumber`.***
 * -------------------------------------------------------
 * **Compares the number of digits of two numeric literal types and returns a **boolean**.**
 * - **Returns:**
 *      - `true` if the first number has fewer digits than the second.
 *      - `false` otherwise (including when numbers have equal length).
 * - **Important:**
 *      - This utility only works with **literal numbers**.
 *      - Using non-literal numbers (`number`) will return `never`.
 * @template Num1 - The first number literal to compare.
 * @template Num2 - The second number literal to compare.
 * @example
 * ```ts
 * // Literal numbers
 * type Case1 = IsShorterNumber<1, 10>;
 * // ➔ true
 *
 * type Case2 = IsShorterNumber<100, 10>;
 * // ➔ false
 *
 * type Case3 = IsShorterNumber<12, 12>;
 * // ➔ false
 *
 * // Non-literal numbers
 * type NumA = number;
 * type NumB = 12;
 * type Case4 = IsShorterNumber<NumA, NumB>;
 * // ➔ never
 * ```
 * ---
 * @remarks
 * - Internally uses {@link CompareNumberLength | **`CompareNumberLength`**}.
 * - Works for `positive`, `negative`, and `floating-point literal numbers`.
 */
export type IsShorterNumber<
  Num1 extends number,
  Num2 extends number
> = CompareNumberLength<Num1, Num2, true, false, false>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsLongerNumber`.***
 * -------------------------------------------------------
 * **Compares the number of digits of two numeric literal types and returns a **boolean**.**
 * - **Returns:**
 *      - `true` if the first number has more digits than the second.
 *      - `false` otherwise (including when numbers have equal length).
 * - **Important:**
 *      - Only works with **literal numbers**.
 *      - Non-literal numbers (`number`) return `never`.
 * @template Num1 - The first number literal to compare.
 * @template Num2 - The second number literal to compare.
 * @example
 * ```ts
 * type Case1 = IsLongerNumber<10, 1>;
 * // ➔ true
 *
 * type Case2 = IsLongerNumber<10, 100>;
 * // ➔ false
 *
 * type Case3 = IsLongerNumber<12, 12>;
 * // ➔ false
 *
 * // Non-literal numbers
 * type NumA = number;
 * type NumB = 12;
 * type Case4 = IsLongerNumber<NumA, NumB>;
 * // ➔ never
 * ```
 * ---
 * @remarks
 * - Internally uses {@link CompareNumberLength | **`CompareNumberLength`**}.
 * - Works for `positive`, `negative`, and `floating-point literal numbers`.
 */
export type IsLongerNumber<
  Num1 extends number,
  Num2 extends number
> = CompareNumberLength<Num1, Num2, false, true, false>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsSameLengthNumber`.***
 * -------------------------------------------------------
 * **Compares the number of digits of two numeric literal types and returns a **boolean**.**
 * - **Returns:**
 *      - `true` if the numbers have the same number of digits.
 *      - `false` otherwise.
 * - **Important:**
 *      - Only works with **literal numbers**.
 *      - Non-literal numbers (`number`) return `never`.
 * @template Num1 - The first number literal to compare.
 * @template Num2 - The second number literal to compare.
 * @example
 * ```ts
 * type Case1 = IsSameLengthNumber<10, 10>;
 * // ➔ true
 *
 * type Case2 = IsSameLengthNumber<10, 100>;
 * // ➔ false
 *
 * // Non-literal numbers
 * type NumA = number;
 * type NumB = 12;
 * type Case3 = IsSameLengthNumber<NumA, NumB>;
 * // ➔ never
 * ```
 * ---
 * @remarks
 * - Internally uses {@link CompareNumberLength | **`CompareNumberLength`**}.
 * - Works for `positive`, `negative`, and `floating-point literal numbers`.
 */
export type IsSameLengthNumber<
  Num1 extends number,
  Num2 extends number
> = CompareNumberLength<Num1, Num2, false, false, true>;
