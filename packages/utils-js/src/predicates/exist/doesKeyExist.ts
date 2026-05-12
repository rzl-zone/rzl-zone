import { isArray } from "../is/isArray";
import { isPropertyKey } from "../is/isPropertyKey";
import { isObjectOrArray } from "../is/isObjectOrArray";
import { getPreciseType } from "../type/getPreciseType";

/** ----------------------------------------------------------
 * * ***Predicate: `doesKeyExist`.***
 * ----------------------------------------------------------
 * **Recursively checks if a given key exists in an object or array.**
 * - **Behavior:**
 *    - **Supports deeply nested objects and arrays**, searching recursively.
 *    - Uses `Object.prototype.hasOwnProperty.call()` to safely check if the
 *      key exists at each level, even if its value is `null` or `undefined`.
 *    - Optimized to return `true` immediately when the key is found (short-circuits).
 *    - Handles edge cases gracefully:
 *      - Returns `false` for `null`, `undefined`, or non-object inputs.
 *      - Returns `false` if key is not found anywhere, even in deeply nested
 *        structures.
 * - **ℹ️ Note:**
 *    - This function only checks for **the existence of the key itself**,
 *      not whether its value is non-null or non-undefined.
 *    - If you need to check for both existence and meaningful value, write a stricter function.
 * @template T - The type of the input object or array.
 * @param {T | Record<string, unknown> | unknown[]} object - The object or array to search.
 * @param {PropertyKey} key - The key to look for (string, number, or symbol).
 * @returns {boolean} Returns `true` if the key exists anywhere in the object or array (even with `null` / `undefined` value), otherwise `false`.
 * @example
 * doesKeyExist({ name: "John", age: 30 }, "age");
 * // ➔ true
 * doesKeyExist({ user: { profile: { email: "test@example.com" } } }, "email");
 * // ➔ true
 * doesKeyExist([{ id: 1 }, { id: 2 }], "id");
 * // ➔ true
 * doesKeyExist({ a: { b: { c: 10 } } }, "d");
 * // ➔ false
 * doesKeyExist(null, "name");
 * // ➔ false
 * doesKeyExist(undefined, "test");
 * // ➔ false
 *
 * // Key exists even if value is null or undefined:
 * doesKeyExist({ a: null, b: undefined, c: { d: null } }, "a"); // ➔ true
 * doesKeyExist({ a: null, b: undefined, c: { d: null } }, "b"); // ➔ true
 * doesKeyExist({ a: null, b: undefined, c: { d: null } }, "d"); // ➔ true
 *
 * doesKeyExist({ a: 1 }, true);
 * // ➔ ❌ Throws TypeError
 * doesKeyExist({ a: 1 }, ["not", "valid"]);
 * // ➔ ❌ Throws TypeError
 */
export const doesKeyExist = (
  object: Record<string, unknown> | unknown[],
  key: PropertyKey
): boolean => {
  if (!isObjectOrArray(object)) return false; // Handle null, undefined, and non-objects

  if (!isPropertyKey(key)) {
    throw new TypeError(
      `Second Parameter (\`key\`) must be of type \`string\`, \`number\` or \`symbol\`, but received: \`${getPreciseType(
        key
      )}\`.`
    );
  }

  // Direct match found
  if (Object.prototype.hasOwnProperty.call(object, key)) return true;

  if (isArray(object)) {
    // Check each array item recursively
    return object.some((item) => doesKeyExist(item as unknown[], key));
  }

  return Object.values(object).some(
    (value) => isObjectOrArray(value) && doesKeyExist(value, key)
  );
};
