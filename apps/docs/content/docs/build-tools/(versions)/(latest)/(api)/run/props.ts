import type { RunCommandOptions } from "@rzl-zone/build-tools";
import type { Prettify } from "@rzl-zone/ts-types-plus";

//! runCommand - overload 1
/** @version 0.0.7 */
export type RunCommandOverload1 = Prettify<
  {
    /** **The executable or command to run, see detail: [`command`](#command).**
     *
     * @default -
     * @link [`RunCommand-command`](#command)
     */
    command: string;

    /** **Arguments passed to the command, see detail: [`args`](#args).**
     *
     * @default -
     * @link [`RunCommand-args`](#args)
     */
    args: readonly string[];
  },
  { recursive: true }
>;
//! runCommand - overload 2
/** @version 0.0.7 */
export type RunCommandOverload2 = Prettify<
  {
    /** **The executable or command to run.**
     *
     * @default -
     *
     * @link [`RunCommand-command`](#command)
     */
    command: string;

    /** **Arguments passed to the command.**
     *
     * - [`stdio`](#stdio): Controls how `stdin`, `stdout`, and `stderr` are handled.
     * - [`cwd`](#cwd): Working directory for the spawned process.
     *
     * @default { stdio: "inherit"; cwd: undefined }
     * @link [`RunCommand-args`](#args)
     */
    options: RunCommandOptions;
  },
  { recursive: true }
>;
//! runCommand - overload 3
/** @version 0.0.7 */
export type RunCommandOverload3 = Prettify<
  {
    /** **The executable or command to run.**
     *
     * @default -
     *
     * @link [`RunCommand-command`](#command)
     */
    command: string;
  },
  { recursive: true }
>;
