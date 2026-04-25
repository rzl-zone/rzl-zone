import type { IsEqual } from "./equal";
import type { Increment } from "./increment";
import type { IsStringLiteral } from "./is-string-literal";
import type { IsTuple } from "./is-tuple";

type _IndexOfArray<
  T extends readonly unknown[],
  Pivot,
  Index extends number = 0
> = T extends readonly [infer First, ...infer Rest extends unknown[]]
  ? IsEqual<First, Pivot> extends true
    ? Index
    : _IndexOfArray<Rest, Pivot, Increment<Index>>
  : -1;

type _IndexOfString<
  T extends string,
  Pivot,
  Index extends number = 0
> = T extends `${infer First}${infer Rest extends string}`
  ? IsEqual<First, Pivot> extends true
    ? Index
    : _IndexOfString<Rest, Pivot, Increment<Index>>
  : -1;

/** -------------------------------------------------------
 * * ***Utility Type: `IndexOf`.***
 * --------------------------------------------------------
 * **Type version of `Array.prototype.indexOf()` and `String.prototype.indexOf()`.**
 * - Returns the index of the second argument in the first argument.
 * @example
 * ```ts
 * type Case1 = IndexOf<[1, 2, 3], 2>; // ➔ 1
 * type Case2 = IndexOf<[1, 2, 3], 4>; // ➔ -1
 * type Case3 = IndexOf<'123', '2'>;   // ➔ 1
 * type Case4 = IndexOf<'123', '4'>;   // ➔ -1
 * ```
 */
export type IndexOf<
  T extends readonly unknown[] | string,
  Pivot extends T extends string ? string : unknown
> = T extends string
  ? IsStringLiteral<T> extends true
    ? _IndexOfString<T, Pivot>
    : never
  : T extends readonly unknown[]
    ? IsTuple<T> extends true
      ? _IndexOfArray<T, Pivot>
      : never
    : never;
