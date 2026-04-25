import type { GetFloatNumberParts } from "./get-float-number-parts";
import type { Increment } from "./increment";
import type { IsFloat, IsNegative, Negate } from "./number";

/** -------------------------------------------------------
 * * ***Utility Type: `Floor`.***
 * -------------------------------------------------------
 * **Type-level equivalent of `Math.floor()`.**
 * - Returns the ***floored value*** of the passed number.
 * @template T - A number type.
 * @example
 * ```ts
 * type A = Floor<1.9>;  // ➔ 1
 * type B = Floor<-1.2>; // ➔ -2
 * type C = Floor<3>;    // ➔ 3
 * type D = Floor<-5>;   // ➔ -5
 * ```
 */
export type Floor<T extends number> =
  IsFloat<T> extends true
    ? GetFloatNumberParts<T> extends [infer Whole extends number, unknown]
      ? IsNegative<T> extends true
        ? Negate<Increment<Whole>>
        : Whole
      : never
    : T;
