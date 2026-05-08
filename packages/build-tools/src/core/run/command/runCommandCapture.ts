import "@rzl-zone/node-only";

import type { BaseRunCommandOptions } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { spawn, type SpawnOptions } from "node:child_process";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { runCommand } from "./runCommand";
import {
  assertValidCommand,
  spawnWithLifecycle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CommandProcessError,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isCommandProcessError,
  formatMessageColor,
  stripInternalStack
} from "./utils";
import { isArray } from "@/_internal/utils/helper";
import { EOL } from "@/utils/client";

//? Utils ----------------------------------------------------------------
function normalizeChunk(chunk: unknown): string {
  if (typeof chunk === "string") return chunk;
  if (Buffer.isBuffer(chunk)) return chunk.toString("utf8");

  return String(chunk);
}

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Result returned by {@link runCommandCapture | `runCommandCapture`}.***
 * ----------------------------------------------------------------
 *
 * Represents the captured output and execution status of a command.
 *
 * - *Behavior:*
 *     - `stdout` and `stderr` are fully buffered as UTF-8 strings.
 *     - `exitCode` reflects the process exit status.
 *     - `ok` indicates whether the command succeeded (`exitCode === 0`).
 */
export type RunCommandCaptureResult = {
  /** ----------------------------------------------------------------
   * * ***Captured standard output.***
   * ----------------------------------------------------------------
   *
   * The complete `stdout` output of the process as a UTF-8 string.
   *
   * - Trailing newlines may be trimmed depending on implementation.
   */
  stdout: string;

  /** ----------------------------------------------------------------
   * * ***Captured standard error output.***
   * ----------------------------------------------------------------
   *
   * The complete `stderr` output of the process as a UTF-8 string.
   *
   * - Useful for debugging or logging failures.
   */
  stderr: string;

  /** ----------------------------------------------------------------
   * * ***Process exit code.***
   * ----------------------------------------------------------------
   *
   * The numeric exit code returned by the process.
   *
   * - `0` usually indicates success.
   * - Non-zero values usually indicate failure.
   */
  exitCode: number;

  /** ----------------------------------------------------------------
   * * ***Execution success flag.***
   * ----------------------------------------------------------------
   *
   * Indicates whether the command completed successfully.
   *
   * Equivalent to:
   * ```ts
   * exitCode === 0
   * ```
   */
  ok: boolean;
};

/** ----------------------------------------------------------------
 * * ***Options for executing a shell command via {@link runCommandCapture | **`runCommandCapture`**}.***
 * ----------------------------------------------------------------
 */
export type RunCommandCaptureOptions = Omit<BaseRunCommandOptions, "stdio">;

