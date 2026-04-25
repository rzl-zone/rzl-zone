import type { And, AndArr } from "./and";
import type { ArrayElementType } from "./array-element-type";
import type { IsEqual } from "./equal";
import type { Extends } from "./extends";
import type { AnyFunction } from "./functions";
import type { Increment } from "./increment";
import type { IsArrayIndex } from "./is-array-index";
import type { IsTuple } from "./is-tuple";
import type { Join } from "./join";
import type { IsNever } from "./never";
import type { Not } from "./not";
import type { Or } from "./or";
import type { Prettify } from "./prettify";
import type { IsUnknown } from "./unknown";
import type { ValueOf, ValueOfArray } from "./value-of";

/** -------------------------------------------------------
 * * ***Utility Type: `OverWritable`.***
 * -------------------------------------------------------
 * **Option type to signal that some properties can be overwritten when
 * applying default options.**
 * @property overwriteDefault - If true, all options in the passed `Options`
 *   object will **overwrite** defaults, even if rules say otherwise.
 */
type OverWritable = {
  /** If true, all options in the passed `Options` object will **overwrite** defaults, even if rules say otherwise, defaultValue: `false`.
   *
   * @default false
   */
  overwriteDefault?: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `ApplyDefaultOptions`.***
 * -------------------------------------------------------
 * **Type-level utility that merges a user-specified `Options` object
 * with a `DefaultOptions` object using a set of `OverwriteRules`.**
 * @template BaseOptions - The base type of all options.
 * @template Options - User-specified options that may override defaults.
 * @template DefaultOptions - Default values for options.
 * @template OverwriteRules - A mapping that indicates which keys
 *   should always allow overwriting defaults.
 * @template OverwriteDefault - If true, all options in `Options`
 *   overwrite defaults regardless of rules.
 * @remarks
 * - Recursively applies defaults for nested objects.
 * - Only objects that are non-nullable and non-unknown are recursively merged.
 * - If a property is **not an object** or recursion is not needed,
 *   it either takes the value from `Options` or merges `Options[K] | DefaultOptions[K]`.
 * - Helps safely build strongly typed configuration objects with defaults.
 * @example
 * ```ts
 * type Base = {
 *   a: { x: number; y: string };
 *   b: boolean;
 * };
 *
 * type Defaults = {
 *   a: { x: 1; y: "default" };
 *   b: true;
 * };
 *
 * type UserOptions = {
 *   a: { y: "custom" };
 * };
 *
 * type Result = ApplyDefaultOptions<Base, UserOptions, Defaults, { a: true; b: false }>;
 * // Result: {
 * //   a: { x: 1; y: "custom"; tra: "test" };
 * //   b: boolean;
 * // }
 * ```
 */
type ApplyDefaultOptions<
  BaseOptions,
  Options extends BaseOptions,
  DefaultOptions extends BaseOptions,
  OverwriteRules,
  OverwriteDefault extends boolean = false
> = Prettify<{
  [K in keyof BaseOptions]-?: K extends keyof Options
    ? AndArr<
        [
          Extends<NonNullable<BaseOptions[K]>, object>,
          Not<IsNever<DefaultOptions[K]>>,
          Not<IsUnknown<BaseOptions[K]>>
        ]
      > extends true
      ? ApplyDefaultOptions<
          NonNullable<BaseOptions[K]>,
          // Options[K],
          Extract<Options[K], NonNullable<BaseOptions[K]>>,
          // DefaultOptions[K],
          Extract<DefaultOptions[K], NonNullable<BaseOptions[K]>>,
          OverwriteRules[K & keyof OverwriteRules],
          OverwriteDefault
        > & {
          tra: "test";
        }
      : Or<
            IsEqual<OverwriteDefault, true>,
            And<
              Extends<K, keyof OverwriteRules>,
              Extends<OverwriteRules[K & keyof OverwriteRules], true>
            >
          > extends true
        ? Options[K]
        : Options[K] | DefaultOptions[K]
    : DefaultOptions[K];
}>;

/** --------------------------------------------------------------
 * * ***Options for {@link PathToFields | **`PathToFields`**} type-level utility.***
 * --------------------------------------------------------------
 * @template ignoredTypes - Types to ignore completely.
 * @template stopTypes - Types at which recursion stops and returns `[]`.
 * @template limit - Max recursion depth.
 * @template format - Output format, `"dot"` or `"array"`.
 * @template ignoredKeys - Keys to ignore when generating paths.
 * @template arrayIndexing - Options for handling array paths.
 */
export type PathToFieldsOptions = Prettify<
  OverWritable & {
    /** Types to ignored completely (default: `undefined`).
     *
     * @default undefined
     */
    ignoredTypes?: unknown;
    /** Types at which recursion stops (default: `undefined`).
     *
     * @default undefined
     */
    stopTypes?: unknown;
    /** Max recursion depth (default: `10`).
     *
     * @default 10
     */
    limit?: number;
    /** Format Output Options:
     * - `"dot"` ➔ dot-notation strings, default output (`"a.b.c"`).
     * - `"array"` ➔ array of path segments (`["a", "b", "c"]`).
     *
     * @default "dot"
     */
    format?: "dot" | "array";
    /** Keys to skip when generating paths (default: `undefined`).
     *
     * @default undefined
     */
    ignoredKeys?: PropertyKey;
    /** Options for array Indexing (default: `{ exactIndexes: false }`).
     *
     * When `arrayIndexing.exactIndexes = true` ➔ outputs exact tuple indexes (`"arr.0"`), otherwise generic `"arr.${number}"`.
     * @default undefined
     */
    arrayIndexing?: {
      /** Options for array Exact Indexing (default: `false`).
       *
       * When `exactIndexes = true` ➔ outputs exact tuple indexes (`"arr.0"`), otherwise generic `"arr.${number}"`.
       * - For increase limit indexing, you can set `limit` options, default
       *   limit is: `10`.
       * @default false
       */
      exactIndexes: boolean;
    };
  },
  { recursive: true }
>;
/** * ***Default options for {@link PathToFields}.*** */
export type DefaultPathToFieldsOptions = {
  ignoredTypes: never;
  stopTypes: string | number | boolean | symbol | Date | AnyFunction;
  format: "dot";
  limit: 10;
  ignoredKeys: never;
  arrayIndexing: {
    exactIndexes: false;
  };
};

type OverwriteRules = {
  limit: true;
  format: true;
  arrayIndexing: {
    exactIndexes: true;
  };
};

type Booleanize<T> = T extends true ? true : false;

type _PathToFieldsArray<
  T extends readonly unknown[],
  Options extends PathToFieldsOptions,
  Iteration extends number = 0
> =
  And<
    IsTuple<T>,
    IsEqual<
      Booleanize<
        Options["arrayIndexing"] extends { exactIndexes: infer E } ? E : false
      >,
      true
    >
  > extends true
    ? ValueOfArray<{
        [K in keyof T]: IsArrayIndex<K> extends true
          ? [K, ..._PathToFields<T[K], Options, Increment<Iteration>>]
          : never;
      }>
    : ArrayElementType<T> extends infer ElementType
      ? [
          `${number}`,
          ...(ElementType extends ElementType
            ? _PathToFields<ElementType, Options, Increment<Iteration>>
            : never)
        ]
      : never;

type _PathToFields<
  T,
  Options extends PathToFieldsOptions,
  Iteration extends number = 0
> = T extends Options["ignoredTypes"]
  ? never
  : T extends Options["stopTypes"]
    ? []
    : IsEqual<Iteration, Options["limit"]> extends true
      ? never
      : T extends readonly unknown[]
        ? _PathToFieldsArray<T, Options, Iteration>
        : ValueOf<{
            [K in Exclude<
              keyof T,
              symbol | Options["ignoredKeys"]
            >]: NonNullable<T[K]> extends infer NonNullableFields
              ? NonNullableFields extends readonly unknown[]
                ? [
                    K,
                    ..._PathToFieldsArray<NonNullableFields, Options, Iteration>
                  ]
                : [
                    K,
                    ..._PathToFields<
                      NonNullableFields,
                      Options,
                      Increment<Iteration>
                    >
                  ]
              : never;
          }>;

/** -------------------------------------------------------
 * * ***Utility Type: `PathToFields`.***
 * -------------------------------------------------------
 * **Generates **all possible property paths** within a type `T`.
 * Supports nested objects, arrays, tuples, and optional configuration.**
 * @template T - Object type to extract paths from.
 * @template Options - Optional configuration.
 * @example
 * ```ts
 * // Nested object
 * type T1 = PathToFields<{ a: { b: { c: number } } }>;
 * // Result: "a.b.c"
 *
 * // Array of objects (dot notation, default)
 * type T2 = PathToFields<{ arr: { id: string; value: number }[] }>;
 * // Result: "arr.${number}.id" | "arr.${number}.value"
 *
 * // Output format as array of path segments
 * type T4 = PathToFields<
 *   { user: { profile: { name: string } } },
 *   { format: "array" }
 * >;
 * // Result: ["user", "profile", "name"]
 *
 * // Ignoring specific keys
 * type T5 = PathToFields<
 *   { id: string; password: string; profile: { bio: string } },
 *   { ignoredKeys: "password" }
 * >;
 * // Result: "id" | "profile.bio"
 *
 * // Stopping recursion at specific types
 * type T6 = PathToFields<
 *   { settings: Date; nested: { inner: number } },
 *   { stopTypes: Date }
 * >;
 * // Result: "settings" | "nested.inner"
 * ```
 * @remarks
 * - `Options.format = "dot"` ➔ dot-notation strings, default output (`"a.b.c"`).
 * - `Options.format = "array"` ➔ array of path segments (`["a", "b", "c"]`).
 * - `Options.limit` ➔ max recursion depth (default 10).
 * - `Options.stopTypes` ➔ types at which recursion stops.
 * - `Options.ignoredTypes` ➔ types ignored completely.
 * - `Options.ignoredKeys` ➔ keys to skip when generating paths.
 * - `Options.arrayIndexing.exactIndexes = true` ➔ outputs exact tuple indexes (`"arr.0"`), otherwise generic `"arr.${number}"`.
 */
export type PathToFields<T, Options extends PathToFieldsOptions = never> = (
  IsNever<Options> extends true
    ? DefaultPathToFieldsOptions
    : ApplyDefaultOptions<
        Omit<PathToFieldsOptions, keyof OverWritable>,
        Options,
        DefaultPathToFieldsOptions,
        OverwriteRules,
        PathToFieldsOptions["overwriteDefault"] extends boolean
          ? PathToFieldsOptions["overwriteDefault"]
          : false
      >
) extends infer MergedOptions extends PathToFieldsOptions
  ? _PathToFields<T, MergedOptions> extends infer Paths extends readonly (
      | string
      | number
    )[]
    ? IsEqual<MergedOptions["format"], "dot"> extends true
      ? Paths extends Paths
        ? Join<Paths, ".">
        : never
      : Paths
    : never
  : never;
