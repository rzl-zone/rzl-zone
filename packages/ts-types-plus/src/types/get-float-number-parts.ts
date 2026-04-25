import type { IsFloat, IsNegative } from "./number";

/** -------------------------------------------------------
 * * ***Utility Type: `GetFloatNumberParts`.***
 * -------------------------------------------------------
 * **Returns a tuple of the **whole** and **fraction** parts of a float number `T`.**
 * - **Behavior:**
 *      - Only works for **float numbers** (i.e., numbers with a fractional part):
 *          - If `T` is not a float, the result is `never`.
 *      - Preserves the sign on the whole part (e.g. `-12.25` ➔ `[-12, 25]`).
 *      - For values like `-0.x`, the TypeScript will normalizes `-0` to `0`,
 *        so the result will be `[0, ...]`.
 * @template T - A float number type.
 * @example
 * ```ts
 * type A = GetFloatNumberParts<12.25>;  // ➔ [12, 25]
 * type B = GetFloatNumberParts<-12.25>; // ➔ [-12, 25]
 * type C = GetFloatNumberParts<3.1415>; // ➔ [3, 1415]
 * type D = GetFloatNumberParts<-0.75>;  // ➔ [0, 75] (`-0` normalized to `0`)
 * type E = GetFloatNumberParts<42>;     // ➔ never (not a float)
 * ```
 */
export type GetFloatNumberParts<T extends number> =
  IsFloat<T> extends true
    ? `${T}` extends `${infer Whole extends number}.${infer Fraction extends number}`
      ? [IsNegative<T> extends true ? Whole : Whole, Fraction]
      : never
    : never;
