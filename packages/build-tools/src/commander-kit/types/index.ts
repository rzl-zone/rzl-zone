import type { CommanderError, Command } from "commander";

import type { AnyString } from "@/_internal/types/extra";

import type { COMMANDER_INTERNAL_SYMBOL } from "@/commander-kit/_internal/state";
import type { CliCommand } from "../core/command";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { applyCommanderUi } from "../ui/apply-commander-ui";
import type { CommandBaseProgram } from "../factories/create-base-program";

export type {
  CommandBaseProgram,
  CreateBaseProgramOptions
} from "@/commander-kit/factories/create-base-program";

/**  ----------------------------------------------------------------
 * * ***Centralized internal state container attached via symbol.***
 * ----------------------------------------------------------------
 * - ***Prevents:***
 *    - Property name collisions.
 *    - Accessing Commander private internals.
 *    - Multiple symbol scattering.
 *
 * All UI-related metadata is stored here.
 *
 * ----------------------------------------------------------------
 * @internal
 */
export type CommanderInternalState = {
  /**
   * @default undefined
   */
  ui?: CommanderUiOptions;
  /**
   * @default undefined
   */
  packageName?: string;
  /**
   * @default undefined
   */
  manualUsage?: string;
  /**
   * @default false
   */
  disableUsage?: boolean;

  /**
   * @default undefined
   */
  help?: {
    /**
     * @default undefined
     */
    flags?: string;
    /**
     * @default undefined
     */
    description?: string;
    /**
     * @default undefined
     */
    disabled?: boolean;
  };

  /**
   * @default false
   */
  versionInjected?: boolean;
  /**
   * @default false
   */
  versionDisable?: boolean;
  /**
   * @default false
   */
  versionSetByUser?: boolean;
  /**
   * @default undefined
   */
  versionOriginal?: CommandInternal["version"] | Command["version"];

  /**
   * @default undefined
   */
  versionMeta?: {
    /**
     * @default undefined
     */
    value: string;
    /**
     * @default undefined
     */
    flags?: string;
    /**
     * @default undefined
     */
    description?: string;
  };
};

/** ------------------------------------------------------------------------
 * * Internal Command extension with attached metadata state.
 * ------------------------------------------------------------------------
 *
 * Augments a native {@link CliCommand | `CliCommand`} extend {@link Command | `Command`} instance with an
 * optional internal state container stored under
 * {@link COMMANDER_INTERNAL_SYMBOL | **`COMMANDER_INTERNAL_SYMBOL`**}.
 *
 * This interface is used internally to allow safe access to
 * library-managed metadata without mutating Commander’s public
 * type definitions.
 *
 * The symbol-backed property is lazily initialized and should
 * never be accessed directly by consumers.
 *
 * ------------------------------------------------------------------------
 * #### Purpose.
 * ------------------------------------------------------------------------
 *
 * - Enables internal UI lifecycle tracking.
 * - Stores usage and version interception metadata.
 * - Avoids reliance on Commander private internals.
 *
 * This type exists purely for internal type-narrowing and
 * symbol-based state attachment.
 *
 * ------------------------------------------------------------------------
 * @internal
 */
export type CommandInternal = CliCommand & {
  /** @internal */
  [COMMANDER_INTERNAL_SYMBOL]?: CommanderInternalState;
};

/** ----------------------------------------------------------------
 * * ***Commander UI options.***
 * ----------------------------------------------------------------
 *
 * Configuration object consumed by {@link applyCommanderUi | `applyCommanderUi()`}.
 *
 * Both `title`, `usage`, `packageName`, and `version` are optional at the type level, but
 * at runtime, values must be non-empty strings to be considered valid if provided.
 *
 * If either field is missing or fails the non-empty string constraint,
 * UI customization will be ignored silently and default.
 *
 * No runtime error is thrown for invalid values to preserve CLI execution flow.
 */
