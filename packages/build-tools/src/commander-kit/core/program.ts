import { CliCommand } from "./command";

/** ----------------------------------------------------------------
 * * ***Default CLI program instance.***
 * ----------------------------------------------------------------
 *
 * Shared CLI program instance created from
 * {@link CliCommand | **`CliCommand`**}.
 *
 * This module-level singleton provides a convenient
 * default program object for simple CLI tools without
 * manually creating a command instance.
 *
 * ----------------------------------------------------------------
 *
 * Equivalent to:
 *
 * ```ts
 * import { CliCommand } from "@rzl-zone/build-tools/commander-kit";
 *
 * const cliProgram = new CliCommand();
 * ```
 */
export const cliProgram: CliCommand = new CliCommand();
