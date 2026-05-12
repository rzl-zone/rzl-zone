import type { AnyFunction } from "@rzl-zone/ts-types-plus";

import { isLength } from "./isLength";
import { isFunction } from "./isFunction";
import { isObjectOrArray } from "./isObjectOrArray";

/** ----------------------------------------------------
 * * ***Type guard: `isArrayLike`.***
 * ----------------------------------------------------
 * **Checks if `value` is array-like, a value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.**
 * @template T - The type of the value being checked.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 * isArrayLike([1, 2, 3]);
 * // ➔ true
 * isArrayLike(document.body.children);
 * // ➔ true
 * isArrayLike(noop);
 * // ➔ false
 * isArrayLike('abc');
 * // ➔ false
 */
export function isArrayLike<T extends { __anyHack: unknown }>(
  value: T
): boolean;
export function isArrayLike(
  value: AnyFunction | null | undefined
): value is never;
export function isArrayLike(value: unknown): value is { length: number };
export function isArrayLike(value: unknown) {
  return (
    !isFunction(value) && isObjectOrArray(value) && isLength(value?.length)
  );
}
