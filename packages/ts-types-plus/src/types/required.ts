import type { IsNever } from "./never";
import type { NonUndefined } from "./nils";
import type { AnyString } from "./string";
import type { PrettifyUnionIntersection } from "./union-to-intersection";
import type {
  PrettifyOptions as PrettifyOpts,
  DefaultPrettifyOptions
} from "./prettify";

/** Internal Helper */

/** Remove duplicate `undefined` from a type */
type CleanOptional<T> = [T] extends [undefined] ? undefined : T;

/** -------------------------------------------------------
 * * ***Utility Type: `RequiredOnly`.***
 * -------------------------------------------------------
 * **Make only the specified properties in `T` **required**, while keeping the rest unchanged (remain optional if optional).**
 * @template T - The object type to transform.
 * @template K - Keys of `T` that should become required.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * // Only "a" is required, "b" and "c" remain optional
 * type T0 = RequiredOnly<{ a?: number; b?: string; c?: boolean }, "a">;
 * // ➔ { a: number; b?: string; c?: boolean }
 *
 * // Both "a" and "b" are required
 * type T1 = RequiredOnly<{ a?: number; b?: string; c?: boolean }, "a" | "b">;
 * // ➔ { a: number; b: string; c?: boolean }
 *
 * // Only "a" is required (since "x" is not a valid key of T)
 * type T2 = RequiredOnly<{ a?: number; b?: string; c?: boolean }, "a" | "x">;
 * // ➔ { a: number; b?: string; c?: boolean }
 * ```
 * - ℹ️ ***If key is never or not in object, all properties remain unchanged:***
 * ```ts
 * type Skip1 = RequiredOnly<{ a?: number; b?: string; c?: boolean }, "x">;
 * // ➔ { a?: number; b?: string; c?: boolean }
 *
 * type Skip2 = RequiredOnly<{ a?: number; b?: string; c?: boolean }, never>;
 * // ➔ { a?: number; b?: string; c?: boolean }
 * ```
 */
export type RequiredOnly<
  T extends object,
  K extends keyof T | AnyString,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> =
  IsNever<K> extends true
    ? T
    : PrettifyUnionIntersection<
        {
          [P in Exclude<keyof T, K>]?: CleanOptional<T[P]>; // optional
        } & {
          [P in Extract<keyof T, K>]-?: NonUndefined<CleanOptional<T[P]>>; // required
        },
        PrettifyOptions
      >;

/** -------------------------------------------------------
 * * ***Utility Type: `RequiredExcept`.***
 * -------------------------------------------------------
 * **Make **all properties** in `T` required, except the specified keys which remain optional.**
 * @template T - The object type to transform.
 * @template K - Keys of `T` that should remain optional.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * // All required except "a"
 * type T0 = RequiredExcept<{ a?: number; b?: string; c?: boolean }, "a">;
 * // ➔ { a?: number; b: string; c: boolean }
 *
 * // All required except "a" and "b"
 * type T1 = RequiredExcept<{ a?: number; b?: string; c?: boolean }, "a" | "b">;
 * // ➔ { a?: number; b?: string; c: boolean }
 *
 * // Only "a" remains optional (since "x" is not a valid key of T)
 * type T2 = RequiredExcept<{ a?: number; b?: string; c?: boolean }, "a" | "x">;
 * // ➔ { a?: number; b: string; c: boolean }
 * ```
 *
 * - ℹ️ ***If key is never or not in object, all properties become required:***
 * ```ts
 * type Skip1 = RequiredExcept<{ a?: number; b?: string; c?: boolean }, "x">;
 * // ➔ { a: number; b: string; c: boolean }
 *
 * type Skip2 = RequiredExcept<{ a?: number; b?: string; c?: boolean }, never>;
 * // ➔ { a: number; b: string; c: boolean }
 * ```
 */
export type RequiredExcept<
  T extends object,
  K extends keyof T | AnyString,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> =
  IsNever<K> extends true
    ? Required<T>
    : PrettifyUnionIntersection<
        {
          [P in Exclude<keyof T, K>]-?: NonUndefined<CleanOptional<T[P]>>; // optional
        } & {
          [P in Extract<keyof T, K>]?: CleanOptional<T[P]>; // required
        },
        PrettifyOptions
      >;
