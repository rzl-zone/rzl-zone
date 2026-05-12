import { isArray } from "../is/isArray";
import { isEqual } from "../is/isEqual";
import { getPreciseType } from "../type/getPreciseType";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

/** ----------------------------------------------------------
 * * ***Predicate: `areArraysEqual`.***
 * ----------------------------------------------------------
 * **Compares two arrays deeply to check if they are equal.**
 * @description Supports deep comparison of arrays containing nested arrays or objects,
 *  can also ignore the order of elements at all levels by recursively sorting.
 * @param {unknown[]} array1
 *   ***The first array to compare, can contain nested arrays or objects.***
 * @param {unknown[]} array2
 *   ***The second array to compare against, should match structure of `array1`.***
 * @param {boolean|undefined} [ignoreOrder=false]
 *   ***Whether to ignore the order of elements when comparing.***
 *    - If `true`, will sort both arrays recursively before comparing, default is `false`.
 * @returns {boolean}
 *    Returns `true` if both arrays are deeply equal, otherwise `false`.
 * @throws **{@link TypeError | `TypeError`}** if `array1` or `array2` are not arrays, or if `ignoreOrder` is not a boolean.
 * @example
 * ```ts
 * areArraysEqual([1, 2, 3], [1, 2, 3]);
 * // ➔ true
 * areArraysEqual([1, 2, 3], [3, 2, 1]);
 * // ➔ false
 * areArraysEqual([1, 2, 3], [3, 2, 1], true);
 * // ➔ true (order ignored)
 * areArraysEqual([{ x: 1 }, { y: 2 }], [{ y: 2 }, { x: 1 }], true);
 * // ➔ true
 * ```
 */
export const areArraysEqual = (
  array1: unknown[],
  array2: unknown[],
  ignoreOrder: boolean = false
): boolean => {
  if (!(isArray(array1) && isArray(array2))) {
    throw new TypeError(
      `Parameters \`array1\` and \`array2\` property of the \`options\` (second parameter) must be of type \`array\`, but received: ['array1': \`${getPreciseType(
        array1
      )}\`, 'array2': \`${getPreciseType(array2)}\`].`
    );
  }

  assertIsBoolean(ignoreOrder, {
    message: ({ currentType, validType }) =>
      `Third parameter \`ignoreOrder\` must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  if (!isEqual(array1.length, array2.length)) return false;

  /**
   * Recursively sorts an array (and nested arrays) so that
   * deep equality checks can ignore order at all levels.
   *
   * @param {unknown[]} arr - The array to deep sort.
   * @returns {unknown[]} A new deeply sorted array.
   */
  const deepIgnoreOrder = (arr: unknown[]): unknown[] => {
    if (!isArray(arr)) return arr;

    // Recursively sort nested arrays
    const sorted = arr.map((item) => {
      if (isArray(item)) {
        return deepIgnoreOrder(item);
      }
      return item;
    });

    // Sort current array level
    return sorted.sort((a, b) => {
      const sa = safeStableStringify(a);
      const sb = safeStableStringify(b);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });
  };

  const normalizedArr1 = ignoreOrder ? deepIgnoreOrder(array1) : array1;
  const normalizedArr2 = ignoreOrder ? deepIgnoreOrder(array2) : array2;

  if (!isEqual(normalizedArr1.length, normalizedArr2.length)) return false;

  return normalizedArr1.every(
    (item, index) =>
      safeStableStringify(item) === safeStableStringify(normalizedArr2[index])
  );
};
