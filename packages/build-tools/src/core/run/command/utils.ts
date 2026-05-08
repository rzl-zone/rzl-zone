import "@rzl-zone/node-only";
import { parse as parseShellQuote } from "shell-quote";

import type { OverrideTypes } from "@/_internal/types/extra";
import type { BaseRunCommandOptions } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { spawn, ChildProcess } from "node:child_process";

import { isString, safeStableStringify } from "@/_internal/utils/helper";

import {
  EOL,
  formatOptionValue,
  joinLinesLoose,
  picocolors
} from "@/utils/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { runCommand } from "./runCommand";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { runCommandCapture } from "./runCommandCapture";

/** @internal Util for {@link runCommand | `runCommand`} and {@link runCommandCapture | `runCommandCapture`}. */
export const formatMessageColor = (message: string, useColors = true) => {
  return useColors ? picocolors.redBright(message) : message;
};

/** @internal Util for {@link runCommand | `runCommand`} and {@link runCommandCapture | `runCommandCapture`}. */
export function formatCommand(
  command: string,
  args: readonly string[],
  { useColors = true }: Pick<BaseRunCommandOptions, "useColors"> = {}
) {
  const hasArgs = args.length > 0;
  const argsString = hasArgs
    ? args.map((a) => safeStableStringify(a)).join(" ")
    : "";

  // No args: display command as-is (already normalized)
  if (!hasArgs) {
    return formatMessageColor(command, useColors);
  }

  if (useColors) {
    return `${picocolors.cyanBright(command)} ${picocolors.gray(argsString)}`;
  }

  return `${command} ${argsString}`;
}

/** @internal Util for {@link runCommand | `runCommand`} and {@link runCommandCapture | `runCommandCapture`}. */
export function assertValidCommand(
  command: unknown,
  options: Pick<BaseRunCommandOptions, "useColors"> & {
    apiType: "runCommandCapture" | "runCommand";
    allowInline?: boolean;
  }
): asserts command is string {
  const { useColors = true, allowInline = false, apiType } = options || {};
  if (!isString(command)) {
    const errorMsg = `Invalid command: expected a string, received ${safeStableStringify(command)}`;
    throw new TypeError(formatMessageColor(errorMsg, useColors));
  }

  const trimmed = command.trim();

  if (trimmed.length === 0) {
    const errorMsg = "Invalid command: command cannot be empty";
    throw new Error(formatMessageColor(errorMsg, useColors));
  }

  const hasSpace = /\s/.test(trimmed);
  // const hasQuotes = /['"`]/.test(trimmed);

  if (hasShellSyntax(trimmed)) {
    const errorMsg = joinLinesLoose(
      `Invalid command: "${trimmed}"`,
      "Shell operators are not supported in this context (e.g. &&, ||, |, >).",
      "This utility only supports a single command with arguments."
    );
    throw new Error(formatMessageColor(errorMsg, useColors));
  }

  if (!allowInline && hasSpace) {
    const [cmd, ...rest] = trimmed.split(/\s+/);

    if (!cmd) {
      throw new Error("Invalid command: unable to resolve executable.");
    }

    const errorMsg = joinLinesLoose(
      `Invalid command: "${trimmed}"`,
      "Do not include arguments in the command when passing them separately.",
      `Use: ${apiType}("${cmd}", ${safeStableStringify(rest)})`
    );

    throw new Error(formatMessageColor(errorMsg, useColors));
  }
}

