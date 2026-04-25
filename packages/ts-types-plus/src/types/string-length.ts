import type { IsEmptyString } from "./string";
import type { Sum } from "./sum";

/** @ts-expect-error this still safe not to much deep */
// prettier-ignore
type _safeSum<Parts extends [string[], string[], string[], string[]] = [[], [], [], []]> = Sum<
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
export type StringLength<S extends string> = _StringLength<S>;

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
export type CompareStringLength<
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
export type IsShorterString<
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
export type IsLongerString<
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
export type IsSameLengthString<
  Str1 extends string,
  Str2 extends string
> = CompareStringLength<Str1, Str2, false, false, true>;
