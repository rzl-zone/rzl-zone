/* eslint-disable @typescript-eslint/no-explicit-any */
import type { If } from "./if";
import type { IsNever } from "./never";

/** -------------------------------------------------------
 * * ***Utility Type: `Arrayable`.***
 * -------------------------------------------------------
 * **Useful when a function or API accepts **either one item or multiple items**.**
 * - **Represents a type that can be either:**
 *      - a single value of type `T`, or an array of values of type `T`.
 * @template T - The element type.
 * @example
 * ```ts
 * function toArray<T>(input: Arrayable<T>): T[] {
 *   return Array.isArray(input) ? input : [input];
 * }
 *
 * type A = Arrayable<string>;
 * // ➔ string | string[]
 *
 * const a: A = "foo";
 * const b: A = ["foo", "bar"];
 * ```
 */
export type Arrayable<T> = T | Array<T>;

/** -------------------------------------------------------
 * * ***Utility Type: `MutableArray`.***
 * -------------------------------------------------------
 * **Recursively creates a **mutable version** of a readonly array, tuple, or object type.**
 * @description
 * By default, TypeScript infers tuple/array literals as `readonly` (especially with `as const`).
 * This utility removes the `readonly` modifier from all elements recursively,
 * turning a readonly tuple, array, or object into a mutable one.
 * - **Behavior:**
 *      - Optionally, if `Widen` is `true`, literal types (`1`, `'foo'`, `true`) are widened to
 *        their primitive equivalents (`number`, `string`, `boolean`) for easier assignment.
 * @template T - The readonly array, tuple, or object type to make mutable.
 * @template Widen - Whether to widen literal primitive types to their base types (default: `false`).
 * @example
 * ```ts
 * type A = readonly [1, 2, 3];
 * type B = MutableArray<A>;
 * // ➔ [1, 2, 3]
 *
 * const x: A = [1, 2, 3] as const;
 * // x[0] = 9; // ❌ Error: read-only
 *
 * const y: MutableArray<B,true> = [1, 2, 3];
 * y[0] = 9; // ✅ Allowed
 *
 * // Recursive example with objects
 * type Obj = readonly [{ a: 1, b: readonly [2] }];
 * type MutableObj = MutableArray<Obj, true>;
 * // ➔ [{ a: number; b: [number]; }]
 * ```
 */
export type MutableArray<T, Widen extends boolean = false> = T extends (
  ...args: any
) => any
  ? T
  : T extends readonly any[]
    ? { -readonly [K in keyof T]: MutableArray<T[K], Widen> }
    : T extends object
      ? { -readonly [K in keyof T]: MutableArray<T[K], Widen> }
      : Widen extends true
        ? T extends number
          ? number
          : T extends string
            ? string
            : T extends boolean
              ? boolean
              : T extends bigint
                ? bigint
                : T extends symbol
                  ? symbol
                  : T
        : T;

/** --------------------------------------------------
 * * ***Utility Type: `GetArrayElementType`.***
 * --------------------------------------------------
 * **Gets the element type from a readonly array or tuple.**
 * - ✅ Useful when working with `as const` arrays to extract the union of literal types.
 * @template T - A readonly array or tuple type.
 * @example
 * ```ts
 * const roles = ['admin', 'user'] as const;
 * type Role = GetArrayElementType<typeof roles>;
 * // ➔ "admin" | "user"
 * ```
 */
export type GetArrayElementType<T extends readonly any[]> =
  T extends readonly (infer U)[] ? U : never;

/** -------------------------------------------------------
 * * ***Utility Type: `EmptyArray`.***
 * -------------------------------------------------------
 * **A type-level utility that returns `T` if it is an ***empty array***,
 * otherwise returns `never`.**
 * @template T - The array type to check.
 * @example
 * ```ts
 * type A = EmptyArray<[]>;
 * // ➔ []
 * type B = EmptyArray<[1]>;
 * // ➔ never
 * type C = EmptyArray<string[]>;
 * // ➔ string[]
 * type D = EmptyArray<number[]>;
 * // ➔ number[]
 * type E = EmptyArray<readonly []>;
 * // ➔ readonly []
 * ```
 */
export type EmptyArray<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...unknown[]
]
  ? never
  : T;

