import { Option } from "commander";
import { CliOption } from "../core/option";

/** ----------------------------------------------------------------
 * * ***CLI Option Factory.***
 * ----------------------------------------------------------------
 *
 * Creates a new {@link CliOption | **`CliOption`**} instance.
 *
 * This helper constructs a CLI option definition compatible with
 * Commander option parsing while ensuring a consistent factory
 * entry point for option creation within the framework.
 *
 * @param arg Option flags definition
 * (e.g. `"-p, --port <number>"`).
 *
 * @param description Optional description displayed in help output.
 *
 * @returns A newly created {@link CliOption | **`CliOption`**} instance.
 */
export const cliCreateOption = (arg: string, description?: string): CliOption =>
  new CliOption(arg, description);

/** @deprecated `Un-Used`. */
export type OptionType = Option;
