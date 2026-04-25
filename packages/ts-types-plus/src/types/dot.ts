import type { Extends } from "./extends";
import type { Trim } from "./trim";

/** -------------------------------------------------------
 * * ***Utility Type: `Dot`.***
 * -------------------------------------------------------
 * **A type-level utility that concatenates two string literals with a `.`.**
 * - **Behavior:**
 *      - If the `Trims` flag is `true` (default), leading and trailing spaces in
 *        both strings are trimmed before concatenation.
 *      - If the second string literal is empty, it returns the first string literal.
 *      - If the first string literal is empty, it returns the second string literal.
 *      - Otherwise, it returns `${T}.${U}` (trimmed if `Trims` is `true`).
 * @template T - The first string literal.
 * @template U - The second string literal.
 * @template Trims - Whether to trim whitespace from the inputs before concatenation (default: `true`).
 * @example
 * ```ts
 * type A = Dot<"foo", "bar">;
 * // ➔ "foo.bar"
 * type B = Dot<"foo", "">;
 * // ➔ "foo"
 * type C = Dot<"", "baz">;
 * // ➔ "baz"
 * type D = Dot<"  hello  ", " world ", true>;
 * // ➔ "hello.world"
 * type E = Dot<"  hello  ", " world ", false>;
 * // ➔ "  hello  . world "
 * ```
 */
export type Dot<
  T extends string,
  U extends string,
  Trims extends boolean = true
> =
  Extends<Trims, true> extends true
    ? "" extends Trim<U>
      ? Trim<T>
      : "" extends Trim<T>
        ? `${Trim<U>}`
        : `${Trim<T>}.${Trim<U>}`
    : "" extends U
      ? T
      : `${T}.${U}`;

/** -------------------------------------------------------
 * * ***Utility Type: `DotArray`.***
 * -------------------------------------------------------
 * **A type-level utility that concatenates an array of string literals with a `.`.**
 * - **Behavior:**
 *      - Skips empty strings in the array.
 *      - If `Trims` is `true` (default), trims whitespace from each element.
 *      - Returns a single string literal.
 * @template Arr - An array of string literals.
 * @template Trims - Whether to trim whitespace from each element (default: `true`).
 * @example
 * ```ts
 * type A = DotArray<["foo", "bar", "baz"]>;
 * // ➔ "foo.bar.baz"
 * type B = DotArray<["foo", "", "baz"]>;
 * // ➔ "foo.baz"
 * type C = DotArray<["  foo  ", " bar "], true>;
 * // ➔ "foo.bar"
 * type D = DotArray<["  foo  ", " bar "], false>;
 * // ➔ "  foo  . bar "
 * type E = DotArray<[]>;
 * // ➔ ""
 * ```
 */
export type DotArray<
  Arr extends string[],
  Trims extends boolean = true
> = Arr extends [infer Head extends string, ...infer Tail extends string[]]
  ? Head extends ""
    ? DotArray<Tail, Trims>
    : `${Trims extends true ? Trim<Head> : Head}${Tail extends []
        ? ""
        : `.${DotArray<Tail, Trims>}`}`
  : "";
