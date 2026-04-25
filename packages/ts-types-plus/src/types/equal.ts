import type { If } from "./if";
import type { Not } from "./not";

/** -------------------------------------------------------
 * * ***Utility Type: `IsEqual`.***
 * -------------------------------------------------------
 * **A type-level utility that returns a boolean indicating
 * whether the two types are ***equal***.**
 * @template T - The first type to compare.
 * @template U - The second type to compare.
 * @example
 * ```ts
 * type A = IsEqual<string, string>;
 *  // ➔ true
 * type B = IsEqual<1, 4>;
 *  // ➔ false
 * type C = IsEqual<true, false>;
 *  // ➔ false
 * type D = IsEqual<any, any>;
 *  // ➔ true
 * ```
 */
export type IsEqual<T, U> =
  (<F>() => F extends T ? 1 : 2) extends <F>() => F extends U ? 1 : 2
    ? true
    : false;

/** -------------------------------------------------------
 * * ***Utility Type: `IsNotEqual`.***
 * -------------------------------------------------------
 * **A type-level utility that returns a boolean indicating
 * whether the two types are ***not equal***.**
 * @template T - The first type to compare.
 * @template U - The second type to compare.
 * @example
 * ```ts
 * type A = IsNotEqual<1, 4>;
 * // ➔ true
 * type B = IsNotEqual<string, string>;
 * // ➔ false
 * ```
 */
export type IsNotEqual<T, U> = Not<IsEqual<T, U>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfEqual`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Selects one of two branches depending on whether `T` and `U` are ***equal***.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The first type to compare.
 * @template U - The second type to compare.
 * @template IfTrue - The branch type if condition is met. (default: `true`)
 * @template IfFalse - The branch type if condition is not met. (default: `false`)
 * @example
 * ```ts
 * type A = IfEqual<string, string, "valid">;      // ➔ "valid"
 * type B = IfEqual<1, 4, "valid", "invalid">;    // ➔ "invalid"
 * ```
 */
export type IfEqual<T, U, IfTrue = true, IfFalse = false> = If<
  IsEqual<T, U>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfNotEqual`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Selects one of two branches depending on whether `T` and `U` are ***not equal***.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The first type to compare.
 * @template U - The second type to compare.
 * @template IfTrue - The branch type if condition is met. (default: `true`)
 * @template IfFalse - The branch type if condition is not met. (default: `false`)
 * @example
 * ```ts
 * type A = IfNotEqual<1, 4, "valid">;
 * // ➔ "valid"
 * type B = IfNotEqual<string, string, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
export type IfNotEqual<T, U, IfTrue = true, IfFalse = false> = If<
  IsNotEqual<T, U>,
  IfTrue,
  IfFalse
>;
