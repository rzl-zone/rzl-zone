import { Help } from "commander";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CliCommand } from "./command";

/** ----------------------------------------------------------------
 * * ***Commander help system class.***
 * ----------------------------------------------------------------
 *
 * Extends Commander’s {@link Help | **`Help`**} class
 * and allows customization of CLI help output,
 * formatting behavior, and command listing.
 *
 * This class can be used to override the default
 * help renderer used by {@link CliCommand | `CliCommand`}.
 */
export class CliHelp extends Help {
  constructor() {
    super();
  }
}
