import type { NotExtends } from "./extends";
import type { If } from "./if";

/** -------------------------------------------------------
 * * ***Utility Type: `IsTuple`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the first array argument is fixed length tuple.**
 * @template T - The array to check.
 * @example
 * type Case1 = IsTuple<[1, 2, 3]>; // ➔ true
 * type Case2 = IsTuple<number[]>;  // ➔ false
 */
export type IsTuple<T extends readonly unknown[]> = NotExtends<
  number,
  T["length"]
>;

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
export type IfTuple<
  T extends readonly unknown[],
  IfTrue = true,
  IfFalse = false
> = If<IsTuple<T>, IfTrue, IfFalse>;
