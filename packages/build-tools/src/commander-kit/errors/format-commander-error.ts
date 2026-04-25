import { CommanderError } from "commander";

/** ------------------------------------------------------------------------
 * * Formats a Commander error into a human-readable message.
 * ------------------------------------------------------------------------
 *
 * Converts an unknown error value into a formatted CLI-friendly
 * message string.
 *
 * If the value is a {@link CommanderError | `CommanderError`}, the message is extracted
 * directly from the error instance. Otherwise, the value is converted
 * to a string representation.
 *
 * This helper is typically used when rendering CLI error output before
 * terminating the process.
 *
 * ------------------------------------------------------------------------
 * #### Behavior
 * ------------------------------------------------------------------------
 *
 * - If the value is a {@link CommanderError | `CommanderError`}, returns `err.message`.
 * - Otherwise returns `String(err)`.
 *
 * ------------------------------------------------------------------------
 * @param err - The error value to format.
 *
 * @returns A human-readable message string.
 *
 * ------------------------------------------------------------------------
 * @example
 * ```ts
 * console.error(formatCommanderError(err));
 * process.exit(1);
 * ```
 */
export function formatCommanderError(err: unknown): string {
  if (err instanceof CommanderError) return err.message;

  return String(err);
}
