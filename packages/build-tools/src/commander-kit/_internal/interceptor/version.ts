import type { Command } from "commander";

import type { CommandContext } from "@/commander-kit/types";

import { isNil, isNonEmptyString } from "@/_internal/utils/helper";

import { ConfigurationError } from "@/utils/errors";

import {
  resolveFactoryOriginErrorSuffix,
  resolveInstanceOriginErrorSuffix
} from "@/commander-kit/_internal/helpers/error-formatters";
import { getInternalState } from "@/commander-kit/_internal/state";

import { CliCommand } from "@/commander-kit/core/command";
import { COMMANDER_UI_DEFAULTS } from "@/commander-kit/constants";

const { FLAGS } = COMMANDER_UI_DEFAULTS;

/** ------------------------------------------------------------------------
 * * Intercepts `.version()` to capture manual overrides.
 * ------------------------------------------------------------------------
 *
 * Wraps the original Commander {@link CliCommand.version | `Command.version`}
 * method in order to:
 *
 * - Capture user-provided version metadata.
 * - Store it inside internal state.
 * - Preserve original Commander behavior.
 * - Enable custom resolution priority during presentation rendering.
 *
 * This interceptor allows `createBaseProgram`, `CliHelp`, and
 * error rendering layers to resolve version information lazily
 * and consistently — without relying on Commander’s internal
 * state alone.
 *
 * ------------------------------------------------------------------------
 *
 * - ***Behavior:***
 *    - Preserves the original `.version()` binding.
 *    - Stores the original method reference in internal state as
 *      `versionOriginal`.
 *    - Supports both Commander overload signatures:
 *
 *      - Getter: `command.version()`.
 *      - Setter: `command.version(value, flags?, description?)`.
 *
 *    - Validates input types before delegating to Commander.
 *    - Injects default flags and description when omitted.
 *    - Marks `versionSetByUser = true` to influence resolution priority.
 *    - Delegates to the original Commander `.version()` implementation.
 *
 * ------------------------------------------------------------------------
 *
 * - ***Resolution Priority Impact:***
 *    - **When this interceptor is installed, version resolution
 *      priority becomes:**
 *        1. User-set version via intercepted `.version()`.
 *        2. Factory-level version (from `createBaseProgram`).
 *        3. `package.json` version fallback.
 *
 *    - **This enables consistent and predictable version display across:**
 *        - Styled help output.
 *        - Header rendering.
 *        - Error messages.
 *        - Manual version flag execution.
 *
 * ------------------------------------------------------------------------
 *
 * - ***⚠️ Important Notes:***
 *    - Mutates the provided command instance.
 *    - Should only be installed once per command.
 *    - Designed strictly for internal orchestration.
 *    - Does not change Commander execution semantics.
 *
 * ------------------------------------------------------------------------
 *
 * @param cmd - Internal command instance to intercept.
 * @param versionDescription - Default description used when the user
 * does not provide one explicitly.
 *
 * @internal
 */
export function interceptVersion(
  cmd: CommandContext,
  versionDescription: string
) {
  const originalVersion = cmd.version.bind(cmd);

  getInternalState(cmd).versionOriginal = originalVersion;

  function version(
    value: string,
    flags?: string,
    description?: string
  ): CliCommand | Command;
  function version(value: false): CliCommand | Command;
  function version(): string | undefined;
  function version(
    value?: string | false,
    flags?: string,
    description?: string
  ): CliCommand | Command | string | undefined {
    if (arguments.length === 0) return originalVersion();

    if (value === false) {
      getInternalState(cmd).versionDisable = true;
      // getInternalState(cmd).versionSetByUser = true;
      getInternalState(cmd).versionOriginal = undefined;

      return cmd;
    }

    const errorMessageByFactory = resolveFactoryOriginErrorSuffix(cmd);
    const errorMessageInstance = resolveInstanceOriginErrorSuffix(cmd);

    if (!isNonEmptyString(value)) {
      throw ConfigurationError.type(
        "str",
        "a non-empty string",
        value,
        `'${errorMessageInstance}.version'${errorMessageByFactory}`
      );
    }

    if (!isNil(flags) && !isNonEmptyString(flags)) {
      throw ConfigurationError.type(
        "flags",
        "a non-empty string if provided",
        flags,
        `'${errorMessageInstance}.version'${errorMessageByFactory}`
      );
    }

    if (!isNil(description) && !isNonEmptyString(description)) {
      throw ConfigurationError.type(
        "description",
        "a non-empty string if provided",
        description,
        `'${errorMessageInstance}.version'${errorMessageByFactory}`
      );
    }

    const _flag = isNonEmptyString(flags) ? flags : FLAGS.VERSION;
    const _decs = isNonEmptyString(description)
      ? description
      : versionDescription;

    getInternalState(cmd).versionMeta = {
      value,
      flags: _flag,
      description: _decs
    };

    getInternalState(cmd).versionSetByUser = true;

    return originalVersion(value, _flag, _decs);
  }

  cmd.version = version;
}
