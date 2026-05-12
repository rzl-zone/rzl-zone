import type { StringCollection, StringLike } from "./_private/case.types";

import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import {
  validateCaseIgnoreWordsCase,
  validateCaseInputWordsCase
} from "./_private/case.utils";

/** ----------------------------------------------------------
 * * ***Utility: `toPascalCaseSpace`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `PascalCaseSpace`, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The PascalCaseSpace formatted string.
 * @example
 * // Basic usage
 * toPascalCaseSpace("hello world");
 * // ➔ "Hello World"
 *
 * // Array input is joined before conversion
 * toPascalCaseSpace(["Join", "Words", "Here"]);
 * // ➔ "Join Words Here"
 *
 * // Handles underscores and hyphens
 * toPascalCaseSpace("convert_to-pascal case");
 * // ➔ "Convert To Pascal Case Space"
 *
 * // Trims extra delimiters
 * toPascalCaseSpace("___hello--world__ again!!");
 * // ➔ "Hello World Again"
 *
 * // Supports emojis and symbols
 * toPascalCaseSpace("🔥fire_and-ice❄️");
 * // ➔ "Fire And Ice"
 *
 * // Ignore single word
 * toPascalCaseSpace("this URL path will ignore", "URL");
 * // ➔ "This URL Path Will Ignore"
 *
 * // Ignore multiple words
 * toPascalCaseSpace("ignore API and URL", ["API", "URL"]);
 * // ➔ "Ignore API And URL"
 *
 * // Ignore using Set
 * toPascalCaseSpace("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "Ignore API And URL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toPascalCaseSpace(undefined);
 * // ➔ ""
 */
export const toPascalCaseSpace = (
  input: StringLike,
  ignoreWord?: StringCollection
): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};
