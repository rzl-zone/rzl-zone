import type { NonPlainObject } from "@rzl-zone/ts-types-plus";

import { isObject } from "@/predicates/is/isObject";
import type { IsHasKeysObject } from "./_private/_types";

/** ----------------------------------------------------------
 * * ***Utility type: `IsPlainObjectResult`.***
 * ----------------------------------------------------------
 * **Represents the inferred type after asserting a value is a **plain object**.**
 * - **Behavior:**
 *    - If `T` is `unknown`, the resulting type is `Record<PropertyKey, unknown> & T`.
 *    - If `T` is an object:
 *        - If it is a non-plain object (class instance, built-in object, etc.), the result is `never`.
 *        - If it has no keys (`IsHasKeysObject<T>` checked by **{@link IsHasKeysObject|`IsHasKeysObject`}** is false), the result is `Record<PropertyKey, unknown> & T`.
 *        - Otherwise, the result is `T` itself.
 *    - For any other types, the result is `never`.
 * @template T - The input type to be asserted as a plain object.
 * @example
 * ```ts
 * type A = IsPlainObjectResult<unknown>;
 * // ➔ Record<PropertyKey, unknown> & unknown
 * type B = IsPlainObjectResult<{}>;
 * // ➔ Record<PropertyKey, unknown> & {}
 * type C = IsPlainObjectResult<{ foo: string }>;
 * // ➔ { foo: string }
 * type D = IsPlainObjectResult<Date>;
 * // ➔ never
 * ```
 */
export type IsPlainObjectResult<T> = unknown extends T
  ? Record<PropertyKey, unknown> & T
  : T extends object
    ? T extends NonPlainObject
      ? never
      : IsHasKeysObject<T> extends false
        ? Record<PropertyKey, unknown> & T
        : T
    : Extract<T, Record<PropertyKey, unknown>>;

/** ----------------------------------------------------------
 * * ***Type guard: `isPlainObject`.***
 * ----------------------------------------------------------
 * **Checks if a value is a **plain-object**.**
 * - **A plain object is:**
 *    - Created by the `Object` constructor, or
 *    - Has a `[[Prototype]]` of `null` (e.g. `Object.create(null)`).
 * - **✅ Returns `true` for:**
 *    - Empty object literals: `{}`
 *    - Objects with null prototype: `Object.create(null)`
 * - **❌ Returns `false` for:**
 *    - Arrays (`[]`, `new Array()`)
 *    - Functions (regular, arrow, or class constructors)
 *    - Built-in objects: `Date`, `RegExp`, `Error`, `Map`, `Set`, `WeakMap`, `WeakSet`
 *    - Boxed primitives: `new String()`, `new Number()`, `new Boolean()`
 *    - `null` or `undefined`
 *    - Symbols
 *    - Class instances
 * @template T - The type of the value being checked.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if `value` is a `plain-object`, otherwise `false`.
 * @example
 * isPlainObject({});
 * // ➔ true
 * isPlainObject(Object.create(null));
 * // ➔ true
 * isPlainObject(null);
 * // ➔ false
 * isPlainObject(() => {});
 * // ➔ false
 * isPlainObject([1, 2, 3]);
 * // ➔ false
 * isPlainObject(new Date());
 * // ➔ false
 * isPlainObject(new MyClass());
 * // ➔ false
 * isPlainObject(new String("x"));
 * // ➔ false
 */
export function isPlainObject<T>(value: T): value is IsPlainObjectResult<T>;
export function isPlainObject<T>(
  value: T
): value is NonNullable<Extract<T, Record<PropertyKey, unknown>>>;
export function isPlainObject(value: unknown) {
  if (!isObject(value)) return false;

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
