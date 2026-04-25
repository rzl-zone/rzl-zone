/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IsConstructor } from "./is-constructor";
/** -------------------------------------------------------
 * * ***Utility Type: `IsNewable`.***
 * -------------------------------------------------------
 * **Checks whether a given type `T` is a constructable (`new`) function type.**
 *
 * A *newable* type is any type that can be instantiated using the
 * `new` operator (for example, class constructors or constructor
 * signatures).
 *
 * This utility only matches **non-abstract constructors**, meaning
 * the type must be directly instantiable.
 *
 * - **Behavior:**
 *      - Evaluates to `true` if `T` has a compatible
 *        `new (...args) => instance` signature.
 *      - Optionally validates the **constructor parameter tuple**
 *        and **instance type** using the generic parameters `A` and `R`.
 *
 * - **Difference from {@link IsConstructor | `IsConstructor`}:**
 *      - `IsNewable` only returns `true` for constructors that can be
 *        instantiated with `new`.
 *      - `IsConstructor` also returns `true` for **abstract constructors**.
 *
 * @template T - The type to check.
 * @template A - Expected constructor parameter tuple (default: `any[]`).
 * @template R - Expected instance type (default: `any`).
 *
 * @example
 * ```ts
 * class A {}
 * abstract class B {}
 *
 * type T1 = IsNewable<typeof A>;
 * // ➔ true
 * type T2 = IsNewable<typeof B>;
 * // ➔ false
 * ```
 *
 * @example
 * ```ts
 * class User {
 *   constructor(x: number, y: string) {}
 * }
 *
 * type T1 = IsNewable<typeof User, [number, string], User>;
 * // ➔ true
 * type T2 = IsNewable<typeof User, [string], User>;
 * // ➔ false
 * ```
 *
 * @example
 * ```ts
 * type T1 = IsNewable<() => void>;
 * // ➔ false
 * type T2 = IsNewable<string>;
 * // ➔ false
 * ```
 */
export type IsNewable<T, A extends any[] = any[], R = any> = T extends new (
  ...args: A
) => R
  ? true
  : false;
