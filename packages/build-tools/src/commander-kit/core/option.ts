import { Option } from "commander";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CliCommand } from "./command";

/** ----------------------------------------------------------------
 * * ***Command-line option definition class.***
 * ----------------------------------------------------------------
 *
 * Represents a CLI option or flag definition.
 *
 * This class extends Commander’s {@link Option | **`Option`**}
 * and provides the standard option behavior used
 * by {@link CliCommand | `CliCommand`}.
 *
 * - ***Supports:***
 *       - short and long flags.
 *       - default values.
 *       - variadic arguments.
 *       - custom parsing logic.
 */
export class CliOption extends Option {
  constructor(arg: string, description?: string) {
    super(arg, description);
  }
}
