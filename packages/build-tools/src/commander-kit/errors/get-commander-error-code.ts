import type { CommanderErrorCode } from "@/commander-kit/types";

import { CommanderError } from "commander";

/** ------------------------------------------------------------------------
 * * Extracts the Commander error code from an unknown value.
 * ------------------------------------------------------------------------
 *
 * Safely resolves the {@link CommanderErrorCode | `CommanderErrorCode`} from a value that may
 * or may not be a {@link CommanderError | `CommanderError`}.
 *
 * This helper is useful when handling errors originating from the
 * Commander CLI runtime, where the error code indicates the type of
 * internal CLI condition (for example help display or version output).
 *
 * If the provided value is not a {@link CommanderError | `CommanderError`}, `null`
 * is returned.
 *
 * ------------------------------------------------------------------------
 * #### Behavior
 * ------------------------------------------------------------------------
 *
 * - Returns the narrowed {@link CommanderErrorCode | `CommanderErrorCode`} if the value is a
 *   {@link CommanderError | `CommanderError`}.
 * - Returns `null` for all other values.
 *
 * ------------------------------------------------------------------------
 * @param err - The value to inspect.
 *
 * @returns The resolved {@link CommanderErrorCode | `CommanderErrorCode`}, or `null`
 * if the value is not a {@link CommanderError | `CommanderError`}.
 *
 * ------------------------------------------------------------------------
 * @example
 * ```ts
 * const code = getCommanderErrorCode(err);
 *
 * if (code) {
 *   return code;
 * }
 * ```
 */
export function getCommanderErrorCode(err: unknown): CommanderErrorCode | null {
  if (err instanceof CommanderError) return err.code;

  return null;
}
