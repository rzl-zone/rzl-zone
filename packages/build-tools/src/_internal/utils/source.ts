import type { NodePath } from "@babel/traverse";

import * as t from "@babel/types";
import { parse } from "@babel/parser";
import traverseImport from "@babel/traverse";

import { isNonEmptyString } from "@/_internal/utils/helper";

/** @internal */
export const USE_STRICT_RE = /^['"]use strict['"];?\s*$/gm;
/** @internal */
export const SHEBANG_RE = /^#![^\r\n]*\r?\n/;
/** @internal */
export const BANNER_RE = /^(?:\/\*![\s\S]*?\*\/\s*)+/;

/** ----------------------------------------------------------------
 * * ***Matches JavaScript build output files.***
 * ----------------------------------------------------------------
 *
 * Includes common formats such as:
 * `.js`, `.mjs`, `.cjs`, `.esm.js`, and `.module.js`.
 *
 * @internal
 */
export const JS_OUTPUT_FILE_RE = /\.(?:js|mjs|cjs|esm\.js|module\.js)$/i;

/** ----------------------------------------------------------------
 * * ***Matches canonical JavaScript module output extensions.***
 * ----------------------------------------------------------------
 *
 * Matches Node.js standard module formats:
 * - `.js`.
 * - `.mjs`.
 * - `.cjs`.
 *
 * ⚠️ This regex also technically matches `.cmjs`,
 * though such files are extremely rare in practice.
 *
 * - ***Intended for:***
 *       - strict Node.js module outputs.
 *       - internal tooling where minimal matching is desired.
 *
 * @internal
 */
export const JS_MODULE_OUTPUT_FILE_RE = /\.(?:c?m?js)$/i;

/** ----------------------------------------------------------------
 * * ***Matches TypeScript declaration output files.***
 * ----------------------------------------------------------------
 *
 * Includes standard declaration formats:
 * `.d.ts`, `.d.mts`, and `.d.cts`.
 *
 * @internal
 */
export const TS_DECLARATION_FILE_RE = /\.d\.(?:ts|mts|cts)$/i;

/** ----------------------------------------------------------------
 * * ***Matches region marker comments in source files.***
 * ----------------------------------------------------------------
 *
 * Regular expression that detects single-line region marker comments
 * commonly used for code folding and logical section grouping.
 *
 * - ***Supported markers:***
 *       - `// #region`.
 *       - `// #endregion`.
 *
 * - ***Matching behavior:***
 *       - Allows any number of leading spaces or tabs.
 *       - Requires a single-line comment prefix (`//`).
 *       - Allows zero or more spaces between `//` and `#`
 *         (e.g. `//#region` and `// #region` are both valid).
 *       - Matches both opening (`#region`) and closing (`#endregion`) markers.
 *       - Uses a word boundary (`\b`) after `region` to prevent
 *         false positives such as `#regionX`.
 *       - Does **not** require the marker to be at the end of the line;
 *         trailing text is allowed.
 *
 * - ***Typical use cases:***
 *       - Parsing generated source files.
 *       - Preserving or removing code folding regions.
 *       - Detecting logical boundaries during code cleanup.
 *
 * @example
 * ```ts
 * REGION_RE.test("//#region");
 * // ➔ true
 *
 * REGION_RE.test("// #region utils");
 * // ➔ true
 *
 * REGION_RE.test("  //#endregion helpers");
 * // ➔ true
 *
 * REGION_RE.test("// #regionX");
 * // ➔ false
 * ```
 *
 * @internal
 */
export const REGION_RE = /^[ \t]*\/\/\s*#(?:end)?region\b.*$/i;
// export const REGION_RE = /^[ \t]*\/\/\s*#(?:end)?region\b/;

/** ----------------------------------------------------------------
 * * ***Matches source path comments emitted by bundlers or transpilers.***
 * ----------------------------------------------------------------
 *
 * Example:
 * ```js
 * // src/index.ts
 * // node_modules/react/index.js
 * ```
 *
 * @internal
 */
export const SOURCE_PATH_RE =
  /^[ \t]*\/\/\s*(?:\.\.\/|\.\/)*[^ \n]*?(?:src|node_modules)\//;

/** ----------------------------------------------------------------
 * * ***Matches ESLint directive comments.***
 * ----------------------------------------------------------------
 *
 * Example:
 * ```js
 * // eslint-disable-next-line
 * ```
 *
 * @internal
 */
export const ESLINT_RE = /^[ \t]*\/\/\s*eslint/;

/** ----------------------------------------------------------------
 * * ***Matches source map reference comments.***
 * ----------------------------------------------------------------
 *
 * Example:
 * ```js
 * //# sourceMappingURL=index.js.map
 * //@ sourceMappingURL=index.js.map
 * //@ sourceMappingURL=index.d.ts.map
 * //# sourceMappingURL=index.d.cts.map
 * //# sourceMappingURL=index.d.mts.map
 * ```
 *
 * @internal
 */
export const SOURCE_MAP_RE = /^[ \t]*\/\/[#@]\s*sourceMappingURL=\S+\s*$/;

/** ----------------------------------------------------------------
 * * ***Matches important comments that must be preserved.***
 * ----------------------------------------------------------------
 *
 * Regular expression that detects comments which **must not be removed**
 * during comment stripping or source cleanup.
 *
 * These comments are typically required for **legal compliance** or
 * **bundler/minifier optimizations** and therefore should be preserved
 * when generating distributable JavaScript.
 *
 * - ***Supported comment annotations:***
 *       - `/*! ... *\/`
 *         Important "bang" comments typically used for license banners.
 *
 *       - `@license`
 *       - `@preserve`
 *       - `@copyright`
 *          - Legal or attribution metadata that must remain in distributed code.
 *
 *       - `@cc_on`
 *         Legacy Internet Explorer conditional compilation directive.
 *
 *       - `@__PURE__`
 *       - `@__INLINE__`
 *       - `@__NOINLINE__`
 *       - `@__NO_SIDE_EFFECTS__`
 *         Optimization hints used by bundlers and minifiers for
 *         tree-shaking and inlining decisions.
 *
 * - ***Matching behavior:***
 *       - Detects "bang comments" beginning with `!` inside block comments.
 *       - Matches important license or preservation annotations.
 *       - Detects bundler optimization directives.
 *       - Intended for use in comment-stripping utilities.
 *
 * - ***Typical use cases:***
 *       - Stripping non-essential comments during build.
 *       - Preserving license banners in distributed packages.
 *       - Keeping optimization hints for bundlers and minifiers.
 *       - Maintaining compatibility with tooling such as Rollup,
 *         Webpack, Terser, and esbuild.
 *
 * @example
 * ```ts
 * IMPORTANT_COMMENT.test("! my-lib v1.0");
 * // ➔ true
 *
 * IMPORTANT_COMMENT.test("@license MIT");
 * // ➔ true
 *
 * IMPORTANT_COMMENT.test("@__PURE__");
 * // ➔ true
 *
 * IMPORTANT_COMMENT.test("@__NO_SIDE_EFFECTS__");
 * // ➔ true
 *
 * IMPORTANT_COMMENT.test("random comment");
 * // ➔ false
 * ```
 *
 * @internal
 * @removeDocRuntime
 */
export const IMPORTANT_COMMENT =
  /^!|@license|@preserve|@copyright|@cc_on|@__(PURE|INLINE|NOINLINE|NO_SIDE_EFFECTS)__/;

/** ----------------------------------------------------------------
 * * ***Matches empty or whitespace-only lines.***
 * ----------------------------------------------------------------
 *
 * Regular expression used to detect lines that contain **no visible
 * characters**, only whitespace or nothing at all.
 *
 * - ***Matching rules:***
 *       - Matches an empty string.
 *       - Matches lines containing only whitespace characters.
 *       - Accepts spaces, tabs, and other standard whitespace.
 *       - Rejects any line containing visible characters.
 *
 * This regex is typically used for **filtering or skipping blank lines**
 * during text or source code processing.
 *
 * @internal
 */
export const EMPTY_LINE_RE = /^\s*$/;

/** ----------------------------------------------------------------
 * * ***Matches documentation comments marked as removable.***
 * ----------------------------------------------------------------
 *
 * Regular expression that detects **documentation comments explicitly
 * marked for removal** during build output cleanup.
 *
 * This is intended for stripping development-only documentation from
 * compiled JavaScript while keeping important comments intact.
 *
 * ----------------------------------------------------------------
 *
 * - ***Supported directive tags***
 *
 *       - `@removeDoc`
 *         Marks a documentation block as **safe to remove** during
 *         build cleanup.
 *
 *       - `@keepDoc`
 *         Explicitly marks a documentation block that **must be preserved**.
 *
 * ----------------------------------------------------------------
 *
 * - ***Matching behavior***
 *
 *       - Matches block documentation comments containing `@removeDoc`.
 *       - Ignores documentation blocks containing `@keepDoc`.
 *       - Intended for use in **comment stripping utilities**.
 *
 * ----------------------------------------------------------------
 *
 * - ***Typical use cases***
 *
 *       - Removing internal documentation from distributed builds.
 *       - Keeping only public-facing documentation comments.
 *       - Reducing bundle size while preserving intentional comments.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * REMOVABLE_DOC_COMMENT.test("/** \\@removeDoc internal helper *\/");
 * // ➔ true
 *
 * REMOVABLE_DOC_COMMENT.test("/** \\@keepDoc public API *\/");
 * // ➔ false
 *
 * REMOVABLE_DOC_COMMENT.test("/** normal doc comment *\/");
 * // ➔ false
 * ```
 *
 * @internal
 * @removeDocRuntime
 */
export const REMOVABLE_DOC_COMMENT =
  /^\/\*\*(?![\s\S]*@keepDoc)[\s\S]*@removeDoc[\s\S]*?\*\//;

/** ----------------------------------------------------------------
 * * ***Determine if a comment should be removed based on directives runtime.***
 * ----------------------------------------------------------------
 *
 * This helper ensures that the directive detection only runs **inside
 * comment text**, not raw source. It applies the following logic:
 *
 *  1. `@keepDocRuntime` ➔ always force keep.
 *  2. `@removeDocRuntime` ➔ always force remove.
 *  3. No tag ➔ leave as default (undefined).
 *
 * ----------------------------------------------------------------
 *
 * @param commentText - inner text of the comment (from parser like Acorn)
 * @returns `true` if forced to remove, `false` if forced to keep, `undefined` if default
 *
 * @example
 * ```ts
 * const commentText = "* \\@removeDocRuntime Internal helper";
 * const result = shouldRemoveDocRuntime(commentText);
 * console.log(result); // true
 *
 * const keepText = "* \\@keepDoc public API";
 * console.log(shouldRemoveDocRuntime(keepText)); // false
 *
 * const normalText = "* normal comment";
 * console.log(shouldRemoveDocRuntime(normalText)); // undefined
 * ```
 *
 * @internal
 * @removeDocRuntime
 */
export function shouldRemoveDocRuntime(
  commentText: string
): boolean | undefined {
  const text = commentText.trim();

  const hasRemoveDocRuntime = /[@]removeDocRuntime\b/.test(text);
  const hasKeepDocRuntime = /[@]keepDocRuntime\b/.test(text);

  if (hasRemoveDocRuntime && hasKeepDocRuntime) {
    return true; // force remove
  }

  if (hasKeepDocRuntime) {
    return false; // force keep
  }

  if (hasRemoveDocRuntime) {
    return true; // force remove
  }

  return undefined; // default behavior
}
/** ----------------------------------------------------------------
 * * ***Matches files containing only top-level `"use *"` directives.***
 * ----------------------------------------------------------------
 *
 * Regular expression used to verify whether a source file consists
 * exclusively of one or more `"use <directive>"` statements.
 *
 * - ***Matching rules:***
 *       - Matches one or more `"use *"` directives.
 *       - Supports single or double quoted directives.
 *       - Allows optional semicolons and trailing whitespace.
 *       - Rejects any executable code or non-directive content.
 *
 * This regex is intended for **heuristic internal validation**
 * and does not perform full JavaScript parsing.
 *
 * @internal
 */
export const DIRECTIVE_RE = /^((?:(?:"use\s+\w+"|'use\s+\w+');\s*)+)/;

/** ----------------------------------------------------------------
 * * ***Matches executable code following top-level `"use *"` directives.***
 * ----------------------------------------------------------------
 *
 * Regular expression used to detect whether a source file contains
 * any content **after** one or more leading `"use <directive>"`
 * statements.
 *
 * - ***Matching rules:***
 *       - Requires at least one `"use <word>"` directive at the start.
 *       - Supports single or double quoted directives.
 *       - Allows optional semicolons and trailing whitespace.
 *       - Matches any remaining content after the directives.
 *
 * This regex is intended for **heuristic internal checks** and does
 * not perform full JavaScript syntax validation.
 *
 * @internal
 */
export const CODE_AFTER_DIRECTIVE_RE = /^(['"]use\s+\w+['"];?\s*)+[\s\S]+$/;

/** ----------------------------------------------------------------
 * * ***Matches files that MUST NOT contain comments.***
 * ----------------------------------------------------------------
 *
 * Identifies structured, machine-generated, or strict-spec files
 * that do NOT support JavaScript-style comments and should never
 * be mutated by comment injectors or build transformers.
 *
 * ----------------------------------------------------------------
 * Included Categories
 *
 * 1) Strict JSON Specification (RFC 8259 compliant):
 *       - `.json`.
 *       - `.map` (Source maps).
 *       - `.webmanifest`.
 *       - `.har`.
 *       - `.geojson`.
 *       - `.topojson`.
 *
 * 2) Lock-files & Dependency Metadata (machine-generated):
 *       - `package-lock.json`.
 *       - `composer.lock`.
 *       - `bun.lockb`.
 *
 * 3) Tooling / Compiler Artifacts:
 *       - `.tsbuildinfo`.
 *
 * ----------------------------------------------------------------
 * Important Notes
 *
 * - JSON strictly disallows comments.
 * - Source maps are JSON and must remain spec-compliant.
 * - Lock-files must never be altered by formatters or comment injectors.
 * - This regex is intentionally defensive for build tooling contexts.
 *
 * ----------------------------------------------------------------
 * Explicitly NOT Included:
 *
 * - `.jsonc` (supports comments).
 * - `.yaml` / `.yml` (supports comments).
 * - `.toml` (supports comments).
 * - `.xml` (supports comments).
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * if (NON_COMMENTABLE_FILE_RE.test(filePath)) {
 *   // skip comment injection / stripping
 * }
 * ```
 *
 * @internal
 */
export const NON_COMMENTABLE_FILE_RE =
  /(?:^|[\\/])(?:package-lock\.json|composer\.lock|bun\.lockb)$|\.(?:json|map|webmanifest|har|geojson|topojson|tsbuildinfo)$/i;
// export const NON_COMMENTABLE_FILE_RE =
//   /(?:^|[\\/])(?:package-lock\.json|composer\.lock|bun\.lockb)$|(?:\.(?:json|map|webmanifest|har|geojson|topojson|tsbuildinfo))$/i;

/** ----------------------------------------------------------------
 * * ***Checks whether a file contains only directive statements.***
 * ----------------------------------------------------------------
 *
 * Determines if the provided source content is composed solely of
 * top-level `"use *"` directives, or is effectively empty.
 *
 * - ***Evaluation rules:***
 *       - Empty or whitespace-only content is considered valid.
 *       - Content containing only `"use *"` directives returns `true`.
 *       - Any additional code or statements cause a `false` result.
 *
 * This utility is primarily used to decide whether a file is
 * **directive-only** and safe for directive injection or hoisting.
 *
 * @param {string} content - JavaScript source content.
 *
 * @returns {boolean}
 * `true` if the file contains only directives or is empty,
 * otherwise `false`.
 *
 * @example
 * ```ts
 * isDirectiveOnlyFile('"use strict";\n"use client";');
 * // ➔ true
 * ```
 *
 * @example
 * ```ts
 * isDirectiveOnlyFile('"use client";\nconst a = 1;');
 * // ➔ false
 * ```
 *
 * @internal
 */
export function isDirectiveOnlyFile(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed) return true;

  const { body } = extractAndHoistBanner(trimmed);
  const { directives, rest } = extractDirectives(body);

  return isNonEmptyString(directives) && !isNonEmptyString(rest);
}

/** ----------------------------------------------------------------
 * * ***Determines whether executable code exists beyond directives.***
 * ----------------------------------------------------------------
 *
 * Checks if a source file contains **executable JavaScript code**
 * after removing non-executable preamble content.
 *
 * - ***The following elements are ignored during evaluation:***
 *       - Leading shebang (if present).
 *       - Banner comments (`/*! ... *\/`).
 *       - Top-level `"use *"` directive statements.
 *
 * - ***Evaluation rules:***
 *       - Empty or whitespace-only files are treated as **executable**.
 *       - Files containing only directives and/or banners return `false`.
 *       - Any remaining non-empty content is considered executable code.
 *
 * This utility performs **structural heuristics** and does not
 * rely on full JavaScript parsing.
 *
 * @param {string} content - JavaScript source content.
 *
 * @returns {boolean}
 * `true` if executable code exists after directives,
 * otherwise `false`.
 *
 * @example
 * ```ts
 * hasExecutableCode('#!/usr/bin/env node\n"use strict";\nconst a = 1;');
 * // ➔ true
 * ```
 *
 * @example
 * ```ts
 * hasExecutableCode('"use client";\n/*! banner *\/');
 * // ➔ false
 * ```
 *
 * @internal
 */
export function hasExecutableCode(content: string): boolean {
  const trimmed = content.trim();

  const { body } = extractAndHoistBanner(trimmed);
  const { rest } = extractDirectives(body);

  return isNonEmptyString(rest);
}

/** @internal */
export type RemoveCommentsOptions = {
  /** Whether source map comments should be considered removable.
   *
   * @default false
   */
  removeSourceMap?: boolean;

  /** Whether source region comments should be considered removable.
   *
   * @default true
   */
  removeRegion?: boolean;
};

export const defaultCommentOptions: RemoveCommentsOptions = {
  removeRegion: true,
  removeSourceMap: false
};

/** ----------------------------------------------------------------
 * * ***Determines whether a line is a removable build artifact comment.***
 * ----------------------------------------------------------------
 *
 * - ***This includes:***
 *       - source path comments (`// src/...`, `// node_modules/...`).
 *       - source region comments,
 *         see {@link REGION_RE | `REGION_RE`}.
 *       - ESLint directive comments.
 *       - source map comments (optional).
 *
 * @param {string|null|undefined} line - A single line of file content.
 * @param {RemoveCommentsOptions} options - Options to check target comment.
 * @returns `true` if the line matches a removable comment pattern.
 *
 * @internal
 */
export const isTargetComment = (
  line: string | null | undefined,
  options: RemoveCommentsOptions = defaultCommentOptions
) => {
  if (!isNonEmptyString(line)) return false;
  if (SOURCE_PATH_RE.test(line)) return true;
  if (ESLINT_RE.test(line)) return true;
  if (options.removeRegion && REGION_RE.test(line)) return true;
  if (options.removeSourceMap && SOURCE_MAP_RE.test(line)) return true;
  return false;
};

/** ----------------------------------------------------------------
 * * ***Checks whether a line is directly adjacent to a removable comment line.***
 * ----------------------------------------------------------------
 *
 * Used to optionally remove empty lines surrounding build artifact comments
 * to avoid leaving unnecessary visual gaps.
 *
 * @param {string[]} arr - Array of file lines.
 * @param {number} index - Current line index.
 * @param {RemoveCommentsOptions} options - Options to check target comment.
 * @returns `true` if an adjacent line matches a removable comment.
 *
 * @internal
 */
export const isAdjacentToTarget = (
  arr: string[],
  index: number,
  options: RemoveCommentsOptions = defaultCommentOptions
) => {
  return (
    isTargetComment(arr[index - 1], options) ||
    isTargetComment(arr[index + 1], options)
  );
};

/** ----------------------------------------------------------------
 * * ***Represents supported JavaScript module kinds.***
 * ----------------------------------------------------------------
 *
 * Describes the detected module system of a JavaScript file.
 * Used internally to distinguish runtime module boundaries.
 *
 * @remarks
 * The classification is heuristic-based and intended primarily for
 * compiled or bundled output, not strict spec validation.
 *
 * @example
 * "esm"  // ECMAScript module using `import` / `export`
 * "cjs"  // CommonJS module using `require` / `module.exports`
 * "umd"  // Universal Module Definition wrapper
 * "iife" // Immediately Invoked Function Expression bundle
 *
 * @internal
 */
export type ModuleKind = "esm" | "cjs" | "umd" | "iife";

/** ----------------------------------------------------------------
 * * ***Detects module kind from JavaScript source content.***
 * ----------------------------------------------------------------
 *
 * Heuristic-based module format detection optimized for **compiled,
 * transpiled, or bundled JavaScript output**.
 *
 * This function analyzes the AST and attempts to infer the effective
 * runtime module boundary rather than relying purely on syntax shape.
 *
 * ----------------------------------------------------------------
 * #### 🔎 Priority Rules (highest ➔ lowest).
 * ----------------------------------------------------------------
 * 1. UMD environment wrapper detection
 *       (`typeof exports` / `typeof module` + optional `define`) ➔ `"umd"`.
 *
 * 2. Runtime mutation of `module.exports` or `exports.*` ➔ `"cjs"`.
 *
 * 3. Real ESM `export` declarations ➔ `"esm"`.
 *
 * 4. ESM `import` declarations ➔ `"esm"`.
 *
 * 5. Top-level IIFE bundle without module system markers ➔ `"iife"`.
 *
 * 6. `require()` usage without explicit ESM ➔ `"cjs"`.
 *
 * 7. Fallback ➔ `"esm"`.
 *
 * ----------------------------------------------------------------
 * #### ⚠️ Limitations & Heuristic Caveats.
 * ----------------------------------------------------------------
 *
 * - Detection is heuristic-based and **not spec-guaranteed**.
 * - Designed primarily for bundled or transpiled build outputs.
 *
 * - UMD detection may fail when:
 *    - The environment wrapper is heavily minified or obfuscated.
 *    - `typeof exports` / `typeof module` checks are removed or transformed.
 *    - The wrapper does not follow conventional UMD patterns.
 *
 *   In such cases, UMD may be treated as `"cjs"`.
 *
 * - IIFE detection is intentionally conservative:
 *    - Only top-level immediately-invoked function expressions are considered.
 *    - If CommonJS mutations are present inside the IIFE,
 *      the module will be classified as `"cjs"`.
 *
 *   Therefore, certain bundled IIFE outputs may be classified as `"cjs"`
 *   rather than `"iife"`.
 *
 * - Hybrid bundles (e.g. CJS wrapped in IIFE) are classified based on
 *   detected runtime export behavior.
 *
 * ----------------------------------------------------------------
 * #### 🎯 Design Philosophy.
 * ----------------------------------------------------------------
 * This function favors **runtime export boundary detection**
 * over superficial syntax appearance.
 *
 * The goal is to determine how the file behaves when executed,
 * not how it was originally authored.
 *
 * @param code - JavaScript source code to analyze.
 * @returns Detected module kind:
 * `"esm"` | `"cjs"` | `"umd"` | `"iife"`.
 *
 * @internal
 */
export function detectModuleKindFromContent(code: string): ModuleKind {
  let hasImport = false;
  let hasExport = false;

  let hasModuleExports = false;
  let hasExportsMutation = false;
  let hasRequire = false;

  let hasDefine = false;
  let hasUMDEnvCheck = false;

  let hasTopLevelIIFE = false;

  const ast = parse(code, {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx"]
  });

  const traverse: typeof traverseImport =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (traverseImport as any).default ?? traverseImport;

  traverse(ast, {
    Program(path) {
      for (const node of path.node.body) {
        if (
          t.isExpressionStatement(node) &&
          t.isCallExpression(node.expression) &&
          (t.isFunctionExpression(node.expression.callee) ||
            t.isArrowFunctionExpression(node.expression.callee))
        ) {
          hasTopLevelIIFE = true;
        }

        if (t.isVariableDeclaration(node)) {
          for (const decl of node.declarations) {
            if (
              decl.init &&
              t.isCallExpression(decl.init) &&
              (t.isFunctionExpression(decl.init.callee) ||
                t.isArrowFunctionExpression(decl.init.callee))
            ) {
              hasTopLevelIIFE = true;
            }
          }
        }
      }
    },

    ImportDeclaration() {
      hasImport = true;
    },

    ExportNamedDeclaration() {
      hasExport = true;
    },

    ExportDefaultDeclaration() {
      hasExport = true;
    },

    AssignmentExpression(path: NodePath<t.AssignmentExpression>) {
      const left = path.node.left;

      if (t.isMemberExpression(left)) {
        if (t.isIdentifier(left.object) && t.isIdentifier(left.property)) {
          if (
            left.object.name === "module" &&
            left.property.name === "exports"
          ) {
            hasModuleExports = true;
          }

          if (left.object.name === "exports") {
            hasExportsMutation = true;
          }
        }
      }
    },

    CallExpression(path) {
      const { callee, arguments: args } = path.node;

      // Detect CJS-style export mutation
      if (
        args.length > 0 &&
        t.isIdentifier(args[0]) &&
        args[0].name === "exports"
      ) {
        hasExportsMutation = true;
      }

      if (t.isIdentifier(callee)) {
        // require()
        if (callee.name === "require") {
          hasRequire = true;
        }

        // define() for AMD/UMD
        if (callee.name === "define") {
          hasDefine = true;
        }
      }
    },

    UnaryExpression(path) {
      if (
        path.node.operator === "typeof" &&
        t.isIdentifier(path.node.argument) &&
        (path.node.argument.name === "exports" ||
          path.node.argument.name === "module")
      ) {
        hasUMDEnvCheck = true;
      }
    }
  });

  // -------------------------
  // FINAL CLASSIFICATION
  // -------------------------

  const isCJS = hasModuleExports || hasExportsMutation;
  const isUMD = hasUMDEnvCheck && (hasDefine || isCJS);

  // 1. UMD
  if (isUMD) return "umd";

  // 2. CJS
  if (isCJS) return "cjs";

  // 3. ESM
  if (hasExport || hasImport) return "esm";

  // 4. Pure IIFE (NO module system inside)
  if (hasTopLevelIIFE && !isCJS && !hasImport && !hasExport) {
    return "iife";
  }

  // 5. require-only fallback
  if (hasRequire) return "cjs";

  return "esm";
}

/** @deprecated use `detectModuleKind` instead.
 *
 * @internal
 */
export function detectModuleKindFromContent_(code: string): ModuleKind {
  // /* -------------------------------------------------------------
  //  * Detect UMD wrapper (environment branching)
  //  * ------------------------------------------------------------- */

  // if (/\bmodule\.exports\s*=\s*factory/.test(code) && /\bdefine\.amd\b/.test(code)) {
  //   return "umd";
  // }

  // const HAS_TYPEOF_EXPORTS = /\btypeof\s+exports\b/;
  // const HAS_TYPEOF_MODULE = /\btypeof\s+module\b/;
  // const HAS_DEFINE_AMD = /\bdefine\s*\(\s*\[\s*\]|\bdefine\.amd\b/;

  // if (
  //   (HAS_TYPEOF_EXPORTS.test(code) && HAS_TYPEOF_MODULE.test(code)) ||
  //   HAS_DEFINE_AMD.test(code)
  // ) {
  //   return "umd";
  // }

  // /* -------------------------------------------------------------
  //  * Detect top-level assigned IIFE bundle
  //  * ------------------------------------------------------------- */

  // const IIFE_RE =
  //   /\(\s*(?:async\s*)?(?:function\b|\([\w\s,]*\)\s*=>)[\s\S]*?\)\s*\(\s*[\s\S]*?\s*\)\s*;?/;

  // if (IIFE_RE.test(code)) {
  //   return "iife";
  // }

  /* -------------------------------------------------------------
   * STRONGEST: CommonJS runtime export mutation
   * ------------------------------------------------------------- */

  const CJS_EXPORT_MUTATION_RE =
    /\bmodule\.exports\s*=|\bexports\s*(?:\.|\[|\?\.)\s*[\w"'`]+\s*=|\bObject\.(?:definePropert(?:y|ies)|assign)\s*\(\s*exports\b|\bReflect\.defineProperty\s*\(\s*exports\b|\b__export(?:Star)?\s*\(\s*(?:\w+\s*,\s*)?exports\b/;

  if (CJS_EXPORT_MUTATION_RE.test(code)) {
    return "cjs";
  }

  /* -------------------------------------------------------------
   * TRUE ESM boundary (syntax-level)
   * ------------------------------------------------------------- */

  const ESM_EXPORT_RE =
    /^\s*export\s+(?:default|const|let|var|function|class|type|interface|enum|{)/m;

  if (ESM_EXPORT_RE.test(code)) {
    return "esm";
  }

  /* -------------------------------------------------------------
   * import syntax (weak signal, but valid if no mutation)
   * ------------------------------------------------------------- */

  const ESM_IMPORT_RE = /^\s*import\s+(?:[\w*\s{},]+?\s+from\s+)?['"]/m;

  if (ESM_IMPORT_RE.test(code)) {
    return "esm";
  }

  /* -------------------------------------------------------------
   * require() fallback
   * ------------------------------------------------------------- */

  if (/\brequire\s*\(/.test(code)) {
    return "cjs";
  }

  /* -------------------------------------------------------------
   * Default assumption
   * ------------------------------------------------------------- */

  return "esm";
}

/** ----------------------------------------------------------------
 * * ***Extracts and hoists leading shebang and banner comments.***
 * ----------------------------------------------------------------
 *
 * Extracts a Unix shebang (`#!...`) and the first `/*! ... *\/`
 * style banner comment from the beginning of a source file,
 * separating them from the remaining body content.
 *
 * - ***Extraction rules:***
 *       - Shebang is extracted first if present.
 *       - Only the first banner comment is extracted.
 *       - Order is preserved: shebang ➔ banner ➔ body.
 *       - Remaining content is trimmed of leading whitespace.
 *
 * If neither shebang nor banner is found, the original content
 * is returned unchanged as the body.
 *
 * @param {string} content - Full file content.
 *
 * @returns {{
 *   shebang: string;
 *   banner: string;
 *   body: string;
 * }}
 * An object containing the extracted shebang, banner, and remaining body.
 *
 * @example
 * ```ts
 * extractAndHoistBanner('#!/usr/bin/env node\n/*! banner *\/\nconst a = 1;');
 * // ➔ {
 * //   shebang: '#!/usr/bin/env node\n',
 * //   banner: '/*! banner *\/',
 * //   body: 'const a = 1;'
 * // }
 * ```
 *
 * @internal
 */
export function extractAndHoistBanner(content: string): {
  shebang: string;
  banner: string;
  body: string;
} {
  let rest = content;
  let shebang = "";
  let banner = "";

  const shebangMatch = rest.match(SHEBANG_RE);
  if (shebangMatch && shebangMatch.index === 0) {
    shebang = shebangMatch[0];
    rest = rest.slice(shebang.length);
  }

  const bannerMatch = rest.match(BANNER_RE);
  if (bannerMatch && bannerMatch.index === 0) {
    banner = bannerMatch[0];
    rest = rest.slice(banner.length);
  }

  return {
    shebang,
    banner,
    body: rest.replace(/^\s+/, "")
  };
}

/** ----------------------------------------------------------------
 * * ***Extracts top-level `"use *"` directives from source code.***
 * ----------------------------------------------------------------
 *
 * Collects consecutive `"use <directive>"` statements located
 * at the very beginning of the file.
 *
 * - ***Extraction rules:***
 *       - Matches both single and double quoted directives.
 *       - Stops at the first non-directive statement.
 *       - Preserves original directive formatting.
 *
 * - ***The returned object splits the code into:***
 *       - `directives` ➔ raw directive string.
 *       - `rest` ➔ remaining source code.
 *
 * @param {string} code - JavaScript source code.
 *
 * @returns {{ directives: string; rest: string }}
 * Extracted directives and remaining code.
 *
 * @example
 * ```ts
 * extractDirectives('"use strict"; "use client"; const a = 1;');
 * // ➔ { directives: '"use strict"; "use client";', rest: 'const a = 1;' }
 * ```
 *
 * @internal
 */
export function extractDirectives(code: string): {
  directives: string;
  rest: string;
} {
  const match = code.match(/^((?:(?:"use\s+\w+"|'use\s+\w+');\s*)+)/);

  return {
    directives: match?.[1] ?? "",
    rest: code.slice(match?.[1]?.length ?? 0)
  };
}

/** ----------------------------------------------------------------
 * * ***Removes `"use strict"` directives from source content.***
 * ----------------------------------------------------------------
 *
 * Strips all standalone `"use strict"` directive statements from
 * the provided content while preserving other directives such as
 * `"use client"`.
 *
 * - ***Removal rules:***
 *       - Matches both single and double quoted `"use strict"`.
 *       - Only removes full directive lines (line-anchored).
 *       - Supports optional trailing semicolon.
 *
 * By default, leading whitespace is trimmed after removal to keep
 * the resulting content properly aligned for further processing.
 *
 * @param {string} content - Source content containing directive statements.
 *
 * @param {object} [options] - Behavior configuration.
 * @param {boolean} [options.trimStart=true]
 * Whether to trim leading whitespace after stripping directives.
 *
 * @returns {string} Content with `"use strict"` directives removed.
 *
 * @example
 * ```ts
 * stripUseStrict('"use strict";\n"use client";');
 * // ➔ '"use client";'
 * ```
 *
 * @example
 * ```ts
 * stripUseStrict('"use strict";\n\nconst a = 1;', { trimStart: false });
 * // ➔ '\n\nconst a = 1;'
 * ```
 *
 * @internal
 */
export function stripUseStrict(
  content: string,
  {
    trimStart = true,
    trimEnd = false
  }: {
    /** @default true */
    trimStart?: boolean;
    /** @default false */
    trimEnd?: boolean;
  } = {}
): string {
  const result = content.replace(USE_STRICT_RE, "");
  if (trimStart) result.trimStart();
  if (trimEnd) result.trimEnd();

  return result;
}

/** ----------------------------------------------------------------
 * * ***Determines the correct insertion index for injected code.***
 * ----------------------------------------------------------------
 *
 * Calculates the byte index in source code where new content
 * (such as directives or imports) should be safely inserted.
 *
 * - ***Insertion rules:***
 *       - Skips over a leading shebang (`#!...`) if present.
 *       - Skips over a leading banner comment (`/*! ... *\/`) if present.
 *       - Preserves original file ordering and semantics.
 *
 * The returned index points to the position **after** any detected
 * shebang or banner, making it safe for code injection.
 *
 * @param {string} code - JavaScript source code.
 *
 * @returns {number}
 * Index position suitable for inserting additional code.
 *
 * @example
 * ```ts
 * findInsertIndex('#!/usr/bin/env node\n/*! banner *\/\nconst a = 1;');
 * // ➔ index after shebang and banner.
 * ```
 *
 * @internal
 */
export function findInsertIndex(code: string): number {
  let index = 0;

  const shebang = code.match(SHEBANG_RE);
  if (shebang) index += shebang[0].length;

  const banner = code.slice(index).match(BANNER_RE);
  if (banner) index += banner[0].length;

  return index;
}
