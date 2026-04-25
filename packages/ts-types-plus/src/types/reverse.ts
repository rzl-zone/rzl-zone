import type { IsReadonlyArray } from "./is-array";
import type { IsTuple } from "./is-tuple";

type _Reverse<
  T extends readonly unknown[],
  Result extends readonly unknown[] = []
> = T extends readonly [infer First, ...infer Rest]
  ? _Reverse<Rest, [First, ...Result]>
  : Result;

type FilterByType<T extends readonly unknown[], U> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? Head extends U
    ? [Head, ...FilterByType<Tail, U>]
    : FilterByType<Tail, U>
  : [];

type Grouped<T extends readonly unknown[]> = [
  ...FilterByType<T, number>,
  ...FilterByType<T, string>,
  ...FilterByType<T, boolean>,
  ...FilterByType<T, Exclude<T[number], number | string | boolean>>
];

type MaybeReadonly<T extends readonly unknown[], R extends readonly unknown[]> =
  IsTuple<T> extends true
    ? IsReadonlyArray<T> extends true
      ? Readonly<R>
      : R
    : R; // non-tuple tetap mutable

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
export type Reverse<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...unknown[]
] // tuple only
  ? _Reverse<Grouped<T>> extends infer R extends readonly unknown[]
    ? MaybeReadonly<T, R>
    : never
  : T;
