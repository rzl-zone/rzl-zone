import type { StringCollection, StringLike } from "./_private/case.types";

import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import {
  validateCaseIgnoreWordsCase,
  validateCaseInputWordsCase
} from "./_private/case.utils";

/** ----------------------------------------------------------
 * * ***Utility: `toPascalCaseSpace`.***
 * -----------------------------------------------------------
 * **Converts a string (or array of strings) into `PascalCaseSpace`, with optionally leaving specific words unchanged.**
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
 * @returns {string} The PascalCaseSpace formatted string.
 *
 * ---
 * @example
 * 1. #### Basic usage:
 *    ```ts
 *    toPascalCaseSpace("hello world");
 *    // ➔ "Hello World"
 *    ```
 *    ---
 * 2. #### Array input is joined before conversion:
 *    ```ts
 *    toPascalCaseSpace(["Join", "Words", "Here"]);
 *    // ➔ "Join Words Here"
 *    ```
 *    ---
 * 3. #### Handles underscores and hyphens:
 *    ```ts
 *    toPascalCaseSpace("convert_to-pascal case");
 *    // ➔ "Convert To Pascal Case Space"
 *    ```
 *    ---
 * 4. #### Trims extra delimiters:
 *    ```ts
 *    toPascalCaseSpace("___hello--world__ again!!");
 *    // ➔ "Hello World Again"
 *    ```
 *    ---
 * 5. #### Supports emojis and symbols:
 *    ```ts
 *    toPascalCaseSpace("🔥fire_and-ice❄️");
 *    // ➔ "Fire And Ice"
 *    ```
 *    ---
 * 6. #### Ignore single word:
 *    ```ts
 *    toPascalCaseSpace("this URL path will ignore", "URL");
 *    // ➔ "This URL Path Will Ignore"
 *    ```
 *    ---
 * 7. #### Ignore multiple words:
 *    ```ts
 *    toPascalCaseSpace("ignore API and URL", ["API", "URL"]);
 *    // ➔ "Ignore API And URL"
 *    ```
 *    ---
 * 8. #### Ignore using Set:
 *    ```ts
 *    toPascalCaseSpace("ignore API and URL", new Set(["API", "URL"]));
 *    // ➔ "Ignore API And URL"
 *    ```
 *    ---
 * 9. #### Null, Undefined or empty (string or array) input returns empty string:
 *    ```ts
 *    toPascalCaseSpace(undefined);
 *    // ➔ ""
 *    ```
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
