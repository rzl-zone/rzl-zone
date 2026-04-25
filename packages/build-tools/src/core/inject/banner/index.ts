import "@rzl-zone/node-only";

import type { BaseOptions, PatternOptions, StringCollection } from "@/types";

import {
  defaultPatternOptions,
  type PatternRuntimePolicy,
  resolvePatternOptions,
  sourceOfPatternOptions
} from "@/_internal/libs/fast-globe-options";

import {
  isNonEmptyString,
  isRegExp,
  toStringSet
} from "@/_internal/utils/helper";
import {
  BANNER_RE,
  extractAndHoistBanner,
  hasExecutableCode,
  NON_COMMENTABLE_FILE_RE
} from "@/_internal/utils/source";
import {
  canLog,
  DEFAULT_LOG_LEVEL,
  resolveLogVerbosity,
  VERBOSE_LOG
} from "@/_internal/utils/log-level";
import { BUILD_LOGGER } from "@/_internal/utils/logger-builder";

import { fastGlob, fsExtra } from "@/utils/server";
import { EOL, joinLinesLoose, picocolors } from "@/utils/helper/formatter";

import { CommandIdentity } from "@/commander-kit/identity";

//? Constant -------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Default Pattern Policy for **inject banner** operations.***
 * ----------------------------------------------------------------
 *
 * Defines the runtime behavior for pattern resolution used by:
 * - {@link injectBanner | **`inject-banner`**}.
 *
 * @remarks
 * - `filesOnly`: Ensures only files are matched.
 * - `forceUnique`: Deduplicates matched results.
 */
export const DEFAULT_IB_PATTERN_POLICY = {
  filesOnly: true,
  forceUnique: true
} as const satisfies PatternRuntimePolicy<boolean, boolean>;

/** ----------------------------------------------------------------
 * * ***Resolved Pattern Options for **inject banner** operations.***
 * ----------------------------------------------------------------
 *
 * Pattern options used by:
 * - {@link injectBanner | **`inject-banner`**}.
 */
export const resolvedIbPatternOption: PatternOptions<true, true> =
  resolvePatternOptions(defaultPatternOptions, DEFAULT_IB_PATTERN_POLICY);

/** @internal Default ***Options*** for  {@link injectBanner | **`inject-banner`**}. */
const DEFAULT_IB_OPTIONS = {
  replaceBanner: false,
  removeDuplicate: true,
  bannerPosition: "after-existing" as const,
  patternOptions: resolvedIbPatternOption,
  logLevel: DEFAULT_LOG_LEVEL
} as const satisfies InjectBannerOptions;

//? Identity -------------------------------------------------------------
/** Command identity associated with {@link injectBanner | **`inject-banner`**}. */
export const commandIbIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "inject-banner"
});

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link injectBanner | `inject-banner`}.***
 * ----------------------------------------------------------------
 */
export type InjectBannerOptions = {
  /** Replace existing banner block(s).
   *
   * - `false` ➔ Preserve existing banners.
   * - `true` ➔ Replace banners matching default `/^(?:\/\*![\s\S]*?\*\/\s*)+/`.
   * - `RegExp` ➔ Replace banners matching provided pattern.
   *
   * Note:
   * The provided RegExp will be internally cloned without the `g` flag
   * to ensure safe `.test()` execution.
   *
   * @default false
   */
  replaceBanner?: boolean | RegExp;

  /** Remove duplicated banner blocks.
   *
   * Deduplication is performed using `trim()` comparison.
   *
   * @default true
   */
  removeDuplicate?: boolean;

  /** Control where new banner block(s) are injected.
   *
   * - `"top"` ➔ Place new banner before existing banner blocks.
   * - `"after-existing"` ➔ Append new banner after existing blocks.
   *
   * @default "after-existing"
   */
  bannerPosition?: "top" | "after-existing";
} & BaseOptions<
  typeof DEFAULT_IB_PATTERN_POLICY.filesOnly,
  typeof DEFAULT_IB_PATTERN_POLICY.forceUnique
