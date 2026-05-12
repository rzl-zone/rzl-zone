import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

import { isNaN } from "./isNaN";
import { isPlainObject } from "./isPlainObject";
import { isBoolean } from "./isBoolean";

type isDateOptions = {
  /** * ***Skip the validity check (`!isNaN(date.getTime())`).***
   *
   * When `true`, the function only checks that the value is an
   * instance of `Date` without verifying that it represents a valid
   * date value, default: `false`.
   *
   * @default false
   */
  skipInvalidDate?: boolean;
};

/** ----------------------------------------------------------
 * * ***Type guard: `isDate`.***
 * ----------------------------------------------------------
 * **Determines whether the given `value` is a real, valid JavaScript
 *   **[`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** object.**
 * - **Behavior:**
 *    - Returns **true** only if:
 *      - `value` is an instance of `Date`.
 *      - and, unless `options.skipInvalidDate` is `true`,
 *        the underlying time value is valid (`!isNaN(value.getTime())`).
 *    - Returns **false** for:
 *      - non-Date values (strings, numbers, etc.).
 *      - `Date` instances that represent an invalid time value
 *        (e.g. `new Date("bad")`), unless skipping is enabled.
 * @param {*} value - The value to check.
 * @param {isDateOptions} [options] - Optional settings.
 * @returns {boolean} Return `true` if value is a valid Date object.
 * @example
 * isDate(new Date());
 * // ➜ true
 * isDate(new Date("invalid"));
 * // ➜ false
 * isDate("2024-01-01");
 * // ➜ false
 *
 * // Skipping validity check:
 * isDate(new Date("invalid"), { skipInvalidDate: true });
 * // ➜ true
 */
export const isDate = (
  value: unknown,
  options: isDateOptions = {}
): value is Date => {
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const skipInvalidDate =
    isPlainObject(options) && isBoolean(options.skipInvalidDate)
      ? options.skipInvalidDate
      : false;

  const instanceDate = value instanceof Date;

  if (skipInvalidDate) return instanceDate;
  return instanceDate && !isNaN(value.getTime());
};
