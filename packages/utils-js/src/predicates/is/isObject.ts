import type { AnObjectNonArray, IsArray } from "@rzl-zone/ts-types-plus";
import type { IsHasKeysObject } from "./_private/_types";

import { isNil } from "./isNil";
import { isArray } from "./isArray";

type IsObject<T> = unknown extends T
  ? T & Record<PropertyKey, unknown>
  : T extends object
    ? T extends AnObjectNonArray
      ? T
      : IsHasKeysObject<T> extends false
        ? T & Record<PropertyKey, unknown>
        : IsArray<T> extends true
          ? Exclude<T, unknown[]>
          : T
    : never;

/** ---------------------------------------------------------
 * * ***Type guard: `isObject`.***
 * ----------------------------------------------------------
 * **Checks if a value is an **object** (excluding `null` and `arrays`).**
 * - **✅ Returns `true` for any non-null object (arrays excluded), including:**
 *    - Plain-objects (`{}`, `Object.create(null)`)
 *    - Custom class instances
 *    - Built-ins: `Date`, `RegExp`, `Error`, `URL`, `URLSearchParams`
 *    - Collections: `Map`, `Set`, `WeakMap`, `WeakSet`
 *    - Binary/typed data: `ArrayBuffer`, `DataView`, typed arrays (`Uint8Array`, `Int32Array`, etc.)
 *    - DOM/Node objects: `HTMLElement`, `DocumentFragment`, etc.
 *    - Proxies (wrapping any object type)
 * - **❌ Returns `false` for:**
 *    - `null`
 *    - Arrays (`[]`, `new Array()`)
 *    - Functions (regular functions, arrow functions, class constructors)
 *    - Primitives: `string`, `number`, `boolean`, `symbol`, `bigint`
 *    - Boxed primitives: `new String()`, `new Number()`, `new Boolean()`
 *    - `undefined` (including `NaN`, which is a primitive number)
 * - **ℹ️ Note:**
 *    - If you specifically need to check for ***plain-objects*** only, use ***`isPlainObject` utility function*** instead.
 *    - If you specifically need to check for ***object***, ***plain-objects***, and include ***array***, use ***`isObjectOrArray` utility function*** instead.
 * @template T - The type of the value being checked.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a ***plain-objects***, otherwise `false`.
 * @example
 * isObject({});                  // ➔ true
 * isObject(Object.create(null)); // ➔ true
 * isObject(new Date());          // ➔ true
 * isObject(new Map());           // ➔ true
 * isObject(new Uint8Array());    // ➔ true
 * isObject(new String("x"));     // ➔ true
 * isObject([]);                  // ➔ false
 * isObject(null);                // ➔ false
 * isObject(undefined);           // ➔ false
 * isObject(123);                 // ➔ false
 * isObject(() => {});            // ➔ false
 */
export function isObject<T extends object>(value: T): value is IsObject<T>;
export function isObject(value: unknown): value is Record<PropertyKey, unknown>;
export function isObject(value: unknown): boolean {
  return typeof value === "object" && !isNil(value) && !isArray(value);
}
