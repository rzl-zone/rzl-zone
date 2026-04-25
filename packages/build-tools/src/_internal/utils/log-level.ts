import type { LoggingOptions, LogLevel } from "@/types";

import { isArray, isString } from "./helper";

/** ----------------------------------------------------------------
 * * ***Type guard to check if a value is a valid LogLevel.***
 * ----------------------------------------------------------------
 *
 * Checks if the given `value` is a string and corresponds to one
 * of the valid log levels defined in `LOG_LEVEL_PRIORITY`.
 *
 * - **Valid log levels:**
 *    - `"silent"`.
 *    - `"error"`.
 *    - `"info"`.
 *    - `"debug"`.
 *
 * @param value - The value to check.
 * @returns `true` if `value` is a valid `LogLevel`, `false` otherwise.
 *
 * @example
 * ```ts
 * isLogLevel("info"); // ➔ true
 * isLogLevel("verbose"); // ➔ false
 * isLogLevel(123); // ➔ false
 * ```
 *
 * @internal
 */
export function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === "string" && value in LOG_LEVEL_PRIORITY;
}

/** ----------------------------------------------------------------
 * * ***Default log level constant.***
 * ----------------------------------------------------------------
 *
 * Defines the default log level to be used when no explicit log level
 * is provided or fallback values are invalid.
 *
 * - Value: `"info"`.
 * - Guaranteed to be a valid `LogLevel`.
 *
 * @internal
 */
export const DEFAULT_LOG_LEVEL = "info" satisfies LogLevel;

/** ----------------------------------------------------------------
 * * ***Verbose log levels array.***
 * ----------------------------------------------------------------
 *
 * Defines log levels considered verbose for more detailed logging.
 *
 * - Includes: `"info"` and `"debug"`.
 * - Used for enabling detailed log output in verbose modes.
 * - Readonly tuple of type `readonly LogLevel[]`.
 *
 * @internal
 */
export const VERBOSE_LOG = ["info", "debug"] as const;

/** ----------------------------------------------------------------
 * * ***Log level priority mapping.***
 * ----------------------------------------------------------------
 *
 * @internal
 */
export const LOG_LEVEL_PRIORITY = Object.freeze({
  silent: 0,
  error: 1,
  info: 2,
  debug: 3
});

/** ----------------------------------------------------------------
 * * ***Resolves the effective log verbosity level.***
 * ----------------------------------------------------------------
 *
 * Resolves the final log level used by the logger in a **fully defensive**
 * manner.
 *
 * - **Behavior:**
 *    - Uses the user-provided `logLevel` **only if it is a valid `LogLevel`**.
 *    - Falls back when:
 *      - `logLevel` is `undefined`.
 *      - `logLevel` is invalid or unsupported.
 *
 * - **Fallback guarantees:**
 *    - If the provided `fallback` is **also invalid**, the resolver
 *      **forcibly falls back to the built-in default** (`"info"`).
 *    - This ensures the logger **never operates with an invalid log level**.
 *
 * - **Resolution order (highest priority ➔ lowest):**
 *    1. Valid public option (`options.logLevel`).
 *    2. Valid fallback parameter (`fallback`).
 *    3. Built-in default (`"info"`).
 *
 * @remarks
 * This function is intentionally strict to prevent misconfiguration
 * from silencing logs or breaking log-level comparisons at runtime.
 *
 * @internal
 */
export function resolveLogVerbosity(
  options?: LoggingOptions,
  fallback: LogLevel = DEFAULT_LOG_LEVEL
): LogLevel {
  const input = options?.logLevel;

  if (isLogLevel(input)) return input;

  return isLogLevel(fallback) ? fallback : DEFAULT_LOG_LEVEL;
}

/** ----------------------------------------------------------------
 * * ***Checks whether a log at a given level should be emitted.***
 * ----------------------------------------------------------------
 *
 * Determines whether a log message should be emitted based on
 * the **resolved current log verbosity level**.
 *
 * - **Behavior:**
 *    - Supports a single target level or multiple target levels.
 *    - The `current` level is used **only if it is a valid `LogLevel`**.
 *    - When `current` is invalid:
 *        - Falls back to `fallbackIfInvalid`.
 *        - If `fallbackIfInvalid` is also invalid, it is **forcibly**
 *          resolved to the built-in default (`"info"`).
 *
 * - **Emission rule:**
 *    - A log is emitted when the resolved current level's priority
 *      is **greater than or equal to** any of the target level priorities.
 *
 * - **Guarantees:**
 *    - This function **never compares invalid log levels**.
 *    - Priority lookup is always safe and deterministic.
 *
 * @remarks
 * This strict resolution prevents misconfiguration from silently
 * disabling logs or causing invalid priority comparisons.
 *
 * @internal
 */
export function canLog(
  current: LogLevel,
  target: LogLevel | readonly LogLevel[],
  fallbackIfInvalid: LogLevel = DEFAULT_LOG_LEVEL
): boolean {
  const fallbackLog = isLogLevel(fallbackIfInvalid)
    ? fallbackIfInvalid
    : DEFAULT_LOG_LEVEL;
  const resolvedCurrent: LogLevel = isLogLevel(current) ? current : fallbackLog;

  const targets = isString(target)
    ? [target]
    : isArray(target)
      ? target
      : [fallbackLog];

  return targets.some(
    (level) => LOG_LEVEL_PRIORITY[resolvedCurrent] >= LOG_LEVEL_PRIORITY[level]
  );
}
