import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `getInitialsName`.***
 * ----------------------------------------------------------
 * **Extracts initials from the given name string.**
 * - **Behavior:**
 *    - For names with two or more words, returns the first letter of the first and second words.
 *    - For a single word with 2+ characters, returns the first two letters.
 *    - For a single character, returns that character.
 *    - For `empty`, `null`, `undefined` or `whitespace-only input`, returns an empty string (`""`).
 * @param {string | null | undefined} name - The name to extract initials from.
 * @returns {string} The extracted initials (e.g., "JD" for "John Doe").
 * @example
 * getInitialsName("Alice");             // ➔ "AL"
 * getInitialsName("John Doe");          // ➔ "JD"
 * getInitialsName(" Bob Marley ");      // ➔ "BM"
 * getInitialsName("John Ronald Donal"); // ➔ "JR"
 * getInitialsName("Lord John Doe Moe"); // ➔ "LJ"
 * getInitialsName("X");                 // ➔ "X"
 * getInitialsName("");                  // ➔ "" (empty string)
 * getInitialsName("  ");                // ➔ "" (empty string)
 * getInitialsName(null);                // ➔ "" (null input)
 * getInitialsName(undefined);           // ➔ "" (undefined input)
 */
export const getInitialsName = (name: string | null | undefined): string => {
  if (!isNonEmptyString(name)) return ""; // Handle empty string case

  // Trim spaces and remove duplicate spaces
  name = name.replace(/\s+/g, " ").trim();

  const nameParts = name.split(" ");

  if (nameParts.length > 1) {
    // First letter of first and second words
    return nameParts[0][0] + nameParts[1][0].toUpperCase();
  }

  return name.length > 1
    ? name.substring(0, 2).toUpperCase()
    : // First two letters for single-word names
      name[0].toUpperCase();
};