export type CommanderUiOptions = {
  /** ----------------------------------------------------------------
   * * ***UI title.***
   * ----------------------------------------------------------------
   *
   * Title displayed in the CLI header output.
   *
   * Must be a non-empty string when provided, otherwise will return default.
   *
   * ----------------------------------------------------------------
   */
  title?: string;

  /** ----------------------------------------------------------------
   * * ***Usage description.***
   * ----------------------------------------------------------------
   *
   * Usage information displayed in the help output, this optional, but when
   * provided, the value must be a non-empty string.
   *
   * - *If omitted or invalid, the usage string is resolved using the following priority:*
   *    1. A manually defined {@link CliCommand.usage | `.usage()`} override (if any),
   *    2. Commander’s default usage resolution behavior.
   * ----------------------------------------------------------------
   * @note
   * Calling {@link CliCommand.usage | `.usage("")`} or with empty-string, is treated as an invalid
   * override and will throw a configuration error.
   */
  usage?: string;

  /** ----------------------------------------------------------------
   * * ***Package version.***
   * ----------------------------------------------------------------
   *
   * Usage information displayed in the version package output, this
   * property is optional, but when provided, the value must be a
   * non-empty string.
   *
   * - *If omitted or invalid, the version string is resolved using the
   *   following priority:*
   *      1. A manually defined {@link CliCommand.version | `.version()`} override (if any).
   *      2. Defaults to the internally resolved package version.
   *
   * ----------------------------------------------------------------
   * #### ⚠️ Behavior Scope.
   * ----------------------------------------------------------------
   *
   * This property is **ONLY RESPECTED** when using a native Commander
   * instance (i.e., created directly via `new Command()` or an imported `program` singleton).
   *
   * If the program instance is created via `createBaseProgram()`,
   * this property is intentionally ignored, since version resolution
   * is fully managed by the base program factory lifecycle.
   *
   * ----------------------------------------------------------------
   * @note
   * Calling {@link CliCommand.version | `.version("")`} or providing an
   * empty string is treated as an invalid override and will throw a
   * configuration error.
   */
  version?: string;

  /** ----------------------------------------------------------------
   * * ***Package name.***
   * ----------------------------------------------------------------
   *
   * Package name displayed as part of the CLI version output, when version
   * information is printed, this value is rendered alongside the version string.
   *
   * This property is optional, but when provided,
   * the value must be a non-empty string.
   *
   * *If omitted or invalid, the package name string is resolved using the
   * defaults internally resolved package name.*
   *
   * ----------------------------------------------------------------
   * #### ⚠️ Behavior Scope.
   * ----------------------------------------------------------------
   *
   * This property is **ONLY RESPECTED** when using a native Commander
   * instance (i.e., created directly via `new Command()` or an imported `program` singleton).
   *
   * If the program instance is created via `createBaseProgram()`,
   * this property is intentionally ignored, since `packageName` resolution
   * is fully managed by the base program factory lifecycle.
   */
  packageName?: string;

  /** @internal */
  __commandName?: string;
};

/** ----------------------------------------------------------------
 * * ***Commander Error Code.***
 * ----------------------------------------------------------------
 *
 * Union type representing known error codes emitted by
 * {@link CommanderError | `CommanderError`} instances.
 *
 * The union includes all standard error identifiers produced by
 * Commander during command parsing, validation, and execution.
 *
 * The type also allows additional string values through
 * {@link AnyString | `AnyString`} to support custom error codes
 * defined by integrations, plugins, or higher-level frameworks.
 *
 * ----------------------------------------------------------------
 * #### Purpose
 * ----------------------------------------------------------------
 *
 * - Provides autocomplete for built-in Commander error codes.
 * - Enables safer error handling logic.
 * - Allows custom framework-specific error codes without
 *   restricting the type to a closed union.
 *
 * ----------------------------------------------------------------
 */
export type CommanderErrorCode =
  | "commander.help"
  | "commander.helpDisplayed"
  | "commander.version"
  | "commander.executeSubCommandAsync"
  | "commander.invalidArgument"
  | "commander.error"
  | "commander.missingArgument"
  | "commander.optionMissingArgument"
  | "commander.missingMandatoryOptionValue"
  | "commander.conflictingOption"
  | "commander.unknownOption"
  | "commander.excessArguments"
  | "commander.unknownCommand"
  | AnyString;

/** ----------------------------------------------------------------
 * * ***Typed Commander Error.***
 * ----------------------------------------------------------------
 *
 * Strongly-typed variant of {@link CommanderError | `CommanderError`}
 * with a refined `code` property.
 *
 * This type replaces the original `string`-based `code` field with
 * {@link CommanderErrorCode | `CommanderErrorCode`}, providing
 * improved type safety and autocomplete when working with
 * Commander error handling logic.
 *
 * The error code union includes all known Commander error identifiers
 * while still allowing additional custom string codes defined by
 * integrations or higher-level frameworks.
 *
 * ----------------------------------------------------------------
 * #### Purpose
 * ----------------------------------------------------------------
 *
 * - Provides autocomplete for standard Commander error codes.
 * - Improves type safety when inspecting `CommanderError` values.
 * - Allows custom error codes without restricting extensibility.
 *
 * This type is typically used when intercepting, transforming,
 * or re-throwing errors emitted by Commander.
 *
 * ----------------------------------------------------------------
 */
export type TypedCommanderError = Omit<CommanderError, "code"> & {
  /** Typed Commander error identifier. */
  code: CommanderErrorCode;
};

/** ----------------------------------------------------------------
 * * ***Command Execution Context Type.***
 * ----------------------------------------------------------------
 *
 * Alias type representing the runtime command instance used as
 * the execution context during command handling.
 *
 * This abstraction standardizes command typing across the codebase
 * while avoiding tight coupling to a specific Commander class.
 *
 * The type includes all supported command-like instances used by
 * the framework:
 *
 * - {@link CliCommand | `CliCommand`}
 * - {@link Command | `Command`}
 * - {@link CommandBaseProgram | `CommandBaseProgram`}
 *
 * These values represent **instantiated command objects**
 * (for example `new Command()`), not constructor types.
 *
 * ----------------------------------------------------------------
 *
 * #### Purpose
 *
 * - Provides a common command instance type for utilities.
 * - Improves semantic clarity in function signatures.
 * - Avoids repeating union types across the codebase.
 */
export type CommandContext = CliCommand | Command | CommandBaseProgram;
