/** --------------------------------------------------
 * * ***Utility Type: `ExcludeStrict`.***
 * --------------------------------------------------
 * **Performs a stricter version of `Exclude<T, U>` with improved type narrowing.**
 * - ✅ Especially useful in generic libraries or utility types
 *    where standard `Exclude` may collapse or widen types unintentionally.
 * @template T - The full union or set of types.
 * @template U - The type(s) to be excluded from `T`.
 * @example
 * ```ts
 * type A = 'a' | 'b' | 'c';
 * type B = ExcludeStrict<A, 'b'>;
 * // ➔ 'a' | 'c'
 * ```
 */
export type ExcludeStrict<T, U extends T> = T extends unknown
  ? 0 extends (U extends T ? ([T] extends [U] ? 0 : never) : never)
    ? never
    : T
  : never;
