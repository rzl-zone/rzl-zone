/** --------------------------------------------------
 * * ***Utility Type: `PickStrict`.***
 * --------------------------------------------------
 * **Utility type that behaves exactly like the native `Pick<T, K>`,
 * but can help with type inference and IDE autocomplete in stricter scenarios.**
 * @template T - The base object type.
 * @template K - The keys from `T` to be picked.
 * @example
 * ```ts
 * type A = { a: number; b: string; c: boolean };
 * type B = PickStrict<A, 'a' | 'c'>;
 * // ➔ { a: number; c: boolean }
 * ```
 */
export type PickStrict<T, K extends keyof T> = Pick<T, K>;
