import type { Command } from "commander";

import type { CommandContext } from "@/commander-kit/types";

import { isBoolean, isNil, isNonEmptyString } from "@/_internal/utils/helper";

import { ConfigurationError } from "@/utils/errors";

import {
  resolveFactoryOriginErrorSuffix,
  resolveInstanceOriginErrorSuffix
} from "@/commander-kit/_internal/helpers/error-formatters";
import { getInternalState } from "@/commander-kit/_internal/state";

import { CliCommand } from "@/commander-kit/core/command";
import { COMMANDER_UI_DEFAULTS } from "@/commander-kit/constants";

const { DESCRIPTIONS, FLAGS } = COMMANDER_UI_DEFAULTS;

/** ----------------------------------------------------------------
 * Intercepts `.helpOption()` to track:
 *  - custom flags.
 *  - custom description.
 *  - disabled state.
 *
 * This enables UI-aware error rendering without accessing
 * Commander private properties.
 *
 * ----------------------------------------------------------------
 * @internal
 */
export function interceptHelp(cmd: CommandContext) {
  function resetInternalHelpState(cmd: CommandContext) {
    getInternalState(cmd).help = undefined;
  }

  const original = cmd.helpOption.bind(cmd);

  cmd.helpOption = function (
    flags?: string | boolean,
    description?: string
  ): CliCommand | Command {
    const errorMessageByFactory = resolveFactoryOriginErrorSuffix(cmd);
    const errorMessageInstance = resolveInstanceOriginErrorSuffix(cmd);

    if (!isNil(flags) && !isNonEmptyString(flags) && !isBoolean(flags)) {
      resetInternalHelpState(cmd);

      throw ConfigurationError.type(
        "flags",
        "a non-empty string or a boolean",
        flags,
        `'${errorMessageInstance}.helpOption'${errorMessageByFactory}`
      );
    }

    if (!isNil(description) && !isNonEmptyString(description)) {
      resetInternalHelpState(cmd);

      throw ConfigurationError.type(
        "description",
        "a non-empty string if provided",
        description,
        `'${errorMessageInstance}.helpOption'${errorMessageByFactory}`
      );
    }

    const _decs = isNonEmptyString(description)
      ? description
      : DESCRIPTIONS.HELP;

    if (flags === false) {
      getInternalState(cmd).help = {
        disabled: true
      };
      return original(flags);
    }

    if (flags === true) {
      getInternalState(cmd).help = {
        flags: FLAGS.HELP,
        description: _decs,
        disabled: false
      };
      return original(flags, _decs);
    }

    if (isNonEmptyString(flags)) {
      getInternalState(cmd).help = {
        flags,
        description: _decs,
        disabled: false
      };
      return original(flags, _decs);
    }

    return original(flags, _decs);
  };
}
