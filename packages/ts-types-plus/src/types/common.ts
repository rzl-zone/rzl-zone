/** -------------------------------------------------------
 * * ***Utility Type: `WordSeparator`.***
 * -------------------------------------------------------
 * **A type-level utility that defines all valid ***word separators***.**
 * - Can be a space `" "`, a dash `"-"`, or an underscore `"_"`.
 * @example
 * type A = WordSeparator; // ➔ " " | "-" | "_"
 */
export type WordSeparator = " " | "-" | "_";

/** --------------------------------------------------
 * * ***Utility Type: `Whitespace`.***
 * --------------------------------------------------
 * **Represents common whitespace characters.**
 * - ✅ Used as the default trimming characters in string utility types.
 * @example
 * type W = Whitespace; // ➔ " " | "\t" | "\r" | "\n"
 */
export type Whitespace = " " | "\t" | "\r" | "\n";
