import "@rzl-zone/node-only";

import type { BaseOptions, PatternOptions, StringCollection } from "@/types";

import {
  defaultPatternOptions,
  type PatternRuntimePolicy,
  resolvePatternOptions,
  sourceOfPatternOptions
} from "@/_internal/libs/fast-globe-options";

import {
  detectModuleKindFromContent,
  extractAndHoistBanner,
  extractDirectives,
  JS_OUTPUT_FILE_RE,
  type ModuleKind,
  stripUseStrict
} from "@/_internal/utils/source";
import {
  canLog,
  DEFAULT_LOG_LEVEL,
  resolveLogVerbosity,
  VERBOSE_LOG
} from "@/_internal/utils/log-level";
import { BUILD_LOGGER } from "@/_internal/utils/logger-builder";
import {
  flattenStrings,
  isArray,
  isNonEmptyString,
  toStringSet
} from "@/_internal/utils/helper";

import { fastGlob, fsExtra } from "@/utils/server";
import { EOL, joinLinesLoose } from "@/utils/helper/formatter";

import { CommandIdentity } from "@/commander-kit/identity";

//? Constant -------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Default Pattern Policy for **ensure css import** operations.***
 * ----------------------------------------------------------------
 *
 * Defines the runtime behavior for pattern resolution used by:
 * - {@link ensureCssImport | **`ensure-css-import`**}.
 *
 * @remarks
 * - `filesOnly`: Ensures only files are matched.
 * - `forceUnique`: Deduplicates matched results.
 */
export const DEFAULT_ECI_PATTERN_POLICY = {
  filesOnly: true,
  forceUnique: true
} as const satisfies PatternRuntimePolicy<boolean, boolean>;

/** ----------------------------------------------------------------
 * * ***Resolved Pattern Options for **ensure css import** operations.***
 * ----------------------------------------------------------------
 *
 * Pattern options used by:
 * - {@link ensureCssImport | **`ensure-css-import`**}.
 */
export const resolvedEciPatternOption: PatternOptions<true, true> =
  resolvePatternOptions(defaultPatternOptions, DEFAULT_ECI_PATTERN_POLICY);

/** @internal Default ***Options*** for {@link ensureCssImport | **`ensure-css-import`**}. */
const DEFAULT_ECI_OPTIONS = {
  cssImportPath: [] as string[],
  dedupe: true,
  sort: false,
  minify: false,
  patternOptions: resolvedEciPatternOption,
  logLevel: DEFAULT_LOG_LEVEL
} as const satisfies EnsureCssImportOptions;

