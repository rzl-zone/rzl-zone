/* eslint-disable @typescript-eslint/no-explicit-any */
/** -------------------------------------------------------
 * * ***Utility Type: `DeepMergeArrayUnion`.***
 * -------------------------------------------------------
 * **Recursively merges element types of nested arrays inside an array type,
 * **preserving the nested array structure**.**
 * - Converts an array of nested arrays into a union of its element types,
 *   while keeping the nested arrays intact.
 * @template T - The outer array type.
 * @returns The nested array type with merged element types.
 * @example
 * ```ts
 * const test = [
 *   ["a", null],
 *   ["b", [undefined, "c"]],
 * ];
 *
 * type Merged = DeepMergeArrayUnion<typeof test>;
 * // ➔ ((string | null | (string | undefined)[])[])[]
 * ```
 */
export type DeepMergeArrayUnion<T extends any[]> = T extends (infer U)[]
  ? U extends any[]
    ? DeepMergeArrayUnionHelper<U>[]
    : U[]
  : never;

type DeepMergeArrayUnionHelper<T> = T extends (infer U)[]
  ? DeepMergeArrayUnionHelper<U> | Exclude<T, any[]>
  : T;
