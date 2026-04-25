/** -------------------------------------------------------
 * * ***Utility Type: `StartsWith`.***
 * -------------------------------------------------------
 * **Type-level utility that determines whether a string `Str`
 * starts with the substring `Pivot`.**
 * - **Behavior:**
 *      - Supports `Pivot` as either `string` or `number`.
 *      - Returns `true` if `Str` starts with `Pivot`, otherwise `false`.
 * @template Str - The string to check.
 * @template Pivot - The substring or number to check as the prefix.
 * @example
 * ```ts
 * // Check string prefix
 * type Case1 = StartsWith<'abc', 'a'>;
 * // ➔ true
 *
 * type Case2 = StartsWith<'abc', 'b'>;
 * // ➔ false
 *
 * // Check numeric prefix
 * type Case3 = StartsWith<'123', 1>;
 * // ➔ true
 *
 * type Case4 = StartsWith<'123', 2>;
 * // ➔ false
 *
 * // Multi-character pivot
 * type Case5 = StartsWith<'typescript', 'type'>;
 * // ➔ true
 *
 * type Case6 = StartsWith<'typescript', 'script'>;
 * // ➔ false
 * ```
 */
export type StartsWith<
  Str extends string,
  Pivot extends string | number
> = Str extends `${Pivot}${string}` ? true : false;
