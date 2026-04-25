import type { Increment } from "./increment";
import type { IsFloat, IsNegative, Negate } from "./number";
import type { GetFloatNumberParts } from "./get-float-number-parts";

/** -------------------------------------------------------
 * * ***Utility Type: `Ceil`.***
 * -------------------------------------------------------
 * **A type-level utility that computes the **mathematical ceiling**
 * of a numeric literal type `T`, type version of `Math.ceil()`.**
 * - **Behavior:**
 *      - If `T` is an integer, it returns `T` unchanged.
 *      - If `T` is a positive float, it rounds up to the nearest integer.
 *      - If `T` is a negative float, it rounds up toward zero.
 * @template T - A number literal type.
 * @example
 * ```ts
 * type A = Ceil<1.2>;  // ➔ 2
 * type B = Ceil<1.9>;  // ➔ 2
 * type C = Ceil<5>;    // ➔ 5
 * type D = Ceil<-1.2>; // ➔ -1
 * type E = Ceil<-1.9>; // ➔ -1
 * type F = Ceil<-5>;   // ➔ -5
 * ```
 */
export type Ceil<T extends number> =
  IsFloat<T> extends true
    ? GetFloatNumberParts<T> extends [infer Whole extends number, unknown]
      ? IsNegative<T> extends true
        ? Negate<Whole>
        : Increment<Whole>
      : never
    : T;
