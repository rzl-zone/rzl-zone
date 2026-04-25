import type { CommanderInternalState } from ".";
import type { COMMANDER_INTERNAL_SYMBOL } from "../_internal/state";

declare module "commander" {
  interface Command {
    /** @internal */
    [COMMANDER_INTERNAL_SYMBOL]?: CommanderInternalState;
  }
}
