/** -------------------------------------------------------
 * * ***Utility Type: `RemoveIndexSignature`.***
 * -------------------------------------------------------
 * **Removes **index signatures** (e.g., `[key: string]: any`) from an object
 * type `T`, leaving only explicitly declared properties.**
 * @template T - The object type to process.
 * @example
 * ```ts
 * type Case1 = RemoveIndexSignature<{ [key: string]: number | string; a: string }>;
 * // ➔ { a: string }
 *
 * type Case2 = RemoveIndexSignature<{ x: number; y: boolean }>;
 * // ➔ { x: number; y: boolean }
 *
 * type Case3 = RemoveIndexSignature<{ [key: string]: number }>;
 * // ➔ {}  // all keys were index signatures
 * ```
 */
export type RemoveIndexSignature<T> = {
  [Key in keyof T as Key extends `${infer _}` ? Key : never]: T[Key];
};
