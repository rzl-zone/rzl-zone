/** --------------------------------------------------
 * * ***Utility Type: `ExtractStrict`.***
 * --------------------------------------------------
 * **Performs a stricter version of the built-in `Extract<T, U>`
 * with improved type narrowing.**
 * - ✅ Especially useful in generic utilities where the
 *   standard `Extract` can widen or collapse unions.
 * @template T - The full union or set of types.
 * @template U - The type(s) to be kept from `T`.
 * @example
 * ```ts
 * type A = 'a' | 'b' | 'c';
 * type B = ExtractStrict<A, 'b' | 'c'>;
 * // ➔ 'b' | 'c'
 * ```
 */
export type ExtractStrict<T, U extends T> = T extends unknown
  ? 0 extends (U extends T ? ([T] extends [U] ? 0 : never) : never)
    ? T
    : never
  : never;
