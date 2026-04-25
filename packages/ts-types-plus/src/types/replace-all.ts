/**
 * Helper for {@link ReplaceAll}
 */
type Includes<
  S extends string,
  Sub extends string
> = S extends `${infer _}${Sub}${infer _}` ? true : false;

/** -------------------------------------------------------
 * * ***Utility Type: `ReplaceAll`.***
 * -------------------------------------------------------
 * **A **type-level utility** that replaces all occurrences of a given string (or array of strings) `Pivot` in a string `T` with `ReplaceBy`.**
 * - **Supports:**
 *      - Replacing a single substring.
 *      - Replacing multiple substrings (Pivot as array).
 *      - Guards against infinite recursion if `ReplaceBy` contains any value in Pivot.
 * @template T - The string to process.
 * @template Pivot - A string or readonly array of strings to replace.
 * @template ReplaceBy - The string to replace Pivot with.
 * @example
 * ```ts
 * // Single pivot string
 * type Case1 = ReplaceAll<'remove me me', 'me', 'him'>;
 * // ➔ 'remove him him'
 *
 * // Pivot as array
 * type Case2 = ReplaceAll<'remove me remove me', ['me', 'remove'], 'him'>;
 * // ➔ 'him him him him'
 *
 * // Pivot not found
 * type Case3 = ReplaceAll<'hello world', 'foo', 'bar'>;
 * // ➔ 'hello world'
 *
 * // ReplaceBy contains pivot (guard against infinite recursion)
 * type Case4 = ReplaceAll<'abc', 'a', 'a'>;
 * // ➔ string
 * ```
 * @remarks
 * - Works recursively to replace all instances.
 * - If Pivot is empty (`""`) or empty array (`[]`), returns `T` unchanged.
 */
export type ReplaceAll<
  T extends string,
  Pivot extends string | readonly string[],
  ReplaceBy extends string
> = Pivot extends "" | []
  ? T
  : Includes<ReplaceBy, Pivot extends string ? Pivot : never> extends true
    ? string // guard: prevent infinite recursion
    : Pivot extends readonly [
          infer First extends string,
          ...infer Rest extends string[]
        ]
      ? ReplaceAll<ReplaceAll<T, First, ReplaceBy>, Rest, ReplaceBy>
      : Pivot extends string
        ? T extends `${infer A}${Pivot}${infer B}`
          ? ReplaceAll<`${A}${ReplaceBy}${B}`, Pivot, ReplaceBy>
          : T
        : T;

/** --------------------------------------------------
 * * ***ReplaceAllDeprecated.***
 * --------------------------------------------------
 * Replaces all occurrences of a pattern in a string with a replacement string.
 *
 * @deprecated ⚠️ Deprecated — use `ReplaceAll` instead.
 *
 * @template Text - The input string.
 * @template Pattern - The substring to replace.
 * @template Replacement - The replacement string (default: `""`).
 *
 * @example
 * type T = ReplaceAllDeprecated<"foo-bar-bar", "bar", "baz">;
 * // ➔ "foo-baz-baz"
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ReplaceAllDeprecated<
  Text extends PropertyKey,
  Pattern extends PropertyKey,
  Replacement extends PropertyKey = ""
> = Text extends `${infer Start extends string}${Exclude<
  Pattern,
  symbol
>}${infer Rest extends string}`
  ? `${Start}${Exclude<Replacement, symbol>}${ReplaceAllDeprecated<
      Rest,
      Pattern,
      Replacement
    >}`
  : Text;