//? Utils ----------------------------------------------------------------
/** @internal Util for {@link ensureCssImport | **`ensure-css-import`**}. */
function _normalizeBody(code: string, minify: boolean = false): string {
  let out = code.replace(/\r\n/g, EOL);
  out = out.replace(/\*\/\n+/, `*/${EOL}`);
  out = out.replace(/(\*\/)([^\n])/g, `$1${EOL}$2`);
  const directiveMatch = out.match(/^((?:"use\s[\w-]+";|'use\s[\w-]+';\s*)+)/);
  if (directiveMatch) {
    const directivesBlock = directiveMatch[1] || "";
    const normalizedDirectives = directivesBlock.replace(/\n+/g, EOL);
    out = out.replace(directivesBlock, normalizedDirectives + EOL);
  }
  out = out.replace(/\n{3,}/g, `${EOL}${EOL}`);
  out = out.trimEnd() + (minify ? "" : EOL);
  return out;
}
/** @internal Util for {@link ensureCssImport | **`ensure-css-import`**}. */
function inlineCssImports(code: string) {
  return code.replace(
    /((?:import\s+["'][^"']+\.css["'];\s*\n?|require\(["'][^"']+\.css["']\);\s*\n?){2,})/g,
    (block) =>
      block
        .split(/\n+/)
        .map((l) => l.trim())
        .join("")
  );
}
/** @internal Util for {@link ensureCssImport | **`ensure-css-import`**}. */
function createCssStatements(kind: ModuleKind, cssImports: string[]): string[] {
  return cssImports.map((p) =>
    kind === "cjs" ? `require("${p}");` : `import "${p}";`
  );
}
/** @internal Util for {@link ensureCssImport | **`ensure-css-import`**}. */
function getMissingCssStatements(
  body: string,
  cssImports: string[],
  kind: ModuleKind,
  dedupe: boolean
): { missing: string[]; cleanedBody: string } {
  const cleanedBody = body;
  const cssStatements = createCssStatements(kind, cssImports);

  const missing = dedupe
    ? cssStatements.filter((stmt) => !cleanedBody.includes(stmt))
    : cssStatements;

  return { missing, cleanedBody };
}
/** @internal Util for {@link ensureCssImport | **`ensure-css-import`**}. */
function injectCssSmart({
  shebang,
  banner,
  directives,
  rest,
  cssStatements,
  kind,
  minify
}: {
  shebang: string;
  banner: string;
  directives: string;
  rest: string;
  cssStatements: string[];
  kind: ModuleKind;
  minify?: boolean;
}) {
  let out = minify ? shebang.trim() + EOL : shebang;
  out += minify ? banner.trim() + EOL : banner;
  let finalDirectives = stripUseStrict(directives, {
    trimEnd: minify,
    trimStart: minify
  });

  if (kind === "cjs") {
    finalDirectives = `"use strict";${EOL}` + finalDirectives.trimStart();
  }

  // finalDirectives = finalDirectives.trimStart().replace(/\s*$/, EOL);

  out += finalDirectives;
  out += cssStatements.join(EOL) + (minify ? "" : EOL);
  out += rest.replace(/^\n+/, minify ? "" : EOL);
  return out.trimStart();
}
/** ----------------------------------------------------------------
 * * ***Normalizes CSS import path input into a clean string array.***
 * ----------------------------------------------------------------
 *
 * Converts a `cssImportPath` option value into a normalized array
 * of non-empty strings for internal processing.
 *
 * - *Normalization rules:*
 *     - Single value is wrapped into an array.
 *     - Nested arrays are flattened recursively.
 *     - Each string is trimmed.
 *     - Empty strings are removed.
 *
 * The returned array is always a **new instance** and does not mutate
 * the original input.
 *
 * @param {EnsureCssImportOptions["cssImportPath"]} input - CSS import path option.
 *
 * @returns {string[]} Normalized list of CSS import paths.
 *
 * @example
 * ```ts
 * normalizeCssImports("style.css");
 * // ➔ ["style.css"]
 * ```
 *
 * @example
 * ```ts
 * normalizeCssImports([" a.css ", ["b.css", ""], null]);
 * // ➔ ["a.css", "b.css"]
 * ```
 *
 * @internal Util for {@link ensureCssImport | **`ensure-css-import`**}.
 */
function normalizeCssImports(
  input: EnsureCssImportOptions["cssImportPath"]
): string[] {
  return flattenStrings(isArray(input) ? input : [input])
    .map((s) => s.trim())
    .filter(Boolean);
}

//? Identity -------------------------------------------------------------
/** Command identity associated with {@link ensureCssImport | **`ensure-css-import`**}. */
export const commandEciIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "ensure-css-import"
});

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link ensureCssImport | **`ensure-css-import`**}.***
 * ----------------------------------------------------------------
 */
export type EnsureCssImportOptions = {
  /** ----------------------------------------------------------------
   * * ***CSS import path(s) to ensure exist in JS output.***
   * ----------------------------------------------------------------
   *
   * Accepts a single path or multiple paths.
   *
   * @example
   * ```ts
   * "./search.css"
   * ```
   *
   * @example
   * ```ts
   * ["./search.css", "./theme.css"]
   * ```
   */
  cssImportPath: string | readonly (string | readonly string[])[] | Set<string>;

  /** ----------------------------------------------------------------
   * * ***Remove duplicate CSS imports (recommended).***
   * ----------------------------------------------------------------
   *
   * @default true
   */
  dedupe?: boolean;

  /** ----------------------------------------------------------------
   * * ***Sort CSS imports alphabetically before inserting.***
   * ----------------------------------------------------------------
   *
   * @default false
   */
  sort?: boolean;

  /** --------------------------------------------------------
   * * ***Minify JS output (except directive prologue).***
   * --------------------------------------------------------
   *
   * - Keeps `"use client"` / `"use strict"` on separate lines.
   * - Everything else is collapsed into a single line.
   *
   * @default false
   */
  minify?: boolean;
} & BaseOptions<
  typeof DEFAULT_ECI_PATTERN_POLICY.filesOnly,
  typeof DEFAULT_ECI_PATTERN_POLICY.forceUnique
>;

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Ensures CSS import(s) exist in compiled JavaScript files.***
 * ----------------------------------------------------------------
 * - *Behavior:*
 *     - Supports **multiple CSS imports**.
 *     - Fully **idempotent**.
 *     - Optional **dedupe & sorting**.
 *
 * @param {string | string[] | Set<string>} pattern
 * Glob pattern(s) pointing to compiled JS files.
 *
 * @param {EnsureCssImportOptions} options
 * Configuration options.
 *
 * @example
 * ```ts
 * await ensureCssImport("dist/**\/*.js", {
 *   cssImportPath: ["./search.css", "./theme.css"],
 *   dedupe: true,
 *   sort: true,
 *   minify: true
 * });
 * ```
 */
