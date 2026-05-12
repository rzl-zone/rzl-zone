import type {
  AnObjectNonArray,
  Extends,
  IsNever,
  OrArr
} from "@rzl-zone/ts-types-plus";

import { isArray } from "@/predicates/is/isArray";
import { isObject } from "@/predicates/is/isObject";
import type { IsHasKeysObject } from "./_private/_types";

type IsObjectOrArray<T> =
  OrArr<
    [IsNever<T>, Extends<T, Record<PropertyKey, unknown>>, Extends<unknown, T>]
  > extends true
    ? T & Record<PropertyKey, unknown> & unknown[]
    : T extends object
      ? T extends unknown[]
        ? T
        : T extends AnObjectNonArray
          ? T
          : IsHasKeysObject<T> extends false
            ? T & Record<PropertyKey, unknown>
            : T
      : Extract<T, Record<PropertyKey, unknown> & unknown[]>;

/** ---------------------------------------------------------
 * * ***Type guard: `isObjectOrArray`.***
 * ----------------------------------------------------------
 * **Checks if a value is an **object** or an **array**.**
 * - **✅ Returns `true` for:**
 *    - Plain objects (`{}`, `Object.create(null)`)
 *    - Custom objects
 *    - Arrays (`[]`, `[1,2,3]`)
 * - **❌ Returns `false` for:**
 *    - `null`
 *    - `undefined`
 *    - Primitives:
 *        - `string`
 *        - `number`
 *        - `boolean`
 *        - `symbol`
 *        - `bigint`
 *    - Functions
 * @template T - The type of the value being checked.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is an `object` or `array`.
 * @example
 * isObjectOrArray([1,2,3]);           // ➔ true
 * isObjectOrArray({ name: "Alice" }); // ➔ true
 * isObjectOrArray(null);              // ➔ false
 * isObjectOrArray(undefined);         // ➔ false
 * isObjectOrArray("hello");           // ➔ false
 */
export function isObjectOrArray(value: []): value is [];
export function isObjectOrArray<T>(value: T): value is IsObjectOrArray<T>;
export function isObjectOrArray<T>(value: T): boolean {
  return isArray(value) || isObject(value);
}
