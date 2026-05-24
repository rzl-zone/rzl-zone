import type { StringCollection, StringLike } from "./_private/case.types";

import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import {
  validateCaseIgnoreWordsCase,
  validateCaseInputWordsCase
} from "./_private/case.utils";

/** ----------------------------------------------------------
 * * ***Utility: `toLowerCase`.***
 * -----------------------------------------------------------
 * **Converts a string (or array of strings) into `lower case`, with optionally leaving specific words unchanged.**
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
 * @returns {string} The LowerCase formatted string.
 *
 * ---
 * @example
 * 1. #### Basic usage:
 *    ```ts
 *    toLowerCase("Hello World");
 *    // ➔ "hello world"
 *    ```
 *    ---
 * 2. #### Array input is joined before conversion:
 *    ```ts
 *    toLowerCase(["Join", "WORLD", "Here"]);
 *    // ➔ "join words here"
 *    ```
 *    ---
 * 3. #### Handles underscores and hyphens:
 *    ```ts
 *    toLowerCase("convert_to-pascal case");
 *    // ➔ "convert to lower case"
 *    ```
 *    ---
 * 4. #### Trims extra delimiters:
 *    ```ts
 *    toLowerCase("___hello--world__ again!!");
 *    // ➔ "hello world again"
 *    ```
 *    ---
 * 5. #### Supports emojis and symbols:
 *    ```ts
 *    toLowerCase("🔥fire_and-ice❄️");
 *    // ➔ "fire and ice"
 *    ```
 *    ---
 * 6. #### Ignore single word:
 *    ```ts
 *    toLowerCase("this URL path will ignore", "URL");
 *    // ➔ "this URL path will ignore"
 *    ```
 *    ---
 * 7. #### Ignore multiple words:
 *    ```ts
 *    toLowerCase("ignore API and URL", ["API", "URL"]);
 *    // ➔ "ignore API and URL"
 *    ```
 *    ---
 * 8. #### Ignore using Set:
 *    ```ts
 *    toLowerCase("ignore API and URL", new Set(["API", "URL"]));
 *    // ➔ "ignore API and URL"
 *    ```
 *    ---
 * 9. #### Null, Undefined or empty (string or array) input returns empty string:
 *    ```ts
 *    toLowerCase(undefined);
 *    // ➔ ""
 *    ```
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
