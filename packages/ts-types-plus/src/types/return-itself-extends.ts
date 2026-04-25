import type { Extends } from "./extends";
import type { If } from "./if";
import type { IfNever } from "./never";
import type { Or } from "./or";

/** -------------------------------------------------------
 * * ***Utility Type: `ReturnItselfIfExtends`.***
 * -------------------------------------------------------
 * **This utility is useful when you want to **narrow types by extension**,
 * replacing them with a fallback if they match a given base constraint,
 * while preserving them otherwise.**
 * - **A conditional type that returns:**
 *      - `Else` if `T` extends `Base`.
 *      - `T` itself if `T` does extend `Base`.
 *      - `IfANever` if `T` is `never`.
 * @template T - The type to check.
 * @template Base - The base type to test against.
 * @template Else - The type to return if `T` extends `Base`.
 * @template IfANever - The type to return if `T` or `Base` is `never` (default: `never`).
 * @example
 * ```ts
 * type Case1 = ReturnItselfIfExtends<1, number, 2>
 * // ➔ 1
 *
 * type Case2 = ReturnItselfIfExtends<'1', number, 2>
 * // ➔ 2
 *
 * // ℹ️ Never Case:
 * type Case3 = ReturnItselfIfExtends<never, string, 0>
 * // ➔ never
 *
 * type Case4 = ReturnItselfIfExtends<string, never, 0, undefined>
 * // ➔ undefined
 * ```
 */
export type ReturnItselfIfExtends<T, Base, Else, IfANever = never> = IfNever<
  If<Extends<Or<Base, T>, true>, never>,
  IfANever,
  T extends Base ? T : Else
>;

/** -------------------------------------------------------
 * * ***Utility Type: `ReturnItselfIfNotExtends`.***
 * -------------------------------------------------------
 * **This utility is useful for preserving a type unless it matches
 * a broader constraint, in which case it is replaced with a fallback.**
 * - **A conditional type that returns:**
 *      - `Else` if `T` extends `Base`.
 *      - `T` itself if `T` does **not** extend `Base`.
 *      - `IfANever` if `T` is `never`.
 * @template T - The type to check.
 * @template Base - The base type to test against.
 * @template Else - The type to return if `T` extends `Base`.
 * @template IfANever - The type to return if `T` or `Base` is `never` (default: `never`).
 * @example
 * ```ts
 * type Case1 = ReturnItselfIfNotExtends<'1', number, 2>
 * // ➔ '1'
 * type Case2 = ReturnItselfIfNotExtends<1, number, 2>
 * // ➔ 2
 *
 * // ℹ️ Never Case:
 * type Case3 = ReturnItselfIfNotExtends<never, string, 0>;
 *  // ➔ never
 * type Case4 = ReturnItselfIfNotExtends<string, never, 0, undefined>;
 *  // ➔ undefined
 * ```
 */
export type ReturnItselfIfNotExtends<T, Base, Else, IfANever = never> = IfNever<
  If<Extends<Or<Base, T>, true>, never>,
  IfANever,
  T extends Base ? Else : T
>;
