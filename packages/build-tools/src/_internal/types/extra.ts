/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/*!
 * ========================================================================
 *  @rzl-zone/ts-types-plus
 * ------------------------------------------------------------------------
 *  Version: `0.1.0`
 *  Author: `Rizalvin Dwiky <rizalvindwiky1998@gmail.com>`
 *  Repository: `https://github.com/rzl-zone/rzl-zone/tree/main/packages/ts-types-plus`
 * ========================================================================
 */
/** -------------------------------------------------------
 * * ***Utility Type: `If`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the second argument if the first argument is `true`, otherwise
 *        returns the third argument.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template Condition - The boolean condition to check.
 * @template IfTrue - The branch type if condition is `true`. (default: `true`).
 * @template IfFalse - The branch type if condition is `false`. (default: `false`).
 * @example
 * ```ts
 * type A = If<true, "valid">;
 * // ➔ "valid"
 * type B = If<false, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
type If<Condition, IfTrue = true, IfFalse = false> = Condition extends true
  ? IfTrue
  : IfFalse;
/** -------------------------------------------------------
 * * ***Utility Type: `IsNever`.***
 * -------------------------------------------------------
 * ****Conditional**: returns `true` if `T` is `never`, otherwise `false`.**
 * @template T - Type to check.
 * @example
 * ```ts
 * type A = IsNever<never>; // ➔ true
 * type B = IsNever<true>;  // ➔ false
 * ```
 */
type IsNever<T> = [T] extends [never] ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IfNever`.***
 * -------------------------------------------------------
 * **Conditional**: Selects one of two branches depending on whether `T` is `never`.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - Type to check.
 * @template IfTrue - The branch type if `T` is `never`, (default: `true`).
 * @template IfFalse - The branch type if `T` is not `never`, (default: `false`).
 * @example
 * ```ts
 * type A = IfNever<never>;
 * // ➔ true
 * type B = IfNever<string>;
 * // ➔ false
 * type C = IfNever<never, 'valid', 'no'>;
 * // ➔ 'valid'
 * type D = IfNever<string, 'valid', 'no'>;
 * // ➔ 'no'
 * ```
 */
type IfNever<T, IfTrue = true, IfFalse = false> = If<
  IsNever<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `NeverifyPropertiesOptions`.***
 * -------------------------------------------------------
 * **Configuration options for the ***{@link NeverifyProperties | `NeverifyProperties`}*** type utility.**
 * @example
 * ```ts
 * type Opt1 = NeverifyPropertiesOptions;
 * // ➔ { makeOptional: boolean }
 * ```
 */
type NeverifyPropertiesOptions = {
  /** * ***Whether to make all properties optional, defaultValue: `false`.***
   *
   * @default false
   */
  makeOptional: boolean;
};
/** -------------------------------------------------------
 * * ***Utility Type: `NeverifyProperties`.***
 * -------------------------------------------------------
 * **Turns all properties of an object to type `never`.**
 * - If `Options["makeOptional"]` is `true`, properties will be optional.
 * @template T - Object type to transform.
 * @template Options - Configuration options (default: `{ makeOptional: false }`).
 * @example
 * ```ts
 * type A = NeverifyProperties<{ a: string; b: string }>;
 * // ➔ { a: never; b: never }
 * type B = NeverifyProperties<{ a: string; b: string }, { makeOptional: true }>;
 * // ➔ { a?: never; b?: never }
 * ```
 */
type NeverifyProperties<
  T extends object,
  Options extends NeverifyPropertiesOptions = {
    makeOptional: false;
  }
> = { [K in keyof T]: never } extends infer Result
  ? If<Options["makeOptional"], Partial<Result>, Result>
  : never;
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
type Arrayable<T> = T | Array<T>;
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
type MutableArray<T, Widen extends boolean = false> = T extends (
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
type GetArrayElementType<T extends readonly any[]> =
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
type EmptyArray<T extends readonly unknown[]> = T extends readonly [
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
type NonEmptyArray<T extends readonly unknown[]> = If<
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
type IsEmptyArray<T extends readonly unknown[]> = If<
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
type IsNonEmptyArray<T extends readonly unknown[]> = If<
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
type IfEmptyArray<
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
type IfNonEmptyArray<
  T extends readonly unknown[],
  IfTrue = true,
  IfFalse = false
> = If<IsNonEmptyArray<T>, IfTrue, IfFalse>;
/** -------------------------------------------------------
 * * ***Utility Type: `Not`.***
 * -------------------------------------------------------
 * **Accepts a boolean type `T` and returns its negation.**
 * @template T - Boolean type to negate.
 * @example
 * ```ts
 * type A = Not<true>;  // ➔ false
 * type B = Not<false>; // ➔ true
 * ```
 */
type Not<T extends boolean> = T extends true ? false : true;
/** ---------------------------------------------------------------------------
 * * ***Options for {@link Pop|`Pop`}.***
 * ---------------------------------------------------------------------------
 * **Configuration options for the {@link Pop | **`Pop`**} type utility.**
 */
type PopOptions = {
  /**
   * If `true`, {@link Pop | **`Pop`**} will return a tuple `[Rest, Removed]`
   * instead of just the remaining array, default: `false`.
   *
   * @example
   * ```ts
   * type Options = { includeRemoved: true };
   * type Result = Pop<[1, 2, 3], Options>; // ➔ [[1, 2], 3]
   * ```
   */
  includeRemoved: boolean;
};
/** -------------------------------------------------------
 * * ***Utility Type: `Pop`.***
 * -------------------------------------------------------
 * **Removes the last element from a tuple/array type.**
 * - If the `includeRemoved` option is `true`, it returns a tuple `[Rest, Removed]`
 *   where `Rest` is the array without the last element, and `Removed` is the last
 *   element.
 * @template T - The tuple or array to pop from.
 * @template Options - Configuration object. Default `{ includeRemoved: false }`.
 * @example
 * ```ts
 * // Removes last element
 * type Case1 = Pop<[1, 2, 3]>
 * // ➔ [1, 2]
 *
 * // Removes last element and includes the removed value
 * type Case2 = Pop<[1, 2, 3], { includeRemoved: true }>
 * // ➔ [[1, 2], 3]
 *
 * // Edge case: empty array
 * type Case3 = Pop<[]>
 * // ➔ never
 * ```
 */
type Pop<
  T extends readonly unknown[],
  Options extends PopOptions = {
    includeRemoved: false;
  }
> =
  IsEmptyArray<T> extends true
    ? never
    : T extends readonly [
          ...infer Rest extends readonly unknown[],
          infer Removed
        ]
      ? If<Options["includeRemoved"], [Rest, Removed], Rest>
      : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Extends`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the first argument ***extends*** the second argument.**
 * @template T - The type to check.
 * @template Base - The type to compare against.
 * @example
 * ```ts
 * type A = Extends<1, number>;  // ➔ true
 * type B = Extends<number, 1>;  // ➔ false
 * ```
 */
type Extends<T, Base> = [T] extends [Base] ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `NotExtends`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the first argument does ***not extend*** the second argument.**
 * @template T - The type to check.
 * @template Base - The type to compare against.
 * @example
 * ```ts
 * type A = NotExtends<1, number>; // ➔ false
 * type B = NotExtends<number, 1>; // ➔ true
 * ```
 */
type NotExtends<T, Base> = Not<Extends<T, Base>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfExtends`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the third argument if the first argument ***extends*** the second
 *        argument, otherwise returns the fourth argument.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The type to check.
 * @template Base - The type to compare against.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfExtends<1, number, "valid">;
 * // ➔ "valid"
 * type B = IfExtends<1, string, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
type IfExtends<T, Base, IfTrue = true, IfFalse = false> = If<
  Extends<T, Base>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfNotExtends`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the third argument if the first argument does ***not extend*** the
 *        second argument, otherwise returns the fourth argument.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The type to check.
 * @template Base - The type to compare against.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfNotExtends<1, string, "valid">;
 * // ➔ "valid"
 * type B = IfNotExtends<1, number, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
type IfNotExtends<T, Base, IfTrue = true, IfFalse = false> = If<
  NotExtends<T, Base>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `ExtendsArr`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether every element of the first array argument ***extends*** the second argument.**
 * @template T - The array to check.
 * @template Base - The type to compare each element against.
 * @example
 * ```ts
 * type A = ExtendsArr<[1, 2, 3], number>;
 * // ➔ true
 * type B = ExtendsArr<[1, "2", 3], number>;
 * // ➔ false
 * ```
 */
type ExtendsArr<T extends readonly unknown[], Base> =
  IsEmptyArray<T> extends true
    ? true
    : Pop<
          T,
          {
            includeRemoved: true;
          }
        > extends readonly [
          infer Rest extends readonly unknown[],
          infer Removed
        ]
      ? Extends<Removed, Base> extends true
        ? ExtendsArr<Rest, Base>
        : false
      : false;
/** -------------------------------------------------------
 * * ***Utility Type: `And`.***
 * -------------------------------------------------------
 * **Performs a **logical AND** operation between two boolean types.**
 * - **Behavior:**
 *      - Returns `true` if **both** conditions extend `true`.
 *      - Returns `false` for otherwise.
 * @template Condition1 - The first condition.
 * @template Condition2 - The second condition.
 * @example
 * ```ts
 * type Case1 = And<true, true>;
 * // ➔ true
 * type Case2 = And<false, true>;
 * // ➔ false
 * type Case3 = And<true, false>;
 * // ➔ false
 * type Case4 = And<false, false>;
 * // ➔ false
 * ```
 */
type And<Condition1, Condition2> = IfExtends<
  Condition1,
  true,
  Extends<Condition2, true>
>;
/** -------------------------------------------------------
 * * ***Utility Type: `AndArr`.***
 * -------------------------------------------------------
 * **Performs a **logical AND** operation across all elements in an array of
 * boolean types.**
 * - **Behavior:**
 *      - Returns `true` if **all elements** extend `true`.
 *      - Returns `false` if **any element** is not `true`.
 * @template Conditions - A readonly array of boolean conditions.
 * @example
 * ```ts
 * type Case1 = AndArr<[true, true, true]>;
 * // ➔ true
 * type Case2 = AndArr<[true, true, false]>;
 * // ➔ false
 * type Case3 = AndArr<[false, false, false]>;
 * // ➔ false
 * type Case4 = AndArr<[]>;
 * // ➔ false
 * ```
 */
type AndArr<Conditions extends readonly unknown[]> =
  Extends<[], Conditions> extends true
    ? false
    : Extends<Conditions[number], true>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsStringLiteral`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is literal string.**
 * @template T - The type value to check.
 * @example
 * type Case1 = IsStringLiteral<'a'>;    // ➔ true
 * type Case2 = IsStringLiteral<1>;      // ➔ false
 * type Case3 = IsStringLiteral<string>; // ➔ false
 */
type IsStringLiteral<T> = If<
  Extends<T, string>,
  Extends<string, T> extends true ? false : true
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfNot`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the second argument if the first argument is `false`, otherwise returns the third argument.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template Condition - The boolean condition to check.
 * @template IfTrue - The branch type if condition is `false`. (default: `true`).
 * @template IfFalse - The branch type if condition is `true`. (default: `false`).
 * @example
 * ```ts
 * type A = IfNot<false, "valid">;
 * // ➔ "valid"
 * type B = IfNot<false, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
type IfNot<Condition, IfTrue = true, IfFalse = false> = If<
  Condition,
  IfFalse,
  IfTrue
>;
/** -------------------------------------------------------
 * * ***Utility Type: `WordSeparator`.***
 * -------------------------------------------------------
 * **A type-level utility that defines all valid ***word separators***.**
 * - Can be a space `" "`, a dash `"-"`, or an underscore `"_"`.
 * @example
 * type A = WordSeparator; // ➔ " " | "-" | "_"
 */
type WordSeparator = " " | "-" | "_";
/** --------------------------------------------------
 * * ***Utility Type: `Whitespace`.***
 * --------------------------------------------------
 * **Represents common whitespace characters.**
 * - ✅ Used as the default trimming characters in string utility types.
 * @example
 * type W = Whitespace; // ➔ " " | "\t" | "\r" | "\n"
 */
type Whitespace = " " | "\t" | "\r" | "\n";
/** **Helper Type Internal.** */
type SafeKeyTrimming<T> = Exclude<T, symbol>;
/** --------------------------------------------------
 * * ***Utility Type: `TrimLeft`.***
 * --------------------------------------------------
 * **Recursively trims specified characters (default: **{@link Whitespace | `Whitespace`}**) from the **start (left)** of a string.**
 * @template Text - The string to trim.
 * @template Chars - The characters to remove (default: `Whitespace`).
 * @example
 * type T1 = TrimLeft<"\n  hello", " " | "\n">;
 * // ➔ "hello"
 * type T2 = TrimLeft<"  world">;
 * // ➔ "world"
 * type T3 = TrimLeft<"  world ">;
 * // ➔ "world "
 */
type TrimLeft<
  Text extends PropertyKey,
  Chars extends PropertyKey = Whitespace
> = Text extends `${SafeKeyTrimming<Chars>}${infer Rest}`
  ? TrimLeft<Rest, Chars>
  : Text;
/** --------------------------------------------------
 * * ***Utility Type: `TrimRight`.***
 * --------------------------------------------------
 * **Recursively trims specified characters (default: **{@link Whitespace | `Whitespace`}**) from the **end (right)** of a string.**
 * @template Text - The string to trim.
 * @template Chars - The characters to remove (default: `Whitespace`).
 * @example
 * type T1 = TrimRight<"hello  \t", " " | "\t">;
 * // ➔ "hello"
 * type T2 = TrimRight<"world  ">;
 * // ➔ "world"
 * type T2 = TrimRight<" world  ">;
 * // ➔ " world"
 */
type TrimRight<
  Text extends PropertyKey,
  Chars extends PropertyKey = Whitespace
> = Text extends `${infer Rest}${SafeKeyTrimming<Chars>}`
  ? TrimRight<Rest, Chars>
  : Text;
/** --------------------------------------------------
 * * ***Utility Type: `Trim`.***
 * --------------------------------------------------
 * **Trims specified characters (default: **{@link Whitespace | `Whitespace`}**)
 * from **both the start and end** of a string.**
 * @template Chars - The characters to remove (default: `Whitespace`).
 * @example
 * type T1 = Trim<"  hello  ", " ">;
 * // ➔ "hello"
 * type T2 = Trim<"\n  world \t">;
 * // ➔ "world"
 */
type Trim<
  Text extends PropertyKey,
  Chars extends PropertyKey = Whitespace
> = TrimRight<TrimLeft<Text, Chars>, Chars>;
/** -------------------------------------------------------
 * * ***Utility Type: `TrimsLower`.***
 * -------------------------------------------------------
 * **Trims leading & trailing whitespace from a string and
 * converts it to **lowercase**.**
 * @description
 * Utilizes **{@link Trim | `Trim`}** to remove whitespace and
 * **{@link Lowercase | `Lowercase`}** to convert the string to lowercase.
 * @template S - The input string to transform.
 * @example
 * ```ts
 * type T1 = TrimsLower<"  HeLLo \n">;
 * // ➔ "hello"
 * type T2 = TrimsLower<"  WoRLD  ">;
 * // ➔ "world"
 * ```
 */
type TrimsLower<S extends string> = Lowercase<Trim<S>>;
/** -------------------------------------------------------
 * * ***Utility Type: `TrimsUpper`.***
 * -------------------------------------------------------
 * **Trims leading & trailing whitespace from a string and
 * converts it to **uppercase**.**
 * @description
 * Utilizes **{@link Trim | `Trim`}** to remove whitespace and
 * **{@link Uppercase | `Uppercase`}** to convert the string to uppercase.
 * @template S - The input string to transform.
 * @example
 * ```ts
 * type T1 = TrimsUpper<"  HeLLo \n">;
 * // ➔ "HELLO"
 * type T2 = TrimsUpper<"  WoRLD  ">;
 * // ➔ "WORLD"
 * ```
 */
type TrimsUpper<S extends string> = Uppercase<Trim<S>>;
/** -------------------------------------------------------
 * * ***Utility Type: `AnyString`.***
 * -------------------------------------------------------
 * **A utility type that represents **any string value** while
 * preventing unwanted widening of string literals to `string`.**
 * @description
 * This is achieved by intersecting `string` with `{}`,
 * ensuring that the type remains assignable to `string`
 * but is treated as a unique type in generic constraints.
 * - **Useful in scenarios where:**
 *      - You want to accept **any string**, but still preserve
 *        literal types in inference.
 *      - You need stricter typing than just `string`.
 * @example
 * ```ts
 * declare function acceptsAnyString<T extends AnyString>(value: T): T;
 *
 * // Preserves literal
 * const a = acceptsAnyString("hello");
 * // ➔ "hello"
 *
 * // Also allows generic string
 * const b = acceptsAnyString(String("world"));
 * // ➔ string
 * ```
 */
type AnyString = {} & string;
/** -------------------------------------------------------
 * * ***Utility Type: `EmptyString`.***
 * -------------------------------------------------------
 * - **Conditional type:**
 *      - Returns the type `T` only if it is the empty string `""`.
 *      - Optionally trims whitespace before checking.
 * - **Behavior:**
 *      - If `WithTrim` is `true` (default), trims `T` before checking.
 *      - If `T` is the general `string` type, returns `never`.
 *      - If `T` is empty (after optional trimming), returns `T` or `Trim<T>`.
 * @template T - The string type to check.
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 * @example
 * ```ts
 * // Basic empty string
 * type Case1 = EmptyString<"">;
 * // ➔ ""
 *
 * // Non-empty string
 * type Case2 = EmptyString<"abc">;
 * // ➔ never
 *
 * // General string type
 * type Case3 = EmptyString<string>;
 * // ➔ never
 *
 * // With leading/trailing whitespace
 * type Case4 = EmptyString<"  ", true>;
 * // ➔ "" (trimmed)
 * type Case5 = EmptyString<"  ", false>;
 * // ➔ never (not trimmed)
 * ```
 */
type EmptyString<
  T extends string,
  WithTrim extends boolean = true
> = "" extends (WithTrim extends true ? Trim<T> : T)
  ? string extends (WithTrim extends true ? Trim<T> : T)
    ? never
    : WithTrim extends true
      ? Trim<T>
      : T
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `NonEmptyString`.***
 * -------------------------------------------------------
 * - **Conditional type:**
 *      - Returns the type `T` only if it is a non-empty string.
 *      - Optionally trims whitespace before checking.
 * - **Behavior:**
 *      - If `WithTrim` is `true` (default), trims `T` before checking.
 *      - If `T` is the general `string` type, returns `string`.
 *      - If `T` is empty (after optional trimming), returns `never`.
 * @template T - The string type to check.
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 * @example
 * ```ts
 * // Non-empty string
 * type Case1 = NonEmptyString<"abc">; // ➔ "abc"
 *
 * // Empty string
 * type Case2 = NonEmptyString<"">; // ➔ never
 *
 * // General string type
 * type Case3 = NonEmptyString<string>; // ➔ string
 *
 * // String with whitespace
 * type Case4 = NonEmptyString<"  ", true>; // ➔ never (trimmed to empty)
 * type Case5 = NonEmptyString<"  ", false>; // ➔ "  " (not trimmed)
 * ```
 */
type NonEmptyString<
  T extends string,
  WithTrim extends boolean = true
> = string extends T
  ? string
  : If<
      IsNever<EmptyString<T, WithTrim>>,
      WithTrim extends true ? Trim<T> : T,
      never
    >;
/** -------------------------------------------------------
 * * ***Utility Type: `IsEmptyString`.***
 * -------------------------------------------------------
 * - **Conditional type:**
 *      - Returns `true` if `T` is exactly the empty string `""`.
 *      - Optionally trims whitespace before checking.
 * - **Behavior:**
 *      - If `WithTrim` is `true` (default), trims `T` before checking.
 *      - If `T` is empty after optional trimming, returns `true`.
 *      - Otherwise, returns `false`.
 * @template T - The string type to check.
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 * @example
 * ```ts
 * type Case1 = IsEmptyString<"">;
 * // ➔ true
 * type Case2 = IsEmptyString<"abc">;
 * // ➔ false
 * type Case3 = IsEmptyString<"  ", true>;
 * // ➔ true (trimmed)
 * type Case4 = IsEmptyString<"  ", false>;
 * // ➔ false (not trimmed)
 * ```
 */
type IsEmptyString<T extends string, WithTrim extends boolean = true> = IfNot<
  IsNever<EmptyString<T, WithTrim>>
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsNonEmptyString`.***
 * -------------------------------------------------------
 * - **Conditional type:**
 *      - Returns `true` if `T` is a non-empty string.
 *      - Optionally trims whitespace before checking.
 * - **Behavior:**
 *      - If `WithTrim` is `true` (default), trims `T` before checking.
 *      - Returns `true` if `T` is non-empty after optional trimming.
 *      - Returns `false` if `T` is empty (after trimming if `WithTrim=true`).
 * @template T - The string type to check.
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 * @example
 * ```ts
 * type Case1 = IsNonEmptyString<"abc">;
 * // ➔ true
 * type Case2 = IsNonEmptyString<"">;
 * // ➔ false
 * type Case3 = IsNonEmptyString<"  ", true>;
 * // ➔ false (trimmed)
 * type Case4 = IsNonEmptyString<"  ", false>;
 * // ➔ true (not trimmed)
 * ```
 */
type IsNonEmptyString<
  T extends string,
  WithTrim extends boolean = true
> = IfNot<IsNever<NonEmptyString<T, WithTrim>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfEmptyString`.***
 * -------------------------------------------------------
 * - **Conditional type:**
 *      - Returns `IfTrue` if `T` is an empty string `""`, otherwise returns `IfFalse`.
 *      - Optionally trims whitespace before checking.
 * @template T - The string type to check.
 * @template IfTrue - Type returned if `T` is empty (default `true`).
 * @template IfFalse - Type returned if `T` is not empty (default `false`).
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 * @example
 * ```ts
 * type Case1 = IfEmptyString<"">;
 * // ➔ true
 * type Case2 = IfEmptyString<"abc">;
 * // ➔ false
 * type Case3 = IfEmptyString<"", "yes", "no">;
 * // ➔ "yes"
 * type Case4 = IfEmptyString<"abc", "yes", "no">;
 * // ➔ "no"
 * type Case5 = IfEmptyString<"  ", "yes", "no", true>;
 * // ➔ "yes" (trimmed)
 * type Case6 = IfEmptyString<"  ", "yes", "no", false>;
 * // ➔ "no" (not trimmed)
 * ```
 */
type IfEmptyString<
  T extends string,
  IfTrue = true,
  IfFalse = false,
  WithTrim extends boolean = true
> = IfNot<IsNever<EmptyString<T, WithTrim>>, IfTrue, IfFalse>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfNonEmptyString`.***
 * -------------------------------------------------------
 * - **Conditional type:**
 *      - Returns `IfTrue` if `T` is a non-empty string, otherwise returns `IfFalse`.
 *      - Optionally trims whitespace before checking.
 * @template T - The string type to check.
 * @template IfTrue - Type returned if `T` is non-empty (default `true`).
 * @template IfFalse - Type returned if `T` is empty (default `false`).
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 * @example
 * ```ts
 * type Case1 = IfNonEmptyString<"abc">;
 * // ➔ true
 * type Case2 = IfNonEmptyString<"">;
 * // ➔ false
 * type Case3 = IfNonEmptyString<"abc", "yes", "no">;
 * // ➔ "yes"
 * type Case4 = IfNonEmptyString<"", "yes", "no">;
 * // ➔ "no"
 * type Case5 = IfNonEmptyString<"  ", "yes", "no", true>;
 * // ➔ "no" (trimmed)
 * type Case6 = IfNonEmptyString<"  ", "yes", "no", false>;
 * // ➔ "yes" (not trimmed)
 * ```
 */
type IfNonEmptyString<
  T extends string,
  IfTrue = true,
  IfFalse = false,
  WithTrim extends boolean = true
> = IfNot<IsNever<NonEmptyString<T, WithTrim>>, IfTrue, IfFalse>;
/** @private ***types for {@link AreAnagrams}.*** */
type _AreAnagrams<Str1 extends string, Str2 extends string> =
  IsEmptyString<Str1> extends true
    ? IsEmptyString<Str2> extends true
      ? true
      : false
    : Str1 extends `${infer First extends string}${infer Rest1 extends string}`
      ? Str2 extends `${infer Prev extends string}${First}${infer Rest2 extends string}`
        ? _AreAnagrams<Rest1, `${Prev}${Rest2}`>
        : false
      : never;
/** -------------------------------------------------------
 * * ***Utility Type: `AreAnagrams`.***
 * -------------------------------------------------------
 * **Determines whether two string literal types are ***anagrams*** of each other.**
 * - **Behavior:**
 *      - Returns `true` if both strings contain exactly the same characters in
 *        any order.
 *      - Returns `false` otherwise.
 * @template Str1 - The first string literal.
 * @template Str2 - The second string literal.
 * @example
 * ```ts
 * type Case1 = AreAnagrams<"name", "eman">;
 * // ➔ true
 * type Case2 = AreAnagrams<"name", "emand">;
 * // ➔ false
 * type Case3 = AreAnagrams<"abc", "cba">;
 * // ➔ true
 * type Case4 = AreAnagrams<"abc", "abcd">;
 * // ➔ false
 * ```
 */
type AreAnagrams<Str1 extends string, Str2 extends string> =
  And<IsStringLiteral<Str1>, IsStringLiteral<Str2>> extends true
    ? _AreAnagrams<Str1, Str2>
    : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IsAny`.***
 * -------------------------------------------------------
 * **A type-level utility that checks whether a type is ***`any`***.**
 * - **Behavior:**
 *      - Returns `true` if `T` is `any`.
 *      - Returns `false` for otherwise.
 * @template T - The type to evaluate.
 * @example
 * ```ts
 * type A = IsAny<any>;     // ➔ true
 * type B = IsAny<string>;  // ➔ false
 * type C = IsAny<unknown>; // ➔ false
 * type D = IsAny<never>;   // ➔ false
 * ```
 */
type IsAny<T> = 0 extends 1 & T ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IfAny`.***
 * -------------------------------------------------------
 * **A type-level conditional utility that returns one type if ***`T` is `any`***,
 * and another type otherwise.**
 * - **Behavior:**
 *      - Defaults to `true` when `T` is `any`.
 *      - Defaults to `false` for otherwise.
 * @template T - The type to check.
 * @template IfTrue - The type to return if `T` is `any`, *(default: `true`)*.
 * @template IfFalse - The type to return if `T` is not `any`, *(default: `false`)*.
 * @example
 * ```ts
 * type A = IfAny<any, string, number>;
 * // ➔ string
 * type B = IfAny<string, string, number>;
 * // ➔ number
 * ```
 */
type IfAny<T, IfTrue = true, IfFalse = false> = If<IsAny<T>, IfTrue, IfFalse>;
/** * ***Configuration options for a type-level utility for
 * {@link AnifyProperties | `AnifyProperties`}.***
 */
type AnifyPropertiesOptions = {
  /** If `makeOptional: true`, all properties become optional, otherwise, all properties are required and typed as `any`, defaultValue: `false`.
   *
   * @default false
   */
  makeOptional: boolean;
};
/** -------------------------------------------------------
 * * ***Utility Type: `AnifyProperties`.***
 * -------------------------------------------------------
 * **A type-level utility that transforms all properties of an object
 * into ***`any`***.**
 * - **Behavior:**
 *      - If `makeOptional: true`, all properties become optional.
 *      - Otherwise, all properties are required and typed as `any`.
 * @template T The object type to transform.
 * @template Options Configuration options, defaults to `{ makeOptional: false }`.
 * @example
 * ```ts
 * type A = AnifyProperties<{a: string; b: number}>;
 * // ➔ { a: any; b: any }
 * type B = AnifyProperties<{a: string; b: number}, { makeOptional: true }>;
 * // ➔ { a?: any; b?: any }
 * ```
 */
type AnifyProperties<
  T extends object,
  Options extends AnifyPropertiesOptions = {
    makeOptional: false;
  }
> = { [K in keyof T]: any } extends infer Result
  ? If<Options["makeOptional"], Partial<Result>, Result>
  : never;
/** --------------------------------------------------
 * * ***Utility Type: `AnyFunction`.***
 * --------------------------------------------------
 * **A generic type representing **any function** with
 * any arguments and any return type.**
 * @example
 * const fn: AnyFunction = (a, b) => a + b;
 * console.log(fn(1, 2)); // ➔ 3
 *
 * const fn2: AnyFunction = (x, y, z) => x + y - z;
 * console.log(fn2(10, 20, 5)); // ➔ 25
 */
type AnyFunction = (...args: any[]) => any;
/** --------------------------------------------------
 * * ***Utility Type: `ArgumentTypes`.***
 * --------------------------------------------------
 * **Extracts the **argument types** of a given function type `F`.**
 * - ✅ Useful when you need to infer or reuse the parameter types
 *    from an existing function signature.
 * @template F - A function type from which to extract argument types.
 * @example
 * ```ts
 * type Args = ArgumentTypes<(a: number, b: string) => void>;
 * // ➔ [number, string]
 * ```
 */
type ArgumentTypes<F extends AnyFunction> = F extends (...args: infer A) => any
  ? A
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `ArrayElementType`.***
 * -------------------------------------------------------
 * **A type-level utility that extracts the element type of an array.**
 * - **Behavior:**
 *      - Works with both mutable and readonly arrays.
 *      - If `T` is not an array, resolves to `never`.
 * @template T - The array type to extract the element type from.
 * @example
 * ```ts
 * type A = ArrayElementType<string[]>;
 * // ➔ string
 * type B = ArrayElementType<readonly ("a" | "b")[]>;
 * // ➔ "a" | "b"
 * type C = ArrayElementType<number>;
 * // ➔ never
 * ```
 */
type ArrayElementType<T extends readonly unknown[]> =
  T extends Readonly<Array<infer Item>> ? Item : never;
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
type FixNeverArrayRecursive<T> = T extends readonly never[]
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
type NormalizeEmptyArraysRecursive<T> = T extends readonly (infer U)[]
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
type RemoveEmptyArrayElements<T> = T extends [infer Head, ...infer Tail]
  ? Head extends []
    ? RemoveEmptyArrayElements<Tail>
    : [Head, ...RemoveEmptyArrayElements<Tail>]
  : T extends []
    ? []
    : T;
/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link LastCharacter | `LastCharacter`}.***
 * ---------------------------------------------------------------------------
 */
type LastCharacterOptions = {
  includeRest: boolean;
};
type _LastCharacter<
  T extends string,
  Options extends LastCharacterOptions = {
    includeRest: false;
  },
  Previous extends string = ""
> = string extends T
  ? string
  : T extends `${infer First}${infer Rest}`
    ? IsEmptyString<Rest> extends true
      ? If<Options["includeRest"], [First, Previous], First>
      : _LastCharacter<Rest, Options, `${Previous}${First}`>
    : T;
/** -------------------------------------------------------
 * * ***Utility Type: `LastCharacter`.***
 * -------------------------------------------------------
 * **Accepts a string argument and returns its last character.**
 * - If the `includeRest` option is `true`, returns the last character and the rest of the string in the format: `[last, rest]`.
 * @template T - The string to get the last character from.
 * @template Options - Options to include the rest of the string.
 * @example
 * type Case1 = LastCharacter<'abc'>;
 * // ➔ 'c'
 * type Case2 = LastCharacter<'abc', { includeRest: true }>;
 * // ➔ ['c', 'ab']
 */
type LastCharacter<
  T extends string,
  Options extends LastCharacterOptions = {
    includeRest: false;
  }
> = IfExtends<
  Options,
  LastCharacterOptions,
  _LastCharacter<T, Options>,
  _LastCharacter<T>
>;
/** -------------------------------------------------------
 * * ***Utility Type: `Or`.***
 * -------------------------------------------------------
 * **Computes the logical OR of two type-level boolean conditions.**
 * @template Condition1 - First boolean condition.
 * @template Condition2 - Second boolean condition.
 * @example
 * ```ts
 * type Case1 = Or<true, true>;   // ➔ true
 * type Case2 = Or<false, true>;  // ➔ true
 * type Case3 = Or<false, false>; // ➔ false
 * type Case4 = Or<true, false>;  // ➔ true
 * ```
 * @remarks
 * - Uses {@link IfExtends | **`IfExtends`**} to determine if either condition is `true`.
 * - Returns `true` if at least one of the two conditions is `true`.
 * - Returns `false` only if both are `false`.
 */
type Or<Condition1, Condition2> = IfExtends<
  Condition1,
  true,
  true,
  IfExtends<Condition2, true>
>;
/** -------------------------------------------------------
 * * ***Utility Type: `OrArr`.***
 * -------------------------------------------------------
 * **Computes the logical OR of all elements inside a tuple or array of boolean types.**
 * @template Conditions - An array of boolean type elements.
 * @example
 * ```ts
 * type Case1 = OrArr<[true, true, true]>;    // ➔ true
 * type Case2 = OrArr<[true, true, false]>;   // ➔ true
 * type Case3 = OrArr<[false, false, false]>; // ➔ false
 * type Case4 = OrArr<[]>;                    // ➔ false
 * ```
 * @remarks
 * - Uses TypeScript's indexed access types and conditional type inference.
 * - Returns `true` if at least one element in the array is `true`.
 * - Returns `false` if all elements are `false` or array is empty.
 */
type OrArr<Conditions extends readonly unknown[]> =
  true extends Conditions[number] ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `Push`.***
 * -------------------------------------------------------
 * **Appends a type `U` to the end of a tuple or readonly array type `T`.**
 * @template T - The tuple or readonly array type to append U.
 * @template U - The type of the element to push.
 * @example
 * ```ts
 * type Case1 = Push<[1, 2, 3, 4], 5>;
 * // ➔ [1, 2, 3, 4, 5]
 *
 * type Case2 = Push<["a", "b"], "c">;
 * // ➔ ["a", "b", "c"]
 * ```
 */
type Push<T extends readonly unknown[], U> = [...T, U];
type _Repeat<
  T extends string,
  Count extends number,
  Result extends string = "",
  Iteration extends unknown[] = []
> = Iteration["length"] extends Count
  ? Result
  : _Repeat<T, Count, `${T}${Result}`, Push<Iteration, unknown>>;
/** -------------------------------------------------------
 * * ***Utility Type: `Repeat`.***
 * -------------------------------------------------------
 * **Repeats a string literal type `T` a specified number of times `Count`.**
 * - **Behavior:**
 *      - Supports a range of `[0, 999]` due to TypeScript recursion limits.
 *      - If `Count > 999`, it is automatically to `any` because error `Type instantiation is excessively deep and possibly infinite.ts(2589)`.
 * @template T - The string literal to repeat.
 * @template Count - Number of times to repeat.
 * @example
 * ```ts
 * type Case0 = Repeat<'x', 0>;  // ➔ ''
 * type Case1 = Repeat<'x', 1>;  // ➔ 'x'
 * type Case2 = Repeat<'x', 5>;  // ➔ 'xxxxx'
 * type Case3 = Repeat<'ab', 3>; // ➔ 'ababab'
 *
 * // ❌ Invalid:
 * type Case1000 = Repeat<'x', 1000>;
 * // ➔ same as any (because: TypeScript recursion limits)
 * ```
 */
type Repeat<T extends string, Count extends number> = _Repeat<T, Count>;
/** -------------------------------------------------------
 * * ***Utility Type: `OddDigit`.***
 * -------------------------------------------------------
 * **A union of string literal digits considered ***odd***.**
 * - Includes: `"1" | "3" | "5" | "7" | "9"`.
 * @example
 * ```ts
 * type A = OddDigit; // ➔ "1" | "3" | "5" | "7" | "9"
 * ```
 */
type OddDigit = "1" | "3" | "5" | "7" | "9";
/** -------------------------------------------------------
 * * ***Utility Type: `EvenDigit`.***
 * -------------------------------------------------------
 * **A union of string literal digits considered ***even***.**
 * - Includes: `"0" | "2" | "4" | "6" | "8"`.
 * @example
 * ```ts
 * type A = EvenDigit; // ➔ "0" | "2" | "4" | "6" | "8"
 * ```
 */
type EvenDigit = "0" | "2" | "4" | "6" | "8";
/** -------------------------------------------------------
 * * ***Utility Type: `Integer`.***
 * -------------------------------------------------------
 * **A type-level utility that validates if `T` is an ***integer***.**
 * - **Behavior:**
 *      - Returns `T` if it is an integer.
 *      - Returns `never` if `T` is a ***float*** (decimal).
 * @template T - A number type to validate.
 * @example
 * ```ts
 * type A = Integer<42>;   // ➔ 42
 * type B = Integer<-10>;  // ➔ -10
 * type C = Integer<3.14>; // ➔ never
 * ```
 */
