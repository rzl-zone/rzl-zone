/** -------------------------------------------------------
 * * ***Utility Type: `FixNeverArrayRecursive`.***
 * -------------------------------------------------------
 * **A type-level utility that **recursively transforms arrays of type `never[]` into empty arrays**.**
 * - **Behavior:**
 *      - Preserves `readonly` modifiers.
 *      - Applies recursively for nested arrays.
 *      - Leaves other types unchanged.
 * @template T - The input type to recursively fix.
 * @example
 * ```ts
 * type A = FixNeverArrayRecursive<never[]>;
 * // ➔ []
 * type B = FixNeverArrayRecursive<readonly never[]>;
 * // ➔ readonly []
 * type C = FixNeverArrayRecursive<string[]>;
 * // ➔ string[]
 * type D = FixNeverArrayRecursive<(never | string)[]>;
 * // ➔ (never | string)[]
 * type E = FixNeverArrayRecursive<(never[])[]>;
 * // ➔ [][]
 * ```
 */
export type FixNeverArrayRecursive<T> = T extends readonly never[]
  ? T extends never[]
    ? []
    : readonly []
  : T extends (infer U)[]
    ? FixNeverArrayRecursive<U>[]
    : T extends readonly (infer U)[]
      ? readonly FixNeverArrayRecursive<U>[]
      : T;

/** -------------------------------------------------------
 * * ***Utility Type: `NormalizeEmptyArraysRecursive`.***
 * -------------------------------------------------------
 * **A type-level utility that **recursively normalizes empty array types** by converting arrays whose element type is `never`, `null`, or `undefined` into empty tuple types (`[]`).**
 * - **Behavior:**
 *      - Preserves `readonly` modifiers.
 *      - Recurses into nested arrays.
 *      - Leaves other array types unchanged.
 * @template T - The input type to normalize.
 * @example
 * ```ts
 * type A = NormalizeEmptyArraysRecursive<never[]>;
 * // ➔ []
 * type B = NormalizeEmptyArraysRecursive<readonly never[]>;
 * // ➔ readonly []
 * type C = NormalizeEmptyArraysRecursive<null[]>;
 * // ➔ []
 * type D = NormalizeEmptyArraysRecursive<(null[] | string[])[]>;
 * // ➔ ([] | string[])[]
 * type E = NormalizeEmptyArraysRecursive<string[]>;
 * // ➔ string[]
 * ```
 */
export type NormalizeEmptyArraysRecursive<T> = T extends readonly (infer U)[]
  ? U extends never | null | undefined
    ? T extends readonly unknown[]
      ? T extends (infer _E)[]
        ? []
        : readonly []
      : never
    : T extends (infer _E)[]
      ? NormalizeEmptyArraysRecursive<U>[]
      : readonly NormalizeEmptyArraysRecursive<U>[]
  : T;

/** -------------------------------------------------------
 * * ***Utility Type: `RemoveEmptyArrayElements`.***
 * -------------------------------------------------------
 * **A type-level utility that **recursively removes empty array elements (`[]`) from a tuple type**.**
 * - **Behavior:**
 *      - If `T` is a tuple, checks the first element:
 *          - If `Head` is an empty array type (`[]`), it is removed.
 *          - Otherwise, `Head` is preserved.
 *      - Repeats recursively on the rest of the tuple.
 *      - Leaves non-tuple types unchanged.
 * @template T - The tuple type to process.
 * @example
 * ```ts
 * type A = RemoveEmptyArrayElements<[[], 1, [], 2]>;
 * // ➔ [1, 2]
 * type B = RemoveEmptyArrayElements<[]>;
 * // ➔ []
 * type C = RemoveEmptyArrayElements<[[], [], []]>;
 * // ➔ []
 * type D = RemoveEmptyArrayElements<[1, 2, 3]>;
 * // ➔ [1, 2, 3]
 * ```
 */
export type RemoveEmptyArrayElements<T> = T extends [infer Head, ...infer Tail]
  ? Head extends []
    ? RemoveEmptyArrayElements<Tail>
    : [Head, ...RemoveEmptyArrayElements<Tail>]
  : T extends []
    ? []
    : T;
