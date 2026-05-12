import { isArray } from "../is/isArray";
import { isNonEmptyString } from "../is/isNonEmptyString";

import { assertIsString } from "@/assertions/strings/assertIsString";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type OptionsTextContainsAny = {
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
 * * ***Predicate: `textContainsAny`.***
 * ----------------------------------------------------------
 * **Checks if the given `text` contains at least one of the specified `searchWords`.**
 * - **Behavior:**
 *    - Returns `false` if `text` or `searchWords` is `null`/`undefined`/invalid.
 *    - Uses **regular expressions** for flexible pattern matching.
 *    - **Escapes special characters** to prevent regex injection attacks.
 *    - **Trims input** to avoid false positives with empty spaces.
 *    - **Supports exact word matching** (optional).
 * @param {string|null|undefined} text - The string text to search within.
 * @param {string[]|null} [searchWords] - An array of words/phrases to match against the text.
 * @param {OptionsTextContainsAny} [options] - Optional configuration object.
 * @param {OptionsTextContainsAny["exactMatch"]} [options.exactMatch=false] - If `true`, matches whole words only, defaultValue is `false`.
 * @param {OptionsTextContainsAny["flags"]} [options.flags="i"] - Optional regex flags (default: `"i"` for case-insensitive).
 * @returns {boolean} Return `true` if at least one `searchWord` is found in `text`, otherwise `false`.
 * @example
 * textContainsAny("Hello world", ["hello", "test"]);
 * // ➔ true
 * textContainsAny("withAI APP", ["chat", "ai"]);
 * // ➔ false
 * textContainsAny("TypeScript is great!", ["script", "java"]);
 * // ➔ true
 * textContainsAny("open-source", ["open"], { exactMatch: true });
 * // ➔ false (because options `exactMatch=true`)
 * textContainsAny(null, ["test"]);
 * // ➔ false (invalid text)
 * textContainsAny("Hello", null);
 * // ➔ false (invalid searchWords)
 */
export const textContainsAny = <T extends string>(
  text?: T | null,
  searchWords?: T[] | string[] | null,
  options: OptionsTextContainsAny = {}
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

  const pattern = exactMatch
    ? `(?<!\\S)(${validSearchWords.join("|")})(?!\\S)`
    : `(${validSearchWords.join("|")})`;

  return new RegExp(pattern, flags.includes("u") ? flags : flags + "u").test(
    text
  );
};
