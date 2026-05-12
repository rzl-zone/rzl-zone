import { isArray } from "../is/isArray";
import { isNonEmptyString } from "../is/isNonEmptyString";

import { assertIsString } from "@/assertions/strings/assertIsString";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type OptionsTextContainsAll = {
  /** If `true`, matches whole words only, defaultValue is `false`.
   *
   * @default false
   */
  exactMatch?: boolean;
  /** Optional regex flags (default: `"i"` for case-insensitive).
   *
   * @default "i"
   */
  flags?: string;
};

/** ----------------------------------------------------------
 * * ***Predicate: `textContainsAll`.***
 * ----------------------------------------------------------
 * **Checks if the given `text` contains all of the specified `searchWords`.**
 * - **Behavior:**
 *    - Returns `false` if `text` or `searchWords` is `null`/`undefined`/invalid.
 *    - Uses **regular expressions** for flexible pattern matching.
 *    - **Escapes special characters** to prevent regex injection attacks.
 *    - **Trims input** to avoid false positives with empty spaces.
 *    - **Supports exact word matching** (optional).
 * @param {string|null|undefined} text - The string text to search within.
 * @param {string[]|null} [searchWords] - An array of words/phrases to match against the text.
 * @param {OptionsTextContainsAll} [options] - Optional configuration object.
 * @param {OptionsTextContainsAll["exactMatch"]} [options.exactMatch=false] - If `true`, matches whole words only, defaultValue is `false`.
 * @param {OptionsTextContainsAll["flags"]} [options.flags="i"] - Optional regex flags (default: `"i"` for case-insensitive).
 * @returns {boolean} Return `true` if all `searchWords` are found in `text`, otherwise `false`.
 * @example
 * textContainsAll("Hello world, WithAI APP", ["Hello", "world"]);
 * // ➔ true
 * textContainsAll("JavaScript and TypeScript", ["Java", "Script"]);
 * // ➔ true
 * textContainsAll("Machine Learning", ["AI", "Learning"]);
 * // ➔ false
 * textContainsAll("open-source", ["open"], { exactMatch: true });
 * // ➔ false (because options `exactMatch=true`)
 * textContainsAll(null, ["test"]);
 * // ➔ false (invalid text)
 * textContainsAll("Hello", null);
 * // ➔ false (invalid searchWords)
 */
export const textContainsAll = <T extends string>(
  text?: T | null,
  searchWords?: T[] | string[] | null,
  options: OptionsTextContainsAll = {}
): boolean => {
  if (!isNonEmptyString(text) || !isArray(searchWords)) {
    return false;
  }

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Third parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  // fallback to default
  const { exactMatch = false, flags = "i" } = options;

  assertIsBoolean(exactMatch, {
    message: ({ currentType, validType }) =>
      `Parameter \`exactMatch\` property of the \`options\` (third parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  assertIsString(flags, {
    message: ({ currentType, validType }) =>
      `Parameter \`flags\` property of the \`options\` (third parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  // Escape special regex characters to prevent unintended behavior
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Filter out empty search words
  const validSearchWords = searchWords
    .filter((word) => isNonEmptyString(word))
    .map(escapeRegex);

  if (validSearchWords.length === 0) return false;

  // Create regex pattern: Whole word match (`\bword\b`) <- is deprecated. if `exactMatch` is true
  return validSearchWords.every((word) => {
    const pattern = exactMatch ? `(?<!\\S)${word}(?!\\S)` : word;
    return new RegExp(pattern, flags.includes("u") ? flags : flags + "u").test(
      text
    );
  });
};
