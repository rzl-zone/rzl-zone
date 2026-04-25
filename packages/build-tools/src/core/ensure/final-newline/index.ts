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
import { BUILD_LOGGER } from "@/_internal/utils/logger-builder";
import { isNonEmptyString, toStringSet } from "@/_internal/utils/helper";

import { fastGlob, fsExtra } from "@/utils/server";
import { EOL, joinLinesLoose, picocolors } from "@/utils/helper/formatter";
import { CommandIdentity } from "@/commander-kit/identity";

//? Constant -------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Default Pattern Policy for **ensure final newline** operations.***
 * ----------------------------------------------------------------
 *
 * Defines the runtime behavior for pattern resolution used by:
 * - {@link ensureFinalNewline | **`ensure-final-newline`**}.
 *
 * @remarks
 * - `filesOnly`: Ensures only files are matched.
 * - `forceUnique`: Deduplicates matched results.
 */
export const DEFAULT_EFN_PATTERN_POLICY = {
  filesOnly: true,
  forceUnique: true
} as const satisfies PatternRuntimePolicy;

/** ----------------------------------------------------------------
 * * ***Resolved Pattern Options for **ensure final newline** operations.***
 * ----------------------------------------------------------------
 *
 * Pattern options used by:
 * - {@link ensureFinalNewline | **`ensure-final-newline`**}.
 */
export const resolvedEfnPatternOption: PatternOptions<true, true> =
  resolvePatternOptions(defaultPatternOptions, DEFAULT_EFN_PATTERN_POLICY);

/** @internal Default ***Options*** for {@link ensureFinalNewline | **`ensure-final-newline`**}. */
const DEFAULT_EFN_OPTIONS = {
  patternOptions: resolvedEfnPatternOption,
  logLevel: DEFAULT_LOG_LEVEL
} as const satisfies EnsureFinalNewlineOptions;

//? Identity -------------------------------------------------------------
/** Command identity associated with {@link ensureFinalNewline | **`ensure-final-newline`**}. */
export const commandEfnIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "ensure-final-newline"
});

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link ensureFinalNewline | **`ensure-final-newline`**}.***
 * ----------------------------------------------------------------
 */
export type EnsureFinalNewlineOptions = BaseOptions<
  typeof DEFAULT_EFN_PATTERN_POLICY.filesOnly,
  typeof DEFAULT_EFN_PATTERN_POLICY.forceUnique
>;

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Ensure files end with exactly one final newline.***
 * ----------------------------------------------------------------
 *
 * Scans files matching the provided glob pattern(s) and ensures that
 * **each file ends with exactly one newline character**.
 *
 * - *Behavior:*
 *     - Removes **all trailing newline characters** at the end of the file.
 *     - Appends **exactly one** platform-consistent newline (`EOL`).
 *     - Preserves all internal formatting and whitespace.
 *     - Does **not** modify files that are already compliant.
 *
 * - *Newline handling:*
 *     - Supports both `LF` (`\n`) and `CRLF` (`\r\n`).
 *     - Uses **`EOL`** to ensure consistent output across the project.
 *
 * - *Safety:*
 *     - Skips non-existent paths.
 *     - Skips non-file entries (directories, symlinks, etc.).
 *     - Writes only when the file content actually changes.
 *
 * @param {string | string[] | Set<string>} pattern
 * Glob pattern(s) pointing to files that should be checked and normalized.
 *
 * @param {EnsureFinalNewlineOptions} [options]
 * Internal execution options (CLI vs utility context).
 *
 * @example
 * ```ts
 * await ensureFinalNewline("dist/**\/*.{js,cjs,mjs,d.ts}");
 * ```
 *
 * @example
 * ```ts
 * await ensureFinalNewline(["dist/**\/*.js", "dist/**\/*.d.ts"]);
 * ```
 *
 * @remarks
 * This utility is typically executed **post-build** to ensure output
 * files follow POSIX tooling expectations and common formatting conventions.
 */
export const ensureFinalNewline = async (
  pattern: StringCollection,
  options: EnsureFinalNewlineOptions = {}
): Promise<void> => {
  const loggerLevel = resolveLogVerbosity(
    options,
    DEFAULT_EFN_OPTIONS.logLevel
  );

  try {
    const {
      __commandTitle,
      patternOptions = DEFAULT_EFN_OPTIONS.patternOptions
    } = options;

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      console.log(
        joinLinesLoose(
          isNonEmptyString(__commandTitle)
            ? __commandTitle
            : commandEfnIdentity.utility(),
          ""
        )
      );
    }

    const patterns = [...toStringSet(pattern)];
    const cleanPatternOptions = resolvePatternOptions(
      patternOptions,
      DEFAULT_EFN_PATTERN_POLICY
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
          DEFAULT_EFN_OPTIONS.patternOptions
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_EFN_OPTIONS.logLevel)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        actionName: "Ensuring Final Newline"
      });
    }

    // const files = new Set<string>();
    const files = (await fastGlob(patterns, cleanPatternOptions)).sort();
    // for (const file of matched.sort()) files.add(file);

    let count = 0;

    for (const filePath of files) {
      let content: string;

      try {
        content = await fsExtra.promises.readFile(filePath, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      const normalized = content.replace(/(\r?\n)*$/, EOL);

      if (normalized === content) continue;

      try {
        await fsExtra.promises.writeFile(filePath, normalized, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      count++;

      if (canLog(loggerLevel, VERBOSE_LOG)) {
        BUILD_LOGGER.ON_PROCESS({
          actionName: "Final Newline",
          count,
          nameDirect: filePath
        });
      }
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (count > 0) {
        BUILD_LOGGER.ON_FINISH({
          actionName: "Ensuring Final Newline",
          count
        });
      } else if (files.length < 1) {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Ensuring Final Newline",
          reasonSkipAction: `no files found matching the pattern${picocolors.reset(
            ","
          )}`,
          reasonType: "",
          textDirectAction: "no need to fix",
          reasonEndText: "end of file (EOF)"
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Ensuring Final Newline",
          reasonSkipAction: `all files are valid${picocolors.reset(",")}`,
          reasonType: "",
          textDirectAction: "no need to fix",
          reasonEndText: "end of file (EOF)"
        });
      }
    }
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        actionName: "Ensuring Final Newline",
        error
      });
    }
  }
};
