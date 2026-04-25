import {
  hasOwnProp,
  isNonEmptyString,
  isObject,
  isObjectOrArray,
  isString
} from "@rzl-zone/utils-js/predicates";

/** --------------------------------------------------------------------------
 * * ***Shiki transformer to clean extra whitespace before `[!code ...]` markers.***
 * --------------------------------------------------------------------------
 *
 * - ***What this transformer does:***
 *    - Removes unnecessary whitespace before special `[!code ...]` highlight markers.
 *    - Works across multiple programming languages supported by Shiki.
 *    - Preserves the correct comment syntax for each detected language.
 *
 * ---
 *
 * ⚙️ ***How it works:***
 * - Traverses the HAST (HTML AST) tree of a code block recursively.
 * - Targets only `text` nodes and rewrites their `value`.
 * - Detects the language from the root node `className`
 *   (e.g. `language-ts`, `language-js`).
 * - Delegates cleanup logic to `cleanCodeHighlightMarkers`.
 *
 * ---
 *
 * ℹ️ ***Language awareness:***
 * - Automatically adapts comment syntax based on language.
 * - Supports line comments (`//`, `#`, `--`, etc).
 * - Supports block comments (`/* *\/`, `<!-- -->`, `--[[ ]]`, etc).
 * - Falls back safely when language is unknown.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - This transformer **mutates the HAST nodes in-place**.
 * - Intended to be used inside the `rehype` pipeline.
 * - Designed specifically for Shiki highlight marker formatting.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Shiki + rehype integrations
 *    - Markdown / MDX code highlighting cleanup
 *    - Preventing malformed `[!code]` highlight directives
 *
 * @returns
 * A Shiki-compatible transformer object for `rehypeCode.transformers`.
 *
 * @example
 * ```ts
 * rehypeCode({
 *   transformers: [transformerCleanCodeHighlightMarkers()]
 * });
 * ```
 */
export function transformerCleanCodeHighlightMarkers() {
  return {
    name: "transformer-clean-code-highlight-markers",
    /**
     * Transformer hook invoked by Shiki for each code block.
     *
     * @param hast - Root HAST node representing the rendered code block.
     *
     * @returns
     * The same HAST node reference with cleaned highlight markers.
     */
    code<T>(hast: T) {
      function traverse(node: unknown): void {
        if (
          hasOwnProp(node, "type") &&
          node.type === "text" &&
          hasOwnProp(node, "value") &&
          isString(node.value)
        ) {
          // Get language from root node className (e.g. "language-ts")
          // Fallback to empty string if unavailable
          const lang =
            isObject(hast) &&
            hasOwnProp(hast, "properties") &&
            hasOwnProp(hast.properties, "className") &&
            isObjectOrArray(hast.properties.className) &&
            isNonEmptyString(hast.properties.className[0])
              ? hast.properties.className[0]
              : undefined;
          node.value = cleanCodeHighlightMarkers(node.value, lang);
        } else if (
          hasOwnProp(node, "children") &&
          isObjectOrArray(node.children)
        ) {
          for (const child of node.children) {
            traverse(child);
          }
        }
      }
      traverse(hast);
      return hast;
    }
  };
}

/** --------------------------------------------------------------------------
 * * ***Remove extra whitespace before `[!code ...]` highlight markers.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Cleans up whitespace before `[!code ...]` markers inside comments.
 *    - Preserves original comment prefixes.
 *    - Works for both line and block comment styles.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Detects comment syntax using `getCommentSyntax`.
 * - Normalizes patterns like:
 *   ```ts
 *   //    [!code highlight]
 *   ```
 *   into:
 *   ```ts
 *   // [!code highlight]
 *   ```
 *
 * ---
 *
 * 🧩 ***Supported comment types:***
 * - Line comments (`//`, `#`, `--`, `;`, `"`, etc).
 * - Block comments (`/* *\/`, `<!-- -->`, `--[[ ]]`).
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Operates on raw text content only.
 * - Does **not** parse or validate syntax trees.
 * - Safe for repeated execution (idempotent).
 *
 * ---
 *
 * - ***Designed for:***
 *    - Shiki highlight markers
 *    - Markdown code fences
 *    - Multi-language documentation pipelines
 *
 * @param code - Raw code text content.
 * @param lang - Optional language identifier (e.g. `ts`, `js`, `python`).
 *
 * @returns
 * Cleaned code string with normalized highlight markers.
 *
 * @example
 * ```ts
 * cleanCodeHighlightMarkers("//   [!code highlight]", "ts");
 * // ➔ "// [!code highlight]"
 * ```
 */
