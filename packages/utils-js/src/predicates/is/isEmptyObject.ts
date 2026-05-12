import { isObject } from "./isObject";
import { hasOwnProp } from "../has/hasOwnProp";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type IsEmptyObjectOptions = {
  /** Whether to check for symbol properties in addition to string keys, defaultValue: `false`.
   *
   * @default false
   */
  checkSymbols?: boolean;
};

/** ----------------------------------------------------------
 * * ***Predicate: `isEmptyObject`.***
 * ----------------------------------------------------------
 * **Checks if a value is a plain object with **no own enumerable string-key properties**,
 * and optionally **no own enumerable symbol-key properties** when `checkSymbols` is `true`.**
 * - **Behavior:**
 *    - If the value is **not an object** (e.g. `null`, array, primitive), it is considered empty.
 *    - If `options.checkSymbols` is `true`, **symbol properties** are also checked.
 * @param {*} value - The value to check.
 * @param {IsEmptyObjectOptions} [options] - Optional settings.
 * @param {IsEmptyObjectOptions["checkSymbols"]} [options.checkSymbols=false] - Whether to also check symbol properties.
 * @returns {boolean} Return `true` if the value is considered empty or not an object, false otherwise.
 * @example
 * isEmptyObject({});
 * // ➔ true
 * isEmptyObject({}, { checkSymbols: true });
 * // ➔ true
 * isEmptyObject({ a: 1 });
 * // ➔ false
 * isEmptyObject({ [Symbol('s')]: 1 });
 * // ➔ true
 * isEmptyObject({ [Symbol('s')]: 1 }, { checkSymbols: true });
 * // ➔ false
 * isEmptyObject(null);
 * // ➔ true (not object)
 * isEmptyObject([]);
 * // ➔ true (not plain object)
 * isEmptyObject(123);
 * // ➔ true (not object)
 */
export function isEmptyObject(
  value: unknown,
  options: IsEmptyObjectOptions = {}
): boolean {
  if (!isObject(value)) {
    return true;
  }

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const checkSymbols = hasOwnProp(options, "checkSymbols")
    ? options.checkSymbols
    : false;

  assertIsBoolean(checkSymbols, {
    message: ({ currentType, validType }) =>
      `Parameter \`checkSymbols\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const hasNoKeys = Object.keys(value).length === 0;
  if (checkSymbols) {
    return hasNoKeys && Object.getOwnPropertySymbols(value).length === 0;
  }
  return hasNoKeys;
}
