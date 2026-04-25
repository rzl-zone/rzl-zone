/* eslint-disable no-useless-escape */
/** --------------------------------------------------------------------------
 * * ***Remove Markdown syntax and return plain text output.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Strips common Markdown syntax into readable plain text.
 *    - Supports GitHub Flavored Markdown (GFM).
 *    - Optionally preserves or transforms specific Markdown features.
 *
 * ---
 *
 * ⚙️ ***Supported transformations:***
 * - Removes headings, emphasis, code blocks, blockquotes, and rules.
 * - Converts lists into plain text (optionally with custom bullet symbols).
 * - Handles images, links, footnotes, abbreviations, and inline code.
 * - Optionally keeps image alt text or replaces links with raw URLs.
 *
 * ---
 *
 * 🧩 ***HTML handling:***
 * - Removes all HTML tags by default.
 * - Allows skipping specific HTML tags via `htmlTagsToSkip`.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - This is a **best-effort Markdown stripper**, not a full Markdown parser.
 * - Regex-based approach may not handle malformed Markdown perfectly.
 * - When `throwError` is disabled, errors are swallowed and logged.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Search indexing
 *    - Text previews and excerpts
 *    - Content sanitization
 *    - Markdown-to-text conversion
 *
 * @param md - Markdown source string.
 * @param options - Configuration options for Markdown removal behavior.
 *
 * @returns
 * A plain text string with Markdown syntax removed.
 *
 * @example
 * ```ts
 * removeMarkdown("# Hello **World**");
 * // ➔ "Hello World"
 * ```
 *
 * @example
 * ```ts
 * removeMarkdown(
 *   "- Item 1\n- Item 2",
 *   { listUnicodeChar: "•" }
 * );
 * ```
 */
export interface RemoveMarkdownOptions {
  /** Whether to strip list markers (`-`, `*`, `+`, `1.`).
   *
   * @default true
   */
  stripListLeaders?: boolean;

  /** Custom unicode character to replace list markers.
   * Set to `false` to remove list markers entirely.
   *
   * @default false
   */
  listUnicodeChar?: string | false;

  /** Enable GitHub Flavored Markdown support.
   *
   * @default true
   */
  gfm?: boolean;

  /** Use image alt text instead of removing images entirely.
   *
   * @default true
   */
  useImgAltText?: boolean;

  /** Remove Markdown abbreviation definitions.
   *
   * @default false
   */
  abbr?: boolean;

  /** Replace Markdown links with their URL instead of link text.
   *
   * @default false
   */
  replaceLinksWithURL?: boolean;

  /** List of HTML tag names to preserve.
   *
   * @default []
   */
  htmlTagsToSkip?: string[];

  /** Throw errors instead of swallowing and logging them.
   *
   * @default false
   */
  throwError?: boolean;
}

/** --------------------------------------------------------------------------
 * * ***Strip Markdown syntax from a string.***
 * --------------------------------------------------------------------------
 *
 * @param md - Markdown source string.
 * @param options - {@link RemoveMarkdownOptions | **`RemoveMarkdownOptions`**}.
 *
 * @returns
 * Plain text output with Markdown syntax removed.
 */
export default function removeMarkdown(
  md: string,
  options: RemoveMarkdownOptions = {}
): string {
  const {
    stripListLeaders = true,
    listUnicodeChar = false,
    gfm = true,
    useImgAltText = true,
    abbr = false,
    replaceLinksWithURL = false,
    htmlTagsToSkip = [],
    throwError = false
  } = options;

  let output = md || "";

  // Remove horizontal rules
  output = output.replace(
    /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/gm,
    ""
  );

  try {
    if (stripListLeaders) {
      if (listUnicodeChar) {
        output = output.replace(
          /^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm,
          listUnicodeChar + " $1"
        );
      } else {
        output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1");
      }
    }

    if (gfm) {
      output = output
        .replace(/\n={2,}/g, "\n") // Header
        .replace(/~{3}.*\n/g, "") // Fenced codeblocks
        .replace(/~~/g, "") // Strikethrough
        .replace(/```(?:.*)\n([\s\S]*?)```/g, (_, code) => code.trim()); // Fenced codeblocks with backticks
    }

    if (abbr) {
      output = output.replace(/\*\[.*\]:.*\n/, ""); // Remove abbreviations
    }

    let htmlReplaceRegex = /<[^>]*>/g;
    if (htmlTagsToSkip.length > 0) {
      const joined = htmlTagsToSkip.join("|");
      htmlReplaceRegex = new RegExp(
        `<(?!\/?(${joined})(?=>|\\s[^>]*>))[^>]*>`,
        "g"
      );
    }

    output = output
      .replace(htmlReplaceRegex, "") // Remove HTML tags
      .replace(/^[=\-]{2,}\s*$/g, "") // Remove setext-style headers
      .replace(/\[\^.+?\](\: .*?$)?/g, "") // Remove footnotes
      .replace(/\s{0,2}\[.*?\]: .*?$/g, "")
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, useImgAltText ? "$1" : "") // Images
      .replace(
        /\[([\s\S]*?)\]\s*[\(\[].*?[\)\]]/g,
        replaceLinksWithURL ? "$2" : "$1"
      ) // Inline links
      .replace(/^(\n)?\s{0,3}>\s?/gm, "$1") // Blockquotes
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "") // Reference links
      .replace(
        /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm,
        "$1$3$4$6"
      ) // Atx headers
      .replace(/([\*]+)(\S)(.*?\S)??\1/g, "$2$3") // * emphasis
      .replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, "$1$3$4$5") // _ emphasis
      .replace(/(`{3,})(.*?)\1/gm, "$2") // Single-line code blocks
      .replace(/`(.+?)`/g, "$1") // Inline code
      .replace(/~(.*?)~/g, "$1"); // Strikethrough
  } catch (e) {
    if (throwError) throw e;
    console.error("remove-markdown encountered error:", e);
    return md;
  }

  return output;
}
