import "@rzl-zone/node-only";

import { CliCommand } from "../core/command";
import { isCommanderError } from "../errors/isCommanderError";

/** ----------------------------------------------------------------
 * * ***Centralized exit handler for Commander.js ({@link CliCommand.exitOverride | `exitOverride`}).***
 * ----------------------------------------------------------------
 *
 * Handles all process termination logic when using Commander’s {@link CliCommand.exitOverride | `.exitOverride()`}  method.
 *
 * This helper normalizes Commander’s exception-based control flow
 * into predictable and user-friendly CLI behavior.
 *
 * ----------------------------------------------------------------
 * - *Behavior:*
 *     - Exits the process with code `0` when:
 *        - Commander triggers `helpDisplayed`.
 *        - Commander triggers `version`.
 *     - Prints error messages for real CLI or runtime failures.
 *     - Ensures correct and consistent exit codes.
 * ----------------------------------------------------------------
 * - *This prevents:*
 *     - Duplicate output (e.g. version printed twice).
 *     - Treating help/version as fatal errors.
 *     - Copy-pasted exit logic across multiple CLI entry points.
 * ----------------------------------------------------------------
 * - ⚠️ **Important:**
 *     - This function **always terminates the process**.
 *     - Intended to be passed directly into `program.exitOverride`.
 *     - Should NOT be used outside a CLI execution context.
 * ----------------------------------------------------------------
 *
 * @param err - The error object thrown by Commander or runtime logic.
 *
 * ----------------------------------------------------------------
 * @example
 * Using existing commander program instance:
 * ```ts
 * import { Command, program } from "commander"
 *
 * program.exitOverride(handleCommanderExit);
 * program.parse(process.argv);
 * ```
 *
 * @example
 * Using manually created command instance:
 * ```ts
 * import { Command } from "commander"
 *
 * const cmd = new Command();
 * cmd.exitOverride(handleCommanderExit);
 * cmd.parse(process.argv);
 * ```
 * @example
 * Using factory helper:
 * ```ts
 * import { createBaseProgram } from "@rzl-zone/build-tools/commander-kit";
 *
 * // Recommended usage (factory pattern)
 * const program = createBaseProgram();
 * program.parse(process.argv);
 * ```
 */
export function handleCommanderExit(err: unknown): never {
  // Commander or runtime error
  if (isCommanderError(err)) {
    const code = err.code;

    // Non-error exits (help / version)
    if (code === "commander.helpDisplayed" || code === "commander.version") {
      process.exit(0);
    }

    // console.error(err.message);
    process.exit(err.exitCode ?? 1);
  }

  // Unknown thrown value
  console.error(err);
  process.exit(1);
}

/**
 * @deprecated Used for `tsDoc` only.
 */
export type CliCommandInstance = CliCommand;
