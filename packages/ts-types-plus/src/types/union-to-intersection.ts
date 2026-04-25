/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  DefaultPrettifyOptions,
  Prettify,
  PrettifyOptions as PrettifyOpts
} from "./prettify";

/** -------------------------------------------------------
 * * ***Utility Type: `UnionToIntersection`.***
 * -------------------------------------------------------
 * **Converts a union type into an **intersection**.**
 * @description
 * 📖 Reference: ***[`StackOverflow`](https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286).***
 * @template U - The union type to be converted.
 * @example
 * ```ts
 * type A = UnionToIntersection<{ a: string } | { b: number }>;
 * // ➔ { a: string } & { b: number }
 * type B = UnionToIntersection<
 *   { a: string } | { b: number } | { c: boolean }
 * >;
 * // ➔ { a: string } & { b: number } & { c: boolean }
 * ```
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/** -------------------------------------------------------
 * * ***Utility Type: `PrettifyUnionIntersection`.***
 * -------------------------------------------------------
 * **Converts a union type into an **intersection** using ***{@link UnionToIntersection | `UnionToIntersection`}***, and then
 * applies ***{@link Prettify | `Prettify`}*** to simplify the resulting intersection
 * for better readability in IntelliSense and tooltips.**
 * @description
 * Useful when the raw intersection of union types produces
 * deeply nested or hard-to-read structures.
 * @template T - The union type to be converted.
 * @template Options - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * // Basic union ➔ intersection
 * type A = { a: string } | { b: number };
 * type B = PrettifyUnionIntersection<A>;
 * // ➔ { a: string } & { b: number }
 * // final result become ➔ { a: string b: number }
 *
 * // Larger union
 * type C = { a: string } | { b: number } | { c: boolean };
 * type D = PrettifyUnionIntersection<C>;
 * // ➔ { a: string } & { b: number } & { c: boolean }
 * // final result become ➔ { a: string b: number c: boolean }
 *
 * // With PrettifyOptions (custom formatting)
 * type E = PrettifyUnionIntersection<A, { recursive: true }>;
 * ```
 */
export type PrettifyUnionIntersection<
  T,
  Options extends PrettifyOpts = DefaultPrettifyOptions
> = Prettify<UnionToIntersection<T>, Options>;
