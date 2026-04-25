import type { AnyFunction } from "./functions";

/** -------------------------------------------------------
 * * ***Utility Type: `IsFunction`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is a callable function type.**
 * @template T - The type to check.
 * @example
 * type A = IsFunction<() => void>; // ➔ true
 * type B = IsFunction<string>;     // ➔ false
 */
export type IsFunction<T> = T extends AnyFunction ? true : false;
