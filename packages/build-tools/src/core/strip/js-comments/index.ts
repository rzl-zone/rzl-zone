import "@rzl-zone/node-only";

import type { BaseOptions, PatternOptions, StringCollection } from "@/types";

import * as acorn from "acorn";

import {
  defaultPatternOptions,
  type PatternRuntimePolicy,
  resolvePatternOptions,
  sourceOfPatternOptions
} from "@/_internal/libs/fast-globe-options";

import {
  IMPORTANT_COMMENT,
  isTargetComment,
  JS_OUTPUT_FILE_RE,
  REGION_RE,
  shouldRemoveDocRuntime,
  SOURCE_MAP_RE
} from "@/_internal/utils/source";
import {
  canLog,
  DEFAULT_LOG_LEVEL,
  resolveLogVerbosity,
  VERBOSE_LOG
} from "@/_internal/utils/log-level";
import { BUILD_LOGGER } from "@/_internal/utils/logger-builder";
import { isNonEmptyString, toStringSet } from "@/_internal/utils/helper";

import { fastGlob, fsExtra } from "@/utils/server";
import { EOL, joinLinesLoose } from "@/utils/helper/formatter";

import { CommandIdentity } from "@/commander-kit/identity";

//? Constant -------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Default Pattern Policy for **strip js comments** operations.***
 * ----------------------------------------------------------------
 *
 * Defines the runtime behavior for pattern resolution used by:
 * - {@link stripJsComments | **`strip-js-comments`**}.
 *
 * @remarks
 * - `filesOnly`: Ensures only files are matched.
 * - `forceUnique`: Deduplicates matched results.
 */
export const DEFAULT_SJC_PATTERN_POLICY = {
  filesOnly: true,
  forceUnique: true
} as const satisfies PatternRuntimePolicy<boolean, boolean>;

/** ----------------------------------------------------------------
 * * ***Resolved Pattern Options for **strip js comments** operations.***
 * ----------------------------------------------------------------
 *
 * Pattern options used by:
 * - {@link stripJsComments | **`strip-js-comments`**}.
 */
export const resolvedSjcPatternOption: PatternOptions<true, true> =
  resolvePatternOptions(defaultPatternOptions, DEFAULT_SJC_PATTERN_POLICY);

/** @internal Default ***Options*** for {@link stripJsComments | **`strip-js-comments`**}. */
const DEFAULT_SJC_OPTIONS = {
  removeSourceMap: false,
  sourceType: "module",
  removeRegion: true,
  ecmaVersion: "latest",
  patternOptions: resolvedSjcPatternOption,
  logLevel: DEFAULT_LOG_LEVEL
} as const satisfies StripJsCommentsOptions;

/** @internal Constant for {@link stripJsComments | **`strip-js-comments`**}. */
const VALID_SOURCE_TYPE = new Set(["module", "script", "commonjs"]);
const VALID_ECMA_VERSION = new Set([
  "latest",
  3,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
  2022,
  2023,
  2024,
  2025,
  2026
]);

