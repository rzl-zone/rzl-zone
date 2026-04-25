import "@rzl-zone/node-only";

import type { BaseOptions, PatternOptions, StringCollection } from "@/types";

import {
  defaultPatternOptions,
  type PatternRuntimePolicy,
  resolvePatternOptions,
  sourceOfPatternOptions
} from "@/_internal/libs/fast-globe-options";

import {
  canLog,
  DEFAULT_LOG_LEVEL,
  resolveLogVerbosity,
  VERBOSE_LOG
} from "@/_internal/utils/log-level";
import { JS_OUTPUT_FILE_RE } from "@/_internal/utils/source";
import { BUILD_LOGGER } from "@/_internal/utils/logger-builder";
import { isNonEmptyString, toStringSet } from "@/_internal/utils/helper";

import { fastGlob, fsExtra } from "@/utils/server";
import { EOL, joinLinesLoose } from "@/utils/helper/formatter";

import { CommandIdentity } from "@/commander-kit/identity";

//? Constant -------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Default Pattern Policy for **normalize js build newlines** operations.***
 * ----------------------------------------------------------------
 *
 * Defines the runtime behavior for pattern resolution used by:
 * - {@link normalizeJsBuildNewlines | **`normalize-js-build-newlines`**}.
 *
 * @remarks
 * - `filesOnly`: Ensures only files are matched.
 * - `forceUnique`: Deduplicates matched results.
 */
export const DEFAULT_NJBN_PATTERN_POLICY = {
  filesOnly: true,
  forceUnique: true
} as const satisfies PatternRuntimePolicy<boolean, boolean>;

/** ----------------------------------------------------------------
 * * ***Resolved Pattern Options for **normalize js build newlines** operations.***
 * ----------------------------------------------------------------
 *
 * Pattern options used by:
 * - {@link normalizeJsBuildNewlines | **`normalize-js-build-newlines`**}.
 */
export const resolvedNjbnPatternOption: PatternOptions<true, true> =
  resolvePatternOptions(defaultPatternOptions, DEFAULT_NJBN_PATTERN_POLICY);

/** @internal Default ***Options*** for {@link normalizeJsBuildNewlines | **`normalize-js-build-newlines`**}. */
const DEFAULT_NJBN_OPTIONS = {
  patternOptions: resolvedNjbnPatternOption,
  logLevel: DEFAULT_LOG_LEVEL
} as const satisfies NormalizeJsBuildNewlinesOptions;

//? Identity -------------------------------------------------------------
/** Generated Command Identity For {@link normalizeJsBuildNewlines | **`normalize-js-build-newlines`**}. */
export const commandNjbnIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "normalize-js-build-newlines"
});

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link normalizeJsBuildNewlines | **`normalizeJsBuildNewlines`**}.***
 * ----------------------------------------------------------------
 */
export type NormalizeJsBuildNewlinesOptions = BaseOptions<
  typeof DEFAULT_NJBN_PATTERN_POLICY.filesOnly,
  typeof DEFAULT_NJBN_PATTERN_POLICY.forceUnique
>;

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Normalizes excessive blank lines in compiled JavaScript files.***
 * ----------------------------------------------------------------
 *
 * This function scans JavaScript build output files and normalizes
 * excessive consecutive newlines.
 *
 * Any occurrence of **three or more consecutive line breaks**
 * (`\n` or `\r\n`) will be collapsed into exactly **two newlines**,
 * ensuring cleaner and more readable build artifacts.
 *
 * - *The process is **non-destructive**:*
 *     - Files are only rewritten if normalization is actually needed.
 *     - Duplicate file paths are automatically deduplicated using {@link Set | `Set`}.
 *
 * - *Supported JavaScript output extensions:*
 *     - `.js`.
 *     - `.cjs`.
 *     - `.mjs`.
 *     - `.esm.js`.
 *     - `.module.js`.
 *
 * @param pattern - Glob pattern(s) or a set of file paths pointing to JS build outputs.
 * @param options - Normalization configuration options.
 *
 * @example
 * ```ts
 * await normalizeJsBuildNewlines("dist/**\/*.js");
 * ```
 *
 * @example
 * ```ts
 * await normalizeJsBuildNewlines("dist/**\/*.{js,cjs,mjs}");
 * ```
 *
 * @example
 * ```ts
 * await normalizeJsBuildNewlines(
 *   ["dist/**\/*.js", "build/**\/*.mjs", "out/**\/*.{js,mjs}"],
 * );
 * ```
 *
 * @remarks
 * - This utility is intended for **post-build cleanup** and is safe to run
 * multiple times.
 * - Re-running it on already normalized files will result
 * in no changes.
 */
export const normalizeJsBuildNewlines = async (
  pattern: StringCollection,
  options: NormalizeJsBuildNewlinesOptions = {}
): Promise<void> => {
  const loggerLevel = resolveLogVerbosity(
    options,
    DEFAULT_NJBN_OPTIONS.logLevel
  );

  try {
    const {
      __commandTitle,
      patternOptions = DEFAULT_NJBN_OPTIONS.patternOptions
    } = options;

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      console.log(
        joinLinesLoose(
          isNonEmptyString(__commandTitle)
            ? __commandTitle
            : commandNjbnIdentity.utility(),
          ""
        )
      );
    }

    const patterns = [...toStringSet(pattern)];
    const cleanPatternOptions = resolvePatternOptions(
      patternOptions,
      DEFAULT_NJBN_PATTERN_POLICY
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
          DEFAULT_NJBN_OPTIONS.patternOptions
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_NJBN_OPTIONS.logLevel)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        actionName: "Normalize New Lines"
      });
    }

    const files = (await fastGlob(patterns, cleanPatternOptions)).sort();

    const filesToClean = new Set<string>();

    for (const filePath of files) {
      if (!JS_OUTPUT_FILE_RE.test(filePath)) continue;

      let content: string;

      try {
        content = await fsExtra.promises.readFile(filePath, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      if (!/(\r?\n){3,}/.test(content)) continue;
      filesToClean.add(filePath);
    }

    let count = 0;
    for (const [, filePath] of filesToClean.entries()) {
      count++;

      let content: string;

      try {
        content = await fsExtra.promises.readFile(filePath, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      const finalContent = content.replace(/(\r?\n){3,}/g, EOL);

      if (finalContent !== content) {
        try {
          await fsExtra.promises.writeFile(filePath, finalContent, "utf8");
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
          throw err;
        }

        if (canLog(loggerLevel, VERBOSE_LOG)) {
          BUILD_LOGGER.ON_PROCESS({
            actionName: "New Line Normalized",
            count: count,
            nameDirect: filePath
          });
        }
      }
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (filesToClean.size > 0) {
        BUILD_LOGGER.ON_FINISH({
          actionName: "Normalize New Lines",
          count
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Normalize New Lines",
          reasonEndText: "normalize"
        });
      }
    }
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        actionName: "Normalize New Lines",
        error
      });
    }
  }
};
