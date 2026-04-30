import type { And } from "./and";
import type { IsStringLiteral } from "./is-string-literal";
import type { IsEmptyString } from "./string";

/** @private ***types for {@link AreAnagrams}.***
 *
 */
type _AreAnagrams<Str1 extends string, Str2 extends string> =
  IsEmptyString<Str1> extends true
    ? IsEmptyString<Str2> extends true
      ? true
      : false
    : Str1 extends `${infer First extends string}${infer Rest1 extends string}`
      ? Str2 extends `${infer Prev extends string}${First}${infer Rest2 extends string}`
        ? _AreAnagrams<Rest1, `${Prev}${Rest2}`>
        : false
      : never;

/** -------------------------------------------------------
 * * ***Utility Type: `AreAnagrams`.***
 * -------------------------------------------------------
 * **Determines whether two string literal types are ***anagrams*** of each other.**
 * - **Behavior:**
 *      - Returns `true` if both strings contain exactly the same characters in
 *        any order.
 *      - Returns `false` otherwise.
 * @template Str1 - The first string literal.
 * @template Str2 - The second string literal.
 * @example
 * ```ts
 * type Case1 = AreAnagrams<"name", "eman">;
 * // ➔ true
 * type Case2 = AreAnagrams<"name", "emand">;
 * // ➔ false
 * type Case3 = AreAnagrams<"abc", "cba">;
 * // ➔ true
 * type Case4 = AreAnagrams<"abc", "abcd">;
 * // ➔ false
 * ```
 */
export type AreAnagrams<Str1 extends string, Str2 extends string> =
  And<IsStringLiteral<Str1>, IsStringLiteral<Str2>> extends true
    ? _AreAnagrams<Str1, Str2>
    : false;
