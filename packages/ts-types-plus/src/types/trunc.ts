import type { GetFloatNumberParts } from "./get-float-number-parts";
import type { IsFloat, IsNegative, Negate } from "./number";

/** -------------------------------------------------------
 * * ***Utility Type: `Trunc`.***
 * -------------------------------------------------------
 * **Type version of `Math.trunc()`.**
 * @description
 * Returns the **integer part** of a number by removing any fractional digits.
 * - **Behavior:**
 *      - If `T` is a floating-point number, returns the integer part.
 *      - Preserves the sign for negative numbers.
 *      - If `T` is already an integer, returns `T`.
 *      - If `T` is `number` (general type), returns `T`.
 * @template T - The number type to truncate.
 * @example
 * ```ts
 * // Positive float
 * type T0 = Trunc<3.14>;
 * // ➔ 3
 *
 * // Negative float
 * type T1 = Trunc<-3.14>;
 * // ➔ -3
 *
 * // Already integer
 * type T2 = Trunc<42>;
 * // ➔ 42
 *
 * // General number type
 * type T3 = Trunc<number>;
 * // ➔ number
 * ```
 */
export type Trunc<T extends number> = number extends T
  ? T
  : IsFloat<T> extends true
    ? GetFloatNumberParts<T>[0] extends infer IntegerPart extends number
      ? IsNegative<T> extends true
        ? Negate<IntegerPart>
        : IntegerPart
      : never
    : T;
