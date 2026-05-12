import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `normalizeString`.***
 * ----------------------------------------------------------
 * **Normalizes a string by ensuring it is a valid string and trimming whitespace.**
 * - **Behavior:**
 *    - If the input is `undefined`, `null`, or an `empty string` after trimming,
 *      it returns an empty string `("")`.
 * @param {string | undefined | null} input - The input string to be normalize. If `null` or `undefined`, returns an empty string.
 * @returns {string} A trimmed string or an empty string if the input is invalid.
 * @example
 * normalizeString("   Hello World   ");
 * // ➔ "Hello World"
 * normalizeString("   Hello    World   ");
 * // ➔ "Hello    World"
 * normalizeString("");
 * // ➔ ""
 * normalizeString(null);
 * // ➔ ""
 * normalizeString(undefined);
 * // ➔ ""
 */
export const normalizeString = (input: string | null | undefined): string => {
  return isNonEmptyString(input) ? input.trim() : "";
};