export const ensureCssImport = async (
  pattern: StringCollection,
  options: EnsureCssImportOptions
): Promise<void> => {
  const loggerLevel = resolveLogVerbosity(
    options,
    DEFAULT_ECI_OPTIONS.logLevel
  );

  try {
    const {
      patternOptions = DEFAULT_ECI_OPTIONS.patternOptions,
      cssImportPath,
      dedupe = DEFAULT_ECI_OPTIONS.dedupe,
      sort = DEFAULT_ECI_OPTIONS.sort,
      minify = DEFAULT_ECI_OPTIONS.minify,
      __commandTitle
    } = options;

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      console.log(
        joinLinesLoose(
          isNonEmptyString(__commandTitle)
            ? __commandTitle
            : commandEciIdentity.utility(),
          ""
        )
      );
    }

    const patterns = [...toStringSet(pattern)];
    const cleanPatternOptions = resolvePatternOptions(
      patternOptions,
      DEFAULT_ECI_PATTERN_POLICY
    );

    let cssImports = normalizeCssImports(cssImportPath);

    if (cssImports.length === 0) {
      throw new Error("`cssImportPath` option must not be empty.");
    }

    if (dedupe) cssImports = Array.from(new Set(cssImports));

    if (sort) cssImports.sort();

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      BUILD_LOGGER.SECTION("Options", { icon: "⚙️ " });
      BUILD_LOGGER.OPTIONS(
        "pattern",
        patterns,
        BUILD_LOGGER.SOURCE_OF(patterns, undefined),
        true
      );
      BUILD_LOGGER.OPTIONS(
        "options.patternOptions",
        cleanPatternOptions,
        sourceOfPatternOptions(
          cleanPatternOptions,
          DEFAULT_ECI_OPTIONS.patternOptions
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.cssImportPath",
        cssImports,
        BUILD_LOGGER.SOURCE_OF(cssImports, DEFAULT_ECI_OPTIONS.cssImportPath),
        true
      );
      BUILD_LOGGER.OPTIONS(
        "options.dedupe",
        dedupe,
        BUILD_LOGGER.SOURCE_OF(dedupe, DEFAULT_ECI_OPTIONS.dedupe)
      );
      BUILD_LOGGER.OPTIONS(
        "options.sort",
        sort,
        BUILD_LOGGER.SOURCE_OF(sort, DEFAULT_ECI_OPTIONS.sort)
      );
      BUILD_LOGGER.OPTIONS(
        "options.minify",
        minify,
        BUILD_LOGGER.SOURCE_OF(minify, DEFAULT_ECI_OPTIONS.minify)
      );
      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_ECI_OPTIONS.logLevel)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        actionName: "Ensuring CSS Import"
      });
    }

    const files = (await fastGlob(patterns, cleanPatternOptions)).sort();

    let count = 0;

    for (const filePath of files) {
      if (!JS_OUTPUT_FILE_RE.test(filePath)) continue;

      let content: string;

      try {
        content = await fsExtra.promises.readFile(filePath, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      const { banner, body, shebang } = extractAndHoistBanner(content);
      const kind = detectModuleKindFromContent(content);

      const { missing, cleanedBody } = getMissingCssStatements(
        body,
        cssImports,
        kind,
        dedupe
      );

      if (missing.length === 0) continue;

      const { directives, rest } = extractDirectives(cleanedBody);

      let updated = injectCssSmart({
        shebang,
        banner,
        directives,
        rest,
        kind,
        minify: options.minify,
        cssStatements: missing
      });

      if (options.minify) {
        updated = inlineCssImports(updated);
      }

      if (updated !== content) {
        try {
          await fsExtra.promises.writeFile(filePath, updated, "utf8");
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
          throw err;
        }

        count++;

        if (canLog(loggerLevel, VERBOSE_LOG)) {
          BUILD_LOGGER.ON_PROCESS({
            actionName: "CSS Import",
            count,
            nameDirect: filePath
          });
        }
      }
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (count > 0) {
        BUILD_LOGGER.ON_FINISH({
          actionName: "Ensuring CSS Import",
          count
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Ensuring CSS Import",
          reasonType: "file",
          reasonEndText: "check"
        });
      }
    }
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        actionName: "Ensuring CSS Import",
        error
      });
    }
  }
};
