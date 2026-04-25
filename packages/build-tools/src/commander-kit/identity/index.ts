import "@rzl-zone/node-only";

import { isNonEmptyString } from "@/_internal/utils/helper";
import { PACKAGE_META } from "@/_internal/constants/package-meta";

import { ICONS } from "@/utils/server";
import { picocolors } from "@/utils/client";

/** ----------------------------------------------------------------
 * * ***Options for generating a utility command title.***
 * ----------------------------------------------------------------
 *
 * Used by `CommandIdentity.utility()`.
 */
type CommandUtilityTitleOptions = {
  /** ----------------------------------------------------------------
   * * ***Command name displayed in the title.***
   * ----------------------------------------------------------------
   *
   * Overrides the default command name provided in the constructor.
   *
   * @example
   * ```ts
   * { commandName: "fix-dts-react-import" }
   * ```
   */
  commandName?: string;

  /** ----------------------------------------------------------------
   * * ***Optional arrow icon override.***
   * ----------------------------------------------------------------
   *
   * If provided, this icon replaces the generator's
   * `defaultIconArrow` for this call only.
   *
   * @example
   * ```ts
   * { iconArrow: "⇒" }
   * ```
   */
  iconArrow?: string;

  /** ----------------------------------------------------------------
   * * ***Package name prefix.***
   * ----------------------------------------------------------------
   *
   * Displayed at the beginning of every generated title.
   *
   * @default "@rzl-zone/build-tools"
   */
  packageName?: string;
};

/** ----------------------------------------------------------------
 * * ***Options for generating a CLI command title.***
 * ----------------------------------------------------------------
 *
 * Used by `CommandIdentity.cli()`
 */
type CommandCliTitleOptions = Omit<
  CommandUtilityTitleOptions,
  "packageName"
> & {
  /** ----------------------------------------------------------------
   * * ***Package name prefix.***
   * ----------------------------------------------------------------
   *
   * Overrides the resolved CLI package name for this call only.
   *
   * @default "@rzl-zone/build-tools-cli"
   */
  packageName?: string;
};

/** ----------------------------------------------------------------
 * * ***Global configuration for command identity formatting.***
 * ----------------------------------------------------------------
 *
 * Defines the default identity behavior applied to
 * all generated CLI and utility titles.
 */
type CommandIdentityOptions = {
  /** ----------------------------------------------------------------
   * * ***Default command name.***
   * ----------------------------------------------------------------
   *
   * Used when a command name is not provided in the respective in method `CommandIdentity.cli()` and `CommandIdentity.utility()` options.
   *
   * @example
   * ```ts
   * defaultCommandName: "fix-dts-react-import"
   * ```
   */
  defaultCommandName: string;

  /** ----------------------------------------------------------------
   * * ***Package name prefix.***
   * ----------------------------------------------------------------
   *
   * Optional base package name used for title generation.
   *
   * If not provided, an internal default will be resolved
   * depending on the title type (`CLI` or `utility`).
   */
  packageName?: string;

  /** ----------------------------------------------------------------
   * * ***Package version.***
   * ----------------------------------------------------------------
   *
   * Optional version displayed alongside the package name
   * in generated titles.
   *
   * If not provided, a default version will be resolved internally.
   *
   * @example
   * ```ts
   * version: "1.2.0"
   * ```
   */
  version?: string;

  /** ----------------------------------------------------------------
   * * ***Label for CLI commands.***
   * ----------------------------------------------------------------
   *
   * Optional label displayed between
   * the package name and arrow icon for CLI titles.
   */
  cliLabel?: string;

  /** ----------------------------------------------------------------
   * * ***Label for utility commands.***
   * ----------------------------------------------------------------
   *
   * Optional label displayed between
   * the package name and arrow icon for utility titles.
   */
  utilityLabel?: string;

  /** ----------------------------------------------------------------
   * * ***Default arrow icon.***
   * ----------------------------------------------------------------
   *
   * Icon displayed between the label and command name.
   *
   * @default
   * "▶️"
   * // or
   * "▶"
   */
  defaultIconArrow?: string;
};

