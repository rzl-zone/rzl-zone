import type {
  DefaultPrettifyOptions,
  Prettify,
  PrettifyOptions as PrettifyOpts
} from "./prettify";

/** -------------------------------------------------------
 * * ***Utility Type: `NonNullableObject`.***
 * -------------------------------------------------------
 * **Makes all properties of the object type `T` non-nullable.**
 * @template T - Object type to transform.
 * @example
 * ```ts
 * type A = NonNullableObject<{ a: string | null; b: number | undefined }>;
 * // ➔ { a: string; b: number }
 * ```
 */
export type NonNullableObject<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

/** -------------------------------------------------------
 * * ***Utility Type: `NonNullableObjectOnly`.***
 * -------------------------------------------------------
 * **Makes only the specified properties `K` of the object type `T` non-nullable.**
 * @template T - Object type to transform.
 * @template K - Keys of `T` to make non-nullable.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * type A = NonNullableObjectOnly<
 *   { a: string | null; b: number | undefined; c: boolean | null },
 *   "a" | "b"
 * >;
 * // ➔ { a: string; b: number; c: boolean | null }
 * ```
 */
export type NonNullableObjectOnly<
  T,
  K extends keyof T,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> = Prettify<
  Pick<T, Exclude<keyof T, K>> & {
    [P in K]: NonNullable<T[P]>;
  },
  PrettifyOptions
>;

/** -------------------------------------------------------
 * * ***Utility Type: `NonNullableObjectExcept`.***
 * -------------------------------------------------------
 * **Makes all properties of the object type `T` non-nullable except for the specified properties `K`.**
 * @template T - Object type to transform.
 * @template K - Keys of `T` to leave unchanged.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * type A = NonNullableObjectExcept<
 *   { a: string | null; b: number | undefined; c: boolean | null },
 *   "c"
 * >;
 * // ➔ { a: string; b: number; c: boolean | null }
 * ```
 */
export type NonNullableObjectExcept<
  T,
  K extends keyof T,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> = Prettify<
  Pick<T, K> & {
    [P in Exclude<keyof T, K>]: NonNullable<T[P]>;
  },
  PrettifyOptions
>;
