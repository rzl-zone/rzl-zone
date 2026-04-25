/** -------------------------------------------------------
 * * ***Utility Type: `IsLetter`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a letter (Only for letters that have both upper and lower case).**
 * @template T - The string to check.
 * @example
 * type Case1 = IsLetter<'a'>; // ➔ true
 * type Case2 = IsLetter<'1'>; // ➔ false
 */
export type IsLetter<T extends string> =
  Uppercase<T> extends Lowercase<T> ? false : true;
