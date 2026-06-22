import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/**
 * Configuration options for the `getInitialsName` utility.
 */
export interface GetInitialsOptions {
  /**
   * If `true`, extracts the second initial from the last word (for names with 2+ words), defaultValue: `true`.
   *
   * @default true
   */
  useLastWord?: boolean;
  /**
   * If `true`, the second letter will be lowercase (for single-word names), defaultValue: `true`.
   *
   * @default true
   */
  lowercaseSecondLetter?: boolean;
}

/** ----------------------------------------------------------
 * * ***Utility: `getInitialsName`.***
 * -----------------------------------------------------------
 * **Extracts initials from the given name string.**
 *
 * ---
 * - **Behavior:**
 *      - For names with two or more words, returns the first letter of the first word,
 *        and the second letter from the last word (by default), unless `useLastWord` is false.
 *      - For a single word with 2+ characters, returns the first two letters. The second
 *        letter will be lowercase (by default), unless `lowercaseSecondLetter` is false.
 *      - For a single character, returns that character in uppercase.
 *      - For `empty`, `null`, `undefined` or `whitespace-only input`, returns an empty string (`""`).
 *
 * ---
 * @param {string | null | undefined} name - The name to extract initials from.
 * @param {GetInitialsOptions} [options] - Configuration options for initial extraction.
 *
 * ---
 * @returns {string} The extracted initials.
 *
 * ---
 * @example
 * // Single-word names:
 * getInitialsName("Alice");
 * // ➔ "Al" (Default: lowercaseSecondLetter is true)
 * getInitialsName("Alice", { lowercaseSecondLetter: false });
 * // ➔ "AL"
 *
 * // Two-word names:
 * getInitialsName("John Ronald");
 * // ➔ "JR"
 *
 * // Three or more words:
 * getInitialsName("John Ronald Donal");
 * // ➔ "JD" (Default: useLastWord is true)
 * getInitialsName("John Ronald Donal", { useLastWord: false });
 * // ➔ "JR"
 *
 * // Edge cases:
 * getInitialsName("X");
 * // ➔ "X"
 * getInitialsName("   John    Doe   ");
 * // ➔ "JD"
 * getInitialsName(null);
 * // ➔ ""
 */
export const getInitialsName = (
  name: string | null | undefined,
  options?: GetInitialsOptions
): string => {
  // Assumes isNonEmptyString() is defined elsewhere in your codebase
  if (!isNonEmptyString(name)) return "";

  const { useLastWord = true, lowercaseSecondLetter = true } = options || {};

  // Trim spaces and remove duplicate spaces
  name = name.replace(/\s+/g, " ").trim();

  const nameParts = name.split(" ");

  // Handle names with two or more words
  if (nameParts.length > 1) {
    const firstInitial = nameParts[0]?.[0] ?? "";
    const secondWordIndex = useLastWord ? nameParts.length - 1 : 1;
    const secondInitial = nameParts[secondWordIndex]?.[0] ?? "";

    return (firstInitial + secondInitial).toUpperCase();
  }

  // Handle single-word names with more than one character
  if (name.length > 1) {
    const firstLetter = name[0]?.toUpperCase() ?? "";
    const secondLetter = lowercaseSecondLetter
      ? (name[1]?.toLowerCase() ?? "")
      : (name[1]?.toUpperCase() ?? "");

    return firstLetter + secondLetter;
  }

  // Handle single-character names
  return name[0]?.toUpperCase() ?? "";
};
