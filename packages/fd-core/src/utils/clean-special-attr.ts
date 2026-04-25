/** --------------------------------------------------------------------------
 * * ***Options for `cleanSpecialAttributeMdx`.***
 * --------------------------------------------------------------------------
 *
 * - ***Controls which MDX special attributes are removed.***
 *
 * ---
 *
 * ⚠️ ***Important behavior:***
 * - This function uses RegExp-based cleanup.
 * - It does **not** parse MDX or Markdown AST.
 *
 * ---
 *
 * @property cleanTagTocOnly
 * Remove only Table of Contents–related tags.
 *
 * When enabled:
 * - Removes `[!toc]`
 * - Removes slug-based TOC markers such as `xxx-toc`
 *
 * When disabled:
 * - Removes `[!toc]`
 * - Removes anchor-style attributes like `[#section]`
 *
 * @default false
 */
type CleanSpecialAttributeMdx = {
  /**
   * Remove only TOC-related tags.
   *
   * @default false
   */
  cleanTagTocOnly?: boolean;
};

/** --------------------------------------------------------------------------
 * * ***Remove special MDX attributes from a string.***
 * --------------------------------------------------------------------------
 *
 * - ***What this cleans:***
 *    - `[!toc]`
 *    - TOC slug markers (e.g. `heading-toc`)
 *    - Anchor-style attributes (e.g. `[#section]`)
 *
 * ---
 *
 * ⚙️ ***Behavior modes:***
 * - `cleanTagTocOnly = true`
 *    - Only TOC-related markers are removed.
 *
 * - `cleanTagTocOnly = false`
 *    - TOC markers **and** anchor attributes are removed.
 *
 * ---
 *
 * ⚠️ ***Limitations:***
 * - String-based RegExp matching.
 * - No AST parsing.
 *
 * ---
 *
 * @param val - MDX or markdown string.
 * @param options - Cleanup options.
 *
 * @returns Cleaned string.
 *
 * @example
 * ```ts
 * cleanSpecialAttributeMdx("Hello [!toc]");
 * // ➔ "Hello "
 *
 * cleanSpecialAttributeMdx("section-toc content", {
 *   cleanTagTocOnly: true
 * });
 * // ➔ " content"
 *
 * cleanSpecialAttributeMdx("Title [#anchor]");
 * // ➔ "Title "
 * ```
 */
export const cleanSpecialAttributeMdx = (
  val: string | undefined | null,
  { cleanTagTocOnly = false }: CleanSpecialAttributeMdx = {}
) => {
  if (!val) return "";

  if (cleanTagTocOnly) {
    // return val.replace(/\[!toc\]/g, "");
    return val.replace(/\[!toc\]|\b[\w-]+-toc\b/gi, "");
  }
  return val.replace(/\[!toc\]|\[#.*?\]/g, "");
};
