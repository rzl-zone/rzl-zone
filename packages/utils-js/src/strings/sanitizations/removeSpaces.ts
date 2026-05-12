import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

type RemoveSpacesOptions = {
  /** If `true`, only trims the string, defaultValue: `false`.
   *
   * @default false */
  trimOnly?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `removeSpaces`.***
 * ----------------------------------------------------------
 * **Removes all spaces from a string or trims only, based on the options provided.**
 * - **Behavior:**
 *    - If `trimOnly` is `true`, the string is simply trimmed.
 *    - Otherwise, removes **all spaces**, tabs, newlines, etc.
 *    - If the input is `null` or `undefined`, returns an empty string `("")`.
 * @param {string | null | undefined} value - The input string to be processed. If `null` or `undefined`, returns an empty string.
 * @param {RemoveSpacesOptions} [options] - The options object.
 * @param {RemoveSpacesOptions["trimOnly"]} [options.trimOnly=false] - If `true`, only trims the string without removing spaces inside.
 * @returns {string} The processed string.
 * @example
 * removeSpaces("  Hello   World  ");
 * // ➔ "HelloWorld"
 * removeSpaces("  Hello   World  ", { trimOnly: true });
 * // ➔ "Hello   World"
 * removeSpaces(null);
 * // ➔ ""
 */
export const removeSpaces = (
  value: string | null | undefined,
  options: RemoveSpacesOptions = {
    trimOnly: false
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  if (!isPlainObject(options)) {
    options = {};
  }

  const { trimOnly = false } = options;

  if (trimOnly) return value.trim();

  // Remove all spaces (including tabs, newlines, etc.)
  return value.replace(/\s+/g, "");
};
