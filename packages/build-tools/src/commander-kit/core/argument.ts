import { Argument } from "commander";

/** ----------------------------------------------------------------
 * * ***Command-line argument definition class.***
 * ----------------------------------------------------------------
 *
 * Represents a positional CLI argument definition.
 *
 * This class extends Commander’s {@link Argument | **`Argument`**}
 * and is provided to ensure compatibility with the
 * additional types and utilities exposed by this library.
 */
export class CliArgument extends Argument {
  constructor(arg: string, description?: string) {
    super(arg, description);
  }
}
