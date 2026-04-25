import type { CommandContext } from "@/commander-kit/types";

import { Command } from "commander";

import { isExactInstanceOf } from "@/utils/helper/class-check";

import { CliCommand } from "@/commander-kit/core/command";
import { CommandBaseProgram } from "@/commander-kit/factories/create-base-program";

/** ------------------------------------------------------------------------
 * * Resolves factory-origin error message suffix.
 * ------------------------------------------------------------------------
 *
 * Returns an additional error message suffix when the provided command
 * instance originates from the `createBaseProgram` factory.
 *
 * This helper is used to enrich internal error messages with contextual
 * information about how the command instance was constructed.
 *
 * If the command is not an instance of {@link CommandBaseProgram | `CommandBaseProgram`},
 * an empty string is returned.
 *
 * ------------------------------------------------------------------------
 *
 * @param programCommand - The command instance to inspect.
 *
 * @returns A formatted error message suffix indicating factory origin,
 * or an empty string if not applicable.
 *
 * @example
 * ```ts
 * throw new Error(
 *   `Invalid configuration${resolveFactoryOriginErrorSuffix(programCommand)}`
 * );
 * ```
 *
 * @internal
 */
export function resolveFactoryOriginErrorSuffix(
  programCommand: CommandContext
): string {
  return isExactInstanceOf(programCommand, CommandBaseProgram)
    ? " by 'createBaseProgram' factory function"
    : "";
}

/** ------------------------------------------------------------------------
 * * Resolves an error message suffix based on the command instance type.
 * ------------------------------------------------------------------------
 *
 * Determines the concrete command class used to construct the provided
 * command instance and returns a short string identifier that can be
 * appended to error messages.
 *
 * This helper is primarily used internally to improve diagnostic output
 * by indicating which command implementation produced the error.
 *
 * The returned value is determined using strict runtime checks via
 * {@link isExactInstanceOf | `isExactInstanceOf`}.
 *
 * ------------------------------------------------------------------------
 * #### Resolution rules
 * ------------------------------------------------------------------------
 *
 * - Returns `"Command"` if the instance is exactly {@link Command | `Command`}.
 * - Returns `"CliCommand"` if the instance is exactly {@link CliCommand | `CliCommand`}.
 * - Returns an empty string (`""`) for all other cases.
 *
 * ------------------------------------------------------------------------
 *
 * @param programCommand - The command instance to inspect.
 *
 * @returns
 * A string identifier representing the command class, or an empty
 * string if the instance does not match any supported command types.
 *
 * @example
 * ```ts
 * throw new Error(
 *   `Invalid configuration (${resolveInstanceOriginErrorSuffix(programCommand)})`
 * );
 * ```
 *
 * @internal
 */
export function resolveInstanceOriginErrorSuffix(
  programCommand: CommandContext
): string {
  return isExactInstanceOf(programCommand, Command)
    ? "Command"
    : isExactInstanceOf(programCommand, CliCommand)
      ? "CliCommand"
      : "";
}
