import "@rzl-zone/node-only";

import fs from "node:fs";
import path from "node:path";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

/** -------------------------------------------------------------------
 * * ***Validates a filesystem path for platform-specific restrictions.***
 * --------------------------------------------------------------------
 *
 * Throws a `TypeError` if the path is invalid or contains
 * disallowed characters for the current operating system.
 *
 * On Windows, the following characters are not allowed:
 * `< > : " | ? *`
 *
 * @param inputPath - The filesystem path to validate.
 *
 * @throws {TypeError} If `inputPath` is not a non-empty string.
 * @throws {Error} If the path contains invalid characters.
 *
 * @remarks
 * - Validation is platform-aware.
 * - Root segments (e.g. `C:\`) are excluded from validation.
 *
 * @example
 * ```ts
 * validatePath("dist/output/file.json");
 * ```
 */
export function validatePath(inputPath: string): void {
  if (!isNonEmptyString(inputPath)) {
    throw new TypeError(
      "validatePath: Parameter `inputPath` must be a non-empty string."
    );
  }

  if (process.platform === "win32") {
    const root = path.parse(inputPath).root;
    const withoutRoot = inputPath.replace(root, "");

    if (/[<>:"|?*]/.test(withoutRoot)) {
      const error = new Error(
        `Path contains invalid characters: ${inputPath}`
      ) as NodeJS.ErrnoException;

      error.code = "EINVAL";
      throw error;
    }
  }
}

type ModeOptions = {
  mode?: number;
};

/** -------------------------------------------------------------------
 * * ***Type guard for validating a filesystem permission mode value.***
 * -------------------------------------------------------------------
 *
 * Determines whether a value is considered a valid filesystem mode.
 *
 * - ***A value is considered valid if it:***
 *       - Is a number
 *       - Is an integer
 *       - Is greater than or equal to `0`
 *
 * @param value - The value to validate.
 *
 * @returns `true` if the value is a non-negative integer.
 *
 * @remarks
 * - This function performs structural validation only.
 * - It does not enforce an upper bound (e.g. `0o777`).
 * - It does not validate POSIX permission bit semantics.
 * - Intended for internal validation before passing values to `fs`.
 *
 * @example
 * ```ts
 * isValidMode(493); // true
 * isValidMode(0o755); // true
 * isValidMode(NaN);   // false
 * isValidMode(-1);    // false
 * ```
 */
export function isValidMode(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/** -------------------------------------------------------------------
 * * ***Resolves and validates a filesystem permission mode.***
 * -------------------------------------------------------------------
 *
 * Resolves the provided `options` into a numeric filesystem mode
 * and performs runtime validation.
 *
 * - ***Accepts either:***
 *       - A numeric mode directly
 *       - An object containing a `mode` property
 *
 * If no mode is provided, defaults to `0o777` (`511`).
 *
 * @param options - A numeric mode or an options object containing `mode`.
 *
 * @returns A validated non-negative finite integer representing the filesystem mode.
 *
 * @throws {TypeError} If the resolved mode is not a non-negative finite integer.
 *
 * @remarks
 * - This function validates only that the value is a non-negative finite integer.
 * - It does not enforce an upper bound (e.g. `0o777`).
 * - It does not validate POSIX permission bit semantics.
 * - Designed for internal use within filesystem utilities.
 *
 * @example
 * ```ts
 * getMode(0o755);           // 493
 * getMode({ mode: 0o700 }); // 448
 * getMode();                // 511 (0o777)
 * ```
 */
export function getMode(options?: number | ModeOptions): number {
  const mode = typeof options === "number" ? options : (options?.mode ?? 0o777);

  if (!isValidMode(mode)) {
    throw new TypeError(
      "Invalid `mode`: expected a non-negative finite integer."
    );
  }

  return mode;
}

type EnsureParentDirOptions = ModeOptions;

/** -------------------------------------------------------------------
 * * ***Ensures that the parent directory of a file path exists.***
 * --------------------------------------------------------------------
 *
 * Ensures the directory tree exists by creating it recursively
 * if necessary, calling this function multiple times is safe.
 *
 * Intended for **Node.js-only environments**, typically used before
 * writing files to disk to prevent `ENOENT` errors.
 *
 * @param filePath - The file path whose parent directory must exist.
 *
 * @remarks
 * - Accepts both relative and absolute paths.
 * - The operation is idempotent.
 * - Propagates filesystem errors if directory creation fails.
 *
 * @example
 * ```ts
 * ensureParentDir("dist/output/result.json");
 * fs.writeFileSync("dist/output/result.json", "{}");
 * ```
 */
export function ensureParentDir(
  filePath: string,
  options?: number | EnsureParentDirOptions
): void {
  if (!isNonEmptyString(filePath)) {
    throw new TypeError(
      "ensureParentDir: Parameter `filePath` must be a non-empty string."
    );
  }

  validatePath(filePath);

  const dir = path.dirname(filePath);

  fs.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true
  });
}
