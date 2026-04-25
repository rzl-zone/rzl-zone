/* eslint-disable quotes */
import "@rzl-zone/node-only";

import type { BaseOptions, Collection } from "@/types";
import type { OmitStrict } from "@/_internal/types/extra";

import path from "node:path";

import {
  isArray,
  isBoolean,
  isNonEmptyString,
  isNumber,
  isPlainObject,
  isSet,
  isUndefined,
  toObjectSet
} from "@/_internal/utils/helper";
import {
  canLog,
  DEFAULT_LOG_LEVEL,
  resolveLogVerbosity,
  VERBOSE_LOG
} from "@/_internal/utils/log-level";
import { BUILD_LOGGER } from "@/_internal/utils/logger-builder";

import {
  joinInline,
  joinLinesLoose,
  picocolors,
  plural
} from "@/utils/helper/formatter";
import { fsExtra } from "@/utils/server";

import { CommandIdentity } from "@/commander-kit/identity";

//? Constant -------------------------------------------------------------
/** @internal Default ***Options*** for {@link copyFileToDest | **`copy-file-to-dest`**}. */
const DEFAULT_CFTD_OPTIONS = {
  fileName: undefined,
  outputRoot: "dist",
  absoluteTarget: false,
  ignoreMissingSourceError: false
} as const satisfies Omit<CopyFileToDestParam, "source" | "target">;

//? Utils ----------------------------------------------------------------
/** @internal Util for {@link copyFileToDest | **`copy-file-to-dest`**} validation args only. */
const validateItem = (
  item: CopyFileToDestParam,
  index?: number
): never | void => {
  const indexText = isNumber(index) ? ` at index ${index}` : "";

  if (!isPlainObject(item)) {
    throw new TypeError(`Invalid item${indexText}: must be a 'plain object'!`);
  }

  if (!isNonEmptyString(item.source) && !isNonEmptyString(item.target)) {
    throw new TypeError(
      `Invalid item${indexText}: 'source' and 'target' must be 'non-empty string'!`
    );
  }

  if (!isNonEmptyString(item.source)) {
    throw new TypeError(
      `Invalid item${indexText}: 'source' must be 'non-empty string'!`
    );
  }
  if (!isNonEmptyString(item.target)) {
    throw new TypeError(
      `Invalid item${indexText}: 'target' must be 'non-empty string'!`
    );
  }

  if (!isUndefined(item.fileName) && !isNonEmptyString(item.fileName)) {
    throw new TypeError(
      `Invalid item${indexText}: 'fileName' must be 'non-empty string' if provided!`
    );
  }
  if (!isUndefined(item.outputRoot) && !isNonEmptyString(item.outputRoot)) {
    throw new TypeError(
      `Invalid item${indexText}: 'outputRoot' must be 'non-empty string' if provided!`
    );
  }
  if (!isUndefined(item.absoluteTarget) && !isBoolean(item.absoluteTarget)) {
    throw new TypeError(
      `Invalid item${indexText}: 'absoluteTarget' must be a 'boolean' if provided!`
    );
  }
};
/** @internal Util for {@link copyFileToDest | **`copy-file-to-dest`**}. */
function buildCopySummary(
  successCount: number,
  errorCount: number,
  duplicateCount: number,
  label: string
) {
  return picocolors.bold(
    joinLinesLoose(
      joinInline(
        picocolors.yellowBright("⚠"),
        picocolors.blueBright(label) + picocolors.gray(" -"),
        picocolors.whiteBright(successCount > 0 ? "Some" : "All"),
        picocolors.whiteBright("files"),
        picocolors.redBright("failed to copy") + ":"
      ),

      successCount < 1
        ? false
        : `  ${picocolors.greenBright("✔")} ${picocolors.greenBright(successCount)} ${plural(successCount, "file")} copied.`,

      errorCount < 1
        ? false
        : `  ${picocolors.redBright("✖")} ${picocolors.redBright(errorCount)} ${plural(errorCount, "file")} failed.`,

      duplicateCount < 1
        ? false
        : `  ${picocolors.yellowBright("⚠")} ${picocolors.yellowBright(duplicateCount)} ${plural(duplicateCount, "duplicate operation")} skipped.`
    )
  );
}
/** @internal Util for {@link copyFileToDest | **`copy-file-to-dest`**}. */
function buildOperationKey(item: CopyFileToDestParam) {
  return [
    item.source,
    item.target,
    item.fileName ?? "",
    item.outputRoot ?? DEFAULT_CFTD_OPTIONS.outputRoot,
    item.absoluteTarget ? 1 : 0
  ].join("|");
}

