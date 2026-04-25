import type { GetFloatNumberParts } from "./get-float-number-parts";
import type { IsFloat } from "./number";
import type { FirstDigit } from "./first-digit";
import type { IsGreaterThan } from "./greater-than";
import type { Increment } from "./increment";

/** -------------------------------------------------------
 * * ***Utility Type: `Round`.***
 * -------------------------------------------------------
 * **Type-level version of `Math.round()`.
 * Returns the value of a number rounded to the **nearest integer**.**
 * - **Behavior:**
 *      - If `T` is a float, it rounds to the nearest whole number:
 *        - Fraction `≥ 0.5` ➔ rounds up.
 *        - Fraction `< 0.5` ➔ rounds down.
 *      - If `T` is already an integer, it returns `T` as-is.
 * @template T - The number type to round.
 * @example
 * ```ts
 * // Positive float
 * type T0 = Round<3.14>;
 * // ➔ 3
 *
 * // Negative float
 * type T1 = Round<-3.14>;
 * // ➔ -3
 *
 * // Fraction ≥ 0.5
 * type T2 = Round<2.6>;
 * // ➔ 3
 *
 * // Already integer
 * type T3 = Round<5>;
 * // ➔ 5
 * ```
 */
export type Round<T extends number> =
  IsFloat<T> extends true
    ? GetFloatNumberParts<T> extends [
        infer Whole extends number,
        infer Fraction extends number
      ]
      ? IsGreaterThan<FirstDigit<Fraction>, 4> extends true
        ? Increment<Whole>
        : Whole
      : never
    : T;
