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
export type Not<T extends boolean> = T extends true ? false : true;
