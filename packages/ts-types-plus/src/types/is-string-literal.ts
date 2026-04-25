import type { Extends } from "./extends";
import type { If } from "./if";

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
export type IsStringLiteral<T> = If<
  Extends<T, string>,
  Extends<string, T> extends true ? false : true
>;