/** ----------------------------------------------------------------
 * * ***Command identity formatter with consistent CLI styling.***
 * ----------------------------------------------------------------
 *
 * Responsible for generating formatted and colorized
 * command titles for CLI and utility commands.
 *
 * - ***Each generated title may include:***
 *      - Package name.
 *      - Optional label (CLI / utility).
 *      - Arrow icon.
 *      - Command name.
 *      - Package version.
 *
 * ---
 *
 * @example
 * ```ts
 * const identity = new CommandIdentity({
 *   defaultCommandName: "fix-dts-react-import"
 * });
 *
 * identity.cli();
 * // => "@rzl-zone/build-tools-cli@<version> ➔ fix-dts-react-import"
 *
 * identity.utility({ commandName: "clean-dist" });
 * // => "@rzl-zone/build-tools@<version> ➔ clean-dist"
 * ```
 *
 * @example
 * ```ts
 * const identity = new CommandIdentity({
 *   defaultCommandName: "build",
 *   version: "2.1.0"
 * });
 *
 * identity.cli();
 * // => "@rzl-zone/build-tools-cli@2.1.0 ➔ build"
 *
 * identity.utility({ commandName: "clean-dist" });
 * // => "@rzl-zone/build-tools@2.1.0 ➔ clean-dist"
 * ```
 */
export class CommandIdentity {
  /** Default command name.
   *
   * @internal
   */
  private _commandName: string;

  /** Package name.
   *
   * @internal
   */
  private _packageName: string | undefined;

  /** Package version.
   *
   * @internal
   */
  private _version: string;

  /** Label for CLI commands.
   *
   * @internal
   */
  private cliLabel: string | undefined;

  /** Label for utility commands.
   *
   * @internal
   */
  private utilityLabel: string | undefined;

  /** Default arrow icon.
   *
   * @internal
   */
  private defaultIconArrow: string;

  /** @internal */
  private static readonly DEFAULT_UTILITY_PACKAGE = "@rzl-zone/build-tools";
  /** @internal */
  private static readonly DEFAULT_CLI_PACKAGE = "@rzl-zone/build-tools-cli";

  /** ----------------------------------------------------------------
   * * ***Create a new command identity instance.***
   * ----------------------------------------------------------------
   *
   * Initializes global identity configuration
   * used by `CommandIdentity.cli()` and `CommandIdentity.utility()`.
   *
   * ---
   *
   * @param {CommandIdentityOptions} options - Global identity configuration.
   * @throws {Error} If `options.defaultCommandName` is missing or empty.
   *
   * ---
   *
   * @example
   * ```ts
   * const identity = new CommandIdentity({
   *   defaultCommandName: "fix-dts-react-import"
   * });
   *
   * identity.cli();
   * // => "@rzl-zone/build-tools-cli@<version> ➔ fix-dts-react-import"
   *
   * identity.utility({ commandName: "clean-dist" });
   * // => "@rzl-zone/build-tools@<version> ➔ clean-dist"
   * ```
   *
   * @example
   * ```ts
   * const identity = new CommandIdentity({
   *   defaultCommandName: "build",
   *   version: "2.1.0"
   * });
   *
   * identity.cli();
   * // => "@rzl-zone/build-tools-cli@2.1.0 ➔ build"
   *
   * identity.utility({ commandName: "clean-dist" });
   * // => "@rzl-zone/build-tools@2.1.0 ➔ clean-dist"
   * ```
   */
  constructor(options: CommandIdentityOptions) {
    if (!isNonEmptyString(options.defaultCommandName)) {
      throw new Error(
        "CommandIdentity: Default command name is missing, please provide in constructor method options, eg: ({ defaultCommandName: 'inject-directive' })."
      );
    }

    this._commandName = options.defaultCommandName;
    this._packageName = options.packageName;
    this._version = isNonEmptyString(options.version)
      ? options.version
      : PACKAGE_META.version;

    this.cliLabel = options.cliLabel;
    this.utilityLabel = options.utilityLabel;
    this.defaultIconArrow = options.defaultIconArrow ?? ICONS.arrowRight;
  }

  /** ----------------------------------------------------------------
   * * ***Internal title formatter.***
   * ----------------------------------------------------------------
   *
   * Shared formatter used by `CommandIdentity.cli()` and `CommandIdentity.utility()`.
   *
   * @internal
   */
  private format(props: {
    packageName: string;
    label?: string;
    name?: string;
    iconArrow?: string;
  }): string {
    const { label, name, iconArrow, packageName } = props;
    const finalName = isNonEmptyString(name) ? name : this._commandName;
    const finalLabel = isNonEmptyString(label) ? ` ${label} ` : " ";

    if (!finalName) {
      throw new Error(
        "CommandIdentity: Command name is missing. " +
          "Provide `defaultCommandName` in constructor or `name` in method options."
      );
    }

    const versionSuffix = isNonEmptyString(this._version)
      ? `@${this._version}`
      : "";

    return (
      `${picocolors.bold(picocolors.blue(packageName + versionSuffix))}` +
      `${picocolors.whiteBright(finalLabel)}` +
      `${picocolors.bold(picocolors.magentaBright(isNonEmptyString(iconArrow) ? iconArrow : this.defaultIconArrow))} ` +
      `${picocolors.underline(picocolors.italic(picocolors.yellowBright(finalName)))}`
    );
  }

