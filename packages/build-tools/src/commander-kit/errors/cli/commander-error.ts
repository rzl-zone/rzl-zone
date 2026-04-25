import type { CommanderErrorCode } from "@/commander-kit/types";

import { CommanderError } from "commander";

/** ----------------------------------------------------------------
 * * ***Commander base error class.***
 * ----------------------------------------------------------------
 *
 * Base error thrown internally by Commander when CLI
 * parsing or execution fails.
 */
export class CliCommanderError extends CommanderError {
  constructor(exitCode: number, code: CommanderErrorCode, message: string) {
    super(exitCode, code, message);
  }
}
