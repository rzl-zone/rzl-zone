import "@rzl-zone/node-only";

import type { BaseRunCommandOptions } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { spawn, type SpawnOptions, ChildProcess } from "node:child_process";

import {
  assertValidCommand,
  spawnWithLifecycle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CommandProcessError,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isCommandProcessError
} from "./utils";

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Options for executing a shell command via {@link runCommand | **`runCommand`**}.***
 * ----------------------------------------------------------------
 */
export type RunCommandOptions = BaseRunCommandOptions;

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Execute a command and stream output to the current process.***
 * ----------------------------------------------------------------
 *
 * This utility spawns a child process using
 * {@link spawn | **`child_process.spawn`**}.
 *
 * By default, it forwards `stdout` and `stderr` directly to the parent
 * process using `stdio: "inherit"` (real-time streaming, no buffering).
 *
 * - *Behavior:*
 *     - Uses `stdio: "inherit"` by default (can be overridden).
 *     - Does **not** buffer output.
 *     - Resolves only when the process exits with code `0`.
 *     - Rejects if the process exits with a non-zero code,
 *       is terminated by a signal, aborted, or times out.
 *
 * - *This function is designed for:*
 *     - Build steps.
 *     - Post-build hooks.
 *     - CLI tooling.
 *     - Long-running tasks (bundlers, compilers, CSS processors).
 *
 * @param {string} command
 * The executable or command to run.
 *
 * @param {readonly string[]} [args]
 * Arguments passed to the command.
 *
 * @param {RunCommandOptions} [options]
 * Optional execution configuration.
 *
 * @returns {Promise<ChildProcess>}
 * Resolves with the spawned {@link ChildProcess | **`ChildProcess`**} instance
 * **after the process exits successfully (exit code `0`)**.
 *
 * ----------------------------------------------------------------
 * #### Error handling
 *
 * When the process fails, the promise is rejected with a
 * {@link CommandProcessError | **`CommandProcessError`**}.
 *
 * - *Error metadata:*
 *     - `reason` ➔ `"timeout" | "abort" | "signal" | "non-zero exit code"`.
 *     - `exitCode` ➔ Exit code (if available).
 *     - `signal` ➔ Termination signal (if any).
 *     - `command` ➔ Executed command (plain string, no colors).
 *
 * - *Type narrowing:*
 *     - Use `instanceof CommandProcessError` to safely access metadata.
 *     - Or use {@link isCommandProcessError | **`isCommandProcessError`**} as a type guard.
 *
 * - *Notes:*
 *     - Metadata is available programmatically (e.g. `err.reason`).
 *     - Metadata is also included in the formatted stack output
 *       for CLI readability.
 *
 * @example
 * ```ts
 * try {
 *   await runCommand("pnpm", ["build"]);
 * } catch (err) {
 *   if (err instanceof CommandProcessError) {
 *     if (err.reason === "non-zero exit code") {
 *       console.error("Build failed with code:", err.exitCode);
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * try {
 *   await runCommand("pnpm", ["build"]);
 * } catch (err) {
 *   if (isCommandProcessError(err)) {
 *     console.error(err.reason);
 *   }
 * }
 * ```
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * await runCommand("pnpm", ["build"]);
 * ```
 *
 * @example
 * ```ts
 * const child = await runCommand("node", ["script.js"]);
 * console.log(child.pid);
 * ```
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 *
 * runCommand("pnpm", ["dev"], {
 *   signal: controller.signal
 * });
 *
 * controller.abort();
 * ```
 *
 * @example
 * ```ts
 * await runCommand("npm", ["run", "build"], {
 *   timeout: 5000
 * });
 * ```
 *
 * @remarks
 * - **Execution model:**
 *      - Uses {@link spawn | **`spawn`**} instead of `exec` to avoid
 *        output buffering and support long-running processes.
 *
 * - **Output handling:**
 *      - Defaults to `stdio: "inherit"` (streams output to parent).
 *      - If `stdio` is overridden (e.g. `"pipe"`), output will NOT be auto-forwarded.
 *
 * - **Shell execution:**
 *      - Defaults to {@link RunCommandOptions.shell | **`shell: true`**}.
 *      - Required on Windows to resolve commands like `pnpm`, `npm`, `git`, etc.
 *      - When `shell: false`, the command must be:
 *         - An absolute path, or
 *         - A directly executable binary.
 *
 * - **Abort handling:**
 *      - When `signal` is provided, the process will be terminated
 *        with `SIGTERM` if aborted.
 *
 * - **Timeout handling:**
 *      - When `timeout` is set, the process will be terminated
 *        after the specified duration.
 *      - `undefined` ➔ no timeout.
 *      - ⚠️ `0` ➔ immediate termination.
 *
 * - **Common errors:**
 *      - **`ENOENT`** ➔ command not found:
 *          - Not installed
 *          - Not in `PATH`
 *          - `shell: false` with non-absolute command
 *
 * - **When NOT to use this utility:**
 *      - When you need to capture output programmatically.
 *      - When you need advanced shell features (`|`, `>`, `&&`).
 *
 * ***In those cases, consider using `exec` or a dedicated process runner.***
 */
export function runCommand(
  command: string,
  args: readonly string[]
): Promise<ChildProcess>;
export function runCommand(
  command: string,
  options: RunCommandOptions
): Promise<ChildProcess>;
export function runCommand(
  command: string,
  args: readonly string[],
  options: RunCommandOptions
): Promise<ChildProcess>;
export function runCommand(
  command: string,
  argsOrOptions: readonly string[] | RunCommandOptions = [],
  maybeOptions: RunCommandOptions = {}
): Promise<ChildProcess> {
  assertValidCommand(command);

  let args: readonly string[];
  let options: RunCommandOptions;

  if (Array.isArray(argsOrOptions)) {
    args = argsOrOptions;
    options = maybeOptions;
  } else {
    args = [];
    options = argsOrOptions as RunCommandOptions;
  }

  return new Promise((resolve, reject) => {
    const {
      shell = true,
      stdio = "inherit",
      argv0: _argv0,
      useColors = true,
      ...restOption
    } = options as RunCommandOptions & SpawnOptions;

    const { child, setupLifecycle, cmdStringPlain } = spawnWithLifecycle(
      command,
      args,
      {
        ...restOption,
        stdio,
        useColors,
        shell
      },
      {
        rejectOnNonZero: true
      }
    );

    setupLifecycle({
      onSuccess: (code) => {
        if (code === 0) {
          resolve(child);
        } else {
          reject(new Error(`${cmdStringPlain} exited with code ${code}`));
        }
      },
      onError: reject
    });
  });
}
