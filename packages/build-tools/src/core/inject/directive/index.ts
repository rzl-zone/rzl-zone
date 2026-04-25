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
  hasExecutableCode,
  JS_OUTPUT_FILE_RE,
  stripUseStrict
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
import { EOL, joinLinesLoose, picocolors } from "@/utils/helper/formatter";

import { CommandIdentity } from "@/commander-kit/identity";

//? Constant -------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Default Pattern Policy for **inject directive** operations.***
 * ----------------------------------------------------------------
 *
 * Defines the runtime behavior for pattern resolution used by:
 * - {@link injectDirective | **`inject-directive`**}.
 *
 * @remarks
 * - `filesOnly`: Ensures only files are matched.
 * - `forceUnique`: Deduplicates matched results.
 */
export const DEFAULT_ID_PATTERN_POLICY = {
  filesOnly: true,
  forceUnique: true
} as const satisfies PatternRuntimePolicy<boolean, boolean>;

/** ----------------------------------------------------------------
 * * ***Resolved Pattern Options for **inject directive** operations.***
 * ----------------------------------------------------------------
 *
 * Pattern options used by:
 * - {@link injectDirective | **`inject-directive`**}.
 */
export const resolvedIdPatternOption: PatternOptions<true, true> =
  resolvePatternOptions(defaultPatternOptions, DEFAULT_ID_PATTERN_POLICY);

/** @internal Default ***Options*** for  {@link injectDirective | **`inject-directive`**}. */
const DEFAULT_ID_OPTIONS = {
  patternOptions: resolvedIdPatternOption,
  logLevel: DEFAULT_LOG_LEVEL
} as const satisfies InjectDirectiveOptions;

//? Identity -------------------------------------------------------------
/** Command identity associated with {@link injectDirective | **`inject-directive`**}. */
export const commandIdIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "inject-directive"
});

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link injectDirective | **`inject-directive`**}.***
 * ----------------------------------------------------------------
 */
export type InjectDirectiveOptions = BaseOptions<
  typeof DEFAULT_ID_PATTERN_POLICY.filesOnly,
  typeof DEFAULT_ID_PATTERN_POLICY.forceUnique
>;

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Injects directive statements into JavaScript output files.***
 * ----------------------------------------------------------------
 *
 * This function scans files matching the provided glob pattern(s) and
 * injects one or more directive statements (e.g. `"use strict"`,
 * `"use client"`) at the top of each file when applicable.
 *
 * - *Injection behavior:*
 *     - Skips empty files.
 *     - Skips files that only contain directive statements.
 *     - Avoids duplicating existing directives.
 *     - Preserves existing file content order.
 *
 * - *Each directive is normalized and injected as a standalone statement:*
 *     ```js
 *     "directive-name";
 *     ```
 *
 * @param pattern - Glob pattern or list of patterns pointing to JS output files.
 * @param directive - Directive string(s) to inject.
 * @param options - Injection configuration options, see {@link InjectDirectiveOptions | **`InjectDirectiveOptions`**}.
 *
 * @example
 * ```ts
 * await injectDirective("dist/**\/*.js", "use strict");
 * ```
 *
 * @example
 * ```ts
 * await injectDirective("dist/**\/*.js", "use client");
 * ```
 *
 * @example
 * ```ts
 * await injectDirective(
 *   ["dist/**\/*.js", "build/*\/*.mjs"],
 *   ["use strict", "use client"]
 * );
 * ```
 */
export const injectDirective = async (
  pattern: StringCollection,
  directive: StringCollection,
  options: InjectDirectiveOptions = {}
): Promise<void> => {
  const loggerLevel = resolveLogVerbosity(options, DEFAULT_ID_OPTIONS.logLevel);

  try {
    const {
      __commandTitle,
      patternOptions = DEFAULT_ID_OPTIONS.patternOptions
    } = options;

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      console.log(
        joinLinesLoose(
          isNonEmptyString(__commandTitle)
            ? __commandTitle
            : commandIdIdentity.utility(),
          ""
        )
      );
    }

    const patterns = [...toStringSet(pattern)];
    const cleanPatternOptions = resolvePatternOptions(
      patternOptions,
      DEFAULT_ID_PATTERN_POLICY
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
        "directive",
        directive,
        BUILD_LOGGER.SOURCE_OF(directive, undefined),
        true
      );
      BUILD_LOGGER.OPTIONS(
        "options.patternOptions",
        cleanPatternOptions,
        sourceOfPatternOptions(
          cleanPatternOptions,
          DEFAULT_ID_OPTIONS.patternOptions
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_ID_OPTIONS.logLevel)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        actionName: "Inject Directive"
      });
    }

    const directives = [...toStringSet(directive)];

    const files = (await fastGlob(patterns, cleanPatternOptions)).sort();

    let count = 0;

    for (const filePath of files) {
      if (!JS_OUTPUT_FILE_RE.test(filePath)) continue;

      let original: string;

      try {
        original = await fsExtra.promises.readFile(filePath, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      if (!isNonEmptyString(original) || !hasExecutableCode(original)) continue;
      const { body, banner, shebang } = extractAndHoistBanner(original);
      const { directives: extractedDirectives, rest } = extractDirectives(body);
      const existing = new Set(extractedDirectives);
      let injectLines: string[] | undefined;

      if (detectModuleKindFromContent(rest) === "cjs") {
        injectLines ??= [];
        // eslint-disable-next-line quotes
        injectLines.push(`"use strict";`);
      }

      for (const d of directives) {
        const dTrim = d.trim();
        if (!dTrim || dTrim === "use strict") continue;

        const line = `"${dTrim}";`;
        if (!existing.has(line)) {
          injectLines ??= [];
          injectLines.push(line);
        }
      }

      if (!injectLines?.length) continue;

      const finalDirective =
        injectLines.join(EOL) + EOL + stripUseStrict(extractedDirectives);

      const content = shebang + banner + finalDirective + rest;

      try {
        await fsExtra.promises.writeFile(filePath, content, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      count++;

      if (canLog(loggerLevel, VERBOSE_LOG)) {
        BUILD_LOGGER.ON_PROCESS({
          actionName:
            "Directive Injected " +
            picocolors.cyanBright("(`" + injectLines.join("`, `") + "`)"),
          count,
          nameDirect: filePath
        });
      }
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (count > 0) {
        BUILD_LOGGER.ON_FINISH({
          actionName: "Inject Directive",
          count
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Inject Directive",
          reasonEndText: "injecting"
        });
      }
    }
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        actionName: "Inject Directive",
        error
      });
    }
  }
};
