import type { ElementContent, Element } from "hast";
import { type ShikiTransformer } from "shiki";

/** --------------------------------------------------------------------------
 * * ***Shiki transformer to trim trailing whitespace in code blocks.***
 * --------------------------------------------------------------------------
 *
 * - ***What this transformer does:***
 *    - Removes trailing spaces and tabs at the end of each code line.
 *    - Preserves newline characters (`\n`, `\r\n`).
 *    - Operates safely on nested HAST structures.
 *
 * ---
 *
 * ⚙️ ***How it works:***
 * - Iterates through each top-level line node of a code block.
 * - Locates the deepest last `text` node per line.
 * - Trims only trailing `[space | tab]` before newline or end-of-string.
 *
 * ---
 *
 * ℹ️ ***Traversal strategy:***
 * - Depth-first recursion.
 * - Prioritizes the last child first.
 * - Stops early once a valid text node is processed.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - This transformer **mutates HAST nodes in-place**.
 * - Does **not** parse syntax or tokens.
 * - Safe to run multiple times (idempotent).
 *
 * ---
 *
 * - ***Designed for:***
 *    - Shiki + rehype pipelines
 *    - Markdown / MDX code rendering
 *    - Preventing invisible trailing whitespace issues
 *
 * @returns
 * A Shiki-compatible transformer object.
 *
 * @example
 * ```ts
 * rehypeCode({
 *   transformers: [transformerTrimTrailingWhitespace()]
 * });
 * ```
 */
export function transformerTrimTrailingWhitespace(): ShikiTransformer {
  return {
    name: "transformer-trim-trailing-whitespace",

    /**
     * Transformer hook executed by Shiki for each code block.
     *
     * @param hast - Root HAST element representing the rendered code block.
     *
     * @returns
     * The same HAST node reference with trailing whitespace removed.
     */
    code(hast: Element): Element {
      if (!hast.children) return hast;

      for (const lineNode of hast.children) {
        trimTrailingSpaceDeepLastTextNode(lineNode);
      }

      return hast;
    }
  };
}

/** --------------------------------------------------------------------------
 * * ***Trim trailing whitespace from the deepest last text node.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Recursively searches for the deepest last `text` node.
 *    - Removes trailing spaces and tabs before newline or EOF.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Checks leaf nodes first.
 * - Prioritizes last-child traversal.
 * - Stops recursion once trimming is performed.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Internal helper utility.
 * - Does not allocate new nodes.
 * - Returns early to prevent unnecessary traversal.
 *
 * @param node - HAST node to inspect.
 *
 * @returns
 * `true` if a text node was found and trimmed, otherwise `false`.
 */
function trimTrailingSpaceDeepLastTextNode(node?: ElementContent): boolean {
  if (!node) return false;

  // If no children, check if this is a text node and trim
  if (!("children" in node) || !node.children?.length) {
    if (node.type === "text") {
      node.value = node.value.replace(/[ \t]+(?=\r?\n|$)/g, "");
      return true;
    }
    return false;
  }

  // Recursively check the last child first
  const lastChild = node.children[node.children.length - 1];
  if (trimTrailingSpaceDeepLastTextNode(lastChild)) return true;

  // If not found, check siblings from the end before the last child
  for (let i = node.children.length - 2; i >= 0; i--) {
    if (trimTrailingSpaceDeepLastTextNode(node.children[i])) return true;
  }

  return false;
}
