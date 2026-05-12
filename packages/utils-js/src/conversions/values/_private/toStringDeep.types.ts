/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type {
  TypedArray,
  WebApiObjects,
  IntlObjects,
  Prettify,
  AndArr,
  Extends,
  OrArr
} from "@rzl-zone/ts-types-plus";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { toStringDeep } from "../toStringDeep";

/** ----------------------------------------------------------
 * * Normalize leaked `never[]` into literal empty array `[]`.
 * ---------------------------------------------------------- */
type FixNeverArray<T, RemoveEmptyArrays extends boolean> = [T] extends [never[]]
  ? RemoveEmptyArrays extends true
    ? OrArr<[Extends<T, undefined>, Extends<undefined, T>]> extends true
      ? undefined
      : never
    : []
  : T;

/** ----------------------------------------------------------
 * * Simplify object type to remove unnecessary TypeScript wrappers.
 * ---------------------------------------------------------- */
type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } : T;

/** ----------------------------------------------------------
 * * Deeply convert all numbers and numeric strings to `string`,
 * * recursively handling arrays, tuples, Sets, Maps, TypedArrays,
 * * Buffer, and objects. Special types like Date remain unchanged.
 * ---------------------------------------------------------- */
type ConvertedDeepStringInternal<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = [T] extends [null | undefined]
  ? IsRoot extends true
    ? undefined
    : never
  : T extends
        | string
        | boolean
        | String
        | Boolean
        | Date
        | RegExp
        | WebApiObjects
        | IntlObjects
        | { [Symbol.toStringTag]: "Proxy" }
        | typeof Reflect
    ? string
    : T extends Number | number | `${number}`
      ? string | undefined
      : // : AndArr<[Extends<RemoveEmptyObjects, true>, Extends<{}, T>]> extends true
        // ? never
        AndArr<
            [Extends<RemoveEmptyArrays, true>, Extends<T, undefined[]>]
          > extends true
        ? never
        : T extends readonly (infer E)[]
          ? OrArr<
              [
                Extends<RemoveEmptyArrays, true>,
                AndArr<
                  [Extends<RemoveEmptyArrays, true>, Extends<IsRoot, true>]
                >
              ]
            > extends true
            ?
                | FixNeverArray<
                    Exclude<
                      ConvertedDeepStringInternal<
                        E,
                        RemoveEmptyObjects,
                        RemoveEmptyArrays,
                        IsRoot
                      >,
                      undefined
                    >,
                    RemoveEmptyArrays
                  >[]
                | undefined
            : FixNeverArray<
                Exclude<
                  ConvertedDeepStringInternal<
                    E,
                    RemoveEmptyObjects,
                    RemoveEmptyArrays,
                    IsRoot
                  >,
                  undefined
                >[],
                RemoveEmptyArrays
              >
          : T extends Set<infer V>
            ? AndArr<[Extends<RemoveEmptyArrays, true>]> extends true
              ? FixNeverArray<
                  Exclude<
                    ConvertedDeepStringInternal<
                      V,
                      RemoveEmptyObjects,
                      RemoveEmptyArrays,
                      IsRoot
                    >,
                    undefined
                  >,
                  RemoveEmptyArrays
                >
              : FixNeverArray<
                  Exclude<
                    ConvertedDeepStringInternal<
                      V,
                      RemoveEmptyObjects,
                      RemoveEmptyArrays,
                      IsRoot
                    >,
                    undefined
                  >[],
                  RemoveEmptyArrays
                >
            : T extends Map<infer K, infer V>
              ? FixNeverArray<
                  [
                    Exclude<
                      ConvertedDeepStringInternal<
                        K,
                        RemoveEmptyObjects,
                        RemoveEmptyArrays,
                        IsRoot
                      >,
                      undefined
                    >,
                    Exclude<
                      ConvertedDeepStringInternal<
                        V,
                        RemoveEmptyObjects,
                        RemoveEmptyArrays,
                        IsRoot
                      >,
                      undefined
                    >
                  ][],
                  RemoveEmptyArrays
                >
              : T extends Buffer
                ? FixNeverArray<
                    Exclude<
                      ConvertedDeepStringInternal<
                        string,
                        RemoveEmptyObjects,
                        RemoveEmptyArrays,
                        IsRoot
                      >,
                      undefined
                    >[],
                    RemoveEmptyArrays
                  >
                : T extends TypedArray
                  ? FixNeverArray<
                      Exclude<
                        ConvertedDeepStringInternal<
                          string,
                          RemoveEmptyObjects,
                          RemoveEmptyArrays,
                          IsRoot
                        >,
                        undefined
                      >[],
                      RemoveEmptyArrays
                    >
                  : T extends Record<PropertyKey, unknown>
                    ? _ConvertedObjectInternal<
                        T,
                        RemoveEmptyObjects,
                        RemoveEmptyArrays,
                        IsRoot
                      >
                    : never;

/** ----------------------------------------------------------
 * * Remove undefined and keep only items for tuples (in new update is disable)
 * ---------------------------------------------------------- */
type _MapTuple<
  Arr extends readonly unknown[],
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = Arr extends readonly [infer H, ...infer R]
  ? Exclude<
      ConvertedDeepStringInternal<
        H,
        RemoveEmptyObjects,
        RemoveEmptyArrays,
        false
      >,
      undefined
    > extends infer H2
    ? [H2] extends [never]
      ? _MapTuple<R, RemoveEmptyObjects, RemoveEmptyArrays>
      : [H2, ..._MapTuple<R, RemoveEmptyObjects, RemoveEmptyArrays>]
    : never
  : [];

/** ----------------------------------------------------------
 * * Internal object conversion utility.
 * * Removes empty objects/arrays based on flags.
 * ---------------------------------------------------------- */