/** ----------------------------------------------------------------
 * * ***Creates a `Set` of parameters for {@link copyFileToDest | **`copy-file-to-dest`**}.***
 * ----------------------------------------------------------------
 *
 * Utility helper to construct a `Set` of {@link CopyFileToDestParam | `CopyFileToDestParam`}
 * with proper type inference and editor autocomplete support.
 *
 * This is primarily useful when passing parameters as a `Set`,
 * since directly using `new Set([...])` may result in poor
 * TypeScript inference and missing autocomplete for object literals.
 *
 * ----------------------------------------------------------------
 * Behavior
 *
 * - Accepts a single parameter or an array of parameters.
 * - Automatically normalizes the input into a `Set`.
 *
 * ----------------------------------------------------------------
 *
 * @param items
 * A single {@link CopyFileToDestParam | `CopyFileToDestParam`} or an array of parameters.
 *
 * @returns
 * A `Set` containing the provided parameters.
 *
 * @example
 * ```ts
 * // single item
 * const setA = createCopyFileToDestParameterSet({
 *   source: "dist/index.d.ts",
 *   target: "dist"
 * });
 *
 * // multiple items
 * const setB = createCopyFileToDestParameterSet([
 *   {
 *     source: "dist/a.d.ts",
 *     target: "dist"
 *   },
 *   {
 *     source: "dist/b.d.ts",
 *     target: "dist"
 *   }
 * ]);
 *
 * // usage with copyFileToDest
 * await copyFileToDest(setB);
 * ```
 */
export function createCopyFileToDestParameterSet(
  items: CopyFileToDestParam | CopyFileToDestParam[]
): Set<CopyFileToDestParam> {
  return new Set(isArray(items) ? items : [items]);
}

//? Identity -------------------------------------------------------------
/** Command identity associated with {@link copyFileToDest | **`copy-file-to-dest`**}. */
export const commandCftdIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "copy-file-to-dest"
});

//? Types ----------------------------------------------------------------
/** @internal Type for {@link copyFileToDest | **`copy-file-to-dest`**}.*/
type UniqueOperation = {
  item: CopyFileToDestParam;
  index: number;
};
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link copyFileToDest | **`copy-file-to-dest`**}.***
 * ----------------------------------------------------------------
 */
export type CopyFileToDestOptions = OmitStrict<BaseOptions, "patternOptions">;
/** ----------------------------------------------------------------
 * * ***Describes the parameter options for copying a single file to a destination path of {@link copyFileToDest | **`copy-file-to-dest`**}.***
 * ----------------------------------------------------------------
 */
