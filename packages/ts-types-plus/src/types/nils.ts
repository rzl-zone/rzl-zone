/** --------------------------------------------------
 * * ***Utility Type: `Nullish`.***
 * --------------------------------------------------
 * **Useful as a shorthand when working with optional or missing values.**
 * - **Represents all values considered **`nullish`**:**
 *      - `null`
 *      - `undefined`
 */
export type Nullish = null | undefined;

//? Adding

/** --------------------------------------------------
 * * ***Utility Type: `Nullable`.***
 * --------------------------------------------------
 * **Represents a type that can be either `T` or `null`.**
 * @template T - The base type.
 * @example
 * ```ts
 * type A = Nullable<string>; // ➔ string | null
 * ```
 */
export type Nullable<T> = T | null;

/** --------------------------------------------------
 * * ***Utility Type: `Nilable`.***
 * --------------------------------------------------
 * **Represents a type that can be either `T`, `null`, or `undefined`.**
 * @template T - The base type.
 * @example
 * ```ts
 * type A = Nilable<number>; // ➔ number | null | undefined
 * ```
 */
export type Nilable<T> = T | null | undefined;

/** --------------------------------------------------
 * * ***Utility Type: `Undefinedable`.***
 * --------------------------------------------------
 * **Represents a type that can be either `T` or `undefined`.**
 * @template T - The base type.
 * @example
 * ```ts
 * type A = Undefinedable<boolean>; // ➔ boolean | undefined
 * ```
 */
export type Undefinedable<T> = T | undefined;

//? Checking

/** -------------------------------------------------------
 * * ***Utility Type: `NonNil`.***
 * -------------------------------------------------------
 * **Removes both `null` and `undefined` from the given type `T`.**
 * @template T - The type to filter.
 * @example
 * ```ts
 * type A = NonNil<string | null | undefined>;
 * // ➔ string
 * type B = NonNil<number | null>;
 * // ➔ number
 * type C = NonNil<undefined | null>;
 * // ➔ never
 * type D = NonNil<boolean | undefined>;
 * // ➔ boolean
 * ```
 */
export type NonNil<T> = T extends null | undefined ? never : T;

/** -------------------------------------------------------
 * * ***Utility Type: `NonNull`.***
 * -------------------------------------------------------
 * **Removes `null` from the given type `T`.**
 * @template T - The type to filter.
 * @example
 * ```ts
 * type A = NonNull<string | null>;
 * // ➔ string
 * type B = NonNull<number | null | undefined>;
 * // ➔ number | undefined
 * type C = NonNull<null>;
 * // ➔ never
 * ```
 */
export type NonNull<T> = T extends null ? never : T;

/** -------------------------------------------------------
 * * ***Utility Type: `NonUndefined`.***
 * -------------------------------------------------------
 * **Remove `undefined` from the given type `T`.**
 * @template T - The type to filter.
 * @example
 * ```ts
 * type A = NonUndefined<string | undefined>;
 * // ➔ string
 * type B = NonUndefined<number | null | undefined>;
 * // ➔ number | null
 * type C = NonUndefined<undefined>;
 * // ➔ never
 * ```
 */
export type NonUndefined<T> = T extends undefined ? never : T;

//? Keeps

/** --------------------------------------------------
 * * ***Utility Type: `KeepNil`.***
 * --------------------------------------------------
 * **Keeps `null` and/or `undefined` in the output type **only if** they
 * exist in the input type `T`, otherwise, resolves to `never`.**
 * @template T - Input type to check for `null` and `undefined`.
 * @example
 * ```ts
 * type A = KeepNil<string | null>;
 * // ➔ null
 * type B = KeepNil<number | undefined>;
 * // ➔ undefined
 * type C = KeepNil<string | null | undefined>;
 * // ➔ null | undefined
 * type D = KeepNil<boolean>;
 * // ➔ never
 * ```
 */
export type KeepNil<T> =
  | (null extends T ? null : never)
  | (undefined extends T ? undefined : never);

/** --------------------------------------------------
 * * ***Utility Type: `KeepNull`.***
 * --------------------------------------------------
 * **Keeps `null` in the output type **only if** the input type `T` includes `null`, otherwise resolves to `never`.**
 * @template T - Input type to check for `null`.
 * @example
 * ```ts
 * type A = KeepNull<string | null>; // ➔ null
 * type B = KeepNull<string>;        // ➔ never
 * ```
 */
export type KeepNull<T> = null extends T ? null : never;

/** --------------------------------------------------
 * * ***Utility Type: `KeepUndef`.***
 * --------------------------------------------------
 * **Keeps `undefined` in the output type **only if** the input type `T` includes `undefined`, otherwise resolves to `never`.**
 * @template T - Input type to check for `undefined`.
 * @example
 * ```ts
 * type A = KeepUndef<number | undefined>; // ➔ undefined
 * type B = KeepUndef<number>;             // ➔ never
 * ```
 */
export type KeepUndef<T> = undefined extends T ? undefined : never;

//? Replacing

/** -------------------------------------------------------
 * * ***Utility Type: `NullToUndefined`.***
 * -------------------------------------------------------
 * **Transforms `null` or `undefined` types into `undefined`, otherwise, returns
 * the original type `T` unchanged.**
 * @template T - The input type to transform.
 * @example
 * ```ts
 * type A = NullToUndefined<null>;      // ➔ undefined
 * type B = NullToUndefined<undefined>; // ➔ undefined
 * type C = NullToUndefined<string>;    // ➔ string
 * type D = NullToUndefined<null[]>;    // ➔ null[]
 * type E = NullToUndefined<(string | null)[]>; // ➔ (string | null)[]
 * ```
 */
export type NullToUndefined<T> = T extends null
  ? undefined
  : T extends undefined
    ? undefined
    : T;