  /** ----------------------------------------------------------------
   * * ***Generate a CLI command title.***
   * ----------------------------------------------------------------
   *
   * Uses the CLI default package (unless overridden)
   * and applies CLI-specific labeling.
   *
   * @param {CommandCliTitleOptions} options - CLI title configuration.
   *
   * @example
   * ```ts
   * identity.cli();
   * identity.cli({ commandName: "build" });
   * ```
   */
  public cli(options: CommandCliTitleOptions = {}): string {
    const packageName = isNonEmptyString(options.packageName)
      ? options.packageName
      : (this._packageName ?? CommandIdentity.DEFAULT_CLI_PACKAGE);

    return this.format({
      packageName,
      label: this.cliLabel,
      name: options.commandName,
      iconArrow: options.iconArrow
    });
  }

  /** ----------------------------------------------------------------
   * * ***Generate a utility command title.***
   * ----------------------------------------------------------------
   *
   * Uses the utility default package (unless overridden)
   * and applies utility-specific labeling.
   *
   * @param {CommandUtilityTitleOptions} options - Utility title configuration.
   *
   * @example
   * ```ts
   * identity.utility();
   * identity.utility({ commandName: "clean-dist", iconArrow: "⇒" });
   * ```
   */
  public utility(options: CommandUtilityTitleOptions = {}): string {
    const packageName = isNonEmptyString(options.packageName)
      ? options.packageName
      : (this._packageName ?? CommandIdentity.DEFAULT_UTILITY_PACKAGE);

    return this.format({
      packageName,
      label: this.utilityLabel,
      name: options.commandName,
      iconArrow: options.iconArrow
    });
  }

  /** ----------------------------------------------------------------
   * * ***Package name.***
   * ----------------------------------------------------------------
   *
   * Returns the effective package name used for title generation.
   *
   * If a custom package name has been provided via the constructor
   * or `CommandIdentity.setPackageName()`, that value will be returned.
   * Otherwise, an internal default package name (as utility) is used.
   *
   * @readonly
   */
  public get packageName(): string {
    return this._packageName ?? CommandIdentity.DEFAULT_UTILITY_PACKAGE;
  }

  /** ----------------------------------------------------------------
   * * ***Set package name.***
   * ----------------------------------------------------------------
   *
   * Assigns a custom package name to be used for title generation.
   *
   * - *This value overrides:*
   *     - Any package name provided in the constructor.
   *     - The internal default package name.
   *
   * Once set, this value will be returned by the `CommandIdentity.packageName`
   * getter and used by `CommandIdentity.cli()` and
   * `CommandIdentity.utility()` unless explicitly
   * overridden per method call.
   *
   * @param value - The new package name to assign.
   * @returns The current instance for fluent chaining.
   */
  public setPackageName(value: string): this {
    this._packageName = value;
    return this;
  }

  /** ----------------------------------------------------------------
   * * ***Command name.***
   * ----------------------------------------------------------------
   *
   * Returns the current command name used for title generation.
   *
   * This value is initialized via the constructor and may be
   * updated later using
   * `CommandIdentity.setCommandName()`.
   *
   * @readonly
   */
  public get commandName(): string {
    return this._commandName;
  }

  /** ----------------------------------------------------------------
   * * ***Set command name.***
   * ----------------------------------------------------------------
   *
   * Updates the command name used for title generation.
   *
   * This overrides the command name provided in the constructor
   * and affects subsequent calls to
   * `CommandIdentity.cli()`
   * and `CommandIdentity.utility()`,
   * unless a command name is explicitly provided per method call.
   *
   * @param value - The new command name to assign.
   * @returns The current instance for fluent chaining.
   */
  public setCommandName(value: string): this {
    this._commandName = value;
    return this;
  }

  /** ----------------------------------------------------------------
   * * ***Package version.***
   * ----------------------------------------------------------------
   *
   * Returns the effective version used for title generation.
   *
   * - *Resolution order:*
   *    1. If a custom version has been provided via the constructor
   *       or `CommandIdentity.setVersion()`,
   *       that value will be returned.
   *    2. Otherwise, the version falls back to the internally
   *       resolved default package version.
   *
   * A version value is always guaranteed to be present.
   *
   * @readonly
   */
  public get version(): string {
    return this._version;
  }

  /** ----------------------------------------------------------------
   * * ***Set package version.***
   * ----------------------------------------------------------------
   *
   * Overrides the version used for title generation.
   *
   * If an empty or invalid value is provided,
   * the version will remain unchanged.
   *
   * @param value - The new version to assign.
   * @returns The current instance for fluent chaining.
   */
  public setVersion(value: string): this {
    if (isNonEmptyString(value)) this._version = value;

    return this;
  }
}
