import {
  createCommentNotationTransformer,
  type TransformerNotationMapOptions
} from "@shikijs/transformers";

/** --------------------------------------------------------------------------
 * * ***Custom notation map transformer for Shiki code blocks.***
 * --------------------------------------------------------------------------
 *
 * - ***What this transformer does:***
 *    - Extends Shiki’s `transformerNotationMap` behavior.
 *    - Processes `[!code ...]` comment notations inside code blocks.
 *    - Applies CSS classes to specific code lines based on notation tokens.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Detects comment patterns like:
 *    - `[!code highlight]`
 *    - `[!code error:3]`
 * - Extracts:
 *    - Notation tokens (e.g. `highlight`, `error`)
 *    - Optional line range (`:N`)
 * - Applies mapped CSS classes to the affected lines.
 *
 * ---
 *
 * ℹ️ ***Line range handling:***
 * - If a range is provided (`:N`), classes are applied to:
 *    - The current line
 *    - Plus the next `N - 1` lines
 * - Defaults to `:1` when no range is specified.
 *
 * ---
 *
 * 🧩 ***Class mapping:***
 * - Token-to-class mapping is defined via `options.classMap`.
 * - Multiple tokens may contribute multiple classes.
 * - Duplicate classes are automatically deduplicated.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - This transformer mutates the HAST nodes in-place.
 * - Invalid or unknown tokens are silently ignored.
 * - Intended to be used within the Shiki transformer pipeline.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Shiki-powered syntax highlighting
 *    - Line-level code annotations
 *    - Documentation and tutorial code blocks
 *
 * @param options - Configuration for class mapping and active `<pre>` classes.
 * @param name - Custom transformer name identifier.
 *
 * @returns
 * A Shiki-compatible comment notation transformer.
 */
export function transformerNotationMap(
  options: TransformerNotationMapOptions = {},
  name = "@shikijs/transformers:notation-map-custom"
) {
  const { classMap = {}, classActivePre = undefined } = options;

  const regex = /\s*\[!code ([^\]]+)(:\d+)?\]/;

  return createCommentNotationTransformer(
    name,
    regex,
    function ([_, match, range = ":1"], _line, _comment, lines, index) {
      const lineNum = Number.parseInt(range.slice(1), 10);

      const tokens = match?.split(/\s+/) ?? [];
      const classesToAdd = [
        ...new Set(tokens.flatMap((token) => classMap[token] || []))
      ];

      for (let i = index; i < Math.min(index + lineNum, lines.length); i++) {
        if (lines && lines[i]) {
          this.addClassToHast(lines[i]!, classesToAdd);
        }
      }

      if (classActivePre) {
        this.addClassToHast(this.pre, classActivePre);
      }

      return true;
    },
    options.matchAlgorithm
  );
}
