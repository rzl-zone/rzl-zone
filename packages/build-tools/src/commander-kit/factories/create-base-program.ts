import "@rzl-zone/node-only";

import type {
  CommanderInternalState,
  CommanderUiOptions
} from "@/commander-kit/types";

import { isExactInstanceOf } from "@/utils/helper/class-check";
import { joinLinesLoose, ConfigurationError } from "@/utils/client";

import { StyledHelp } from "../_internal/help/styled-help";
import { interceptUsage } from "../_internal/interceptor/usage";
import { interceptHelp } from "../_internal/interceptor/help";
import { interceptVersion } from "../_internal/interceptor/version";
import { composeVersionDescription } from "../_internal/helpers/versions";
import { createDefaultInternalState, createUIState } from "../_internal/state";
import { resolveBaseProgramPresentationMeta } from "../_internal/helpers/base-program";
import { installParseVersionInterceptor } from "../_internal/interceptor/install-parse-version";

import { CliCommand } from "../core/command";
import { CommandIdentity } from "../identity";
import { applyCommanderUi } from "../ui/apply-commander-ui";
import { handleCommanderExit } from "../lifecycle/handle-commander-exit";

/** ----------------------------------------------------------------
 * * ***Internal base program implementation.***
 * ----------------------------------------------------------------
 *
 * Internal extension of {@link CliCommand | `CliCommand`}
 * used by {@link createBaseProgram | `createBaseProgram()`}.
 *
 * This class stores additional internal state required
 * for UI formatting, version injection, and command
 * lifecycle behavior.
 */
export class CommandBaseProgram extends CliCommand {
  /** ----------------------------------------------------------------
   * * ***Internal mutable state container used by the CLI runtime.***
   * ----------------------------------------------------------------
   *
   * Stores metadata required during program bootstrap and
   * command execution such as UI configuration, version
   * injection, and identity metadata.
   *
   * This state should only be modified through
   * {@link _setInternalState | `_setInternalState`}.
   *
   * @internal
   */
  private _internalStateData: CommanderInternalState;

  constructor(name?: string) {
    super(name);

    this._internalStateData = createDefaultInternalState();
  }

  /** ----------------------------------------------------------------
   * * ***Access the internal CLI state container.***
   * ----------------------------------------------------------------
   *
   * Returns a readonly view of the internal state used
   * by the program runtime.
   *
   * This accessor is intended for internal helpers and
   * framework utilities.
   *
   * @internal
   */
  get _internalState(): Readonly<CommanderInternalState> {
    return this._internalStateData;
  }

  /** ----------------------------------------------------------------
   * * ***Replace the current internal state container.***
   * ----------------------------------------------------------------
   *
   * This method is primarily used during program bootstrap
   * to initialize or update runtime metadata.
   *
   * External consumers should never call this method directly.
   *
   * @internal
   */
  _setInternalState(state: CommanderInternalState) {
    this._internalStateData = state;
  }

  /** ----------------------------------------------------------------
   * * ***Create subcommand instance.***
   * ----------------------------------------------------------------
   *
   * Overrides Commander’s internal command factory so
   * all nested commands are instances of
   * {@link CommandBaseProgram | `CommandBaseProgram`}.
   *
   * This ensures that internal state and runtime
   * extensions propagate to all subcommands.
   *
   * @internal
   */
  override createCommand(name?: string): CommandBaseProgram;
  override createCommand(name?: string): CommandBaseProgram {
    const sub = new CommandBaseProgram(name);

    sub._setInternalState({
      ...this._internalState
    });

    return sub;
  }
}

/** ----------------------------------------------------------------
 * * ***Configuration options for `createBaseProgram()`.***
 * ----------------------------------------------------------------
 *
 * Defines the bootstrap configuration used when creating
 * a pre-configured Commander program instance.
 *
 * - ***This type supports:***
 *      - direct property overrides.
 *      - centralized configuration via
 *        {@link CommandIdentity | `CommandIdentity`}.
 *      - optional CLI UI customization.
 *
 * ----------------------------------------------------------------
 * #### Resolution Priority.
 * ----------------------------------------------------------------
 *
 * When both explicit fields and `commandIdentity` are provided,
 * values are resolved in the following order:
 *
 *  * `explicit option` ➔ {@link CreateBaseProgramOptions.commandIdentity |`commandIdentity`} ➔ `internal defaults`.
 *
 * This ensures predictable override behavior.
 *
 * ----------------------------------------------------------------
 */