type Integer<T extends number> = `${T}` extends `${string}.${string}`
  ? never
  : T;
/** -------------------------------------------------------
 * * ***Utility Type: `Float`.***
 * -------------------------------------------------------
 * **A type-level utility that validates if `T` is a ***float***.**
 * - **Behavior:**
 *      - Returns `T` if it is a float.
 *      - Returns `never` if `T` is an ***integer***.
 * @template T - A number type to validate.
 * @example
 * ```ts
 * type A = Float<3.14>; // ➔ 3.14
 * type B = Float<42>;   // ➔ never
 * ```
 */
type Float<T extends number> = If<IsNever<Integer<T>>, T, never>;
/** -------------------------------------------------------
 * * ***Utility Type: `Negative`.***
 * -------------------------------------------------------
 * **Extracts `T` if it is ***negative***, otherwise `never`.**
 * @template T - A number type to check.
 * @example
 * ```ts
 * type A = Negative<-10>; // ➔ -10
 * type B = Negative<5>;   // ➔ never
 * type C = Negative<0>;   // ➔ never
 * ```
 */
type Negative<T extends number> = `${T}` extends `-${string}` ? T : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Positive`.***
 * -------------------------------------------------------
 * **Extracts `T` if it is ***positive*** (or zero), otherwise `never`.**
 * @template T - A number type to check.
 * @example
 * ```ts
 * type A = Positive<10>; // ➔ 10
 * type B = Positive<0>;  // ➔ 0
 * type C = Positive<-5>; // ➔ never
 * ```
 */
type Positive<T extends number> = If<IsNever<Negative<T>>, T, never>;
/** -------------------------------------------------------
 * * ***Utility Type: `PositiveInteger`.***
 * -------------------------------------------------------
 * **Restricts `T` to ***positive integers*** only.**
 * @template T - A number type.
 * @example
 * ```ts
 * type A = PositiveInteger<42>;   // ➔ 42
 * type B = PositiveInteger<0>;    // ➔ 0
 * type C = PositiveInteger<-5>;   // ➔ never
 * type D = PositiveInteger<3.14>; // ➔ never
 * ```
 */
type PositiveInteger<T extends number> = Positive<Integer<T>>;
/** -------------------------------------------------------
 * * ***Utility Type: `NegativeInteger`.***
 * -------------------------------------------------------
 * **Restricts `T` to ***negative integers*** only.**
 * @template T - A number type.
 * @example
 * ```ts
 * type A = NegativeInteger<-42>;   // ➔ -42
 * type B = NegativeInteger<5>;     // ➔ never
 * type C = NegativeInteger<-3.14>; // ➔ never
 * ```
 */
type NegativeInteger<T extends number> = Negative<Integer<T>>;
/** -------------------------------------------------------
 * * ***Utility Type: `PositiveFloat`.***
 * -------------------------------------------------------
 * **Restricts `T` to ***positive floats*** only.**
 * @template T - A number type.
 * @example
 * ```ts
 * type A = PositiveFloat<3.14>; // ➔ 3.14
 * type B = PositiveFloat<-2.5>; // ➔ never
 * type C = PositiveFloat<5>;    // ➔ never
 * ```
 */
type PositiveFloat<T extends number> = Positive<Float<T>>;
/** -------------------------------------------------------
 * * ***Utility Type: `NegativeFloat`.***
 * -------------------------------------------------------
 * **Restricts `T` to ***negative floats*** only.**
 * @template T - A number type.
 * @example
 * ```ts
 * type A = NegativeFloat<-3.14>; // ➔ -3.14
 * type B = NegativeFloat<2.5>;   // ➔ never
 * type C = NegativeFloat<-5>;    // ➔ never
 * ```
 */
type NegativeFloat<T extends number> = Negative<Float<T>>;
/** -------------------------------------------------------
 * * ***Utility Type: `Even`.***
 * -------------------------------------------------------
 * **A type-level utility that extracts `T` if it is an ***even integer***.**
 * @template T - A number type to check.
 * @example
 * ```ts
 * type A = Even<0>;    // ➔ 0
 * type B = Even<4>;    // ➔ 4
 * type C = Even<5>;    // ➔ never
 * type D = Even<24>;   // ➔ 24
 * type E = Even<27>;   // ➔ never
 * type F = Even<3.14>; // ➔ never
 * ```
 */
type Even<T extends number> = IfNot<
  IsNever<Integer<T>>,
  `${T}` extends `${string}${EvenDigit}` ? T : never,
  never
>;
/** -------------------------------------------------------
 * * ***Utility Type: `Odd`.***
 * -------------------------------------------------------
 * **A type-level utility that extracts `T` if it is an ***odd integer***.**
 * @template T - A number type to check.
 * @example
 * ```ts
 * type A = Odd<0>;   // ➔ never
 * type B = Odd<5>;   // ➔ 5
 * type C = Odd<4>;   // ➔ never
 * type D = Odd<23>;  // ➔ 23
 * type E = Odd<26>;  // ➔ never
 * type F = Odd<4.2>; // ➔ never
 * ```
 */
type Odd<T extends number> = IfNot<
  IsNever<Integer<T>>,
  If<IsNever<Even<T>>, T, never>,
  never
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsInteger`.***
 * -------------------------------------------------------
 * **Whether `T` is an ***integer***.**
 * @example
 * ```ts
 * type A = IsInteger<-2>;   // ➔ true
 * type B = IsInteger<0>;    // ➔ true
 * type C = IsInteger<42>;   // ➔ true
 * type D = IsInteger<3.14>; // ➔ false
 * ```
 */
type IsInteger<T extends number> = Not<IsNever<Integer<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsFloat`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***float***.**
 * @example
 * ```ts
 * type A = IsFloat<3.14>;  // ➔ true
 * type B = IsFloat<-3.14>; // ➔ true
 * type C = IsFloat<0>;     // ➔ false
 * type D = IsFloat<42>;    // ➔ false
 * type E = IsFloat<-42>;   // ➔ false
 * ```
 */
type IsFloat<T extends number> = Not<IsNever<Float<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsEven`.***
 * -------------------------------------------------------
 * **Whether `T` is ***even***.**
 * @example
 * ```ts
 * type A = IsEven<0>;    // ➔ true
 * type B = IsEven<4>;    // ➔ true
 * type C = IsEven<5>;    // ➔ false
 * type D = IsEven<24>;   // ➔ true
 * type E = IsEven<27>;   // ➔ false
 * type F = IsEven<3.14>; // ➔ false
 * ```
 */
type IsEven<T extends number> = If<
  IsInteger<T>,
  `${T}` extends `${string}${EvenDigit}` ? true : false
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsOdd`.***
 * -------------------------------------------------------
 * **Whether `T` is ***odd***.**
 * @example
 * ```ts
 * type A = IsEven<0>;    // ➔ false
 * type B = IsEven<4>;    // ➔ false
 * type C = IsEven<5>;    // ➔ true
 * type D = IsEven<24>;   // ➔ false
 * type E = IsEven<27>;   // ➔ true
 * type F = IsEven<3.14>; // ➔ true
 * ```
 */
type IsOdd<T extends number> = If<IsInteger<T>, Not<IsEven<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsPositive`.***
 * -------------------------------------------------------
 * **Whether `T` is ***positive***.**
 * @example
 * ```ts
 * type A = IsPositive<10>;   // ➔ true
 * type B = IsPositive<0>;    // ➔ true
 * type C = IsPositive<-5>;   // ➔ false
 * type D = IsPositive<3.5>;  // ➔ true
 * type E = IsPositive<-3.5>; // ➔ false
 * ```
 */
type IsPositive<T extends number> = Not<IsNever<Positive<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsNegative`.***
 * -------------------------------------------------------
 * **Whether `T` is ***negative***.**
 * @example
 * ```ts
 * type A = IsNegative<-10>;  // ➔ true
 * type B = IsNegative<5>;    // ➔ false
 * type C = IsNegative<0>;    // ➔ false
 * type D = IsPositive<3.5>;  // ➔ false
 * type E = IsPositive<-3.5>; // ➔ true
 * ```
 */
type IsNegative<T extends number> = Not<IsNever<Negative<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsPositiveInteger`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***positive integer***.**
 * @example
 * ```ts
 * type A = IsPositiveInteger<42>;   // ➔ true
 * type B = IsPositiveInteger<0>;    // ➔ true
 * type C = IsPositiveInteger<-5>;   // ➔ false
 * type D = IsPositiveInteger<3.14>; // ➔ false
 * ```
 */
type IsPositiveInteger<T extends number> = Not<IsNever<PositiveInteger<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsNegativeInteger`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***negative integer***.**
 * @example
 * ```ts
 * type A = IsNegativeInteger<-42>;   // ➔ true
 * type B = IsNegativeInteger<5>;     // ➔ false
 * type C = IsNegativeInteger<-3.14>; // ➔ false
 * ```
 */
type IsNegativeInteger<T extends number> = Not<IsNever<NegativeInteger<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsPositiveFloat`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***positive float***.**
 * @example
 * ```ts
 * type A = IsPositiveFloat<3.14>; // ➔ true
 * type B = IsPositiveFloat<-2.5>; // ➔ false
 * type C = IsPositiveFloat<5>;    // ➔ false
 * ```
 */
type IsPositiveFloat<T extends number> = Not<IsNever<PositiveFloat<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsNegativeFloat`.***
 * -------------------------------------------------------
 * **Whether `T` is a ***negative float***.**
 * @example
 * ```ts
 * type A = IsNegativeFloat<-3.14>; // ➔ true
 * type B = IsNegativeFloat<2.5>;   // ➔ false
 * type C = IsNegativeFloat<-5>;    // ➔ false
 * ```
 */
type IsNegativeFloat<T extends number> = Not<IsNever<NegativeFloat<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfInteger`.***
 * -------------------------------------------------------
 * **Conditional: `If` branch if `T` is an ***integer***.**
 * @example
 * ```ts
 * type A = IfInteger<42>;                // ➔ true
 * type B = IfInteger<3.14>;              // ➔ false
 * type C = IfInteger<42, "yes", "no">;   // ➔ "yes"
 * type D = IfInteger<3.14, "yes", "no">; // ➔ "no"
 * ```
 */
type IfInteger<T extends number, IfTrue = true, IfFalse = false> = If<
  IsInteger<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfFloat`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***float***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfFloat<3.14>;              // ➔ true
 * type B = IfFloat<42>;                // ➔ false
 * type C = IfFloat<3.14, "yes", "no">; // ➔ "yes"
 * type D = IfFloat<42, "yes", "no">;   // ➔ "no"
 * ```
 */
type IfFloat<T extends number, IfTrue = true, IfFalse = false> = If<
  IsFloat<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfEven`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is ***even***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfEven<4>;                // ➔ true
 * type B = IfEven<5>;                // ➔ false
 * type C = IfEven<4, "even", "odd">; // ➔ "even"
 * type D = IfEven<5, "even", "odd">; // ➔ "odd"
 * ```
 */
type IfEven<T extends number, IfTrue = true, IfFalse = false> = If<
  IsEven<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfOdd`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is ***odd***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfOdd<5>;                // ➔ true
 * type B = IfOdd<4>;                // ➔ false
 * type C = IfOdd<5, "odd", "even">; // ➔ "odd"
 * type D = IfOdd<4, "odd", "even">; // ➔ "even"
 * ```
 */
type IfOdd<T extends number, IfTrue = true, IfFalse = false> = If<
  IsOdd<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfPositive`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is ***positive***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfPositive<10>;              // ➔ true
 * type B = IfPositive<-5>;              // ➔ false
 * type C = IfPositive<10, "yes", "no">; // ➔ "yes"
 * type D = IfPositive<-5, "yes", "no">; // ➔ "no"
 * ```
 */
type IfPositive<T extends number, IfTrue = true, IfFalse = false> = If<
  IsPositive<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfNegative`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is ***negative***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfNegative<-10>;              // ➔ true
 * type B = IfNegative<5>;                // ➔ false
 * type C = IfNegative<-10, "yes", "no">; // ➔ "yes"
 * type D = IfNegative<5, "yes", "no">;   // ➔ "no"
 * ```
 */
type IfNegative<T extends number, IfTrue = true, IfFalse = false> = If<
  IsNegative<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfPositiveInteger`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***positive integer***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfPositiveInteger<42>;              // ➔ true
 * type B = IfPositiveInteger<-5>;              // ➔ false
 * type C = IfPositiveInteger<42, "yes", "no">; // ➔ "yes"
 * type D = IfPositiveInteger<-5, "yes", "no">; // ➔ "no"
 * ```
 */
type IfPositiveInteger<T extends number, IfTrue = true, IfFalse = false> = If<
  IsPositiveInteger<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfNegativeInteger`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***negative integer***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`) .
 * @example
 * ```ts
 * type A = IfNegativeInteger<-42>;              // ➔ true
 * type B = IfNegativeInteger<5>;                // ➔ false
 * type C = IfNegativeInteger<-42, "yes", "no">; // ➔ "yes"
 * type D = IfNegativeInteger<5, "yes", "no">;   // ➔ "no"
 * ```
 */
type IfNegativeInteger<T extends number, IfTrue = true, IfFalse = false> = If<
  IsNegativeInteger<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfPositiveFloat`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***positive float***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfPositiveFloat<3.14>;              // ➔ true
 * type B = IfPositiveFloat<-2.5>;              // ➔ false
 * type C = IfPositiveFloat<3.14, "yes", "no">; // ➔ "yes"
 * type D = IfPositiveFloat<-2.5, "yes", "no">; // ➔ "no"
 * ```
 */
type IfPositiveFloat<T extends number, IfTrue = true, IfFalse = false> = If<
  IsPositiveFloat<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfNegativeFloat`.***
 * -------------------------------------------------------
 * **Conditional: selects one of two branches depending on whether `T` is a ***negative float***.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - A number type.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfNegativeFloat<-3.14>;              // ➔ true
 * type B = IfNegativeFloat<2.5>;                // ➔ false
 * type C = IfNegativeFloat<-3.14, "yes", "no">; // ➔ "yes"
 * type D = IfNegativeFloat<2.5, "yes", "no">;   // ➔ "no"
 * ```
 */
type IfNegativeFloat<T extends number, IfTrue = true, IfFalse = false> = If<
  IsNegativeFloat<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `ParseNumber`.***
 * --------------------------------------------------------
 * **Converts a string or property key literal into a ***number literal***.**
 * - **Behavior:**
 *      - Supports decimal numbers only.
 *      - Automatically trims whitespace.
 *      - Returns the number literal if valid.
 *      - Supports scientific notation strings (e.g., `"2e-3"`, `"-5e2"`, `"2E-3"`, `"-5E2"`).
 *        - **Note:**
 *            - TypeScript cannot represent very small (`< 1e-6`) or very large (`> 1e15`)
 *              numbers as literal types:
 *              - In such cases, scientific notation strings return `0`.
 *      - Returns `0` for strings representing hexadecimal (`0x...`), octal (`0o...`), or
 *        binary (`0b...`) if they are string literals.
 * - Returns `never` for non-numeric strings or unsupported formats.
 * @template T - A string, number, or symbol (property key).
 * @example
 * ```ts
 * // Number:
 * type A = ParseNumber<0>;     // ➔ 0
 * type B = ParseNumber<-0>;    // ➔ 0
 * type C = ParseNumber<-0.>;   // ➔ 0
 * type D = ParseNumber<42>;    // ➔ 42
 * type E = ParseNumber<0.42>;  // ➔ 0.42
 * type F = ParseNumber<-5>;    // ➔ -5
 * type G = ParseNumber<-2.5>;  // ➔ -2.5
 * type H = ParseNumber<2.5e3>; // ➔ 2500
 * type I = ParseNumber<-2.5e3>;// ➔ -2500
 * type J = ParseNumber<5e3>;   // ➔ 5000
 * type K = ParseNumber<-5e3>;  // ➔ -5000
 * type L = ParseNumber<5e21>;  // ➔ 5e+21
 * type M = ParseNumber<5e-3>;  // ➔ 0.005
 * type N = ParseNumber<5e-21>; // ➔ 5e-21
 * type O = ParseNumber<-5e-3>; // ➔ -0.005
 *
 * // Numeric String:
 * type A = ParseNumber<"0">;     // ➔ 0
 * type B = ParseNumber<"-0">;    // ➔ 0
 * type C = ParseNumber<"42">;    // ➔ 42
 * type D = ParseNumber<"0.42">;  // ➔ 0.42
 * type E = ParseNumber<"-42">;   // ➔ -42
 * type F = ParseNumber<"-0.42">; // ➔ -0.42
 * type G = ParseNumber<" 42 ">;  // ➔ 42
 * type H = ParseNumber<" -42 ">; // ➔ -1
 *
 * // Scientific notation string:
 * type S1 = ParseNumber<"2e3">;    // ➔  2000
 * type S2 = ParseNumber<"-2e3">;   // ➔  -2000
 * type S3 = ParseNumber<"2e-3">;   // ➔  0.002
 * type S4 = ParseNumber<"-2e-3">;  // ➔  -0.002
 * type S5 = ParseNumber<"2.5e3">;  // ➔  0
 * type S6 = ParseNumber<"2.5e-3">; // ➔  0
 * type S7 = ParseNumber<"2e-7">;   // ➔  0 (too small include "-2e-7" for TypeScript literal)
 * type S8 = ParseNumber<"5e21">;   // ➔  0 (too large include "-5e21" for TypeScript literal)
 *
 * // Number representing hexadecimal, octal or binary:
 * type A = ParseNumber<"011">;    // ➔ 9 (same as octal but deprecated)
 * type B = ParseNumber<"0o11">;   // ➔ 9 (octal)
 * type C = ParseNumber<"-0o11">;  // ➔ -9 (octal)
 * type D = ParseNumber<"0x12">;   // ➔ 18 (hexadecimal)
 * type E = ParseNumber<"-0x12">;  // ➔ -18 (hexadecimal)
 * type F = ParseNumber<"0b111">;  // ➔ 7 (binary)
 * type G = ParseNumber<"-0b111">; // ➔ -7 (binary)
 *
 * // String representing hexadecimal, octal or binary:
 * type A = ParseNumber<"0x2A">;     // ➔ 0 (hex on string not supported)
 * type B = ParseNumber<"0o52">;     // ➔ 0 (octal on string not supported)
 * type C = ParseNumber<"0b101010">; // ➔ 0 (binary on string not supported)
 *
 * // Never Result
 * type A = ParseNumber<string>; // ➔ never
 * type B = ParseNumber<number>; // ➔ never
 * type C = ParseNumber<"abc">;  // ➔ never
 * type D = ParseNumber<"a1">;   // ➔ never
 * type E = ParseNumber<"3b">;   // ➔ never
 * ```
 */
type ParseNumber<T extends PropertyKey | bigint> = T extends bigint
  ? T
  : If<
      number extends T ? false : true,
      IfExtends<
        OrArr<
          [
            Extends<"-0", Trim<Extract<T, PropertyKey>>>,
            Extends<-0, T>,
            Extends<T, `${"-" | ""}${"0"}.`>
          ]
        >,
        true,
        0,
        T extends `${"-" | ""}0${"x" | "b" | "o"}${number}`
          ? 0
          : Trim<
                Extract<T, PropertyKey>
              > extends `${infer NumT extends number | string}`
            ? T extends `${infer N extends number}.`
              ? N
              : NumT extends string
                ? ParseScientificNumber<NumT>
                : NumT
            : Trim<Extract<T, PropertyKey>> extends number
              ? T
              : never
      >,
      never
    >;
/** -------------------------------------------------------
 * * ***Utility Type: `IsScientificNumber`.***
 * -------------------------------------------------------
 * **Checks if a string literal `T` represents a **scientific number**.**
 * - **A scientific number is defined as a number in the form of:**
 *      - Optional negative sign (`-`).
 *      - Mantissa (digits, can be integer or decimal).
 *      - Exponent indicated by `e` or `E`.
 *      - Exponent value (digits, optional negative sign).
 *      - **Important:**
 *         - TypeScript cannot detect numeric literals in scientific notation
 *            at type-level because number literals are normalized to decimals:
 *            - Only string literals like `"2.5E3"` or `"-1e-5"` can be detected.
 * @template T - A string literal to check.
 * @example
 * ```ts
 * type A = IsScientificNumber<"1e5">;   // ➔ true
 * type B = IsScientificNumber<"-1e-5">; // ➔ true
 * type C = IsScientificNumber<"2.5E3">; // ➔ true
 * type D = IsScientificNumber<"42">;    // ➔ false
 * type E = IsScientificNumber<"-0.42">; // ➔ false
 * type F = IsScientificNumber<string>;  // ➔ false
 * ```
 * @remarks
 * - Uses template literal types and conditional type {@link Extends | **`Extends`**}.
 * - Returns `true` if `T` is scientific number string literal, otherwise `false`.
 * - Returns `boolean` if `T` is generic `string`.
 */
type IsScientificNumber<T extends string> = Extends<
  T,
  `${"-" | ""}${number}${"e" | "E"}${number}`
>;
/** * ***Helper for {@link ParseScientificNumber | **`ParseScientificNumber`**}.*** */
type BuildTuple<
  L extends number,
  T extends unknown[] = []
> = T["length"] extends L ? T : BuildTuple<L, [...T, unknown]>;
/** * ***Helper for {@link ParseScientificNumber | **`ParseScientificNumber`**}.*** */
type _DecrementParseScientific<N extends number> =
  BuildTuple<N> extends [infer _, ...infer Rest] ? Rest["length"] : never;
/** -------------------------------------------------------
 * * ***Utility Type: `ParseScientificNumber`.***
 * -------------------------------------------------------
 * **Converts a numeric string in scientific notation (e.g., `"2e-3"`, `"-5e2"`)
 * into a literal number type.**
 * - **Important:**
 *      - TypeScript cannot represent very small or very large numbers
 *        as literal types:
 *        - In such cases, this utility will return `0`.
 * @template T - A numeric string to parse. Can be in:
 * - Positive or negative scientific notation (e.g., `"1e3"`, `"-2e-2"`).
 * - Regular number literal (e.g., `"42"`, `"-5"`).
 * @example
 * ```ts
 * type A1 = ParseScientificNumber<"2e-3">;  // ➔ 0.002
 * type A2 = ParseScientificNumber<"-2e-3">; // ➔ -0.002
 * type A3 = ParseScientificNumber<"5e2">;   // ➔ 500
 * type A4 = ParseScientificNumber<"-5e2">;  // ➔ -500
 * type A5 = ParseScientificNumber<"2e-7">;  // ➔ 0 (TypeScript cannot represent literal)
 * type A6 = ParseScientificNumber<"5e21">;  // ➔ 0 (TypeScript cannot represent literal)
 * type A7 = ParseScientificNumber<"42">;    // ➔ 42
 * type A8 = ParseScientificNumber<"-42">;   // ➔ -42
 * ```
 * @remarks
 * - Uses type-level string manipulation to handle scientific notation.
 * - Negative exponents are adjusted with {@link _DecrementParseScientific | **`_DecrementParseScientific`**} and
 *  {@link Repeat | **`Repeat`**}.
 * - Returns `0` if TypeScript cannot infer the exact numeric literal.
 */
type ParseScientificNumber<T extends string> =
  T extends `-${infer Mantissa}${"e" | "E"}-${infer Exp extends number}`
    ? `-${"0."}${Repeat<"0", _DecrementParseScientific<Exp>>}${Mantissa}` extends `${infer N extends number}`
      ? number extends N
        ? 0
        : N
      : never
    : T extends `${infer Mantissa}${"e" | "E"}-${infer Exp extends number}`
      ? `0.${Repeat<"0", _DecrementParseScientific<Exp>>}${Mantissa}` extends `${infer N extends number}`
        ? number extends N
          ? 0
          : N
        : never
      : T extends `-${infer Mantissa}${"e" | "E"}${infer Exp extends number}`
        ? `-${Mantissa}${Repeat<"0", Exp>}` extends `${infer N extends number}`
          ? number extends N
            ? 0
            : N
          : never
        : T extends `${infer Mantissa}${"e" | "E"}${infer Exp extends number}`
          ? `${Mantissa}${Repeat<"0", Exp>}` extends `${infer N extends number}`
            ? number extends N
              ? 0
              : N
            : never
          : T extends `${infer N extends number}`
            ? number extends N
              ? 0
              : N
            : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Abs`.***
 * -------------------------------------------------------
 * **Computes the ***absolute value*** of `T`.**
 * - **Behavior:**
 *      - Accepts `number` literals or numeric `string` literals.
 *      - Returns the ***absolute value*** as a `number`.
 *      - If `T` is not a valid number, ***`like`***:
 *        - `hex`, `binary`, `octal`, or `non-numeric string` will return `never`.
 * @template T - A number type or string literal representing a number.
 * @example
 * ```ts
 * type A = Abs<-42>;   // ➔ 42
 * type B = Abs<10>;    // ➔ 10
 * type C = Abs<"11">;  // ➔ 11
 * type D = Abs<"-11">; // ➔ 11
 *
 * // Not a number
 * type Invalid1 = Abs<"1a">;    // ➔ never
 * type Invalid2 = Abs<"a1">;    // ➔ never
 * type Invalid3 = Abs<"a1a">;   // ➔ never
 * type Invalid4 = Abs<"abc">;   // ➔ never
 * type Invalid5 = Abs<string>;  // ➔ never
 * type Invalid6 = Abs<number>;  // ➔ never
 * ```
 */
type Abs<T extends PropertyKey | bigint> =
  `${Exclude<T, symbol>}` extends `-${infer PositiveT extends number}`
    ? ParseNumber<PositiveT>
    : ParseNumber<T>;
/** -------------------------------------------------------
 * * ***Utility Type: `Negate`.***
 * -------------------------------------------------------
 * **Produces the ***negated value*** of `T` (multiplies by `-1`).**
 * - **Behavior:**
 *      - Only supports valid **number literals** or **numeric-strings**.
 *      - Invalid numeric-strings (***like***: `"1a"`, `"abc"`, `hex`, `binary`, `octal`)
 *        or `non-numeric` types, ***`like`***:
 *        - `string`, `number`, `symbol` will return `0`.
 * @template T - A number type or numeric-string.
 * @example
 * ```ts
 * type A = Negate<5>;     // ➔ -5
 * type B = Negate<-10>;   // ➔ -10
 * type C = Negate<0>;     // ➔ 0
 * type D = Negate<-0>;    // ➔ 0
 * type E = Negate<"123">; // ➔ -123
 *
 * // Not a number or numeric-string:
 * type Invalid1 = Negate<string>;  // ➔ 0
 * type Invalid2 = Negate<number>;  // ➔ 0
 * type Invalid3 = Negate<"abc">;   // ➔ 0
 * type Invalid4 = Negate<"1a">;    // ➔ 0
 * type Invalid5 = Negate<"2b">;    // ➔ 0
 * type Invalid6 = Negate<"0x1f">;  // ➔ 0
 * type Invalid7 = Negate<"0b101">; // ➔ 0
 * type Invalid8 = Negate<"0o77">;  // ➔ 0
 * ```
 */
type Negate<T extends PropertyKey> = ParseNumber<`-${Abs<ParseNumber<T>>}`>;
/** -------------------------------------------------------
 * * ***Utility Type: `Stringify`.***
 * -------------------------------------------------------
 * **Converts a value of type `number`, `boolean`, `string`, `bigint`, `undefined`, or `null` into a string literal type.**
 * - **Behavior:**
 *      - `number` ➔ string representation (e.g., `123` ➔ `"123"`)
 *      - `boolean` ➔ `"true"` or `"false"`
 *      - `string` ➔ itself
 *      - `bigint` ➔ string representation with `"n"` suffix (e.g., `123n` ➔ `"123n"`)
 *      - `undefined` ➔ `"undefined"`
 *      - `null` ➔ `"null"`
 *      - Other types ➔ `never`
 * @template T - The value type to stringify.
 * @example
 * ```ts
 * // Boolean
 * type Result1 = Stringify<true>;
 * // ➔ "true"
 *
 * // Number
 * type Result2 = Stringify<123>;
 * // ➔ "123"
 *
 * // BigInt
 * type Result3 = Stringify<123n>;
 * // ➔ "123n"
 *
 * // String
 * type Result4 = Stringify<"hello">;
 * // ➔ "hello"
 *
 * // Undefined
 * type Result5 = Stringify<undefined>;
 * // ➔ "undefined"
 *
 * // Null
 * type Result6 = Stringify<null>;
 * // ➔ "null"
 *
 * // Other type
 * type Result7 = Stringify<{}>;
 * // ➔ never
 * ```
 */
type Stringify<T> = T extends
  | number
  | boolean
  | string
  | bigint
  | undefined
  | null
  ? T extends bigint
    ? `${T}n`
    : `${T}`
  : never;
type DecrementMap = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
type NegativeCarryMap = {
  "-1": 9;
};
/** -------------------------------------------------------
 * * ***Internal Utility Type: `_Decrement (Internal / Deprecated)`***
 * -------------------------------------------------------
 * **Internal type-level utility to decrement a numeric string by 1.**
 * - **⚠️ Deprecated:**
 *      - Do **not** use this directly.
 *      - Use the public {@link Decrement | **`Decrement`**} type instead.
 * - Processes the string recursively digit by digit.
 * - Handles borrow/carry using internal `DecrementMap` and `NegativeCarryMap`.
 * @template Number - The numeric string to decrement.
 * @template Result - (Internal) Accumulator used during recursion.
 * @deprecated Use {@link Decrement | **`Decrement`**} instead.
 * @example
 * ```ts
 * // ❌ Avoid using _Decrement directly
 * type R1 = _Decrement<"23">;
 *
 * // ✅ Use Decrement instead
 * type R2 = Decrement<"23">; // ➔ 22
 * ```
 */
type _Decrement<
  Number extends string,
  Result extends string = ""
> = Number extends ""
  ? ParseNumber<Result>
  : ParseNumber<LastCharacter<Number>> extends infer LastDigit extends number
    ? DecrementMap[LastDigit] extends infer Decremented extends number
      ? Number extends `${infer Rest}${LastDigit}`
        ? `${Decremented}` extends keyof NegativeCarryMap
          ? _Decrement<Rest, `${NegativeCarryMap[`${Decremented}`]}${Result}`>
          : `${Rest}${Decremented}${Result}` extends infer FinalResult extends
                string
            ? ParseNumber<
                FinalResult extends `0${infer FinalResultWithoutLeadingZero extends string}`
                  ? FinalResultWithoutLeadingZero extends ""
                    ? FinalResult
                    : FinalResultWithoutLeadingZero
                  : FinalResult
              >
            : never
        : never
      : never
    : never;
type _DecrementNegativeOrZero<T extends number> =
  _Increment<Stringify<T>> extends infer PositiveDecrementResult extends number
    ? PositiveDecrementResult extends 0
      ? PositiveDecrementResult
      : Negate<PositiveDecrementResult>
    : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Decrement`.***
 * --------------------------------------------------------
 * **A type-level utility that returns the decremented value of an integer.**
 * - Works for numbers in the range `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template T - The number type to decrement.
 * @example
 * ```ts
 * type A = Decrement<6>;   // ➔ 5
 * type B = Decrement<0>;   // ➔ -1
 * type C = Decrement<-6>;  // ➔ -7
 * type D = Decrement<123>; // ➔ 122
 * type E = Decrement<-1>;  // ➔ -2
 * ```
 */
type Decrement<T extends number> =
  IsNegative<T> extends true
    ? _DecrementNegativeOrZero<Abs<T>>
    : T extends 0
      ? _DecrementNegativeOrZero<T>
      : _Decrement<Stringify<T>>;
type IncrementMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type LastDigitMap = {
  10: 0;
};
/** -------------------------------------------------------
 * * ***Internal Utility Type: `_Increment (Internal / Deprecated)`***
 * -------------------------------------------------------
 * **Internal type-level utility to increment a numeric string by 1.**
 * - **⚠️ Deprecated:**
 *       - Do **not** use this directly.
 *       - Use the public {@link Increment | **`Increment`**} type instead.
 * - Processes the string recursively digit by digit.
 * - Handles carry-over using internal `IncrementMap` and `LastDigitMap`.
 * @template Number - The numeric string to increment.
 * @template Result - (Internal) Accumulator used during recursion.
 * @deprecated Use {@link Increment | **`Increment`**} instead.
 * @example
 * ```ts
 * // ❌ Avoid using _Increment directly
 * type R1 = _Increment<"23">;
 *
 * // ✅ Use Increment instead
 * type R2 = Increment<"23">; // ➔ 24
 * ```
 */
type _Increment<Number extends string, Result extends string = ""> =
  IsEmptyString<Number> extends true
    ? ParseNumber<`1${Result}`>
    : LastCharacter<Number> extends `${infer LastDigit extends number}`
      ? IncrementMap[LastDigit] extends infer Incremented extends number
        ? Number extends `${infer Rest}${LastDigit}`
          ? Incremented extends keyof LastDigitMap
            ? _Increment<Rest, `${LastDigitMap[Incremented]}${Result}`>
            : ParseNumber<`${Rest}${Incremented}${Result}`>
          : never
        : never
      : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Increment`.***
 * -------------------------------------------------------
 * **Accepts an integer and returns the incremented value of it.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`
 * @template T - The input number to increment.
 * @example
 * ```ts
 * type Case1 = Increment<1>; // ➔ 2
 * type Case2 = Increment<-10>; // ➔ -9
 * ```
 */
type Increment<T extends number> =
  IsNegative<T> extends true
    ? _Decrement<
        Stringify<Abs<T>>
      > extends infer NegativeIncrementResult extends number
      ? NegativeIncrementResult extends 0
        ? NegativeIncrementResult
        : Negate<NegativeIncrementResult>
      : never
    : _Increment<Stringify<T>>;
/** -------------------------------------------------------
 * * ***Utility Type: `GetFloatNumberParts`.***
 * -------------------------------------------------------
 * **Returns a tuple of the **whole** and **fraction** parts of a float number `T`.**
 * - **Behavior:**
 *      - Only works for **float numbers** (i.e., numbers with a fractional part):
 *          - If `T` is not a float, the result is `never`.
 *      - Preserves the sign on the whole part (e.g. `-12.25` ➔ `[-12, 25]`).
 *      - For values like `-0.x`, the TypeScript will normalizes `-0` to `0`,
 *        so the result will be `[0, ...]`.
 * @template T - A float number type.
 * @example
 * ```ts
 * type A = GetFloatNumberParts<12.25>;  // ➔ [12, 25]
 * type B = GetFloatNumberParts<-12.25>; // ➔ [-12, 25]
 * type C = GetFloatNumberParts<3.1415>; // ➔ [3, 1415]
 * type D = GetFloatNumberParts<-0.75>;  // ➔ [0, 75] (`-0` normalized to `0`)
 * type E = GetFloatNumberParts<42>;     // ➔ never (not a float)
 * ```
 */
type GetFloatNumberParts<T extends number> =
  IsFloat<T> extends true
    ? `${T}` extends `${infer Whole extends number}.${infer Fraction extends number}`
      ? [IsNegative<T> extends true ? Whole : Whole, Fraction]
      : never
    : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Ceil`.***
 * -------------------------------------------------------
 * **A type-level utility that computes the **mathematical ceiling**
 * of a numeric literal type `T`, type version of `Math.ceil()`.**
 * - **Behavior:**
 *      - If `T` is an integer, it returns `T` unchanged.
 *      - If `T` is a positive float, it rounds up to the nearest integer.
 *      - If `T` is a negative float, it rounds up toward zero.
 * @template T - A number literal type.
 * @example
 * ```ts
 * type A = Ceil<1.2>;  // ➔ 2
 * type B = Ceil<1.9>;  // ➔ 2
 * type C = Ceil<5>;    // ➔ 5
 * type D = Ceil<-1.2>; // ➔ -1
 * type E = Ceil<-1.9>; // ➔ -1
 * type F = Ceil<-5>;   // ➔ -5
 * ```
 */
type Ceil<T extends number> =
  IsFloat<T> extends true
    ? GetFloatNumberParts<T> extends [infer Whole extends number, unknown]
      ? IsNegative<T> extends true
        ? Negate<Whole>
        : Increment<Whole>
      : never
    : T;
