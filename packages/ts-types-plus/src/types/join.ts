import type { IfEmptyArray } from "./array";
import type { IsTuple } from "./is-tuple";

/** -------------------------------------------------------
 * * ***Utility Type: `Join`.***
 * -------------------------------------------------------
 * **Type version of `Array.prototype.join()`.**
 * - Joins the first array argument by the second argument.
 * @template T - The array to join.
 * @template Glue - The string or number to join with, defaultValue: `""`.
 * @example
 * type Case0 = Join<["p", "e", "a", "r"]>;
 * // ➔ 'pear'
 * type Case1 = Join<["a", "p", "p", "l", "e"], "-">;
 * // ➔ 'a-p-p-l-e'
 * type Case2 = Join<["2", "2", "2"], 1>;
 * // ➔ '21212'
 * type Case3 = Join<["o"], "u">;
 * // ➔ 'o'
 * type Case3 = Join<[], "n">;
 * // ➔ never
 */
export type Join<
  T extends readonly (string | number)[],
  Glue extends string | number = ""
> =
  IsTuple<T> extends true
    ? T extends readonly [
        infer First extends string | number,
        ...infer Rest extends readonly (string | number)[]
      ]
      ? IfEmptyArray<Rest, First, `${First}${Glue}${Join<Rest, Glue>}`>
      : never
    : never;
