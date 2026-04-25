import { InvalidOptionArgumentError } from "commander";

/** ----------------------------------------------------------------
 * * ***Error thrown when an option argument fails validation.***
 * ----------------------------------------------------------------
 */
export class CliInvalidOptionArgumentError extends InvalidOptionArgumentError {
  constructor(message: string) {
    super(message);
  }
}
