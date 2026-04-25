import "@rzl-zone/node-only";

import type { CommandContext, CommanderUiOptions } from "@/commander-kit/types";

import { Command } from "commander";

import { isNonEmptyString } from "@/_internal/utils/helper";

import { ICONS } from "@/utils/server";
import { isExactInstanceOf } from "@/utils/helper/class-check";
import { joinLinesLoose, picocolors, ConfigurationError } from "@/utils/client";

import { resolveCliPresentationMeta } from "../_internal/helpers/apply-commander-ui";
import { composeVersionDescription } from "../_internal/helpers/versions";

import { interceptHelp } from "../_internal/interceptor/help";
import { installParseVersionInterceptor } from "../_internal/interceptor/install-parse-version";
import { interceptUsage } from "../_internal/interceptor/usage";
import { interceptVersion } from "../_internal/interceptor/version";

import { StyledHelp } from "../_internal/help/styled-help";
import { getInternalState, setInternalUiState } from "../_internal/state";

import { CliCommand } from "../core/command";
import { handleCommanderExit } from "../lifecycle/handle-commander-exit";
import {
  CommandBaseProgram,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createBaseProgram
} from "../factories/create-base-program";

/** ------------------------------------------------------------------------
 * * Applies a structured UI layer to a Commander.js program instance.
 * ------------------------------------------------------------------------
 *
 * Enhances a Commander program by installing a standardized UI layer
 * for error rendering and presentation formatting.
 *
 * This function is primarily intended for native
 * {@link Command | `Command`} instances created directly
 * from Commander (e.g. `new Command()` or an imported `program` singleton).
 *
 * Programs created via
 * {@link createBaseProgram | `createBaseProgram()`}
 * already include the structured UI layer by default, in such cases, calling
 * this function is typically unnecessary and **redundant interception** also
 * is **not recommended**.
 *
 * ------------------------------------------------------------------------
 * #### Supported Program Types.
 * ------------------------------------------------------------------------
 *
 * **1.** Factory-based:
 *  ```ts
 *    import {
 *      applyCommanderUi,
 *      createBaseProgram
 *    } from "@rzl-zone/build-tools/commander-kit";
 *
 *    const programFactory = createBaseProgram();
 *    const program = applyCommanderUi(programFactory);
 *  ```
 *
 * **2.** Native Commander instance:
 *  ```ts
 *    import { Command } from "commander"
 *    import { applyCommanderUi } from "@rzl-zone/build-tools/commander-kit";
 *
 *    const nativeProgram = new Command();
 *    const program = applyCommanderUi(nativeProgram);
 *  ```
 *
 * When used with {@link createBaseProgram | `createBaseProgram`}, certain
 * interception steps are skipped because the factory already installs baseline
 * behavior and internal state wiring.
 *
 * When used with a plain {@link Command | `Command`} instance created directly
 * from Commander (e.g. `new Command()` or an imported `program` singleton), this
 * function installs all required interception and metadata tracking layers.
 *
 * - *In short:*
 *       - Programs created via `createBaseProgram()` already include
 *         foundational behavior.
 *       - Native Commander instances are fully instrumented by this function.
 *
 * ------------------------------------------------------------------------
 * #### Factory Integration.
 * ------------------------------------------------------------------------
 *
 * Programs created via {@link createBaseProgram | `createBaseProgram()`}
 * already include the structured UI layer by default.
 *
 * In such cases, calling `applyCommanderUi()` manually is unnecessary
 * and generally not recommended.
 *
 * - ***The factory installs:***
 *       - Internal state wiring.
 *       - Error interception.
 *       - Help customization.
 *       - Version handling lifecycle.
 *
 * ***`applyCommanderUi()` primarily exists to instrument native
 * {@link Command | `Command`}, or {@link CliCommand | `CliCommand`}
 * instances that were not created through the factory.***
 *
 * If the program instance was created via **`createBaseProgram()`**,
 * the **UI layer** is **already installed**, **reapplying** this function may
 * result in **redundant interception** and is **not recommended**.
 *
 * ------------------------------------------------------------------------
 * #### Installed UI Layer.
 * ------------------------------------------------------------------------
 *
 * This function standardizes:
 *
 * - Error message formatting.
 * - Header rendering.
 * - Usage resolution.
 * - Help hint presentation.
 * - Version interception.
 *
 * The goal is to provide a consistent, styled CLI output surface
 * independent of Commander’s default formatting.
 *
 * ------------------------------------------------------------------------
 * #### Internal Mutations.
 * ------------------------------------------------------------------------
 *
 * This function performs the following mutations on the provided
 * `program` instance:
 *
 * - Overrides `.error()`.
 * - Installs `.exitOverride()`.
 * - Replaces `.createHelp()`.
 * - Intercepts manual:
 *    - `.usage()` calls.
 *    - `.helpOption()` calls.
 *    - `.version()` calls.
 *
 * These interceptions allow internal metadata tracking without
 * relying on Commander private properties.
 *
 * ------------------------------------------------------------------------
 * #### Usage Resolution Order.
 * ------------------------------------------------------------------------
 *
 * When rendering usage inside error output, the value is resolved
 * in the following priority:
 *
 *   1. Manual `.usage()` override (intercepted internally).
 *   2. UI `options.usage`.
 *   3. Commander default usage string.
 *
 * ------------------------------------------------------------------------
 * #### ℹ️ Help Hint Handling.
 * ------------------------------------------------------------------------
 *
 * If `.helpOption(false)` is used, the help hint line
 * (`Run -h, --help`) will not be displayed.
 *
 * Help metadata is internally tracked and does not depend on
 * Commander private state.
 *
 * ------------------------------------------------------------------------
 * #### ⚠️ Important Behavior Notes.
 * ------------------------------------------------------------------------
 *
 * - This function **mutates** the provided program instance.
 * - It replaces Commander’s default error handler.
 * - The process exits with code `1` after rendering an error.
 * - The function is not strictly idempotent and should only be
 *   applied once per program instance.
 *
 * ------------------------------------------------------------------------
 *
 * @param program - A Commander program instance, this can be either:
 * - A program created via {@link createBaseProgram | `createBaseProgram`}, or
 * - A native {@link Command | `Command`}, or {@link CliCommand | `CliCommand`} instance (e.g. `new Command()`. `new CliCommand()` or an imported `program`/`cliProgram` singleton).
 *
 * @param options - Optional UI configuration.
 *
 * @throws {ConfigurationError}
 * Thrown when `program` is not a valid Commander program instance.
 *
 * ------------------------------------------------------------------------
 *
 * @example
 * Using a native Commander instance (manual installation required):
 * ```ts
 * import { Command } from "commander"
 * import { applyCommanderUi } from "@rzl-zone/build-tools/commander-kit";
 *
 * const nativeProgram = new Command();
 *
 * const program = applyCommanderUi(nativeProgram, {
 *   title: "Custom CLI",
 *   version: "1.1.0",
 *   packageName: "my-package-name"
 * });
 *
 * program.parse();
 * ```
 *
 * @example
 * Using the factory (UI layer already installed):
 * ```ts
 * import { createBaseProgram } from "@rzl-zone/build-tools/commander-kit";
 *
 * const program = createBaseProgram({
 *   commandIdentity: identity,
 *   ui: {
 *     title: "My CLI Tool",
 *     usage: "my-cli <command> [options]"
 *   }
 * });
 *
 * program.parse();
 * ```
 *
 * @example
 * Manual usage override takes priority:
 * ```ts
 * import { CliCommand, applyCommanderUi } from "@rzl-zone/build-tools/commander-kit";
 *
 * const programCli = new CliCommand();
 *
 * programCli
 *   .name("my-cli")
 *   .usage("<input> [options]");
 *
 * // Apply default UI helpers
 * const program = applyCommanderUi(programCli, {
 *   usage: "fallback usage (will NOT be used)",
 * });
 *
 * // Rendered usage will be:
 * // my-cli <input> [options]
 *
 * // In this case the manual `.usage()` call defined before
 * // `applyCommanderUi()` takes precedence.
 *
 * // The usage string provided to `applyCommanderUi()` will
 * // be ignored if a custom usage has already been configured.
 * ```
 *
 * @example
 * Disable help hint line:
 * ```ts
 * import { Command } from "commander"
 * import { applyCommanderUi } from "@rzl-zone/build-tools/commander-kit";
 *
 * const nativeProgram = new Command();
 *
 * const program = applyCommanderUi(nativeProgram);
 *
 * program.helpOption(false);
 * // Disables the help option and prevents the "Run -h, --help" hint
 * // from appearing in error messages.
 *
 * program.version(false);
 * // Disables the version command automatically configured by
 * // `applyCommanderUi()` or `createBaseProgram()`.
 * ```
 *
 * @example
 * Minimal setup for native Commander:
 * ```ts
 * import { Command } from "commander"
 * import { applyCommanderUi } from "@rzl-zone/build-tools/commander-kit";
 *
 * const nativeProgram = new Command();
 * const program = applyCommanderUi(nativeProgram);
 *
 * program.parse();
 * ```
 */
