import { InvalidArgumentError } from "commander";

/** ----------------------------------------------------------------
 * * ***Error thrown when an argument fails validation.***
 * ----------------------------------------------------------------
 */
export class CliInvalidArgumentError extends InvalidArgumentError {
  constructor(message: string) {
    super(message);
  }
}
