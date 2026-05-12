import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

type NormalizeSpacesOptions = {
  /** If `true`, skips normalization and only trims whitespace from start & end, defaultValue: `false`.
   *
   * @default false
   */
  trimOnly?: boolean;
  /** If `false`, skips trimming value, defaultValue: `true`.
   *
   * @default true
   */
  withTrim?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `normalizeSpaces`.***
 * ----------------------------------------------------------
 * **Normalizes whitespace in a string by reducing multiple spaces
 * to a single space, optionally trims, or only trims based on options.**
 * - **Behavior:**
 *    - Collapses all consecutive whitespace (spaces, tabs, newlines) into a single space.
 *    - Can trim leading/trailing spaces (default behavior), or preserve them with `withTrim: false`.
 *    - Can skip normalization entirely and only trim using `trimOnly: true`.
 *    - Returns an empty string if input is `null` or `undefined`.
 * @param {string | null | undefined} value - The input string to be processed. If `null` or `undefined`, returns an empty string.
 * @param {NormalizeSpacesOptions} [options] - Configuration options.
 * @param {NormalizeSpacesOptions["trimOnly"]} [options.trimOnly=false] - If `true`, skips normalization and only trims the string.
 * @param {NormalizeSpacesOptions["withTrim"]} [options.withTrim=true] - If `false`, preserves leading/trailing whitespace.
 * @returns {string} The processed string.
 * @example
 * normalizeSpaces("   Hello    World\tthis   is\n\nok ");
 * // ➔ "Hello World this is ok"
 * normalizeSpaces("   Hello    World\tthis   is\n\nok ", { trimOnly: true });
 * // ➔ "Hello    World	this   is\n\nok"
 * normalizeSpaces("   Hello    World   ", { withTrim: false });
 * // ➔ " Hello World "
 * normalizeSpaces(null);
 * // ➔ ""
 */
export const normalizeSpaces = (
  value: string | null | undefined,
  options: NormalizeSpacesOptions = {
    withTrim: true,
    trimOnly: false
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  if (!isPlainObject(options)) {
    options = {};
  }

  const { trimOnly = false, withTrim = true } = options;

  if (trimOnly) return value.trim();

  if (withTrim) {
    value = value.trim();
  }

  // Remove all duplicate spaces (including tabs, newlines, etc.)
  return value.replace(/\s+/g, " ");
};
