/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IsNewable } from "./is-newable";

/** -------------------------------------------------------
 * * ***Utility Type: `IsConstructor`.***
 * -------------------------------------------------------
 * **Checks whether a given type `T` is a constructor type.**
 *
 * This utility evaluates to `true` if `T` has a constructor
 * signature, including constructors of **abstract classes**.
 *
 * It uses the `abstract new (...args) => instance` signature,
 * meaning it matches any type that represents a constructor —
 * even if the class cannot be instantiated directly.
 *
 * - **Behavior:**
 *      - Evaluates to `true` if `T` has a compatible constructor signature.
 *      - Optionally validates the **constructor parameter tuple**
 *        and **instance type** using the generic parameters `A` and `R`.
 *
 * - **Difference from {@link IsNewable | `IsNewable`}:**
 *      - `IsConstructor` returns `true` for **both concrete and abstract constructors**.
 *      - `IsNewable` only returns `true` for constructors that can be
 *        instantiated with `new`.
 *
 * In other words:
 *
 * ```ts
 * IsConstructor ⊇ IsNewable
 * ```
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
 * type T1 = IsConstructor<typeof A>;
 * // ➔ true
 * type T2 = IsConstructor<typeof B>;
 * // ➔ true
 * ```
 *
 * @example
 * ```ts
 * class User {
 *   constructor(x: number, y: string) {}
 * }
 *
 * type T1 = IsConstructor<typeof User, [number, string], User>;
 * // ➔ true
 * type T2 = IsConstructor<typeof User, [string], User>;
 * // ➔ false
 * ```
 *
 * @example
 * ```ts
 * type T1 = IsConstructor<() => void>;
 * // ➔ false
 * ```
 */
export type IsConstructor<
  T,
  A extends any[] = any[],
  R = any
> = T extends abstract new (...args: A) => R ? true : false;