/** -------------------------------------------------------
 * * ***Utility Type: `NonEmptyArray`.***
 * -------------------------------------------------------
 * **A type-level utility that returns `T` if it is a ***non-empty array***,
 * otherwise returns `never`.**
 * @template T - The array type to check.
 * @example
 * ```ts
 * type A = NonEmptyArray<[]>;
 * // ➔ never
 * type B = NonEmptyArray<[1]>;
 * // ➔ [1]
 * type C = NonEmptyArray<string[]>;
 * // ➔ never
 * type D = NonEmptyArray<number[]>;
 * // ➔ never
 * type E = NonEmptyArray<readonly []>;
 * // ➔ never
 * ```
 */
export type NonEmptyArray<T extends readonly unknown[]> = If<
  IsNever<EmptyArray<T>>,
  T,
  never
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsEmptyArray`.***
 * -------------------------------------------------------
 * **A type-level utility that evaluates to `true` if `T` is an ***empty array.***
 * (or can be empty per this definition), otherwise `false`.**
 * @template T - The array type to check.
 * @example
 * ```ts
 * type A = IsEmptyArray<[]>;
 * // ➔ true
 * type B = IsEmptyArray<[1]>;
 * // ➔ false
 * type C = IsEmptyArray<string[]>;
 * // ➔ true
 * type D = IsEmptyArray<number[]>;
 * // ➔ true
 * type E = IsEmptyArray<readonly []>;
 * // ➔ true
 * ```
 */
export type IsEmptyArray<T extends readonly unknown[]> = If<
  IsNever<EmptyArray<T>>,
  false,
  true
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsNonEmptyArray`.***
 * -------------------------------------------------------
 * **A type-level utility that evaluates to `true` if `T` is a ***non-empty array.***
 * (strictly a non-empty tuple), otherwise `false`.**
 * @template T - The array type to check.
 * @example
 * ```ts
 * type A = IsNonEmptyArray<[]>;
 * // ➔ false
 * type B = IsNonEmptyArray<[1]>;
 * // ➔ true
 * type C = IsNonEmptyArray<string[]>;
 * // ➔ false
 * type D = IsNonEmptyArray<number[]>;
 * // ➔ false
 * type E = IsNonEmptyArray<readonly []>;
 * // ➔ false
 * ```
 */
export type IsNonEmptyArray<T extends readonly unknown[]> = If<
  IsNever<EmptyArray<T>>,
  true,
  false
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfEmptyArray`.***
 * -------------------------------------------------------
 * **Returns the second argument if `T` is an ***empty array*** (per this utility),
 * otherwise returns the third argument.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The array type to check.
 * @template IfTrue - Returned type if `T` is empty by this definition.
 * @template IfFalse - Returned type if `T` is not empty by this definition.
 * @example
 * ```ts
 * type A = IfEmptyArray<[]>;
 * // ➔ true
 * type B = IfEmptyArray<[1]>;
 * // ➔ false
 * type C = IfEmptyArray<string[]>;
 * // ➔ true
 * type D = IfEmptyArray<readonly []>;
 * // ➔ true
 * type E = IfEmptyArray<[], "yes", "no">;
 * // ➔ "yes"
 * type F = IfEmptyArray<[1], "yes", "no">;
 * // ➔ "no"
 * type G = IfEmptyArray<string[], "yes", "no">;
 * // ➔ "yes"
 * ```
 */
export type IfEmptyArray<
  T extends readonly unknown[],
  IfTrue = true,
  IfFalse = false
> = If<IsEmptyArray<T>, IfTrue, IfFalse>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfNonEmptyArray`.***
 * -------------------------------------------------------
 * **Returns the second argument if `T` is a ***non-empty array*** (strict tuple),
 * otherwise returns the third argument.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The array type to check.
 * @template IfTrue - Returned type if `T` is non-empty by this definition.
 * @template IfFalse - Returned type if `T` is not non-empty by this definition.
 * @example
 * ```ts
 * type A = IfNonEmptyArray<[]>;
 * // ➔ false
 * type B = IfNonEmptyArray<[1]>;
 * // ➔ true
 * type C = IfNonEmptyArray<string[]>;
 * // ➔ false
 * type D = IfNonEmptyArray<readonly []>;
 * // ➔ false
 * type E = IfNonEmptyArray<[1], "yes", "no">;
 * // ➔ "yes"
 * type F = IfNonEmptyArray<[], "yes", "no">;
 * // ➔ "no"
 * type G = IfNonEmptyArray<string[], "yes", "no">;
 * // ➔ "no"
 * ```
 */
export type IfNonEmptyArray<
  T extends readonly unknown[],
  IfTrue = true,
  IfFalse = false
> = If<IsNonEmptyArray<T>, IfTrue, IfFalse>;
