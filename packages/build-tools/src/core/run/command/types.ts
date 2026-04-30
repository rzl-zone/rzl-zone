import {
  spawn,
  type SpawnOptions,
  type StdioOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ChildProcess
} from "node:child_process";

/**
 * @deprecated Use `typeof spawn` from "node:child_process" instead.
 */
export type typesSpawn = typeof spawn;

/** ----------------------------------------------------------------
 * * ***Base Options for `runCommand` or `runCommandCapture`.***
 * ----------------------------------------------------------------
 */
export type BaseRunCommandOptions = {
  /** ----------------------------------------------------------------
   * * ***Standard input/output configuration for the spawned process.***
   * ----------------------------------------------------------------
   * Controls how `stdin`, `stdout`, and `stderr` are handled.
   *
   * - *Can be set to:*
   *     - `"pipe"` – create a pipe between parent and child.
   *     - `"inherit"` – inherit the parent process streams.
   *     - `"overlapped"` – use overlapped I/O (Windows only).
   *     - `"ignore"` – discard the stream.
   *
   * - *An array form may be used to configure each stream individually:*
   *     - Index `0` ➔ `stdin`.
   *     - Index `1` ➔ `stdout`.
   *     - Index `2` ➔ `stderr`.
   *     - Index `3` ➔ additional custom stream (optional).
   *
   * If passed as an array, the first element is used for `stdin`, the second for
   * `stdout`, and the third for `stderr`.
   *
   * A fourth element can be used to
   * specify the `stdio` behavior beyond the standard streams.
   *
   * @See {@link ChildProcess.stdio | **`ChildProcess.stdio`**} for more information.
   *
   * @default "inherit"
   */
  stdio?: StdioOptions;

  /** ----------------------------------------------------------------
   * * ***Working directory for the spawned process.***
   * ----------------------------------------------------------------
   *
   * Equivalent to `process.cwd()` when not provided.
   */
  cwd?: string | URL;

  /** ----------------------------------------------------------------
   * * ***Environment variables passed to the spawned process.***
   * ----------------------------------------------------------------
   *
   * Defaults to `process.env`.
   */
  env?: NodeJS.ProcessEnv;

  /** ----------------------------------------------------------------
   * * ***Disable execution inside a system shell.***
   * ----------------------------------------------------------------
   *
   * By default, commands are executed inside a system shell:
   * - `sh` on Unix-based systems.
   * - `cmd.exe` on Windows.
   *
   * Set this option to `false` to bypass the shell and execute
   * the command directly.
   *
   * This is useful for:
   * - Strict argument handling.
   * - Avoiding shell interpretation.
   *
   * @default true (shell is enabled)
   */
  shell?: false;

  /** ----------------------------------------------------------------
   * * ***Abort signal for cancelling the spawned process.***
   * ----------------------------------------------------------------
   *
   * When the signal is aborted:
   * - The child process will be terminated using `SIGTERM`.
   * - The returned promise will be rejected with an abort error.
   *
   * If the signal is already aborted before execution,
   * the command will not be started.
   *
   * @default undefined
   *
   * @example
   * ```ts
   * const controller = new AbortController();
   * runCommand("pnpm", ["dev"], { signal: controller.signal });
   * controller.abort();
   * ```
   */
  signal?: AbortSignal;

  /** ----------------------------------------------------------------
   * * ***Maximum execution time before forcefully terminating the process.***
   * ----------------------------------------------------------------
   *
   * When the timeout is reached:
   * - The child process will be terminated using `SIGTERM`.
   * - The returned promise will be rejected with a timeout error.
   *
   * This is useful for preventing hanging processes
   * or enforcing execution limits in automation scripts.
   *
   * @default undefined (no timeout)
   *
   * @note ⚠️ Setting to `0` will cause immediate termination.
   */
  timeout?: number;

  /** ----------------------------------------------------------------
   * * ***Forcefully terminate the spawned process (Windows only).***
   * ----------------------------------------------------------------
   *
   * When enabled, the process will be terminated using:
   * - `taskkill /f /t` on Windows (kills the entire process tree).
   *
   * This ensures that all child processes are also terminated,
   * preventing orphaned or zombie processes.
   *
   * - This option is useful for:
   *    - Long-running processes.
   *    - Dev servers or watchers.
   *    - Ensuring clean shutdown in CI environments.
   *
   * @default false
   */
  forceKill?: boolean;

  /** ----------------------------------------------------------------
   * * ***Enable colored output for logs and error messages.***
   * ----------------------------------------------------------------
   *
   * When enabled:
   * - Commands will be formatted with colors.
   * - Error messages will include highlighted command strings.
   *
   * This is useful for:
   * - CLI tools.
   * - Developer-friendly logs.
   *
   * @default true
   */
  useColors?: boolean;
} & Omit<SpawnOptions, "cwd" | "env" | "shell" | "stdio" | "argv0" | "timeout">;
