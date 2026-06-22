import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { capitalizeWords } from "../capitalizations";

/**
 * Configuration options for the `getDisplayName` utility.
 */
type GetDisplayNameOptions = {
  /**
   * If `true`, extracts the second display word from the last word (for names with 3+ words), defaultValue: `true` (e.g., "John Michael Doe" -> "John Doe").
   *
   * @default true
   */
  useLastWord?: boolean;
  /**
   * If `true`, forces the first letter of each word to be uppercase and the rest lowercase.
   * If `false`, returns the words in their original casing.
   *
   * @default true
   */
  capitalizeFirst?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `getDisplayName`.***
 * -----------------------------------------------------------
 * **Formats a full name into a cleaner display name.**
 *
 * ---
 * - **Behavior:**
 *      - For names with 3+ words, returns the first and last word (by default), unless `useLastWord` is false.
 *      - For single or two-word names, returns the formatted words.
 *      - Applies Title Case formatting by default (`capitalizeFirst`), converting "JOHN DOE" to "John Doe".
 *      - For `empty`, `null`, `undefined` or `whitespace-only input`, returns an empty string (`""`).
 *
 * ---
 * @param {string | null | undefined} name - The name string to format.
 * @param {GetDisplayNameOptions} [options] - Configuration options for display formatting.
 *
 * ---
 * @returns {string} The formatted display name.
 *
 * ---
 * @example
 * // Standard two-word names:
 * getDisplayName("john doe");
 * // ➔ "John Doe"
 * getDisplayName("JOHN DOE");
 * // ➔ "John Doe"
 *
 * // Names with three or more words:
 * getDisplayName("john michael doe");
 * // ➔ "John Doe" (Default: useLastWord is true)
 * getDisplayName("john michael doe", { useLastWord: false });
 * // ➔ "John Michael"
 *
 * // Single word or single letter:
 * getDisplayName("jo");
 * // ➔ "Jo"
 * getDisplayName("j");
 * // ➔ "J"
 *
 * // Disabling auto-capitalization:
 * getDisplayName("JOHN DOE", { capitalizeFirst: false });
 * // ➔ "JOHN DOE"
 * getDisplayName("john michael doe", { useLastWord: false, capitalizeFirst: false });
 * // ➔ "john michael"
 *
 * // Handling messy whitespace:
 * getDisplayName("   john    michael   doe   ");
 * // ➔ "John Doe"
 *
 * // Handling empty or invalid inputs:
 * getDisplayName("");
 * // ➔ ""
 * getDisplayName(null);
 * // ➔ ""
 */
export const getDisplayName = (
  name: string | null | undefined,
  options?: GetDisplayNameOptions
): string => {
  // Assumes isNonEmptyString() is defined elsewhere in your codebase
  if (!isNonEmptyString(name)) return "";

  const { useLastWord = true, capitalizeFirst = true } = options || {};

  // Trim spaces and remove duplicate spaces
  name = name.replace(/\s+/g, " ").trim();

  const nameParts = name.split(" ");

  // Helper function to format a single word safely
  const formatWord = (word: string | undefined): string => {
    if (!word) return "";
    if (!capitalizeFirst) return word;

    return capitalizeWords(word, { trim: true, collapseSpaces: true });
  };

  // Handle single-word names
  if (nameParts.length === 1) {
    return formatWord(nameParts[0]);
  }

  // Handle names with two or more words
  const firstWord = formatWord(nameParts[0]);
  const secondWordIndex = useLastWord ? nameParts.length - 1 : 1;
  const secondWord = formatWord(nameParts[secondWordIndex]);

  return `${firstWord} ${secondWord}`;
};
