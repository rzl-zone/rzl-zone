import type { Abs, IsFloat, ParseNumber } from "./number";
import type { ReplaceAll } from "./replace-all";
import type { Split } from "./split";
import type { Stringify } from "./stringify";

/** -------------------------------------------------------
 * * ***Utility Type: `DigitsTuple`.***
 * -------------------------------------------------------
 * **A **type-level utility** that converts a numeric literal (number or bigint) into
 * a structured representation of its digits.**
 * - **The resulting type is an **object** with the following properties:**
 *      - `negative`: boolean flag indicating if the number is negative.
 *      - `bigint`: boolean flag indicating if the value is a bigint.
 *      - `float`: boolean flag indicating if the value is a floating-point number.
 *      - `digits`: a tuple of digits (each as a `number`), with decimal points and
 *        bigint suffix `n` removed.
 * - **Works with:**
 *      - Positive integers
 *      - Negative integers
 *      - Zero and negative zero
 *      - Floating-point numbers (decimal points are ignored)
 *      - BigInt values
 * **Note:** TypeScript automatically normalizes scientific notation numeric literals
 * (e.g., `5e3` ➔ `5000`), so the `digits` tuple will reflect the expanded value.
 * @template T - A numeric literal type (`number` or `bigint`) to convert.
 * @example
 * ```ts
 * // Single digit
 * type A = DigitsTuple<1>;
 * // ➔ { negative: false; bigint: false; float: false; digits: [1] }
 *
 * // Positive integer
 * type B = DigitsTuple<123>;
 * // ➔ { negative: false; bigint: false; float: false; digits: [1, 2, 3] }
 *
 * // Negative integer
 * type C = DigitsTuple<-123>;
 * // ➔ { negative: true; bigint: false; float: false; digits: [1, 2, 3] }
 *
 * // Zero and negative zero (treated the same)
 * type D = DigitsTuple<0>;
 * // ➔ { negative: false; bigint: false; float: false; digits: [0] }
 * type E = DigitsTuple<-0>;
 * // ➔ { negative: false; bigint: false; float: false; digits: [0] }
 *
 * // Floating-point numbers
 * type F = DigitsTuple<0.123>;
 * // ➔ { negative: false; bigint: false; float: true; digits: [0, 1, 2, 3] }
 * type G = DigitsTuple<-0.123>;
 * // ➔ { negative: true; bigint: false; float: true; digits: [0, 1, 2, 3] }
 *
 * // BigInt values
 * type H = DigitsTuple<98765n>;
 * // ➔ { negative: false; bigint: true; float: false; digits: [9, 8, 7, 6, 5] }
 * type I = DigitsTuple<-98765n>;
 * // ➔ { negative: true; bigint: true; float: false; digits: [9, 8, 7, 6, 5] }
 *
 * // Scientific notation numeric literals (auto-expanded)
 * type J = DigitsTuple<5e3>; // `5e3` is same like `5000`
 * // ➔ { negative: false; bigint: false; float: false; digits: [5, 0, 0, 0] }
 * type K = DigitsTuple<-2.5e2>; // `-2.5e2` is same like `-250`
 * // ➔ { negative: true; bigint: false; float: true; digits: [2, 5, 0] }
 * ```
 */
export type DigitsTuple<T extends number | bigint> = {
  negative: `${T}` extends `-${string}` ? true : false;
  float: IsFloat<Extract<T, number>> extends true ? true : false;
  bigint: T extends bigint ? true : false;
  digits: Split<ReplaceAll<Stringify<Abs<T>>, [".", "n"], "">> extends infer R
    ? {
        [K in keyof R]: R[K] extends string ? ParseNumber<R[K]> : never;
      }
    : never;
};
