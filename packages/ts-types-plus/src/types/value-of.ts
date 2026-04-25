/** -------------------------------------------------------
 * * ***Utility Type: `ValueOf`.***
 * -------------------------------------------------------
 * **Gets the types of all property values in an object `T`.**
 * @template T - The object type.
 * @example
 * ```ts
 * type Case1 = ValueOf<{ a: string, b: number }>;
 * // ➔ string | number
 * ```
 */
export type ValueOf<T> = T[keyof T];

/** -------------------------------------------------------
 * * ***Utility Type: `ValueOfOnly`.***
 * -------------------------------------------------------
 * **Gets the types of properties in object `T` specified by `K`.**
 * @template T - The object type.
 * @template K - Keys of `T` to extract values from.
 * @example
 * ```ts
 * type Case1 = ValueOfOnly<{ a: string, b: number }, "a">;
 * // ➔ string
 * ```
 */
export type ValueOfOnly<T, K extends keyof T> = T[K];

/** -------------------------------------------------------
 * * ***Utility Type: `ValueOfExcept`.***
 * -------------------------------------------------------
 * **Gets the types of properties in object `T` **except** for keys in `K`.**
 * @template T - The object type.
 * @template K - Keys of `T` to exclude.
 * @example
 * ```ts
 * type Case1 = ValueOfExcept<{ a: string, b: number }, "a">;
 * // ➔ number
 * ```
 */
export type ValueOfExcept<T, K extends keyof T> = T[keyof Omit<T, K>];

/** -------------------------------------------------------
 * * ***Utility Type: `ValueOfArray`.***
 * -------------------------------------------------------
 * **Gets the types of elements in a tuple or array `T`.**
 * @template T - The tuple or array type.
 * @example
 * ```ts
 * type Case1 = ValueOfArray<[string, number]>;
 * // ➔ string | number
 * ```
 */
export type ValueOfArray<T extends readonly unknown[]> = T[number];