const REGION_COMMENT_RE = /^#(?:end)?region\b/i;
const SOURCE_MAP_COMMENT_RE = /^[#@]\s*sourceMappingURL=/;

//? Utils ----------------------------------------------------------------
/** @internal Util for {@link stripJsComments | **`strip-js-comments`**}. */
function normalizeNewlines(code: string) {
  return code.replace(/[ \t]+\n/g, EOL).replace(/\n\s*\n+/g, EOL);
}
/** @internal Util for {@link stripJsComments | **`strip-js-comments`**}. */
function stripComments(
  code: string,
  {
    removeRegion,
    removeSourceMap,
    sourceType,
    ecmaVersion
  }: StripJsCommentsOptions
) {
  const comments: [number, number][] = [];

  if (sourceType == null || !VALID_SOURCE_TYPE.has(sourceType)) {
    sourceType = DEFAULT_SJC_OPTIONS.sourceType;
  }
  if (ecmaVersion == null || !VALID_ECMA_VERSION.has(ecmaVersion)) {
    ecmaVersion = DEFAULT_SJC_OPTIONS.ecmaVersion;
  }

  try {
    acorn.parse(code, {
      sourceType,
      ecmaVersion,
      allowHashBang: true,
      onComment(block, text, start, end) {
        if (!block) {
          const value = text.trim();

          if (
            !REGION_COMMENT_RE.test(value) &&
            !SOURCE_MAP_COMMENT_RE.test(value)
          ) {
            return;
          }
        }

        const value = text.trim();

        const forceRemove = shouldRemoveDocRuntime(value);

        if (forceRemove === true) {
          comments.push([start, end]);
          return;
        }

        if (forceRemove === false) return;

        if (IMPORTANT_COMMENT.test(value)) return;

        // source map
        if (SOURCE_MAP_COMMENT_RE.test(value)) {
          if (removeSourceMap) comments.push([start, end]);
          return;
        }

        // region
        if (REGION_COMMENT_RE.test(value)) {
          if (removeRegion) comments.push([start, end]);
          return;
        }

        // default: ONLY block comments
        if (block) {
          comments.push([start, end]);
        }
      }
    });
  } catch {
    return code;
  }

  if (!comments.length) return code;

  const parts: string[] = [];
  let last = 0;

  for (const [start, end] of comments) {
    parts.push(code.slice(last, start));
    last = end;
  }

  parts.push(code.slice(last));

  const result = parts.join("");

  const lines = result.split(/\r?\n/);
  const seenSourceMap = new Set<string>();
  const cleanedLines = lines
    .filter((line) => {
      if (SOURCE_MAP_RE.test(line)) {
        const key = line.trim();

        if (seenSourceMap.has(key)) return false;

        seenSourceMap.add(key);

        if (removeSourceMap) return false;

        return true;
      }

      if (removeRegion && REGION_RE.test(line)) return false;

      if (isTargetComment(line, { removeSourceMap, removeRegion }))
        return false;

      // if (
      //   removeAdjacentEmptyLines &&
      //   /^\s*$/.test(line) &&
      //   isAdjacentToTarget(arr, i, { removeSourceMap, removeRegion })
      // ) {
      //   return false;
      // }

      return true;
    })
    .map((line) => {
      let out = line
        // remove source path comments
        .replace(
          /^[ \t]*\/\/\s*(?:\.\.\/|\.\/)*[^ \n]*?(?:src|node_modules)\/[^\n]*\n?/gm,
          ""
        )
        // remove eslint comments
        .replace(/\/\/\s*eslint[^\n]*/g, "");

      // if (removeSourceMap) {
      //   out = out.replace(/\/\/[#@]\s*sourceMappingURL=[^\n]*/g, "");
      // }

      out = out.replace(
        /(\/\/[#@]\s*sourceMappingURL=[^\r\n]*)(?:\r?\n\1)+/g,
        "$1"
      );

      return out;
    });

  return cleanedLines.join(EOL);
}

//? Identity -------------------------------------------------------------
/** Command identity associated with {@link stripJsComments | **`strip-js-comments`**}. */
export const commandSjcIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "strip-js-comments"
});

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link stripJsComments | `strip-js-comment`}.***
 * ----------------------------------------------------------------
 */
export type StripJsCommentsOptions = {
  /** ----------------------------------------------------------------
   * * ***Whether to remove `sourceMappingURL` comments.***
   * ----------------------------------------------------------------
   *
   * @default false
   */
  removeSourceMap?: boolean;
  /** ----------------------------------------------------------------
   * * ***Whether to remove `region` comments.***
   * ----------------------------------------------------------------
   *
   * @default true
   */
  removeRegion?: boolean;

  /** ----------------------------------------------------------------
   * * ***Parsing mode used when analyzing JavaScript code.***
   * ----------------------------------------------------------------
   *
   * Determines how the source file should be interpreted by the parser.
   * This affects strict mode behavior and how `import` / `export`
   * statements are handled.
   *
   *
   * Possible values:
   *
   * - `"module"` **(default)** ➔ Parse as an ES module.
   * - `"script"` ➔ Parse as a classic script.
   * - `"commonjs"` ➔ Parse using CommonJS semantics.
   *
   * ----------------------------------------------------------------
   *
   *  ⚠️ Fallback to default, is invalid input.
   *
   *
   * @default "module"
   *
   */
  sourceType?: acorn.Options["sourceType"];

  /** ----------------------------------------------------------------
   * * ***ECMAScript version used for parsing.***
   * ----------------------------------------------------------------
   *
   * Specifies the ECMAScript syntax version supported by the parser.
   * This determines which language features are recognized during parsing.
   *
   * Examples:
   *
   * - `5` ➔ ES5
   * - `2020` ➔ ES2020
   * - `"latest"` ➔ Latest supported version
   *
   * ----------------------------------------------------------------
   *
   * ⚠️ Invalid values will fallback to the default behavior.
   *
   * @default "latest"
   */
  ecmaVersion?: acorn.ecmaVersion;
} & BaseOptions<
  typeof DEFAULT_SJC_PATTERN_POLICY.filesOnly,
  typeof DEFAULT_SJC_PATTERN_POLICY.forceUnique
