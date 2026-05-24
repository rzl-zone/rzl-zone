import type { StringCollection, StringLike } from "./_private/case.types";

import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import {
  validateCaseIgnoreWordsCase,
  validateCaseInputWordsCase
} from "./_private/case.utils";

/** ----------------------------------------------------------
 * * ***Utility: `toSnakeCase`.***
 * -----------------------------------------------------------
 * **Converts a string (or array of strings) into `snake_case`, with optionally leaving specific words unchanged.**
 *
 * ---
 * - **Behavior:**
 *     - Accepts a `string` or an `array of strings`:
 *       - If an array is provided, elements are trimmed, empty ones removed,
 *         then joined with `"-"` before conversion.
 *     - Splits the input by non-alphanumeric characters
 *       (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *     - The first word is fully lowercase; subsequent words are capitalized.
 *     - Words listed in `ignoreWord` remain unchanged in the output.
 *     - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *     - `ignoreWord` accepts:
 *        - a single string,
 *        - an array of strings, or
 *        - a `Set` of strings.
 *     - Multiple delimiters collapse into one; empty segments ignored.
 *     - Returns `""` if the input is `null`, `undefined`, or empty.
 *
 * ---
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 *
 * ---
 * @returns {string} The snake_case formatted string.
 *
 * ---
 * @example
 * 1. #### Basic usage:
 *      ```ts
 *      toSnakeCase("Hello World");
 *      // ➔ "hello_world"
 *      ```
 *      ---
 * 2. #### Array input is joined before conversion:
 *      ```ts
 *      toSnakeCase(["Join", "Words", "Here"]);
 *      // ➔ "join_words_here"
 *      ```
 *      ---
 * 3. #### Handles underscores, hyphens, spaces:
 *      ```ts
 *      toSnakeCase("convert-to_snake case");
 *      // ➔ "convert_to_snake_case"
 *      ```
 *      ---
 * 4. #### Handles emojis and symbols:
 *      ```ts
 *      toSnakeCase("🔥fire___and--ice❄️");
 *      // ➔ "fire_and_ice"
 *      ```
 *      ---
 * 5. #### Ignore specific word:
 *      ```ts
 *      toSnakeCase("ignore URL case", "URL");
 *      // ➔ "ignore_URL_case"
 *      ```
 *      ---
 * 6. #### Ignore multiple words:
 *      ```ts
 *      toSnakeCase("ignore API and URL", ["API", "URL"]);
 *      // ➔ "ignore_API_and_URL"
 *      ```
 *      ---
 * 7. #### Ignore with Set:
 *      ```ts
 *      toSnakeCase("ignore API and URL", new Set(["API", "URL"]));
 *      // ➔ "ignore_API_and_URL"
 *      ```
 *      ---
 * 8. #### Null, Undefined or empty (string or array) input returns empty string:
 *      ```ts
 *      toSnakeCase(null);
 *      // ➔ ""
 *      ```
 */
export const toSnakeCase = (
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
    .join("_");
};
