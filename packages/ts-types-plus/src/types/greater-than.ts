import type { IsEqual } from "./equal";
import type { If } from "./if";
import type { IfLowerThan, IsLowerThan } from "./lower-than";

/** -------------------------------------------------------
 * * ***Utility Type: `IsGreaterThan`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the first integer
 * is ***greater than*** the second integer.**
 * - **Behavior:**
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer.
 * @template Num2 - The second integer.
 * @example
 * ```ts
 * type A = IsGreaterThan<10, 1>;   // ➔ true
 * type B = IsGreaterThan<-10, 1>;  // ➔ false
 * ```
 */
export type IsGreaterThan<
  Num1 extends number,
  Num2 extends number
> = IsLowerThan<Num2, Num1>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfGreaterThan`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the third argument if the first integer is ***greater than*** the
 *        second integer, otherwise returns the fourth argument.
 * - **Behavior:**
 *      - Defaults: `IfTrue = true`, `IfFalse = false`.
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer.
 * @template Num2 - The second integer.
 * @template IfTrue - The branch type if condition is met. (default: `true`)
 * @template IfFalse - The branch type if condition is not met. (default: `false`)
 * @example
 * ```ts
 * type A = IfGreaterThan<10, 1, "valid">;
 * // ➔ "valid"
 * type B = IfGreaterThan<-10, 1, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
export type IfGreaterThan<
  Num1 extends number,
  Num2 extends number,
  IfTrue = true,
  IfFalse = false
> = IfLowerThan<Num2, Num1, IfTrue, IfFalse>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsGreaterOrEqual`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the first integer
 * is ***greater than or equal*** to the second integer.**
 * - **Behavior:**
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer.
 * @template Num2 - The second integer.
 * @example
 * ```ts
 * type A = IsGreaterOrEqual<10, 1>;  // ➔ true
 * type B = IsGreaterOrEqual<-10, 1>; // ➔ false
 * type C = IsGreaterOrEqual<10, 10>; // ➔ true
 * ```
 */
export type IsGreaterOrEqual<Num1 extends number, Num2 extends number> =
  IsEqual<Num1, Num2> extends true ? true : IsGreaterThan<Num1, Num2>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfGreaterOrEqual`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the third argument if the first integer is ***greater than or
 *        equal*** to the second integer, otherwise returns the fourth argument.
 * - **Behavior:**
 *      - Defaults: `IfTrue = true`, `IfFalse = false`.
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer.
 * @template Num2 - The second integer.
 * @template IfTrue - The branch type if condition is met. (default: `true`)
 * @template IfFalse - The branch type if condition is not met. (default: `false`)
 * @example
 * ```ts
 * type A = IfGreaterOrEqual<10, 1, "valid">;
 * // ➔ "valid"
 * type B = IfGreaterOrEqual<-10, 1, "valid", "invalid">;
 * // ➔ "invalid"
 * type C = IfGreaterOrEqual<10, 10, "yes", "no">;
 * // ➔ "yes"
 * ```
 */
export type IfGreaterOrEqual<
  Num1 extends number,
  Num2 extends number,
  IfTrue = true,
  IfFalse = false
> = If<
  IsEqual<Num1, Num2> extends true ? true : IsGreaterThan<Num1, Num2>,
  IfTrue,
  IfFalse
>;
