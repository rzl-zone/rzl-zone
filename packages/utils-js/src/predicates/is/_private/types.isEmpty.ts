import type { ArrayLike } from "./types.ArrayLike";

/** -------------------------------------------------------------------
 * * ***Represents an object with no allowed properties.***
 * -------------------------------------------------------------------
 * **Useful for cases where you want to ensure a type has **no keys**.**
 *
 * ---
 * @template T - The base type to convert into an empty object type.
 *
 * ---
 * @example
 * ```ts
 * type Test = EmptyObject<{ a: number }>;
 * // ➔ { a?: never }
 * ```
 */
export type EmptyObject<T> = { [K in keyof T]?: never };

/** -------------------------------------------------------------------
 * * ***Conditional empty object type.***
 * -------------------------------------------------------------------
 * **Produces `EmptyObject<T>` only if it is assignable to `T`.**
 *
 * ---
 * @template T - The base type to check.
 *
 * ---
 * @example
 * ```ts
 * type Test = EmptyObjectOf<{ a: number }>;
 * // ➔ { a?: never } | never depending on assignability
 * ```
 */
export type EmptyObjectOf<T> =
  EmptyObject<T> extends T ? EmptyObject<T> : never;

/** -------------------------------------------------------------------
 * * ***List type alias.***
 * -------------------------------------------------------------------
 * **Represents any array-like structure.**
 *
 * ---
 * @template T - The type of elements in the list.
 *
 * ---
 * @example
 * ```ts
 * const arr: List<number> = [1, 2, 3];
 * const nodeList: List<Element> = document.querySelectorAll("div");
 * ```
 */
export type List<T> = ArrayLike<T>;
