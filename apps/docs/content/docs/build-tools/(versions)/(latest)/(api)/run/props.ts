import type { RunCommandOptions } from "@rzl-zone/build-tools";
import type { Prettify } from "@rzl-zone/ts-types-plus";

type BaseCommandType = {
  /** **The executable or command to run, see detail: [`command`](#command).**
   *
   * @default -
   * @link [`RunCommand-command`](#command)
   */
  command: string;
};

type BaseArgsType = {
  /** **Arguments passed to the command, see detail: [`args`](#args).**
   *
   * @default -
   * @link [`RunCommand-args`](#args)
   */
  args: readonly string[];
};

type BaseOptionsType = {
  /** **Arguments passed to the command, see detail: [`options`](#options).**
   *
   * - [`stdio`](#options-stdio): Controls how `stdin`, `stdout`, and `stderr` are handled.
   * - [`cwd`](#options-cwd): Working directory for the spawned process.
   * - [`env`](#options-env): Environment variables passed to the spawned process.
   * - [`shell`](#options-shell): Control whether the command is executed inside a system shell.
   * - [`signal`](#options-signal): Abort signal for cancelling the spawned process.
   * - [`timeout`](#options-timeout): Maximum execution time before forcefully terminating the process.
   * - [`forceKill`](#options-force-kill): Forcefully terminate the spawned process (Windows only).
   * - [`useColors`](#options-use-colors): Enable colored output for logs and error messages.
   *
   * @default { stdio: "inherit"; cwd: process.cwd(); env: process.env; shell: true; signal: undefined; timeout: undefined; forceKill: false; useColors: true }
   * @link [`RunCommand-options`](#options)
   */
  options: RunCommandOptions;
};

//! runCommand - overload 1
/** @version 0.0.7 */
export type RunCommandOverload1 = Prettify<
  BaseCommandType & BaseArgsType,
  { recursive: true }
>;
//! runCommand - overload 2
/** @version 0.0.7 */
export type RunCommandOverload2 = Prettify<
  BaseCommandType & BaseOptionsType,
  { recursive: true }
>;
//! runCommand - overload 3
/** @version 0.0.7 */
export type RunCommandOverload3 = Prettify<
  BaseCommandType & BaseArgsType & Partial<BaseOptionsType>,
  { recursive: true }
>;
