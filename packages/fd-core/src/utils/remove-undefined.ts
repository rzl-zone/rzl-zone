/** --------------------------------------------------------------------------
 * * ***Remove `undefined` properties from an object.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Removes properties whose value is strictly `undefined`.
 *    - Mutates the original object in-place.
 *    - Optionally performs deep cleanup on nested objects and arrays.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Only keys with value `undefined` are removed.
 * - Other falsy values (`null`, `false`, `0`, `""`) are preserved.
 * - When `deep` is enabled, nested objects and array items are processed recursively.
 *
 * ---
 *
 * 🧩 ***Deep mode details:***
 * - Traverses plain objects and arrays.
 * - Recursively removes `undefined` values from all nested levels.
 * - Array structure is preserved (items are not removed, only cleaned).
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - This function **mutates the input object**.
 * - Circular references are **not handled** and may cause infinite recursion.
 * - Intended for data normalization, not immutable transformations.
 *
 * ---
 *
 * - ***Designed for:***
 *    - API payload cleanup
 *    - Serialization-safe object preparation
 *    - Removing optional fields before persistence
 *
 * @template T - The input object type.
 *
 * @param value - Target object to clean.
 * @param deep - Whether to remove `undefined` values recursively, default: `false`.
 *
 * @returns
 * The same object reference with `undefined` properties removed.
 *
 * @example
 * ```ts
 * removeUndefined({
 *   a: 1,
 *   b: undefined,
 *   c: null
 * });
 * // ➔ { a: 1, c: null }
 * ```
 *
 * @example
 * ```ts
 * removeUndefined(
 *   {
 *     a: undefined,
 *     b: { c: undefined, d: 2 },
 *     e: [{ f: undefined }]
 *   },
 *   true
 * );
 * // ➔ { b: { d: 2 }, e: [{}] }
 * ```
 */
export function removeUndefined<T extends object>(value: T, deep = false): T {
  const obj = value as Record<string, unknown>;

  for (const key in obj) {
    if (obj[key] === undefined) delete obj[key];
    if (!deep) continue;

    const entry = obj[key];

    if (typeof entry === "object" && entry !== null) {
      removeUndefined(entry, deep);
      continue;
    }

    if (Array.isArray(entry)) {
      for (const item of entry) removeUndefined(item, deep);
    }
  }

  return value;
}
