import type { IsNever } from "./never";
import type { Not } from "./not";

type _IsUnion<T, U = T> =
  IsNever<T> extends true
    ? false
    : T extends U
      ? Not<IsNever<Exclude<U, T>>>
      : false;

/** -------------------------------------------------------
 * * ***Utility Type: `IsUnion`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a union.**
 * @template T - The type to check.
 * @example
 * type Case1 = IsUnion<'a' | 'b'>;
 * // ➔ true
 * type Case2 = IsUnion<'a'>;
 * // ➔ false
 */
export type IsUnion<T> = _IsUnion<T, T>;
