/** -------------------------------------------------------
 * * ***Utility Type: `ArrayElementType`.***
 * -------------------------------------------------------
 * **A type-level utility that extracts the element type of an array.**
 * - **Behavior:**
 *      - Works with both mutable and readonly arrays.
 *      - If `T` is not an array, resolves to `never`.
 * @template T - The array type to extract the element type from.
 * @example
 * ```ts
 * type A = ArrayElementType<string[]>;
 * // ➔ string
 * type B = ArrayElementType<readonly ("a" | "b")[]>;
 * // ➔ "a" | "b"
 * type C = ArrayElementType<number>;
 * // ➔ never
 * ```
 */
export type ArrayElementType<T extends readonly unknown[]> =
  T extends Readonly<Array<infer Item>> ? Item : never;
