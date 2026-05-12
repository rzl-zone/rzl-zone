import { isNil } from "@/predicates/is/isNil";
import { isInteger } from "@/predicates/is/isInteger";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { getPreciseType } from "@/predicates/type/getPreciseType";

import { assertIsString } from "@/assertions/strings/assertIsString";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

import { normalizeSpaces } from "@/strings/sanitizations/normalizeSpaces";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

type ChunkStringOptions = {
  /** ***The separator string to insert between characters or words.***
   *
   * - Used when inserting separators every `limiter` characters.
   * - Default is a single space `" "`.
   *
   * @default " "
   */
  separator?: string;

  /** ***Determines whether counting for `limiter` resets after each space.***
   *
   * - If `true`, the string is treated as words separated by spaces,
   *   and separators are applied within words, then words are grouped.
   * - If `false` ***(default)***, counting is continuous across the whole string,
   *   treating spaces as normal characters.
   *
   * @default false
   */
  reCountAfterSpace?: boolean;
};

/** ----------------------------------------------
 * * ***Utility: `chunkString`.***
 * ----------------------------------------------
 * **Chunks a string by inserting a separator every `limiter` characters.**
 * - **This function handles two main behaviors based on `reCountAfterSpace`:**
 *    1. ***If `reCountAfterSpace` is `false` (default):***
 *        - The separator is inserted strictly every `limiter` characters throughout the entire string, regardless of spaces, spaces are treated as regular characters in the count.
 *            - Example: `chunkString("1234567890", 3, "-")` ➔ `"123-456-789-0"`.
 *            - Example: `chunkString("Hello World", 3, "-")` ➔ `"Hel-lo -Wor-ld"`.
 *    2. ***If `reCountAfterSpace` is `true`:***
 *        - The function first processes the input string to replace any multiple consecutive spaces with a
 *          single space (e.g., "A   B" becomes "A B").
 *      Then, it treats the string as a sequence of "words" (segments separated by single spaces).
 *            - Each word is processed independently:
 *              - if a word's length exceeds the `limiter`, separators are inserted internally within that word.
 *              - Words are then grouped. Each group will contain `limiter` number of words.
 *              - Words within the same group are joined by the specified `separator`.
 *              - Finally, these groups are joined by a single space, preserving the original word separation
 *                structure between groups.
 * @param {string} subject - ***The target string to chunk.****
 * @param {number} limiter
 *  ***The interval (number of characters) for inserting separators, behavior:***
 *   - If `reCountAfterSpace = false`, it counts characters.
 *   - If `reCountAfterSpace = true`, it counts both characters within words and words per group.
 * @param {ChunkStringOptions} [options={}] - ***Optional settings for separator and counting behavior.***
 * @returns {string} Return the formatted string with separators.
 * @example
 * // Basic usage
 * chunkString("1234567890", 3);
 * // ➔ "123 456 789 0"
 *
 * // Basic usage `reCountAfterSpace = false` (default)
 * chunkString("1234567890", 3, { separator: "-");
 * // ➔ "123-456-789-0"
 * chunkString("HelloWorld", 2, { separator: "_", reCountAfterSpace: false });
 * // ➔ "He_ll_oW_or_ld"
 *
 * // Usage with reCountAfterSpace = true:
 * // Multiple spaces are normalized to single spaces before processing.
 * chunkString("AB  CD   EF GH", 2, { separator: "-", reCountAfterSpace: true });
 * // ➔ "AB-CD EF-GH" (after normalization to "AB CD EF GH")
 * // Words "AB" and "CD" form a group and are joined by "-", "EF" and "GH" form another group.
 * // The groups "AB-CD" and "EF-GH" are then joined by a space.
 *
 * // Another usage with reCountAfterSpace = true:
 * chunkString("ABC DEF GHI JKL", 3, { separator: "-", reCountAfterSpace: true });
 * // ➔ "ABC-DEF-GHI JKL"
 * // Words "ABC", "DEF", "GHI" form a group and are joined by "-".
 * // The word "JKL" forms its own group (as it's the last word and completes no other group).
 * // The groups "ABC-DEF-GHI" and "JKL" are then joined by a space.
 */
export function chunkString(
  subject: string,
  limiter: number,
  options: ChunkStringOptions = {}
): string {
  if (isNil(subject) || limiter <= 0) return subject;

  assertIsString(subject, {
    message: ({ currentType, validType }) =>
      `First parameter (\`subject\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  if (!isInteger(limiter)) {
    throw new TypeError(
      `Second parameter (\`limiter\`) must be of type \`integer-number\`, but received: \`${getPreciseType(
        limiter
      )}\`, with value: \`${safeStableStringify(limiter, {
        keepUndefined: true
      })}\`.`
    );
  }

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Third parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const separator = hasOwnProp(options, "separator") ? options.separator : " ";
  const reCountAfterSpace = hasOwnProp(options, "reCountAfterSpace")
    ? options.reCountAfterSpace
    : false;

  assertIsString(separator, {
    message: ({ currentType, validType }) =>
      `Parameter \`separator\` property of the \`options\` (third parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  assertIsBoolean(reCountAfterSpace, {
    message: ({ currentType, validType }) =>
      `Parameter \`reCountAfterSpace\` property of the \`options\` (third parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  subject = normalizeSpaces(subject);

  // Handle reCountAfterSpace = false (assumed correct from previous iterations)
  if (!reCountAfterSpace) {
    let result = "";
    let currentCount = 0;

    for (let i = 0; i < subject.length; i++) {
      const char = subject[i];
      if (currentCount === limiter) {
        result += separator;
        currentCount = 0;
      }
      result += char;
      currentCount++;
    }
    return result;
  }

  // --- Dynamic Logic for reCountAfterSpace = true ---
  const words = subject.split(" "); // Split the string into individual words by spaces
  const finalSegments: string[] = [];

  let currentGroup: string[] = [];
  let wordsInCurrentGroupCount = 0; // This counts how many words are in the current group

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Check if the current word itself needs internal separators (e.g., "HelloWorld" with limiter 2)
    // For the given test cases ("AB", "CD", "ABC"), this inner loop doesn't add separators,
    // as the words themselves are shorter than or equal to the limiter.
    let processedWord = "";
    let charCountInWord = 0;
    for (let j = 0; j < word.length; j++) {
      processedWord += word[j];
      charCountInWord++;
      if (charCountInWord === limiter && j < word.length - 1) {
        processedWord += separator;
        charCountInWord = 0;
      }
    }

    currentGroup.push(processedWord);
    wordsInCurrentGroupCount++;

    // If the current group has reached the limiter (e.g., 2 words for limiter=2, or 3 words for limiter=3)
    // OR if it's the last word in the entire subject, finalize the group.
    if (wordsInCurrentGroupCount === limiter || i === words.length - 1) {
      finalSegments.push(currentGroup.join(separator)); // Join words within the group by separator
      currentGroup = []; // Reset group for the next set of words
      wordsInCurrentGroupCount = 0; // Reset group word count
    }
  }

  // Finally, join the main segments (groups) with spaces
  return finalSegments.join(" ");
}
