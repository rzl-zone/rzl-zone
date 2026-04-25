/** -------------------------------------------------------
 * * ***Utility Type: `Split`***
 * -------------------------------------------------------
 * **A type-level utility that mimics `String.prototype.split()`.**
 * @description
 * Splits a string literal `Str` into a tuple of substrings,
 * using `Del` as the delimiter.
 * - **Behavior:**
 *      - If `Del` is the empty string `""`, the result is a tuple of characters.
 *      - If `Del` is not found in `Str`, the result is a tuple with the original string.
 *      - Works only with string literals. If `Str` is just `string`, the result is `string[]`.
 * @template Str - The input string literal to be split.
 * @template Del - The delimiter used to split the string.
 *                 Defaults to `""` (character-level split).
 * @constraints
 * - `Str` must be a string literal to get precise results.
 * - `Del` can be a string or number (numbers are converted to strings).
 * @example
 * ```ts
 * // ✅ Split into characters
 * type A = Split<"abc">; // ➔ ["a", "b", "c"]
 *
 * // ✅ Split by a comma
 * type B = Split<"a,b,c", ",">; // ➔ ["a", "b", "c"]
 *
 * // ✅ Split by multi-char delimiter
 * type C = Split<"2025-08-22", "-">; // ➔ ["2025", "08", "22"]
 *
 * // ✅ Delimiter not found ➔ returns whole string
 * type D = Split<"hello", "|">; // ➔ ["hello"]
 *
 * // ⚠️ Non-literal string
 * type E = Split<string, ",">; // string[]
 * ```
 */
export type Split<
  Str extends string,
  Del extends string | number = ""
> = string extends Str
  ? string[]
  : "" extends Str
    ? []
    : Str extends `${infer T}${Del}${infer U}`
      ? [T, ...Split<U, Del>]
      : [Str];
