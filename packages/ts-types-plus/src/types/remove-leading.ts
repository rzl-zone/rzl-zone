import type { IsEmptyString } from "./string";

/** -------------------------------------------------------
 * * ***Utility Type: `RemoveLeading`.***
 * -------------------------------------------------------
 * **Accepts a string type `T` and **recursively removes leading characters**
 * specified in `Characters`.**
 * @template T - The string to process.
 * @template Characters - The characters to remove from the start.
 * @example
 * ```ts
 * type Case1 = RemoveLeading<'aaabc', 'a'>;
 * // ➔ 'bc' (all leading 'a' removed).
 * type Case2 = RemoveLeading<'abc', 'd'>;
 * // ➔ 'abc' (no 'd' at start, unchanged).
 * type Case3 = RemoveLeading<'aaa', 'a'>;
 * // ➔ '' (all 'a' removed).
 * type Case4 = RemoveLeading<'aaa', 'aa'>;
 * // ➔ 'a' (matches 'aa' once, then remaining 'a').
 * ```
 */
export type RemoveLeading<
  T extends string,
  Characters extends string
> = T extends `${Characters}${infer Rest extends string}`
  ? IsEmptyString<Rest> extends true
    ? Rest
    : RemoveLeading<Rest, Characters>
  : T;