export function applyCommanderUi(
  program: CommandBaseProgram,
  options: CommanderUiOptions
): CommandBaseProgram;
export function applyCommanderUi(
  program: CliCommand | Command,
  options: CommanderUiOptions
): CliCommand;
export function applyCommanderUi(
  program: unknown,
  options: CommanderUiOptions
): never;
export function applyCommanderUi(
  program: unknown,
  options: CommanderUiOptions
): CommandContext {
  const { title, usage, version, packageName, __commandName } = options;

  if (
    !isExactInstanceOf(program, Command) &&
    !isExactInstanceOf(program, CliCommand) &&
    !isExactInstanceOf(program, CommandBaseProgram)
  ) {
    throw ConfigurationError.type(
      "program",
      "instanceof Command, CliCommand or create by factory function 'createBaseProgram'",
      program,
      "applyCommanderUi"
    );
  }

  setInternalUiState(program, { title, usage });

  if (!isExactInstanceOf(program, CommandBaseProgram)) {
    const {
      commandTitle,
      defaultTitleFormatted,
      normalizedVersion,
      resolvedPackageNameFormatted
    } = resolveCliPresentationMeta({
      program: program,
      commandName: __commandName,
      version,
      packageName,
      title
    });

    //todo: Intercept manual .usage()
    interceptUsage(program);
    //todo: Intercept manual .helpOption()
    interceptHelp(program);
    //todo: Intercept manual .version()
    interceptVersion(
      program,
      composeVersionDescription(resolvedPackageNameFormatted)
    );

    program.createHelp = () => new StyledHelp();

    program.addHelpText(
      "before",
      joinLinesLoose("", commandTitle ?? defaultTitleFormatted, "")
    );

    program.exitOverride(handleCommanderExit);

    installParseVersionInterceptor(program, {
      versionInjection: {
        normalizedVersion,
        pkgNameFormatted: resolvedPackageNameFormatted
      }
    });
  }

  // Intercept ALL commander validation errors
  program.error = function (message) {
    let errMsg = message.replace(/^error:\s*/i, "");
    errMsg = errMsg.trim().replace(/\.*$/, "") + ".";

    const { disableUsage } = getInternalState(program);

    const { defaultTitleFormatted, dynamicUsage, help } =
      resolveCliPresentationMeta({
        program: program,
        title,
        commandName: __commandName
      });

    const printOut = [
      isNonEmptyString(title) ? title : defaultTitleFormatted,
      "",
      `${picocolors.bold(`${picocolors.red(`${ICONS.error} Error`)}`)} ${picocolors.redBright(errMsg)}`
    ];

    if (!disableUsage && isNonEmptyString(dynamicUsage)) {
      printOut.push(
        "",
        picocolors.bold("Usage:"),
        `  ${picocolors.reset(picocolors.gray(dynamicUsage))}`
      );
    }

    if (!help.disabled) {
      printOut.push(
        "",
        `${picocolors.dim("Run")} ${picocolors.cyanBright(help.flags)} ${picocolors.dim(help.description)}`
      );
    }

    console.error(joinLinesLoose(...printOut));

    process.exit(1);
  };

  return program;
}
