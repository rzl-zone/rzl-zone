import type { And } from "./and";
import type { Extends, IfExtends } from "./extends";
import type { IsStringLiteral } from "./is-string-literal";
import type { IsPositive, ParseNumber } from "./number";
import type { Split } from "./split";

/** @private ***types for {@link CharAt}.***
 *
 */
type _CharAt<
  I extends string,
  N extends number | `${number}`,
  _S extends string[] = Split<I, "">
> = IfExtends<
  And<
    Extends<IsPositive<ParseNumber<N>>, true>,
    Extends<And<Extends<N, keyof _S>, Extends<IsStringLiteral<I>, true>>, true>
  >,
  true,
  _S[Extract<N, keyof _S>],
  undefined
>;

/** -------------------------------------------------------
 * * ***Utility Type: `CharAt`.***
 * -------------------------------------------------------
 * **A type-level utility that extracts the character at a given index `N`
 * from a string literal type `I`.**
 * - **Behavior:**
 *      - If the index is out of range, the result is `undefined`.
 *      - If `I` is not a literal string (just `string`), the result is `undefined`.
 *      - Only **positive indices** are supported (`0` and above`).
 * @template I - The input string literal to extract the character from.
 * @template N - The zero-based index of the character to retrieve.
 * @example
 * ```ts
 * // ✅ Basic usage
 * type A = CharAt<"hello", 0>; // ➔ "h"
 * type B = CharAt<"hello", 1>; // ➔ "e"
 * type C = CharAt<"hello", 4>; // ➔ "o"
 *
 * // ⚠️ Index out of range ➔ undefined
 * type D = CharAt<"hello", 5>; // ➔ undefined
 * type E = CharAt<"abc", 99>;  // ➔ undefined
 *
 * // ✅ Stringified index also works
 * type F = CharAt<"testing", "0">; // ➔ "t"
 * type G = CharAt<"testing", "2">; // ➔ "s"
 * type H = CharAt<"testing", "6">; // ➔ "g"
 * type I = CharAt<"testing", "7">; // ➔ undefined
 *
 * // ⚠️ Non-literal strings ➔ undefined
 * type J = CharAt<string, 2>; // ➔ undefined
 *
 * // ⚠️ Negative indices are not supported
 * type K = CharAt<"abc", -1>; // ➔ undefined
 * ```
 */
export type CharAt<I extends string, N extends number | `${number}`> = _CharAt<
  I,
  N
>;
