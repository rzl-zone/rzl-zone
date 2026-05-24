/* eslint-disable @typescript-eslint/no-explicit-any */
import type { List, EmptyObjectOf } from "./_private/types.isEmpty";

import { isNil } from "./isNil";
import { isMap } from "./isMap";
import { isSet } from "./isSet";
import { isArray } from "./isArray";
import { isBuffer } from "./isBuffer";
import { isNumber } from "./isNumber";
import { isSymbol } from "./isSymbol";
import { isString } from "./isString";
import { isBoolean } from "./isBoolean";
import { isFunction } from "./isFunction";
import { isArguments } from "./isArgument";
import { isTypedArray } from "./isTypedArray";
import { isPlainObject } from "./isPlainObject";

/** ---------------------------------------------------------
 * * ***Predicate: `isEmpty`.***
 * ----------------------------------------------------------
 * **Checks if `value` is an empty object, collection, map, or set.**
 *
 * ---
 * - **Behavior:**
 *     - **Objects** are empty if they have no own enumerable string keyed properties.
 *     - **Array-like values** (arrays, strings, `arguments`, typed arrays, buffers)
 *       are empty if their `length` is `0`.
 *     - **Maps** and **Sets** are empty if their `size` is `0`.
 *     - **Booleans**, **numbers** (including `NaN`), **symbols**, and `null`/
 *       `undefined` are treated as empty.
 *     - **Functions** are considered empty if they have no own enumerable keys.
 *
 * ---
 * - **Note:**
 *     - For more `Strict`, you can use
 *       ***`isEmptyValue` utility function*** instead.
 *
 * ---
 * @template T - The type of the value being checked.
 *
 * ---
 * @param {*} value The value to check.
 *
 * ---
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 *
 * ----
 * @example
 * isEmpty(null);
 * // ➔ true
 * isEmpty(true);
 * // ➔ true
 * isEmpty(false);
 * // ➔ true
 * isEmpty(1);
 * // ➔ true
 * isEmpty(0);
 * // ➔ true
 * isEmpty(Symbol("x"));
 * // ➔ true
 * isEmpty(() => {});
 * // ➔ true
 * isEmpty("");
 * // ➔ true
 * isEmpty("   ");
 * // ➔ false
 * isEmpty([1, 2, 3]);
 * // ➔ false
 * isEmpty({ 'a': 1 });
 * // ➔ false
 */
export function isEmpty<T extends { __trapAny: any }>(value?: T): boolean;
export function isEmpty(value: string): value is "";
export function isEmpty(
  value: Map<any, any> | Set<any> | List<any> | null | undefined
): boolean;
export function isEmpty(value: object): boolean;
export function isEmpty<T extends object>(
  value: T | null | undefined
): value is EmptyObjectOf<T> | null | undefined;
export function isEmpty(value: any): boolean;
export function isEmpty(value: unknown) {
  // null / undefined
  if (isNil(value)) return true;

  // Boolean, number, symbol
  if (
    isBoolean(value) ||
    isNumber(value, { includeNaN: true }) ||
    isSymbol(value)
  )
    return true;

  // Function ➔ treat like object: check own enumerable keys
  if (isFunction(value)) {
    return Object.keys(value).length === 0;
  }

  // String / Array-like
  if (
    isString(value) ||
    isArray(value) ||
    isArguments(value) ||
    isTypedArray(value)
  ) {
    return value.length === 0;
  }

  // Map / Set
  if (isMap(value) || isSet(value)) {
    return value.size === 0;
  }

  // Buffer
  if (isBuffer(value)) {
    return value.length === 0;
  }

  // Object (check own enumerable keys)
  if (isPlainObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}