/** -------------------------------------------------------
 * * ***Utility Type: `Split`***
 * -------------------------------------------------------
 * **A type-level utility that mimics `String.prototype.split()`.**
 * @description
 * Splits a string literal `Str` into a tuple of substrings,
 * using `Del` as the delimiter.
 * - **Behavior:**
 *      - If `Del` is the empty string `""`, the result is a tuple of characters.
 *      - If `Del` is not found in `Str`, the result is a tuple with the original string.
 *      - Works only with string literals. If `Str` is just `string`, the result is `string[]`.
 * @template Str - The input string literal to be split.
 * @template Del - The delimiter used to split the string.
 *                 Defaults to `""` (character-level split).
 * @constraints
 * - `Str` must be a string literal to get precise results.
 * - `Del` can be a string or number (numbers are converted to strings).
 * @example
 * ```ts
 * // ✅ Split into characters
 * type A = Split<"abc">; // ➔ ["a", "b", "c"]
 *
 * // ✅ Split by a comma
 * type B = Split<"a,b,c", ",">; // ➔ ["a", "b", "c"]
 *
 * // ✅ Split by multi-char delimiter
 * type C = Split<"2025-08-22", "-">; // ➔ ["2025", "08", "22"]
 *
 * // ✅ Delimiter not found ➔ returns whole string
 * type D = Split<"hello", "|">; // ➔ ["hello"]
 *
 * // ⚠️ Non-literal string
 * type E = Split<string, ",">; // string[]
 * ```
 */
type Split<
  Str extends string,
  Del extends string | number = ""
> = string extends Str
  ? string[]
  : "" extends Str
    ? []
    : Str extends `${infer T}${Del}${infer U}`
      ? [T, ...Split<U, Del>]
      : [Str];
/** @private ***types for {@link CharAt}.*** */
type _CharAt<
  I extends string,
  N extends number | `${number}`,
  _S extends string[] = Split<I, "">
> = IfExtends<
  And<
    Extends<IsPositive<ParseNumber<N>>, true>,
    Extends<And<Extends<N, keyof _S>, Extends<IsStringLiteral<I>, true>>, true>
  >,
  true,
  _S[Extract<N, keyof _S>],
  undefined
>;
/** -------------------------------------------------------
 * * ***Utility Type: `CharAt`.***
 * -------------------------------------------------------
 * **A type-level utility that extracts the character at a given index `N`
 * from a string literal type `I`.**
 * - **Behavior:**
 *      - If the index is out of range, the result is `undefined`.
 *      - If `I` is not a literal string (just `string`), the result is `undefined`.
 *      - Only **positive indices** are supported (`0` and above`).
 * @template I - The input string literal to extract the character from.
 * @template N - The zero-based index of the character to retrieve.
 * @example
 * ```ts
 * // ✅ Basic usage
 * type A = CharAt<"hello", 0>; // ➔ "h"
 * type B = CharAt<"hello", 1>; // ➔ "e"
 * type C = CharAt<"hello", 4>; // ➔ "o"
 *
 * // ⚠️ Index out of range ➔ undefined
 * type D = CharAt<"hello", 5>; // ➔ undefined
 * type E = CharAt<"abc", 99>;  // ➔ undefined
 *
 * // ✅ Stringified index also works
 * type F = CharAt<"testing", "0">; // ➔ "t"
 * type G = CharAt<"testing", "2">; // ➔ "s"
 * type H = CharAt<"testing", "6">; // ➔ "g"
 * type I = CharAt<"testing", "7">; // ➔ undefined
 *
 * // ⚠️ Non-literal strings ➔ undefined
 * type J = CharAt<string, 2>; // ➔ undefined
 *
 * // ⚠️ Negative indices are not supported
 * type K = CharAt<"abc", -1>; // ➔ undefined
 * ```
 */
type CharAt<I extends string, N extends number | `${number}`> = _CharAt<I, N>;
/** -------------------------------------------------------
 * * ***Utility Type: `ColorCssNamed`.***
 * -------------------------------------------------------
 * **Represents a **named CSS color keyword**, including `transparent`.**
 * @description
 * This type includes all standard color names defined in the CSS Color Module Level 4
 * specification, and ensures type safety for string values in strongly typed UI libraries,
 * themes, or design systems.
 * - **Behavior:**
 *      - Only recognized, browser-supported named colors are allowed.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/named-color
 * @see https://drafts.csswg.org/css-color-4/#named-colors
 * @example
 * ```ts
 * const textColor1: ColorCssNamed = "rebeccapurple"; // ➔ ✅ valid
 * const textColor2: ColorCssNamed = "navy";          // ➔ ✅ valid
 * const textColor3: ColorCssNamed = "superblue";     // ➔ ❌ Type error
 *
 * // Usage in a theme object
 * const theme: Record<string, ColorCssNamed> = {
 *   primary: "blue",
 *   secondary: "goldenrod",
 *   highlight: "transparent",
 * };
 * ```
 */
type ColorCssNamed =
  | "aliceblue"
  | "antiquewhite"
  | "aqua"
  | "aquamarine"
  | "azure"
  | "beige"
  | "bisque"
  | "black"
  | "blanchedalmond"
  | "blue"
  | "blueviolet"
  | "brown"
  | "burlywood"
  | "cadetblue"
  | "chartreuse"
  | "chocolate"
  | "coral"
  | "cornflowerblue"
  | "cornsilk"
  | "crimson"
  | "cyan"
  | "darkblue"
  | "darkcyan"
  | "darkgoldenrod"
  | "darkgray"
  | "darkgreen"
  | "darkgrey"
  | "darkkhaki"
  | "darkmagenta"
  | "darkolivegreen"
  | "darkorange"
  | "darkorchid"
  | "darkred"
  | "darksalmon"
  | "darkseagreen"
  | "darkslateblue"
  | "darkslategray"
  | "darkslategrey"
  | "darkturquoise"
  | "darkviolet"
  | "deeppink"
  | "deepskyblue"
  | "dimgray"
  | "dimgrey"
  | "dodgerblue"
  | "firebrick"
  | "floralwhite"
  | "forestgreen"
  | "fuchsia"
  | "gainsboro"
  | "ghostwhite"
  | "gold"
  | "goldenrod"
  | "gray"
  | "green"
  | "greenyellow"
  | "grey"
  | "honeydew"
  | "hotpink"
  | "indianred"
  | "indigo"
  | "ivory"
  | "khaki"
  | "lavender"
  | "lavenderblush"
  | "lawngreen"
  | "lemonchiffon"
  | "lightblue"
  | "lightcoral"
  | "lightcyan"
  | "lightgoldenrodyellow"
  | "lightgray"
  | "lightgreen"
  | "lightgrey"
  | "lightpink"
  | "lightsalmon"
  | "lightseagreen"
  | "lightskyblue"
  | "lightslategray"
  | "lightslategrey"
  | "lightsteelblue"
  | "lightyellow"
  | "lime"
  | "limegreen"
  | "linen"
  | "magenta"
  | "maroon"
  | "mediumaquamarine"
  | "mediumblue"
  | "mediumorchid"
  | "mediumpurple"
  | "mediumseagreen"
  | "mediumslateblue"
  | "mediumspringgreen"
  | "mediumturquoise"
  | "mediumvioletred"
  | "midnightblue"
  | "mintcream"
  | "mistyrose"
  | "moccasin"
  | "navajowhite"
  | "navy"
  | "oldlace"
  | "olive"
  | "olivedrab"
  | "orange"
  | "orangered"
  | "orchid"
  | "palegoldenrod"
  | "palegreen"
  | "paleturquoise"
  | "palevioletred"
  | "papayawhip"
  | "peachpuff"
  | "peru"
  | "pink"
  | "plum"
  | "powderblue"
  | "purple"
  | "rebeccapurple"
  | "red"
  | "rosybrown"
  | "royalblue"
  | "saddlebrown"
  | "salmon"
  | "sandybrown"
  | "seagreen"
  | "seashell"
  | "sienna"
  | "silver"
  | "skyblue"
  | "slateblue"
  | "slategray"
  | "slategrey"
  | "snow"
  | "springgreen"
  | "steelblue"
  | "tan"
  | "teal"
  | "thistle"
  | "tomato"
  | "transparent"
  | "turquoise"
  | "violet"
  | "wheat"
  | "white"
  | "whitesmoke"
  | "yellow"
  | "yellowgreen";
/** -------------------------------------------------------
 * * ***Utility Type: `IsEqual`.***
 * -------------------------------------------------------
 * **A type-level utility that returns a boolean indicating
 * whether the two types are ***equal***.**
 * @template T - The first type to compare.
 * @template U - The second type to compare.
 * @example
 * ```ts
 * type A = IsEqual<string, string>;
 *  // ➔ true
 * type B = IsEqual<1, 4>;
 *  // ➔ false
 * type C = IsEqual<true, false>;
 *  // ➔ false
 * type D = IsEqual<any, any>;
 *  // ➔ true
 * ```
 */
type IsEqual<T, U> =
  (<F>() => F extends T ? 1 : 2) extends <F>() => F extends U ? 1 : 2
    ? true
    : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IsNotEqual`.***
 * -------------------------------------------------------
 * **A type-level utility that returns a boolean indicating
 * whether the two types are ***not equal***.**
 * @template T - The first type to compare.
 * @template U - The second type to compare.
 * @example
 * ```ts
 * type A = IsNotEqual<1, 4>;
 * // ➔ true
 * type B = IsNotEqual<string, string>;
 * // ➔ false
 * ```
 */
type IsNotEqual<T, U> = Not<IsEqual<T, U>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfEqual`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Selects one of two branches depending on whether `T` and `U` are ***equal***.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The first type to compare.
 * @template U - The second type to compare.
 * @template IfTrue - The branch type if condition is met. (default: `true`)
 * @template IfFalse - The branch type if condition is not met. (default: `false`)
 * @example
 * ```ts
 * type A = IfEqual<string, string, "valid">;      // ➔ "valid"
 * type B = IfEqual<1, 4, "valid", "invalid">;    // ➔ "invalid"
 * ```
 */
type IfEqual<T, U, IfTrue = true, IfFalse = false> = If<
  IsEqual<T, U>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfNotEqual`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Selects one of two branches depending on whether `T` and `U` are ***not equal***.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The first type to compare.
 * @template U - The second type to compare.
 * @template IfTrue - The branch type if condition is met. (default: `true`)
 * @template IfFalse - The branch type if condition is not met. (default: `false`)
 * @example
 * ```ts
 * type A = IfNotEqual<1, 4, "valid">;
 * // ➔ "valid"
 * type B = IfNotEqual<string, string, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
type IfNotEqual<T, U, IfTrue = true, IfFalse = false> = If<
  IsNotEqual<T, U>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsUnknown`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the given type `T` is `unknown`.**
 * @template T - The type to check.
 * @example
 * ```ts
 * type TrueResult = IsUnknown<unknown>;  // ➔ true
 * type FalseResult1 = IsUnknown<any>;    // ➔ false
 * type FalseResult2 = IsUnknown<string>; // ➔ false
 * ```
 */
type IsUnknown<T> =
  IsAny<T> extends true ? false : [unknown] extends [T] ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IfUnknown`.***
 * -------------------------------------------------------
 * - **Conditional type:**
 *      - Returns `IfTrue` if `T` is `unknown`, otherwise returns `IfFalse`.
 * @template T - The type to check.
 * @template IfTrue - The type returned if `T` is `unknown` (default: `true`).
 * @template IfFalse - The type returned if `T` is not `unknown` (default: `false`).
 * @example
 * ```ts
 * type Result1 = IfUnknown<unknown, "foo", "bar">; // ➔ "foo"
 * type Result2 = IfUnknown<string, "foo", "bar">;  // ➔ "bar"
 * ```
 */
type IfUnknown<T, IfTrue = true, IfFalse = false> = If<
  IsUnknown<T>,
  IfTrue,
  IfFalse
>;
/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link UnknownifyProperties | `UnknownifyProperties`}.***
 * ---------------------------------------------------------------------------
 * @property makeOptional - If `true`, all properties become optional.
 */
type UnknownifyPropertiesOptions = {
  /**
   * If `true`, all properties of the object become optional.
   *
   * DefaultValue: `false`.
   *
   * @default false
   * @example
   * ```ts
   * type A = { a: string; b: number };
   * type B = UnknownifyProperties<A, { makeOptional: true }>;
   * // ➔ { a?: unknown; b?: unknown }
   * ```
   */
  makeOptional: boolean;
};
/** -------------------------------------------------------
 * * ***Utility Type: `UnknownifyProperties`.***
 * -------------------------------------------------------
 * **Transforms all properties of an object type `T` to `unknown`.**
 * @description Optionally, makes all properties optional based on `Options`.
 * @template T - The object type to transform.
 * @template Options - Configuration options (default: `{ makeOptional: false }`).
 *
 * @example
 * ```ts
 * type A = { a: string; b: number };
 * type Result1 = UnknownifyProperties<A>;
 * // ➔ { a: unknown; b: unknown }
 * type Result2 = UnknownifyProperties<A, { makeOptional: true }>;
 * // ➔ { a?: unknown; b?: unknown }
 * ```
 */
type UnknownifyProperties<
  T extends object,
  Options extends UnknownifyPropertiesOptions = {
    makeOptional: false;
  }
> = { [K in keyof T]: unknown } extends infer Result
  ? If<Options["makeOptional"], Partial<Result>, Result>
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsExactly`.***
 * -------------------------------------------------------
 * **A strict equality check between two types `A` and `B`
 * that does **not** collapse when one of them is `any`.**
 * - **Behavior:**
 *      - Returns `true` only if `A` and `B` are **mutually assignable**.
 *      - Returns `false` if either `A` or `B` is `any`.
 * @template A - The first type to compare.
 * @template B - The second type to compare.
 * @example
 * ```ts
 * type A = IsExactly<string, string>; // ➔ true
 * type B = IsExactly<string, any>;    // ➔ false
 * type C = IsExactly<42, number>;     // ➔ false
 * type D = IsExactly<never, never>;   // ➔ true
 * type E = IsExactly<any, any>;       // ➔ false
 * ```
 */
type IsExactly<A, B> =
  IsAny<A> extends true
    ? false
    : IsAny<B> extends true
      ? false
      : (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
        ? (<T>() => T extends B ? 1 : 2) extends <T>() => T extends A ? 1 : 2
          ? true
          : false
        : false;
/** --------------------------------------------------
 * * ***Utility Type: `NodeBuiltins`.***
 * --------------------------------------------------
 * **Represents Node.js built-in core objects.**
 * @description
 * Includes commonly used Node.js core classes/objects that are not plain objects.
 * - **Examples:**
 *      - `Buffer`.
 *      - `EventEmitter`.
 *      - `Stream`.
 *      - `URL`.
 *      - `process`.
 * - ❌ Excludes plain objects (`{}`) and primitives.
 * - ⚠️ Note:
 *      - This is **not exhaustive** because Node.js has
 *        many built-in modules, but it covers the main
 *        runtime objects often encountered.
 */
type NodeBuiltins =
  | Buffer
  | NodeJS.EventEmitter
  | NodeJS.ReadableStream
  | NodeJS.WritableStream
  | NodeJS.Process
  | URL;
/** --------------------------------------------------
 * * ***Utility Type: `DataTypes`.***
 * --------------------------------------------------
 * **Represents a broad union of commonly used JavaScript data types.**
 * - ✅ ***Includes:***
 *     - `Primitive-Types`.
 *     - `object`.
 *     - `null`.
 *     - `undefined`.
 *     - `symbol`.
 *     - `Any-Function` signature.
 * @example
 * ```ts
 * function isValidType(value: DataTypes): boolean {
 *   return value !== undefined && value !== null;
 * }
 * ```
 */
type DataTypes =
  | bigint
  | boolean
  | AnyFunction
  | null
  | number
  | object
  | string
  | symbol
  | undefined;
/** --------------------------------------------------
 * * ***Utility Type: `DeepReplaceType`.***
 * --------------------------------------------------
 * **Recursively traverses an array, tuple, or object (including nested structures)
 * and replaces all values of type `Target` with `NewType`.**
 * - ✅ Useful for remapping deeply nested arrays, tuples, or records.
 * @template Arr - The input array, tuple, or object.
 * @template Target - The type to match and replace.
 * @template NewType - The new type to assign to matched values.
 * @example
 * ```ts
 * // Simple tuple
 * type A = [number, string, [number]];
 * type B = DeepReplaceType<A, number, boolean>;
 * // ➔ [boolean, string, [boolean]]
 *
 * // Nested object
 * type Obj = { a: number; b: { c: number; d: string } };
 * type ObjReplaced = DeepReplaceType<Obj, number, boolean>;
 * // ➔ { a: boolean; b: { c: boolean; d: string } }
 *
 * // Mixed array and object
 * type Mixed = [{ x: number }, { y: string, z: number[] }];
 * type MixedReplaced = DeepReplaceType<Mixed, number, boolean>;
 * // ➔ [{ x: boolean }, { y: string, z: boolean[] }]
 * ```
 */
type DeepReplaceType<Arr, Target, NewType> = Arr extends Target
  ? NewType
  : Arr extends object
    ? { [K in keyof Arr]: DeepReplaceType<Arr[K], Target, NewType> }
    : Arr;
/** --------------------------------------------------
 * * ***Utility Type: `TypedArray`.***
 * --------------------------------------------------
 * **Represents all JavaScript **TypedArray** types used for binary data manipulation.**
 * - ✅ ***Includes:***
 *     - `Int8Array`.
 *     - `Uint8Array`.
 *     - `Uint8ClampedArray`.
 *     - `Int16Array`.
 *     - `Uint16Array`.
 *     - `Int32Array`.
 *     - `Uint32Array`.
 *     - `Float32Array`.
 *     - `Float64Array`.
 *     - `BigInt64Array`.
 *     - `BigUint64Array`.
 */
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;
/** --------------------------------------------------
 * * ***Utility Type: `WebApiObjects`.***
 * --------------------------------------------------
 * **Represents common **Web API objects** available in the browser.**
 * - ✅ ***Includes:***
 *     - URL: `URL`, `URLSearchParams`.
 *     - Networking: `Request`, `Response`, `Headers`, `WebSocket`.
 *     - Streams: `ReadableStream`, `WritableStream`, `TransformStream`.
 *     - Events: `Event`, `CustomEvent`, `MessageChannel`, `MessagePort`, `MessageEvent`.
 *     - DOM: `HTMLElement`, `Node`, `Document`, `Window`, `CanvasRenderingContext2D`.
 *     - Encoding: `TextEncoder`, `TextDecoder`.
 *     - File: `File`, `FileList`, `ImageBitmap`, `FormData`.
 *     - Abort: `AbortController`, `AbortSignal`.
 *     - Crypto: `CryptoKey`.
 */
type WebApiObjects =
  | URL
  | URLSearchParams
  | FormData
  | Headers
  | Response
  | Request
  | ReadableStream<any>
  | WritableStream<any>
  | TransformStream<any, any>
  | MessageChannel
  | MessagePort
  | MessageEvent
  | Event
  | CustomEvent
  | HTMLElement
  | Node
  | Document
  | Window
  | AbortController
  | AbortSignal
  | TextEncoder
  | TextDecoder
  | CryptoKey
  | File
  | FileList
  | ImageBitmap
  | CanvasRenderingContext2D
  | WebSocket;
/** --------------------------------------------------
 * * ***Utility Type: `IntlObjects`.***
 * --------------------------------------------------
 * **Represents all **ECMAScript Internationalization API** objects from `Intl`.**
 * - ✅ ***Includes:***
 *     - `Intl.Collator`.
 *     - `Intl.DateTimeFormat`.
 *     - `Intl.NumberFormat`.
 *     - `Intl.RelativeTimeFormat`.
 *     - `Intl.PluralRules`.
 *     - `Intl.ListFormat`. (if environment is supported).
 *     - `Intl.Locale`. (if environment is supported).
 */
type IntlObjects = {
  [K in keyof typeof Intl]: (typeof Intl)[K] extends abstract new (
    ...args: any[]
  ) => infer R
    ? R
    : never;
}[keyof typeof Intl];
/** --------------------------------------------------
 * * ***Utility Type: `BoxedPrimitivesTypes`.***
 * --------------------------------------------------
 * **Represents JavaScript **boxed primitive objects** (object wrappers for primitive values).**
 * @description
 * Boxed primitives are created using the `new` keyword on primitive wrapper constructors.
 * - ✅ ***Includes (object wrappers):***
 *     - `new Number(123)` ➔ `Number`.
 *     - `new String("hello")` ➔ `String`.
 *     - `new Boolean(true)` ➔ `Boolean`.
 * - ❌ ***Excludes (primitive values):***
 *     - `123` ➔ `number`.
 *     - `"hello"` ➔ `string`.
 *     - `true` ➔ `boolean`.
 * - ℹ️ ***Note:***
 *     - These are **rarely used directly** in modern **JavaScript/TypeScript**.
 *     - However, they exist for completeness and are sometimes relevant
 *       when distinguishing between **primitive values** and **object wrappers**.
 * @example
 * ```ts
 * const a: BoxedPrimitivesTypes = new Number(123);
 * // ➔ ✅ valid
 * const b: BoxedPrimitivesTypes = new String("abc");
 * // ➔ ✅ valid
 * const c: BoxedPrimitivesTypes = new Boolean(false);
 * // ➔ ✅ valid
 *
 * // ❌ Not allowed (primitive values):
 * const x: BoxedPrimitivesTypes = 123;
 * const y: BoxedPrimitivesTypes = "abc";
 * const z: BoxedPrimitivesTypes = true;
 * ```
 */
type BoxedPrimitivesTypes = Number | String | Boolean;
/** --------------------------------------------------
 * * ***Utility Type: `NonPlainObject`.***
 * --------------------------------------------------
 * **Represents all known **non-plain object types**,
 * i.e., values that are **not** considered a `"plain object"` (`{ [key: string]: any }`).**
 * - ✅ ***Includes:***
 *     - **Functions**.
 *     - **Arrays**.
 *     - **Native objects:** `Date`, `RegExp`, `Map`, `Set`, `WeakMap`, `WeakSet`.
 *     - **Built-in classes & APIs:** `Promise`, `Error`, `ArrayBuffer`, `DataView`.
 *     - **Typed arrays:** `TypedArray`.
 *     - **Browser & Node APIs:** `WebApiObjects`, `IntlObjects`, `NodeBuiltins`.
 *     - **Symbols**.
 *     - **Proxies** (wrapping any object).
 *     - The global **`Reflect`** object.
 * - ❌ ***Excludes:***
 *     - Plain objects (`{ foo: string }`, `Record<string, any>`), `null` and `undefined`.
 * - ℹ️ ***Note:***
 *     - Use this type when you need to differentiate **plain objects** from **all other object-like values**.
 * @example
 * ```ts
 * type A = NonPlainObject;
 *
 * const x: A = new Date();
 * // ➔ ✅ Allowed
 * const y: A = [1, 2, 3];
 * // ➔ ✅ Allowed
 * const z: A = Promise.resolve(123);
 * // ➔ ✅ Allowed
 *
 * // ❌ Not allowed (plain object):
 * // const bad: A = { foo: "bar" };
 * ```
 */
type NonPlainObject =
  | BoxedPrimitivesTypes
  | AnyFunction
  | Promise<any>
  | Array<any>
  | AnObjectNonArray;
/** --------------------------------------------------
 * * ***Utility Type: `AnObjectNonArray`.***
 * --------------------------------------------------
 * **Represents all **non-null, non-array, object-like values** in JavaScript/Node.js.**
 * - ✅ ***Includes:***
 *     - **Built-in objects:** `Date`, `RegExp`, `Error`, `ArrayBuffer`, `DataView`.
 *     - **Collections:** `Map`, `Set`, `WeakMap`, `WeakSet`.
 *     - **Typed arrays:**
 *       `Int8Array`, `Uint8Array`, `Uint8ClampedArray`,
 *       `Int16Array`, `Uint16Array`,
 *       `Int32Array`, `Uint32Array`,
 *       `Float32Array`, `Float64Array`,
 *       `BigInt64Array`, `BigUint64Array`.
 *     - **Browser Web APIs:**
 *       `URL`, `URLSearchParams`, `FormData`, `Headers`, `Response`, `Request`,
 *       `ReadableStream`, `WritableStream`, `TransformStream`,
 *       `MessageChannel`, `MessagePort`, `MessageEvent`,
 *       `Event`, `CustomEvent`, `HTMLElement`, `Node`, `Document`, `Window`,
 *       `CanvasRenderingContext2D`,
 *       `AbortController`, `AbortSignal`,
 *       `TextEncoder`, `TextDecoder`,
 *       `CryptoKey`, `File`, `FileList`, `ImageBitmap`, `WebSocket`.
 *     - **ECMAScript Internationalization API objects:**
 *       `Intl.Collator`, `Intl.DateTimeFormat`, `Intl.NumberFormat`,
 *       `Intl.RelativeTimeFormat`, `Intl.PluralRules`,
 *       `Intl.ListFormat`, `Intl.Locale`.
 *     - **Node.js built-ins:** `Buffer`.
 *     - **Symbols**.
 *     - **Proxies** (wrapping any object).
 *     - The global **`Reflect`** object.
 * - ❌ ***Excludes:***
 *     - `null`.
 *     - Arrays (`[]`, `new Array()`).
 * - ℹ️ ***Note:***
 *     - Use this type when you need to represent **any object-like value except arrays and `null`**.
 * @example
 * ```ts
 * const a: AnObjectNonArray = new Date();
 * const b: AnObjectNonArray = new Map();
 * const c: AnObjectNonArray = Symbol("id");
 *
 * // ❌ These are NOT allowed:
 * // const x: AnObjectNonArray = null;
 * // const y: AnObjectNonArray = [];
 * ```
 */
type AnObjectNonArray =
  | Date
  | RegExp
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>
  | Error
  | ArrayBuffer
  | DataView
  | TypedArray
  | WebApiObjects
  | IntlObjects
  | NodeBuiltins
  | symbol
  | {
      [Symbol.toStringTag]: "Proxy";
    }
  | typeof Reflect;
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
  ? number extends T["length"]
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
type IsBaseType<T> =
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
              : IsExactly<T, string> extends true
                ? true
                : IsExactly<T, number> extends true
                  ? true
                  : IsExactly<T, boolean> extends true
                    ? true
                    : IsExactly<T, bigint> extends true
                      ? true
                      : IsExactly<T, symbol> extends true
                        ? true
                        : IsExactly<T, Function> extends true
                          ? true
                          : IsExactly<T, AnyFunction> extends true
                            ? true
                            : IsGeneralArray<T> extends true
                              ? true
                              : IsExactly<T, TypedArray> extends true
                                ? true
                                : IsExactly<T, Date> extends true
                                  ? true
                                  : IsExactly<T, RegExp> extends true
                                    ? true
                                    : IsExactly<T, Error> extends true
                                      ? true
                                      : T extends Promise<infer U>
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
                                                : IsExactly<
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
                                                      : IsExactly<
                                                            T,
                                                            {}
                                                          > extends true
                                                        ? true
                                                        : [T] extends [object]
                                                          ? [object] extends [T]
                                                            ? true
                                                            : false
                                                          : false;
/**
 * Helper for {@link ReplaceAll}
 */
type Includes$1<
  S extends string,
  Sub extends string
> = S extends `${infer _}${Sub}${infer _}` ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `ReplaceAll`.***
 * -------------------------------------------------------
 * **A **type-level utility** that replaces all occurrences of a given string (or array of strings) `Pivot` in a string `T` with `ReplaceBy`.**
 * - **Supports:**
 *      - Replacing a single substring.
 *      - Replacing multiple substrings (Pivot as array).
 *      - Guards against infinite recursion if `ReplaceBy` contains any value in Pivot.
 * @template T - The string to process.
 * @template Pivot - A string or readonly array of strings to replace.
 * @template ReplaceBy - The string to replace Pivot with.
 * @example
 * ```ts
 * // Single pivot string
 * type Case1 = ReplaceAll<'remove me me', 'me', 'him'>;
 * // ➔ 'remove him him'
 *
 * // Pivot as array
 * type Case2 = ReplaceAll<'remove me remove me', ['me', 'remove'], 'him'>;
 * // ➔ 'him him him him'
 *
 * // Pivot not found
 * type Case3 = ReplaceAll<'hello world', 'foo', 'bar'>;
 * // ➔ 'hello world'
 *
 * // ReplaceBy contains pivot (guard against infinite recursion)
 * type Case4 = ReplaceAll<'abc', 'a', 'a'>;
 * // ➔ string
 * ```
 * @remarks
 * - Works recursively to replace all instances.
 * - If Pivot is empty (`""`) or empty array (`[]`), returns `T` unchanged.
 */
type ReplaceAll<
  T extends string,
  Pivot extends string | readonly string[],
  ReplaceBy extends string
> = Pivot extends "" | []
  ? T
  : Includes$1<ReplaceBy, Pivot extends string ? Pivot : never> extends true
    ? string
    : Pivot extends readonly [
          infer First extends string,
          ...infer Rest extends string[]
        ]
      ? ReplaceAll<ReplaceAll<T, First, ReplaceBy>, Rest, ReplaceBy>
      : Pivot extends string
        ? T extends `${infer A}${Pivot}${infer B}`
          ? ReplaceAll<`${A}${ReplaceBy}${B}`, Pivot, ReplaceBy>
          : T
        : T;
/** -------------------------------------------------------
 * * ***Utility Type: `IsTuple`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the first array argument is fixed length tuple.**
 * @template T - The array to check.
 * @example
 * type Case1 = IsTuple<[1, 2, 3]>; // ➔ true
 * type Case2 = IsTuple<number[]>;  // ➔ false
 */
type IsTuple<T extends readonly unknown[]> = NotExtends<number, T["length"]>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfTuple`.***
 * -------------------------------------------------------
 * **Returns the second argument if the first array argument is fixed length
 * tuple (defaults to `true`), otherwise returns the third argument (defaults
 * to `false`).**
 * @template T - The array to check.
 * @template IfTrue - The branch type if condition is met. (default: `true`).
 * @template IfFalse - The branch type if condition is not met. (default: `false`).
 * @example
 * type Case1 = IfTuple<[1, 2, 3], 'valid'>;
 * // ➔ 'valid'
 * type Case2 = IfTuple<number[], 'valid', 'invalid'>;
 * // ➔ 'invalid'
 */
type IfTuple<T extends readonly unknown[], IfTrue = true, IfFalse = false> = If<
  IsTuple<T>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `RemoveLeading`.***
 * -------------------------------------------------------
 * **Accepts a string type `T` and **recursively removes leading characters**
 * specified in `Characters`.**
 * @template T - The string to process.
 * @template Characters - The characters to remove from the start.
 * @example
 * ```ts
 * type Case1 = RemoveLeading<'aaabc', 'a'>;
 * // ➔ 'bc' (all leading 'a' removed).
 * type Case2 = RemoveLeading<'abc', 'd'>;
 * // ➔ 'abc' (no 'd' at start, unchanged).
 * type Case3 = RemoveLeading<'aaa', 'a'>;
 * // ➔ '' (all 'a' removed).
 * type Case4 = RemoveLeading<'aaa', 'aa'>;
 * // ➔ 'a' (matches 'aa' once, then remaining 'a').
 * ```
 */
type RemoveLeading<
  T extends string,
  Characters extends string
> = T extends `${Characters}${infer Rest extends string}`
  ? IsEmptyString<Rest> extends true
    ? Rest
    : RemoveLeading<Rest, Characters>
  : T;
type SubDecrementMap = {
  "-9": -10;
  "-8": -9;
  "-7": -8;
  "-6": -7;
  "-5": -6;
  "-4": -5;
  "-3": -4;
  "-2": -3;
  "-1": -2;
  "0": -1;
  "1": 0;
  "2": 1;
  "3": 2;
  "4": 3;
  "5": 4;
  "6": 5;
  "7": 6;
  "8": 7;
  "9": 8;
};
type SubNegativeCarryMap = {
  "-10": 0;
  "-9": 1;
  "-8": 2;
  "-7": 3;
  "-6": 4;
  "-5": 5;
  "-4": 6;
  "-3": 7;
  "-2": 8;
  "-1": 9;
};
type SubMap = {
  0: [0, -1, -2, -3, -4, -5, -6, -7, -8, -9];
  1: [1, 0, -1, -2, -3, -4, -5, -6, -7, -8];
  2: [2, 1, 0, -1, -2, -3, -4, -5, -6, -7];
  3: [3, 2, 1, 0, -1, -2, -3, -4, -5, -6];
  4: [4, 3, 2, 1, 0, -1, -2, -3, -4, -5];
  5: [5, 4, 3, 2, 1, 0, -1, -2, -3, -4];
  6: [6, 5, 4, 3, 2, 1, 0, -1, -2, -3];
  7: [7, 6, 5, 4, 3, 2, 1, 0, -1, -2];
  8: [8, 7, 6, 5, 4, 3, 2, 1, 0, -1];
  9: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
};
type _RemoveLeadingZeros<T extends string> = ParseNumber<
  RemoveLeading<T, "0"> extends infer WithoutLeadingZeros extends string
    ? IfEmptyString<WithoutLeadingZeros, "0", WithoutLeadingZeros>
    : never
>;
type _Sub<
  Num1 extends string,
  Num2 extends string,
  NegativeCarry extends 0 | 1 = 0,
  Result extends string = ""
> =
  IsEmptyString<Num2> extends true
    ? NegativeCarry extends 0
      ? `${Num1}${Result}`
      : `${Decrement<ParseNumber<Num1>>}${Result}`
    : LastCharacter<Num1> extends `${infer Num1LastDigit extends keyof SubMap & number}`
      ? LastCharacter<Num2> extends `${infer Num2LastDigit extends keyof SubMap[Num1LastDigit] & number}`
        ? `${SubMap[Num1LastDigit][Num2LastDigit]}` extends infer DigitsSub extends
            keyof SubDecrementMap
          ? (
              NegativeCarry extends 1
                ? Stringify<SubDecrementMap[DigitsSub]>
                : DigitsSub
            ) extends infer DigitsSubWithCarry extends string
            ? Num1 extends `${infer Num1Rest}${Num1LastDigit}`
              ? Num2 extends `${infer Num2Rest}${Num2LastDigit}`
                ? DigitsSubWithCarry extends keyof SubNegativeCarryMap
                  ? _Sub<
                      Num1Rest,
                      Num2Rest,
                      1,
                      `${SubNegativeCarryMap[DigitsSubWithCarry]}${Result}`
                    >
                  : _Sub<
                      Num1Rest,
                      Num2Rest,
                      0,
                      `${DigitsSubWithCarry}${Result}`
                    >
                : never
              : never
            : never
          : never
        : never
      : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Sub`.***
 * -------------------------------------------------------
 * **Computes the subtraction of two integers at the **type level**.**
 * - **Behavior:**
 *      - Handles positive and negative numbers.
 *      - Supports numbers in the range `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 *      - Internally performs string-based arithmetic to handle carries/borrows.
 * @template Num1 - First number (minuend).
 * @template Num2 - Second number (subtrahend).
 * @example
 * ```ts
 * // Positive numbers
 * type Case1 = Sub<10, 2>;  // ➔ 8
 *
 * // Num1 smaller than Num2
 * type Case2 = Sub<2, 10>;  // ➔ -8
 *
 * // Subtract negative number
 * type Case3 = Sub<2, -10>; // ➔ 12
 *
 * // Subtract from negative number
 * type Case4 = Sub<-2, 10>; // ➔ -12
 *
 * // Both negative
 * type Case5 = Sub<-5, -2>; // ➔ -3
 * type Case6 = Sub<-2, -5>; // ➔ 3
 * ```
 */
type Sub<Num1 extends number, Num2 extends number> =
  IsNegativeInteger<Num1> extends true
    ? IsNegativeInteger<Num2> extends true
      ? IsLowerThan<Num1, Num2> extends true
        ? Negate<
            _RemoveLeadingZeros<
              _Sub<Stringify<Abs<Num1>>, Stringify<Abs<Num2>>>
            >
          >
        : _RemoveLeadingZeros<_Sub<Stringify<Abs<Num2>>, Stringify<Abs<Num1>>>>
      : Sum<Abs<Num1>, Num2> extends infer Result extends number
        ? Negate<Result>
        : never
    : IsNegativeInteger<Num2> extends true
      ? Sum<Num1, Abs<Num2>>
      : IsLowerThan<Num1, Num2> extends true
        ? Negate<_RemoveLeadingZeros<_Sub<Stringify<Num2>, Stringify<Num1>>>>
        : _RemoveLeadingZeros<_Sub<Stringify<Num1>, Stringify<Num2>>>;