>;

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Injects banner comments into JavaScript output files.***
 * ----------------------------------------------------------------
 *
 * Scans files that match the provided glob pattern(s) and injects one or
 * more banner comment blocks at the top of each file when applicable.
 *
 * - ***Injection Rules:***
 *       - Skips files that:
 *          - Are empty after trimming.
 *          - Contain no executable JavaScript code.
 *          - Match `NON_COMMENTABLE_FILE_RE`.
 *       - Preserves existing shebang (`#!`) at the very top of the file.
 *       - Existing banner blocks are detected using `BANNER_RE`.
 *
 * - ***Replace Mode:***
 *       - If `options.replaceBanner` is:
 *          - `true` ➔ uses default `BANNER_RE`.
 *          - `RegExp` ➔ uses the provided pattern.
 *       - If the existing banner matches the replace pattern,
 *         it will be fully replaced with the new banner block(s).
 *       - The replace pattern is executed without the `g` flag internally
 *         to avoid stateful RegExp side effects.
 *
 * - ***Banner Ordering:***
 *       Controlled by `options.bannerPosition`:
 *       - `"top"` ➔ new banner is placed before existing banner blocks.
 *       - `"after-existing"` ➔ new banner is appended after existing blocks.
 *
 * - ***Deduplication:***
 *       If `options.removeDuplicate` is `true` (default):
 *       - Banner blocks are deduplicated based on `trim()` comparison.
 *       - Order is preserved.
 *
 * - ***Normalization:***
 *       - Line endings are normalized to the internal `EOL` constant.
 *       - Each banner block is ensured to end with exactly two `EOL`s.
 *       - The operation is idempotent — running multiple times
 *         will not change the file further.
 *
 * @example
 * Basic usage:
 * ```ts
 * await injectBanner(
 *   "dist/**\/*.js",
 *   `
 *   /**
 *    * My Library v1.0.0
 *    * (c) 2026 Your Name
 *    *\/
 *   `
 * );
 * ```
 *
 * @example
 * Inject multiple banner blocks:
 * ```ts
 * await injectBanner(
 *   ["dist/**\/*.js", "build/**\/*.mjs"],
 *   [
 *     `/** Project: MyApp *\/`,
 *     `/** License: MIT *\/`
 *   ]
 * );
 * ```
 *
 * @example
 * Replace existing banner entirely:
 * ```ts
 * await injectBanner(
 *   "dist/**\/*.js",
 *   `/** Updated License Banner *\/`,
 *   { replaceBanner: true }
 * );
 * ```
 *
 * @example
 * Replace using custom RegExp:
 * ```ts
 * await injectBanner(
 *   "dist/**\/*.js",
 *   `/** New Banner *\/`,
 *   {
 *     replaceBanner: /^\/\*\*![\s\S]*?\*\/\s*\/,
 *   }
 * );
 * ```
 *
 * @example
 * Always place banner at very top (after shebang):
 * ```ts
 * await injectBanner(
 *   "dist/**\/*.js",
 *   `/** Build: Production *\/`,
 *   {
 *     bannerPosition: "top"
 *   }
 * );
 * ```
 *
 * @param pattern - Glob pattern(s) pointing to target JavaScript files.
 * @param bannerText - Banner string(s) to inject.
 * @param options - Injection configuration options.
 */