/** ----------------------------------------------------------------
 * * ***Execute a command and capture its output.***
 * ----------------------------------------------------------------
 *
 * This utility spawns a child process using
 * {@link spawn | **`child_process.spawn`**} and buffers its output.
 *
 * Unlike {@link runCommand | **`runCommand`**}, this function:
 * - Captures `stdout` and `stderr` into strings.
 * - Does **not** stream output to the parent process.
 * - Always resolves (even for non-zero exit codes).
 *
 * - *Behavior:*
 *     - Uses `stdio: "pipe"` (output is buffered).
 *     - Collects `stdout` and `stderr` as UTF-8 strings.
 *     - Resolves when the process exits (regardless of exit code).
 *     - Rejects only on:
 *        - Spawn errors.
 *        - Abort signals.
 *        - Timeouts.
 *        - Process termination by signal.
 *
 * - *This function is designed for:*
 *     - Capturing CLI output.
 *     - Running commands programmatically.
 *     - Parsing results (JSON, text, etc.).
 *     - Testing and scripting utilities.
 *
 * ----------------------------------------------------------------
 * #### Limitations
 *
 * - Only a **single command** is supported.
 * - Shell syntax is **NOT allowed**, including:
 *    - `&&`, `||`
 *    - `|`
 *    - `>`, `<`
 *    - command chaining or piping of any kind
 *
 * Commands must represent a single executable with arguments.
 *
 * @param {string} command
 * The executable or command to run.
 *
 * @param {readonly string[]} [args]
 * Arguments passed to the command.
 *
 * @param {RunCommandCaptureOptions} [options]
 * Optional execution configuration.
 *
 * @returns {Promise<RunCommandCaptureResult>}
 * Resolves with an object containing:
 * - `stdout` ➔ captured standard output.
 * - `stderr` ➔ captured standard error.
 * - `exitCode` ➔ process exit code.
 * - `ok` ➔ `true` if exit code is `0`.
 *
 * ----------------------------------------------------------------
 * #### Error handling.
 *
 * This function does NOT reject on non-zero exit codes.
 * - Instead, use:
 *    - `result.ok`
 *    - `result.exitCode`
 *
 * The promise will reject in the following cases:
 * - validation errors (invalid command or arguments)
 * - spawn errors
 * - abort signals
 * - timeouts
 * - termination by signal
 *
 * In those cases, the promise is rejected with a
 * {@link CommandProcessError | **`CommandProcessError`**}.
 *
 * - *Error metadata:*
 *     - `reason` ➔ `"timeout" | "abort" | "signal" | "validation"`
 *     - `exitCode` ➔ Exit code (if available)
 *     - `signal` ➔ Termination signal (if any)
 *     - `command` ➔ Executed command (plain string, no colors)
 *
 * - *Type narrowing:*
 *     - Use `instanceof CommandProcessError` to safely access metadata
 *     - Or use {@link isCommandProcessError | **`isCommandProcessError`**} as a type guard
 *
 * - *Notes:*
 *     - Non-zero exit codes are NOT treated as errors
 *     - Metadata is available programmatically (e.g. `err.reason`)
 *     - Metadata is also included in the formatted stack output
 *       for CLI readability
 *
 * @example
 * ```ts
 * try {
 *   await runCommandCapture("pnpm", ["build"]);
 * } catch (err) {
 *   if (err instanceof CommandProcessError) {
 *     console.error("Command failed:", err.reason);
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * try {
 *   await runCommandCapture("pnpm", ["dev"]);
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
 * const result = await runCommandCapture("node", ["--version"]);
 *
 * console.log(result.stdout);
 * ```
 *
 * @example
 * ```ts
 * const { stdout, ok } = await runCommandCapture("pnpm", ["build"]);
 *
 * if (!ok) {
 *   console.error("Build failed");
 * }
 * ```
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 *
 * runCommandCapture("pnpm", ["dev"], {
 *   signal: controller.signal
 * });
 *
 * controller.abort();
 * ```
 *
 * @remarks
 * - **Execution model:**
 *     - Uses {@link spawn | **`spawn`**} to avoid output size limits
 *       imposed by `exec`
 *
 * - **Output handling:**
 *     - Always uses `stdio: "pipe"` (cannot be overridden)
 *     - Output is buffered entirely in memory
 *
 * - **Exit behavior:**
 *     - Does NOT reject on non-zero exit codes
 *     - Use `result.ok` or `result.exitCode` to handle failures
 *
 * - **Shell execution:**
 *     - Defaults to `shell: true` for cross-platform compatibility
 *     - However, shell operators and advanced shell syntax are NOT supported
 *     - This utility always executes a single command only
 *
 * - **Abort & timeout:**
 *     - Abort signals and timeouts will terminate the process
 *       and reject the promise
 *
 * - **When NOT to use this utility:**
 *     - When output needs to be streamed in real-time
 *     - When handling very large outputs (risk of high memory usage)
 *
 * ***In those cases, use {@link runCommand | `runCommand`}.***
 */
export function runCommandCapture(
  command: string,
  args: readonly string[]
): Promise<RunCommandCaptureResult>;
export function runCommandCapture(
  command: string,
  options: RunCommandCaptureOptions
): Promise<RunCommandCaptureResult>;
export function runCommandCapture(
  command: string,
  args: readonly string[],
  options: RunCommandCaptureOptions
): Promise<RunCommandCaptureResult>;
export function runCommandCapture(
  command: string,
  argsOrOptions: readonly string[] | RunCommandCaptureOptions = [],
  maybeOptions: RunCommandCaptureOptions = {}
): Promise<RunCommandCaptureResult> {
  return new Promise((resolve, reject) => {
    try {
      let args: readonly string[];
      let options: RunCommandCaptureOptions;
      const isArgsArray = isArray(argsOrOptions);

      if (isArgsArray) {
        args = argsOrOptions;
        options = maybeOptions;
      } else {
        args = [];
        options = argsOrOptions;
      }

      assertValidCommand(command, {
        apiType: "runCommandCapture",
        useColors: options.useColors,
        allowInline: !isArgsArray
      });

      const {
        shell = true,
        signal,
        timeout,
        forceKill,
        useColors = true,
        argv0: _argv0,
        ...restOption
      } = options as RunCommandCaptureOptions & SpawnOptions;

      const { child, setupLifecycle } = spawnWithLifecycle(
        command,
        args,
        {
          ...restOption,
          stdio: "pipe",
          shell,
          signal,
          timeout,
          forceKill,
          useColors
        },
        {
          rejectOnNonZero: false
        }
      );

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (chunk: unknown) => {
        stdout += normalizeChunk(chunk);
      });

      child.stderr?.on("data", (chunk: unknown) => {
        stderr += normalizeChunk(chunk);
      });

      setupLifecycle({
        onSuccess: (code) => {
          resolve({
            stdout: stdout.trimEnd(),
            stderr: formatMessageColor(stderr.trimEnd(), useColors),
            exitCode: code,
            ok: code === 0
          });
        },
        onError: reject
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      const cleanedBase = stripInternalStack(
        (new Error().stack?.split(EOL).slice(1) ?? []).filter(
          (line) => !line.includes("runCommandCapture")
        )
      );
      e.stack = [e.message, ...cleanedBase].join(EOL);

      reject(e);
      return;
    }
  });
}
