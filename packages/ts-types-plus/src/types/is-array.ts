import type { And, AndArr } from "./and";
import type { IsAny } from "./any";
import type { Extends, NotExtends } from "./extends";
import type { Mutable } from "./mutable";
import type { IsNever } from "./never";
import type { Not } from "./not";

/** -------------------------------------------------------
 * * ***Utility Type: `IsArray`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is an array.**
 * @example
 * type Case1 = IsArray<[]>;
 * // ➔ true
 * type Case2 = IsArray<string>;
 * // ➔ false
 */
export type IsArray<T> = AndArr<
  [Not<IsAny<T>>, Not<IsNever<T>>, Extends<T, readonly unknown[]>]
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsMutableArray`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a mutable array.**
 * @example
 * type Case1 = IsMutableArray<[]>;
 * // ➔ true
 * type Case2 = IsMutableArray<readonly []>;
 * // ➔ false
 */
export type IsMutableArray<T> = And<IsArray<T>, NotExtends<Readonly<T>, T>>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsReadonlyArray`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a read-only array.**
 * @example
 * type Case1 = IsReadonlyArray<readonly []>;
 * // ➔ true
 * type Case2 = IsReadonlyArray<[]>;
 * // ➔ false
 */
export type IsReadonlyArray<T> = And<IsArray<T>, NotExtends<T, Mutable<T>>>;
