import type { StringCollection, StringLike } from "./_private/case.types";

import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import {
  validateCaseIgnoreWordsCase,
  validateCaseInputWordsCase
} from "./_private/case.utils";

/** ----------------------------------------------------------
 * * ***Utility: `toCamelCase`.***
 * -----------------------------------------------------------
 * **Converts a string (or array of strings) into `camelCase`, with optionally leaving specific words unchanged.**
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
 * @returns {string} The camelCase formatted string.
 *
 * ---
 * @example
 * 1. #### Basic usage:
 *    ```ts
 *    toCamelCase("hello world");
 *    // ➔ "helloWorld"
 *    ```
 *    ---
 * 2. #### Array input is joined before conversion:
 *    ```ts
 *    toCamelCase(["Join", "Words", "Here"]);
 *    // ➔ "joinWordsHere"
 *    ```
 *    ---
 * 3. #### Supports mixed delimiters:
 *    ```ts
 *    toCamelCase("convert_to-camel case");
 *    // ➔ "convertToCamelCase"
 *    ```
 *    ---
 * 4. #### Words in ignoreWord stay unchanged:
 *    ```ts
 *    toCamelCase("this URL path will ignore", "URL");
 *    // ➔ "thisURLPathWillIgnore"
 *    ```
 *    ---
 * 5. #### Multiple ignored words:
 *    ```ts
 *    toCamelCase("ignore API and URL", ["API", "URL"]);
 *    // ➔ "ignoreAPIAndURL"
 *    ```
 *    ---
 * 6. #### Set can also be used:
 *    ```ts
 *    toCamelCase("ignore API and URL", new Set(["API", "URL"]));
 *    // ➔ "ignoreAPIAndURL"
 *    ```
 *    ---
 * 7. #### Null, Undefined or empty (string or array) input returns empty string:
 *    ```ts
 *    toCamelCase(null);
 *    // ➔ ""
 *    ```
 */
export const toCamelCase = (
  input: StringLike,
  ignoreWord?: StringCollection
): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word, index) => {
      if (ignoreWordsValidated.has(word)) return word;
      return index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};
