/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type {
  AndArr,
  Extends,
  OrArr,
  Prettify,
  TypedArray
} from "@rzl-zone/ts-types-plus";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { toNumberDeep } from "../toNumberDeep";

/** ----------------------------------------------------------
 * * Normalize leaked `never[]` into literal empty array `[]`.
 * ----------------------------------------------------------
 */
type FixNeverArray<T, RemoveEmptyArrays extends boolean> = [T] extends [never[]]
  ? RemoveEmptyArrays extends true
    ? OrArr<[Extends<T, undefined>, Extends<undefined, T>]> extends true
      ? undefined
      : never
    : []
  : T;

/** ----------------------------------------------------------
 * * Simplify object type to remove unnecessary TypeScript wrappers.
 * ----------------------------------------------------------
 */
type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } : T;

/** ----------------------------------------------------------
 * * Deeply convert all numbers and strings to `number | undefined`,
 * * recursively handling arrays, tuples, Sets, Maps, TypedArrays,
 * * and objects. Special types like Date remain unchanged.
 * ----------------------------------------------------------
 *
 * @template T - Input type to convert
 * @template RemoveEmptyObjects - Whether to remove empty objects
 * @template RemoveEmptyArrays - Whether to remove empty arrays
 * @template IsRoot - Internal flag for root level
 */
type ConvertedDeepNumberInternal<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = [T] extends [null | undefined]
  ? IsRoot extends true
    ? undefined
    : never
  : T extends Date | boolean | Boolean
    ? number
    : T extends string | String | Number | number | `${number}`
      ? number | undefined
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
                      ConvertedDeepNumberInternal<
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
                  ConvertedDeepNumberInternal<
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
                    ConvertedDeepNumberInternal<
                      V,
                      RemoveEmptyObjects,
                      RemoveEmptyArrays,
                      IsRoot
                    >,
                    undefined
                  >[],
                  RemoveEmptyArrays
                >
              : FixNeverArray<
                  Exclude<
                    ConvertedDeepNumberInternal<
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
                      ConvertedDeepNumberInternal<
                        K,
                        RemoveEmptyObjects,
                        RemoveEmptyArrays,
                        IsRoot
                      >,
                      undefined
                    >,
                    Exclude<
                      ConvertedDeepNumberInternal<
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
                      ConvertedDeepNumberInternal<
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
                        ConvertedDeepNumberInternal<
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
 * * Recursively map tuples while preserving `never` removals.
 * ----------------------------------------------------------
 */
type _MapTuple<
  Arr extends readonly unknown[],
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = Arr extends readonly [infer H, ...infer R]
  ? Exclude<
      ConvertedDeepNumberInternal<
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
 * ----------------------------------------------------------
 */
type _ConvertedObjectInternal<
  O extends Record<PropertyKey, unknown> | string | number,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = {
  [K in keyof O as Exclude<
    ConvertedDeepNumberInternal<
      O[K],
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      false
    >,
    undefined
  > extends infer Convert
    ? [Convert] extends [never]
      ? never
      : undefined extends ConvertedDeepNumberInternal<
            O[K],
            RemoveEmptyObjects,
            RemoveEmptyArrays,
            IsRoot
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
    ConvertedDeepNumberInternal<
      O[K],
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      false
    >,
    undefined
  >;
} & {
  [K in keyof O as Exclude<
    ConvertedDeepNumberInternal<
      O[K],
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      false
    >,
    undefined
  > extends infer Convert
    ? [Convert] extends [never]
      ? never
      : undefined extends ConvertedDeepNumberInternal<
            O[K],
            RemoveEmptyObjects,
            RemoveEmptyArrays,
            IsRoot
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
    ConvertedDeepNumberInternal<
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
  ? ConvertedDeepNumberInternal<
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
            ? ConvertedDeepNumberInternal<
                M[K],
                RemoveEmptyObjects,
                RemoveEmptyArrays,
                false
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
> = T extends number | number[]
  ? ConvertedDeepNumberInternal<
      T,
      RemoveEmptyObjects,
      RemoveEmptyArrays,
      IsRoot
    >
  : T extends Record<string, unknown>
    ? _ProcessedObject<T, RemoveEmptyObjects, RemoveEmptyArrays, IsRoot>
    : _ProcessedObject<T, RemoveEmptyObjects, RemoveEmptyArrays, IsRoot>;

/** ----------------------------------------------------------
 * * Public type: Deeply converts numbers/strings to `number | undefined`,
 * * applies empty object/array removal, preserves special types.
 * ----------------------------------------------------------
 *
 * **Narrows types result for {@link toNumberDeep | `toNumberDeep`}.***
 */
export type ConvertedDeepNumber<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
> = [unknown] extends [T]
  ? unknown
  : FixNeverArray<
      ConvertedDeepNumberInternal<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays,
        true
      >,
      RemoveEmptyArrays
    >;

/**
 * ***Types options for {@link toNumberDeep | `toNumberDeep`}.***
 */
export type ToNumberDeepOptions<
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
