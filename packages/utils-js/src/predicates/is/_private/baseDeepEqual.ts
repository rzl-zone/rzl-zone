import type { CustomizerIsEqualWith } from "./types.isEqualWith";

import { isMap } from "../isMap";
import { isSet } from "../isSet";
import { isDate } from "../isDate";
import { isArray } from "../isArray";
import { isError } from "../isError";
import { isRegExp } from "../isRegExp";
import { isUndefined } from "../isUndefined";
import { isArrayBuffer } from "../isArrayBuffer";
import { isObjectOrArray } from "../isObjectOrArray";

/** -------------------------------------------------------------------
 * * ***Base function (**Internal**) for deep equality comparison with optional customizer.***
 * -------------------------------------------------------------------
 * **Recursively checks whether `value` and `other` are deeply equal. Supports custom comparison
 * via `customizer`, and handles arrays, objects, maps, sets, dates, errors, regexps, typed arrays,
 * and nested structures.**
 * @param value
 * - The value to compare.
 * @param other
 * - The other value to compare against.
 * @param customizer
 * - Optional function to customize the comparison for each property/value.
 * @param seen
 * - WeakMap used internally to track circular references and prevent infinite recursion.
 * @returns
 * - `true`  → `value` and `other` are deeply equal.
 * - `false` → `value` and `other` are not deeply equal.
 * @example
 * ```ts
 * const obj1 = { name: "Alice", scores: [1, 2, 3] };
 * const obj2 = { name: "alice", scores: [1, 2, 3] };
 * const customizer: CustomizerIsEqualWith = (v, o) => {
 *   if (typeof v === "string" && typeof o === "string") {
 *     return v.toLowerCase() === o.toLowerCase();
 *   }
 * };
 *
 * baseDeepEqual(obj1, obj2, customizer);
 * // returns true
 * ```
 */
export function baseDeepEqual(
  value: unknown,
  other: unknown,
  customizer?: CustomizerIsEqualWith,
  seen: WeakMap<object, object> = new WeakMap()
): boolean {
  // ✅ Strict equality (+0 === -0)
  if (value === other) return true;

  // ✅ NaN === NaN
  if (value !== value && other !== other) return true;

  // ❌ Primitives mismatch
  if (!isObjectOrArray(value) || !isObjectOrArray(other)) {
    return false;
  }

  // ✅ Prevent circular recursion
  if (seen.get(value) === other) return true;
  seen.set(value, other);

  // ✅ Customizer support
  const callCustomizer = (
    v: unknown,
    o: unknown,
    key: PropertyKey,
    valObj: unknown,
    othObj: unknown
  ) => {
    if (customizer) {
      const result = customizer(v, o, key, valObj, othObj, seen);
      if (!isUndefined(result)) return result;
    }
    return baseDeepEqual(v, o, customizer, seen);
  };

  // ✅ Handle special instances
  if (isDate(value) && isDate(other))
    return value.getTime() === other.getTime();

  if (isRegExp(value) && isRegExp(other))
    return value.source === other.source && value.flags === other.flags;

  if (isError(value) && isError(other))
    return value.name === other.name && value.message === other.message;

  if (ArrayBuffer.isView(value) && ArrayBuffer.isView(other)) {
    const v = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    const o = new Uint8Array(other.buffer, other.byteOffset, other.byteLength);
    if (v.length !== o.length) return false;
    for (let i = 0; i < v.length; i++) if (v[i] !== o[i]) return false;
    return true;
  }

  if (isArrayBuffer(value) && isArrayBuffer(other)) {
    if (value.byteLength !== other.byteLength) return false;
    const v = new Uint8Array(value),
      o = new Uint8Array(other);
    for (let i = 0; i < v.length; i++) if (v[i] !== o[i]) return false;
    return true;
  }

  if (isMap(value) && isMap(other)) {
    if (value.size !== other.size) return false;
    for (const [k, v] of value) {
      if (!other.has(k)) return false;
      if (!baseDeepEqual(v, other.get(k), customizer, seen)) return false;
    }
    return true;
  }

  if (isSet(value) && isSet(other)) {
    if (value.size !== other.size) return false;
    for (const v of value) {
      let matched = false;
      for (const o of other) {
        if (baseDeepEqual(v, o, customizer, seen)) {
          matched = true;
          break;
        }
      }
      if (!matched) return false;
    }
    return true;
  }

  if (isArray(value) && isArray(other)) {
    if (value.length !== other.length) return false;
    for (let i = 0; i < value.length; i++) {
      if (!callCustomizer(value[i], other[i], i, value, other)) return false;
    }
    return true;
  }

  if (Object.getPrototypeOf(value) !== Object.getPrototypeOf(other)) {
    return false;
  }

  const vKeys = Reflect.ownKeys(value);
  const oKeys = Reflect.ownKeys(other);
  if (vKeys.length !== oKeys.length) return false;

  for (const key of vKeys) {
    const vVal = value[key];
    const oVal = other[key];
    if (!callCustomizer(vVal, oVal, key, value, other)) return false;
  }

  return true;
}
