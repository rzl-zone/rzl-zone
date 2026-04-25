import type { TypedCommanderError } from "@/commander-kit/types";

import { CommanderError } from "commander";

/** ------------------------------------------------------------------------
 * * Runtime type guard for {@link CommanderError | `CommanderError`}.
 * ------------------------------------------------------------------------
 *
 * Determines whether a given unknown value is an instance of
 * {@link CommanderError | `CommanderError`} and **narrows the `code` property** to the
 * library-specific {@link CommanderErrorCode | `CommanderErrorCode`} union type.
 *
 * This helper exists because the upstream Commander type defines
 * `CommanderError.code` as a plain `string`.
 *
 * As a result, TypeScript cannot automatically infer the narrowed error code type when using
 * `instanceof CommanderError`.
 *
 * By using this guard, consumers can safely treat the error as a
 * `CommanderError` with a strongly typed `code` value.
 *
 * ------------------------------------------------------------------------
 * #### Behavior
 * ------------------------------------------------------------------------
 *
 * - Returns **`true`** if `err` is an instance of {@link CommanderError | `CommanderError`}.
 * - When `true`, the value is narrowed to:
 *    `CommanderError & { code: CommanderErrorCode }`
 *
 * - Returns **`false`** for all other values.
 *
 * This enables safe access to `err.code` with the expected
 * {@link CommanderErrorCode | `CommanderErrorCode`} union type.
 *
 * ------------------------------------------------------------------------
 * @param err - The value to test.
 *
 * @returns `true` if the value is a {@link CommanderError | `CommanderError`}; otherwise `false`.
 *
 * ------------------------------------------------------------------------
 * @example
 * ```ts
 * try {
 *   program.parse();
 * } catch (err) {
 *   if (isCommanderError(err)) {
 *     // err.code is now typed as CommanderErrorCode
 *     return err.code;
 *   }
 *
 *   console.error(String(err));
 *   process.exit(1);
 * }
 * ```
 */
export function isCommanderError(err: unknown): err is TypedCommanderError {
  return err instanceof CommanderError;
}

/** @deprecated */
export type CommanderErrorInstanceType = CommanderError;
