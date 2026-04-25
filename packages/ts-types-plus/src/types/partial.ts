import type { Identity } from "./identity";
import type { IsNever } from "./never";
import type { AnyString } from "./string";
import type { PrettifyUnionIntersection } from "./union-to-intersection";
import type {
  PrettifyOptions as PrettifyOpts,
  DefaultPrettifyOptions
} from "./prettify";

/** Internal Helper */

/** Get optional keys of an object */
type OptionalKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [P in keyof T]-?: {} extends Pick<T, P> ? P : never;
}[keyof T];

/** Get required keys of an object */
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;

/** Remove duplicate `undefined` from unions */
type CleanOptional<T> = [T] extends [undefined]
  ? undefined
  : undefined extends T
    ? Exclude<T, undefined> | undefined
    : T;

/** Required keys only (no optional ones) */
type RequiredKeysOf<U> = Exclude<keyof U, OptionalKeys<U>>;

/** Force re-evaluation / cleaner display */

/** -------------------------------------------------------
 * * ***Utility Type: `PartialOnly`.***
 * -------------------------------------------------------
 * **Make only the specified properties in `T` **optional**, while keeping all
 * other properties required.**
 * @template T - The object type to transform.
 * @template K - Keys of `T` that should become optional.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * // Only "a" is optional, "b" and "c" remain required
 * type T0 = PartialOnly<{ a: string; b: number; c: boolean }, "a">;
 * // ➔ { a?: string; b: number; c: boolean }
 *
 * // Both "a" and "b" are optional
 * type T1 = PartialOnly<{ a: string; b: number; c: boolean }, "a" | "b">;
 * // ➔ { a?: string; b?: number; c: boolean }
 *
 * // Only "a" is optional (since "x" is not a valid key of T)
 * type T2 = PartialOnly<{ a: string; b: number; c: boolean }, "a" | "x">;
 * // ➔ { a?: string; b: number; c: boolean }
 * ```
 * - ℹ️ ***If key is never or not in object, all properties remain required:***
 *
 * ```ts
 * type Skip1 = PartialOnly<{ a: string; b: number; c: boolean }, "x">;
 * // ➔ { a: string; b: number; c: boolean }
 *
 * type Skip2 = PartialOnly<{ a: string; b: number; c: boolean }, never>;
 * // ➔ { a: string; b: number; c: boolean }
 * ```
 */
export type PartialOnly<
  T extends object,
  K extends keyof T | AnyString,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> =
  IsNever<K> extends true
    ? T
    : PrettifyUnionIntersection<
        {
          // required keys & not in K ➔ remain required
          [P in Exclude<RequiredKeys<T>, Extract<keyof T, K>>]-?: T[P];
        } & {
          // optional keys & not in K ➔ remain optional (clean duplicate undefined)
          [P in Exclude<OptionalKeys<T>, Extract<keyof T, K>>]+?: CleanOptional<
            T[P]
          >;
        } & {
          // keys in K ➔ forced to optional (also clean duplicate undefined)
          [P in Extract<keyof T, K>]+?: CleanOptional<T[P]>;
        },
        PrettifyOptions
      >;

/** -------------------------------------------------------
 * * ***Utility Type: `PartialExcept`.***
 * -------------------------------------------------------
 * **Make all properties in `T` **optional**, except for the ones specified
 * in `K`, which remain as-is.**
 * - **Behavior:**
 *    - If a property in `K` is originally required ➔ it stays required.
 *    - If a property in `K` is originally optional ➔ it stays optional.
 *    - All other properties become optional.
 *    - Duplicate `undefined` types are cleaned up automatically.
 * @template T - The object type to transform.
 * @template K - Keys of `T` that should remain as-is (not forced optional).
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * // "a" remains required, "b" and "c" become optional
 * type T0 = PartialExcept<{ a: string; b: number; c: boolean }, "a">;
 * // ➔ { a: string; b?: number; c?: boolean }
 *
 * // "a" and "b" remain required, "c" becomes optional
 * type T1 = PartialExcept<{ a: string; b: number; c: boolean }, "a" | "b">;
 * // ➔ { a: string; b: number; c?: boolean }
 *
 * // "b" is originally optional, so it stays optional,
 * // "a" stays required, "c" becomes optional
 * type T2 = PartialExcept<{ a: string; b?: number; c: boolean }, "a" | "b">;
 * // ➔ { a: string; b?: number; c?: boolean }
 *
 * // none of the keys match ➔ everything optional
 * type T3 = PartialExcept<{ a: string; b: number; c: boolean }, "x">;
 * // ➔ { a?: string; b?: number; c?: boolean }
 * ```
 * - ℹ️ ***If key is never, all properties become optional:***
 * ```ts
 * type Skip = PartialExcept<{ a: string; b: number; c: boolean }, never>;
 * // ➔ { a?: string; b?: number; c?: boolean }
 * ```
 */
export type PartialExcept<
  T extends object,
  K extends keyof T | AnyString,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> =
  IsNever<K> extends true
    ? Partial<T>
    : PrettifyUnionIntersection<
        // Step A: build intermediate M that keeps K as-is and makes others Partial
        // (Keep K exactly as in T via Pick, so optional flags on K are preserved)
        // then Step B: re-map M splitting optional/required keys and cleaning unions
        Identity<
          // final object assembled from required & optional groups derived from M
          {
            // required group
            [P in RequiredKeysOf<
              Identity<
                Pick<T, Extract<keyof T, K>> & {
                  [P in Exclude<keyof T, K>]?: T[P];
                }
              >
            >]-?: CleanOptional<
              Identity<
                Pick<T, Extract<keyof T, K>> & {
                  [P in Exclude<keyof T, K>]?: T[P];
                }
              >[P]
            >;
          } & {
            // optional group
            [P in OptionalKeys<
              Identity<
                Pick<T, Extract<keyof T, K>> & {
                  [P in Exclude<keyof T, K>]?: T[P];
                }
              >
            >]+?: CleanOptional<
              Identity<
                Pick<T, Extract<keyof T, K>> & {
                  [P in Exclude<keyof T, K>]?: T[P];
                }
              >[P]
            >;
          }
        >,
        PrettifyOptions
      >;
