/** -------------------------------------------------------
 * * ***Utility Type: `Unshift`.***
 * -------------------------------------------------------
 * **Adds the specified element `U` to the **beginning** of the tuple/array `T`.**
 * @template T - The original tuple or array.
 * @template U - The element to add at the start.
 * @example
 * ```ts
 * // Adding string to a tuple
 * type Case1 = Unshift<['bar'], 'foo'>;
 * // ➔ ['foo', 'bar']
 *
 * // Adding number to an empty array
 * type Case2 = Unshift<[], 1>;
 * // ➔ [1]
 * ```
 */
export type Unshift<T extends readonly unknown[], U> = [U, ...T];
