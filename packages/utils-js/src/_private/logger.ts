type MessageType = "warn" | "error" | "info";

const PACKAGE_NAME = "@rzl-zone/utils-js";

/** -----------------------------------------------------------------------------
 * * ***Internal Utility: `createMessage`.***
 * ------------------------------------------------------------------------------
 * **Formats a package-scoped message with an optional message type and source.**
 *
 * ---
 * Supported values:
 * - `"warn"` ➔ warning message
 * - `"error"` ➔ error message
 * - `"info"` ➔ informational message
 *
 * ---
 * @param {string} source
 * The utility or API name that generated the message.
 *
 * @param {string} message
 * The message content to format.
 *
 * @param {MessageType} [type]
 * Optional message category to prepend.
 *
 * ---
 * @returns {string}
 * A formatted message string containing:
 * - package name
 * - optional message type
 * - source utility/API name
 * - message content
 *
 * ---
 * @example
 * ```ts
 * createMessage(
 *   "isNonEmptyString",
 *   "Expected a non-empty string."
 * );
 * // ➔ "([@rzl-zone/utils-js] - [isNonEmptyString]) Expected a non-empty string."
 *
 * createMessage(
 *   "isNonEmptyString",
 *   "`trim` must be a boolean. Using default value.",
 *   "warn"
 * );
 * // ➔ "[warn] ([@rzl-zone/utils-js] - [isNonEmptyString]) `trim` must be a boolean. Using default value."
 *
 * createMessage(
 *   "formatEnvPort",
 *   "Expected port to be a string.",
 *   "error"
 * );
 * // ➔ "[error] ([@rzl-zone/utils-js] - [formatEnvPort]) Expected port to be a string."
 * ```
 *
 * ---
 * @internal ***`Not part of the public API.`***
 */
export function createMessage(
  source: string,
  message: string,
  type?: MessageType
): string {
  source = source.trim();
  message = message.trim();

  const parts = [
    type && `[${type}]`,
    `([${PACKAGE_NAME}]`,
    "-",
    `[${source}])`,
    message
  ];

  return parts.filter(Boolean).join(" ");
}