type _ConvertedObjectInternal<
  O extends Record<string | number | symbol, unknown> | string,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = {
  [K in keyof O as Exclude<
    ConvertedDeepStringInternal<
      O[K],
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      false
    >,
    undefined
  > extends infer Convert
    ? [Convert] extends [never]
      ? never
      : undefined extends ConvertedDeepStringInternal<
            O[K],
            RemoveEmptyObjects,
            RemoveEmptyArrays,
            false
          >
        ? never
        : RemoveEmptyArrays extends true
          ? Convert extends readonly unknown[]
            ? [Convert] extends [[]]
              ? never
              : K
            : K
          : K
    : never]: Exclude<
    ConvertedDeepStringInternal<
      O[K],
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      false
    >,
    undefined
  >;
} & {
  [K in keyof O as Exclude<
    ConvertedDeepStringInternal<
      O[K],
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      false
    >,
    undefined
  > extends infer Convert
    ? [Convert] extends [never]
      ? never
      : undefined extends ConvertedDeepStringInternal<
            O[K],
            RemoveEmptyObjects,
            RemoveEmptyArrays,
            false
          >
        ? RemoveEmptyArrays extends true
          ? Convert extends readonly unknown[]
            ? [Convert] extends [[]]
              ? never
              : K
            : K
          : K
        : never
    : never]?: Exclude<
    ConvertedDeepStringInternal<
      O[K],
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      false
    >,
    undefined
  >;
} extends infer M
  ? RemoveEmptyObjects extends true
    ? keyof M extends never
      ? IsRoot extends true
        ? {}
        : never
      : _ProcessedObject<M, RemoveEmptyObjects, RemoveEmptyArrays, IsRoot>
    : Simplify<M>
  : never;

type AllPropsAreNumber<O> = {
  [K in keyof O]: O[K] extends number | Number
    ? true
    : O[K] extends Record<string, unknown>
      ? AllPropsAreNumber<O[K]>
      : false;
}[keyof O] extends false
  ? false
  : true;
type _ProcessedObject<
  M,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = M extends unknown[]
  ? ConvertedDeepStringInternal<
      M,
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      IsRoot
    >
  : Prettify<
      Simplify<{
        [K in keyof M]: M[K] extends Record<string, unknown>
          ? AllPropsAreNumber<M[K]> extends true
            ?
                | {
                    [ChildKey in keyof M[K]]: M[K][ChildKey] extends
                      | number
                      | Number
                      ? M[K][ChildKey] | undefined
                      : _ProcessedObject<
                          M[K][ChildKey],
                          RemoveEmptyObjects,
                          RemoveEmptyArrays,
                          IsRoot
                        >;
                  }
                | undefined
            : AndArr<
                  [
                    Extends<RemoveEmptyArrays, true>,
                    Extends<RemoveEmptyObjects, true>
                  ]
                > extends true
              ?
                  | {
                      [ChildKey in keyof M[K]]: _ProcessChild<
                        M[K][ChildKey],
                        RemoveEmptyObjects,
                        RemoveEmptyArrays,
                        IsRoot
                      >;
                    }
                  | undefined
              : {
                  [ChildKey in keyof M[K]]: _ProcessChild<
                    M[K][ChildKey],
                    RemoveEmptyObjects,
                    RemoveEmptyArrays,
                    IsRoot
                  >;
                }
          : M[K] extends unknown[]
            ? ConvertedDeepStringInternal<
                M[K],
                RemoveEmptyObjects,
                RemoveEmptyArrays,
                IsRoot
              >
            : _ProcessedObject<
                M[K],
                RemoveEmptyObjects,
                RemoveEmptyArrays,
                IsRoot
              >;
      }>,
      { recursive: true }
    >;
type _ProcessChild<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = T extends number | Number[]
  ? ConvertedDeepStringInternal<
      T,
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      IsRoot
    >
  : T extends Record<string, unknown>
    ? _ProcessedObject<T, RemoveEmptyObjects, RemoveEmptyArrays, IsRoot>
    : _ProcessedObject<T, RemoveEmptyObjects, RemoveEmptyArrays, IsRoot>;

//! (in new update is disable)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type HasArrayDeep<T> = T extends unknown[]
  ? true
  : T extends Record<string, unknown>
    ? { [K in keyof T]: HasArrayDeep<T[K]> }[keyof T] extends true
      ? true
      : false
    : false;

/** ----------------------------------------------------------
 * * Public type: Deeply converts numbers/strings to `string`,
 * * applies empty object/array removal, preserves special types.
 * ----------------------------------------------------------
 * ***Narrows types result for {@link toStringDeep | `toStringDeep`}.***
 */
export type ConvertedDeepString<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
> = [unknown] extends [T]
  ? unknown
  : FixNeverArray<
      Simplify<
        ConvertedDeepStringInternal<
          T,
          RemoveEmptyObjects,
          RemoveEmptyArrays,
          true
        >
      >,
      RemoveEmptyArrays
    >;

/**
 * ***Types options for {@link toStringDeep | `toStringDeep`}.***
 */
export type ToStringDeepOptions<
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
> = {
  /** Whether to remove empty objects (`{}`) from the result.
   *
   * - `true` ➔ remove empty objects recursively.
   * - `false` **(default)** ➔ keep empty objects as-is.
   *
   * @default false
   */
  removeEmptyObjects?: RemoveEmptyObjects;
  /** Whether to remove empty arrays (`[]`) from the result.
   *
   * - `true` ➔ remove empty arrays recursively.
   * - `false` **(default)** ➔ keep empty arrays as-is.
   *
   * @default false
   */
  removeEmptyArrays?: RemoveEmptyArrays;
};
