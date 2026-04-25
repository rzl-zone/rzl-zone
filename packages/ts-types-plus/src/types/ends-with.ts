/** -------------------------------------------------------
 * * ***Utility Type: `EndsWith`.***
 * -------------------------------------------------------
 * **A type-level utility that returns a boolean indicating
 * whether the first string literal ends with the ***second one***.**
 * @template T - The string to check.
 * @template C - The ***ending string*** to match.
 * @example
 * ```ts
 * type A = EndsWith<"Hello", "lo">;    // ➔ true
 * type B = EndsWith<"Foobar", "bar">;  // ➔ true
 * type C = EndsWith<"Foobar", "foo">;  // ➔ false
 * type D = EndsWith<"Hello", "world">; // ➔ false
 * ```
 */
export type EndsWith<
  T extends string,
  C extends string
> = T extends `${infer _}${C}` ? true : false;
