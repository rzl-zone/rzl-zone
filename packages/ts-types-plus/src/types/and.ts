import type { Extends, IfExtends } from "./extends";

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
export type And<Condition1, Condition2> = IfExtends<
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
export type AndArr<Conditions extends readonly unknown[]> =
  Extends<[], Conditions> extends true
    ? false
    : Extends<Conditions[number], true>;
