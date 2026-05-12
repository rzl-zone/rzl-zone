import { isEqual } from "../is/isEqual";

/** ---------------------------------
 * * ***Predicate: `areObjectsEqual`.***
 * ---------------------------------
 * **Compares two objects for deep equality.**
 * @template T1 The type of the first object.
 * @template T2 The type of the second object.
 * @param {*} object1 - The first object to compare.
 * @param {*} object2 - The second object to compare.
 * @returns {boolean} Return `true` if both objects are deeply equal, otherwise `false`.
 * @example
 * areObjectsEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
 * // ➔ true
 * areObjectsEqual({ a: 1 }, { a: 1, b: undefined });
 * // ➔ false
 * areObjectsEqual([1, 2, 3], [1, 2, 3]);
 * // ➔ true
 */
export const areObjectsEqual = (
  object1: unknown,
  object2: unknown
): boolean => {
  return isEqual(object1, object2);
};
