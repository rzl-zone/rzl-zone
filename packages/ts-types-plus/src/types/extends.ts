import type { IsEmptyArray } from "./array";
import type { If } from "./if";
import type { Not } from "./not";
import type { Pop } from "./pop";

/** -------------------------------------------------------
 * * ***Utility Type: `Extends`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the first argument ***extends*** the second argument.**
 * @template T - The type to check.
 * @template Base - The type to compare against.
 * @example
 * ```ts
 * type A = Extends<1, number>;  // ➔ true
 * type B = Extends<number, 1>;  // ➔ false
 * ```
 */
export type Extends<T, Base> = [T] extends [Base] ? true : false;

/** -------------------------------------------------------
 * * ***Utility Type: `NotExtends`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the first argument does ***not extend*** the second argument.**
 * @template T - The type to check.
 * @template Base - The type to compare against.
 * @example
 * ```ts
 * type A = NotExtends<1, number>; // ➔ false
 * type B = NotExtends<number, 1>; // ➔ true
 * ```
 */
export type NotExtends<T, Base> = Not<Extends<T, Base>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfExtends`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the third argument if the first argument ***extends*** the second
 *        argument, otherwise returns the fourth argument.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The type to check.
 * @template Base - The type to compare against.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfExtends<1, number, "valid">;
 * // ➔ "valid"
 * type B = IfExtends<1, string, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
export type IfExtends<T, Base, IfTrue = true, IfFalse = false> = If<
  Extends<T, Base>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IfNotExtends`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the third argument if the first argument does ***not extend*** the
 *        second argument, otherwise returns the fourth argument.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - The type to check.
 * @template Base - The type to compare against.
 * @template IfTrue - The branch type if condition is met, (default: `true`).
 * @template IfFalse - The branch type if condition is not met, (default: `false`).
 * @example
 * ```ts
 * type A = IfNotExtends<1, string, "valid">;
 * // ➔ "valid"
 * type B = IfNotExtends<1, number, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
export type IfNotExtends<T, Base, IfTrue = true, IfFalse = false> = If<
  NotExtends<T, Base>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `ExtendsArr`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether every element of the first array argument ***extends*** the second argument.**
 * @template T - The array to check.
 * @template Base - The type to compare each element against.
 * @example
 * ```ts
 * type A = ExtendsArr<[1, 2, 3], number>;
 * // ➔ true
 * type B = ExtendsArr<[1, "2", 3], number>;
 * // ➔ false
 * ```
 */
export type ExtendsArr<T extends readonly unknown[], Base> =
  IsEmptyArray<T> extends true
    ? true
    : Pop<T, { includeRemoved: true }> extends readonly [
          infer Rest extends readonly unknown[],
          infer Removed
        ]
      ? Extends<Removed, Base> extends true
        ? ExtendsArr<Rest, Base>
        : false
      : false;
