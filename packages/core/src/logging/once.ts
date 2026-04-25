import { isProdEnv } from "../env/node";

/** -------------------------------------------------------------------
 * * ***Logs an error message to the console **only once per unique message**
 * during the application lifecycle.***
 * --------------------------------------------------------------------
 *
 * - In **production environments**, this function is a no-op.
 * - In **non-production environments**, duplicate messages are suppressed
 *   using an internal `Set`.
 *
 * This utility is useful for avoiding noisy console output when the same
 * error condition can occur multiple times (e.g. repeated invalid usage).
 *
 * @param msg - The error message to log.
 *
 * @example
 * ```ts
 * logErrorOnce("Invalid prop `size`");
 * logErrorOnce("Invalid prop `size`"); // will not be logged again
 * ```
 */
let logErrorOnce = (_: string) => {};

if (!isProdEnv()) {
  const errors = new Set<string>();
  logErrorOnce = (msg: string) => {
    if (!errors.has(msg)) {
      console.error(msg);
    }
    errors.add(msg);
  };
}

/** -------------------------------------------------------------------
 * * ***Logs a warning message to the console **only once per unique message**
 * during the application lifecycle.***
 * --------------------------------------------------------------------
 *
 * - In **production environments**, this function is a no-op.
 * - In **non-production environments**, duplicate messages are suppressed
 *   using an internal `Set`.
 *
 * This is commonly used for non-fatal issues such as deprecated APIs,
 * unsafe patterns, or development-only notices.
 *
 * @param msg - The warning message to log.
 *
 * @example
 * ```ts
 * logWarnOnce("This API is deprecated");
 * logWarnOnce("This API is deprecated"); // will not be logged again
 * ```
 */
let logWarnOnce = (_: string) => {};

if (!isProdEnv()) {
  const warnings = new Set<string>();
  logWarnOnce = (msg: string) => {
    if (!warnings.has(msg)) {
      console.warn(msg);
    }
    warnings.add(msg);
  };
}

export { logErrorOnce, logWarnOnce };