function cleanCodeHighlightMarkers(code: string, lang?: string): string {
  const syntax = getCommentSyntax(lang);
  const marker = "[!code";

  // Handle line comments
  const linePattern = new RegExp(
    `(\\s*)(${escapeRegex(syntax.line)}\\s*)${escapeRegex(marker)}`,
    "g"
  );

  let cleaned = code.replace(
    linePattern,
    (_, _ws, prefix) => `${prefix}${marker}`
  );

  // Handle block comments if applicable
  if (syntax.block) {
    const [open] = syntax.block;
    const blockPattern = new RegExp(
      `(\\s*)(${escapeRegex(open)}\\s*)${escapeRegex(marker)}`,
      "g"
    );
    cleaned = cleaned.replace(
      blockPattern,
      (_, _ws, prefix) => `${prefix}${marker}`
    );
  }

  return cleaned;
}

/** --------------------------------------------------------------------------
 * * ***Detect comment syntax for a given programming language.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Maps a language identifier to its comment syntax.
 *    - Supports both line and block comments when applicable.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Normalizes the language name (`lowercase + trim`).
 * - Uses a predefined lookup table.
 * - Falls back to C-style comments if unknown.
 *
 * ---
 *
 * ℹ️ ***Supported languages:***
 * - C-style: JS, TS, Java, Rust, Go, PHP, CSS, etc.
 * - Shell-style: Bash, Zsh, Fish, Dockerfile.
 * - Data & config: YAML, TOML, INI.
 * - Markup: HTML, XML, Markdown.
 * - Scripting: Python, Lua, PowerShell, Vim.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Language detection relies on Shiki-provided class names.
 * - Unknown or missing language safely defaults.
 *
 * @param lang - Language identifier (e.g. `ts`, `python`, `html`).
 *
 * @returns
 * An object describing line and optional block comment syntax.
 */
function getCommentSyntax(lang?: string): {
  line: string;
  block?: [string, string];
} {
  const map: Record<string, { line: string; block?: [string, string] }> = {
    // C-style
    c: { line: "//", block: ["/*", "*/"] },
    cpp: { line: "//", block: ["/*", "*/"] },
    csharp: { line: "//", block: ["/*", "*/"] },
    java: { line: "//", block: ["/*", "*/"] },
    kotlin: { line: "//", block: ["/*", "*/"] },
    swift: { line: "//", block: ["/*", "*/"] },
    dart: { line: "//", block: ["/*", "*/"] },
    go: { line: "//", block: ["/*", "*/"] },
    rust: { line: "//", block: ["/*", "*/"] },
    scala: { line: "//", block: ["/*", "*/"] },
    php: { line: "//", block: ["/*", "*/"] },
    js: { line: "//", block: ["/*", "*/"] },
    jsx: { line: "//", block: ["/*", "*/"] },
    ts: { line: "//", block: ["/*", "*/"] },
    tsx: { line: "//", block: ["/*", "*/"] },
    css: { line: "//", block: ["/*", "*/"] },
    less: { line: "//", block: ["/*", "*/"] },
    scss: { line: "//", block: ["/*", "*/"] },
    // Shell style
    sh: { line: "#" },
    bash: { line: "#" },
    zsh: { line: "#" },
    fish: { line: "#" },
    // Python & data
    py: { line: "#" },
    python: { line: "#" },
    r: { line: "#" },
    yaml: { line: "#" },
    yml: { line: "#" },
    toml: { line: "#" },
    ini: { line: ";" },
    // SQL & Lua style
    sql: { line: "--", block: ["/*", "*/"] },
    lua: { line: "--", block: ["--[[", "]]"] },
    // Lisp, Scheme
    lisp: { line: ";" },
    scheme: { line: ";" },
    // HTML-like
    html: { line: "//", block: ["<!--", "-->"] },
    xml: { line: "//", block: ["<!--", "-->"] },
    md: { line: "<!--", block: ["<!--", "-->"] },
    markdown: { line: "<!--", block: ["<!--", "-->"] },
    // Config-like
    dockerfile: { line: "#" },
    nginx: { line: "#" },
    hcl: { line: "#" },
    terraform: { line: "#" },
    // PowerShell
    powershell: { line: "#" },
    ps1: { line: "#" },
    // Vim
    // eslint-disable-next-line quotes
    vim: { line: `"` },
    // eslint-disable-next-line quotes
    vimscript: { line: `"` },
    // Fallback
    default: { line: "//", block: ["/*", "*/"] }
  };

  const normalized = lang?.toLowerCase().trim();
  return isNonEmptyString(normalized) && map[normalized]
    ? map[normalized]
    : map.default!;
}

/** --------------------------------------------------------------------------
 * * ***Escape a string for safe usage inside RegExp patterns.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Escapes all RegExp special characters.
 *    - Ensures the string can be safely embedded in dynamic RegExp.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Intended for internal utility usage.
 * - Does not validate RegExp correctness beyond escaping.
 *
 * @param str - Raw string to escape.
 *
 * @returns
 * RegExp-safe escaped string.
 */
function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