type SumIncrementMap = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19
];
type SumLastDigitMap = {
  10: 0;
  11: 1;
  12: 2;
  13: 3;
  14: 4;
  15: 5;
  16: 6;
  17: 7;
  18: 8;
  19: 9;
};
type SumMap = {
  0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  3: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  4: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  5: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  6: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  7: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  8: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  9: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
};
/** -------------------------------------------------------
 * * ***Private Utility Type: `_Sum`.***
 * -------------------------------------------------------
 * **Internal helper type for summing two integer numbers represented as strings.**
 * - Performs digit-by-digit addition with carry handling.
 * @deprecated This is internal helper, use {@link Sum | **`Sum`**} instead.
 * @template Num1 - First number as string.
 * @template Num2 - Second number as string.
 * @template Carry - Carry flag (0 or 1), defaults to 0.
 * @template Result - Accumulated result string, defaults to empty string.
 */
type _Sum<
  Num1 extends string,
  Num2 extends string,
  Carry extends 0 | 1 = 0,
  Result extends string = ""
> =
  IsEmptyString<Num1> extends true
    ? Carry extends 0
      ? ParseNumber<`${Num2}${Result}`>
      : _Increment<Num2, Result>
    : IsEmptyString<Num2> extends true
      ? Carry extends 0
        ? ParseNumber<`${Num1}${Result}`>
        : _Increment<Num1, Result>
      : LastCharacter<Num1> extends `${infer Num1LastDigit extends keyof SumMap & number}`
        ? LastCharacter<Num2> extends `${infer Num2LastDigit extends keyof SumMap[Num1LastDigit] & number}`
          ? SumMap[Num1LastDigit][Num2LastDigit] extends infer DigitsSum extends
              number
            ? (
                Carry extends 1 ? SumIncrementMap[DigitsSum] : DigitsSum
              ) extends infer DigitsSumWithCarry extends number
              ? Num1 extends `${infer Num1Rest}${Num1LastDigit}`
                ? Num2 extends `${infer Num2Rest}${Num2LastDigit}`
                  ? DigitsSumWithCarry extends keyof SumLastDigitMap
                    ? _Sum<
                        Num1Rest,
                        Num2Rest,
                        1,
                        `${SumLastDigitMap[DigitsSumWithCarry]}${Result}`
                      >
                    : _Sum<
                        Num1Rest,
                        Num2Rest,
                        0,
                        `${DigitsSumWithCarry}${Result}`
                      >
                  : never
                : never
              : never
            : never
          : never
        : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Sum`.***
 * -------------------------------------------------------
 * **Adds two integers at the type level. Handles positive and negative numbers.**
 * - Supports numbers in the range:
 *    - `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - First number.
 * @template Num2 - Second number.
 * @example
 * ```ts
 * // Positive + positive
 * type Case1 = Sum<4, 9>;   // ➔ 13
 *
 * // Negative + positive
 * type Case2 = Sum<-4, 9>;  // ➔ 5
 *
 * // Positive + negative
 * type Case3 = Sum<4, -9>;  // ➔ -5
 *
 * // Negative + negative
 * type Case4 = Sum<-4, -9>; // ➔ -13
 * ```
 */
type Sum<Num1 extends number, Num2 extends number> =
  IsNegativeInteger<Num1> extends true
    ? IsNegativeInteger<Num2> extends true
      ? Negate<_Sum<Stringify<Abs<Num1>>, Stringify<Abs<Num2>>>>
      : Sub<Num2, Abs<Num1>>
    : IsNegativeInteger<Num2> extends true
      ? Sub<Num1, Abs<Num2>>
      : _Sum<Stringify<Num1>, Stringify<Num2>>;
type _safeSumArr<
  Rest extends number[],
  CurrentSum extends number,
  Num1 extends number
> =
  /** @ts-expect-error this still safe not to much deep */
  _SumArr<Rest, Sum<CurrentSum, Num1>>;
type _SumArr<T extends readonly number[], CurrentSum extends number = 0> =
  IsEmptyArray<T> extends true
    ? CurrentSum
    : Pop<
          T,
          {
            includeRemoved: true;
          }
        > extends infer PopResult
      ? IsNever<PopResult> extends true
        ? CurrentSum
        : PopResult extends [
              infer Rest extends number[],
              infer Num1 extends number
            ]
          ? _safeSumArr<Rest, CurrentSum, Num1>
          : never
      : CurrentSum;
/** -------------------------------------------------------
 * * ***Utility Type: `SumArr`.***
 * -------------------------------------------------------
 * **Accepts a tuple of numbers and returns their sum.**
 *
 * - **Behavior:**
 *     - Only works on tuple types (not general arrays).
 *     - Supports numbers in the range:
 *        - `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template T - Tuple of numbers to sum.
 * @example
 * ```ts
 * // Sum all elements in a tuple
 * type Case1 = SumArr<[1, 2, 3, 4]>;  // ➔ 10
 *
 * // Tuple with negative number
 * type Case2 = SumArr<[1, 2, 3, -4]>; // ➔ 2
 * ```
 */
type SumArr<T extends readonly number[]> =
  IsTuple<T> extends true ? _SumArr<T> : never;
type _safeSum<
  Parts extends [string[], string[], string[], string[]] = [[], [], [], []]
> =
  /** @ts-expect-error this still safe not to much deep */
  Sum<
    Sum<Parts[0]["length"], Parts[1]["length"]>,
    Sum<Parts[2]["length"], Parts[3]["length"]>
  >;
type _StringLength<
  S extends string,
  Parts extends [string[], string[], string[], string[]] = [[], [], [], []]
> = S extends ""
  ? _safeSum<Parts>
  : S extends `${infer C1 extends string}${infer Rest1 extends string}`
    ? Rest1 extends `${infer C2 extends string}${infer Rest2 extends string}`
      ? Rest2 extends `${infer C3 extends string}${infer Rest3 extends string}`
        ? Rest3 extends `${infer C4 extends string}${infer Rest4 extends string}`
          ? _StringLength<
              Rest4,
              [
                [...Parts[0], C1],
                [...Parts[1], C2],
                [...Parts[2], C3],
                [...Parts[3], C4]
              ]
            >
          : _StringLength<
              Rest3,
              [
                [...Parts[0], C1],
                [...Parts[1], C2],
                [...Parts[2], C3],
                Parts[3]
              ]
            >
        : _StringLength<
            Rest2,
            [[...Parts[0], C1], [...Parts[1], C2], Parts[2], Parts[3]]
          >
      : _StringLength<Rest1, [[...Parts[0], C1], Parts[1], Parts[2], Parts[3]]>
    : _StringLength<S, Parts>;
/** -------------------------------------------------------
 * * ***Utility Type: `StringLength`.***
 * -------------------------------------------------------
 * **Returns the length of a string at the type level.**
 * - Supports string length in range `[0, 3968]`.
 * @template S - The string to measure.
 * @example
 * ```ts
 * type Case1 = StringLength<''>;
 * // ➔ 0
 * type Case2 = StringLength<'xxx'>;
 * // ➔ 3
 * ```
 */
type StringLength<S extends string> = _StringLength<S>;
/** -------------------------------------------------------
 * * ***Utility Type: `CompareStringLength`.***
 * -------------------------------------------------------
 * - **Compares the lengths of two strings and returns one of three possible type values:**
 *       - `IfStr1Shorter` if the first string is shorter.
 *       - `IfStr2Shorter` if the second string is shorter.
 *       - `IfEqual` if both strings have the same length.
 * - Defaults to `never` if not provided.
 * @template Str1 - First string.
 * @template Str2 - Second string.
 * @template IfStr1Shorter - Type to return if Str1 is shorter (default `never`).
 * @template IfStr2Shorter - Type to return if Str2 is shorter (default `never`).
 * @template IfEqual - Type to return if both strings have equal length (default `never`).
 * @example
 * ```ts
 * type Case1 = CompareStringLength<'a', 'ab', 'first shorter'>;
 * // ➔ 'first shorter'
 * type Case2 = CompareStringLength<'abc', 'ab', 'first shorter', 'first longer'>;
 * // ➔ 'first longer'
 * type Case3 = CompareStringLength<'ab', 'ab', 'first shorter', 'first longer', 'equal'>;
 * // ➔ 'equal'
 * ```
 */
type CompareStringLength<
  Str1 extends string,
  Str2 extends string,
  IfStr1Shorter = never,
  IfStr2Shorter = never,
  IfEqual = never
> =
  IsEmptyString<Str1> extends true
    ? IsEmptyString<Str2> extends true
      ? IfEqual
      : IfStr1Shorter
    : IsEmptyString<Str2> extends true
      ? IfStr2Shorter
      : Str1 extends `${string}${infer Str1Rest extends string}`
        ? Str2 extends `${string}${infer Str2Rest extends string}`
          ? CompareStringLength<
              Str1Rest,
              Str2Rest,
              IfStr1Shorter,
              IfStr2Shorter,
              IfEqual
            >
          : never
        : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsShorterString`.***
 * -------------------------------------------------------
 * **Returns `true` if the first string is shorter than the second string; otherwise `false`.**
 * @template Str1 - First string.
 * @template Str2 - Second string.
 * @example
 * ```ts
 * type Case1 = IsShorterString<'a', 'ab'>;
 * // ➔ true
 * type Case2 = IsShorterString<'abc', 'ab'>;
 * // ➔ false
 * ```
 */
type IsShorterString<
  Str1 extends string,
  Str2 extends string
> = CompareStringLength<Str1, Str2, true, false, false>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsLongerString`.***
 * -------------------------------------------------------
 * **Returns `true` if the first string is longer than the second string; otherwise `false`.**
 * @template Str1 - First string.
 * @template Str2 - Second string.
 * @example
 * ```ts
 * type Case1 = IsLongerString<'ab', 'a'>; // ➔ true
 * type Case2 = IsLongerString<'a', 'ab'>; // ➔ false
 * ```
 */
type IsLongerString<
  Str1 extends string,
  Str2 extends string
> = CompareStringLength<Str1, Str2, false, true, false>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsSameLengthString`.***
 * -------------------------------------------------------
 * **Returns `true` if two strings have the same length; otherwise `false`.**
 * @template Str1 - First string.
 * @template Str2 - Second string.
 * @example
 * ```ts
 * type Case1 = IsSameLengthString<'ab', 'ab'>;  // ➔ true
 * type Case2 = IsSameLengthString<'ab', 'abc'>; // ➔ false
 * ```
 */
type IsSameLengthString<
  Str1 extends string,
  Str2 extends string
> = CompareStringLength<Str1, Str2, false, false, true>;
/** -------------------------------------------------------
 * * ***Type Options for {@link NumberLength | **`NumberLength`**}.***
 */
type TypeNumberLengthOptions = {
  /** * ***Removes the leading minus `-` from negative numbers, default: `true`.***
   *
   * @default true
   */
  stripSign?: boolean;
  /** * ***Removes the decimal point `.` from floats, default: `true`.***
   *
   * @default true
   */
  stripDot?: boolean;
  /** * ***Removes the trailing `n` from BigInt literals, default: `true`.***
   *
   * @default true
   */
  stripBigInt?: boolean;
};
/** -------------------------------------------------------
 * * ***Default options for {@link NumberLength | **`NumberLength`**} (all `true`).***
 */
type DefaultNumberLengthOptions = {
  stripSign: true;
  stripDot: true;
  stripBigInt: true;
};
/** -------------------------------------------------------
 * * ***Merge provided options with defaults for {@link NumberLength | **`NumberLength`**}.***
 */
type MergeOptions<Opts extends TypeNumberLengthOptions> = {
  [K in keyof DefaultNumberLengthOptions]: K extends keyof Opts
    ? Opts[K]
    : DefaultNumberLengthOptions[K];
};
/** -------------------------------------------------------
 * * ***Utility Type: `NumberLength`.***
 * -------------------------------------------------------
 * **A type-level utility that returns the **number of digits/characters**
 * of a numeric literal type, with optional cleaning.**
 * - **Supports:**
 *      - Integers (positive & negative).
 *      - Floats (`.` optionally removed).
 *      - Scientific notation (`e`/`E`, TypeScript normalizes to number).
 *      - BigInts (`n` suffix optionally removed).
 * @template T - A numeric literal (`number` or `bigint`).
 * @template Options - Optional configuration (default: all `true`):
 * - `stripSign` ➔ Removes the leading `-` (default `true`).
 * - `stripDot` ➔ Removes the decimal point `.` (default `true`).
 * - `stripBigInt` ➔ Removes trailing `n` (default `true`).
 * @example
 * **✅ Valid Examples:**
 * ```ts
 * // Integers
 * type A = NumberLength<100>;  // ➔ 3
 * type B = NumberLength<-100>; // ➔ 3 (minus stripped by default)
 * type C = NumberLength<-100, { stripSign: false }>; // ➔ 4 (minus kept)
 *
 * // Floats
 * type D = NumberLength<0.25>;  // ➔ 2 (dot removed)
 * type E = NumberLength<-0.25>; // ➔ 2 (minus & dot removed)
 * type F = NumberLength<12.34, { stripDot: false }>; // ➔ 5 (12.34)
 *
 * // Scientific notation
 * type G = NumberLength<5e4>;  // ➔ 5 (50000)
 * type H = NumberLength<-5e4>; // ➔ 5 (-50000, minus stripped)
 * type I = NumberLength<-5e4,{ stripSign:false }>; // ➔ 6 (-50000, minus not stripped)
 *
 * // BigInts
 * type J = NumberLength<12n>;    // ➔ 2
 * type K = NumberLength<-2125n>; // ➔ 4 (- & n removed)
 * type L = NumberLength<-2125n, { stripSign: false }>;
 * // ➔ 5 (minus kept)
 * type M = NumberLength<123n, { stripBigInt: false }>;
 * // ➔ 4 (123n)
 * type N = NumberLength<-123n, { stripBigInt: false, stripSign: false }>;
 * // ➔ 5 (minus & n kept ➔ -123n)
 * ```
 * ---
 * **❌ Invalid Examples:**
 * ```ts
 * type Invalid1 = NumberLength<string>;   // ➔ never
 * type Invalid2 = NumberLength<boolean>;  // ➔ never
 * type Invalid3 = NumberLength<"123">;    // ➔ never (string literal)
 * type Invalid4 = NumberLength<number>;   // ➔ never (not literal)
 * type Invalid5 = NumberLength<bigint>;   // ➔ never (not literal)
 * type Invalid6 = NumberLength<any>;      // ➔ never
 * type Invalid7 = NumberLength<unknown>;  // ➔ never
 * type Invalid8 = NumberLength<never>;    // ➔ never
 * ```
 * ---
 * @remarks
 * - Uses type-level string manipulation to "clean" numeric literal according to options.
 * - Removes `-`, `.`, or `n` if corresponding option is true.
 * - Works reliably for literal numbers, floats, and BigInt.
 * - Scientific notation is normalized by TypeScript, so `5e4` becomes `50000`.
 */
type NumberLength<
  T extends number | bigint,
  Options extends Partial<TypeNumberLengthOptions> = DefaultNumberLengthOptions
> =
  If<
    OrArr<[IsBaseType<T>, Extends<T, string>, Not<Extends<T, number | bigint>>]>
  > extends true
    ? never
    : StringLength<
        ReplaceAll<
          Stringify<T>,
          [
            MergeOptions<Options>["stripSign"] extends true ? "-" : "",
            MergeOptions<Options>["stripDot"] extends true ? "." : "",
            MergeOptions<Options>["stripBigInt"] extends true ? "n" : ""
          ],
          ""
        >
      >;
/** -------------------------------------------------------
 * * ***Utility Type: `CompareNumberLength`.***
 * -------------------------------------------------------
 * **Compares the **number of digits** of two numeric literal types.**
 * - **Returns:**
 *      - `IfNum1Shorter` if the first number has fewer digits than the second (default: `never`).
 *      - `IfNum2Shorter` if the second number has fewer digits than the first (default: `never`).
 *      - `IfEqual` if both numbers have the same number of digits (default: `never`).
 * - **Important:**
 *      - This utility only works with **literal numbers**.
 *      - Using non-literal numbers (`number`) will return `never`.
 * @template Num1 - The first number literal to compare.
 * @template Num2 - The second number literal to compare.
 * @template IfNum1Shorter - Return type if the first number is shorter (default: `never`).
 * @template IfNum2Shorter - Return type if the second number is shorter (default: `never`).
 * @template IfEqual - Return type if both numbers have the same length (default: `never`).
 * @example
 * ```ts
 * // First number shorter than second
 * type Case1 = CompareNumberLength<1, 12, 'first shorter'>;
 * // ➔ 'first shorter'
 *
 * // First number longer than second
 * type Case2 = CompareNumberLength<123, 12, 'first shorter', 'first longer'>;
 * // ➔ 'first longer'
 *
 * // Both numbers have equal length
 * type Case3 = CompareNumberLength<12, 12, 'first shorter', 'first longer', 'equal'>;
 * // ➔ 'equal'
 *
 * // Defaults (no custom return types)
 * type Case4 = CompareNumberLength<1, 12>;
 * // ➔ never
 *
 * // Non-literal numbers
 * type NumA = number;
 * type NumB = 12;
 * type Case4 = CompareNumberLength<NumA, NumB, 'first shorter', 'first longer', 'equal'>;
 * // ➔ never
 * ```
 * ---
 * @remarks
 * - Internally uses {@link Stringify | **`Stringify`**} and {@link CompareStringLength | **`CompareStringLength`**}.
 * - Works for `positive`, `negative`, and `floating-point literal numbers`.
 */
type CompareNumberLength<
  Num1 extends number,
  Num2 extends number,
  IfNum1Shorter = never,
  IfNum2Shorter = never,
  IfEqual = never
> =
  If<Or<Extends<number, Num1>, Extends<number, Num2>>> extends true
    ? never
    : CompareStringLength<
        Stringify<Num1>,
        Stringify<Num2>,
        IfNum1Shorter,
        IfNum2Shorter,
        IfEqual
      >;
/** -------------------------------------------------------
 * * ***Utility Type: `IsShorterNumber`.***
 * -------------------------------------------------------
 * **Compares the number of digits of two numeric literal types and returns a **boolean**.**
 * - **Returns:**
 *      - `true` if the first number has fewer digits than the second.
 *      - `false` otherwise (including when numbers have equal length).
 * - **Important:**
 *      - This utility only works with **literal numbers**.
 *      - Using non-literal numbers (`number`) will return `never`.
 * @template Num1 - The first number literal to compare.
 * @template Num2 - The second number literal to compare.
 * @example
 * ```ts
 * // Literal numbers
 * type Case1 = IsShorterNumber<1, 10>;
 * // ➔ true
 *
 * type Case2 = IsShorterNumber<100, 10>;
 * // ➔ false
 *
 * type Case3 = IsShorterNumber<12, 12>;
 * // ➔ false
 *
 * // Non-literal numbers
 * type NumA = number;
 * type NumB = 12;
 * type Case4 = IsShorterNumber<NumA, NumB>;
 * // ➔ never
 * ```
 * ---
 * @remarks
 * - Internally uses {@link CompareNumberLength | **`CompareNumberLength`**}.
 * - Works for `positive`, `negative`, and `floating-point literal numbers`.
 */
type IsShorterNumber<
  Num1 extends number,
  Num2 extends number
> = CompareNumberLength<Num1, Num2, true, false, false>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsLongerNumber`.***
 * -------------------------------------------------------
 * **Compares the number of digits of two numeric literal types and returns a **boolean**.**
 * - **Returns:**
 *      - `true` if the first number has more digits than the second.
 *      - `false` otherwise (including when numbers have equal length).
 * - **Important:**
 *      - Only works with **literal numbers**.
 *      - Non-literal numbers (`number`) return `never`.
 * @template Num1 - The first number literal to compare.
 * @template Num2 - The second number literal to compare.
 * @example
 * ```ts
 * type Case1 = IsLongerNumber<10, 1>;
 * // ➔ true
 *
 * type Case2 = IsLongerNumber<10, 100>;
 * // ➔ false
 *
 * type Case3 = IsLongerNumber<12, 12>;
 * // ➔ false
 *
 * // Non-literal numbers
 * type NumA = number;
 * type NumB = 12;
 * type Case4 = IsLongerNumber<NumA, NumB>;
 * // ➔ never
 * ```
 * ---
 * @remarks
 * - Internally uses {@link CompareNumberLength | **`CompareNumberLength`**}.
 * - Works for `positive`, `negative`, and `floating-point literal numbers`.
 */
type IsLongerNumber<
  Num1 extends number,
  Num2 extends number
> = CompareNumberLength<Num1, Num2, false, true, false>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsSameLengthNumber`.***
 * -------------------------------------------------------
 * **Compares the number of digits of two numeric literal types and returns a **boolean**.**
 * - **Returns:**
 *      - `true` if the numbers have the same number of digits.
 *      - `false` otherwise.
 * - **Important:**
 *      - Only works with **literal numbers**.
 *      - Non-literal numbers (`number`) return `never`.
 * @template Num1 - The first number literal to compare.
 * @template Num2 - The second number literal to compare.
 * @example
 * ```ts
 * type Case1 = IsSameLengthNumber<10, 10>;
 * // ➔ true
 *
 * type Case2 = IsSameLengthNumber<10, 100>;
 * // ➔ false
 *
 * // Non-literal numbers
 * type NumA = number;
 * type NumB = 12;
 * type Case3 = IsSameLengthNumber<NumA, NumB>;
 * // ➔ never
 * ```
 * ---
 * @remarks
 * - Internally uses {@link CompareNumberLength | **`CompareNumberLength`**}.
 * - Works for `positive`, `negative`, and `floating-point literal numbers`.
 */
type IsSameLengthNumber<
  Num1 extends number,
  Num2 extends number
> = CompareNumberLength<Num1, Num2, false, false, true>;
type LowerThanMap = {
  "0": ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  "1": ["2", "3", "4", "5", "6", "7", "8", "9"];
  "2": ["3", "4", "5", "6", "7", "8", "9"];
  "3": ["4", "5", "6", "7", "8", "9"];
  "4": ["5", "6", "7", "8", "9"];
  "5": ["6", "7", "8", "9"];
  "6": ["7", "8", "9"];
  "7": ["8", "9"];
  "8": ["9"];
  "9": [];
};
type _IsLowerThan<
  Num1 extends string,
  Num2 extends string
> = Num1 extends `${infer Num1Character extends keyof LowerThanMap}${infer Num1Rest extends string}`
  ? Num2 extends `${infer Num2Character extends string}${infer Num2Rest extends string}`
    ? IsEqual<Num1Character, Num2Character> extends true
      ? _IsLowerThan<Num1Rest, Num2Rest>
      : Num2Character extends LowerThanMap[Num1Character][number]
        ? true
        : false
    : true
  : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IsLowerThan`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether `Num1` is strictly lower than `Num2`.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer to compare.
 * @template Num2 - The second integer to compare.
 * @example
 * type Case1 = IsLowerThan<1, 10>;  // ➔ true
 * type Case2 = IsLowerThan<1, -10>; // ➔ false
 */
type IsLowerThan<Num1 extends number, Num2 extends number> =
  IsEqual<Num1, Num2> extends true
    ? false
    : IsNegative<Num1> extends true
      ? IsNegative<Num2> extends false
        ? true
        : CompareNumberLength<
            Num1,
            Num2,
            false,
            true,
            Not<_IsLowerThan<Stringify<Abs<Num1>>, Stringify<Abs<Num2>>>>
          >
      : IsNegative<Num2> extends true
        ? false
        : CompareNumberLength<
            Num1,
            Num2,
            true,
            false,
            _IsLowerThan<Stringify<Abs<Num1>>, Stringify<Abs<Num2>>>
          >;
/** -------------------------------------------------------
 * * ***Utility Type: `IfLowerThan`.***
 * -------------------------------------------------------
 * **Returns `IfTrue` if `Num1` is lower than `Num2`, otherwise returns `IfFalse`.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer to compare.
 * @template Num2 - The second integer to compare.
 * @template IfTrue - Value to return if `Num1 < Num2`.
 * @template IfFalse - Value to return if `Num1 >= Num2`.
 * @example
 * type Case1 = IfLowerThan<1, 10, 'valid'>;
 * // ➔ 'valid'
 * type Case2 = IfLowerThan<1, -10, 'valid', 'invalid'>;
 * // ➔ 'invalid'
 */
type IfLowerThan<
  Num1 extends number,
  Num2 extends number,
  IfTrue = true,
  IfFalse = false
> = If<IsLowerThan<Num1, Num2>, IfTrue, IfFalse>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsLowerOrEqual`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether `Num1` is lower than or equal to `Num2`.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer to compare.
 * @template Num2 - The second integer to compare.
 * @example
 * type Case1 = IsLowerOrEqual<1, 10>;
 * // ➔ true
 * type Case2 = IsLowerOrEqual<1, -10>;
 * // ➔ false
 */
type IsLowerOrEqual<Num1 extends number, Num2 extends number> =
  IsEqual<Num1, Num2> extends true ? true : IsLowerThan<Num1, Num2>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfLowerOrEqual`.***
 * -------------------------------------------------------
 * **Returns the third argument if the first argument (integer) is lower than
 * the second argument (integer) or equal (defaults to `true`), otherwise returns
 * the fourth argument (defaults to `false`).**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer to compare.
 * @template Num2 - The second integer to compare.
 * @template IfTrue - Value to return if `Num1 <= Num2`.
 * @template IfFalse - Value to return if `Num1 > Num2`.
 * @example
 * type Case1 = IfLowerOrEqual<1, 10, 'valid'>;
 * // ➔ 'valid'
 * type Case2 = IfLowerOrEqual<23, 1, 'valid', 'invalid'>;
 * // ➔ 'invalid'
 */
type IfLowerOrEqual<
  Num1 extends number,
  Num2 extends number,
  IfTrue = true,
  IfFalse = false
> = If<
  IsEqual<Num1, Num2> extends true ? true : IsLowerThan<Num1, Num2>,
  IfTrue,
  IfFalse
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsGreaterThan`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the first integer
 * is ***greater than*** the second integer.**
 * - **Behavior:**
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer.
 * @template Num2 - The second integer.
 * @example
 * ```ts
 * type A = IsGreaterThan<10, 1>;   // ➔ true
 * type B = IsGreaterThan<-10, 1>;  // ➔ false
 * ```
 */
type IsGreaterThan<Num1 extends number, Num2 extends number> = IsLowerThan<
  Num2,
  Num1
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfGreaterThan`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the third argument if the first integer is ***greater than*** the
 *        second integer, otherwise returns the fourth argument.
 * - **Behavior:**
 *      - Defaults: `IfTrue = true`, `IfFalse = false`.
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer.
 * @template Num2 - The second integer.
 * @template IfTrue - The branch type if condition is met. (default: `true`)
 * @template IfFalse - The branch type if condition is not met. (default: `false`)
 * @example
 * ```ts
 * type A = IfGreaterThan<10, 1, "valid">;
 * // ➔ "valid"
 * type B = IfGreaterThan<-10, 1, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
type IfGreaterThan<
  Num1 extends number,
  Num2 extends number,
  IfTrue = true,
  IfFalse = false
> = IfLowerThan<Num2, Num1, IfTrue, IfFalse>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsGreaterOrEqual`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the first integer
 * is ***greater than or equal*** to the second integer.**
 * - **Behavior:**
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer.
 * @template Num2 - The second integer.
 * @example
 * ```ts
 * type A = IsGreaterOrEqual<10, 1>;  // ➔ true
 * type B = IsGreaterOrEqual<-10, 1>; // ➔ false
 * type C = IsGreaterOrEqual<10, 10>; // ➔ true
 * ```
 */
type IsGreaterOrEqual<Num1 extends number, Num2 extends number> =
  IsEqual<Num1, Num2> extends true ? true : IsGreaterThan<Num1, Num2>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfGreaterOrEqual`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the third argument if the first integer is ***greater than or
 *        equal*** to the second integer, otherwise returns the fourth argument.
 * - **Behavior:**
 *      - Defaults: `IfTrue = true`, `IfFalse = false`.
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer.
 * @template Num2 - The second integer.
 * @template IfTrue - The branch type if condition is met. (default: `true`)
 * @template IfFalse - The branch type if condition is not met. (default: `false`)
 * @example
 * ```ts
 * type A = IfGreaterOrEqual<10, 1, "valid">;
 * // ➔ "valid"
 * type B = IfGreaterOrEqual<-10, 1, "valid", "invalid">;
 * // ➔ "invalid"
 * type C = IfGreaterOrEqual<10, 10, "yes", "no">;
 * // ➔ "yes"
 * ```
 */
type IfGreaterOrEqual<
  Num1 extends number,
  Num2 extends number,
  IfTrue = true,
  IfFalse = false
> = If<
  IsEqual<Num1, Num2> extends true ? true : IsGreaterThan<Num1, Num2>,
  IfTrue,
  IfFalse
>;
/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link IsBetween | `IsBetween`}.***
 * ---------------------------------------------------------------------------
 * **Options to configure whether the borders of the interval are included
 * when using {@link IsBetween | **`IsBetween`**}.**
 */
type IsBetweenOptions = {
  /** * ***Whether to include the lower border (`Min`) in the comparison.***
   *
   * - `true` ➔ include `Min` (**default**).
   * - `false` ➔ exclude `Min`.
   *
   * @default true
   */
  minIncluded?: boolean;
  /** * ***Whether to include the upper border (`Max`) in the comparison.***
   *
   * - `true` ➔ include `Max` (**default**).
   * - `false` ➔ exclude `Max`.
   *
   * @default true
   */
  maxIncluded?: boolean;
};
/** -------------------------------------------------------
 * * ***Utility Type: `IsBetween`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the first integer argument is between the second and the third integer argument, by default, borders of the interval are included, which can be modified by the second argument.**
 * - **Behavior:**
 *      - `minIncluded`, `maxIncluded` options show whether to include the lower and the higher borders
 *         respectively.
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * type Case1 = IsBetween<1, 1, 10>;
 * // ➔ true
 * type Case2 = IsBetween<1, 1, 10, {minIncluded: false}>;
 * // ➔ false
 * type Case3 = IsBetween<10, 1, 10, {maxIncluded: false}>;
 * // ➔ false
 */
type IsBetween<
  Num extends number,
  Min extends number,
  Max extends number,
  Options extends IsBetweenOptions = {
    minIncluded: true;
    maxIncluded: true;
  }
> =
  IsEqual<Num, Min> extends true
    ? Options["minIncluded"]
    : IsEqual<Num, Max> extends true
      ? Options["maxIncluded"]
      : And<IsGreaterThan<Num, Min>, IsLowerThan<Num, Max>>;
type _IsValidRGBParameter<T extends number> =
  IsInteger<T> extends true ? IsBetween<T, 0, 255> : false;
/** * ***Configuration options for a type-level utility
 * {@link RGB | `RGB`} | {@link IsRGB | `IsRGB` } | {@link IfRGB | `IfRGB` }.*** */
type RGBOptions = {
  /** * ***Separator character(s) used between the RGB components (`r`, `g`, `b`).***
   *
   * - **For example:**
   *      - `","` ➔ `"rgb(23,242,0)"`.
   *      - `", "` ➔ `"rgb(23, 242, 0)"`.
   *
   * @default ", "
   */
  separator: string;
};
/** * ***Default configuration for the {@link RGBOptions | `RGBOptions`}.***
 *
 * @example
 * ```ts
 * type Opt = DefaultRGBOptions;
 * // ➔ { separator: ", " }
 * ```
 */
type DefaultRGBOptions = {
  /** * ***Default separator for RGB components.***
   *
   * **Produces strings like `"rgb(23, 242, 0)"`.**
   */
  separator: ", ";
};
/** -------------------------------------------------------
 * * ***Utility Type: `RGB`.***
 * -------------------------------------------------------
 * **A type-level utility that validates an **RGB color string**.**
 * - **Behavior:**
 *      - Accepts `rgb(r, g, b)` format with customizable separators.
 *      - Each parameter `r`, `g`, `b` must be an integer between `0` and `255`.
 *      - Returns `T` if valid, otherwise `never`.
 * @template T - A string to check.
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = RGB<"rgb(23, 242, 0)">;
 * // ➔ "rgb(23, 242, 0)"
 * type B = RGB<"rgb(324, 123, 3)">;
 * // ➔ never
 * type C = RGB<"rgb(23,242,0)", { separator: "," }>;
 * // ➔ "rgb(23,242,0)"
 * ```
 */
type RGB<
  T extends string,
  Options extends RGBOptions = DefaultRGBOptions
> = T extends `rgb(${infer R extends number}${Options["separator"]}${infer G extends number}${Options["separator"]}${infer B extends number})`
  ? AndArr<
      [
        _IsValidRGBParameter<R>,
        _IsValidRGBParameter<G>,
        _IsValidRGBParameter<B>
      ]
    > extends true
    ? T
    : never
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsRGB`.***
 * -------------------------------------------------------
 * **A type-level utility that checks if a string is a valid **RGB color**.**
 * - Returns `true` if valid, otherwise `false`.
 * @template T - A string to check.
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = IsRGB<"rgb(23, 242, 0)">;
 * // ➔ true
 * type B = IsRGB<"rgb(324, 123, 3)">;
 * // ➔ false
 * type C = IsRGB<"rgb(23,242,0)", { separator: "," }>;
 * // ➔ true
 * ```
 */
type IsRGB<
  T extends string,
  Options extends RGBOptions = DefaultRGBOptions
> = Not<IsNever<RGB<T, Options>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfRGB`.***
 * -------------------------------------------------------
 * **A conditional type that returns `IfTrue` if `T` is a valid **RGB color**,
 * otherwise returns `IfFalse`.**
 * @template T - A string to check.
 * @template IfTrue - Return type if valid (defaults to `true`).
 * @template IfFalse - Return type if invalid (defaults to `false`).
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = IfRGB<"rgb(23, 242, 0)">;
 * // ➔ true
 * type B = IfRGB<"rgb(23, 242, 0)", "valid">;
 * // ➔ "valid"
 * type C = IfRGB<"rgb(324, 123, 3)", "valid", "invalid">;
 * // ➔ "invalid"
 * type D = IfRGB<"rgb(23,242,0)", true, false { separator: "," }>;
 * // ➔ true
 * ```
 */
type IfRGB<
  T extends string,
  IfTrue = true,
  IfFalse = false,
  Options extends RGBOptions = DefaultRGBOptions
> = If<IsRGB<T, Options>, IfTrue, IfFalse>;
type _ValidHEXCharacters = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F"
];
type _AllowedHEXLength = 3 | 4 | 6 | 8;
/** -------------------------------------------------------
 * * ***Utility Type: `HEX`.***
 * -------------------------------------------------------
 * **A type-level utility that validates a **HEX color string**.**
 * - **Behavior:**
 *      - Accepts `#RGB`, `#RGBA`, `#RRGGBB`, or `#RRGGBBAA` formats.
 *      - Characters must be `[0-9A-F]` (**case-insensitive**).
 *      - Returns `T` if valid, otherwise `never`.
 * @template T - A string to check.
 * @example
 * ```ts
 * type A = HEX<"#000">;      // ➔ "#000"
 * type B = HEX<"#g00">;      // ➔ never
 * type C = HEX<"#0000">;     // ➔ "#0000"
 * type D = HEX<"#00000">;    // ➔ never
 * type E = HEX<"#000000">;   // ➔ "#000000"
 * type F = HEX<"#00000000">; // ➔ "#00000000"
 * ```
 */
type HEX<T extends string> = (
  Uppercase<T> extends `#${infer HEXWithoutHashTag extends string}`
    ? StringLength<HEXWithoutHashTag> extends _AllowedHEXLength
      ? ExtendsArr<Split<HEXWithoutHashTag, "">, _ValidHEXCharacters[number]>
      : false
    : false
) extends true
  ? T
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsHEX`.***
 * -------------------------------------------------------
 * **A type-level utility that checks if a string is a valid **HEX color**.**
 * - Returns `true` if valid, otherwise `false`.
 * @template T - A string to check.
 * @example
 * ```ts
 * type A = IsHEX<"#000">; // ➔ true
 * type B = IsHEX<"#g00">; // ➔ false
 * ```
 */
type IsHEX<T extends string> = Not<IsNever<HEX<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfHEX`.***
 * -------------------------------------------------------
 * **A conditional type that returns `IfTrue` if `T` is a valid **HEX color**,
 * otherwise returns `IfFalse`.**
 * @template T - A string to check.
 * @template IfTrue - Return type if valid (defaults to `true`).
 * @template IfFalse - Return type if invalid (defaults to `false`).
 * @example
 * ```ts
 * type A = IfHEX<"#000">;
 * // ➔ true
 * type B = IfHEX<"#g00">;
 * // ➔ false
 * type C = IfHEX<"#0000", "valid">;
 * // ➔ "valid"
 * type D = IfHEX<"#00000", "valid","invalid">;
 * // ➔ "invalid"
 * ```
 */
