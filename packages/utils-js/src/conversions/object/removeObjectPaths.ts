import type {
  ConfigRemoveObjectPaths,
  ResultRemoveObjectPaths
} from "./_private/removeObjectPaths.types";

import { isBoolean } from "@/predicates/is/isBoolean";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyObject } from "@/predicates/is/isEmptyObject";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";

import { assertIsArray } from "@/assertions/objects/assertIsArray";
import { assertIsString } from "@/assertions/strings/assertIsString";

import { deepCloneSafe } from "./_private/utils/deepCloneSafe";
import { deleteNestedKey } from "./_private/utils/deleteNestedKey";
import { safeStableStringify } from "../stringify/safeStableStringify";
import { deleteExactPathOnce } from "./_private/utils/deleteExactPathOnce";

/** ------------------------------------------------------------------------
 * * ***Utility: `removeObjectPaths`.***
 * ------------------------------------------------------------------------
 * **Deletes multiple keys (shallow or deeply nested) from an object.**
 * - **Features:**
 *    - Removes one or more keys from an object based on their paths (supports dot notation for nested properties).
 *    - Can delete deeply from all matching nested levels (even inside arrays) when `deep: true`.
 *    - By default does **not mutate** the original object. Clones it first.
 *   Set `deepClone = false` to mutate in place (useful for performance on large data).
 *    - Ensures type safety on `key` paths via `DotPath<T>`, reducing accidental invalid paths.
 * - **Behavior:**
 *    - When `deep: false` (default), only deletes the direct property at the specified path.
 *    - When `deep: true`, searches deeply and recursively deletes the key from all levels,
 *   including inside arrays of objects (applies the *same* path repeatedly).
 *    - Skips deletion if the specified path does not exist — no error is thrown.
 * - **Edge Handling:**
 *    - If `object` is `null` or not an object, returns an empty object.
 *    - If `keysToDelete` is not an array of `{ key, deep? }` objects, throws a `TypeError`.
 *    - Ignores invalid intermediate paths (will skip those branches without throwing).
 * @template T - The shape of the input object, used for type-safe dot paths.
 * @param {Record<string, unknown>} object - ***The object to remove keys from, must be an object or will return `{}`.***
 * @param {ConfigRemoveObjectPaths<T>[]} keysToDelete
 *  ***An array of instructions:***
 *   - `key`: A string path using dot notation (e.g. `"user.profile.name"`).
 *   - `deep`: If `true`, will recursively remove all instances of the key path at any depth, defaultValue: `false`.
 * @param {boolean|undefined} [deepClone=true]
 *  ***Whether to deep clone the original object before modifying.***
 *   - `true` (default): returns a *new object* with the specified keys removed.
 *   - `false`: modifies the original object in place and returns it.
 * @returns {Partial<T>}
 *   - A new object with specified keys removed if `deepClone` is `true`.
 *   - The *same mutated object* if `deepClone` is `false`.
 * @throws **{@link TypeError | `TypeError`}** if `keysToDelete` is not an array of `{ key, deep? }` objects.
 * @example
 * // Shallow deletion
 * removeObjectPaths(
 *   { a: 1, b: 2, c: { d: 3 } },
 *   [{ key: "b" }]
 * );
 * // ➔ { a: 1, c: { d: 3 } }
 *
 * // Nested deletion (shallow, removes only exact path)
 * removeObjectPaths(
 *   { user: { profile: { name: "Alice", age: 30 } } },
 *   [{ key: "user.profile.age" }]
 * );
 * // ➔ { user: { profile: { name: "Alice" } } }
 *
 * // Deep deletion (recursively removes key from all levels and arrays)
 * removeObjectPaths(
 *   { items: [{ price: 10 }, { price: 20, details: { price: 30 } }] },
 *   [{ key: "price", deep: true }]
 * );
 * // ➔ { items: [{}, { details: {} }] }
 *
 * // Without cloning: mutates original object
 * const obj = { x: 1, y: 2 };
 * removeObjectPaths(obj, [{ key: "y" }], false);
 * console.log(obj); // ➔ { x: 1 }
 *
 * // No matching path — returns unchanged object
 * removeObjectPaths({}, [{ key: "a" }]);
 * // ➔ {}
 *
 * // 🚫 Invalid usage — `keysToDelete` is not an array
 * removeObjectPaths({}, "a");
 * // ➔ throws TypeError
 *
 * // 🚫 Invalid usage — missing `key` property in array element
 * removeObjectPaths({}, [{ deep: true }]);
 * // ➔ throws TypeError
 */
export function removeObjectPaths<
  T extends Record<string, unknown>,
  K extends ConfigRemoveObjectPaths<T>[]
>(
  object: T,
  keysToDelete: K,
  deepClone: boolean = true
): ResultRemoveObjectPaths<T, K> {
  if (isEmptyObject(object, { checkSymbols: true }))
    return {} as ResultRemoveObjectPaths<T, K>;

  assertIsArray(keysToDelete, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`keysToDelete\`) must be of type \`${validType}\` with value of { key: string, deep?: boolean } plain-object, but received: \`${currentType}\`, with value: \`${safeStableStringify(
        keysToDelete,
        { keepUndefined: true }
      )}\`.`
  });

  if (!keysToDelete.every((k) => isPlainObject(k) && "key" in k)) {
    throw new TypeError(
      `Each element in Second Parameter (\`keysToDelete\`) must be of type \`plain-object\` with at least a "key" property (optionally "deep"), but received: \`${safeStableStringify(
        keysToDelete,
        { keepUndefined: true }
      )}\`.`
    );
  }

  let result = deepClone ? deepCloneSafe(object) : object;

  for (const { key, deep } of keysToDelete) {
    assertIsString(key, {
      message: ({ currentType, validType }) =>
        `Parameter \`key\` at Second Parameter (\`keysToDelete\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
    });

    if (!isUndefined(deep) && !isBoolean(deep)) {
      throw new TypeError(
        `Parameter \`deep\` at Second Parameter (\`keysToDelete\`) ➔ (key: "${key}", deep: ${deep}) must be of type \`boolean\` or \`undefined\`, but received: \`${getPreciseType(
          deep
        )}\`.`
      );
    }

    const path = key.split(".");
    result = deep
      ? deleteNestedKey(result, path)
      : deleteExactPathOnce(result, path);
  }

  return result as ResultRemoveObjectPaths<T, K>;
}
