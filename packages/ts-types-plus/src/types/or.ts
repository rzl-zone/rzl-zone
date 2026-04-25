import type { IfExtends } from "./extends";

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
export type Or<Condition1, Condition2> = IfExtends<
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
export type OrArr<Conditions extends readonly unknown[]> =
  true extends Conditions[number] ? true : false;