type IfHEX<T extends string, IfTrue = true, IfFalse = false> = If<
  IsHEX<T>,
  IfTrue,
  IfFalse
>;
/** * ***Configuration options for a type-level utility
 * {@link HSL | `HSL` } | {@link IsHSL | `IsHSL` } | {@link IfHSL | `IfHSL` }.*** */
type HSLOptions = {
  /** * ***Separator character(s) used between the HSL components (`h`, `s`, `l`).***
   *
   * - **For example:**
   *      - `","` ➔ `"hsl(180,100%,50%)"`.
   *      - `", "` ➔ `"hsl(180, 100%, 50%)"`.
   *
   * @default ", "
   */
  separator: string;
};
/** * ***Default configuration for the {@link HSLOptions | `HSLOptions`}.***
 *
 * @example
 * ```ts
 * type Opt = DefaultHSLOptions;
 * // ➔ { separator: ", " }
 * ```
 */
type DefaultHSLOptions = {
  /** * ***Default separator for HSL components.***
   *
   * **Produces strings like `"hsl(180, 100%, 50%)"`.**
   */
  separator: ", ";
};
/** -------------------------------------------------------
 * * ***Utility Type: `HSL`.***
 * -------------------------------------------------------
 * **A type-level utility that validates an **HSL color string**.**
 * - **Behavior:**
 *      - Accepts `hsl(h, s%, l%)` format with customizable separators.
 *      - `h` must be an integer, `s` and `l` must be integers between `0` and `100`.
 *      - Returns `T` if valid, otherwise `never`.
 * @template T - A string to check.
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = HSL<"hsl(100, 34%, 56%)">;
 * // ➔ "hsl(100, 34%, 56%)"
 * type B = HSL<"hsl(100, 200%, 3)">;
 * // ➔ never
 * type C = HSL<"hsl(100,34%,56%)", { separator: "," }>;
 * // ➔ "hsl(100,34%,56%)"
 * ```
 */
type HSL<T extends string, Options extends HSLOptions = DefaultHSLOptions> = (
  T extends `hsl(${infer H extends number}${Options["separator"]}${infer S extends number}%${Options["separator"]}${infer L extends number}%)`
    ? AndArr<[IsInteger<H>, IsInteger<S>, IsInteger<L>]> extends true
      ? AndArr<[IsBetween<S, 0, 100>, IsBetween<L, 0, 100>]>
      : false
    : false
) extends true
  ? T
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsHSL`.***
 * -------------------------------------------------------
 * **A type-level utility that checks if a string is a valid **HSL color**.**
 * - Returns `true` if valid, otherwise `false`.
 * @template T - A string to check.
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = IsHSL<"hsl(100, 34%, 56%)">;
 * // ➔ true
 * type B = IsHSL<"hsl(101, 200%, 3)">;
 * // ➔ false
 * type C = IsHSL<"hsl(100,34%,56%)", { separator: "," }>;
 * // ➔ true
 * ```
 */
type IsHSL<
  T extends string,
  Options extends HSLOptions = DefaultHSLOptions
> = Not<IsNever<HSL<T, Options>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfHSL`.***
 * -------------------------------------------------------
 * **A conditional type that returns `IfTrue` if `T` is a valid **HSL color**,
 * otherwise returns `IfFalse`.**
 * @template T - A string to check.
 * @template IfTrue - Return type if valid (defaults to `true`).
 * @template IfFalse - Return type if invalid (defaults to `false`).
 * @template Options - Options with `separator` (defaults to `", "`).
 * @example
 * ```ts
 * type A = IfHSL<"hsl(100, 34%, 56%)", "ok">;
 * // ➔ "ok"
 * type B = IfHSL<"hsl(101, 200%, 3)", "ok", "fail">;
 * // ➔ "fail"
 * type C = IfHSL<"hsl(100,34%,56%)", true, false, { separator: "," }>;
 * // ➔ true
 * ```
 */
type IfHSL<
  T extends string,
  IfTrue = true,
  IfFalse = false,
  Options extends HSLOptions = DefaultHSLOptions
> = If<IsHSL<T, Options>, IfTrue, IfFalse>;
/** * ***High-level configuration for {@link Color | `Color`} parsing utilities.***
 *
 * **Allows customizing **RGB** and **HSL** parsing behavior independently.**
 */
type ColorOptions = {
  /** * ***Options for handling RGB color strings.***
   *
   * - **Behavior:**
   *      - Controls parsing and formatting behavior of RGB values.
   *      - By default uses {@link DefaultRGBOptions | **`DefaultRGBOptions`**}.
   * @default DefaultRGBOptions
   * @example
   * ```ts
   * type Opt = ColorOptions["rgbOptions"];
   * // ➔ { separator: string }
   *
   * // with defaults applied:
   * type Opt = DefaultRGBOptions;
   * // ➔ { separator: ", " }
   * ```
   */
  rgbOptions?: RGBOptions;
  /** * ***Options for handling HSL color strings.***
   *
   * - **Behavior:**
   *      - Controls parsing and formatting behavior of HSL values.
   *      - By default uses {@link DefaultHSLOptions | **`DefaultHSLOptions`**}.
   * @default DefaultHSLOptions
   * @example
   * ```ts
   * type Opt = ColorOptions["hslOptions"];
   * // ➔ { separator: string }
   *
   * // with defaults applied:
   * type Opt = DefaultHSLOptions;
   * // ➔ { separator: ", " }
   * ```
   */
  hslOptions?: HSLOptions;
};
/** * ***Default configuration for the {@link ColorOptions |`ColorOptions`}.***
 *
 * @example
 * ```ts
 * type Opt = DefaultColorOptions;
 * // ➔ { rgbOptions: { separator: ", " }, hslOptions: { separator: ", " } }
 * ```
 */
type DefaultColorOptions = {
  /** * ***Default configuration for `RGBOptions`.***
   *
   * - **Behavior:**
   *      - Provides the default separator for RGB strings.
   *      - By default: `", "`
   * @example
   * ```ts
   * type RGBOpt = DefaultColorOptions["rgbOptions"];
   * // ➔ { separator: ", " }
   * ```
   */
  rgbOptions: DefaultRGBOptions;
  /** * ***Default configuration for `HSLOptions`.***
   *
   * - **Behavior:**
   *      - Provides the default separator for HSL strings.
   *      - By default: `", "`
   * @example
   * ```ts
   * type HSLOpt = DefaultColorOptions["hslOptions"];
   * // ➔ { separator: ", " }
   * ```
   */
  hslOptions: DefaultHSLOptions;
};
type ResolveRGBOptions<O extends ColorOptions> =
  O["rgbOptions"] extends RGBOptions ? O["rgbOptions"] : DefaultRGBOptions;
type ResolveHSLOptions<O extends ColorOptions> =
  O["hslOptions"] extends HSLOptions ? O["hslOptions"] : DefaultHSLOptions;
/** -------------------------------------------------------
 * * ***Utility Type: `Color`.***
 * -------------------------------------------------------
 * - **A type-level utility that validates a string as a **Color** in:**
 *      - **`RGB`**.
 *      - **`HEX`**.
 *      - **`HSL`**.
 * @returns {T} Returns `T` if valid, otherwise `never`.
 * @template T - A string to check.
 * @template Options - Options to pass down to `RGB`/`HSL` validation.
 * @example
 * ```ts
 * type A = Color<"rgb(23, 242, 0)">;
 * // ➔ "rgb(23, 242, 0)"
 * type B = Color<"rgb(324, 123, 3)">;
 * // ➔ never
 * type C = Color<"#000000">;
 * // ➔ "#000000"
 * type D = Color<"hsl(100,34%,56%)", { hslOptions: { separator: "," }}>;
 * // ➔ "hsl(100,34%,56%)"
 * ```
 */
type Color<
  T extends string,
  Options extends ColorOptions = DefaultColorOptions
> =
  | HEX<T>
  | HSL<T, ResolveHSLOptions<Options>>
  | RGB<T, ResolveRGBOptions<Options>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsColor`.***
 * -------------------------------------------------------
 * **A type-level utility that checks if a string is a valid **Color**
 * (`RGB` | `HEX` | `HSL`).**
 * @returns {T} - Returns `true` if valid, otherwise `false`.
 * @template T - A string to check.
 * @template Options - Options to pass down to RGB/HSL validation.
 * @example
 * ```ts
 * type A = IsColor<"rgb(23, 242, 0)">;
 * // ➔ true
 * type B = IsColor<"rgb(324, 123, 3)">;
 * // ➔ false
 * type C = IsColor<"#000000">;
 * // ➔ true
 * type D = IsColor<"hsl(100,34%,56%)", { hslOptions: { separator: "," } }>;
 * // ➔ true
 * ```
 */
type IsColor<
  T extends string,
  Options extends ColorOptions = DefaultColorOptions
> = Not<IsNever<Color<T, Options>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IfColor`.***
 * -------------------------------------------------------
 * **A conditional type that returns `IfTrue` if `T` is a valid **Color**
 * (`RGB` | `HEX` | `HSL`), otherwise returns `IfFalse`.**
 * @template T - A string to check.
 * @template IfTrue - Return type if valid (defaults to `true`).
 * @template IfFalse - Return type if invalid (defaults to `false`).
 * @template Options - Options to pass down to RGB/HSL validation.
 * @example
 * ```ts
 * type A = IfColor<"rgb(23, 242, 0)", { rgbOptions: { separator: ", " }}, "valid">;
 * // ➔ "valid"
 * type B = IfColor<"rgb(324, 123, 3)", DefaultColorOptions, "valid","invalid">;
 * // ➔ "invalid"
 * type C = IfColor<"#000000">;
 * // ➔ true
 * ```
 */
type IfColor<
  T extends string,
  Options extends ColorOptions = DefaultColorOptions,
  IfTrue = true,
  IfFalse = false
> = If<IsColor<T, Options>, IfTrue, IfFalse>;
/** -------------------------------------------------------
 * * ***Utility Type: `Concat`.***
 * -------------------------------------------------------
 * **A type-level utility that concatenates `two arrays` into `one`.**
 * @template T - The first array type.
 * @template U - The second array type, or a single element.
 * @example
 * ```ts
 * type A = Concat<[number, number], [string, string]>;
 * // ➔ [number, number, string, string]
 * type B = Concat<[], [1, 2]>;
 * // ➔ [1, 2]
 * type C = Concat<[1, 2], 3>;
 * // ➔ [1, 2, 3]
 * type D = Concat<[], 5>;
 * // ➔ [5]
 * type E = Concat<[1, 2], []>;
 * // ➔ [1, 2]
 * ```
 */
type Concat<T extends readonly unknown[], U> = [
  ...T,
  ...(U extends readonly unknown[] ? U : [U])
];
/** -------------------------------------------------------
 * * ***Utility Type: `DigitsTuple`.***
 * -------------------------------------------------------
 * **A **type-level utility** that converts a numeric literal (number or bigint) into
 * a structured representation of its digits.**
 * - **The resulting type is an **object** with the following properties:**
 *      - `negative`: boolean flag indicating if the number is negative.
 *      - `bigint`: boolean flag indicating if the value is a bigint.
 *      - `float`: boolean flag indicating if the value is a floating-point number.
 *      - `digits`: a tuple of digits (each as a `number`), with decimal points and
 *        bigint suffix `n` removed.
 * - **Works with:**
 *      - Positive integers
 *      - Negative integers
 *      - Zero and negative zero
 *      - Floating-point numbers (decimal points are ignored)
 *      - BigInt values
 * **Note:** TypeScript automatically normalizes scientific notation numeric literals
 * (e.g., `5e3` ➔ `5000`), so the `digits` tuple will reflect the expanded value.
 * @template T - A numeric literal type (`number` or `bigint`) to convert.
 * @example
 * ```ts
 * // Single digit
 * type A = DigitsTuple<1>;
 * // ➔ { negative: false; bigint: false; float: false; digits: [1] }
 *
 * // Positive integer
 * type B = DigitsTuple<123>;
 * // ➔ { negative: false; bigint: false; float: false; digits: [1, 2, 3] }
 *
 * // Negative integer
 * type C = DigitsTuple<-123>;
 * // ➔ { negative: true; bigint: false; float: false; digits: [1, 2, 3] }
 *
 * // Zero and negative zero (treated the same)
 * type D = DigitsTuple<0>;
 * // ➔ { negative: false; bigint: false; float: false; digits: [0] }
 * type E = DigitsTuple<-0>;
 * // ➔ { negative: false; bigint: false; float: false; digits: [0] }
 *
 * // Floating-point numbers
 * type F = DigitsTuple<0.123>;
 * // ➔ { negative: false; bigint: false; float: true; digits: [0, 1, 2, 3] }
 * type G = DigitsTuple<-0.123>;
 * // ➔ { negative: true; bigint: false; float: true; digits: [0, 1, 2, 3] }
 *
 * // BigInt values
 * type H = DigitsTuple<98765n>;
 * // ➔ { negative: false; bigint: true; float: false; digits: [9, 8, 7, 6, 5] }
 * type I = DigitsTuple<-98765n>;
 * // ➔ { negative: true; bigint: true; float: false; digits: [9, 8, 7, 6, 5] }
 *
 * // Scientific notation numeric literals (auto-expanded)
 * type J = DigitsTuple<5e3>; // `5e3` is same like `5000`
 * // ➔ { negative: false; bigint: false; float: false; digits: [5, 0, 0, 0] }
 * type K = DigitsTuple<-2.5e2>; // `-2.5e2` is same like `-250`
 * // ➔ { negative: true; bigint: false; float: true; digits: [2, 5, 0] }
 * ```
 */
type DigitsTuple<T extends number | bigint> = {
  negative: `${T}` extends `-${string}` ? true : false;
  float: IsFloat<Extract<T, number>> extends true ? true : false;
  bigint: T extends bigint ? true : false;
  digits: Split<ReplaceAll<Stringify<Abs<T>>, [".", "n"], "">> extends infer R
    ? { [K in keyof R]: R[K] extends string ? ParseNumber<R[K]> : never }
    : never;
};
/** -------------------------------------------------------
 * * ***Utility Type: `ReturnItselfIfExtends`.***
 * -------------------------------------------------------
 * **This utility is useful when you want to **narrow types by extension**,
 * replacing them with a fallback if they match a given base constraint,
 * while preserving them otherwise.**
 * - **A conditional type that returns:**
 *      - `Else` if `T` extends `Base`.
 *      - `T` itself if `T` does extend `Base`.
 *      - `IfANever` if `T` is `never`.
 * @template T - The type to check.
 * @template Base - The base type to test against.
 * @template Else - The type to return if `T` extends `Base`.
 * @template IfANever - The type to return if `T` or `Base` is `never` (default: `never`).
 * @example
 * ```ts
 * type Case1 = ReturnItselfIfExtends<1, number, 2>
 * // ➔ 1
 *
 * type Case2 = ReturnItselfIfExtends<'1', number, 2>
 * // ➔ 2
 *
 * // ℹ️ Never Case:
 * type Case3 = ReturnItselfIfExtends<never, string, 0>
 * // ➔ never
 *
 * type Case4 = ReturnItselfIfExtends<string, never, 0, undefined>
 * // ➔ undefined
 * ```
 */
type ReturnItselfIfExtends<T, Base, Else, IfANever = never> = IfNever<
  If<Extends<Or<Base, T>, true>, never>,
  IfANever,
  T extends Base ? T : Else
>;
/** -------------------------------------------------------
 * * ***Utility Type: `ReturnItselfIfNotExtends`.***
 * -------------------------------------------------------
 * **This utility is useful for preserving a type unless it matches
 * a broader constraint, in which case it is replaced with a fallback.**
 * - **A conditional type that returns:**
 *      - `Else` if `T` extends `Base`.
 *      - `T` itself if `T` does **not** extend `Base`.
 *      - `IfANever` if `T` is `never`.
 * @template T - The type to check.
 * @template Base - The base type to test against.
 * @template Else - The type to return if `T` extends `Base`.
 * @template IfANever - The type to return if `T` or `Base` is `never` (default: `never`).
 * @example
 * ```ts
 * type Case1 = ReturnItselfIfNotExtends<'1', number, 2>
 * // ➔ '1'
 * type Case2 = ReturnItselfIfNotExtends<1, number, 2>
 * // ➔ 2
 *
 * // ℹ️ Never Case:
 * type Case3 = ReturnItselfIfNotExtends<never, string, 0>;
 *  // ➔ never
 * type Case4 = ReturnItselfIfNotExtends<string, never, 0, undefined>;
 *  // ➔ undefined
 * ```
 */
type ReturnItselfIfNotExtends<T, Base, Else, IfANever = never> = IfNever<
  If<Extends<Or<Base, T>, true>, never>,
  IfANever,
  T extends Base ? Else : T
>;
type MultiplicationMap = {
  0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  2: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
  3: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27];
  4: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36];
  5: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];
  6: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54];
  7: [0, 7, 14, 21, 28, 35, 42, 49, 56, 63];
  8: [0, 8, 16, 24, 32, 40, 48, 56, 64, 72];
  9: [0, 9, 18, 27, 36, 45, 54, 63, 72, 81];
};
type _MultiSingle<
  Num1 extends string,
  DigitOfNum2 extends keyof MultiplicationMap,
  Carry extends number = 0,
  Result extends string = ""
> =
  IsEmptyString<Num1> extends true
    ? ReturnItselfIfNotExtends<RemoveLeading<`${Carry}${Result}`, "0">, "", "0">
    : IsEqual<Num1, 0> extends true
      ? "0"
      : IsEqual<DigitOfNum2, 0> extends true
        ? "0"
        : LastCharacter<
              Num1,
              {
                includeRest: true;
              }
            > extends [
              infer Num1LastCharacter extends string,
              infer Num1Rest extends string
            ]
          ? Stringify<
              Sum<
                MultiplicationMap[DigitOfNum2][ParseNumber<Num1LastCharacter> &
                  keyof MultiplicationMap[DigitOfNum2]],
                Carry
              >
            > extends infer Multiplied extends string
            ? LastCharacter<
                Multiplied,
                {
                  includeRest: true;
                }
              > extends [
                infer MultipliedLastDigit extends string,
                infer MultipliedRest extends string
              ]
              ? _MultiSingle<
                  Num1Rest,
                  DigitOfNum2,
                  If<
                    IsNever<ParseNumber<MultipliedRest>>,
                    0,
                    ParseNumber<MultipliedRest>
                  >,
                  `${MultipliedLastDigit}${Result}`
                >
              : never
            : never
          : never;
type _Multi<
  Num1 extends string,
  Num2 extends string,
  Result extends string = "",
  Iteration extends unknown[] = []
> =
  IsEmptyString<Num2> extends true
    ? Result
    : LastCharacter<
          Num2,
          {
            includeRest: true;
          }
        > extends [
          infer Num2LastCharacter extends string,
          infer Num2Rest extends string
        ]
      ? ParseNumber<Num2LastCharacter> extends infer Num2Digit extends
          keyof MultiplicationMap
        ? _Multi<
            Num1,
            Num2Rest,
            Stringify<
              _Sum<
                Result,
                ReturnItselfIfNotExtends<
                  RemoveLeading<
                    `${_MultiSingle<Num1, Num2Digit>}${Repeat<"0", Iteration["length"]>}`,
                    "0"
                  >,
                  "",
                  "0"
                >
              >
            >,
            Push<Iteration, unknown>
          >
        : never
      : Result;
/** -------------------------------------------------------
 * * ***Utility Type: `Multi`.***
 * -------------------------------------------------------
 * **Accepts two integers and returns their **multiplication**.**
 * - **Behavior:**
 *      - Handles negative numbers automatically.
 *      - Uses internal type-level recursion to simulate multiplication of
 *        digit strings.
 *      - Works with integers within the range:
 *          - `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - The first integer (can be negative).
 * @template Num2 - The second integer (can be negative).
 * @example
 * ```ts
 * type Case1 = Multi<10, 0>;   // ➔ 0
 * type Case2 = Multi<4, 6>;    // ➔ 24
 * type Case3 = Multi<-4, 6>;   // ➔ -24
 * type Case4 = Multi<-4, -6>;  // ➔ 24
 * type Case5 = Multi<123, 45>; // ➔ 5535
 * ```
 * @note
 * - ***Internal helpers:***
 *     - `_Multi` ➔ Recursively multiplies digit strings and accumulates the result.
 *     - `_MultiSingle` ➔ Multiplies a string-number with a single digit, handling carry.
 */
type Multi<Num1 extends number, Num2 extends number> =
  IsEqual<Num1, 0> extends true
    ? 0
    : IsEqual<Num2, 0> extends true
      ? 0
      : ParseNumber<
            _Multi<Stringify<Abs<Num1>>, Stringify<Abs<Num2>>>
          > extends infer Result extends number
        ? IfNegative<
            Num1,
            IfNegative<Num2, Result, Negate<Result>>,
            IfNegative<Num2, Negate<Result>, Result>
          >
        : never;
type _FindQuotient<
  Dividend extends number,
  Divisor extends number,
  CurrentQuotient extends number
> =
  Multi<Divisor, CurrentQuotient> extends infer Product extends number
    ? IsEqual<Dividend, Product> extends true
      ? CurrentQuotient
      : IsLowerThan<Dividend, Product> extends true
        ? _FindQuotient<Dividend, Divisor, Decrement<CurrentQuotient>>
        : CurrentQuotient
    : never;
type _Div<
  Dividend extends string,
  Divisor extends number,
  Result extends string = "",
  CurrentDividend extends string = "",
  IterationsWithoutDivision extends number = 0,
  HadFirstDivision extends boolean = false
> =
  Or<
    IsEmptyString<CurrentDividend>,
    IsLowerThan<ParseNumber<CurrentDividend>, Divisor>
  > extends true
    ? IsEmptyString<Dividend> extends true
      ? ParseNumber<
          If<
            And<HadFirstDivision, IsNotEqual<IterationsWithoutDivision, 0>>,
            `${Result}0`,
            Result
          >
        >
      : Dividend extends `${infer FirstDigit extends string}${infer Rest extends string}`
        ? _Div<
            Rest,
            Divisor,
            If<
              And<HadFirstDivision, IsNotEqual<IterationsWithoutDivision, 0>>,
              `${Result}0`,
              Result
            >,
            IfEqual<
              CurrentDividend,
              "0",
              FirstDigit,
              `${CurrentDividend}${FirstDigit}`
            >,
            Increment<IterationsWithoutDivision>,
            HadFirstDivision
          >
        : never
    : _FindQuotient<
          ParseNumber<CurrentDividend>,
          Divisor,
          10
        > extends infer Quotient extends number
      ? IsNever<Quotient> extends true
        ? ParseNumber<Result>
        : Sub<
              ParseNumber<CurrentDividend>,
              Multi<Quotient, Divisor>
            > extends infer Remainder extends number
          ? _Div<
              Dividend,
              Divisor,
              `${Result}${Quotient}`,
              IfGreaterThan<Remainder, 0, `${Remainder}`, "">,
              0,
              true
            >
          : never
      : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Div`.***
 * -------------------------------------------------------
 * **A type-level utility that returns the integer division of two numbers.
 * Handles negative numbers correctly and returns `never` if dividing by zero.**
 * - **Behavior:**
 *      - Returns `0` if the absolute value of dividend is smaller than divisor.
 *      - Preserves the sign according to standard integer division rules.
 * @template Dividend - The dividend number.
 * @template Divisor - The divisor number.
 * @example
 * ```ts
 * type A = Div<10, 2>;  // ➔ 5
 * type B = Div<7, 3>;   // ➔ 2
 * type C = Div<-7, 3>;  // ➔ -2
 * type D = Div<7, -3>;  // ➔ -2
 * type E = Div<-7, -3>; // ➔ 2
 * type F = Div<2, 5>;   // ➔ 0
 * type G = Div<0, 5>;   // ➔ 0
 * type H = Div<5, 0>;   // ➔ never
 * ```
 */
type Div<Dividend extends number, Divisor extends number> =
  IsEqual<Divisor, 0> extends true
    ? never
    : IsEqual<Dividend, 0> extends true
      ? 0
      : IsEqual<Dividend, Divisor> extends true
        ? 1
        : IsLowerThan<Abs<Dividend>, Abs<Divisor>> extends true
          ? 0
          : _Div<
                Stringify<Abs<Dividend>>,
                Abs<Divisor>
              > extends infer Quotient extends number
            ? If<
                Or<
                  And<IsNegative<Dividend>, IsNegative<Divisor>>,
                  And<IsPositive<Dividend>, IsPositive<Divisor>>
                >,
                Quotient,
                Negate<Quotient>
              >
            : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Dot`.***
 * -------------------------------------------------------
 * **A type-level utility that concatenates two string literals with a `.`.**
 * - **Behavior:**
 *      - If the `Trims` flag is `true` (default), leading and trailing spaces in
 *        both strings are trimmed before concatenation.
 *      - If the second string literal is empty, it returns the first string literal.
 *      - If the first string literal is empty, it returns the second string literal.
 *      - Otherwise, it returns `${T}.${U}` (trimmed if `Trims` is `true`).
 * @template T - The first string literal.
 * @template U - The second string literal.
 * @template Trims - Whether to trim whitespace from the inputs before concatenation (default: `true`).
 * @example
 * ```ts
 * type A = Dot<"foo", "bar">;
 * // ➔ "foo.bar"
 * type B = Dot<"foo", "">;
 * // ➔ "foo"
 * type C = Dot<"", "baz">;
 * // ➔ "baz"
 * type D = Dot<"  hello  ", " world ", true>;
 * // ➔ "hello.world"
 * type E = Dot<"  hello  ", " world ", false>;
 * // ➔ "  hello  . world "
 * ```
 */
type Dot<T extends string, U extends string, Trims extends boolean = true> =
  Extends<Trims, true> extends true
    ? "" extends Trim<U>
      ? Trim<T>
      : "" extends Trim<T>
        ? `${Trim<U>}`
        : `${Trim<T>}.${Trim<U>}`
    : "" extends U
      ? T
      : `${T}.${U}`;
/** -------------------------------------------------------
 * * ***Utility Type: `DotArray`.***
 * -------------------------------------------------------
 * **A type-level utility that concatenates an array of string literals with a `.`.**
 * - **Behavior:**
 *      - Skips empty strings in the array.
 *      - If `Trims` is `true` (default), trims whitespace from each element.
 *      - Returns a single string literal.
 * @template Arr - An array of string literals.
 * @template Trims - Whether to trim whitespace from each element (default: `true`).
 * @example
 * ```ts
 * type A = DotArray<["foo", "bar", "baz"]>;
 * // ➔ "foo.bar.baz"
 * type B = DotArray<["foo", "", "baz"]>;
 * // ➔ "foo.baz"
 * type C = DotArray<["  foo  ", " bar "], true>;
 * // ➔ "foo.bar"
 * type D = DotArray<["  foo  ", " bar "], false>;
 * // ➔ "  foo  . bar "
 * type E = DotArray<[]>;
 * // ➔ ""
 * ```
 */
type DotArray<
  Arr extends string[],
  Trims extends boolean = true
> = Arr extends [infer Head extends string, ...infer Tail extends string[]]
  ? Head extends ""
    ? DotArray<Tail, Trims>
    : `${Trims extends true ? Trim<Head> : Head}${Tail extends [] ? "" : `.${DotArray<Tail, Trims>}`}`
  : "";
/** -------------------------------------------------------
 * * ***Utility Type: `EndsWith`.***
 * -------------------------------------------------------
 * **A type-level utility that returns a boolean indicating
 * whether the first string literal ends with the ***second one***.**
 * @template T - The string to check.
 * @template C - The ***ending string*** to match.
 * @example
 * ```ts
 * type A = EndsWith<"Hello", "lo">;    // ➔ true
 * type B = EndsWith<"Foobar", "bar">;  // ➔ true
 * type C = EndsWith<"Foobar", "foo">;  // ➔ false
 * type D = EndsWith<"Hello", "world">; // ➔ false
 * ```
 */
type EndsWith<T extends string, C extends string> = T extends `${infer _}${C}`
  ? true
  : false;
/** --------------------------------------------------
 * * ***Utility Type: `ExcludeStrict`.***
 * --------------------------------------------------
 * **Performs a stricter version of `Exclude<T, U>` with improved type narrowing.**
 * - ✅ Especially useful in generic libraries or utility types
 *    where standard `Exclude` may collapse or widen types unintentionally.
 * @template T - The full union or set of types.
 * @template U - The type(s) to be excluded from `T`.
 * @example
 * ```ts
 * type A = 'a' | 'b' | 'c';
 * type B = ExcludeStrict<A, 'b'>;
 * // ➔ 'a' | 'c'
 * ```
 */
type ExcludeStrict<T, U extends T> = T extends unknown
  ? 0 extends (U extends T ? ([T] extends [U] ? 0 : never) : never)
    ? never
    : T
  : never;
/** --------------------------------------------------
 * * ***Utility Type: `ExtractStrict`.***
 * --------------------------------------------------
 * **Performs a stricter version of the built-in `Extract<T, U>`
 * with improved type narrowing.**
 * - ✅ Especially useful in generic utilities where the
 *   standard `Extract` can widen or collapse unions.
 * @template T - The full union or set of types.
 * @template U - The type(s) to be kept from `T`.
 * @example
 * ```ts
 * type A = 'a' | 'b' | 'c';
 * type B = ExtractStrict<A, 'b' | 'c'>;
 * // ➔ 'b' | 'c'
 * ```
 */
type ExtractStrict<T, U extends T> = T extends unknown
  ? 0 extends (U extends T ? ([T] extends [U] ? 0 : never) : never)
    ? T
    : never
  : never;
type _Factorial<
  T extends number,
  CurrentNum extends number = 1,
  CurrentProduct extends number = 1
> =
  IsEqual<T, CurrentNum> extends true
    ? Multi<CurrentProduct, CurrentNum>
    : _Factorial<T, Increment<CurrentNum>, Multi<CurrentProduct, CurrentNum>>;
/** -------------------------------------------------------
 * * ***Utility Type: `Factorial`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns its ***mathematical factorial***.**
 * - **Behavior:**
 *      - Valid range: `[0, 21]`.
 *      - Negative numbers or `number` type result in `never`.
 * @template T - The integer to compute factorial for.
 * @example
 * ```ts
 * type A = Factorial<0>;
 * // ➔ 1
 * type B = Factorial<6>;
 * // ➔ 720
 * type C = Factorial<-5>;
 * // ➔ never
 * type D = Factorial<number>;
 * // ➔ never
 * ```
 */
type Factorial<T extends number> = number extends T
  ? never
  : IsNegative<T> extends true
    ? never
    : IsEqual<T, 0> extends true
      ? 1
      : _Factorial<T>;
/** -------------------------------------------------------
 * * ***Utility Type: `Fibonacci`.***
 * -------------------------------------------------------
 * **A type-level utility that computes the ***Fibonacci number*** at a given
 * index `T`.**
 * - **Behavior:**
 *      - Returns `never` for negative numbers.
 *      - Supports indices in the range `[0, 78]` due to TypeScript recursion limits.
 * @template T - The index of the Fibonacci sequence.
 * @example
 * ```ts
 * type A = Fibonacci<0>;  // ➔ 0
 * type B = Fibonacci<1>;  // ➔ 1
 * type C = Fibonacci<4>;  // ➔ 3
 * type D = Fibonacci<10>; // ➔ 55
 * type E = Fibonacci<40>; // ➔ 102334155
 * type D = Fibonacci<number>; // ➔ never
 * ```
 */
type Fibonacci<T extends number> =
  IsNegative<T> extends true
    ? never
    : IsLowerThan<T, 2> extends true
      ? T
      : Fibonacci<Decrement<T>> extends infer NMinusOne extends number
        ? Fibonacci<Sub<T, 2>> extends infer NMinusTwo extends number
          ? Sum<NMinusOne, NMinusTwo>
          : never
        : never;
/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link FirstCharacter | `FirstCharacter`}.***
 * ---------------------------------------------------------------------------
 * **Configuration options for the {@link FirstCharacter | `FirstCharacter`} type-level utility.**
 */
type FirstCharacterOptions = {
  /** * ***Whether to include the rest of the string in the result tuple.***
   *
   * - **Behavior:**
   *      - `true` ➔ returns `[first character, rest of string]`.
   *      - `false` ➔ returns only the first character.
   * @default false
   * @example
   * ```ts
   * type Opt = { includeRest: true };
   * type R = FirstCharacter<"abc", Opt>; // ➔ ["a", "bc"]
   * ```
   */
  includeRest: boolean;
};
/** -------------------------------------------------------
 * * ***Utility Type: `FirstCharacter`.***
 * -------------------------------------------------------
 * **Accepts a string literal and returns its first character.**
 * - **Behavior:**
 *      - If `Options["includeRest"]` is `true`, it returns a
 *        tuple: `[first character, rest of string]`.
 *      - Otherwise, it returns only the first character.
 * @template T - The string literal to process.
 * @template Options - Configuration options (default: `{ includeRest: false }`).
 *   - `includeRest: boolean` — Whether to include the rest of the string in a tuple.
 * @example
 * ```ts
 * type A = FirstCharacter<"abc">;
 * // ➔ "a"
 * type B = FirstCharacter<"abc", { includeRest: true }>;
 * // ➔ ["a", "bc"]
 * type C = FirstCharacter<"">;
 * // ➔ never
 * type D = FirstCharacter<string>;
 * // ➔ never
 * ```
 */
type FirstCharacter<
  T extends string,
  Options extends FirstCharacterOptions = {
    includeRest: false;
  }
> = T extends `${infer First extends string}${infer Rest extends string}`
  ? If<Options["includeRest"], [First, Rest], First>
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `FirstDigit`.***
 * -------------------------------------------------------
 * **Extracts the **first digit** of a given number `T`.**
 * - **Behavior:**
 *      - Works with integers and decimals.
 *      - Handles negative numbers (`-123` ➔ `-1`).
 *      - Handles `0` and `-0` correctly (always returns `0`).
 *      - Works with bigint literals too.
 * @template T - A number or bigint to extract the first digit from.
 * @template Options - Optional settings.
 * - `alwaysPositive?: boolean` (default: `false`)
 *   If `true`, the result is always positive regardless of the sign.
 * @example
 * ```ts
 * type A = FirstDigit<0>;      // ➔ 0
 * type B = FirstDigit<-0>;     // ➔ 0
 * type C = FirstDigit<123>;    // ➔ 1
 * type D = FirstDigit<-123>;   // ➔ -1
 * type E = FirstDigit<0.123>;  // ➔ 0
 * type F = FirstDigit<-0.123>; // ➔ 0
 * type G = FirstDigit<98765>;  // ➔ 9
 * type H = FirstDigit<-98765>; // ➔ -9
 * type I = FirstDigit<-98765, {alwaysPositive:true}>; // ➔ 9
 * ```
 */
type FirstDigit$1<
  T extends number | bigint,
  Options extends {
    /**
     * If `true`, the result is always positive regardless of the sign, defaultValue: `false`.
     * @example
     * type I = FirstDigit<-98765, {alwaysPositive:true}>;
     * // ➔ 9
     *
     * @default false
     */
    alwaysPositive?: boolean;
  } = {
    alwaysPositive: false;
  }
