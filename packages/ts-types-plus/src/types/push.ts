/** -------------------------------------------------------
 * * ***Utility Type: `Push`.***
 * -------------------------------------------------------
 * **Appends a type `U` to the end of a tuple or readonly array type `T`.**
 * @template T - The tuple or readonly array type to append U.
 * @template U - The type of the element to push.
 * @example
 * ```ts
 * type Case1 = Push<[1, 2, 3, 4], 5>;
 * // ➔ [1, 2, 3, 4, 5]
 *
 * type Case2 = Push<["a", "b"], "c">;
 * // ➔ ["a", "b", "c"]
 * ```
 */
export type Push<T extends readonly unknown[], U> = [...T, U];
