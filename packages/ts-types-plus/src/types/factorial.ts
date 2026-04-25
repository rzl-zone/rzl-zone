import type { IsEqual } from "./equal";
import type { Increment } from "./increment";
import type { Multi } from "./multi";
import type { IsNegative } from "./number";

type _Factorial<
  T extends number,
  CurrentNum extends number = 1,
  CurrentProduct extends number = 1
> =
  IsEqual<T, CurrentNum> extends true
    ? Multi<CurrentProduct, CurrentNum>
    : _Factorial<T, Increment<CurrentNum>, Multi<CurrentProduct, CurrentNum>>;

/** -------------------------------------------------------
 * * ***Utility Type: `Factorial`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns its ***mathematical factorial***.**
 * - **Behavior:**
 *      - Valid range: `[0, 21]`.
 *      - Negative numbers or `number` type result in `never`.
 * @template T - The integer to compute factorial for.
 * @example
 * ```ts
 * type A = Factorial<0>;
 * // ➔ 1
 * type B = Factorial<6>;
 * // ➔ 720
 * type C = Factorial<-5>;
 * // ➔ never
 * type D = Factorial<number>;
 * // ➔ never
 * ```
 */
export type Factorial<T extends number> = number extends T
  ? never
  : IsNegative<T> extends true
    ? never
    : IsEqual<T, 0> extends true
      ? 1
      : _Factorial<T>;