> = DigitsTuple<T>["digits"] extends readonly [
  infer First extends number,
  ...unknown[]
]
  ? Options["alwaysPositive"] extends true
    ? First
    : DigitsTuple<T>["negative"] extends true
      ? Negate<First>
      : First
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Floor`.***
 * -------------------------------------------------------
 * **Type-level equivalent of `Math.floor()`.**
 * - Returns the ***floored value*** of the passed number.
 * @template T - A number type.
 * @example
 * ```ts
 * type A = Floor<1.9>;  // ➔ 1
 * type B = Floor<-1.2>; // ➔ -2
 * type C = Floor<3>;    // ➔ 3
 * type D = Floor<-5>;   // ➔ -5
 * ```
 */
type Floor<T extends number> =
  IsFloat<T> extends true
    ? GetFloatNumberParts<T> extends [infer Whole extends number, unknown]
      ? IsNegative<T> extends true
        ? Negate<Increment<Whole>>
        : Whole
      : never
    : T;
/** --------------------------------------------------
 * * ***Utility Type: `Identity`.***
 * --------------------------------------------------
 * **Identity utility type that preserves the structure and inference of type `T`.**
 * - ✅ Commonly used to force TypeScript to expand a mapped or intersection type
 *   into a more readable and usable shape.
 * @template T - The type to preserve and normalize.
 * @example
 * ```ts
 * type A = { a: string; b: number };
 * type B = Identity<A>;
 * // ➔ { a: string; b: number }
 * ```
 */
type Identity<T> = { [P in keyof T]: T[P] };
/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link Shift | `Shift`}.***
 * ---------------------------------------------------------------------------
 */
type ShiftOptions = {
  /**
   * If `true`, return both the rest of the array and the removed element
   * as a tuple `[Rest, Removed]`.
   *
   * Default is `false`.
   *
   * @default false
   */
  includeRemoved: boolean;
};
/** -------------------------------------------------------
 * * ***Utility Type: `Shift`.***
 * -------------------------------------------------------
 * **Removes the first element from the array type `T`.**
 * - **Behavior:**
 *      - By default (`includeRemoved: false`), returns the array without the first element.
 *      - If `includeRemoved: true`, returns a tuple `[Rest, Removed]`:
 *        - `Rest`: the remaining array.
 *        - `Removed`: the removed first element.
 * @template T - The array type to operate on.
 * @template Options - Optional flags. Default `{ includeRemoved: false }`.
 * @example
 * ```ts
 * // Default: just remove first element
 * type Case1 = Shift<[1, 2, 3]>;
 * // ➔ [2, 3]
 *
 * // Include removed element
 * type Case2 = Shift<[1, 2, 3], { includeRemoved: true }>;
 * // ➔ [[2, 3], 1]
 *
 * // Empty array
 * type Case3 = Shift<[]>;
 * // ➔ never
 * ```
 */
type Shift<
  T extends readonly unknown[],
  Options extends ShiftOptions = {
    includeRemoved: false;
  }
> = T extends readonly [infer Removed, ...infer Rest extends readonly unknown[]]
  ? If<Options["includeRemoved"], [Rest, Removed], Rest>
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `Includes`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the second argument is in the first array argument.**
 * @template T - The array to check.
 * @template Pivot - The value to look for.
 * @example
 * ```ts
 * type Case1 = Includes<[1, 2, 3], 1>; // ➔ true
 * type Case2 = Includes<[1, 2, 3], 4>; // ➔ false
 * ```
 */
type Includes<T extends readonly unknown[], Pivot> =
  IsEmptyArray<T> extends true
    ? false
    : Shift<
          T,
          {
            includeRemoved: true;
          }
        > extends [infer Rest extends readonly unknown[], infer Removed]
      ? IfEqual<Pivot, Removed, true, Includes<Rest, Pivot>>
      : false;
type _IndexOfArray<
  T extends readonly unknown[],
  Pivot,
  Index extends number = 0
> = T extends readonly [infer First, ...infer Rest extends unknown[]]
  ? IsEqual<First, Pivot> extends true
    ? Index
    : _IndexOfArray<Rest, Pivot, Increment<Index>>
  : -1;
type _IndexOfString<
  T extends string,
  Pivot,
  Index extends number = 0
> = T extends `${infer First}${infer Rest extends string}`
  ? IsEqual<First, Pivot> extends true
    ? Index
    : _IndexOfString<Rest, Pivot, Increment<Index>>
  : -1;
/** -------------------------------------------------------
 * * ***Utility Type: `IndexOf`.***
 * --------------------------------------------------------
 * **Type version of `Array.prototype.indexOf()` and `String.prototype.indexOf()`.**
 * - Returns the index of the second argument in the first argument.
 * @example
 * ```ts
 * type Case1 = IndexOf<[1, 2, 3], 2>; // ➔ 1
 * type Case2 = IndexOf<[1, 2, 3], 4>; // ➔ -1
 * type Case3 = IndexOf<'123', '2'>;   // ➔ 1
 * type Case4 = IndexOf<'123', '4'>;   // ➔ -1
 * ```
 */
type IndexOf<
  T extends readonly unknown[] | string,
  Pivot extends T extends string ? string : unknown
> = T extends string
  ? IsStringLiteral<T> extends true
    ? _IndexOfString<T, Pivot>
    : never
  : T extends readonly unknown[]
    ? IsTuple<T> extends true
      ? _IndexOfArray<T, Pivot>
      : never
    : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsArrayIndex`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a valid array index.**
 * @example
 * ```ts
 * type Case1 = IsArrayIndex<1>;   // ➔ true
 * type Case2 = IsArrayIndex<'1'>; // ➔ true
 * type Case3 = IsArrayIndex<-1>;  // ➔ false
 * type Case4 = IsArrayIndex<"a">; // ➔ false
 * ```
 */
type IsArrayIndex<T> = T extends number
  ? And<IsInteger<T>, IsGreaterOrEqual<T, 0>>
  : T extends string
    ? ParseNumber<T> extends infer NumT extends number
      ? Not<IsNever<NumT>> extends true
        ? And<IsInteger<NumT>, IsGreaterOrEqual<NumT, 0>>
        : false
      : false
    : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsArrayOrTuple`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is an array or tuple type.**
 * - This includes both mutable (`T[]`) and readonly (`readonly T[]`) arrays.
 * @template T - The type to check.
 * @example
 * type A = IsArrayOrTuple<string[]>;
 * // ➔ true
 * type B = IsArrayOrTuple<readonly [string, number]>;
 * // ➔ true
 * type C = IsArrayOrTuple<string>; // ➔ false
 */
type IsArrayOrTuple<T> = T extends readonly any[] ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IsConstructor`.***
 * -------------------------------------------------------
 * **Checks whether a given type `T` is a constructor type.**
 *
 * This utility evaluates to `true` if `T` has a constructor
 * signature, including constructors of **abstract classes**.
 *
 * It uses the `abstract new (...args) => instance` signature,
 * meaning it matches any type that represents a constructor —
 * even if the class cannot be instantiated directly.
 *
 * - **Behavior:**
 *      - Evaluates to `true` if `T` has a compatible constructor signature.
 *      - Optionally validates the **constructor parameter tuple**
 *        and **instance type** using the generic parameters `A` and `R`.
 *
 * - **Difference from {@link IsNewable | `IsNewable`}:**
 *      - `IsConstructor` returns `true` for **both concrete and abstract constructors**.
 *      - `IsNewable` only returns `true` for constructors that can be
 *        instantiated with `new`.
 *
 * In other words:
 *
 * ```ts
 * IsConstructor ⊇ IsNewable
 * ```
 *
 * @template T - The type to check.
 * @template A - Expected constructor parameter tuple (default: `any[]`).
 * @template R - Expected instance type (default: `any`).
 *
 * @example
 * ```ts
 * class A {}
 * abstract class B {}
 *
 * type T1 = IsConstructor<typeof A>;
 * // ➔ true
 * type T2 = IsConstructor<typeof B>;
 * // ➔ true
 * ```
 *
 * @example
 * ```ts
 * class User {
 *   constructor(x: number, y: string) {}
 * }
 *
 * type T1 = IsConstructor<typeof User, [number, string], User>;
 * // ➔ true
 * type T2 = IsConstructor<typeof User, [string], User>;
 * // ➔ false
 * ```
 *
 * @example
 * ```ts
 * type T1 = IsConstructor<() => void>;
 * // ➔ false
 * ```
 */
type IsConstructor<
  T,
  A extends any[] = any[],
  R = any
> = T extends abstract new (...args: A) => R ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IsFunction`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is a callable function type.**
 * @template T - The type to check.
 * @example
 * type A = IsFunction<() => void>; // ➔ true
 * type B = IsFunction<string>;     // ➔ false
 */
type IsFunction<T> = T extends AnyFunction ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `Primitive`.***
 * -------------------------------------------------------
 * **Represents **all primitive types in JavaScript/TypeScript**,
 * including their literal variants.**
 * - **This type matches:**
 *      - Core primitive types:
 *        - `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`.
 *      - Literal counterparts:
 *        - `"foo"`, `42`, `true`, etc.
 * - ⚠️ ***Note:***
 *      - Unlike some definitions, this does **not** include `void` or `never`,
 *        since they are TypeScript-specific keywords, not runtime primitives.
 * @example
 * ```ts
 * type A = Primitive;
 * // ➔ any strict primitive type
 * type B = "hello" extends Primitive ? true : false;
 * // ➔ true
 * type C = void extends Primitive ? true : false;
 * // ➔ false
 * ```
 */
type Primitive = string | number | bigint | boolean | symbol | null | undefined;
/** -------------------------------------------------------
 * * ***Utility Type: `IsPrimitive`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is a **strict primitive type** in JavaScript/TypeScript,
 * including literal variants.**
 * - **Behavior:**
 *      - ***Includes:***
 *          - `string`, `number`, `bigint`, `boolean`, `symbol`, `null`, `undefined`.
 *          - Literal types like: `"foo"`, `42`, `true`.
 *      - ***Excludes:***
 *          - `void` (absence of value).
 *          - `never` (impossible type).
 *          - `object`, `unknown`, `Date`, `arrays`, `functions`, etc.
 * @template T - The type to check
 * @example
 * ```ts
 * type A = IsPrimitive<"foo">;      // ➔ true
 * type B = IsPrimitive<null>;       // ➔ true
 * type C = IsPrimitive<number>;     // ➔ true
 * type D = IsPrimitive<undefined>;  // ➔ true
 * type E = IsPrimitive<{}>;         // ➔ false
 * type F = IsPrimitive<void>;       // ➔ false
 * type G = IsPrimitive<never>;      // ➔ false
 * type H = IsPrimitive<unknown>;    // ➔ false
 * type I = IsPrimitive<object>;     // ➔ false
 * type J = IsPrimitive<Date>;       // ➔ false
 * type K = IsPrimitive<[]>;         // ➔ false
 * type L = IsPrimitive<() => void>; // ➔ false
 * ```
 */
type IsPrimitive<T> =
  IsNever<T> extends true ? false : T extends Primitive ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IsRealPrimitive`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is a **real primitive type** in JavaScript/TypeScript,
 * based on runtime behavior, **excluding `null`** but including `undefined`.**
 * - **Behavior:**
 *      - ***Includes:***
 *          - `string`, `number`, `bigint`, `boolean`, `symbol`, `undefined`.
 *          - Literal types like: `"foo"`, `42`, `true`.
 *      - ***Excludes:***
 *          - `null`.
 *          - `never` (impossible type).
 *          - Objects, arrays, functions, `Date`, `unknown`, etc.
 * - ⚠️ ***Note:***
 *      - This aligns with runtime `typeof` checks in JS:
 *         - `typeof null === "object"`,
 *            so `null` is excluded from **“real primitives”**.
 * @template T - The type to check.
 * @example
 * ```ts
 * type A = IsRealPrimitive<42>;         // ➔ true
 * type B = IsRealPrimitive<string>;     // ➔ true
 * type C = IsRealPrimitive<boolean>;    // ➔ true
 * type D = IsRealPrimitive<undefined>;  // ➔ true
 * type E = IsRealPrimitive<{}>;         // ➔ false
 * type F = IsRealPrimitive<[]>;         // ➔ false
 * type G = IsRealPrimitive<null>;       // ➔ false
 * type H = IsRealPrimitive<Date>;       // ➔ false
 * type I = IsRealPrimitive<() => void>; // ➔ false
 * ```
 */
type IsRealPrimitive<T> = T extends Exclude<Primitive, null> ? true : false;
/** * Applies readonly behavior according to mode. */
type ApplyReadonlyMode<
  T,
  Mode extends PrettifyOptions["readonlyMode"]
> = Mode extends "remove"
  ? { -readonly [K in keyof T]: T[K] }
  : Mode extends "preserve"
    ? { readonly [K in keyof T]: T[K] }
    : { [K in keyof T]: T[K] };
/** ---------------------------------------------------------------------------
 * * ***Options for {@link Prettify|`Prettify`}.***
 * ---------------------------------------------------------------------------
 * **Options for customizing the behavior of the {@link Prettify | **`Prettify`**} type utility.**
 */
type PrettifyOptions = {
  /** -------------------------------------------------------
   * * ***recursive***
   * -------------------------------------------------------
   * **Enables **deep prettification** of types when set to `true`.**
   * @description
   * By default (`false`), {@link Prettify | **`Prettify`**} only flattens the **top-level shape**
   * of objects and intersections. Nested objects, arrays, and tuples remain as-is
   * unless this option is enabled.
   * - ***Behavior when `true`:***
   *      - **Plain objects**: Nested intersections are expanded recursively.
   *      - **Arrays & tuples**: Each element type is recursively prettified.
   *      - **Readonly handling**: Nested properties respect the `readonlyMode` option.
   *      - **Functions, constructors, and built-in objects** (Set, Map, Date, Promise, etc.)
   *        are **not** affected or expanded.
   *      - **Nested intersections**: Combined properties are flattened recursively.
   * - ⚠️ ***Notes:***
   *      - Recursive mode only applies to **plain objects**, **arrays**, and **tuples**.
   *      - Readonly modifiers on nested properties follow the `readonlyMode` rules:
   *        - `"auto"` ➔ keep as-is
   *        - `"remove"` ➔ strip readonly
   *        - `"preserve"` ➔ make readonly
   *      - Arrays and tuples maintain `readonly` if the original type is `readonly` and `readonlyMode` is `"auto"` or `"preserve"`.
   * @default false
   * @example
   * ```ts
   * type Nested = {
   *   a: {
   *       readonly b: { c: number } & { d: string }
   *   } & { e: boolean };
   *   list: readonly ({ id: number } & { name: string })[];
   *   set: Set<{ x: number } & { y: string }>;
   * };
   *
   * // Top-level only (default)
   * type Shallow = Prettify<Nested>;
   * // ➔ {
   * //      a: { readonly b: { c: number } & { d: string } } & { e: boolean };
   * //      list: readonly ({ id: number } & { name: string })[];
   * //      set: Set<{ x: number } & { y: string }>;
   * //    }
   *
   * // Fully recursive flatten
   * type Deep = Prettify<Nested, { recursive: true }>;
   * // ➔ {
   * //      a: { readonly b: { c: number; d: string }; e: boolean };
   * //      list: readonly { id: number; name: string }[];
   * //      set: Set<{ x: number } & { y: string }>; // built-in ignored
   * //    }
   * ```
   */
  recursive?: boolean;
  /** -------------------------------------------------------
   * * ***readonlyMode***
   * -------------------------------------------------------
   * **Determines how `readonly` modifiers are applied to properties
   * when using {@link Prettify}.**
   * - **Modes:**
   *      - `"auto"` ➔ Keep `readonly` exactly as in the original type (default).
   *      - `"remove"` ➔ Remove all `readonly` modifiers.
   *      - `"preserve"` ➔ Make all properties `readonly`.
   * - **Behavior:**
   *      - Applies to both **top-level** and **nested properties** (if `recursive` is `true`).
   *      - Arrays and tuples preserve or adjust `readonly` according to the selected mode:
   *        - `"auto"` ➔ preserve array/tuple readonly as-is.
   *        - `"remove"` ➔ array/tuple becomes mutable.
   *        - `"preserve"` ➔ array/tuple becomes readonly.
   *      - Functions, constructors, and built-in objects (Set, Map, Date, Promise, etc.) are **not affected**.
   *      - Nested intersections respect `readonlyMode` recursively if `recursive` is enabled.
   * - ⚠️ ***Notes:***
   *      - For nested objects, `readonly` behavior only changes if `recursive: true`.
   *      - `readonlyMode` does **not** override `readonly` on function parameters, methods, or constructors.
   * @default "auto"
   * @example
   * ```ts
   * type T = { readonly a: number; b: string };
   *
   * // Default: auto
   * type Auto = Prettify<T, { readonlyMode: "auto" }>;
   * // ➔ { readonly a: number; b: string }
   *
   * // Remove readonly
   * type Remove = Prettify<T, { readonlyMode: "remove" }>;
   * // ➔ { a: number; b: string }
   *
   * // Force all readonly
   * type Preserve = Prettify<T, { readonlyMode: "preserve" }>;
   * // ➔ { readonly a: number; readonly b: string }
   *
   * // Recursive + preserve
   * type Nested = {
   *   config: { readonly port: number } & { host: string }
   * };
   * type RecursivePreserve = Prettify<Nested, { recursive: true; readonlyMode: "preserve" }>;
   * // ➔ { readonly config: { readonly port: number; readonly host: string } }
   * ```
   */
  readonlyMode?: Extract<"auto" | "remove" | "preserve", string>;
  /** ---------------------------------
   * * ***Skips applying the prettify transformation.***
   * ---------------------------------
   *
   * When enabled, the output will be returned as-is without running the
   * prettify step.
   *
   * @default false
   *
   */
  skipPrettify?: boolean;
};
/** -------------------------------------------------------
 * * ***DefaultPrettifyOptions***
 * -------------------------------------------------------
 * **Default options {@link Prettify | **`Prettify`**} used when no custom options are provided.**
 */
type DefaultPrettifyOptions = {
  skipPrettify: false;
  recursive: false;
  readonlyMode: "auto";
};
type MergeReadonlyIntersection<T> = T extends readonly any[]
  ? T
  : T extends object
    ? { [K in keyof T]: T[K] }
    : T;
/** -------------------------------------------------------
 * * ***Utility Type: `Prettify`.***
 * -------------------------------------------------------
 * **Flattens and simplifies complex TypeScript types into a more
 * human-readable form, by forcing the compiler to expand intersections.**
 * @description
 * By default, only the **top-level shape** of an object is flattened.
 * To also prettify **nested objects**, set the `recursive` option.
 * - ⚠️ ***Note:***
 *      - `recursive: true` only affects **plain objects** and **arrays/tuples**.
 *      - Built-in objects like `Set`, `Map`, `Date`, `Promise`, etc.
 *        will **not** be recursively prettified.
 *      - `readonly` handling is controlled via the `readonlyMode` option.
 * - **ℹ️ Options:**
 *      - `recursive?: boolean` (default: `false`):
 *        - Whether to recursively expand nested objects and intersections.
 *      - `readonlyMode?: "auto" | "remove" | "preserve"` (default: `"auto"`):
 *        - How `readonly` modifiers are treated:
 *          - `"auto"`     ➔ preserve `readonly` as-is (**default**).
 *          - `"remove"`   ➔ strip all `readonly`.
 *          - `"preserve"` ➔ enforce `readonly` everywhere.
 * @template T - The type to prettify.
 * @template Options - Configuration options.
 * @example
 * ```ts
 * // --- Top-level only (default) ---
 * type T0 = Prettify<{ a: number } & { b: string }>;
 * // ➔ { a: number; b: string }
 *
 * // --- Recursive expansion of nested objects ---
 * type T1 = Prettify<
 *   { a: { x: number } & { y: string } } & { b: boolean },
 *   { recursive: true }
 * >;
 * // ➔ { a: { x: number; y: string }; b: boolean }
 *
 * // --- Readonly handling modes ---
 * type T2 = { readonly id: number; name: string };
 *
 * type R1 = Prettify<T2>;
 * // (default: readonlyMode = "auto")
 * // ➔ { readonly id: number; name: string }
 *
 * type R2 = Prettify<T2, { readonlyMode: "remove" }>;
 * // ➔ { id: number; name: string }
 *
 * type R3 = Prettify<T2, { readonlyMode: "preserve" }>;
 * // ➔ { readonly id: number; readonly name: string }
 *
 * // --- Readonly + mutable intersection ---
 * type T3 = Prettify<{ readonly a: number } & { a: number; b: boolean }>;
 * // ➔ { a: number; b: boolean }
 * // (in "auto" mode, readonly lose over mutable)
 *
 * // --- Nested readonly with recursive ---
 * type T4 = Prettify<
 *   { config: { readonly port: number } & { host: string } },
 *   { recursive: true }
 * >;
 * // ➔ { config: { readonly port: number; host: string } }
 *
 * // --- Arrays with readonly ---
 * type T5 = Prettify<
 *   { list: readonly ({ id: number } & { name: string })[] },
 *   { recursive: true }
 * >;
 * // (readonly on array is preserved in "auto" mode)
 * // ➔ { list: readonly { id: number; name: string }[] }
 *
 * type T6 = Prettify<
 *   { list: readonly ({ id: number } & { name: string })[] },
 *   { recursive: true; readonlyMode: "remove" }
 * >;
 * // ➔ { list: { id: number; name: string }[] }
 *
 * // --- Built-in objects are ignored (not expanded) ---
 * type T7 = Prettify<
 *   { s: Set<{ a: number } & { b: string }> },
 *   { recursive: true }
 * >;
 * // ➔ { s: Set<{ a: number } & { b: string }> }
 * ```
 */
type Prettify<
  T,
  Options extends PrettifyOptions = DefaultPrettifyOptions
> = Options["skipPrettify"] extends true
  ? T
  : IsPrimitive<T> extends true
    ? T
    : IsFunction<T> extends true
      ? T
      : IsConstructor<T> extends true
        ? T
        : IsArrayOrTuple<T> extends true
          ? ApplyReadonlyMode<
              {
                [K in keyof T]: If<
                  Options["recursive"],
                  Prettify<T[K], Options>,
                  T[K]
                >;
              },
              Options["readonlyMode"]
            >
          : T extends NonPlainObject
            ? T
            : T extends object
              ? ApplyReadonlyMode<
                  MergeReadonlyIntersection<{
                    [K in keyof T]: If<
                      Options["recursive"],
                      Prettify<T[K], Options>,
                      T[K]
                    >;
                  }>,
                  Options["readonlyMode"]
                >
              : T;
/** ---------------------------------------------------------------------------
 * * ***Options for {@link Mutable | `Mutable`}.***
 * ---------------------------------------------------------------------------
 * **Configuration options for the ***{@link Mutable | **`Mutable`**}*** type utilities.**
 * @example
 * ```ts
 * type Opt1 = MutableOptions;
 * // ➔ { recursive: boolean }
 * ```
 */
type MutableOptions = {
  /** * ***Whether to make nested objects mutable recursively.***
   *
   * - **Behavior:**
   *      - If `true`, all nested objects will also have their `readonly` removed.
   *      - Default value: `false`.
   *
   * @default false
   */
  recursive: boolean;
  /** * ***Options forwarded to {@link Prettify | `Prettify`}.***
   *
   * Controls how the resulting type is **normalized or formatted**
   * after the `readonly` modifiers are removed.
   *
   * - ***This can be useful to:***
   *      - Flatten intersections.
   *      - Normalize mapped types.
   *      - Improve editor type hints.
   *
   * @default DefaultPrettifyOptions
   */
  prettifyOptions?: PrettifyOptions;
};
/** -------------------------------------------------------
 * * ***Utility Type: `Mutable`.***
 * -------------------------------------------------------
 * **Removes `readonly` from all properties of the passed type `T`.**
 * - If `Options["recursive"]` is `true`, nested objects are also made mutable.
 * @template T - The type to make mutable.
 * @template Options - Configuration options. Default:
 * `{ recursive: false, prettifyOptions: DefaultPrettifyOptions }`.
 * @example
 * ```ts
 * type Case1 = Mutable<{ readonly a: { readonly b: string } }>;
 * // ➔ { a: { b: string } } (non-recursive by default)
 * type Case2 = Mutable<{ readonly a: { readonly b: string } }, { recursive: true }>;
 * // ➔ { a: { b: string } } (nested properties also mutable)
 * ```
 */
type Mutable<
  T,
  Options extends MutableOptions = {
    recursive: false;
    prettifyOptions: DefaultPrettifyOptions;
  }
> = Prettify<{
  -readonly [K in keyof T]: And<
    Options["recursive"],
    Extends<T[K], object>
  > extends true
    ? Mutable<T[K], Options>
    : T[K];
}>;
/** -------------------------------------------------------
 * * ***Utility Type: `MutableOnly`.***
 * -------------------------------------------------------
 * **Removes `readonly` only from the specified keys `K` of type `T`.**
 * @template T - The type to modify.
 * @template K - Keys to make mutable.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * type Case1 = MutableOnly<{ readonly a: string; readonly b: string }, "a">;
 * // ➔ { a: string; readonly b: string }
 * type Case2 = MutableOnly<{ readonly a: string; readonly b: string }, "a" | "b">;
 * // ➔ { a: string; b: string }
 * ```
 */
type MutableOnly<
  T,
  K extends keyof T,
  PrettifyOptions$12 extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<
  Pick<T, Exclude<keyof T, K>> & { -readonly [P in K]: T[P] },
  PrettifyOptions$12
>;
/** -------------------------------------------------------
 * * ***Utility Type: `MutableExcept`.***
 * -------------------------------------------------------
 * **Removes `readonly` from all properties of `T` **except** the specified keys `K`.**
 * @template T - The type to modify.
 * @template K - Keys to keep as readonly.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * type Case1 = MutableExcept<{ readonly a: string; readonly b: string }, "b">;
 * // ➔ { a: string; readonly b: string }
 * type Case2 = MutableExcept<{ a: string; readonly b: string }, "a">;
 * // ➔ { a: string; b: string } (all except "a" made mutable)
 * ```
 */
type MutableExcept<
  T,
  K extends keyof T,
  PrettifyOptions$13 extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<
  Pick<T, K> & { -readonly [P in Exclude<keyof T, K>]: T[P] },
  PrettifyOptions$13
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsArray`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is an array.**
 * @example
 * type Case1 = IsArray<[]>;
 * // ➔ true
 * type Case2 = IsArray<string>;
 * // ➔ false
 */
type IsArray<T> = AndArr<
  [Not<IsAny<T>>, Not<IsNever<T>>, Extends<T, readonly unknown[]>]
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsMutableArray`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a mutable array.**
 * @example
 * type Case1 = IsMutableArray<[]>;
 * // ➔ true
 * type Case2 = IsMutableArray<readonly []>;
 * // ➔ false
 */
type IsMutableArray<T> = And<IsArray<T>, NotExtends<Readonly<T>, T>>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsReadonlyArray`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a read-only array.**
 * @example
 * type Case1 = IsReadonlyArray<readonly []>;
 * // ➔ true
 * type Case2 = IsReadonlyArray<[]>;
 * // ➔ false
 */
type IsReadonlyArray<T> = And<IsArray<T>, NotExtends<T, Mutable<T>>>;
/** -------------------------------------------------------
 * * ***Utility Type: `Mod`.***
 * -------------------------------------------------------
 * **Returns the **remainder** of the division of two numbers (`Dividend % Divisor`).**
 * - **Behavior:**
 *      - Computes the remainder using type-level arithmetic:
 *          - `Dividend - (Divisor * (Dividend / Divisor))`.
 *      - Works with integers within the range:
 *          - `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Dividend - The dividend (numerator).
 * @template Divisor - The divisor (denominator).
 * @example
 * ```ts
 * type T0 = Mod<1, 2>;  // ➔ 1
 * type T1 = Mod<1, 3>;  // ➔ 1
 * type T2 = Mod<10, 3>; // ➔ 1
 * type T3 = Mod<7, 7>;  // ➔ 0
 * ```
 */
type Mod<Dividend extends number, Divisor extends number> =
  Div<Dividend, Divisor> extends infer Quotient extends number
    ? Multi<Quotient, Divisor> extends infer Product extends number
      ? Sub<Dividend, Product>
      : never
    : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByTwo`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by two.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByTwo<4>;  // ➔ true
 * type Case2 = IsDivisibleByTwo<-6>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByTwo<3>;  // ➔ false
 * type Case4 = IsDivisibleByTwo<-5>; // ➔ false
 */
type IsDivisibleByTwo<T extends number> = IsEven<T>;
type DivisibleByThreeMap = {
  3: true;
  6: true;
  9: true;
};
type _IsDivisibleByThree<T extends number> = DigitsTuple<
  Abs<T>
>["digits"] extends infer Digits extends readonly number[]
  ? IsEqual<Digits["length"], 1> extends true
    ? Digits[0] extends keyof DivisibleByThreeMap
      ? true
      : false
    : SumArr<Digits> extends infer DigitsSum extends number
      ? IfLowerThan<DigitsSum, 3> extends true
        ? false
        : _IsDivisibleByThree<DigitsSum>
      : never
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByThree`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by three.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByThree<123>;  // ➔ true
 * type Case2 = IsDivisibleByThree<-126>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByThree<124>;  // ➔ false
 * type Case4 = IsDivisibleByThree<-128>; // ➔ false
 */
type IsDivisibleByThree<T extends number> = _IsDivisibleByThree<T>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByFive`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by five.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByFive<125>;  // ➔ true
 * type Case2 = IsDivisibleByFive<-115>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByFive<13>;  // ➔ false
 * type Case4 = IsDivisibleByFive<-17>; // ➔ false
 */
type IsDivisibleByFive<T extends number> = EndsWith<Stringify<T>, "0" | "5">;
/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleBySix`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by six.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleBySix<126>;  // ➔ true
 * type Case2 = IsDivisibleBySix<-156>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleBySix<124>;  // ➔ false
 * type Case4 = IsDivisibleBySix<-139>; // ➔ false
 */
type IsDivisibleBySix<T extends number> = And<
  IsDivisibleByTwo<T>,
  IsDivisibleByThree<T>
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByTen`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by ten.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByTen<100>; // ➔ true
 * type Case2 = IsDivisibleByTen<-80>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByTen<101>; // ➔ false
 * type Case4 = IsDivisibleByTen<-72>; // ➔ false
 */
type IsDivisibleByTen<T extends number> = EndsWith<Stringify<T>, "0">;
/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByHundred`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by hundred.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByHundred<100>;  // ➔ true
 * type Case2 = IsDivisibleByHundred<-300>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByHundred<101>;  // ➔ false
 * type Case4 = IsDivisibleByHundred<-210>; // ➔ false
 */
type IsDivisibleByHundred<T extends number> = EndsWith<Stringify<T>, "00">;
/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisible`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the first integer argument is divisible by the
 * second integer argument.**
 * @example
 * // truthy
 * type Case1 = IsDivisible<1024, 2>; // ➔ true
 * type Case2 = IsDivisible<2034, 3>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisible<1023, 2>; // ➔ false
 * type Case4 = IsDivisible<3034, 3>; // ➔ false
 */
type IsDivisible<Dividend extends number, Divisor extends number> = IsEqual<
  Mod<Dividend, Divisor>,
  0
>;
/** -------------------------------------------------------
 * * ***Utility Type: `IsLetter`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a letter (Only for letters that have both upper and lower case).**
 * @template T - The string to check.
 * @example
 * type Case1 = IsLetter<'a'>; // ➔ true
 * type Case2 = IsLetter<'1'>; // ➔ false
 */
type IsLetter<T extends string> =
  Uppercase<T> extends Lowercase<T> ? false : true;
/** -------------------------------------------------------
 * * ***Utility Type: `IsNewable`.***
 * -------------------------------------------------------
 * **Checks whether a given type `T` is a constructable (`new`) function type.**
 *
 * A *newable* type is any type that can be instantiated using the
 * `new` operator (for example, class constructors or constructor
 * signatures).
 *
 * This utility only matches **non-abstract constructors**, meaning
 * the type must be directly instantiable.
 *
 * - **Behavior:**
 *      - Evaluates to `true` if `T` has a compatible
 *        `new (...args) => instance` signature.
 *      - Optionally validates the **constructor parameter tuple**
 *        and **instance type** using the generic parameters `A` and `R`.
 *
 * - **Difference from {@link IsConstructor | `IsConstructor`}:**
 *      - `IsNewable` only returns `true` for constructors that can be
 *        instantiated with `new`.
 *      - `IsConstructor` also returns `true` for **abstract constructors**.
 *
 * @template T - The type to check.
 * @template A - Expected constructor parameter tuple (default: `any[]`).
 * @template R - Expected instance type (default: `any`).
 *
 * @example
 * ```ts
 * class A {}
 * abstract class B {}
 *
 * type T1 = IsNewable<typeof A>;
 * // ➔ true
 * type T2 = IsNewable<typeof B>;
 * // ➔ false
 * ```
 *
 * @example
 * ```ts
 * class User {
 *   constructor(x: number, y: string) {}
 * }
 *
 * type T1 = IsNewable<typeof User, [number, string], User>;
 * // ➔ true
 * type T2 = IsNewable<typeof User, [string], User>;
 * // ➔ false
 * ```
 *
 * @example
 * ```ts
 * type T1 = IsNewable<() => void>;
 * // ➔ false
 * type T2 = IsNewable<string>;
 * // ➔ false
 * ```
 */
type IsNewable<T, A extends any[] = any[], R = any> = T extends new (
  ...args: A
) => R
  ? true
  : false;
type _IsUnion<T, U = T> =
  IsNever<T> extends true
    ? false
    : T extends U
      ? Not<IsNever<Exclude<U, T>>>
      : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IsUnion`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a union.**
 * @template T - The type to check.
 * @example
 * type Case1 = IsUnion<'a' | 'b'>;
 * // ➔ true
 * type Case2 = IsUnion<'a'>;
 * // ➔ false
 */
type IsUnion<T> = _IsUnion<T, T>;
/** -------------------------------------------------------
 * * ***Utility Type: `Join`.***
 * -------------------------------------------------------
 * **Type version of `Array.prototype.join()`.**
 * - Joins the first array argument by the second argument.
 * @template T - The array to join.
 * @template Glue - The string or number to join with, defaultValue: `""`.
 * @example
 * type Case0 = Join<["p", "e", "a", "r"]>;
 * // ➔ 'pear'
 * type Case1 = Join<["a", "p", "p", "l", "e"], "-">;
 * // ➔ 'a-p-p-l-e'
 * type Case2 = Join<["2", "2", "2"], 1>;
 * // ➔ '21212'
 * type Case3 = Join<["o"], "u">;
 * // ➔ 'o'
 * type Case3 = Join<[], "n">;
 * // ➔ never
 */
type Join<
  T extends readonly (string | number)[],
  Glue extends string | number = ""
> =
  IsTuple<T> extends true
    ? T extends readonly [
        infer First extends string | number,
        ...infer Rest extends readonly (string | number)[]
      ]
      ? IfEmptyArray<Rest, First, `${First}${Glue}${Join<Rest, Glue>}`>
      : never
    : never;
/** --------------------------------------------------
 * * ***Utility Type: `AnyRecord`.***
 * --------------------------------------------------
 * **Represents an object with arbitrary string keys and values of **any** type.**
 * - ⚠️ **Use with caution — `any`** disables type safety.
 *      - Prefer stricter like {@link UnknownRecord | **`UnknownRecord`**} typing when possible.
 * - ✅ Commonly used as a fallback for flexible key-value structures
 *      such as query parameters, configuration maps, or JSON-like data.
 * @example
 * ```ts
 * const config: AnyRecord = {
 *   mode: "dark",
 *   retries: 3,
 *   debug: true,
 * };
 * ```
 */
type AnyRecord = Record<string, any>;
/** --------------------------------------------------
 * * ***Utility Type: `UnknownRecord`.***
 * --------------------------------------------------
 * **Represents an object with arbitrary string keys and values of **unknown** type.**
 * - ✅ Safer alternative to `AnyRecord` — forces explicit type narrowing
 *   before values can be used, maintaining type safety.
 * - ✅ Suitable for working with untyped external data sources
 *   (e.g., JSON APIs, parsed configs) where values must be validated first.
 * @example
 * ```ts
 * const data: UnknownRecord = JSON.parse("{}");
 *
 * // Must narrow the type before usage
 * if (typeof data.id === "string") {
 *   console.log(data.id.toUpperCase());
 * }
 *
 * // Or:
 * const unknownObject: UnknownRecord = {
 *   mode: "dark",
 *   retries: 3,
 *   debug: true,
 * };
 * ```
 */
type UnknownRecord = Record<string, unknown>;
/** -------------------------------------------------------
 * * ***Utility Type: `AnyStringRecord`.***
 * -------------------------------------------------------
 * **Same as **{@link AnyString | **`AnyString`**}** but uses `Record<never, never>` as the intersection.**
 * - This approach is often more reliable in preserving literal types
 *   in generic inference scenarios.
 * @example
 * ```ts
 * declare function acceptsAnyStringRecord<T extends AnyStringRecord>(value: T): T;
 *
 * const a = acceptsAnyStringRecord("hello");
 * // ➔ "hello"
 *
 * const b = acceptsAnyStringRecord(String("world"));
 * // ➔ string
 * ```
 */
