/** --------------------------------------------------
 * * ***Utility Type: `Identity`.***
 * --------------------------------------------------
 * **Identity utility type that preserves the structure and inference of type `T`.**
 * - ✅ Commonly used to force TypeScript to expand a mapped or intersection type
 *   into a more readable and usable shape.
 * @template T - The type to preserve and normalize.
 * @example
 * ```ts
 * type A = { a: string; b: number };
 * type B = Identity<A>;
 * // ➔ { a: string; b: number }
 * ```
 */
export type Identity<T> = { [P in keyof T]: T[P] };
