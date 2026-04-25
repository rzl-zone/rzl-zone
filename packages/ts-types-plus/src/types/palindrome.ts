import type { IsEmptyString } from "./string";
import type { Stringify } from "./stringify";
import type { IsStringLiteral } from "./is-string-literal";
import type { Not } from "./not";

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
export type IsPalindrome<T extends string | number> = _IsPalindrome<
  Stringify<T>
>;
