import type { AnyFunction } from "./functions";
import type {
  Prettify,
  PrettifyOptions as PrettifyOpts,
  DefaultPrettifyOptions
} from "./prettify";
import type { Primitive } from "./primitive";

/** -------------------------------------------------------
 * * ***Utility Type: `ReadonlyOnly`.***
 * -------------------------------------------------------
 * **Makes the specified keys `K` of an object type `T` readonly,
 * while leaving the other properties mutable.**
 * @template T - The object type.
 * @template K - Keys of `T` to make readonly.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * type T0 = ReadonlyOnly<{ a: string; b: number }, 'a'>;
 * // ➔ { readonly a: string; b: number }
 *
 * type T1 = ReadonlyOnly<{ x: boolean; y: number; z: string }, 'y' | 'z'>;
 * // ➔ { x: boolean; readonly y: number; readonly z: string }
 * ```
 */
export type ReadonlyOnly<
  T extends object,
  K extends keyof T,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> = Prettify<
  Pick<T, Exclude<keyof T, K>> & {
    readonly [P in K]: T[P];
  },
  PrettifyOptions
>;

/** -------------------------------------------------------
 * * ***Utility Type: `ReadonlyExcept`.***
 * -------------------------------------------------------
 * **Makes all properties of an object type `T` readonly,
 * except for the specified keys `K` which remain mutable.**
 * @template T - The object type.
 * @template K - Keys of `T` to remain mutable.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * type T0 = ReadonlyExcept<{ a: string; b: number }, 'a'>;
 * // ➔ { a: string; readonly b: number }
 *
 * type T1 = ReadonlyExcept<{ x: boolean; y: number; z: string }, 'x' | 'z'>;
 * // ➔ { x: boolean; readonly y: number; z: string }
 * ```
 */
export type ReadonlyExcept<
  T extends object,
  K extends keyof T,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> = Prettify<
  Pick<T, K> & {
    readonly [P in Exclude<keyof T, K>]: T[P];
  },
  PrettifyOptions
>;

/** `ReadonlyDeep` helper */
type Builtin = Primitive | AnyFunction | Date | RegExp | Error;
/** `ReadonlyDeep` helper */
type _ReadonlyDeep<
  T,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> =
  // Builtins
  T extends Builtin
    ? T
    : // Promise
      T extends Promise<infer U>
      ? Promise<_ReadonlyDeep<U, PrettifyOptions>>
      : // Map
        T extends Map<infer K, infer V>
        ? ReadonlyMap<
            _ReadonlyDeep<K, PrettifyOptions>,
            _ReadonlyDeep<V, PrettifyOptions>
          >
        : // WeakMap
          T extends WeakMap<infer K, infer V>
          ? WeakMap<
              _ReadonlyDeep<K, PrettifyOptions>,
              _ReadonlyDeep<V, PrettifyOptions>
            >
          : // Set
            T extends Set<infer U>
            ? ReadonlySet<_ReadonlyDeep<U, PrettifyOptions>>
            : // WeakSet
              T extends WeakSet<infer U>
              ? WeakSet<_ReadonlyDeep<U, PrettifyOptions>>
              : // Tuple
                T extends readonly [infer A, ...infer B]
                ? readonly [
                    _ReadonlyDeep<A, PrettifyOptions>,
                    ...{
                      [K in keyof B]: _ReadonlyDeep<B[K], PrettifyOptions>;
                    }
                  ]
                : // Array
                  T extends ReadonlyArray<infer U>
                  ? ReadonlyArray<_ReadonlyDeep<U, PrettifyOptions>>
                  : // Object
                    T extends object
                    ? {
                        readonly [K in keyof T]: _ReadonlyDeep<
                          T[K],
                          PrettifyOptions
                        >;
                      }
                    : T;

// type _ReadonlyDeep<T> = T extends Builtin
//   ? T
//   : T extends Promise<infer U>
//     ? Promise<_ReadonlyDeep<U>>
//     : T extends Map<infer K, infer V>
//       ? ReadonlyMap<_ReadonlyDeep<K>, _ReadonlyDeep<V>>
//       : T extends Set<infer U>
//         ? ReadonlySet<_ReadonlyDeep<U>>
//         : T extends object
//           ? { readonly [K in keyof T]: _ReadonlyDeep<T[K]> }
//           : T;

/** -------------------------------------------------------
 * * ***Utility Type: `ReadonlyDeep`.***
 * -------------------------------------------------------
 * **Recursively converts a type `T` into a deeply readonly structure.**
 *
 * All nested properties become immutable, including objects,
 * arrays, tuples, maps, sets, and promises.
 *
 * Built-in types such as primitives, functions, `Date`, `RegExp`,
 * and `Error` are preserved as-is.
 *
 * @template T - The type to transform into a deeply readonly type.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 *
 * @example
 * ```ts
 * type T0 = ReadonlyDeep<{
 *   user: {
 *     name: string
 *     roles: string[]
 *   }
 * }>
 *
 * // ➔ {
 * //   readonly user: {
 * //     readonly name: string
 * //     readonly roles: readonly string[]
 * //   }
 * // }
 *
 * type T1 = ReadonlyDeep<{
 *   cache: Map<string, { value: number }>
 * }>
 *
 * // ➔ {
 * //   readonly cache: ReadonlyMap<string, { readonly value: number }>
 * // }
 * ```
 */
export type ReadonlyDeep<
  T,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> = Prettify<_ReadonlyDeep<T, PrettifyOptions>, PrettifyOptions>;
