import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

type CapitalizeWordsOptions = {
  /** If `true`, removes leading and trailing spaces, default `false`.
   *
   * @default false
   */
  trim?: boolean;
  /** If `true`, collapses multiple spaces **between words** into a single space (while preserving leading/trailing spaces), default `false`.
   *
   * @default false
   */
  collapseSpaces?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `capitalizeWords`.***
 * ----------------------------------------------------------
 * **Capitalizes the first letter of each word in a string while converting the rest to lowercase.**
 * @param {string | null | undefined} value
 *  ***The input string to be processed.***
 *   - If `null` or `undefined`, returns an empty-string (`""`).
 * @param {CapitalizeWordsOptions} [options]
 *  ***Optional settings to control the output:***
 *   - `trim`: If `true`, removes leading and trailing spaces, defaultValue: `false`.
 *   - `collapseSpaces`: If `true`, collapses multiple spaces **between words** into a single space (while preserving leading/trailing spaces), defaultValue: `false`.
 * @returns {string} A new string where each word starts with an uppercase letter
 * and the remaining letters are lowercase.
 *  - If `value` is `empty`, `null`, or `undefined`, returns an `empty-string`.
 * @example
 * ```ts
 * capitalizeWords("  hello   world  ");
 * // ➔ "  Hello   World  "
 * capitalizeWords("  hello   world  ", { trim: true });
 * // ➔ "Hello   World"
 * capitalizeWords("  hello   world  ", { collapseSpaces: true });
 * // ➔ "  Hello World  "
 * capitalizeWords("  hello   world  ", { trim: true, collapseSpaces: true });
 * // ➔ "Hello World"
 * ```
 * #### ℹ️ If null, undefined, or not a valid string input, return "".
 * ```ts
 * capitalizeWords(123);
 * capitalizeWords(null);
 * capitalizeWords(undefined);
 * // ➔ ""
 * ```
 */
export const capitalizeWords = (
  value: string | null | undefined,
  options: CapitalizeWordsOptions = {
    collapseSpaces: false,
    trim: false
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  let result = value;

  if (!isPlainObject(options)) {
    options = {};
  }

  const collapseSpaces = options.collapseSpaces === true;
  const trim = options.trim === true;

  if (trim) {
    result = result.trim();
  }

  if (collapseSpaces) {
    const leadingSpaces = result.match(/^\s*/)?.[0] ?? "";
    const trailingSpaces = result.match(/\s*$/)?.[0] ?? "";
    result = result.trim().replace(/\s+/g, " ");
    result = `${leadingSpaces}${result}${trailingSpaces}`;
  }

  return result
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
