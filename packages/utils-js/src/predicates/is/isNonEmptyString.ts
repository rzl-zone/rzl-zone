import { isString } from "./isString";
import { hasOwnProp } from "../has/hasOwnProp";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type IsNonEmptyStringOptions = {
  /** Whether to trim the string before checking, defaultValue: `true`.
   *
   * @default true */
  trim?: boolean;
};

/** ----------------------------------------------------------
 * * ***Type guard: `isNonEmptyString`.***
 * ----------------------------------------------------------
 * **Checks if a value is a **non-empty string**.**
 * @description
 * Determines whether the given `value` is a string containing at least one non-whitespace character, with optional trimming behavior.
 * - **Behavior:**
 *    - Ensures the value is a string using ***`isString` utility function***.
 *    - Optionally trims whitespace before checking (`trim` defaults to `true`).
 *    - Narrows type to `string` when true.
 * @param {*} value - The value to test.
 * @param {IsNonEmptyStringOptions} [options] - Optional settings.
 * @param {boolean} options.trim - If `true`, trims the string before checking, defaults: `true`.
 * @returns {boolean} Return `true` if `value` is a non-empty string, otherwise `false`.
 * @example
 * isNonEmptyString("hello");
 * // ➔ true
 * isNonEmptyString("   ", { trim: true });
 * // ➔ false
 * isNonEmptyString("   ", { trim: false });
 * // ➔ true
 * isNonEmptyString("");
 * // ➔ false
 * isNonEmptyString(123);
 * // ➔ false
 * isNonEmptyString(undefined);
 * // ➔ false
 * isNonEmptyString(null);
 * // ➔ false
 * isNonEmptyString({});
 * // ➔ false
 * isNonEmptyString([]);
 * // ➔ false
 */
export const isNonEmptyString = (
  value: unknown,
  options: IsNonEmptyStringOptions = {}
): value is string => {
  if (!isString(value)) return false;

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const trim = hasOwnProp(options, "trim") ? options.trim : true;

  assertIsBoolean(trim, {
    message: ({ currentType, validType }) =>
      `Parameter \`trim\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const str = trim ? value.trim() : value;

  return str.length > 0;
};
