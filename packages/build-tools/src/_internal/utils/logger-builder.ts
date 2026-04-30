import "@rzl-zone/node-only";

import type { AnyString } from "@/_internal/types/extra";

import { isDeepStrictEqual } from "node:util";

import {
  isError,
  isNonEmptyString,
  isNumber,
  normalizeSpaces
} from "@/_internal/utils/helper";

import {
  formatOptionValue,
  joinLines,
  picocolors
} from "@/utils/helper/formatter";
import { ICONS } from "@/utils/helper/icons";

/** -------------------------------------------------------------------
 * * ***Determines whether an option value comes from the default configuration
 * or has been explicitly overridden by the user.***
 * -------------------------------------------------------------------
 *
 * This utility is primarily intended for logging and debugging purposes,
 * especially in CLI tools or build pipelines where distinguishing between
 * default and user-provided values is important.
 *
 * The comparison is performed using `Object.is` to ensure accurate detection,
 * including edge cases such as:
 * - `NaN` vs `NaN`.
 * - `-0` vs `+0`.
 *
 * @template T - The type of the option value being compared.
 *
 * @param {unknown} value - The actual value used at runtime.
 * @param {unknown} defaultValue - The default value defined by the tool.
 *
 * @returns
 * A string indicating the source of the value:
 *
 * - `"default"` when `value` is strictly equal to `defaultValue`.
 * - `"overridden"` when the value differs from the default.
 *
 * @example
 * ```ts
 * sourceOf("dist", "dist"); // ➔ "default"
 * sourceOf("dist/types", "dist"); // ➔ "overridden"
 * ```
 *
 * @example
 * ***CLI-style option logging:***
 * ```ts
 * BUILD_LOGGER.OPTIONS(
 *   "outDir",
 *   outDir,
 *   sourceOf(outDir, DEFAULTS.outDir)
 * );
 * ```
 */
export const sourceOf = <T>(
  value: T,
  defaultValue: T
): "default" | "overridden" => {
  return Object.is(value, defaultValue) ? "default" : "overridden";
};

/** ----------------------------------------------------------------
 * * ***Deep default source detector.***
 * ----------------------------------------------------------------
 *
 * Determines whether a given value is structurally identical
 * to its default value using deep comparison.
 *
 * Unlike `Object.is`, this utility compares object contents
 * recursively rather than checking reference identity.
 *
 * Intended for configuration systems where option objects
 * may be cloned or reconstructed but still represent the
 * default state.
 *
 * @template T - Value type being compared.
 *
 * @param value - Current runtime value.
 * @param defaultValue - Default reference value.
 *
 * @returns
 * - `"default"` ➔ If values are deeply equal.
 * - `"overridden"` ➔ If values differ.
 *
 * @example
 * ```ts
 * sourceOfIsDeepStrictEqual(
 *   { onlyFiles: true },
 *   { onlyFiles: true }
 * );
 * // "default"
 * ```
 */
export const sourceOfIsDeepStrictEqual = <T>(
  value: T,
  defaultValue: T
): "default" | "overridden" => {
  return isDeepStrictEqual(value, defaultValue) ? "default" : "overridden";
};

