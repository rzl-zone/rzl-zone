/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import type { IsAny } from "./any";
import type { IsNever } from "./never";
import type { IsUnknown } from "./unknown";
import type { IsExactly } from "./is-exactly";
import type { AnyFunction } from "./functions";
import type { TypedArray } from "./type-data";

/** -------------------------------------------------------
 * * ***Utility Type: `IsGeneralArray`.***
 * -------------------------------------------------------
 * **Checks if `T` is a **general array type** (`X[]` or `ReadonlyArray<X>`)
 * instead of a tuple literal.**
 * - **Behavior:**
 *      - Returns `true` for `string[]`, `(number | boolean)[]`, `any[]`, etc.
 *      - Returns `false` for tuples like `[]`, `[1, 2, 3]`, or `[string, number]`.
 * @template T - The type to check.
 * @example
 * ```ts
 * type A = IsGeneralArray<string[]>;  // ➔ true
 * type B = IsGeneralArray<[]>;        // ➔ false
 * type C = IsGeneralArray<[1, 2, 3]>; // ➔ false
 * type D = IsGeneralArray<ReadonlyArray<number>>; // ➔ true
 * ```
 */
type IsGeneralArray<T> = T extends readonly unknown[]
  ? number extends T["length"] // length = number ➔ general array
    ? true
    : false
  : false;

/** -------------------------------------------------------
 * * ***Utility Type: `IsBaseType`.***
 * -------------------------------------------------------
 * **Determines whether a type `T` is considered a **base / keyword / built-in type**
 * rather than a literal, tuple, or specific instance.**
 * - **Behavior:**
 *      - ***✅ Considered base types:***
 *          - Special keywords: `any`, `unknown`, `never`, `null`, `undefined`, `void`
 *          - Primitive keywords: `string`, `number`, `boolean`, `bigint`, `symbol`
 *          - Function keyword `Function` and alias `AnyFunction`
 *          - General arrays (`X[]`, `ReadonlyArray<X>`) and `TypedArray`
 *          - Common built-ins: `Date`, `RegExp`, `Error`
 *          - Generic containers: `Promise<any>`, `Map<any,any>`, `WeakMap<object,any>`, `Set<any>`, `WeakSet<object>`
 *          - Buffers & views: `ArrayBuffer`, `SharedArrayBuffer`, `DataView`
 *          - `object` keyword and `{}` (empty object type)
 *      - ***❌ Not considered base types:***
 *          - Literal values (`"foo"`, `123`, `true`)
 *          - Union literals (`"a" | "b"`)
 *          - Tuples (`[1, 2, 3]`, `[]`)
 *          - Specific object shapes (`{ a: 1 }`, `{ x: string }`)
 *          - Functions with explicit structure (`() => {}`, `(x: number) => string`)
 * @template T - The type to evaluate.
 * @example
 * ```ts
 * // Special keywords
 * type A = IsBaseType<any>;     // ➔ true
 * type B = IsBaseType<unknown>; // ➔ true
 * type C = IsBaseType<never>;   // ➔ true
 *
 * // Primitives
 * type PS1 = IsBaseType<string>;  // ➔ true
 * type PS2 = IsBaseType<"hi">;    // ➔ false
 * type PN1 = IsBaseType<number>;  // ➔ true
 * type PN2 = IsBaseType<42>;      // ➔ false
 * type PB1 = IsBaseType<boolean>; // ➔ true
 * type PB2 = IsBaseType<true>;    // ➔ false
 * type PB3 = IsBaseType<false>;   // ➔ false
 * type PBi1 = IsBaseType<bigint>; // ➔ true
 * type PBi2 = IsBaseType<123n>;   // ➔ false
 *
 * // Functions
 * type H = IsBaseType<Function>;    // ➔ true
 * type I = IsBaseType<AnyFunction>; // ➔ true
 * type J = IsBaseType<() => {}>;    // ➔ false
 *
 * // Arrays
 * type K = IsBaseType<[]>;       // ➔ false
 * type L = IsBaseType<string[]>; // ➔ true
 * type M = IsBaseType<(string | number)[]>; // ➔ true
 *
 * // Built-ins
 * type N = IsBaseType<Date>;         // ➔ true
 * type O = IsBaseType<new Date()>;   // ➔ false
 * type P = IsBaseType<Promise<any>>; // ➔ true
 * type Q = IsBaseType<Promise<42>>;  // ➔ false
 *
 * // Objects
 * type R = IsBaseType<object>;   // ➔ true
 * type S = IsBaseType<{ a: 1 }>; // ➔ false
 * type T = IsBaseType<{}>;       // ➔ true
 * ```
 */
export type IsBaseType<T> =
  // special keywords
  IsAny<T> extends true
    ? true
    : IsUnknown<T> extends true
      ? true
      : IsNever<T> extends true
        ? true
        : IsExactly<T, null> extends true
          ? true
          : IsExactly<T, undefined> extends true
            ? true
            : IsExactly<T, void> extends true
              ? true
              : // primitives
                IsExactly<T, string> extends true
                ? true
                : IsExactly<T, number> extends true
                  ? true
                  : IsExactly<T, boolean> extends true
                    ? true
                    : IsExactly<T, bigint> extends true
                      ? true
                      : IsExactly<T, symbol> extends true
                        ? true
                        : // function keyword / AnyFunction
                          IsExactly<T, Function> extends true
                          ? true
                          : IsExactly<T, AnyFunction> extends true
                            ? true
                            : // array (general)
                              IsGeneralArray<T> extends true
                              ? true
                              : IsExactly<T, TypedArray> extends true
                                ? true
                                : // common built-ins
                                  IsExactly<T, Date> extends true
                                  ? true
                                  : IsExactly<T, RegExp> extends true
                                    ? true
                                    : IsExactly<T, Error> extends true
                                      ? true
                                      : // generic containers (recursive)
                                        T extends Promise<infer U>
                                        ? IsBaseType<U> extends true
                                          ? true
                                          : false
                                        : T extends Map<infer K, infer V>
                                          ? IsBaseType<K> extends true
                                            ? IsBaseType<V> extends true
                                              ? true
                                              : false
                                            : false
                                          : T extends WeakMap<infer K, infer V>
                                            ? K extends object
                                              ? IsBaseType<V> extends true
                                                ? true
                                                : false
                                              : false
                                            : T extends Set<infer U>
                                              ? IsBaseType<U> extends true
                                                ? true
                                                : false
                                              : T extends WeakSet<infer U>
                                                ? U extends object
                                                  ? true
                                                  : false
                                                : // buffers & typed views
                                                  IsExactly<
                                                      T,
                                                      ArrayBuffer
                                                    > extends true
                                                  ? true
                                                  : IsExactly<
                                                        T,
                                                        SharedArrayBuffer
                                                      > extends true
                                                    ? true
                                                    : IsExactly<
                                                          T,
                                                          DataView
                                                        > extends true
                                                      ? true
                                                      : // plain object {}
                                                        IsExactly<
                                                            T,
                                                            {}
                                                          > extends true
                                                        ? true
                                                        : // `object` keyword
                                                          [T] extends [object]
                                                          ? [object] extends [T]
                                                            ? true
                                                            : false
                                                          : false;
