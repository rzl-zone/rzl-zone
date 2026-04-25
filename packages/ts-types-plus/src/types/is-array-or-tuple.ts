/* eslint-disable @typescript-eslint/no-explicit-any */

/** -------------------------------------------------------
 * * ***Utility Type: `IsArrayOrTuple`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is an array or tuple type.**
 * - This includes both mutable (`T[]`) and readonly (`readonly T[]`) arrays.
 * @template T - The type to check.
 * @example
 * type A = IsArrayOrTuple<string[]>;
 * // ➔ true
 * type B = IsArrayOrTuple<readonly [string, number]>;
 * // ➔ true
 * type C = IsArrayOrTuple<string>; // ➔ false
 */
export type IsArrayOrTuple<T> = T extends readonly any[] ? true : false;
