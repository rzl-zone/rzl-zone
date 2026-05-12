import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

type CapitalizeFirstOptions = {
  /** If true **(default)**, the rest of the string will be converted to lowercase after capitalizing the first letter.
   *
   * @default true
   */
  lowerCaseNextRest?: boolean;
  /** If true, the string will trimmed, default: `false`.
   *
   * @default false
   */
  trim?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `capitalizeFirst`.***
 * ----------------------------------------------------------
 * **Capitalizes the first letter of a string, with optionally lowercases the rest and trims whitespace.**
 * @param {string | null | undefined} string - The string to be processed.
 * @param {CapitalizeFirstOptions} [options] - Options to control behavior.
 * @param {CapitalizeFirstOptions["lowerCaseNextRest"]} [options.lowerCaseNextRest=true] - If true, lowercases the rest (next first letter), default: `true`.
 * @param {CapitalizeFirstOptions["trim"]} [options.trim=false] - If true, trims the string before processing, default: `false`.
 * @returns {string} The processed string, returns `""` if input is `null`, `undefined`, or `not a valid string`.
 * @example
 * ```ts
 * capitalizeFirst(" hello WORLD ");
 * // ➔ " Hello world"
 * capitalizeFirst(" hello WORLD ", { trim: true });
 * // ➔ "Hello world"
 * capitalizeFirst("FOO", { lowerCaseNextRest: false });
 * // ➔ "FOO"
 * capitalizeFirst("   foo BAR   ", { trim: true, lowerCaseNextRest: false });
 * // ➔ "Foo BAR"
 * ```
 * #### ℹ️ If null, undefined, or not a valid string input, return `""`.
 * ```ts
 * capitalizeFirst(123);
 * capitalizeFirst(null);
 * capitalizeFirst(undefined);
 * // ➔ ""
 * ```
 */
export const capitalizeFirst = (
  string: string | null | undefined,
  options: CapitalizeFirstOptions = {
    lowerCaseNextRest: true,
    trim: false
  }
): string => {
  if (!isNonEmptyString(string)) return "";

  if (!isPlainObject(options)) {
    options = {};
  }

  const lowerCaseNextRest = options.lowerCaseNextRest !== false;
  const trim = options.trim === true;

  if (trim) string = string.trim();

  return (
    string[0].toUpperCase() +
    (lowerCaseNextRest ? string.slice(1).toLowerCase() : string.slice(1))
  );
};