type AnyStringRecord = Record<never, never> & string;
/** -------------------------------------------------------
 * * ***Utility Type: `LooseLiteral`.***
 * -------------------------------------------------------
 * **Improves the autocompletion and inference of **loose literal types**.**
 * @description
 * Ensures that specified literal types are preserved while still
 * allowing assignment of a broader base type.
 * - **Useful in scenarios where:**
 *      - You want to accept **specific literal values** but still allow
 *        any value of a base type (like `string` or `number`).
 *      - You want stricter typing in generics while preserving literals.
 * @template Literal - The literal type(s) to preserve.
 * @template BaseType - The base type to extend when not matching literal.
 * @example
 * ```ts
 * type T0 = LooseLiteral<"a" | "b" | "c", string>;
 * // ➔ "a" | "b" | "c" | (string & {})
 *
 * declare function acceptsLoose<T extends LooseLiteral<"x" | "y", string>>(value: T): T;
 * const a = acceptsLoose("x");
 * // ➔ "x"
 * const b = acceptsLoose("any string");
 * // ➔ string
 * ```
 */
type LooseLiteral<Literal, BaseType> = Literal | (BaseType & AnyStringRecord);
/** -------------------------------------------------------
 * * ***Utility Type: `Max`.***
 * -------------------------------------------------------
 * **Accepts two integers and returns the **maximum** among them.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - First integer to compare.
 * @template Num2 - Second integer to compare.
 * @example
 * ```ts
 * type Case1 = Max<1, 10>;  // ➔ 10
 * type Case2 = Max<1, -10>; // ➔ 1
 * ```
 */
type Max<Num1 extends number, Num2 extends number> = IfLowerThan<
  Num1,
  Num2,
  Num2,
  Num1
>;
/** * ***Recursively computes the maximum number in a tuple of integers.***
 *
 * @private ***Private internal type for {@link MaxArr | **`MaxArr`**}.***
 * @template T - Tuple of numbers to process.
 * @template CurrentMax - Current maximum value, defaults to the first element of T.
 */
type _MaxArr<
  T extends readonly number[],
  CurrentMax extends number = ReturnItselfIfNotExtends<T[0], undefined, never>
> =
  IsEmptyArray<T> extends true
    ? CurrentMax
    : Shift<
          T,
          {
            includeRemoved: true;
          }
        > extends [infer Rest extends number[], infer First extends number]
      ? _MaxArr<Rest, Max<First, CurrentMax>>
      : never;
/** -------------------------------------------------------
 * * ***Utility Type: `MaxArr`.***
 * -------------------------------------------------------
 * **Accepts a tuple of integers and returns the **maximum** among its elements.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template T - Tuple of numbers to evaluate.
 * - Only tuples are supported; arrays of unknown length will return `never`.
 * @example
 * ```ts
 * type Case1 = MaxArr<[1, 2, 4, 10]>; // ➔ 10
 * type Case2 = MaxArr<[-1, 4, -10]>;  // ➔ 4
 * type Case3 = MaxArr<number[]>;      // ➔ never (not a tuple)
 * ```
 */
type MaxArr<T extends readonly number[]> =
  IsTuple<T> extends true ? _MaxArr<T> : never;
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
type DeepMergeArrayUnion<T extends any[]> = T extends (infer U)[]
  ? U extends any[]
    ? DeepMergeArrayUnionHelper<U>[]
    : U[]
  : never;
type DeepMergeArrayUnionHelper<T> = T extends (infer U)[]
  ? DeepMergeArrayUnionHelper<U> | Exclude<T, any[]>
  : T;
/** -------------------------------------------------------
 * * ***Utility Type: `Min`.***
 * -------------------------------------------------------
 * **Accepts two integers and returns the **minimum** among them.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template Num1 - First integer.
 * @template Num2 - Second integer.
 * @example
 * ```ts
 * type Case1 = Min<1, 10>;  // ➔ 1
 * type Case2 = Min<1, -10>; // ➔ -10
 * ```
 */
type Min<Num1 extends number, Num2 extends number> = IfLowerThan<
  Num1,
  Num2,
  Num1,
  Num2
>;
/** * ***Helper type for computing the minimum of a tuple of numbers recursively.***
 *
 * @private ***Private internal type for {@link MinArr | **`MinArr`**}.***
 * @template T - Array of numbers
 * @template CurrentMin - Current minimum in recursion
 */
type _MinArr<
  T extends readonly number[],
  CurrentMin extends number = ReturnItselfIfNotExtends<T[0], undefined, never>
> =
  IsEmptyArray<T> extends true
    ? CurrentMin
    : Shift<
          T,
          {
            includeRemoved: true;
          }
        > extends [infer Rest extends number[], infer First extends number]
      ? _MinArr<Rest, Min<First, CurrentMin>>
      : never;
/** -------------------------------------------------------
 * * ***Utility Type: `MinArr`.***
 * -------------------------------------------------------
 * **Accepts an array of integers and returns the **minimum** among its elements.**
 * - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @template T - Tuple of numbers.
 * @example
 * ```ts
 * type Case1 = MinArr<[1, 2, 4, 10]>; // ➔ 1
 * type Case2 = MinArr<[-1, 4, -10]>;  // ➔ -10
 * ```
 */
type MinArr<T extends readonly number[]> =
  IsTuple<T> extends true ? _MinArr<T> : never;
/** --------------------------------------------------
 * * ***Utility Type: `Nullish`.***
 * --------------------------------------------------
 * **Useful as a shorthand when working with optional or missing values.**
 * - **Represents all values considered **`nullish`**:**
 *      - `null`
 *      - `undefined`
 */
type Nullish = null | undefined;
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
type Nullable<T> = T | null;
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
type Nilable<T> = T | null | undefined;
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
type Undefinedable<T> = T | undefined;
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
type NonNil<T> = T extends null | undefined ? never : T;
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
type NonNull<T> = T extends null ? never : T;
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
type NonUndefined<T> = T extends undefined ? never : T;
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
type KeepNil<T> =
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
type KeepNull<T> = null extends T ? null : never;
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
type KeepUndef<T> = undefined extends T ? undefined : never;
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
type NullToUndefined<T> = T extends null
  ? undefined
  : T extends undefined
    ? undefined
    : T;
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
type NonNullableObject<T> = { [K in keyof T]: NonNullable<T[K]> };
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
type NonNullableObjectOnly<
  T,
  K extends keyof T,
  PrettifyOptions$10 extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<
  Pick<T, Exclude<keyof T, K>> & { [P in K]: NonNullable<T[P]> },
  PrettifyOptions$10
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
type NonNullableObjectExcept<
  T,
  K extends keyof T,
  PrettifyOptions$11 extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<
  Pick<T, K> & { [P in Exclude<keyof T, K>]: NonNullable<T[P]> },
  PrettifyOptions$11
>;
/** --------------------------------------------------
 * * ***Internal Utility Type for: {@link NumberRangeUnion | `NumberRangeUnion`}.***
 * --------------------------------------------------
 * @template N - Starting/Ending number of the range (inclusive).
 * @template Acc - Internal accumulator for recursion (do not set manually).
 */
type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;
/** --------------------------------------------------
 * * ***Utility Type: `NumberRangeUnion`.***
 * --------------------------------------------------
 * **Generate a union type of numbers from `From` to `To` using enumeration.**
 * @description
 * Produces a **numeric union type** from `From` to `To` (inclusive),
 * using a simpler approach based on `Enumerate<N>` helper type.
 * - ✅ Straightforward & easy to reason about.
 * - ⚠️ Still limited by TypeScript recursion depth (safe up to `999`).
 * - ⚙️ Best used for **smaller ranges** (`≤ 100`) or when readability matters.
 * - ℹ️ For **larger ranges** (`≥ 101`) use {@link NumberRangeLimit | `NumberRangeLimit`} instead.
 * @template From - Starting number of the range (inclusive).
 * @template To - Ending number of the range (inclusive).
 * @example
 * ```ts
 * type RangeA = NumberRangeUnion<3, 6>;
 * // ➔ 3 | 4 | 5 | 6
 * type RangeB = NumberRangeUnion<0, 2>;
 * // ➔ 0 | 1 | 2
 * type RangeC = NumberRangeUnion<8, 8>;
 * // ➔ 8
 * type RangeD = NumberRangeUnion<20, 10>;
 * // ➔ 10
 * ```
 */
type NumberRangeUnion<From extends number, To extends number> = From extends To
  ? From
  : Exclude<Enumerate<To>, Enumerate<From>> extends never
    ? To
    : Exclude<Enumerate<To>, Enumerate<From>> | To;
/** --------------------------------------------------
 * * ***Internal Utility Type for: {@link NumberRangeLimit | `NumberRangeLimit`}.***
 * --------------------------------------------------
 * @template From - Starting number of the range (inclusive).
 * @template To - Ending number of the range (inclusive).
 * @template Result - Internal accumulator for recursion (do not set manually).
 */
type _NumberRangeLimit<
  From extends number,
  To extends number,
  Result extends number[] = [From]
> =
  IsGreaterThan<From, To> extends true
    ? [...Result, To][number] extends infer R extends number
      ? R extends R
        ? IsGreaterThan<R, To> extends true
          ? never
          : R
        : never
      : never
    : _NumberRangeLimit<
        Sum<From, 7>,
        To,
        [
          ...Result,
          From,
          Sum<From, 1>,
          Sum<From, 2>,
          Sum<From, 3>,
          Sum<From, 4>,
          Sum<From, 5>,
          Sum<From, 6>
        ]
      >;
/** --------------------------------------------------
 * * ***Utility Type: `NumberRangeLimit`.***
 * --------------------------------------------------
 * **Generate a union type of numbers within a specified range (optimized recursive batching).**
 * @description
 * Produces a **numeric union type** from `From` to `To` (inclusive),
 * using ***batched recursive expansion*** (**adds up to `7` numbers at a time**).
 *
 * This batching allows generating **larger ranges** (`≥ 101`) efficiently without
 * hitting TypeScript’s recursion limits too quickly.
 * - ✅ Optimized for **performance** (fewer recursive steps).
 * - ⚠️ Supports up to `To = 999` safely.
 * - ⚙️ Best used for **larger ranges** (`≥ 101`) or when you need **arbitrary ranges** within `0–999`.
 * - ℹ️ For **smaller ranges** (`≤ 100`) or when readability matters use {@link NumberRangeUnion | **`NumberRangeUnion`**} instead.
 * @template From - Starting number of the range (inclusive).
 * @template To - Ending number of the range (inclusive).
 * @example
 * ```ts
 * type RangeA = NumberRangeLimit<5, 8>;
 * // ➔ 5 | 6 | 7 | 8
 * type RangeB = NumberRangeLimit<10, 15>;
 * // ➔ 10 | 11 | 12 | 13 | 14 | 15
 * type RangeC = NumberRangeLimit<8, 8>;
 * // ➔ 8
 * type RangeD = NumberRangeLimit<20, 10>;
 * // ➔ 10
 * ```
 */
type NumberRangeLimit<
  From extends number,
  To extends number
> = _NumberRangeLimit<From, To>;
/** --------------------------------------------------
 * * ***Utility Type: `OmitStrict`.***
 * --------------------------------------------------
 * **Strictly omits keys `K` from type `T`, with optional flattening for readability using `Prettify`.**
 * - **Behavior:**
 *      - ✅ Enhances autocomplete and type inspection clarity in editors.
 *      - ✅ Optionally flattens nested intersections or mapped types into a cleaner shape.
 * @template T - The original object type.
 * @template K - The keys to omit from `T`.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * type A = { a: number; b: string; c: boolean };
 * type B = OmitStrict<A, 'b'>;
 * // ➔ { a: number; c: boolean }
 *
 * type C = OmitStrict<A, 'b', { skipPrettify: true }>;
 * // ➔ Omit without prettifying, keeps intersection structure
 *
 * type D = OmitStrict<A, 'b', true, { recursive: false }>;
 * // ➔ Prettifies only top level, does not recurse into nested objects
 * ```
 */
type OmitStrict<
  T,
  K extends keyof T,
  PrettifyOptions$9 extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<Omit<T, K>, PrettifyOptions$9>;
/** ----------------------------------------------------------------
 * * ***Options for {@link OverrideTypes | `OverrideTypes`}.***
 * ----------------------------------------------------------------
 * Configuration options controlling how overriding behaves.
 */
type OverrideTypesOptions = {
  /** * ***Whether overriding keys must exist in the base type `T`.***
   *
   * - If `true`, all keys of `U` must exist in `T`.
   * - If `false`, additional keys from `U` are allowed and will be added
   *   to the resulting type.
   *
   * @default true
   */
  strictKeys: boolean;
  /** * ***Options forwarded to {@link Prettify | `Prettify`}.***
   *
   * Controls how the resulting type is normalized.
   */
  prettifyOptions?: PrettifyOptions;
};
type StrictOverrideConstraint<
  T,
  U,
  Strict extends boolean
> = Strict extends true
  ? { [K in keyof U]: K extends keyof T ? unknown : never }
  : unknown;
type ResolvePrettifyOptions<O extends OverrideTypesOptions> =
  O["prettifyOptions"] extends PrettifyOptions
    ? O["prettifyOptions"]
    : DefaultPrettifyOptions;
/** --------------------------------------------------
 * * ***Utility Type: `OverrideTypes`.***
 * --------------------------------------------------
 * Overrides properties in type `T` using properties from type `U`.
 *
 * Keys that exist in both `T` and `U` will take the value type from `U`,
 * while all other properties from `T` remain unchanged.
 *
 * The behavior can be configured using {@link OverrideTypesOptions}.
 *
 * @template T - The base object type whose properties will be overridden.
 * @template U - The object type providing overriding property types.
 * @template Options - Configuration controlling override behavior.
 *
 * @remarks
 * - When `Options["strictKeys"]` is `true` (default), all keys in `U`
 *   **must already exist in `T`**.
 * - When `strictKeys` is `false`, `U` may introduce **additional keys**
 *   which will be added to the resulting type.
 * - The resulting type is normalized using {@link Prettify}.
 *
 * @example
 * // Basic override
 * type A = { a: number; b: string };
 * type B = { b: boolean };
 * type C = OverrideTypes<A, B>;
 * // Result:
 * // {
 * //   a: number;
 * //   b: boolean;
 * // }
 *
 * @example
 * // Strict key enforcement (default)
 * type A = { a: number; b: string };
 * type B = { x: string[]; b: boolean };
 * // @ts-expect-error
 * type C = OverrideTypes<A, B>;
 * // Error: "x" is not assignable to keyof A
 *
 * @example
 * // Allow additional keys
 * type A = { a: number; b: string };
 * type B = { x: string[]; b: boolean };
 * type C = OverrideTypes<A, B, { strictKeys: false }>;
 * // Result:
 * // {
 * //   a: number;
 * //   b: boolean;
 * //   x: string[];
 * // }
 *
 * @example
 * // Custom Prettify options
 * type A = { a: number; b: string };
 * type B = { b: boolean };
 * type C = OverrideTypes<
 *   A,
 *   B,
 *   {
 *     strictKeys: true;
 *     prettifyOptions: { skipPrettify: true };
 *   }
 * >;
 */
type OverrideTypes<
  T,
  U extends StrictOverrideConstraint<T, U, Options["strictKeys"]>,
  Options extends OverrideTypesOptions = {
    strictKeys: true;
    prettifyOptions: DefaultPrettifyOptions;
  }
> = Options["strictKeys"] extends true
  ? Exclude<keyof U, keyof T> extends never
    ? Prettify<
        OmitStrict<
          T,
          Extract<keyof U, keyof T>,
          ResolvePrettifyOptions<Options>
        > &
          U,
        ResolvePrettifyOptions<Options>
      >
    : never
  : Prettify<
      OmitStrict<
        T,
        Extract<keyof U, keyof T>,
        ResolvePrettifyOptions<Options>
      > & { [K in keyof U]: U[K] },
      ResolvePrettifyOptions<Options>
    >;
type _IsPalindrome<T extends string> =
  IsEmptyString<T> extends true
    ? true
    : Not<IsStringLiteral<T>> extends true
      ? false
      : T extends `${infer First extends string}${infer Rest extends string}`
        ? IsEmptyString<Rest> extends true
          ? true
          : Rest extends `${infer NewRest extends string}${First}`
            ? _IsPalindrome<NewRest>
            : false
        : false;
/** -------------------------------------------------------
 * * ***Utility Type: `IsPalindrome`.***
 * -------------------------------------------------------
 * **Determines if a string or number is a **palindrome** at type-level.
 * A palindrome reads the same forwards and backwards (e.g., `"racecar"`).**
 * @template T - A string or number to check.
 * @example
 * ```ts
 * type T0 = IsPalindrome<"racecar">; // true
 * type T1 = IsPalindrome<"hello">;   // false
 * type T2 = IsPalindrome<12321>;     // true
 * type T3 = IsPalindrome<12345>;     // false
 * ```
 * @remarks
 * - Converts numbers to strings using {@link Stringify | **`Stringify`**}.
 * - Uses {@link IsEmptyString | **`IsEmptyString`**},
 *   {@link IsStringLiteral | **`IsStringLiteral`**},
 *   and {@link Not | **`Not`**} for type-level logic.
 * - Returns `true` if the input is a palindrome, otherwise `false`.
 */
type IsPalindrome<T extends string | number> = _IsPalindrome<Stringify<T>>;
/** -------------------------------------------------------
 * * ***Utility Type: `UnionToIntersection`.***
 * -------------------------------------------------------
 * **Converts a union type into an **intersection**.**
 * @description
 * 📖 Reference: ***[`StackOverflow`](https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286).***
 * @template U - The union type to be converted.
 * @example
 * ```ts
 * type A = UnionToIntersection<{ a: string } | { b: number }>;
 * // ➔ { a: string } & { b: number }
 * type B = UnionToIntersection<
 *   { a: string } | { b: number } | { c: boolean }
 * >;
 * // ➔ { a: string } & { b: number } & { c: boolean }
 * ```
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
/** -------------------------------------------------------
 * * ***Utility Type: `PrettifyUnionIntersection`.***
 * -------------------------------------------------------
 * **Converts a union type into an **intersection** using ***{@link UnionToIntersection | `UnionToIntersection`}***, and then
 * applies ***{@link Prettify | `Prettify`}*** to simplify the resulting intersection
 * for better readability in IntelliSense and tooltips.**
 * @description
 * Useful when the raw intersection of union types produces
 * deeply nested or hard-to-read structures.
 * @template T - The union type to be converted.
 * @template Options - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * // Basic union ➔ intersection
 * type A = { a: string } | { b: number };
 * type B = PrettifyUnionIntersection<A>;
 * // ➔ { a: string } & { b: number }
 * // final result become ➔ { a: string b: number }
 *
 * // Larger union
 * type C = { a: string } | { b: number } | { c: boolean };
 * type D = PrettifyUnionIntersection<C>;
 * // ➔ { a: string } & { b: number } & { c: boolean }
 * // final result become ➔ { a: string b: number c: boolean }
 *
 * // With PrettifyOptions (custom formatting)
 * type E = PrettifyUnionIntersection<A, { recursive: true }>;
 * ```
 */
type PrettifyUnionIntersection<
  T,
  Options extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<UnionToIntersection<T>, Options>;
/** Internal Helper */
/** Get optional keys of an object */
type OptionalKeys<T> = {
  [P in keyof T]-?: {} extends Pick<T, P> ? P : never;
}[keyof T];
/** Get required keys of an object */
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
/** Remove duplicate `undefined` from unions */
type CleanOptional$1<T> = [T] extends [undefined]
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
type PartialOnly<
  T extends object,
  K extends keyof T | AnyString,
  PrettifyOptions$7 extends PrettifyOptions = DefaultPrettifyOptions
> =
  IsNever<K> extends true
    ? T
    : PrettifyUnionIntersection<
        { [P in Exclude<RequiredKeys<T>, Extract<keyof T, K>>]-?: T[P] } & {
          [P in Exclude<
            OptionalKeys<T>,
            Extract<keyof T, K>
          >]+?: CleanOptional$1<T[P]>;
        } & { [P in Extract<keyof T, K>]+?: CleanOptional$1<T[P]> },
        PrettifyOptions$7
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
type PartialExcept<
  T extends object,
  K extends keyof T | AnyString,
  PrettifyOptions$8 extends PrettifyOptions = DefaultPrettifyOptions
> =
  IsNever<K> extends true
    ? Partial<T>
    : PrettifyUnionIntersection<
        Identity<
          {
            [P in RequiredKeysOf<
              Identity<
                Pick<T, Extract<keyof T, K>> & {
                  [P in Exclude<keyof T, K>]?: T[P];
                }
              >
            >]-?: CleanOptional$1<
              Identity<
                Pick<T, Extract<keyof T, K>> & {
                  [P in Exclude<keyof T, K>]?: T[P];
                }
              >[P]
            >;
          } & {
            [P in OptionalKeys<
              Identity<
                Pick<T, Extract<keyof T, K>> & {
                  [P in Exclude<keyof T, K>]?: T[P];
                }
              >
            >]+?: CleanOptional$1<
              Identity<
                Pick<T, Extract<keyof T, K>> & {
                  [P in Exclude<keyof T, K>]?: T[P];
                }
              >[P]
            >;
          }
        >,
        PrettifyOptions$8
      >;
/** -------------------------------------------------------
 * * ***Utility Type: `ValueOf`.***
 * -------------------------------------------------------
 * **Gets the types of all property values in an object `T`.**
 * @template T - The object type.
 * @example
 * ```ts
 * type Case1 = ValueOf<{ a: string, b: number }>;
 * // ➔ string | number
 * ```
 */
type ValueOf<T> = T[keyof T];
/** -------------------------------------------------------
 * * ***Utility Type: `ValueOfOnly`.***
 * -------------------------------------------------------
 * **Gets the types of properties in object `T` specified by `K`.**
 * @template T - The object type.
 * @template K - Keys of `T` to extract values from.
 * @example
 * ```ts
 * type Case1 = ValueOfOnly<{ a: string, b: number }, "a">;
 * // ➔ string
 * ```
 */
type ValueOfOnly<T, K extends keyof T> = T[K];
/** -------------------------------------------------------
 * * ***Utility Type: `ValueOfExcept`.***
 * -------------------------------------------------------
 * **Gets the types of properties in object `T` **except** for keys in `K`.**
 * @template T - The object type.
 * @template K - Keys of `T` to exclude.
 * @example
 * ```ts
 * type Case1 = ValueOfExcept<{ a: string, b: number }, "a">;
 * // ➔ number
 * ```
 */
type ValueOfExcept<T, K extends keyof T> = T[keyof Omit<T, K>];
/** -------------------------------------------------------
 * * ***Utility Type: `ValueOfArray`.***
 * -------------------------------------------------------
 * **Gets the types of elements in a tuple or array `T`.**
 * @template T - The tuple or array type.
 * @example
 * ```ts
 * type Case1 = ValueOfArray<[string, number]>;
 * // ➔ string | number
 * ```
 */
type ValueOfArray<T extends readonly unknown[]> = T[number];
/** -------------------------------------------------------
 * * ***Utility Type: `OverWritable`.***
 * -------------------------------------------------------
 * **Option type to signal that some properties can be overwritten when
 * applying default options.**
 * @property overwriteDefault - If true, all options in the passed `Options`
 *   object will **overwrite** defaults, even if rules say otherwise.
 */
type OverWritable = {
  /** If true, all options in the passed `Options` object will **overwrite** defaults, even if rules say otherwise, defaultValue: `false`.
   *
   * @default false
   */
  overwriteDefault?: boolean;
};
/** -------------------------------------------------------
 * * ***Utility Type: `ApplyDefaultOptions`.***
 * -------------------------------------------------------
 * **Type-level utility that merges a user-specified `Options` object
 * with a `DefaultOptions` object using a set of `OverwriteRules`.**
 * @template BaseOptions - The base type of all options.
 * @template Options - User-specified options that may override defaults.
 * @template DefaultOptions - Default values for options.
 * @template OverwriteRules - A mapping that indicates which keys
 *   should always allow overwriting defaults.
 * @template OverwriteDefault - If true, all options in `Options`
 *   overwrite defaults regardless of rules.
 * @remarks
 * - Recursively applies defaults for nested objects.
 * - Only objects that are non-nullable and non-unknown are recursively merged.
 * - If a property is **not an object** or recursion is not needed,
 *   it either takes the value from `Options` or merges `Options[K] | DefaultOptions[K]`.
 * - Helps safely build strongly typed configuration objects with defaults.
 * @example
 * ```ts
 * type Base = {
 *   a: { x: number; y: string };
 *   b: boolean;
 * };
 *
 * type Defaults = {
 *   a: { x: 1; y: "default" };
 *   b: true;
 * };
 *
 * type UserOptions = {
 *   a: { y: "custom" };
 * };
 *
 * type Result = ApplyDefaultOptions<Base, UserOptions, Defaults, { a: true; b: false }>;
 * // Result: {
 * //   a: { x: 1; y: "custom"; tra: "test" };
 * //   b: boolean;
 * // }
 * ```
 */
type ApplyDefaultOptions<
  BaseOptions,
  Options extends BaseOptions,
  DefaultOptions extends BaseOptions,
  OverwriteRules,
  OverwriteDefault extends boolean = false
> = Prettify<{
  [K in keyof BaseOptions]-?: K extends keyof Options
    ? AndArr<
        [
          Extends<NonNullable<BaseOptions[K]>, object>,
          Not<IsNever<DefaultOptions[K]>>,
          Not<IsUnknown<BaseOptions[K]>>
        ]
      > extends true
      ? ApplyDefaultOptions<
          NonNullable<BaseOptions[K]>,
          Extract<Options[K], NonNullable<BaseOptions[K]>>,
          Extract<DefaultOptions[K], NonNullable<BaseOptions[K]>>,
          OverwriteRules[K & keyof OverwriteRules],
          OverwriteDefault
        > & {
          tra: "test";
        }
      : Or<
            IsEqual<OverwriteDefault, true>,
            And<
              Extends<K, keyof OverwriteRules>,
              Extends<OverwriteRules[K & keyof OverwriteRules], true>
            >
          > extends true
        ? Options[K]
        : Options[K] | DefaultOptions[K]
    : DefaultOptions[K];
}>;
/** --------------------------------------------------------------
 * * ***Options for {@link PathToFields | **`PathToFields`**} type-level utility.***
 * --------------------------------------------------------------
 * @template ignoredTypes - Types to ignore completely.
 * @template stopTypes - Types at which recursion stops and returns `[]`.
 * @template limit - Max recursion depth.
 * @template format - Output format, `"dot"` or `"array"`.
 * @template ignoredKeys - Keys to ignore when generating paths.
 * @template arrayIndexing - Options for handling array paths.
 */
type PathToFieldsOptions = Prettify<
  OverWritable & {
    /** Types to ignored completely (default: `undefined`).
     *
     * @default undefined
     */
    ignoredTypes?: unknown;
    /** Types at which recursion stops (default: `undefined`).
     *
     * @default undefined
     */
    stopTypes?: unknown;
    /** Max recursion depth (default: `10`).
     *
     * @default 10
     */
    limit?: number;
    /** Format Output Options:
     * - `"dot"` ➔ dot-notation strings, default output (`"a.b.c"`).
     * - `"array"` ➔ array of path segments (`["a", "b", "c"]`).
     *
     * @default "dot"
     */
    format?: "dot" | "array";
    /** Keys to skip when generating paths (default: `undefined`).
     *
     * @default undefined
     */
    ignoredKeys?: PropertyKey;
    /** Options for array Indexing (default: `{ exactIndexes: false }`).
     *
     * When `arrayIndexing.exactIndexes = true` ➔ outputs exact tuple indexes (`"arr.0"`), otherwise generic `"arr.${number}"`.
     * @default undefined
     */
    arrayIndexing?: {
      /** Options for array Exact Indexing (default: `false`).
       *
       * When `exactIndexes = true` ➔ outputs exact tuple indexes (`"arr.0"`), otherwise generic `"arr.${number}"`.
       * - For increase limit indexing, you can set `limit` options, default
       *   limit is: `10`.
       * @default false
       */
      exactIndexes: boolean;
    };
  },
  {
    recursive: true;
  }
>;
/** * ***Default options for {@link PathToFields}.*** */
type DefaultPathToFieldsOptions = {
  ignoredTypes: never;
  stopTypes: string | number | boolean | symbol | Date | AnyFunction;
  format: "dot";
  limit: 10;
  ignoredKeys: never;
  arrayIndexing: {
    exactIndexes: false;
  };
};
type OverwriteRules = {
  limit: true;
  format: true;
  arrayIndexing: {
    exactIndexes: true;
  };
};
type Booleanize<T> = T extends true ? true : false;
type _PathToFieldsArray<
  T extends readonly unknown[],
  Options extends PathToFieldsOptions,
  Iteration extends number = 0
> =
  And<
    IsTuple<T>,
    IsEqual<
      Booleanize<
        Options["arrayIndexing"] extends {
          exactIndexes: infer E;
        }
          ? E
          : false
      >,
      true
    >
  > extends true
    ? ValueOfArray<{
        [K in keyof T]: IsArrayIndex<K> extends true
          ? [K, ..._PathToFields<T[K], Options, Increment<Iteration>>]
          : never;
      }>
    : ArrayElementType<T> extends infer ElementType
      ? [
          `${number}`,
          ...(ElementType extends ElementType
            ? _PathToFields<ElementType, Options, Increment<Iteration>>
            : never)
        ]
      : never;
type _PathToFields<
  T,
  Options extends PathToFieldsOptions,
  Iteration extends number = 0
> = T extends Options["ignoredTypes"]
  ? never
  : T extends Options["stopTypes"]
    ? []
    : IsEqual<Iteration, Options["limit"]> extends true
      ? never
      : T extends readonly unknown[]
        ? _PathToFieldsArray<T, Options, Iteration>
        : ValueOf<{
            [K in Exclude<
              keyof T,
              symbol | Options["ignoredKeys"]
            >]: NonNullable<T[K]> extends infer NonNullableFields
              ? NonNullableFields extends readonly unknown[]
                ? [
                    K,
                    ..._PathToFieldsArray<NonNullableFields, Options, Iteration>
                  ]
                : [
                    K,
                    ..._PathToFields<
                      NonNullableFields,
                      Options,
                      Increment<Iteration>
                    >
                  ]
              : never;
          }>;
/** -------------------------------------------------------
 * * ***Utility Type: `PathToFields`.***
 * -------------------------------------------------------
 * **Generates **all possible property paths** within a type `T`.
 * Supports nested objects, arrays, tuples, and optional configuration.**
 * @template T - Object type to extract paths from.
 * @template Options - Optional configuration.
 * @example
 * ```ts
 * // Nested object
 * type T1 = PathToFields<{ a: { b: { c: number } } }>;
 * // Result: "a.b.c"
 *
 * // Array of objects (dot notation, default)
 * type T2 = PathToFields<{ arr: { id: string; value: number }[] }>;
 * // Result: "arr.${number}.id" | "arr.${number}.value"
 *
 * // Output format as array of path segments
 * type T4 = PathToFields<
 *   { user: { profile: { name: string } } },
 *   { format: "array" }
 * >;
 * // Result: ["user", "profile", "name"]
 *
 * // Ignoring specific keys
 * type T5 = PathToFields<
 *   { id: string; password: string; profile: { bio: string } },
 *   { ignoredKeys: "password" }
 * >;
 * // Result: "id" | "profile.bio"
 *
 * // Stopping recursion at specific types
 * type T6 = PathToFields<
 *   { settings: Date; nested: { inner: number } },
 *   { stopTypes: Date }
 * >;
 * // Result: "settings" | "nested.inner"
 * ```
 * @remarks
 * - `Options.format = "dot"` ➔ dot-notation strings, default output (`"a.b.c"`).
 * - `Options.format = "array"` ➔ array of path segments (`["a", "b", "c"]`).
 * - `Options.limit` ➔ max recursion depth (default 10).
 * - `Options.stopTypes` ➔ types at which recursion stops.
 * - `Options.ignoredTypes` ➔ types ignored completely.
 * - `Options.ignoredKeys` ➔ keys to skip when generating paths.
 * - `Options.arrayIndexing.exactIndexes = true` ➔ outputs exact tuple indexes (`"arr.0"`), otherwise generic `"arr.${number}"`.
 */
type PathToFields<T, Options extends PathToFieldsOptions = never> = (
  IsNever<Options> extends true
    ? DefaultPathToFieldsOptions
    : ApplyDefaultOptions<
        Omit<PathToFieldsOptions, keyof OverWritable>,
        Options,
        DefaultPathToFieldsOptions,
        OverwriteRules,
        PathToFieldsOptions["overwriteDefault"] extends boolean
          ? PathToFieldsOptions["overwriteDefault"]
          : false
      >
) extends infer MergedOptions extends PathToFieldsOptions
  ? _PathToFields<T, MergedOptions> extends infer Paths extends readonly (
      | string
      | number
    )[]
    ? IsEqual<MergedOptions["format"], "dot"> extends true
      ? Paths extends Paths
        ? Join<Paths, ".">
        : never
      : Paths
    : never
  : never;
/** --------------------------------------------------
 * * ***Utility Type: `PickStrict`.***
 * --------------------------------------------------
 * **Utility type that behaves exactly like the native `Pick<T, K>`,
 * but can help with type inference and IDE autocomplete in stricter scenarios.**
 * @template T - The base object type.
 * @template K - The keys from `T` to be picked.
 * @example
 * ```ts
 * type A = { a: number; b: string; c: boolean };
 * type B = PickStrict<A, 'a' | 'c'>;
 * // ➔ { a: number; c: boolean }
 * ```
 */
type PickStrict<T, K extends keyof T> = Pick<T, K>;
type _Pow<
  Num extends number,
  Factor extends number,
  CurrentProduct extends number = 1,
  Iteration extends unknown[] = []
> =
  IsEqual<Iteration["length"], Factor> extends true
    ? CurrentProduct
    : _Pow<Num, Factor, Multi<CurrentProduct, Num>, Push<Iteration, unknown>>;
/** -------------------------------------------------------
 * * ***Utility Type: `Pow`.***
 * -------------------------------------------------------
 * **Returns a type-level **exponentiation** result:**
 *    - Raises the first integer parameter (`Num`) to the power of the second
 *      integer parameter (`Factor`).
 * @template Num - The base number (integer).
 * @template Factor - The exponent number (integer, >= 0).
 * @example
 * ```ts
 * type Case1 = Pow<10, 2>
 * // ➔ 100
 * type Case2 = Pow<5, 0>
 * // ➔ 1
 * type Case3 = Pow<2, 3>
 * // ➔ 8
 * ```
 */
type Pow<Num extends number, Factor extends number> = _Pow<Num, Factor>;
/** --------------------------------------------------
 * * ***Utility Type: `Awaitable`.***
 * --------------------------------------------------
 * **Represents a type that can be awaited:**
 *   - Either a plain value `T` or a `PromiseLike<T>`.
 * @template T - The inner value type.
 * @example
 * ```ts
 * async function wrap<T>(v: Awaitable<T>): Promise<T> {
 *   return await v;
 * }
 *
 * const a = wrap(42);           // Promise<number>
 * const b = wrap(Promise.resolve("hi")); // Promise<string>
 * ```
 */
type Awaitable<T> = T | PromiseLike<T>;
/** --------------------------------------------------
 * * ***Utility Type: `StrictAwaitable`.***
 * --------------------------------------------------
 * **Represents a value that may be synchronous or a
 * native `Promise`.**
 *
 * Unlike {@link Awaitable | `Awaitable`}, this type **does not accept
 * arbitrary thenables (`PromiseLike`)** and only allows
 * real `Promise` instances.
 *
 * This is sometimes preferred for **tooling APIs or
 * controlled async flows** where supporting generic
 * thenables is unnecessary or undesirable.
 *
 * --------------------------------------------------
 * @template T - The inner value type.
 *
 * @example
 * ```ts
 * function maybeAsync<T>(v: StrictAwaitable<T>): Promise<T> {
 *   return Promise.resolve(v);
 * }
 *
 * maybeAsync(123); // Promise<number>
 * maybeAsync(Promise.resolve("ok")); // Promise<string>
 * ```
 */