export const injectBanner = async (
  pattern: StringCollection,
  bannerText: StringCollection,
  options: InjectBannerOptions = {}
): Promise<void> => {
  const loggerLevel = resolveLogVerbosity(options, DEFAULT_LOG_LEVEL);

  try {
    const {
      __commandTitle,
      removeDuplicate = DEFAULT_IB_OPTIONS.removeDuplicate,
      bannerPosition = DEFAULT_IB_OPTIONS.bannerPosition,
      replaceBanner = DEFAULT_IB_OPTIONS.replaceBanner,
      patternOptions = DEFAULT_IB_OPTIONS.patternOptions
    } = options;

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      console.log(
        joinLinesLoose(
          isNonEmptyString(__commandTitle)
            ? __commandTitle
            : commandIbIdentity.utility(),
          ""
        )
      );
    }

    const patterns = [...toStringSet(pattern)];
    const banners = toStringSet(bannerText, {
      parameterKey: "bannerText"
    });

    const cleanPatternOptions = resolvePatternOptions(
      patternOptions,
      DEFAULT_IB_PATTERN_POLICY
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
          DEFAULT_IB_OPTIONS.patternOptions
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.removeDuplicate",
        removeDuplicate,
        BUILD_LOGGER.SOURCE_OF(
          removeDuplicate,
          DEFAULT_IB_OPTIONS.removeDuplicate
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.replaceBanner",
        replaceBanner,
        BUILD_LOGGER.SOURCE_OF(replaceBanner, DEFAULT_IB_OPTIONS.replaceBanner)
      );
      BUILD_LOGGER.OPTIONS(
        "options.bannerPosition",
        bannerPosition,
        BUILD_LOGGER.SOURCE_OF(
          bannerPosition,
          DEFAULT_IB_OPTIONS.bannerPosition
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_IB_OPTIONS.logLevel)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        actionName: "Injecting Banner"
      });
    }

    if (banners.size === 0) {
      if (canLog(loggerLevel, VERBOSE_LOG)) {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Inject Banner",
          reasonSkipAction: "empty bannerText",
          reasonType: "parameter",
          reasonEndText: "injecting"
        });
      }
      return;
    }

    const files = (await fastGlob(patterns, cleanPatternOptions)).sort();

    let count = 0;

    for (const filePath of files) {
      if (NON_COMMENTABLE_FILE_RE.test(filePath)) continue;
      let original: string;

      try {
        original = await fsExtra.promises.readFile(filePath, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      if (!isNonEmptyString(original)) continue;
      if (!hasExecutableCode(original)) continue;

      const {
        body,
        shebang,
        banner: existingBanner
      } = extractAndHoistBanner(original);

      const bannerRegex = new RegExp(BANNER_RE.source, "g");

      const newBlocks = [...banners];

      if (newBlocks.length === 0) continue;

      const existingBlocks = existingBanner
        ? [...existingBanner.matchAll(bannerRegex)].map((m) => m[0])
        : [];

      let finalBlocks: string[] = [];

      if (replaceBanner) {
        const replaceRegex = isRegExp(replaceBanner)
          ? replaceBanner
          : BANNER_RE;

        if (
          existingBanner &&
          new RegExp(
            replaceRegex.source,
            replaceRegex.flags.replace("g", "")
          ).test(existingBanner)
        ) {
          finalBlocks = [...newBlocks];
        } else {
          finalBlocks =
            bannerPosition === "top"
              ? [...newBlocks, ...existingBlocks]
              : [...existingBlocks, ...newBlocks];
        }
      } else {
        const combined =
          bannerPosition === "top"
            ? [...newBlocks, ...existingBlocks]
            : [...existingBlocks, ...newBlocks];

        finalBlocks = combined;
      }

      if (removeDuplicate) {
        const seen = new Set<string>();

        finalBlocks = finalBlocks.filter((block) => {
          const normalized = block.trim();

          if (seen.has(normalized)) return false;

          seen.add(normalized);
          return true;
        });
      }

      const normalizedFinalBanner = finalBlocks
        .map((text) => {
          if (!text || !isNonEmptyString(text)) return "";

          let normalized = text.replace(/\r\n/g, EOL);

          return normalized.replace(/\n+$/, "") + EOL + EOL;
        })
        .join("");

      let content = shebang + normalizedFinalBanner + body;

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
            "Banner Injected " +
            picocolors.cyanBright(
              replaceBanner ? "(replace mode)" : "(preserve mode)"
            ),
          count,
          nameDirect: filePath
        });
      }
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (count > 0) {
        BUILD_LOGGER.ON_FINISH({
          actionName: "Inject Banner",
          count
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Inject Banner",
          reasonEndText: "injecting"
        });
      }
    }
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        actionName: "Inject Banner",
        error
      });
    }
  }
};