/** -------------------------------------------------------------------
 * * ***Structured build-time console logger with consistent formatting,
 * icons, and colorized output.***
 * --------------------------------------------------------------------
 *
 * `BUILD_LOGGER` provides a collection of standardized logging helpers
 * intended for **CLI tools, build scripts, and Node.js-based workflows**.
 *
 * - **It ensures:**
 *      - Consistent log structure across different build phases.
 *      - Clear visual distinction between states (start, success, skip, error).
 *      - Emoji or ASCII icon support depending on environment configuration.
 *      - Readable, colorized output via `picocolors`.
 *
 * Emoji usage is controlled via the environment variable:
 *
 * ```
 * FORCE_EMOJI=1
 * ```
 *
 * When disabled, all icons gracefully fall back to ASCII-safe symbols.
 *
 * ---
 *
 * - **Behavior:**
 *      - Uses emoji icons when `FORCE_EMOJI === "1"`.
 *      - Falls back to ASCII symbols otherwise.
 *      - Applies consistent spacing, bulleting, and indentation.
 *      - Formats messages using `picocolors` for visibility.
 *      - Safely extracts error messages from unknown error values.
 *
 * ---
 *
 * - **Available log actions:**
 *      - `SOURCE_OF`:
 *         - See {@link sourceOf | **`sourceOf`**} helpers.
 *
 *      - `OPTIONS({ label, value, source, isRequired })`:
 *         - Logs the options argument function using
 *        {@link sourceOf | **`sourceOf`**} helper.
 *
 *      - `NEW_LINE()`:
 *         - *Inserts an empty line in the console output.*
 *
 *      - `ON_STARTING({ actionName })`:
 *         - *Logs the start of a build or processing action.*
 *
 *      - `ON_FINISH({ actionName, count })`:
 *         - *Logs successful completion with item count.*
 *
 *      - `ON_SKIPPING({ actionName, reasonEndText })`:
 *         - *Logs skipped actions with human-readable reasons.*
 *
 *      - `ON_ERROR({ actionName, error })`:
 *         - *Logs formatted error output with extracted message.*
 *
 *      - `ON_PROCESS_COPY({ actionName, copyFrom, copyTo })`:
 *         - *Logs file copy operations.*
 *
 *      - `ON_PROCESS({ actionName, nameDirect })`:
 *         - *Logs generic processing steps.*
 *
 *      - `ON_PROCESS_REFERENCING({ actionName, referenceFrom, referenceTo })`:
 *         - *Logs reference or linking operations.*
 *
 * ---
 *
 * This logger is intentionally **side-effectful** and writes directly
 * to `console.log` / `console.error`.
 *
 * It is designed for **human-readable output**, not structured logging
 * or machine parsing.
 */