type StrictAwaitable<T> = T | Promise<T>;
interface CustomPromiseLike<OnSuccess, OnError> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = OnSuccess, TResult2 = never>(
    onfulfilled?:
      | ((value: OnSuccess) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: OnError) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): CustomPromiseType<TResult1 | TResult2, OnError>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?:
      | ((reason: OnError) => TResult | PromiseLike<TResult>)
      | null
      | undefined
  ): CustomPromiseType<OnSuccess | TResult, OnError>;
  /**
   * Registers a callback to be invoked **exactly once** when the
   * promise settles, with access to both the resolved value and
   * the rejection reason.
   *
   * If the promise is already settled when `finish` is called,
   * the callback executes immediately on the same tick.
   *
   * @param cb Callback receiving the final `(value, error)`.
   * @returns `this` for fluent chaining.
   */
  finish(
    cb: (value: OnSuccess | undefined, error: OnError | undefined) => void
  ): CustomPromiseType<OnSuccess, OnError>;
}
/** --------------------------------------------------
 * * ***Utility Type: `CustomPromiseType`.***
 * --------------------------------------------------
 * **Extends the native `Promise` type to provide explicit typing
 * for both the resolved (`onSuccess`) and rejected (`onError`) values,
 * plus an optional `finish` hook.**
 * - **Behavior:**
 *      - ✅ **Strongly types** `success`, `error`, and `finish` handlers.
 *      - ⚙️ `finish` runs exactly once after the promise settles (similar to `finish`).
 * @template OnSuccess - The type of the fulfilled value.
 * @template OnError   - The type of the rejection reason, defaults to `unknown`.
 * @example
 * ```ts
 * import type { CustomPromiseType } from "@rzl-zone/ts-types-plus";
 * import { CustomPromise } from "@rzl-zone/utils-js/promises";
 *
 * const fetchUser = (): CustomPromiseType<User, ApiError> =>
 *   CustomsPromise<User, ApiError>((resolve, reject) => {
 *      apiCall().then(resolve).catch(reject);
 *   });
 *
 * fetchUser()
 *   .then(user => console.log(user))
 *   .catch(err => console.error(err))
 *   .finish((result, error) => {
 *      console.log("always runs", { result, error });
 *   });
 * ```
 */
type CustomPromiseType<OnSuccess, OnError = unknown> = CustomPromiseLike<
  OnSuccess,
  OnError
>;
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
type ReadonlyOnly<
  T extends object,
  K extends keyof T,
  PrettifyOptions$3 extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<
  Pick<T, Exclude<keyof T, K>> & { readonly [P in K]: T[P] },
  PrettifyOptions$3
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
type ReadonlyExcept<
  T extends object,
  K extends keyof T,
  PrettifyOptions$4 extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<
  Pick<T, K> & { readonly [P in Exclude<keyof T, K>]: T[P] },
  PrettifyOptions$4
>;
/** `ReadonlyDeep` helper */
type Builtin = Primitive | AnyFunction | Date | RegExp | Error;
/** `ReadonlyDeep` helper */
type _ReadonlyDeep<
  T,
  PrettifyOptions$5 extends PrettifyOptions = DefaultPrettifyOptions
> = T extends Builtin
  ? T
  : T extends Promise<infer U>
    ? Promise<_ReadonlyDeep<U, PrettifyOptions$5>>
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<
          _ReadonlyDeep<K, PrettifyOptions$5>,
          _ReadonlyDeep<V, PrettifyOptions$5>
        >
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<
            _ReadonlyDeep<K, PrettifyOptions$5>,
            _ReadonlyDeep<V, PrettifyOptions$5>
          >
        : T extends Set<infer U>
          ? ReadonlySet<_ReadonlyDeep<U, PrettifyOptions$5>>
          : T extends WeakSet<infer U>
            ? WeakSet<_ReadonlyDeep<U, PrettifyOptions$5>>
            : T extends readonly [infer A, ...infer B]
              ? readonly [
                  _ReadonlyDeep<A, PrettifyOptions$5>,
                  ...{ [K in keyof B]: _ReadonlyDeep<B[K], PrettifyOptions$5> }
                ]
              : T extends ReadonlyArray<infer U>
                ? ReadonlyArray<_ReadonlyDeep<U, PrettifyOptions$5>>
                : T extends object
                  ? {
                      readonly [K in keyof T]: _ReadonlyDeep<
                        T[K],
                        PrettifyOptions$5
                      >;
                    }
                  : T;
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
type ReadonlyDeep<
  T,
  PrettifyOptions$6 extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<_ReadonlyDeep<T, PrettifyOptions$6>, PrettifyOptions$6>;
/** -------------------------------------------------------
 * * ***Utility Type: `RemoveIndexSignature`.***
 * -------------------------------------------------------
 * **Removes **index signatures** (e.g., `[key: string]: any`) from an object
 * type `T`, leaving only explicitly declared properties.**
 * @template T - The object type to process.
 * @example
 * ```ts
 * type Case1 = RemoveIndexSignature<{ [key: string]: number | string; a: string }>;
 * // ➔ { a: string }
 *
 * type Case2 = RemoveIndexSignature<{ x: number; y: boolean }>;
 * // ➔ { x: number; y: boolean }
 *
 * type Case3 = RemoveIndexSignature<{ [key: string]: number }>;
 * // ➔ {}  // all keys were index signatures
 * ```
 */
type RemoveIndexSignature<T> = {
  [Key in keyof T as Key extends `${infer _}` ? Key : never]: T[Key];
};
/** -------------------------------------------------------
 * * ***Utility Type: `Replace`.***
 * -------------------------------------------------------
 * **Replaces the **first occurrence** of a substring (`Pivot`)
 * inside a string (`T`) with another substring (`ReplaceBy`).**
 * @template T - The source string.
 * @template Pivot - The substring to replace.
 * @template ReplaceBy - The substring that replaces `Pivot`.
 * @example
 * ```ts
 * type Case1 = Replace<'remove me me', 'me', 'him'>;
 * // ➔ 'remove him me'
 * type Case2 = Replace<'remove me me', 'us', 'him'>;
 * // ➔ 'remove me me'
 * type Case3 = Replace<'aaaa', 'a', 'b'>;
 * // ➔ 'baaa'
 * type Case4 = Replace<'hello', 'x', 'y'>;
 * // ➔ 'hello' (no match found)
 * ```
 */
type Replace<
  T extends string,
  Pivot extends string,
  ReplaceBy extends string
> = T extends `${infer A}${Pivot}${infer B}` ? `${A}${ReplaceBy}${B}` : T;
/** --------------------------------------------------
 * * ***Utility Type: `ReplaceToPartial`.***
 * --------------------------------------------------
 * **Replaces specified keys in a type with a new value type, making them optional.**
 * - ✅ Useful when certain properties in a type should allow partial overrides
 *   while keeping the rest of the structure intact.
 * @template TypeToBeChecked - The original object type.
 * @template KeyToBeReplaced - The keys in the original type to be replaced.
 * @template NewValueToUse - The new type to assign to the replaced keys.
 * @example
 * ```ts
 * type A = { name: string; age: number };
 * type B = ReplaceToPartial<A, 'age', string>;
 * // ➔ { name: string; age?: string }
 * ```
 */
type ReplaceToPartial<
  TypeToBeChecked,
  KeyToBeReplaced extends keyof TypeToBeChecked,
  NewValueToUse
> = Identity<
  Pick<TypeToBeChecked, Exclude<keyof TypeToBeChecked, KeyToBeReplaced>> & {
    [P in KeyToBeReplaced]?: NewValueToUse;
  }
>;
/** --------------------------------------------------
 * * ***Utility Type: `ReplaceToRequired`.***
 * --------------------------------------------------
 * **Replaces specified keys in a type with a new value type, making them required.**
 * - ✅ Useful when redefining a property’s type while ensuring it's required.
 * @template TypeToBeChecked - The original object type.
 * @template KeyToBeReplaced - The keys in the original type to be replaced.
 * @template NewValueToUse - The new type to assign to the replaced keys.
 * @example
 * ```ts
 * type A = { name?: string | string[]; age: number };
 * type B = ReplaceToRequired<A, 'name', string>;
 * // ➔ { name: string; age: number }
 * ```
 */
type ReplaceToRequired<
  TypeToBeChecked,
  KeyToBeReplaced extends keyof TypeToBeChecked,
  NewValueToUse
> = Identity<
  Pick<TypeToBeChecked, Exclude<keyof TypeToBeChecked, KeyToBeReplaced>> & {
    [P in KeyToBeReplaced]: NewValueToUse;
  }
>;
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
type RequiredOnly<
  T extends object,
  K extends keyof T | AnyString,
  PrettifyOptions$1 extends PrettifyOptions = DefaultPrettifyOptions
> =
  IsNever<K> extends true
    ? T
    : PrettifyUnionIntersection<
        { [P in Exclude<keyof T, K>]?: CleanOptional<T[P]> } & {
          [P in Extract<keyof T, K>]-?: NonUndefined<CleanOptional<T[P]>>;
        },
        PrettifyOptions$1
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
type RequiredExcept<
  T extends object,
  K extends keyof T | AnyString,
  PrettifyOptions$2 extends PrettifyOptions = DefaultPrettifyOptions
> =
  IsNever<K> extends true
    ? Required<T>
    : PrettifyUnionIntersection<
        { [P in Exclude<keyof T, K>]-?: NonUndefined<CleanOptional<T[P]>> } & {
          [P in Extract<keyof T, K>]?: CleanOptional<T[P]>;
        },
        PrettifyOptions$2
      >;
type _Reverse<
  T extends readonly unknown[],
  Result extends readonly unknown[] = []
> = T extends readonly [infer First, ...infer Rest]
  ? _Reverse<Rest, [First, ...Result]>
  : Result;
type FilterByType$1<T extends readonly unknown[], U> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? Head extends U
    ? [Head, ...FilterByType$1<Tail, U>]
    : FilterByType$1<Tail, U>
  : [];
type Grouped<T extends readonly unknown[]> = [
  ...FilterByType$1<T, number>,
  ...FilterByType$1<T, string>,
  ...FilterByType$1<T, boolean>,
  ...FilterByType$1<T, Exclude<T[number], number | string | boolean>>
];
type MaybeReadonly<T extends readonly unknown[], R extends readonly unknown[]> =
  IsTuple<T> extends true
    ? IsReadonlyArray<T> extends true
      ? Readonly<R>
      : R
    : R;
/** -------------------------------------------------------
 * * ***Utility Type: `Reverse`.***
 * -------------------------------------------------------
 * **Returns a new tuple or readonly array type with the elements in reverse order.**
 * - **Behavior:**
 *      1. **Tuple**: The reversed result preserves tuple properties,
 *          including `readonly` if applicable.
 *            - Elements are **grouped in this order before reversing**:
 *          `number`, `string`, `boolean`, then any other types.
 *      2. **Normal array (non-tuple)**: The type is returned as-is (no reversal).
 * - ℹ️ **Notes:**
 *      - Supports arbitrary types in the tuple, including objects, Date, symbol, etc.
 *      - Grouping ensures that numbers, strings, and booleans are reversed in logical
 *        groups, while other types remain at the end in their original order before
 *        reverse.
 * @template T - The array or tuple type to reverse.
 * @example
 * ```ts
 * // Mutable tuple of numbers
 * type T0 = Reverse<[1, 2, 3]>;
 * // Grouped: [1,2,3] (numbers first)
 * // Reversed: [3, 2, 1]
 *
 * // Readonly tuple of numbers
 * type T1 = Reverse<readonly [1, 2, 3]>;
 * // Grouped: [1,2,3]
 * // Reversed: readonly [3, 2, 1]
 *
 * // Tuple of strings
 * type T2 = Reverse<["a", "b", "c"]>;
 * // Grouped: ["a","b","c"]
 * // Reversed: ["c","b","a"]
 *
 * // Readonly tuple of strings
 * type T3 = Reverse<readonly ["x", "y", "z"]>;
 * // Grouped: ["x","y","z"]
 * // Reversed: readonly ["z","y","x"]
 *
 * // Tuple of mixed types (numbers, strings, booleans)
 * type T4 = Reverse<[1, "a", true, 2, "b", false]>;
 * // Grouped: [1,2,"a","b",true,false]
 * // Reversed: [false,"b","a",2,1,true]
 *
 * // Readonly tuple of mixed types
 * type T5 = Reverse<readonly [false, "b", 2, "x", true]>;
 * // Grouped: [2,"b","x",false,true]
 * // Reversed: readonly [true,false,"x","b",2]
 *
 * // Tuple with arbitrary types (Date, object, symbol, bigint, etc.)
 * type T6 = Reverse<[1, "a", true, 2, "b", false, Date, {x:1}, symbol, 10n]>;
 * // Grouped: [1,2,"a","b",true,false,Date,{x:1},symbol,10n]
 * // Reversed: [10n,symbol,{x:1},Date,false,true,"b","a",2,1]
 *
 * // Normal arrays (not tuples) remain unchanged
 * type T7 = Reverse<number[]>;
 * // ➔ number[]
 *
 * type T8 = Reverse<string[]>;
 * // ➔ string[]
 *
 * type T9 = Reverse<(number | string)[]>;
 * // ➔ (string | number)[]
 *
 * type T10 = Reverse<(boolean | number | string)[]>;
 * // ➔ (string | number | boolean)[]
 * ```
 */
type Reverse<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...unknown[]
]
  ? _Reverse<Grouped<T>> extends infer R extends readonly unknown[]
    ? MaybeReadonly<T, R>
    : never
  : T;
/** -------------------------------------------------------
 * * ***Utility Type: `Round`.***
 * -------------------------------------------------------
 * **Type-level version of `Math.round()`.
 * Returns the value of a number rounded to the **nearest integer**.**
 * - **Behavior:**
 *      - If `T` is a float, it rounds to the nearest whole number:
 *        - Fraction `≥ 0.5` ➔ rounds up.
 *        - Fraction `< 0.5` ➔ rounds down.
 *      - If `T` is already an integer, it returns `T` as-is.
 * @template T - The number type to round.
 * @example
 * ```ts
 * // Positive float
 * type T0 = Round<3.14>;
 * // ➔ 3
 *
 * // Negative float
 * type T1 = Round<-3.14>;
 * // ➔ -3
 *
 * // Fraction ≥ 0.5
 * type T2 = Round<2.6>;
 * // ➔ 3
 *
 * // Already integer
 * type T3 = Round<5>;
 * // ➔ 5
 * ```
 */
type Round<T extends number> =
  IsFloat<T> extends true
    ? GetFloatNumberParts<T> extends [
        infer Whole extends number,
        infer Fraction extends number
      ]
      ? IsGreaterThan<FirstDigit$1<Fraction>, 4> extends true
        ? Increment<Whole>
        : Whole
      : never
    : T;
type SliceRemovedItemValue = Record<"__type-rzl_internal__", symbol>;
type FilterRemoved<
  T extends readonly unknown[],
  Result extends unknown[] = []
> = T extends readonly [infer First, ...infer Rest extends unknown[]]
  ? FilterRemoved<
      Rest,
      First extends SliceRemovedItemValue ? Result : Push<Result, First>
    >
  : Result;
/** -------------------------------------------------------
 * * ***Utility Type: `Slice`.***
 * -------------------------------------------------------
 * **Type-level version of `Array.prototype.slice()`.**
 * @description
 * Returns a shallow copy of a portion of an array, selected from `Start` to `End` (not including `End`).
 * - **Behavior:**
 *     - `Start` defaults to `0`.
 *     - `End` defaults to `T["length"]`.
 *     - Negative indices are interpreted as `T["length"] + index`.
 *     - If `Start >= T["length"]` or `End <= Start`, returns an empty array `[]`.
 *     - If the full range is selected, returns `T` as-is.
 * @template T - The array type to slice.
 * @template Start - The start index (inclusive). Defaults to `0`.
 * @template End - The end index (exclusive). Defaults to `T["length"]`.
 * @example
 * ```ts
 * // Slice from index 1 to end
 * type T0 = Slice<[1, 2, 3, 4], 1>;
 * // ➔ [2, 3, 4]
 *
 * // Slice from index 1 to 3
 * type T1 = Slice<[1, 2, 3, 4], 1, 3>;
 * // ➔ [2, 3]
 *
 * // Slice with negative start
 * type T2 = Slice<[1, 2, 3, 4], -2>;
 * // ➔ [3, 4]
 *
 * // Slice with negative end
 * type T3 = Slice<[1, 2, 3, 4], 1, -1>;
 * // ➔ [2, 3]
 *
 * // Slice exceeding array length
 * type T4 = Slice<[1, 2, 3], 0, 10>;
 * // ➔ [1, 2, 3]
 *
 * // Slice resulting in empty array
 * type T5 = Slice<[1, 2, 3], 3, 2>;
 * // ➔ []
 * ```
 */
type Slice<
  T extends readonly unknown[],
  Start extends number = 0,
  End extends number = T["length"]
> = (
  IsEmptyArray<T> extends true
    ? "self"
    : IsGreaterOrEqual<Start, T["length"]> extends true
      ? "empty"
      : IsNegative<End> extends true
        ? IsGreaterOrEqual<Abs<End>, T["length"]> extends true
          ? "empty"
          : [
              IfPositive<Start, Start, Sum<T["length"], Start>>,
              Sum<T["length"], End>
            ]
        : And<
              Or<IsEqual<Start, 0>, IsGreaterOrEqual<Abs<Start>, T["length"]>>,
              IsGreaterOrEqual<End, T["length"]>
            > extends true
          ? "self"
          : [IfPositive<Start, Start, Sum<T["length"], Start>>, End]
) extends infer Indexes
  ? Indexes extends "self"
    ? T
    : Indexes extends "empty"
      ? []
      : Indexes extends [
            infer NewStart extends number,
            infer NewEnd extends number
          ]
        ? IfGreaterOrEqual<NewStart, NewEnd> extends true
          ? []
          : FilterRemoved<{
              [K in keyof T]: IsArrayIndex<K> extends true
                ? If<
                    And<
                      IsGreaterOrEqual<ParseNumber<K>, NewStart>,
                      IsLowerThan<ParseNumber<K>, NewEnd>
                    >,
                    T[K],
                    SliceRemovedItemValue
                  >
                : T[K];
            }>
        : T
  : T;
/** -------------------------------------------------------
 * * ***Utility Type: `Swap`.***
 * -------------------------------------------------------
 * **Swaps the positions of two elements in a tuple at the type level.**
 * - **Behavior:**
 *      - Only works on tuple types. Non-tuple arrays are returned as-is.
 *      - Validates that `FromIndex` and `ToIndex` are within bounds of the tuple.
 *      - If `FromIndex` and `ToIndex` are equal, the tuple remains unchanged.
 * @template T - The tuple type.
 * @template FromIndex - The index of the first element to swap.
 * @template ToIndex - The index of the second element to swap.
 * @example
 * ```ts
 * // Swap first and last element
 * type Case1 = Swap<[1, 2, 3], 0, 2>;
 * // ➔ [3, 2, 1]
 *
 * // Swap same index (no change)
 * type Case2 = Swap<[1, 2, 3], 0, 0>;
 * // ➔ [1, 2, 3]
 *
 * // Swap middle elements
 * type Case3 = Swap<["a", "b", "c"], 1, 2>;
 * // ➔ ["a", "c", "b"]
 *
 * // Non-tuple array remains unchanged
 * type Case4 = Swap<number[], 0, 1>;
 * // ➔ number[]
 * ```
 */
type Swap<
  T extends readonly unknown[],
  FromIndex extends number,
  ToIndex extends number
> =
  IsTuple<T> extends true
    ? And<
        IsBetween<FromIndex, 0, T["length"]>,
        IsBetween<ToIndex, 0, T["length"]>
      > extends true
      ? T[FromIndex] extends infer From
        ? T[ToIndex] extends infer To
          ? {
              [K in keyof T]: ParseNumber<K> extends infer NumK
                ? IsEqual<FromIndex, NumK> extends true
                  ? To
                  : IsEqual<ToIndex, NumK> extends true
                    ? From
                    : T[K]
                : never;
            }
          : never
        : never
      : never
    : T;
type _SortSingle<
  Result extends readonly number[],
  PivotIndex extends number,
  CurrentIndex extends number
> =
  IsEqual<PivotIndex, CurrentIndex> extends true
    ? Result
    : Increment<CurrentIndex> extends infer NextCurrentIndex extends number
      ? _SortSingle<
          IsGreaterThan<
            Result[CurrentIndex],
            Result[NextCurrentIndex]
          > extends true
            ? Swap<
                Result,
                CurrentIndex,
                NextCurrentIndex
              > extends infer NewResult extends readonly number[]
              ? NewResult
              : Result
            : Result,
          PivotIndex,
          NextCurrentIndex
        >
      : never;
type _Sort<T extends readonly number[], CurrentIndex extends number> =
  IsLowerOrEqual<CurrentIndex, 0> extends true
    ? T
    : _SortSingle<T, CurrentIndex, 0> extends infer NewT extends
          readonly number[]
      ? _Sort<NewT, Decrement<CurrentIndex>>
      : T;
/** -------------------------------------------------------
 * * ***Utility Type: `Sort`.***
 * -------------------------------------------------------
 * **Type-level function that sorts a **tuple of numbers** in **ascending order**.**
 * - **Behavior:**
 *      - Tuples with length `< 2` are returned as-is.
 *      - Works only on **tuple literal types**, not on general arrays (`number[]`).
 * @template T - Tuple of numbers to sort.
 * @example
 * ```ts
 * // Sort positive numbers
 * type T0 = Sort<[3, 2, 1]>;
 * // ➔ [1, 2, 3]
 *
 * // Sort numbers with negative values
 * type T1 = Sort<[1, -1, 0]>;
 * // ➔ [-1, 0, 1]
 *
 * // Already sorted
 * type T2 = Sort<[0, 1, 2]>;
 * // ➔ [0, 1, 2]
 *
 * // Single element tuple
 * type T3 = Sort<[42]>;
 * // ➔ [42]
 *
 * // Empty tuple
 * type T4 = Sort<[]>;
 * // ➔ []
 * ```
 */
type Sort<T extends readonly number[]> =
  IsLowerThan<T["length"], 2> extends true
    ? T
    : _Sort<T, Decrement<T["length"]>>;
/** -------------------------------------------------------
 * * ***Utility Type: `StartsWith`.***
 * -------------------------------------------------------
 * **Type-level utility that determines whether a string `Str`
 * starts with the substring `Pivot`.**
 * - **Behavior:**
 *      - Supports `Pivot` as either `string` or `number`.
 *      - Returns `true` if `Str` starts with `Pivot`, otherwise `false`.
 * @template Str - The string to check.
 * @template Pivot - The substring or number to check as the prefix.
 * @example
 * ```ts
 * // Check string prefix
 * type Case1 = StartsWith<'abc', 'a'>;
 * // ➔ true
 *
 * type Case2 = StartsWith<'abc', 'b'>;
 * // ➔ false
 *
 * // Check numeric prefix
 * type Case3 = StartsWith<'123', 1>;
 * // ➔ true
 *
 * type Case4 = StartsWith<'123', 2>;
 * // ➔ false
 *
 * // Multi-character pivot
 * type Case5 = StartsWith<'typescript', 'type'>;
 * // ➔ true
 *
 * type Case6 = StartsWith<'typescript', 'script'>;
 * // ➔ false
 * ```
 */
type StartsWith<
  Str extends string,
  Pivot extends string | number
> = Str extends `${Pivot}${string}` ? true : false;
/** -------------------------------------------------------
 * * ***Utility Type: `Switch`.***
 * -------------------------------------------------------
 * **Type-level version of a `switch` statement.**
 * - **Behavior:**
 *      - Checks if `Condition` exists as a key in `Cases`.
 *      - Returns the corresponding value if the key exists.
 *      - Returns `Default` if the key does not exist.
 * @template Condition - The value to match against case keys.
 * @template Cases - An object mapping keys to corresponding values.
 * @template Default - The default value returned if `Condition` is not a key in `Cases` (defaults to `never`).
 * @example
 * ```ts
 * const a = 'const';
 *
 * // Matches 'const' key ➔ 'bar'
 * type Result1 = Switch<typeof a, { number: 'foo', const: 'bar' }, 'foobar'>;
 * // ➔ 'bar'
 *
 * // Condition not present ➔ returns default
 * type Result2 = Switch<'other', { number: 'foo', const: 'bar' }, 'default'>;
 * // ➔ 'default'
 *
 * // Condition present but no default specified
 * type Result3 = Switch<'number', { number: 'foo', const: 'bar' }>;
 * // ➔ 'foo'
 * ```
 */
type Switch<
  Condition extends PropertyKey,
  Cases extends Record<PropertyKey, unknown>,
  Default = never
> = Condition extends keyof Cases ? Cases[Condition] : Default;
/** -------------------------------------------------------
 * * ***Utility Type: `ToPrimitive`.***
 * -------------------------------------------------------
 * **Converts a literal type to its corresponding primitive type.**
 * - **Behavior:**
 *      - `string literal` ➔ `string`.
 *      - `number literal` ➔ `number`.
 *      - `boolean literal` ➔ `boolean`.
 *      - `bigint literal` ➔ `bigint`.
 *      - `symbol literal` ➔ `symbol`.
 *      - `null` ➔ `null`.
 *      - `undefined` ➔ `undefined`.
 *      - Objects ➔ recursively converts all properties to their primitive types.
 * @template T - The literal type to convert to a primitive type.
 * @example
 * ```ts
 * // Number literal
 * type Case1 = ToPrimitive<1>;
 * // ➔ number
 *
 * // String literal
 * type Case2 = ToPrimitive<'1'>;
 * // ➔ string
 *
 * // Boolean literal
 * type Case3 = ToPrimitive<true>;
 * // ➔ boolean
 *
 * // BigInt literal
 * type Case4 = ToPrimitive<123n>;
 * // ➔ bigint
 *
 * // Symbol literal
 * type Case5 = ToPrimitive<symbol>;
 * // ➔ symbol
 *
 * // Null and undefined
 * type Case6 = ToPrimitive<null>;
 * // ➔ null
 * type Case7 = ToPrimitive<undefined>;
 * // ➔ undefined
 *
 * // Object with literal properties
 * type Case8 = ToPrimitive<{ a: 1; b: 's'; c: true }>;
 * // ➔ { a: number; b: string; c: boolean }
 * ```
 */
type ToPrimitive<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends null
      ? null
      : T extends undefined
        ? undefined
        : T extends boolean
          ? boolean
          : T extends bigint
            ? bigint
            : T extends symbol
              ? symbol
              : { [K in keyof T]: ToPrimitive<T[K]> };
/** -------------------------------------------------------
 * * ***Utility Type: `Trunc`.***
 * -------------------------------------------------------
 * **Type version of `Math.trunc()`.**
 * @description
 * Returns the **integer part** of a number by removing any fractional digits.
 * - **Behavior:**
 *      - If `T` is a floating-point number, returns the integer part.
 *      - Preserves the sign for negative numbers.
 *      - If `T` is already an integer, returns `T`.
 *      - If `T` is `number` (general type), returns `T`.
 * @template T - The number type to truncate.
 * @example
 * ```ts
 * // Positive float
 * type T0 = Trunc<3.14>;
 * // ➔ 3
 *
 * // Negative float
 * type T1 = Trunc<-3.14>;
 * // ➔ -3
 *
 * // Already integer
 * type T2 = Trunc<42>;
 * // ➔ 42
 *
 * // General number type
 * type T3 = Trunc<number>;
 * // ➔ number
 * ```
 */
type Trunc<T extends number> = number extends T
  ? T
  : IsFloat<T> extends true
    ? GetFloatNumberParts<T>[0] extends infer IntegerPart extends number
      ? IsNegative<T> extends true
        ? Negate<IntegerPart>
        : IntegerPart
      : never
    : T;
type FilterByType<T extends readonly unknown[], U> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? Head extends U
    ? [Head, ...FilterByType<Tail, U>]
    : FilterByType<Tail, U>
  : [];
type GroupedKeys<T extends readonly PropertyKey[]> = [
  ...FilterByType<T, symbol>,
  ...FilterByType<T, string>,
  ...FilterByType<T, number>
];
/** -------------------------------------------------------
 * * ***Utility Type: `TupleToObject`.***
 * -------------------------------------------------------
 * **Accepts a tuple of `string`, `number`, or `symbol` and returns an object type
 * where each key **and its value** are the elements of the tuple.**
 * - **Behavior:**
 *     - Tuple elements must extend `PropertyKey` (`string | number | symbol`).
 *     - The resulting object has keys and values identical to the tuple elements.
 * @template T - The tuple of property keys.
 * @example
 * ```ts
 * // Tuple of strings
 * type T0 = TupleToObject<['foo', 'bar']>;
 * // ➔ { foo: 'foo'; bar: 'bar' }
 *
 * // Tuple of numbers
 * type T1 = TupleToObject<[1, 2, 3]>;
 * // ➔ { 1: 1; 2: 2; 3: 3 }
 *
 * // Tuple of mixed property keys
 * type T2 = TupleToObject<['a', 0, symbol]>;
 * // ➔ { [x: symbol]: symbol; 0: 0; a: 'a'; }
 * ```
 */
type TupleToObject<T extends readonly PropertyKey[]> = {
  [K in GroupedKeys<T>[number]]: K;
};
/** -------------------------------------------------------
 * * ***Utility Type: `Unshift`.***
 * -------------------------------------------------------
 * **Adds the specified element `U` to the **beginning** of the tuple/array `T`.**
 * @template T - The original tuple or array.
 * @template U - The element to add at the start.
 * @example
 * ```ts
 * // Adding string to a tuple
 * type Case1 = Unshift<['bar'], 'foo'>;
 * // ➔ ['foo', 'bar']
 *
 * // Adding number to an empty array
 * type Case2 = Unshift<[], 1>;
 * // ➔ [1]
 * ```
 */
type Unshift<T extends readonly unknown[], U> = [U, ...T];
export {
  type Abs,
  type AnObjectNonArray,
  type And,
  type AndArr,
  type AnifyProperties,
  type AnifyPropertiesOptions,
  type AnyFunction,
  type AnyRecord,
  type AnyString,
  type AnyStringRecord,
  type AreAnagrams,
  type ArgumentTypes,
  type ArrayElementType,
  type Arrayable,
  type Awaitable,
  type BoxedPrimitivesTypes,
  type Ceil,
  type CharAt,
  type Color,
  type ColorCssNamed,
  type ColorOptions,
  type CompareNumberLength,
  type CompareStringLength,
  type Concat,
  type CustomPromiseType,
  type DataTypes,
  type Decrement,
  type DeepMergeArrayUnion,
  type DeepReplaceType,
  type DefaultColorOptions,
  type DefaultHSLOptions,
  type DefaultNumberLengthOptions,
  type DefaultPathToFieldsOptions,
  type DefaultPrettifyOptions,
  type DefaultRGBOptions,
  type DigitsTuple,
  type Div,
  type Dot,
  type DotArray,
  type EmptyArray,
  type EmptyString,
  type EndsWith,
  type Even,
  type EvenDigit,
  type ExcludeStrict,
  type Extends,
  type ExtendsArr,
  type ExtractStrict,
  type Factorial,
  type Fibonacci,
  type FirstCharacter,
  type FirstCharacterOptions,
  type FirstDigit$1 as FirstDigit,
  type FixNeverArrayRecursive,
  type Float,
  type Floor,
  type GetArrayElementType,
  type GetFloatNumberParts,
  type HEX,
  type HSL,
  type HSLOptions,
  type Identity,
  type If,
  type IfAny,
  type IfColor,
  type IfEmptyArray,
  type IfEmptyString,
  type IfEqual,
  type IfEven,
  type IfExtends,
  type IfFloat,
  type IfGreaterOrEqual,
  type IfGreaterThan,
  type IfHEX,
  type IfHSL,
  type IfInteger,
  type IfLowerOrEqual,
  type IfLowerThan,
  type IfNegative,
  type IfNegativeFloat,
  type IfNegativeInteger,
  type IfNever,
  type IfNonEmptyArray,
  type IfNonEmptyString,
  type IfNot,
  type IfNotEqual,
  type IfNotExtends,
  type IfOdd,
  type IfPositive,
  type IfPositiveFloat,
  type IfPositiveInteger,
  type IfRGB,
  type IfTuple,
  type IfUnknown,
  type Includes,
  type Increment,
  type IndexOf,
  type Integer,
  type IntlObjects,
  type IsAny,
  type IsArray,
  type IsArrayIndex,
  type IsArrayOrTuple,
  type IsBaseType,
  type IsBetween,
  type IsBetweenOptions,
  type IsColor,
  type IsConstructor,
  type IsDivisible,
  type IsDivisibleByFive,
  type IsDivisibleByHundred,
  type IsDivisibleBySix,
  type IsDivisibleByTen,
  type IsDivisibleByThree,
  type IsDivisibleByTwo,
  type IsEmptyArray,
  type IsEmptyString,
  type IsEqual,
  type IsEven,
  type IsExactly,
  type IsFloat,
  type IsFunction,
  type IsGreaterOrEqual,
  type IsGreaterThan,
  type IsHEX,
  type IsHSL,
  type IsInteger,
  type IsLetter,
  type IsLongerNumber,
  type IsLongerString,
  type IsLowerOrEqual,
  type IsLowerThan,
  type IsMutableArray,
  type IsNegative,
  type IsNegativeFloat,
  type IsNegativeInteger,
  type IsNever,
  type IsNewable,
  type IsNonEmptyArray,
  type IsNonEmptyString,
  type IsNotEqual,
  type IsOdd,
  type IsPalindrome,
  type IsPositive,
  type IsPositiveFloat,
  type IsPositiveInteger,
  type IsPrimitive,
  type IsRGB,
  type IsReadonlyArray,
  type IsRealPrimitive,
  type IsSameLengthNumber,
  type IsSameLengthString,
  type IsScientificNumber,
  type IsShorterNumber,
  type IsShorterString,
  type IsStringLiteral,
  type IsTuple,
  type IsUnion,
  type IsUnknown,
  type Join,
  type KeepNil,
  type KeepNull,
  type KeepUndef,
  type LastCharacter,
  type LastCharacterOptions,
  type LooseLiteral,
  type Max,
  type MaxArr,
  type Min,
  type MinArr,
  type Mod,
  type Multi,
  type Mutable,
  type MutableArray,
  type MutableExcept,
  type MutableOnly,
  type MutableOptions,
  type Negate,
  type Negative,
  type NegativeFloat,
  type NegativeInteger,
  type NeverifyProperties,
  type NeverifyPropertiesOptions,
  type Nilable,
  type NonEmptyArray,
  type NonEmptyString,
  type NonNil,
  type NonNull,
  type NonNullableObject,
  type NonNullableObjectExcept,
  type NonNullableObjectOnly,
  type NonPlainObject,
  type NonUndefined,
  type NormalizeEmptyArraysRecursive,
  type Not,
  type NotExtends,
  type NullToUndefined,
  type Nullable,
  type Nullish,
  type NumberLength,
  type NumberRangeLimit,
  type NumberRangeUnion,
  type Odd,
  type OddDigit,
  type OmitStrict,
  type Or,
  type OrArr,
  type OverrideTypes,
  type ParseNumber,
  type ParseScientificNumber,
  type PartialExcept,
  type PartialOnly,
  type PathToFields,
  type PathToFieldsOptions,
  type PickStrict,
  type Pop,
  type PopOptions,
  type Positive,
  type PositiveFloat,
  type PositiveInteger,
  type Pow,
  type Prettify,
  type PrettifyOptions,
  type PrettifyUnionIntersection,
  type Primitive,
  type Push,
  type RGB,
  type RGBOptions,
  type ReadonlyDeep,
  type ReadonlyExcept,
  type ReadonlyOnly,
  type RemoveEmptyArrayElements,
  type RemoveIndexSignature,
  type RemoveLeading,
  type Repeat,
  type Replace,
  type ReplaceAll,
  type ReplaceToPartial,
  type ReplaceToRequired,
  type RequiredExcept,
  type RequiredOnly,
  type ReturnItselfIfExtends,
  type ReturnItselfIfNotExtends,
  type Reverse,
  type Round,
  type Shift,
  type ShiftOptions,
  type Slice,
  type Sort,
  type Split,
  type StartsWith,
  type StrictAwaitable,
  type StringLength,
  type Stringify,
  type Sub,
  type Sum,
  type SumArr,
  type Swap,
  type Switch,
  type ToPrimitive,
  type Trim,
  type TrimLeft,
  type TrimRight,
  type TrimsLower,
  type TrimsUpper,
  type Trunc,
  type TupleToObject,
  type TypeNumberLengthOptions,
  type TypedArray,
  type Undefinedable,
  type UnionToIntersection,
  type UnknownRecord,
  type UnknownifyProperties,
  type UnknownifyPropertiesOptions,
  type Unshift,
  type ValueOf,
  type ValueOfArray,
  type ValueOfExcept,
  type ValueOfOnly,
  type WebApiObjects,
  type Whitespace,
  type WordSeparator
};
