import type { AnyFunction } from "@rzl-zone/ts-types-plus";
import { isLength } from "./isLength";
import { isObjectOrArray } from "./isObjectOrArray";

/** ----------------------------------------------------
 * * ***Type guard: `isArrayLikeObject`.***
 * ----------------------------------------------------
 * **This method is like ***`isArrayLike` utility function*** except that
 *   it also checks if `value` is an object.**
 * @template T - The type of the value being checked.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `array-like object`, else `false`.
 * @example
 * isArrayLikeObject([1, 2, 3]);
 * // ➔ true
 * isArrayLikeObject(document.body.children);
 * // ➔ true
 * isArrayLikeObject('abc');
 * // ➔ false
 * isArrayLikeObject(noop);
 * // ➔ false
 */
export function isArrayLikeObject<T extends { __anyHack: unknown }>(
  value: T
): boolean;
export function isArrayLikeObject(
  value: AnyFunction | string | boolean | number | null | undefined
): value is never;
export function isArrayLikeObject(
  value: unknown
): value is object & { length: number };
export function isArrayLikeObject(value: unknown) {
  return isObjectOrArray(value) && isLength(value.length);
}