export const BUILD_LOGGER = {
  /** -------------------------------------------------------------------
   * * ***Determines whether an option value comes from the default configuration
   * or has been explicitly overridden by the user.***
   * -------------------------------------------------------------------
   *
   * This utility is primarily intended for logging and debugging purposes,
   * especially in CLI tools or build pipelines where distinguishing between
   * default and user-provided values is important.
   *
   * The comparison is performed using `Object.is` to ensure accurate detection,
   * including edge cases such as:
   * - `NaN` vs `NaN`.
   * - `-0` vs `+0`.
   *
   * @template T - The type of the option value being compared.
   *
   * @param value - The actual value used at runtime.
   * @param defaultValue - The default value defined by the tool.
   *
   * @returns
   * A colorized string indicating the source of the value:
   *
   * - `"default"` when `value` is strictly equal to `defaultValue`.
   * - `"overridden"` when the value differs from the default.
   *
   * @example
   * ```ts
   * BUILD_LOGGER.SOURCE_OF("dist", "dist"); // ➔ "default"
   * BUILD_LOGGER.SOURCE_OF("dist/types", "dist"); // ➔ "overridden"
   * ```
   *
   * @example
   * ***CLI-style option logging:***
   * ```ts
   * BUILD_LOGGER.OPTIONS(
   *   "outDir",
   *   outDir,
   *   BUILD_LOGGER.SOURCE_OF(outDir, DEFAULTS.outDir)
   * );
   * ```
   */
  SOURCE_OF: sourceOf,
  /** -------------------------------------------------------------------
   * * ***Logs a single option entry in a formatted, human-readable CLI style.***
   * -------------------------------------------------------------------
   *
   * This helper is used to display resolved configuration values along with
   * their origin (default or overridden), making it easier to debug and
   * understand how final options are derived.
   *
   * - **Output format example:**
   *      ```bash
   *       - outDir: dist/types (overridden)
   *       - withExportTypes: false (default)
   *       - inputDirReference: dist
   *      ```
   *
   * - **Formatting rules:**
   *      - Indented with a leading dash (`-`).
   *      - Label is rendered in **bold**.
   *      - Value is rendered in **cyan**.
   *      - Source indicator (`default` / `overridden`) is **dimmed**.
   *      - Arrays are stringified using a stable JSON formatter.
   *      - When an option is marked as required, the source indicator is omitted.
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stdout`.
   *
   * @param {string} label - Human-readable option name
   * (e.g. `"outDir"`, `"withExportTypes"`, `"inputDirReference"`).
   *
   * @param {unknown} value - The resolved option value to display.
   * Can be of any type; arrays are stringified automatically.
   *
   * @param {"default" | "overridden" | ({} & string)} source - A value indicating whether the option comes from
   * the default configuration or was overridden by user input, typically
   * produced by {@link sourceOf | **`sourceOf`**}.
   *
   * @param {boolean | undefined} isRequired - When set to `true`, marks
   * the option as required and suppresses the source indicator in the output,
   * defaults to `false`.
   *
   * @example
   * ```ts
   * OPTIONS(
   *   "outDir",
   *   outDir,
   *   sourceOf(outDir, DEFAULTS.outDir)
   * );
   * ```
   *
   * @example
   * Logging multiple options.
   * ```ts
   * OPTIONS(
   *  "outFileName",
   *  outFileName,
   *  sourceOf(outFileName, DEFAULTS.outFileName)
   * );
   * OPTIONS(
   *  "inputDirReference",
   *  inputDirReference,
   *  sourceOf(inputDirReference, DEFAULTS.inputDirReference)
   * );
   * OPTIONS(
   *  "withExportTypes",
   *  withExportTypes,
   *  sourceOf(withExportTypes, DEFAULTS.withExportTypes)
   * );
   * ```
   *
   * @example
   * Logging a required option.
   * ```ts
   * OPTIONS(
   *  "input",
   *  inputPath,
   *  sourceOf(inputPath, undefined),
   *  true
   * );
   * ```
   */
  OPTIONS(
    label: string,
    value: unknown,
    source: ReturnType<typeof sourceOf> | AnyString,
    isRequired?: boolean
  ) {
    const sourceLabel =
      !isRequired && source
        ? source === "default"
          ? picocolors.blueBright(` (${source})`)
          : picocolors.yellowBright(` (${source})`)
        : "";

    console.log(
      picocolors.dim("  - ") +
        normalizeSpaces(
          picocolors.bold(label || "`⚠️ Label Unset!!!`") +
            picocolors.dim(": ") +
            formatOptionValue(value) +
            picocolors.italic(sourceLabel)
        )
    );
  },
  /** -------------------------------------------------------------------
   * * ***Logs a subsection title for grouped log output.***
   * -------------------------------------------------------------------
   *
   * Used to visually separate logical blocks such as:
   * - Arguments.
   * - Options.
   * - Configuration.
   * - Resolved Values.
   *
   * This improves readability when logging many related entries.
   *
   * @param {string} title - Section title text (e.g. "Options", "Arguments").
   * @param {{ icon?: string; indent?: string; }} options - Optional icon override.
   *
   * @example
   * ```ts
   * BUILD_LOGGER.SECTION("Options");
   * BUILD_LOGGER.SECTION("Arguments", { icon: ICONS.folder });
   * ```
   */
  SECTION(title: string, options: LoggerBuilderSection = {}) {
    const { icon = ICONS.config, indent = "" } = options;

    console.log(
      picocolors.bold(
        `${indent}${picocolors.whiteBright(icon)} ${picocolors.underline(picocolors.cyanBright(title || "`⚠️ Unset Title!!!`"))}:`
      )
    );
  },
  /** -------------------------------------------------------------------
   * * ***Prints a single empty line to the console.***
   * -------------------------------------------------------------------
   *
   * Writes a newline to standard output, typically used as a visual
   * separator between log sections to improve CLI readability.
   *
   * If a string value is provided, it will be printed instead of an
   * empty line.
   *
   * @param {string} [value=""] - Optional text to print. Defaults to an
   * empty string, resulting in a blank line.
   *
   * @example
   * ```ts
   * BUILD_LOGGER.NEW_LINE();
   * ```
   *
   * @example
   * ```ts
   * BUILD_LOGGER.NEW_LINE(" ");
   * ```
   */
  NEW_LINE(value: string = "") {
    return console.log(value);
  },
  /** -------------------------------------------------------------------
   * * ***Logs a starting action message.***
   * -------------------------------------------------------------------
   *
   * Used to indicate that a process or action has just started.
   * Typically printed once before any processing begins.
   *
   * - **Output format example:**
   *      ```bash
   *       ▶ Starting to generate-types.
   *      ```
   *
   * - **Formatting rules:**
   *      - Start icon is displayed.
   *      - "Starting" keyword is highlighted.
   *      - Action name is underlined and colored.
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stdout`.
   *
   * @example
   * ```ts
   * BUILD_LOGGER.ON_STARTING({ actionName: "build references" });
   * ```
   */
  ON_STARTING: (options: LoggerBuilderOnStarting) => {
    const { actionName, textDirectAction = "to" } = options;

    console.log(
      picocolors.bold(
        `${picocolors.whiteBright(ICONS.start)} ${picocolors.cyanBright(
          "Starting"
        )} ${normalizeSpaces(`${textDirectAction} ${picocolors.underline(picocolors.blueBright(actionName))}`)}.`
      )
    );
  },
  /** -------------------------------------------------------------------
   * * ***Logs a successful completion message.***
   * -------------------------------------------------------------------
   *
   * Used to indicate that an action has finished successfully,
   * including a summary count of processed items.
   *
   * - **Output format example:**
   *      ```bash
   *       ✔ Success generate-types (12 files).
   *      ```
   *
   * - **Formatting rules:**
   *      - Success icon and green highlight.
   *      - Action name is underlined.
   *      - Count is highlighted in yellow.
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stdout`.
   *
   * @example
   * ```ts
   * BUILD_LOGGER.ON_FINISH({
   *   actionName: "generate references",
   *   count: 5
   * });
   * ```
   */
  ON_FINISH: (options: LoggerBuilderOnFinish) => {
    const {
      actionName,
      count,
      typeCount = "file",
      progress,
      textSuccess = "Success"
    } = options;

    console.log(
      picocolors.bold(
        `${picocolors.greenBright(ICONS.success)} ${picocolors.greenBright(textSuccess)} ${normalizeSpaces(
          `${picocolors.underline(
            picocolors.blueBright(actionName)
          )} (${picocolors.yellowBright(`${isNonEmptyString(progress) ? progress : count} ${typeCount}${count > 1 ? "(s)" : ""}`)}`
        )}).`
      )
    );
  },
  /** -------------------------------------------------------------------
   * * ***Logs a skipped action with a detailed reason.***
   * -------------------------------------------------------------------
   *
   * Used when an action is intentionally skipped due to
   * unmet conditions or no remaining work.
   *
   * - **Output format example:**
   *      ```bash
   *       ⚠ Skipping generate-types because nothing left files to process.
   *      ```
   *
   * - **Formatting rules:**
   *      - Warning icon with yellow highlight.
   *      - Action name is underlined.
   *      - Skip reason is emphasized in red.
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stdout`.
   *
   * @example
   * ```ts
   * BUILD_LOGGER.ON_SKIPPING({
   *   actionName: "generate references",
   *   reasonEndText: "process"
   * });
   * ```
   */
  ON_SKIPPING: (options: LoggerBuilderOnSkipping) => {
    const {
      actionName,
      reasonEndText,
      reasonSkipAction = "nothing left",
      reasonTitle = "because",
      reasonType = "files",
      textDirectAction = "to"
    } = options;

    console.log(
      picocolors.bold(
        `${picocolors.yellowBright(ICONS.warn)} ${picocolors.yellowBright("Skipping")} ${normalizeSpaces(
          `${picocolors.underline(
            picocolors.blueBright(actionName)
          )} ${picocolors.white(reasonTitle)} ${picocolors.redBright(
            reasonSkipAction
          )} ${reasonType} ${textDirectAction} ${picocolors.redBright(reasonEndText)}`
        )}.`
      )
    );
  },
  /** -------------------------------------------------------------------
   * * ***Logs an error occurring during an action.***
   * -------------------------------------------------------------------
   *
   * Used to report fatal or recoverable errors during execution.
   * Automatically extracts the message from an `Error` instance.
   *
   * - **Output format example:**
   *      ```bash
   *       ✖ Error to generate-types,
   *          ➜ Something went wrong
   *      ```
   *
   * - **Formatting rules:**
   *      - Error icon and red highlight.
   *      - Action name is underlined.
   *      - Error message is inverted for emphasis.
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stderr`.
   *
   * @example
   * ```ts
   * BUILD_LOGGER.ON_ERROR({
   *   actionName: "copy files",
   *   error: err
   * });
   * ```
   */
  ON_ERROR: (options: LoggerBuilderOnError) => {
    const { actionName, textDirectAction = "to", error } = options;

    const errorMsg = isError(error) ? error.message : "Something went wrong";

    console.error(
      picocolors.bold(
        `${picocolors.redBright(ICONS.error)} ${picocolors.redBright("Error")} ${normalizeSpaces(
          `${textDirectAction} ${picocolors.underline(picocolors.blueBright(actionName))},`
        )} ${joinLines("because: ", "", `  ${picocolors.bold(picocolors.red(ICONS.arrowRight))} ${picocolors.inverse(picocolors.red(normalizeSpaces(errorMsg)))}`)}`
      )
    );
  },
  /** -------------------------------------------------------------------
   * * ***Logs a generic processing step.***
   * -------------------------------------------------------------------
   *
   * Used for logging step-by-step progress inside a process,
   * typically for folders or grouped actions.
   *
   * - **Output format example:**
   *      ```bash
   *       • 2. Generating in dist/types.
   *      ```
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stdout`.
   */
  ON_PROCESS: (options: LoggerBuilderOnProcess) => {
    const { actionName, count, nameDirect, textDirectFolder = "in" } = options;

    console.log(
      `${picocolors.bold("  " + picocolors.whiteBright(ICONS.bullet))} ${picocolors.italic(
        `${picocolors.white(count + ".")} ${normalizeSpaces(
          `${picocolors.white(actionName)} ${picocolors.magentaBright(
            textDirectFolder
          )} ${picocolors.bold(picocolors.underline(picocolors.blue(nameDirect)))}.`
        )}`
      )}`
    );
  },
  /** -------------------------------------------------------------------
   * * ***Logs a copy process entry.***
   * -------------------------------------------------------------------
   *
   * Used to log a file or directory copy operation as part
   * of a larger process.
   *
   * - **Output format example:**
   *      ```bash
   *       • 1. Copy from 'src/types' ➔ 'dist/types'.
   *      ```
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stdout`.
   */
  ON_PROCESS_COPY: (options: LoggerBuilderOnProcessCopy) => {
    const {
      actionName,
      count,
      copyTo,
      copyFrom,
      textFrom = "from",
      textArrow = "➔"
    } = options;

    console.log(
      `${picocolors.bold("  " + picocolors.whiteBright(ICONS.bullet))} ${picocolors.italic(
        `${picocolors.white(count + ".")} ${normalizeSpaces(
          `${picocolors.white(actionName)} ${picocolors.yellow(
            textFrom
          )} '${picocolors.bold(picocolors.underline(picocolors.cyanBright(copyFrom)))}' ${picocolors.bold(
            picocolors.gray(textArrow)
          )} '${picocolors.bold(picocolors.underline(picocolors.cyanBright(copyTo)))}'.`
        )}`
      )}`
    );
  },
  /** -------------------------------------------------------------------
   * * ***Logs a copy process entry.***
   * -------------------------------------------------------------------
   *
   * Used to log a file or directory copy operation as part
   * of a larger process.
   *
   * - **Output format example:**
   *      ```bash
   *       • 1. Failed Copying from 'src/types' because source file not found.
   *      ```
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stdout`.
   */
  ON_PROCESS_COPY_ERROR: (options: LoggerBuilderOnProcessCopyError) => {
    const {
      actionName,
      count,
      errorReason,
      copyFrom,
      index,
      indexKey,
      textFrom = "from",
      textReason = "because"
    } = options;

    const errorReasonText = isError(errorReason)
      ? errorReason.message
      : String(errorReason);

    const atIndexText = isNumber(index)
      ? picocolors.blueBright(
          ` (at${isNonEmptyString(indexKey) ? ` '${indexKey}' ` : " "}index: ${picocolors.magentaBright(index)}) `
        )
      : " ";

    console.log(
      `${picocolors.bold("  " + picocolors.whiteBright(ICONS.bullet))} ${picocolors.italic(
        `${picocolors.white(count + ".")} ${normalizeSpaces(
          `${picocolors.redBright(actionName)} ${picocolors.yellow(
            textFrom
          )} '${picocolors.bold(picocolors.underline(picocolors.cyanBright(copyFrom)))}'${atIndexText}${picocolors.bold(
            picocolors.gray(textReason)
          )} ${picocolors.redBright(errorReasonText)}.`
        )}`
      )}`
    );
  },
  /** -------------------------------------------------------------------
   * * ***Logs a reference linking process.***
   * -------------------------------------------------------------------
   *
   * Used to indicate that a reference is being created
   * from one location to another.
   *
   * - **Output format example:**
   *      ```bash
   *        • 3. Referencing from src/index.ts ➔ dist/index.d.ts.
   *      ```
   *
   * This function performs **no mutation** and has **no side effects**
   * other than writing to `stdout`.
   */
  ON_PROCESS_REFERENCING: (options: LoggerBuilderOnProcessReferencing) => {
    const {
      actionName,
      count,
      referenceTo,
      referenceFrom,
      textFrom = "from",
      textArrow = "➔"
    } = options;

    console.log(
      `${picocolors.bold("  " + picocolors.whiteBright(ICONS.bullet))} ${picocolors.italic(
        `${picocolors.white(count + ".")} ${normalizeSpaces(
          `${picocolors.white(actionName)} ${picocolors.magentaBright(
            textFrom
          )} ${picocolors.bold(picocolors.underline(picocolors.cyanBright(referenceFrom)))} ${picocolors.bold(
            picocolors.gray(textArrow)
          )} ${picocolors.bold(picocolors.underline(picocolors.blueBright(referenceTo)))}.`
        )}`
      )}`
    );
  }
};

type LoggerBuilderSection = {
  /**
   * @default ICON.config
   */
  icon?: string;
  /**
   * @default ""
   */
  indent?: string;
};
type LoggerBuilderOnStarting = {
  /** The name of the action being started.
   *
   * @default
   * undefined
   */
  actionName: string;
  /** Connector word used before the action name.
   *
   * @default
   * "to"
   */
  textDirectAction?: string;
};
type LoggerBuilderOnFinish = {
  /** The name of the completed action.
   *
   * @default
   * undefined
   */
  actionName: string;
  /** The success text.
   *
   * @default
   * @default "Success"
   */
  textSuccess?: string;
  /** Label for the count unit.
   *
   * @default
   * "file"
   */
  typeCount?: string;
  /** Number of processed items.
   *
   * @default
   * undefined
   */
  count: number;
  /** Progress of processed items (e.g. `2/7`).
   *
   * Represents how many items have been processed relative to the total.
   *
   * @example
   * "2/7"
   */
  progress?: string;
};
type LoggerBuilderOnSkipping = {
  /** The name of the skipped action.
   *
   * @default
   * undefined
   */
  actionName: string;
  /** Connector word explaining the reason.
   *
   * @default
   * "because"
   */
  reasonTitle?: string;
  /** Short reason phrase.
   *
   * @default
   * "nothing left"
   */
  reasonSkipAction?: string;
  /** Contextual explanation for the skip.
   *
   * @default
   * undefined
   */
  reasonEndText: string;
  /** Type of resource involved.
   *
   * @default
   * "files"
   */
  reasonType?: string;
  /** Connector word before the target.
   *
   * @default
   * "to"
   */
  textDirectAction?: string;
};
type LoggerBuilderOnError = {
  /** The name of the action that failed.
   *
   * @default
   * undefined
   */
  actionName: string;
  /** Connector word before the action name.
   *
   * @default
   * "to"
   */
  textDirectAction?: string;
  /** Unknown error object or `Error` instance.
   *
   */
  error: unknown;
};
type LoggerBuilderOnProcess = {
  /** Description of the process.
   *
   * @default
   * undefined
   */
  actionName: string;
  /** Sequence number.
   *
   * @default
   * undefined
   */
  count: number;
  /** Connector word before the target.
   *
   * @default
   * "in"
   */
  textDirectFolder?: string;
  /** Target name or location.
   *
   * @default
   * undefined
   */
  nameDirect: string;
};
type LoggerBuilderOnProcessCopy = {
  /** The name of the action being the copy action.
   *
   * @default
   * undefined
   */
  actionName: string;
  /** Sequence number of the process.
   *
   * @default
   * undefined
   */
  count: number;
  /** Connector text before source path.
   *
   * @default
   * "from"
   */
  textFrom?: string;
  /** Source path.
   *
   * @default
   * undefined
   */
  copyFrom: string;
  /** Destination path.
   *
   * @default
   * undefined
   */
  copyTo: string;
  /** Arrow symbol between paths.
   *
   * @default
   * "➔"
   */
  textArrow?: string;
};
type LoggerBuilderOnProcessCopyError = {
  /** The name of the action being the error copy action.
   *
   * @default
   * undefined
   */
  actionName: string;
  /** Sequence number of the process.
   *
   * @default
   * undefined
   */
  count: number;
  /** Index number parameter.
   *
   * @default
   * undefined
   */
  index?: number;
  /** Index key name for parameter.
   *
   * @default
   * undefined
   */
  indexKey?: string;
  /** Connector text before source path.
   *
   * @default
   * "from"
   */
  textFrom?: string;
  /** Source path.
   *
   * @default
   * undefined
   */
  copyFrom: string;
  /** The reason error on copying.
   *
   * @default
   * undefined
   */
  errorReason: string | Error;
  /** Connector word explaining the reason.
   *
   * @default
   * "because"
   */
  textReason?: string;
};
type LoggerBuilderOnProcessReferencing = {
  /** The name of the action being the referencing action.
   *
   * @default
   * undefined
   */
  actionName: string;
  /** Sequence number.
   *
   * @default
   * undefined
   */
  count: number;
  /** Connector text before source.
   *
   * @default
   * "from"
   */
  textFrom?: string;
  /** Source reference path.
   *
   * @default
   * undefined
   */
  referenceFrom: string;
  /** Target reference path.
   *
   * @default
   * undefined
   */
  referenceTo: string;
  /** Arrow symbol between references.
   *
   * @default
   * "➔"
   */
  textArrow?: string;
};
