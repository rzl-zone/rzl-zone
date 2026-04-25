import "@rzl-zone/node-only";

import type { RequiredOnly } from "@/_internal/types/extra";
import type { StringCollection } from "@/types";
import type { CleanCoreOptions } from "./clean-build-artifacts-types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanJsBuildArtifacts } from "../clean-js-build-artifacts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanTypesBuildArtifacts } from "../clean-types-build-artifacts";

import {
  resolvePatternOptions,
  sourceOfPatternOptions
} from "@/_internal/libs/fast-globe-options";

import { canLog, VERBOSE_LOG } from "@/_internal/utils/log-level";
import { BUILD_LOGGER } from "@/_internal/utils/logger-builder";
import { isPlainObject, toStringSet } from "@/_internal/utils/helper";

import { fastGlob, fsExtra } from "@/utils/server";
import { EOL, joinLinesLoose } from "@/utils/client";

import { cleanBuildArtifactsCore } from "./clean-build-artifacts-core";
import { fileHasTarget, splitLines } from "./clean-build-artifacts-utils";
import {
  DEFAULT_CLEAN_OPTION,
  DEFAULT_CLEAN_PATTERN_POLICY
} from "./clean-build-artifacts-constant";

type OmitLogActionName<T> = Omit<T, "actionName">;
type RunCleanBuildArtifactsParams = {
  patterns: StringCollection;
  options: RequiredOnly<CleanCoreOptions, "logLevel">;

  fileTest: RegExp;

  logAction: {
    title: string;
    actionName: string;
    onStart?: OmitLogActionName<
      Parameters<(typeof BUILD_LOGGER)["ON_STARTING"]>[0]
    >;
    onProcess?: OmitLogActionName<
      Omit<
        Parameters<(typeof BUILD_LOGGER)["ON_PROCESS"]>[0],
        "count" | "nameDirect"
      >
    >;
    onError?: OmitLogActionName<
      Omit<
        Parameters<(typeof BUILD_LOGGER)["ON_ERROR"]>[0],
        "error" | "nameDirect"
      >
    >;
    onSkipping?: OmitLogActionName<
      Parameters<(typeof BUILD_LOGGER)["ON_SKIPPING"]>[0]
    >;
  };
};

/** @internal Runner for {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`} and {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}. */
export async function runCleanBuildArtifacts({
  patterns: pattern,
  options,
  fileTest,
  logAction
}: RunCleanBuildArtifactsParams) {
  if (!isPlainObject(options)) {
    options = DEFAULT_CLEAN_OPTION;
  } else {
    options = { ...DEFAULT_CLEAN_OPTION, ...options };
  }

  const {
    patternOptions,
    logLevel: loggerLevel,
    removeAdjacentEmptyLines,
    removeRegion,
    removeSourceMap
  } = options;

  try {
    if (canLog(loggerLevel, VERBOSE_LOG))
      console.log(joinLinesLoose(logAction.title, ""));

    const patterns = [...toStringSet(pattern)];
    const cleanPatternOptions = resolvePatternOptions(
      patternOptions,
      DEFAULT_CLEAN_PATTERN_POLICY
    );
    const files = (await fastGlob(patterns, cleanPatternOptions)).sort();

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
          DEFAULT_CLEAN_OPTION.patternOptions
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.removeSourceMap",
        removeSourceMap,
        BUILD_LOGGER.SOURCE_OF(
          removeSourceMap,
          DEFAULT_CLEAN_OPTION.removeSourceMap
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.removeRegion",
        removeRegion,
        BUILD_LOGGER.SOURCE_OF(removeRegion, DEFAULT_CLEAN_OPTION.removeRegion)
      );
      BUILD_LOGGER.OPTIONS(
        "options.removeAdjacentEmptyLines",
        removeAdjacentEmptyLines,
        BUILD_LOGGER.SOURCE_OF(
          removeAdjacentEmptyLines,
          DEFAULT_CLEAN_OPTION.removeAdjacentEmptyLines
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_CLEAN_OPTION.logLevel)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        ...logAction.onStart,
        actionName: logAction.actionName
      });
    }

    let count = 0;

    for (const filePath of files) {
      if (!new RegExp(fileTest).test(filePath)) continue;

      let content: string;

      try {
        content = await fsExtra.promises.readFile(filePath, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      const lines = splitLines(content);

      if (!fileHasTarget(lines, options)) continue;

      const cleanedLines = cleanBuildArtifactsCore(lines, options);
      const finalContent = cleanedLines.join(EOL);

      if (finalContent === content) continue;

      count++;

      try {
        await fsExtra.promises.writeFile(filePath, finalContent, "utf8");
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      if (canLog(loggerLevel, VERBOSE_LOG)) {
        BUILD_LOGGER.ON_PROCESS({
          ...logAction.onProcess,
          actionName: logAction.actionName,
          count,
          nameDirect: filePath
        });
      }
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (count > 0) {
        BUILD_LOGGER.ON_FINISH({
          actionName: logAction.actionName,
          count: count
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          ...logAction.onSkipping,
          actionName: logAction.actionName,
          reasonEndText: logAction.onSkipping?.reasonEndText ?? "cleaning"
        });
      }
    }
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        ...logAction.onError,
        actionName: logAction.actionName,
        error
      });
    }
  }
}
