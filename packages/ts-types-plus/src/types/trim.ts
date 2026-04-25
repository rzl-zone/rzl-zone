import type { Whitespace } from "./common";

/** **Helper Type Internal.** */
type SafeKeyTrimming<T> = Exclude<T, symbol>;

/** --------------------------------------------------
 * * ***Utility Type: `TrimLeft`.***
 * --------------------------------------------------
 * **Recursively trims specified characters (default: **{@link Whitespace | `Whitespace`}**) from the **start (left)** of a string.**
 * @template Text - The string to trim.
 * @template Chars - The characters to remove (default: `Whitespace`).
 * @example
 * type T1 = TrimLeft<"\n  hello", " " | "\n">;
 * // ➔ "hello"
 * type T2 = TrimLeft<"  world">;
 * // ➔ "world"
 * type T3 = TrimLeft<"  world ">;
 * // ➔ "world "
 */
export type TrimLeft<
  Text extends PropertyKey,
  Chars extends PropertyKey = Whitespace
> = Text extends `${SafeKeyTrimming<Chars>}${infer Rest}`
  ? TrimLeft<Rest, Chars>
  : Text;

/** --------------------------------------------------
 * * ***Utility Type: `TrimRight`.***
 * --------------------------------------------------
 * **Recursively trims specified characters (default: **{@link Whitespace | `Whitespace`}**) from the **end (right)** of a string.**
 * @template Text - The string to trim.
 * @template Chars - The characters to remove (default: `Whitespace`).
 * @example
 * type T1 = TrimRight<"hello  \t", " " | "\t">;
 * // ➔ "hello"
 * type T2 = TrimRight<"world  ">;
 * // ➔ "world"
 * type T2 = TrimRight<" world  ">;
 * // ➔ " world"
 */
export type TrimRight<
  Text extends PropertyKey,
  Chars extends PropertyKey = Whitespace
> = Text extends `${infer Rest}${SafeKeyTrimming<Chars>}`
  ? TrimRight<Rest, Chars>
  : Text;

/** --------------------------------------------------
 * * ***Utility Type: `Trim`.***
 * --------------------------------------------------
 * **Trims specified characters (default: **{@link Whitespace | `Whitespace`}**)
 * from **both the start and end** of a string.**
 * @template Chars - The characters to remove (default: `Whitespace`).
 * @example
 * type T1 = Trim<"  hello  ", " ">;
 * // ➔ "hello"
 * type T2 = Trim<"\n  world \t">;
 * // ➔ "world"
 */
export type Trim<
  Text extends PropertyKey,
  Chars extends PropertyKey = Whitespace
> = TrimRight<TrimLeft<Text, Chars>, Chars>;

/** -------------------------------------------------------
 * * ***Utility Type: `TrimsLower`.***
 * -------------------------------------------------------
 * **Trims leading & trailing whitespace from a string and
 * converts it to **lowercase**.**
 * @description
 * Utilizes **{@link Trim | `Trim`}** to remove whitespace and
 * **{@link Lowercase | `Lowercase`}** to convert the string to lowercase.
 * @template S - The input string to transform.
 * @example
 * ```ts
 * type T1 = TrimsLower<"  HeLLo \n">;
 * // ➔ "hello"
 * type T2 = TrimsLower<"  WoRLD  ">;
 * // ➔ "world"
 * ```
 */
export type TrimsLower<S extends string> = Lowercase<Trim<S>>;

/** -------------------------------------------------------
 * * ***Utility Type: `TrimsUpper`.***
 * -------------------------------------------------------
 * **Trims leading & trailing whitespace from a string and
 * converts it to **uppercase**.**
 * @description
 * Utilizes **{@link Trim | `Trim`}** to remove whitespace and
 * **{@link Uppercase | `Uppercase`}** to convert the string to uppercase.
 * @template S - The input string to transform.
 * @example
 * ```ts
 * type T1 = TrimsUpper<"  HeLLo \n">;
 * // ➔ "HELLO"
 * type T2 = TrimsUpper<"  WoRLD  ">;
 * // ➔ "WORLD"
 * ```
 */
export type TrimsUpper<S extends string> = Uppercase<Trim<S>>;

/** -------------------------------------------------------
 * * ***Utility Type: `TrimCapitalize`.***
 * -------------------------------------------------------
 * **Trims leading & trailing whitespace from a string and
 * capitalizes the first character while converting the
 * rest to lowercase.**
 * @description
 * Utilizes **{@link Trim | `Trim`}** to remove whitespace,
 * **{@link Lowercase | `Lowercase`}** to lowercase the string first, and
 * then **{@link Capitalize | `Capitalize`}** to capitalize the first character.
 * @template S - The input string to transform.
 * @example
 * ```ts
 * type T1 = TrimCapitalize<"  HeLLo \n">;
 * // ➔ "Hello"
 * type T2 = TrimCapitalize<"  WoRLD  ">;
 * // ➔ "World"
 * ```
 */
export type TrimCapitalize<S extends string> = Capitalize<Lowercase<Trim<S>>>;
