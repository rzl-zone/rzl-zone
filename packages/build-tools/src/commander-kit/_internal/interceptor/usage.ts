import type { Command } from "commander";

import type { CommandContext } from "@/commander-kit/types";

import { isNil, isNonEmptyString } from "@/_internal/utils/helper";
import { ConfigurationError } from "@/utils/errors";

import {
  resolveFactoryOriginErrorSuffix,
  resolveInstanceOriginErrorSuffix
} from "@/commander-kit/_internal/helpers/error-formatters";
import { getInternalState } from "@/commander-kit/_internal/state";

/** ----------------------------------------------------------------
 * Intercepts `.usage()` calls to capture manual overrides
 * for later resolution inside `Help` and error output.
 *
 * This preserves original Commander behavior while allowing
 * custom resolution priority.
 *
 * ----------------------------------------------------------------
 * @internal
 */
export function interceptUsage(cmd: CommandContext) {
  const originalUsage = cmd.usage.bind(cmd);

  function usage(str: string | false): Command;
  function usage(): string;
  function usage(str?: string | false): string | Command {
    if (!isNil(str)) {
      // disable manual usage override
      if (str === false) {
        getInternalState(cmd).manualUsage = undefined;
        getInternalState(cmd).disableUsage = true;

        return cmd;
      }

      if (!isNonEmptyString(str)) {
        const errorMessageByFactory = resolveFactoryOriginErrorSuffix(cmd);
        const errorMessageInstance = resolveInstanceOriginErrorSuffix(cmd);

        throw ConfigurationError.type(
          "usage",
          "a non-empty string or `false` only",
          str,
          `'${errorMessageInstance}.usage'${errorMessageByFactory}`
        );
      }

      getInternalState(cmd).manualUsage = str;
      return originalUsage(str);
    }

    return originalUsage();
  }

  cmd.usage = usage;
}
