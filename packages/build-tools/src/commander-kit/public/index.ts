import "@rzl-zone/node-only";

export type {
  CreateBaseProgramOptions,
  CommandContext,
  CommanderErrorCode,
  CommanderUiOptions,
  TypedCommanderError
} from "../types";

export { isCommanderError } from "../errors/isCommanderError";
export { formatCommanderError } from "../errors/format-commander-error";
export { getCommanderErrorCode } from "../errors/get-commander-error-code";

export { CommandIdentity } from "../identity";
export { handleCommanderExit } from "../lifecycle/handle-commander-exit";
export { applyCommanderUi } from "../ui/apply-commander-ui";

//! --- CLI ---
export { CliArgument } from "../core/argument";
export { CliCommand } from "../core/command";
export { CliHelp } from "../core/help";
export { CliOption } from "../core/option";
export { cliProgram } from "../core/program";

export { CliCommanderError } from "../errors/cli/commander-error";
export { CliInvalidArgumentError } from "../errors/cli/invalid-argument-error";
export { CliInvalidOptionArgumentError } from "../errors/cli/invalid-option-argument-error";

export { cliCreateArgument } from "../factories/create-argument";
export { createBaseProgram } from "../factories/create-base-program";
export { cliCreateCommand } from "../factories/create-command";
export { cliCreateOption } from "../factories/create-option";

//! --- CLI TYPE ---
export type {
  CliAddHelpTextContext,
  CliAddHelpTextPosition,
  CliCommandOptions,
  CliErrorOptions,
  CliExecutableCommandOptions,
  CliHelpConfiguration,
  CliHelpContext,
  CliHookEvent,
  CliOptionValueSource,
  CliOptionValues,
  CliOutputConfiguration,
  CliParseOptions,
  CliParseOptionsResult
} from "../types/commander-types";
