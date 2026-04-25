/** -------------------------------------------------------
 * * ***Utility Type: `Switch`.***
 * -------------------------------------------------------
 * **Type-level version of a `switch` statement.**
 * - **Behavior:**
 *      - Checks if `Condition` exists as a key in `Cases`.
 *      - Returns the corresponding value if the key exists.
 *      - Returns `Default` if the key does not exist.
 * @template Condition - The value to match against case keys.
 * @template Cases - An object mapping keys to corresponding values.
 * @template Default - The default value returned if `Condition` is not a key in `Cases` (defaults to `never`).
 * @example
 * ```ts
 * const a = 'const';
 *
 * // Matches 'const' key ➔ 'bar'
 * type Result1 = Switch<typeof a, { number: 'foo', const: 'bar' }, 'foobar'>;
 * // ➔ 'bar'
 *
 * // Condition not present ➔ returns default
 * type Result2 = Switch<'other', { number: 'foo', const: 'bar' }, 'default'>;
 * // ➔ 'default'
 *
 * // Condition present but no default specified
 * type Result3 = Switch<'number', { number: 'foo', const: 'bar' }>;
 * // ➔ 'foo'
 * ```
 */
export type Switch<
  Condition extends PropertyKey,
  Cases extends Record<PropertyKey, unknown>,
  Default = never
> = Condition extends keyof Cases ? Cases[Condition] : Default;
