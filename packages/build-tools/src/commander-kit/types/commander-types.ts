/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  AddHelpTextContext,
  AddHelpTextPosition,
  CommandOptions,
  ErrorOptions,
  ExecutableCommandOptions,
  HelpConfiguration,
  HelpContext,
  HookEvent,
  OptionValueSource,
  OptionValues,
  OutputConfiguration,
  ParseOptions,
  ParseOptionsResult
} from "commander";

/** ----------------------------------------------------------------
 * * ***Context object provided when injecting custom help text.***
 * ----------------------------------------------------------------
 */
export interface CliAddHelpTextContext extends AddHelpTextContext {}

/** ----------------------------------------------------------------
 * * ***Position where custom help text should be injected.***
 * ----------------------------------------------------------------
 */
export type CliAddHelpTextPosition = AddHelpTextPosition;

/** ----------------------------------------------------------------
 * * ***Configuration options for a CLI command.***
 * ----------------------------------------------------------------
 */
export interface CliCommandOptions extends CommandOptions {}

/** ----------------------------------------------------------------
 * * ***Additional options attached to Commander errors.***
 * ----------------------------------------------------------------
 */
export interface CliErrorOptions extends ErrorOptions {}

/** ----------------------------------------------------------------
 * * ***Configuration for executable subcommands.***
 * ----------------------------------------------------------------
 */
export interface CliExecutableCommandOptions extends ExecutableCommandOptions {}

/** ----------------------------------------------------------------
 * * ***Configuration options for the Commander help system.***
 * ----------------------------------------------------------------
 */
export type CliHelpConfiguration = HelpConfiguration;

/** ----------------------------------------------------------------
 * * ***Context information available during help rendering.***
 * ----------------------------------------------------------------
 */
export interface CliHelpContext extends HelpContext {}

/** ----------------------------------------------------------------
 * * ***Lifecycle hook event names supported by Commander.***
 * ----------------------------------------------------------------
 */
export type CliHookEvent = HookEvent;

/** ----------------------------------------------------------------
 * * ***Indicates where an option value originated from.***
 * ----------------------------------------------------------------
 */
export type CliOptionValueSource = OptionValueSource;

/** ----------------------------------------------------------------
 * * ***Resolved option values object.***
 * ----------------------------------------------------------------
 */
export type CliOptionValues = OptionValues;

/** ----------------------------------------------------------------
 * * ***Configuration controlling Commander output behavior.***
 * ----------------------------------------------------------------
 */
export interface CliOutputConfiguration extends OutputConfiguration {}

/** ----------------------------------------------------------------
 * * ***Options controlling the parsing behavior.***
 * ----------------------------------------------------------------
 */
export interface CliParseOptions extends ParseOptions {}

/** ----------------------------------------------------------------
 * * ***Result object returned when parsing arguments manually.***
 * ----------------------------------------------------------------
 */
export interface CliParseOptionsResult extends ParseOptionsResult {}
