import type { CustomizerIsMatchWith } from "./types.isMatchWith";

import { isArray } from "../isArray";
import { isUndefined } from "../isUndefined";
import { isMatchWith } from "../isMatchWith";
import { isObjectOrArray } from "../isObjectOrArray";

// #Private - local
function isSameValue(x: unknown, y: unknown): boolean {
  return (
    x === y || (x === 0 && y === 0) || (Number.isNaN(x) && Number.isNaN(y))
  );
}

/** -------------------------------------------------------------------
 * * ***Base function (**Internal**) for matching objects with optional customizer.***
 * -------------------------------------------------------------------
 * **Recursively checks whether `object` matches `source`. Supports custom comparison
 * via `customizer`, and handles arrays, objects, and nested structures.**
 *
 * ---
 * @param object
 * - The object to test against the `source`.
 * @param source
 * - The source object to match.
 * @param customizer
 * - Optional function to customize the comparison for each property/value.
 *
 * ---
 * @returns
 * - `true`  ➔ `object` matches `source`.
 * - `false` ➔ `object` does not match `source`.
 *
 * ---
 * @example
 * ```ts
 * const obj = { name: "Alice", age: 30 };
 * const src = { name: "alice" };
 * const customizer: CustomizerIsMatchWith = (value, other) => {
 *   if (typeof value === "string" && typeof other === "string") {
 *     return value.toLowerCase() === other.toLowerCase();
 *   }
 * };
 *
 * baseIsMatch(obj, src, customizer);
 * // ➔ true
 * ```
 */
export function baseIsMatch(
  object: unknown,
  source: unknown,
  customizer?: CustomizerIsMatchWith
): boolean {
  if (object === source) return true;

  if (!isObjectOrArray(source)) {
    return isSameValue(object, source);
  }

  if (!isObjectOrArray(object)) {
    return false;
  }

  const keys = Reflect.ownKeys(source).filter(
    (k) => !(isArray(source) && k === "length")
  );

  for (const key of keys) {
    if (!(key in object)) return false;

    const objValue = object[key];
    const srcValue = source[key];

    const result = customizer?.(objValue, srcValue, key, object, source);
    if (!isUndefined(result)) {
      if (!result) return false;
      continue; // skip default comparison
    }

    if (isObjectOrArray(objValue) && isObjectOrArray(srcValue)) {
      if (!isMatchWith(objValue, srcValue, customizer)) return false;
    } else {
      if (!isSameValue(objValue, srcValue)) return false;
    }
  }

  return true;
}
