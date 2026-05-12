import type { StringCollection, StringLike } from "./_private/case.types";

import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import {
  validateCaseIgnoreWordsCase,
  validateCaseInputWordsCase
} from "./_private/case.utils";

/** ----------------------------------------------------------
 * * ***Utility: `toLowerCase`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `lower case`, with optionally leaving specific words unchanged.**
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
 * @returns {string} The LowerCase formatted string.
 * @example
 * // Basic usage
 * toLowerCase("Hello World");
 * // ➔ "hello world"
 *
 * // Array input is joined before conversion
 * toLowerCase(["Join", "WORLD", "Here"]);
 * // ➔ "join words here"
 *
 * // Handles underscores and hyphens
 * toLowerCase("convert_to-pascal case");
 * // ➔ "convert to lower case"
 *
 * // Trims extra delimiters
 * toLowerCase("___hello--world__ again!!");
 * // ➔ "hello world again"
 *
 * // Supports emojis and symbols
 * toLowerCase("🔥fire_and-ice❄️");
 * // ➔ "fire and ice"
 *
 * // Ignore single word
 * toLowerCase("this URL path will ignore", "URL");
 * // ➔ "this URL path will ignore"
 *
 * // Ignore multiple words
 * toLowerCase("ignore API and URL", ["API", "URL"]);
 * // ➔ "ignore API and URL"
 *
 * // Ignore using Set
 * toLowerCase("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "ignore API and URL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toLowerCase(undefined);
 * // ➔ ""
 */
export const toLowerCase = (
  input: StringLike,
  ignoreWord?: StringCollection
): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.toLowerCase();
    })
    .join(" ");
};
