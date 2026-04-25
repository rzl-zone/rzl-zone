import type { If } from "./if";
import type { IfExtends } from "./extends";
import type { IsEmptyString } from "./string";

/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link LastCharacter | `LastCharacter`}.***
 * ---------------------------------------------------------------------------
 */
export type LastCharacterOptions = {
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
export type LastCharacter<
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
