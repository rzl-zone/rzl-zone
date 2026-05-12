import type { Prettify, NumberRangeUnion } from "@rzl-zone/ts-types-plus";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { removeObjectPaths } from "../removeObjectPaths";

type Prev = [never, NumberRangeUnion<1, 30>];
type DotPath<
  T,
  Prefix extends string = "",
  Depth extends number = NumberRangeUnion<1, 30>
> = Depth extends never
  ? never
  : T extends (infer U)[]
    ? U extends object
      ? DotPath<U, `${Prefix}`, Prev[Depth]>
      : never
    : T extends object
      ? {
          [K in Extract<keyof T, string>]: T[K] extends object
            ? DotPath<T[K], `${Prefix}${K}.`, Prev[Depth]> | `${Prefix}${K}`
            : `${Prefix}${K}`;
        }[Extract<keyof T, string>]
      : never;

// ------------------------------

type KeysToRemove<
  T,
  K extends readonly ConfigRemoveObjectPaths<T>[]
> = K[number] extends { key: infer Key }
  ? Key extends string
    ? Key
    : never
  : never;
type RemoveNested<T, K extends string> =
  T extends Array<infer U>
    ? RemoveNested<U, K>[]
    : T extends object
      ? K extends `${infer Head}.${infer Rest}`
        ? Head extends keyof T
          ? { [P in keyof T]: P extends Head ? RemoveNested<T[P], Rest> : T[P] }
          : T
        : SafeRemove<T, K>
      : T;

type SafeRemove<T, K extends string> = K extends keyof T ? Omit<T, K> : T;

type ChangeNeverArrayToArrayDeep<T> = T extends never[]
  ? []
  : T extends Array<infer U>
    ? ChangeNeverArrayToArrayDeep<U>[]
    : T extends object
      ? { [K in keyof T]: ChangeNeverArrayToArrayDeep<T[K]> }
      : T;

/**
 * ***Types options for {@link removeObjectPaths | `removeObjectPaths`}.***
 */
export type ConfigRemoveObjectPaths<T> = {
  /** ------------------------------------------------------------------------
   * * ***The dot-notation path to the property that should be removed.
   * Can target deeply nested properties (e.g., `"left.data.sensitive"`).***
   * ------------------------------------------------------------------------
   * **This is resolved relative to the root object `T`, and supports
   * any valid **{@link DotPath | `DotPath`}** path within it.**
   *
   * @example
   * const obj = {
   *   left: { data: { sensitive: "secret", id: 1 } },
   *   right: { data: { debug: true, keep: "yes" } },
   * };
   *
   * // Removes "left.data.sensitive" and "right.data.debug"
   * const result = removeObjectPaths(obj, [
   *   { key: "left.data.sensitive" },
   *   { key: "right.data.debug" },
   * ]);
   * console.log(result);
   * // {
   * //   left: { data: { id: 1 } },
   * //   right: { data: { keep: "yes" } },
   * // };
   */
  key: DotPath<T>;
  /** ------------------------------------------------------------------------
   * * ***When `true`, removes the specified property from **all matching nested levels**,
   * including occurrences inside arrays, defaults to `false` for single-level removal.***
   * ------------------------------------------------------------------------
   * **Useful if the target property might appear multiple times across different
   * branches or array elements.**
   * @default false
   * @example
   * const obj = {
   *   items: [
   *     { data: { sensitive: "one", keep: true } },
   *     { data: { sensitive: "two", keep: true } },
   *     { other: { sensitive: "other" } },
   *   ]
   * };
   *
   * // Removes all "data.sensitive" occurrences inside items[]
   * const result = removeObjectPaths(obj, [{ key: "items.data.sensitive", deep: true }]);
   * console.log(result);
   * // {
   * //   items: [
   * //     { data: { keep: true } },
   * //     { data: { keep: true } },
   * //     { other: { sensitive: "other" } },
   * //   ]
   * // };
   */
  deep?: boolean;
};

/**
 * ***Narrows types result for {@link removeObjectPaths | `removeObjectPaths`}.***
 */
export type ResultRemoveObjectPaths<
  T,
  K extends readonly ConfigRemoveObjectPaths<T>[]
> =
  Prettify<
    RemoveNested<ChangeNeverArrayToArrayDeep<T>, KeysToRemove<T, K>>,
    { recursive: true }
  > extends never
    ? T
    : Prettify<
        RemoveNested<ChangeNeverArrayToArrayDeep<T>, KeysToRemove<T, K>>,
        { recursive: true }
      >;