/** @internal Util for local {@link createProcessError | `createProcessError`}. */
export function stripInternalStack(lines: string[]) {
  const blacklist = [
    "at new Promise (<anonymous>)",
    "Timeout.",
    "ChildProcess.",
    "node:events:",
    "createProcessError",
    "formatError",
    "spawnWithLifecycle",
    "assertValidCommand",
    "setupLifecycle",
    "node:internal",
    "node:internal/process/promises"
  ];

  return lines.filter((line) => {
    if (blacklist.some((key) => line.includes(key))) {
      return false;
    }

    const isFileFrame = line.includes("/build-tools/dist/");
    const hasFunctionName = /\bat\s+\S+\s+\(/.test(line);

    if (isFileFrame && !hasFunctionName) {
      return false;
    }

    return true;
  });
}

/** @internal Util for local {@link spawnWithLifecycle | `spawnWithLifecycle`}. */
function createProcessError(
  message: string,
  {
    reason,
    exitCode,
    signal,
    command
  }: {
    reason: CommandProcessError["reason"];
    exitCode?: number;
    signal?: NodeJS.Signals | null;
    command: string;
  },
  baseStack?: string
): CommandProcessError {
  const error = new CommandProcessError(message, {
    reason,
    exitCode,
    signal,
    command
  });

  const currentStack = error.stack?.split(EOL) ?? [];
  const base = baseStack?.split(EOL) ?? [];

  const [currentHead, ...currentRest] = currentStack;
  const [, ...baseRest] = base;

  const cleanedCurrent = stripInternalStack(currentRest);
  const cleanedBase = stripInternalStack(baseRest);

  command = command.trim();

  error.stack = [
    currentHead,
    ...cleanedCurrent,
    ...(cleanedBase.length ? [...cleanedBase] : [])
  ].join(EOL);

  Object.defineProperties(error, {
    reason: { value: reason, enumerable: false },
    exitCode: { value: exitCode, enumerable: false },
    signal: { value: signal, enumerable: false },
    command: { value: command, enumerable: false }
  });

  error.stack += joinLinesLoose(
    "",
    "meta:",
    ` reason: ${formatOptionValue(reason)}`,
    ` exitCode: ${formatOptionValue(exitCode ?? null)}`,
    ` signal: ${formatOptionValue(signal ?? null)}`,
    ` command: ${formatOptionValue(command)}`
  );

  return error;
}

type Reason =
  | "timeout"
  | "abort"
  | "signal"
  | "non-zero exit code"
  | "validation";

/** ----------------------------------------------------------------
 * * ***Represents a command execution failure.***
 * ----------------------------------------------------------------
 *
 * This error is thrown when a spawned process fails during execution
 * via {@link runCommand | **`runCommand`**}, {@link runCommandCapture | **`runCommandCapture`**} or related utilities.
 *
 * It extends the native {@link Error | `Error`} class and provides structured
 * metadata describing the failure.
 *
 * ---
 *
 * - *Failure reasons:*
 *     - `"timeout"` ➔ The process exceeded the configured timeout.
 *     - `"abort"` ➔ The process was aborted via an `AbortSignal`.
 *     - `"signal"` ➔ The process was terminated by an OS signal.
 *     - `"non-zero exit code"` ➔ The process exited with a non-zero code.
 *
 * ---
 *
 * - *Metadata:*
 *     - `reason` ➔ Reason for failure.
 *     - `exitCode` ➔ Exit code (if available).
 *     - `signal` ➔ Termination signal (if any).
 *     - `command` ➔ Executed command (plain string, no colors).
 *
 * ---
 *
 * - *Behavior:*
 *     - Thrown when a process fails in {@link runCommand | `runCommand`}.
 *     - May also be thrown in {@link runCommandCapture | `runCommandCapture`} for:
 *        - Spawn errors.
 *        - Abort signals.
 *        - Timeouts.
 *        - Signal termination.
 *     - Includes formatted stack output for CLI readability.
 *     - Metadata is available for programmatic handling.
 *
 * ----------------------------------------------------------------
 * @example
 * ```ts
 * try {
 *   await runCommand("pnpm", ["build"]);
 * } catch (err) {
 *   if (err instanceof CommandProcessError) {
 *     console.error("Reason:", err.reason);
 *     console.error("Exit code:", err.exitCode);
 *   }
 * }
 * ```
 *
 * OR with `isCommandProcessError`.
 *
 * @example
 * ```ts
 * try {
 *   await runCommand("pnpm", ["build"]);
 * } catch (err) {
 *   if (isCommandProcessError(err)) {
 *     console.error("Reason:", err.reason);
 *     console.error("Exit code:", err.exitCode);
 *   }
 * }
 * ```
 *
 * @remarks
 * - This error is designed for both:
 *    - Human-readable CLI output.
 *    - Programmatic error handling.
 *
 * - Metadata properties are non-enumerable to avoid duplicate
 *   output when logged via `console.error`.
 */
export class CommandProcessError extends Error {
  reason: Reason;
  exitCode?: number;
  signal?: NodeJS.Signals | null;
  command: string;

  constructor(
    message: string,
    meta: {
      reason: CommandProcessError["reason"];
      exitCode?: number;
      signal?: NodeJS.Signals | null;
      command: string;
    }
  ) {
    super(message);

    this.name = "CommandProcessError";

    this.reason = meta.reason;
    this.exitCode = meta.exitCode;
    this.signal = meta.signal;
    this.command = meta.command;
  }
}

/** ----------------------------------------------------------------
 * * ***Type guard for `CommandProcessError`.***
 * ----------------------------------------------------------------
 *
 * Utility to check whether a given value is an instance of
 * {@link CommandProcessError | `CommandProcessError`}.
 *
 * Useful when handling unknown errors in `try/catch` blocks.
 *
 * ----------------------------------------------------------------
 * @param err
 * The unknown error value to check.
 *
 * @returns
 * `true` if the value is a `CommandProcessError`, otherwise `false`.
 *
 * ----------------------------------------------------------------
 * @example
 * ```ts
 * try {
 *   await runCommand("pnpm", ["build"]);
 * } catch (err) {
 *   if (isCommandProcessError(err)) {
 *     console.error(err.reason);
 *     console.error(err.exitCode);
 *   }
 * }
 * ```
 */
export function isCommandProcessError(
  err: unknown
): err is CommandProcessError {
  return err instanceof CommandProcessError;
}

function hasShellSyntax(str: string) {
  return /(\|\||&&|[|&;<>\n])/.test(str);
  // return /(\|\||&&|[|&;<>(){}$`\n])/.test(str);
}

/** @internal Util for local {@link spawnWithLifecycle | `spawnWithLifecycle`}. */
function resolveCommand(
  input: string,
  useColors = true
): {
  command: string;
  args: string[];
} {
  const tokens = parseShellQuote(input);

  const normalized: string[] = [];

  for (const t of tokens) {
    if (typeof t === "string") {
      normalized.push(t);
      continue;
    }

    if ("comment" in t) {
      continue;
    }

    if ("pattern" in t) {
      normalized.push(t.pattern);
      continue;
    }

    if ("op" in t) {
      throw new Error(
        formatMessageColor("Unsupported shell operator detected.", useColors)
      );
    }

    throw new Error(formatMessageColor("Unknown token in command.", useColors));
  }

  if (normalized.length === 0) {
    throw new Error(
      formatMessageColor("Invalid command: empty after parsing.", useColors)
    );
  }

  const [cmd, ...args] = normalized;

  if (!cmd) {
    throw new Error(
      formatMessageColor("Invalid command: empty after parsing.", useColors)
    );
  }

  return { command: cmd, args };
}

/** @internal Util for {@link runCommand | `runCommand`} and {@link runCommandCapture | `runCommandCapture`}. */
export function spawnWithLifecycle(
  command: string,
  args: readonly string[],
  options: OverrideTypes<
    BaseRunCommandOptions,
    {
      /** Whether to run the command inside a shell.
       *
       * @default false
       */
      shell?: boolean;
    }
  >,
  config?: {
    /** Custom error formatter.
     *
     * Allows overriding how errors are constructed.
     *
     * @param message The error message.
     * @param meta Additional metadata about the failure.
     *
     * @returns A custom error instance.
     *
     * @example
     * ```ts
     * formatError(msg, meta) {
     *   return new MyError(msg, meta.reason);
     * }
     * ```
     */
    formatError?: (
      /**
       * The error message.
       */
      message: string,
      /**
       * Additional metadata about the failure.
       */
      meta: {
        /** ----------------------------------------------------------------
         * * ***Reason for process failure.***
         * ----------------------------------------------------------------
         *
         * Indicates why the process failed.
         *
         * Possible values:
         * - `"timeout"` ➔ The process exceeded the configured timeout.
         * - `"abort"` ➔ The process was aborted via an `AbortSignal`.
         * - `"signal"` ➔ The process was terminated by an OS signal.
         * - `"non-zero exit code"` ➔ The process exited with a non-zero code.
         */
        reason: CommandProcessError["reason"];

        /** ----------------------------------------------------------------
         * * ***Process exit code (if available).***
         * ----------------------------------------------------------------
         *
         * Only present when the process exits normally.
         *
         * - `0` ➔ success (unless rejected manually)
         * - non-zero ➔ failure (when `rejectOnNonZero` is enabled)
         */
        exitCode?: number;

        /** ----------------------------------------------------------------
         * * ***Termination signal (if any).***
         * ----------------------------------------------------------------
         *
         * Present when the process is killed by a signal
         * (e.g. `"SIGTERM"`, `"SIGKILL"`).
         */
        signal?: NodeJS.Signals | null;

        /** ----------------------------------------------------------------
         * * ***Command string (plain, no colors).***
         * ----------------------------------------------------------------
         *
         * The resolved executable used to start the process.
         *
         * - Always represents the base command (e.g. `"npm"`)
         * - Arguments are provided separately via `args`
         *
         * Inline commands (e.g. `"npm run build"`) are automatically parsed
         * and normalized into `command` and `args`.
         */
        command: string;

        /** ----------------------------------------------------------------
         * * ***Command arguments.***
         * ----------------------------------------------------------------
         *
         * Arguments passed to the command.
         *
         * - Always contains the resolved arguments (e.g. `["run", "build"]`)
         * - Inline command strings are automatically parsed into this array
         */
        args: readonly string[];

        /** ----------------------------------------------------------------
         * * ***Whether colored output is enabled.***
         * ----------------------------------------------------------------
         *
         * Controls whether ANSI color formatting should be applied
         * when constructing error messages.
         */
        useColors: boolean;
      }
    ) => Error;

    /** Reject the process when exit code is non-zero.
     *
     * When enabled:
     * - Exit codes ≠ `0` will trigger `onError`.
     *
     * @default false
     */
    rejectOnNonZero?: boolean;
  }
) {
  const {
    useColors = true,
    timeout,
    forceKill,
    signal: abortSignal,
    shell = false,
    ...restOption
  } = options;

  let cmd = command;
  let finalArgs = [...args];

  const isInline = finalArgs.length === 0 && /\s/.test(cmd);

  const baseStack = new Error().stack;

  const formatError =
    config?.formatError ??
    ((msg, meta) => {
      const metaCommand = meta.command.trim();
      const hasArgs = meta.args.length > 0;

      const argsString = hasArgs
        ? meta.args.map((a) => safeStableStringify(a).trim()).join(" ")
        : "";

      const commandString = hasArgs
        ? `${metaCommand} ${argsString}`
        : metaCommand;

      if (meta.useColors) {
        const cmd = picocolors.magentaBright(metaCommand);
        const args = hasArgs ? picocolors.yellowBright(argsString) : "";

        return createProcessError(
          `${cmd}${args ? " " + args : ""} ${picocolors.redBright(msg)}`,
          {
            ...meta,
            command: commandString
          },
          baseStack
        );
      }

      return createProcessError(
        `${commandString} ${msg}`,
        {
          ...meta,
          command: commandString
        },
        baseStack
      );
    });

  const rejectOnNonZero = config?.rejectOnNonZero ?? false;

  if (isInline) {
    const resolved = resolveCommand(cmd, useColors);
    cmd = resolved.command;
    finalArgs = resolved.args;
  }

  for (const arg of finalArgs) {
    if (hasShellSyntax(arg)) {
      throw new Error(
        formatMessageColor(
          `Invalid argument: "${arg}" contains unsupported shell syntax`,
          useColors
        )
      );
    }
  }

  const cmdString = formatCommand(cmd, finalArgs, { useColors });
  const cmdStringPlain = formatCommand(cmd, finalArgs, {
    useColors: false
  });

  const child = spawn(cmd, finalArgs, { shell, ...restOption });

  let finished = false;

  const kill = () => {
    try {
      if (process.platform === "win32") {
        if (forceKill && child.pid) {
          spawn("taskkill", ["/pid", String(child.pid), "/f", "/t"]);
        } else {
          child.kill();
        }
      } else {
        child.kill("SIGTERM");
      }
    } catch {
      // noop
    }
  };

  return {
    /** ----------------------------------------------------------------
     * * ***The spawned child process instance.***
     * ----------------------------------------------------------------
     *
     * Direct access to the underlying {@link ChildProcess | `ChildProcess`}.
     *
     * Can be used for:
     * - Accessing `pid`
     * - Listening to additional events
     * - Manual stream handling (`stdout`, `stderr`)
     */
    child,

    /** ----------------------------------------------------------------
     * * ***Terminate the running process.***
     * ----------------------------------------------------------------
     *
     * Sends a termination signal to the process:
     * - On Windows:
     *    - Uses `taskkill /f /t` when `forceKill` is enabled.
     *    - Otherwise uses `child.kill()`.
     * - On other platforms:
     *    - Sends `SIGTERM`.
     *
     * Safe to call multiple times.
     */
    kill,

    /** ----------------------------------------------------------------
     * * ***Formatted command string.***
     * ----------------------------------------------------------------
     *
     * Human-readable representation of the executed command.
     *
     * - May include colors depending on configuration.
     * - Intended for logging and debugging.
     *
     * @example
     * ```ts
     * console.log(cmdString);
     * ```
     */
    cmdString,

    /** ----------------------------------------------------------------
     * * ***Formatted command string (plain, no colors).***
     * ----------------------------------------------------------------
     *
     * Human-readable representation of the executed command
     * without any color formatting.
     *
     * - Safe for logging, serialization, and error metadata.
     * - Used internally for structured error information.
     * - Unlike `cmdString`, this value never includes ANSI color codes.
     *
     * @example
     * ```ts
     * console.log(cmdStringPlain);
     * ```
     */
    cmdStringPlain,

    /** ----------------------------------------------------------------
     * * ***Attach lifecycle handlers to the spawned process.***
     * ----------------------------------------------------------------
     *
     * Registers callbacks to handle the process lifecycle in a safe,
     * single-resolution manner.
     *
     * This method ensures that only one terminal state is triggered:
     * either success or failure.
     *
     * ---
     *
     * #### Success
     * Calls `onSuccess(code)` when:
     * - The process exits normally.
     * - No termination signal is received.
     * - Exit code is `0`, or `rejectOnNonZero` is disabled.
     *
     * ---
     *
     * #### Failure
     * Calls `onError(error)` when:
     * - A spawn error occurs.
     * - The process is aborted via `AbortSignal`.
     * - The process is terminated by a signal.
     * - A timeout is reached.
     * - Exit code is non-zero and `rejectOnNonZero` is enabled.
     *
     * ---
     *
     * #### Error metadata
     * The error may include additional properties:
     * - `reason` ➔ `"timeout" | "abort" | "signal" | "non-zero exit code"`.
     * - `exitCode` ➔ exit code (if available).
     * - `signal` ➔ termination signal (if any).
     * - `command` ➔ executed command (plain, no colors).
     *
     * ---
     *
     * @param handlers Lifecycle callbacks.
     * @param handlers.onSuccess Called when the process completes successfully.
     * @param handlers.onError Called when the process fails or is terminated.
     *
     * @example
     * ```ts
     * const { setupLifecycle } = spawnWithLifecycle("node", ["script.js"], options);
     *
     * setupLifecycle({
     *   onSuccess(code) {
     *     console.log("Done:", code);
     *   },
     *   onError(err) {
     *     console.error("Failed:", err);
     *   }
     * });
     * ```
     */
    setupLifecycle({
      onSuccess,
      onError
    }: {
      /** ----------------------------------------------------------------
       * * ***Called when the process completes successfully.***
       * ----------------------------------------------------------------
       *
       * Invoked when:
       * - The process exits normally.
       * - No termination signal is received.
       * - Exit code is `0`, or `rejectOnNonZero` is disabled.
       *
       * @param code The process exit code.
       */
      onSuccess: (
        /** The process exit code. */
        code: number
      ) => void;

      /** ----------------------------------------------------------------
       * * ***Called when the process fails or is terminated.***
       * ----------------------------------------------------------------
       *
       * Invoked when:
       * - A spawn error occurs.
       * - The process is aborted.
       * - The process is terminated by a signal.
       * - A timeout is reached.
       * - Exit code is non-zero and `rejectOnNonZero` is enabled.
       *
       * The error may include additional metadata such as:
       * - `reason`.
       * - `exitCode`.
       * - `signal`.
       * - `command`.
       *
       * @param error The error describing the failure.
       */
      onError: (
        /** The error describing the failure. */
        error: CommandProcessError | Error
      ) => void;
    }) {
      const timeoutId =
        timeout != null
          ? setTimeout(() => {
              if (finished) return;
              kill();
              fail(
                formatError(`timed out after ${timeout}ms`, {
                  reason: "timeout",
                  command: cmd,
                  args: finalArgs,
                  useColors
                })
              );
            }, timeout)
          : null;

      const cleanup = () => {
        finished = true;
        if (abortSignal) {
          abortSignal.removeEventListener("abort", onAbort);
        }
        if (timeoutId) clearTimeout(timeoutId);
      };

      const fail = (err: Error) => {
        if (finished) return;
        cleanup();
        onError(err);
      };

      const succeed = (code: number) => {
        if (finished) return;
        cleanup();
        onSuccess(code);
      };

      const onAbort = () => {
        if (finished) return;
        kill();
        fail(
          formatError("aborted by signal", {
            reason: "abort",
            command: cmd,
            args: finalArgs,
            useColors
          })
        );
      };

      if (abortSignal) {
        if (abortSignal.aborted) {
          onAbort();
          return;
        }
        abortSignal.addEventListener("abort", onAbort);
      }

      child.once("error", fail);

      child.once("close", (code, signal) => {
        if (signal) {
          fail(
            formatError(`terminated by ${signal}`, {
              reason: "signal",
              signal,
              exitCode: code ?? undefined,
              command: cmd,
              args: finalArgs,
              useColors
            })
          );
          return;
        }

        const exitCode = code ?? 0;

        if (rejectOnNonZero && exitCode !== 0) {
          fail(
            formatError(`exited with code ${exitCode}`, {
              reason: "non-zero exit code",
              exitCode,
              command: cmd,
              args: finalArgs,
              useColors
            })
          );
          return;
        }

        succeed(exitCode);
      });
    }
  };
}
