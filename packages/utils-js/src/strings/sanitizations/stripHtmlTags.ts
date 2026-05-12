import type { Extends } from "@rzl-zone/ts-types-plus";
import { isString } from "@/predicates/is/isString";
import { isEmptyString } from "@/predicates/is/isEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `stripHtmlTags`.***
 * ----------------------------------------------------------
 * **This function removes valid HTML tags (including nested and self-closing ones)
 * by replacing them with spaces, then collapses multiple whitespaces into a single space.**
 * - **It handles the following cases:**
 *    - If the input is not a string (`null`, `undefined`, or any non-string), it is returned as undefined.
 *    - If the input is an empty or whitespace-only string, it returns an empty string (`""`).
 *    - Otherwise, it returns the cleaned string with tags removed and normalized whitespace.
 * @template T - Input string type (string | null | undefined).
 * @param {string | null | undefined} input - A string potentially containing HTML tags.
 * @returns {string | undefined} Cleaned string if input is string, or original input otherwise.
 * @example
 * stripHtmlTags("<p>Hello</p>");
 * // ➔ "Hello"
 * stripHtmlTags("<div><b>Bold</b> text</div>");
 * // ➔ "Bold text"
 * stripHtmlTags("Line<br/>Break");
 * // ➔ "Line Break"
 * stripHtmlTags("2 < 5 and 5 > 2");
 * // ➔ "2 < 5 and 5 > 2"
 * stripHtmlTags("");
 * // ➔ ""
 * stripHtmlTags("   ");
 * // ➔ ""
 * stripHtmlTags(null);
 * // ➔ undefined
 * stripHtmlTags(undefined);
 * // ➔ undefined
 */
export function stripHtmlTags(input: string): string;
export function stripHtmlTags<T>(
  input: T
): Extends<string, T> extends true ? string | undefined : undefined;
export function stripHtmlTags(input: unknown) {
  if (!isString(input)) {
    return undefined;
  }

  if (isEmptyString(input)) {
    return "";
  }

  // return input.replace(/<[^>]*>/g, "");
  const stripped = input.replace(/<\/?[a-zA-Z][^<>]*\/?>/g, " ").trim();

  const cleaned = stripped.replace(/\s+/g, " ").trim();

  return cleaned;
}
