import { Argument } from "commander";

import { CliArgument } from "@/commander-kit/core/argument";

/** ----------------------------------------------------------------
 * * ***CLI Argument Factory.***
 * ----------------------------------------------------------------
 *
 * Creates a new {@link CliArgument | **`CliArgument`**} instance.
 *
 * This helper constructs a CLI argument definition compatible with
 * Commander argument parsing while providing a consistent creation
 * entry point within the framework.
 *
 * @param name Argument definition string (e.g. `<file>` or `[dir]`).
 * @param description Optional argument description used in help output.
 *
 * @returns A newly created {@link CliArgument | **`CliArgument`**} instance.
 */
export const cliCreateArgument = (
  name: string,
  description?: string
): CliArgument => new CliArgument(name, description);

/** @deprecated `Un-Used`. */
export type ArgumentType = Argument;
