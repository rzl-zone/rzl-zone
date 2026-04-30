import { Command } from "commander";

import { CliCommand } from "../core/command";

/** ----------------------------------------------------------------
 * * ***CLI Command Factory.***
 * ----------------------------------------------------------------
 *
 * Creates a new {@link CliCommand | **`CliCommand`**} instance.
 *
 * This helper acts as a small factory for constructing command
 * objects used by the CLI framework. It ensures all commands are
 * created through the same entry point, which allows future
 * extensions (such as internal metadata attachment or lifecycle
 * hooks) without changing call sites.
 *
 * @param name Optional command name.
 *
 * @returns A newly created {@link CliCommand | **`CliCommand`**} instance.
 */
export const cliCreateCommand = (name?: string): CliCommand =>
  new CliCommand(name);

/**
 * @deprecated `Un-Used`.
 */
export type CommandType = Command;
