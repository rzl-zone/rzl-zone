import type { Div } from "./div";
import type { Multi } from "./multi";
import type { Sub } from "./sub";

/** -------------------------------------------------------
 * * ***Utility Type: `Mod`.***
 * -------------------------------------------------------
 * **Returns the **remainder** of the division of two numbers (`Dividend % Divisor`).**
 * - **Behavior:**
 *      - Computes the remainder using type-level arithmetic:
 *          - `Dividend - (Divisor * (Dividend / Divisor))`.
 *      - Works with integers within the range:
 *          - `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Dividend - The dividend (numerator).
 * @template Divisor - The divisor (denominator).
 * @example
 * ```ts
 * type T0 = Mod<1, 2>;  // ➔ 1
 * type T1 = Mod<1, 3>;  // ➔ 1
 * type T2 = Mod<10, 3>; // ➔ 1
 * type T3 = Mod<7, 7>;  // ➔ 0
 * ```
 */
export type Mod<Dividend extends number, Divisor extends number> =
  Div<Dividend, Divisor> extends infer Quotient extends number
    ? Multi<Quotient, Divisor> extends infer Product extends number
      ? Sub<Dividend, Product>
      : never
    : never;