>;

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Strip comments from JavaScript output files.***
 * ----------------------------------------------------------------
 *
 * Scans files matching the provided glob pattern(s) and removes
 * non-essential comments from JavaScript output.
 *
 * The process preserves important comments such as:
 *
 * - `/*! ... *\/` (bang / license comments)
 * - `@license`
 * - `@preserve`
 * - `@copyright`
 * - `@cc_on`
 * - `@__PURE__`
 * - `@__INLINE__`
 * - `@__NOINLINE__`
 * - `@__NO_SIDE_EFFECTS__`
 *
 * unless explicitly overridden by the `@removeDocRuntime` directive.
 *
 * ----------------------------------------------------------------
 *
 * **Supported Features**
 *
 * - Removes regular block comments from compiled JS files.
 * - Optionally removes `sourceMappingURL` comments.
 * - Optionally removes `region` comments such as:
 *    - `// #region`
 *    - `// #endregion`
 * - Supports runtime directives inside comments:
 *    - `@keepDocRuntime`
 *    - `@removeDocRuntime`
 *
 * ----------------------------------------------------------------
 *
 * @param pattern - Glob pattern(s) or a set of patterns pointing to
 * files whose comments should be stripped.
 *
 * @param options - Optional configuration controlling how comments
 * are removed.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * await stripJsComments("dist/**\/*.js");
 * ```
 *
 * @example
 * ```ts
 * await stripJsComments(["dist/**\/*.js", "build/**\/*.mjs"], {
 *   removeSourceMap: true,
 *   removeRegion: true
 * });
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @removeDocRuntime
 */
export const stripJsComments = async (
  pattern: StringCollection,
  options: StripJsCommentsOptions = {}
): Promise<void> => {
  const loggerLevel = resolveLogVerbosity(
    options,
    DEFAULT_SJC_OPTIONS.logLevel
  );

  try {
    const {
      patternOptions = DEFAULT_SJC_OPTIONS.patternOptions,
      removeSourceMap = DEFAULT_SJC_OPTIONS.removeSourceMap,
      removeRegion = DEFAULT_SJC_OPTIONS.removeRegion,
      sourceType = DEFAULT_SJC_OPTIONS.sourceType,
      ecmaVersion = DEFAULT_SJC_OPTIONS.ecmaVersion,
      __commandTitle
    } = options;

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      console.log(
        joinLinesLoose(
          isNonEmptyString(__commandTitle)
            ? __commandTitle
            : commandSjcIdentity.utility(),
          ""
        )
      );
    }

    const patterns = [...toStringSet(pattern)];
    const cleanPatternOptions = resolvePatternOptions(
      patternOptions,
      DEFAULT_SJC_PATTERN_POLICY
    );

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
          DEFAULT_SJC_OPTIONS.patternOptions
        )
      );

      BUILD_LOGGER.OPTIONS(
        "options.removeSourceMap",
        removeSourceMap,
        BUILD_LOGGER.SOURCE_OF(
          removeSourceMap,
          DEFAULT_SJC_OPTIONS.removeSourceMap
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.removeRegion",
        removeRegion,
        BUILD_LOGGER.SOURCE_OF(removeRegion, DEFAULT_SJC_OPTIONS.removeRegion)
      );
      BUILD_LOGGER.OPTIONS(
        "options.sourceType",
        sourceType,
        BUILD_LOGGER.SOURCE_OF(sourceType, DEFAULT_SJC_OPTIONS.sourceType)
      );
      BUILD_LOGGER.OPTIONS(
        "options.ecmaVersion",
        ecmaVersion,
        BUILD_LOGGER.SOURCE_OF(ecmaVersion, DEFAULT_SJC_OPTIONS.ecmaVersion)
      );

      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_SJC_OPTIONS.logLevel)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        actionName: "Stripping JS Comments"
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

      let output = content;

      if (!/\/[/*]/.test(content)) continue;

      output = stripComments(content, {
        removeRegion,
        removeSourceMap,
        sourceType,
        ecmaVersion
      });
      output = normalizeNewlines(output).trim() + EOL;

      if (output !== content) {
        try {
          await fsExtra.promises.writeFile(filePath, output, "utf8");
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
          throw err;
        }

        count++;

        if (canLog(loggerLevel, VERBOSE_LOG)) {
          BUILD_LOGGER.ON_PROCESS({
            actionName: "JS Comment Stripping",
            count,
            nameDirect: filePath
          });
        }
      }
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (count > 0) {
        BUILD_LOGGER.ON_FINISH({
          actionName: "Stripping JS Comments",
          count
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Stripping JS Comments",
          reasonType: "file",
          reasonEndText: "processing"
        });
      }
    }
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        actionName: "Stripping JS Comments",
        error
      });
    }
  }
};
