import type { StringCollection, StringLike } from "./_private/case.types";

import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import {
  validateCaseIgnoreWordsCase,
  validateCaseInputWordsCase
} from "./_private/case.utils";

/** ----------------------------------------------------------
 * * ***Utility: `slugify`.***
 * -----------------------------------------------------------
 * **Slugifies a string (or array of strings) for safe use in URLs, with optionally leaving specific words unchanged.**
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
 * @returns {string} The slugified string.
 *
 * ---
 * @example
 * 1. #### Basic usage:
 *    ```ts
 *    slugify("Hello World!");
 *    // ➔ "hello-world"
 *    ```
 *    ---
 * 2. #### Array input is joined before conversion:
 *    ```ts
 *    slugify(["Join", "Words", "Here"]);
 *    // ➔ "join-words-here"
 *    ```
 *    ---
 * 3. #### Trims and cleans input:
 *    ```ts
 *    slugify(" --- Convert to Slug? --- ");
 *    // ➔ "convert-to-slug"
 *    ```
 *    ---
 * 4. #### Ignore single word:
 *    ```ts
 *    slugify("This URL path", "URL");
 *    // ➔ "this-URL-path"
 *    ```
 *    ---
 * 5. #### Ignore multiple words:
 *    ```ts
 *    slugify("ignore API and URL", ["API", "URL"]);
 *    // ➔ "ignore-API-and-URL"
 *    ```
 *    ---
 * 6. #### Ignore using Set:
 *    ```ts
 *    slugify("ignore API and URL", new Set(["API", "URL"]));
 *    // ➔ "ignore-API-and-URL"
 *    ```
 *    ---
 * 7. #### Supports emojis and symbols:
 *    ```ts
 *    slugify("🔥 Fire_and_ice ❄️");
 *    // ➔ "fire-and-ice"
 *    ```
 *    ---
 * 8. #### Null, Undefined or empty (string or array) input returns empty string:
 *    ```ts
 *    slugify(undefined);
 *    // ➔ ""
 */
export const slugify = (
  input: StringLike,
  ignoreWord?: StringCollection
): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  // map + join
  const slug = wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.toLowerCase();
    })
    .join("-");

  // trim hyphens
  return slug.replace(/^-+|-+$/g, "");
};