export type CreateBaseProgramOptions = {
  /** ----------------------------------------------------------------
   * * ***CLI program name.***
   * ----------------------------------------------------------------
   *
   * Name assigned to the Commander instance.
   *
   * Overrides {@link CommandIdentity.commandName | `commandIdentity.commandName`} when provided.
   *
   * ----------------------------------------------------------------
   */
  cliName?: string;

  /** ----------------------------------------------------------------
   * * ***Package name.***
   * ----------------------------------------------------------------
   *
   * Package name displayed in the version description.
   *
   * Overrides {@link CommandIdentity.packageName | `commandIdentity.packageName`} when provided.
   *
   * Defaults to the internally resolved package name
   * when omitted.
   *
   * ----------------------------------------------------------------
   */
  packageName?: string;

  /** ----------------------------------------------------------------
   * * ***Package version.***
   * ----------------------------------------------------------------
   *
   * Version string passed to {@link CliCommand.version `.version()`}.
   *
   * Overrides {@link CommandIdentity.version | `commandIdentity.version`} when provided.
   *
   * Defaults to the internally resolved package version
   * when omitted.
   *
   * ----------------------------------------------------------------
   */
  packageVersion?: string;

  /** ----------------------------------------------------------------
   * * ***Commander UI configuration.***
   * ----------------------------------------------------------------
   *
   * Inline UI configuration via `ui` option.
   *
   * UI initialization is resolved using the following priority:
   *
   * 1. When `ui.usage` is defined,
   *    full UI customization is triggered and strict validation is enforced.
   *
   * 2. Otherwise, if {@link CommandIdentity | `commandIdentity`} is provided,
   *    UI is initialized using the identity title.
   *
   * 3. Otherwise, if `ui.title` is defined and valid,
   *    UI is initialized using the provided title only.
   *
   * When full UI customization is triggered (case #1),
   * the following validations are enforced:
   *
   * - The UI object must be non-null.
   * - `title` must be a non-empty string when provided.
   * - `usage` must be a non-empty string when provided.
   *
   * In partial initialization cases (#2 and #3),
   * usage falls back to {@link CliCommand | `CliCommand`} default resolution.
   *
   * @note
   * ⚠️ If validation fails, a structured configuration error may be thrown.
   *
   * ----------------------------------------------------------------
   */
  ui?: CommanderUiOptions;

  /** ----------------------------------------------------------------
   * * ***Command identity source.***
   * ----------------------------------------------------------------
   *
   * Optional {@link CommandIdentity | `CommandIdentity`} instance used as a centralized
   * configuration source for:
   *
   * - Command name.
   * - Package name.
   * - Version metadata.
   *
   * When provided, this identity may also participate in UI initialization.
   *
   * If full UI configuration is not supplied via `ui`,
   * the identity title may be used to bootstrap
   * {@link applyCommanderUi | `applyCommanderUi()`}.
   *
   * This reduces the need for manual property mapping
   * and provides a consistent identity-driven configuration pattern.
   *
   * @throws {TypeError}
   * Thrown if the provided value is not an instance of
   * {@link CommandIdentity | `CommandIdentity`}.
   *
   * ----------------------------------------------------------------
   */
  commandIdentity?: CommandIdentity;
};