export type CopyFileToDestParam = {
  /** ----------------------------------------------------------------
   * * ***Path to the source file to be copied.***
   * ----------------------------------------------------------------
   * Can be either an absolute path or a path relative to the project root.
   *
   * @example "src/assets/logo.png"
   */
  source: string;

  /** ----------------------------------------------------------------
   * * ***Target directory where the file will be copied.***
   * ----------------------------------------------------------------
   *
   * - When `absoluteTarget` is `false` **(default)**, this path is resolved relative to `outputRoot`.
   * - When `absoluteTarget` is `true`, this path is treated as an absolute path relative to the project root.
   *
   * @example "assets/images"
   */
  target: string;

  /** ----------------------------------------------------------------
   * * ***Optional custom file name for the copied file.***
   * ----------------------------------------------------------------
   *
   * If omitted, the original file name from `source` will be preserved.
   *
   * @example "logo-new.png"
   *
   * @default undefined
   */
  fileName?: string;

  /** ----------------------------------------------------------------
   * * ***Output root directory used when resolving the `target` path.***
   * ----------------------------------------------------------------
   *
   * When `absoluteTarget` is `false`, the final copy destination will be
   * `<project-root>/<outputRoot>/<target>`.
   *
   * @default "dist"
   * @example "build"
   */
  outputRoot?: string;

  /** ----------------------------------------------------------------
   * * ***When `true`, disables `outputRoot` prefixing and treats `target`
   * as an absolute path relative to the project root.***
   * ----------------------------------------------------------------
   *
   * Use this when you want to copy directly to an absolute path inside the project,
   * bypassing the `outputRoot` prefix.
   *
   * @default false
   */
  absoluteTarget?: boolean;

  /** ----------------------------------------------------------------
   * * ***When `true`, suppresses errors when the source file does not exist.***
   * ----------------------------------------------------------------
   *
   * - Instead of throwing or logging an error, the operation will be skipped.
   * - Useful in development or watch mode where build outputs may not be immediately available.
   *
   * @default false
   */
  ignoreMissingSourceError?: boolean;
};

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Copy one or more files of any type into destination directories.***
 * ----------------------------------------------------------------
 *
 * This utility is **file-type agnostic** and can be used to copy any kind of asset,
 * including CSS, JavaScript, JSON, images, fonts, or other static files.
 *
 * - *The function supports:*
 *      - Copying a **single file** using a single configuration object.
 *      - Copying **multiple files** using an ***array*** or a ***Set*** of configuration objects.
 *
 * - When using a `Set`, it is recommended to use
 *   {@link createCopyFileToDestParameterSet | **`createCopyFileToDestParameterSet`**}
 *   to ensure proper TypeScript inference and autocomplete support.
 *
 * - By default, files are copied into a `dist` directory relative to the project root.
 * - This behavior can be customized per item via `outputRoot` or bypassed entirely
 *   using `absoluteTarget`.
 *
 * ----------------------------------------------------------------
 *
 * @param parameter
 * A single {@link CopyFileToDestParam | **`CopyFileToDestParam`**} object,
 * an array, or a `Set` of {@link CopyFileToDestParam | **`CopyFileToDestParam`**}.
 *
 * - *When a collection is provided:*
 *     - Each item is validated independently.
 *     - Files are copied sequentially.
 *     - Logging reflects the cumulative copy progress.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * // Copy a single CSS file into "dist/".
 * // Result: "dist/main.css".
 * await copyFileToDest({
 *   source: "src/styles/main.css",
 *   target: "."
 * });
 *
 * @example
 * // Copy a single CSS file into "dist/styles/".
 * await copyFileToDest({
 *   source: "src/styles/main.css",
 *   target: "styles"
 * });
 *
 * @example
 * // Copy multiple files into "dist/config/" (using array).
 * // Result: "dist/config/a.json" and "dist/config/b.json".
 * await copyFileToDest([
 *   {
 *     source: "src/config/a.json",
 *     target: "config"
 *   },
 *   {
 *     source: "src/config/b.json",
 *     target: "config"
 *   }
 * ]);
 *
 * @example
 * // Copy multiple files into "dist/config/" (using Set).
 * // ⚠️ Requires explicit typing for proper inference.
 * await copyFileToDest(new Set<CopyFileToDestParam>([
 *   {
 *     source: "src/config/a.json",
 *     target: "config"
 *   },
 *   {
 *     source: "src/config/b.json",
 *     target: "config"
 *   }
 * ]));
 *
 * @example
 * // Recommended: using helper for Set (better DX).
 * await copyFileToDest(
 *   createCopyFileToDestParameterSet([
 *     {
 *       source: "src/config/a.json",
 *       target: "config"
 *     },
 *     {
 *       source: "src/config/b.json",
 *       target: "config"
 *     }
 *   ])
 * );
 *
 * @example
 * // Copy multiple files with a custom output root.
 * // Result: "build/scripts/setup.js" and "build/scripts/runtime.js".
 * await copyFileToDest([
 *   {
 *     source: "src/scripts/setup.js",
 *     target: "scripts",
 *     outputRoot: "build"
 *   },
 *   {
 *     source: "src/scripts/runtime.js",
 *     target: "scripts",
 *     outputRoot: "build"
 *   }
 * ]);
 *
 * @example
 * // Copy and rename a single file.
 * // Result: "dist/config/app.json".
 * await copyFileToDest({
 *   source: "src/config/app.config.json",
 *   target: "config",
 *   fileName: "app.json"
 * });
 *
 * @example
 * ```ts
 * // Copy using an absolute target path (no outputRoot prefix).
 * // Result: "<project-root>/config/runtime/config.json".
 * await copyFileToDest({
 *   source: "src/runtime/config.json",
 *   target: "config/runtime",
 *   absoluteTarget: true
 * });
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @remarks
 * - The function ensures that all target directories exist before copying.
 * - Each item is validated to be a plain object with valid fields.
 * - The original file contents are copied without transformation.
 * - Errors during copying are caught and reported via the logger.
 */
export function copyFileToDest(
  parameter: CopyFileToDestParam,
  options?: CopyFileToDestOptions
): Promise<void>;
export function copyFileToDest(
  parameter: CopyFileToDestParam[],
  options?: CopyFileToDestOptions
): Promise<void>;
export function copyFileToDest(
  parameter: Set<CopyFileToDestParam>,
  options?: CopyFileToDestOptions
): Promise<void>;
// export async function copyFileToDest(
//   parameter: Collection<CopyFileToDestParam>,
//   options?: CopyFileToDestOptions
// ): Promise<void>;
export async function copyFileToDest(
  parameter: Collection<CopyFileToDestParam>,
  options: CopyFileToDestOptions = {}
) {
  const loggerLevel = resolveLogVerbosity(options);

  try {
    const { __commandTitle } = options;

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      console.log(
        joinLinesLoose(
          isNonEmptyString(__commandTitle)
            ? __commandTitle
            : commandCftdIdentity.utility(),
          ""
        )
      );
    }

    if (isArray(parameter) || isSet(parameter)) {
      let i = 0;
      for (const item of parameter) {
        validateItem(item, i++);
      }
    } else if (isPlainObject(parameter)) {
      validateItem(parameter);
    } else {
      throw new TypeError(
        "Parameter argument must be a 'plain object', 'array of plain objects' or an 'set of plain objects'!"
      );
    }

    const list = [...toObjectSet(parameter)];
    const uniqueLists: UniqueOperation[] = [];
    const seenOperations = new Set<string>();

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      BUILD_LOGGER.SECTION("Options", { icon: "⚙️ " });

      list.forEach((item, i) => {
        const {
          source,
          target,
          fileName = DEFAULT_CFTD_OPTIONS.fileName,
          outputRoot = DEFAULT_CFTD_OPTIONS.outputRoot,
          absoluteTarget = DEFAULT_CFTD_OPTIONS.absoluteTarget,
          ignoreMissingSourceError = DEFAULT_CFTD_OPTIONS.ignoreMissingSourceError
        } = item;

        const defaultFileName = fileName ?? path.basename(source);

        const indexText = list.length > 1 ? `[${i}]` : "";

        BUILD_LOGGER.OPTIONS(
          `options.copy${indexText}.source`,
          source,
          "overridden",
          true
        );
        BUILD_LOGGER.OPTIONS(
          `options.copy${indexText}.target`,
          target,
          "overridden",
          true
        );
        BUILD_LOGGER.OPTIONS(
          `options.copy${indexText}.fileName`,
          fileName || defaultFileName,
          BUILD_LOGGER.SOURCE_OF(fileName, DEFAULT_CFTD_OPTIONS.fileName)
        );
        BUILD_LOGGER.OPTIONS(
          `options.copy${indexText}.outputRoot`,
          outputRoot,
          BUILD_LOGGER.SOURCE_OF(outputRoot, DEFAULT_CFTD_OPTIONS.outputRoot)
        );
        BUILD_LOGGER.OPTIONS(
          `options.copy${indexText}.absoluteTarget`,
          absoluteTarget,
          BUILD_LOGGER.SOURCE_OF(
            absoluteTarget,
            DEFAULT_CFTD_OPTIONS.absoluteTarget
          )
        );
        BUILD_LOGGER.OPTIONS(
          `options.copy${indexText}.ignoreMissingSourceError`,
          ignoreMissingSourceError,
          BUILD_LOGGER.SOURCE_OF(
            ignoreMissingSourceError,
            DEFAULT_CFTD_OPTIONS.ignoreMissingSourceError
          )
        );

        if (i < list.length - 1) {
          console.log(
            picocolors.gray(
              "  =========================================================================="
            )
          );
        }
      });

      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_LOG_LEVEL)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        actionName: "Copy File",
        textDirectAction: "action:"
      });
    }

    let count = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    for (let index = 0; index < list.length; index++) {
      const item = list[index]!;

      const key = buildOperationKey(item);

      if (seenOperations.has(key)) {
        duplicateCount++;

        if (canLog(loggerLevel, VERBOSE_LOG)) {
          BUILD_LOGGER.ON_SKIPPING({
            actionName: "Copy File",
            reasonType: "",
            textDirectAction: "at",
            reasonSkipAction: "duplicate operation",
            reasonEndText:
              item.source +
              " " +
              picocolors.blueBright(
                `('parameter' index: ${picocolors.magentaBright(index)})`
              )
          });
        }
        continue;
      }

      seenOperations.add(key);
      uniqueLists.push({ item, index });
    }

    const procCwd = process.cwd();

    for (let i = 0; i < uniqueLists.length; i++) {
      const uniqList = uniqueLists[i]!;
      count++;

      const {
        source,
        target,
        fileName = DEFAULT_CFTD_OPTIONS.fileName,
        outputRoot = DEFAULT_CFTD_OPTIONS.outputRoot,
        absoluteTarget = DEFAULT_CFTD_OPTIONS.absoluteTarget,
        ignoreMissingSourceError = DEFAULT_CFTD_OPTIONS.ignoreMissingSourceError
      } = uniqList.item;

      const absSource = path.resolve(procCwd, source);

      const exists = await fsExtra.pathExists(absSource);

      if (!exists) {
        if (ignoreMissingSourceError) continue;

        errorCount++;

        if (loggerLevel !== "silent") {
          BUILD_LOGGER.ON_PROCESS_COPY_ERROR({
            copyFrom: source,
            index: uniqList.index,
            indexKey: "parameter",
            count: loggerLevel === "error" ? errorCount : count,
            actionName: "Failed to Copy File",
            errorReason: "the source file was not found"
          });
        }
      } else {
        const absTargetDir = path.resolve(
          procCwd,
          absoluteTarget ? "" : outputRoot,
          target
        );

        const absTargetFile = path.join(
          absTargetDir,
          fileName ?? path.basename(source)
        );

        await fsExtra.ensureDir(absTargetDir);

        await fsExtra.copy(absSource, absTargetFile);

        const relSrc = path.relative(procCwd, absSource).replace(/\\/g, "/");
        const relDest = path
          .relative(procCwd, absTargetFile)
          .replace(/\\/g, "/");

        if (canLog(loggerLevel, VERBOSE_LOG)) {
          BUILD_LOGGER.ON_PROCESS_COPY({
            actionName: "File copied",
            count,
            copyFrom: relSrc,
            copyTo: relDest
          });
        }
      }
    }

    const successCount = count - errorCount;

    if (
      (errorCount > 0 || duplicateCount > 0) &&
      loggerLevel !== "silent" &&
      !canLog(loggerLevel, VERBOSE_LOG)
    ) {
      console.log(
        buildCopySummary(
          successCount,
          errorCount,
          duplicateCount,
          "[Copy File to Dest]"
        )
      );
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (count > 0 && errorCount === 0 && duplicateCount === 0) {
        BUILD_LOGGER.ON_FINISH({
          textSuccess: "Successfully",
          actionName: "copied",
          count: count
        });
      } else if (successCount > 0) {
        console.log(
          buildCopySummary(
            successCount,
            errorCount,
            duplicateCount,
            "[Copy File to Dest]"
          )
        );
      } else if (successCount === 0 && errorCount !== 0) {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: '"Copy File"',
          reasonSkipAction: "failed",
          reasonEndText: `${count > 1 ? "all " : ""}files`,
          reasonType: "to",
          textDirectAction: "copy"
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: '"Copy File"',
          reasonSkipAction: errorCount > 0 ? "nothing found" : "nothing",
          reasonEndText: "copy"
        });
      }
    }
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        actionName: "Copying File",
        error
      });
    }
  }
}