/** ----------------------------------------------------------------
 * * ***Creates a pre-configured Commander.js program instance.***
 * ----------------------------------------------------------------
 *
 * Factory function that returns a fresh {@link CliCommand | `CliCommand`} instance
 * with shared base configuration applied.
 *
 * - *This helper centralizes common CLI setup to ensure:*
 *    - Consistent version formatting.
 *    - Standardized exit behavior.
 *    - No shared mutable state between entry points.
 *
 * The returned {@link CliCommand | `CliCommand`} instance is stateful and fully mutable.
 *
 * *Additional configuration (including UI customization) may be applied after creation.*
 *
 * ----------------------------------------------------------------
 * #### Configuration Resolution.
 * ----------------------------------------------------------------
 *
 * When both explicit options and {@link CommandIdentity | `CommandIdentity`} are provided,
 * values are resolved using the following priority:
 *
 *  * `explicit option` ➔ `commandIdentity` ➔ `internal defaults`.
 *
 * This allows granular overrides while still supporting
 * {@link CommandIdentity | `CommandIdentity`} as a single source of truth.
 *
 * ----------------------------------------------------------------
 * #### UI Configuration.
 * ----------------------------------------------------------------
 *
 * UI customization can be applied using two approaches:
 *
 * 1. Inline via the `ui` option.
 *      - During initialization, {@link applyCommanderUi | `applyCommanderUi()`}
 *        may be invoked automatically using the following priority:
 *         - Full UI override when `options.ui.usage` is defined.
 *         - Fallback to {@link CommandIdentity | `commandIdentity`} when provided.
 *         - Fallback to `options.ui.title` when provided or valid.
 *
 *      - In partial initialization cases, usage falls back to
 *        {@link CliCommand | `CliCommand`} default resolution.
 *
 * 2. Manually after creation.
 *      - You may call {@link applyCommanderUi | `applyCommanderUi()`}
 *      explicitly to override or apply custom UI behavior.
 *
 *      - Calling {@link applyCommanderUi | `applyCommanderUi()`} manually after initialization will
 *        override any previously applied UI configuration.
 *
 * ----------------------------------------------------------------
 *
 * @param options Optional bootstrap configuration.
 *
 * @returns A configured {@link CliCommand | `CliCommand`} instance with version,
 * exit override, and optional UI behavior applied.
 *
 * ----------------------------------------------------------------
 * @example
 *
 * **Using commandIdentity as primary source ***(recommended)***:**
 *
 * ```ts
 * import { joinInline, picocolors } from "@rzl-zone/build-tools/utils";
 * import { createBaseProgram, CommandIdentity } from "@rzl-zone/build-tools/utils/server";
 *
 * const identity = new CommandIdentity({
 *   defaultCommandName: "my-command-cli"
 * })
 *   // override to your-package-name, e.g:
 *   .setPackageName("your-package-name")
 *   // override to your-package-version, e.g:
 *   .setVersion("1.1.1");
 *
 * const program = createBaseProgram({
 *   commandIdentity: identity,
 *   ui: {
 *     title: identity.cli(),
 *     usage: joinInline(
 *       picocolors.cyan(identity.commandName),
 *       picocolors.gray("<glob...>"),
 *       picocolors.blueBright("[options]")
 *     )
 *   }
 * });
 *
 * program.parse();
 * ```
 * ----------------------------------------------------------------
 * @example
 *
 * **Automatic UI configuration ***(manual mapping)***:**
 *
 * ```ts
 * import { joinInline, picocolors } from "@rzl-zone/build-tools/utils";
 * import { createBaseProgram, CommandIdentity } from "@rzl-zone/build-tools/utils/server";
 *
 * const commandTitle = new CommandIdentity({
 *   defaultCommandName: "clean-js-build-artifacts"
 * })
 *   // override to your-package-name, e.g:
 *   .setPackageName("your-package-name")
 *   // override to your-package-version, e.g:
 *   .setVersion("1.1.1");
 *
 * const program = createBaseProgram({
 *   cliName: commandTitle.commandName,
 *   packageName: commandTitle.packageName,
 *   packageVersion: commandTitle.version,
 *   ui: {
 *     title: commandTitle.cli(),
 *     usage: joinInline(
 *       picocolors.cyan(commandTitle.commandName),
 *       picocolors.gray("<glob...>"),
 *       picocolors.blueBright("[options]")
 *     )
 *   }
 * });
 *
 * program.parse();
 * ```
 * ----------------------------------------------------------------
 * @example
 *
 * **Manual UI override after creation:**
 *
 * ```ts
 * import { joinInline, picocolors } from "@rzl-zone/build-tools/utils";
 * import { createBaseProgram, CommandIdentity } from "@rzl-zone/build-tools/utils/server";
 *
 * const identity = new CommandIdentity({
 *   defaultCommandName: "my-command-cli"
 * });
 *
 * const baseProgram = createBaseProgram({
 *   commandIdentity: identity
 * });
 *
 * const program = applyCommanderUi(baseProgram, {
 *   title: identity.cli(),
 *   usage: joinInline(
 *     picocolors.cyan(identity.commandName),
 *     picocolors.gray("<glob...>"),
 *     picocolors.blueBright("[options]")
 *   )
 * });
 *
 * program.parse();
 * ```
 * ----------------------------------------------------------------
 */
export function createBaseProgram(
  options: CreateBaseProgramOptions = {}
): CommandBaseProgram {
  if (
    options.commandIdentity &&
    !isExactInstanceOf(options.commandIdentity, CommandIdentity)
  ) {
    throw ConfigurationError.type(
      "options.commandIdentity",
      "instanceof CommandIdentity",
      options.commandIdentity,
      "createBaseProgram"
    );
  }

  const {
    commandTitle,
    defaultTitleFormatted,
    normalizedVersion,
    pkgNameFormatted,
    resolvedCliName,
    resolvedPackageName
  } = resolveBaseProgramPresentationMeta(options);

  const cmd = new CommandBaseProgram(resolvedCliName);

  cmd._setInternalState({
    ...createDefaultInternalState(),
    ui: createUIState(options.ui || {}),
    packageName: resolvedPackageName
  });

  //todo: Intercept manual .usage()
  interceptUsage(cmd);
  //todo: Intercept manual .helpOption()
  interceptHelp(cmd);
  //todo: Intercept manual .version()
  interceptVersion(cmd, composeVersionDescription(pkgNameFormatted));

  cmd.createHelp = () => new StyledHelp();

  cmd.addHelpText(
    "before",
    joinLinesLoose("", commandTitle ?? defaultTitleFormatted, "")
  );

  cmd.exitOverride(handleCommanderExit);

  const cmdApplyUi = applyCommanderUi(cmd, {
    title: commandTitle,
    usage: options.ui?.usage,
    __commandName: resolvedCliName
  });

  installParseVersionInterceptor(cmdApplyUi, {
    versionInjection: { normalizedVersion, pkgNameFormatted }
  });

  return cmdApplyUi;
}
