import "@rzl-zone/node-only";

import type {
  CommandContext,
  CommanderInternalState
} from "@/commander-kit/types";

import { parse } from "node:path";

import { ICONS } from "@/utils/server";
import { joinInline, picocolors } from "@/utils/client";
import { isExactInstanceOf } from "@/utils/helper/class-check";

import { isNonEmptyString } from "@/_internal/utils/helper";
import { PACKAGE_META } from "@/_internal/constants/package-meta";

import { CommandBaseProgram } from "@/commander-kit/factories/create-base-program";
import { COMMANDER_UI_DEFAULTS } from "@/commander-kit/constants";

import { getInternalState } from "../state";
import { normalizeVersionPrefix } from "./versions";
import { reorderUsage, styleUsage } from "./usages";

const { DESCRIPTIONS, FLAGS } = COMMANDER_UI_DEFAULTS;

/** Parameters accepted by
 * {@link resolveCliPresentationMeta | `resolveCliPresentationMeta`}.
 *
 * @internal
 */
export type ResolveCliPresentationParams = {
  /** The command instance to resolve metadata from. */
  program: CommandContext;

  /** Optional explicit CLI name override. */
  commandName?: string;

  /** Optional fallback title. */
  title?: string;

  /** Optional explicit CLI version override. */
  version?: string;

  /** Optional explicit CLI package name override. */
  packageName?: string;
};

/** Normalized help configuration returned by
 * {@link resolveCliPresentationMeta | `resolveCliPresentationMeta`}.
 *
 * @internal
 */
export type CliPresentationHelpMeta = Readonly<{
  /** Raw internal help metadata reference. */
  meta: CommanderInternalState["help"] | undefined;

  /** Whether help output is disabled. */
  disabled: boolean;

  /** Resolved help flags. */
  flags: string;

  /** Resolved help description. */
  description: string;
}>;

/** Fully resolved CLI presentation metadata by
 * {@link resolveCliPresentationMeta | `resolveCliPresentationMeta`}.
 *
 * This object is derived, immutable, and safe to reuse across
 * render layers (header printer, help renderer, error handler, etc.).
 *
 * @internal
 */
export type CliPresentationMeta = Readonly<{
  /** Resolve CLI name from override or runtime argv. */
  resolvedCliName: string | undefined;
  /** Resolve Package name. */
  resolvedPackageName: string;
  /** Resolve Package name with formatted colors. */
  resolvedPackageNameFormatted: string;
  /** Determine whether CLI name differs from package name. */
  isDiffCommandName: boolean;
  /** Resolve display title. */
  commandTitle: string | undefined;
  /** Normalize version with fallback. */
  normalizedVersion: string;
  /** Build default formatted CLI title. */
  defaultTitleFormatted: string;
  /** Resolve dynamic usage string. */
  dynamicUsage: string;
  /** Resolve help metadata. */
  help: CliPresentationHelpMeta;
}>;

/** ------------------------------------------------------------------------
 * * Resolves normalized CLI presentation metadata for `applyCommander`.
 * ------------------------------------------------------------------------
 *
 * Computes and returns all derived CLI presentation values required for
 * rendering headers, titles, usage output, version labels, and help
 * configuration.
 *
 * - *This helper centralizes resolution logic that depends on:*
 *     - Explicit command name overrides.
 *     - Runtime `process.argv` inspection.
 *     - Internal command state.
 *     - Package metadata fallbacks.
 *
 * - *The function guarantees consistent priority ordering for:*
 *     - CLI identity resolution.
 *     - Version normalization.
 *     - Title formatting.
 *     - Usage fallback behavior.
 *     - Help metadata defaults.
 *
 * The returned object is fully derived and does not mutate the provided
 * command instance.
 *
 * ------------------------------------------------------------------------
 *
 * - ***Resolution Priority:***
 *
 *    - *CLI Name:*
 *       1. Explicit `commandName`.
 *       2. `process.argv[1]` basename.
 *       3. `undefined`.
 *
 *    - *Command Title:*
 *       1. Explicit `commandName`.
 *       2. Provided `title`.
 *       3. `undefined`.
 *
 *    - *Version:*
 *       1. Manual version override.
 *       2. Internal command version.
 *       3. `package.json` version.
 *
 *    - *Usage:*
 *       1. Manual usage override.
 *       2. UI usage override.
 *       3. Styled program usage.
 *
 * ------------------------------------------------------------------------
 *
 * @param params - Configuration object.
 * @returns Immutable object of cli presentation metadata.
 * @example
 * ```ts
 * const meta = resolveCliPresentationMeta({
 *   program,
 *   commandName: "my-cli"
 * });
 *
 * console.log(meta.defaultTitleFormatted);
 * ```
 * ------------------------------------------------------------------------
 *
 * @internal
 */
export function resolveCliPresentationMeta(
  params: ResolveCliPresentationParams
): CliPresentationMeta {
  const { program, commandName, title, version, packageName } = params;

  const _internal = getInternalState(program);

  const isCommandBaseProgram = isExactInstanceOf(program, CommandBaseProgram);

  /** Resolve CLI name from override or runtime argv. */
  const resolvedCliName = isNonEmptyString(commandName)
    ? commandName
    : isNonEmptyString(process.argv[1])
      ? parse(process.argv[1]).name
      : undefined;

  /** Determine whether CLI name differs from package name. */
  const isDiffCommandName =
    !!resolvedCliName && resolvedCliName !== PACKAGE_META.name;

  /** Resolve display title. */
  const commandTitle = isNonEmptyString(commandName)
    ? commandName
    : isNonEmptyString(title)
      ? title
      : undefined;

  /** Resolve package version (raw). */
  const resolvedPackageVersion =
    !isCommandBaseProgram && isNonEmptyString(version)
      ? version
      : isNonEmptyString(_internal.versionMeta?.value)
        ? _internal.versionMeta.value
        : undefined;

  /** Normalize version with fallback. */
  let normalizedVersion = normalizeVersionPrefix(resolvedPackageVersion);

  normalizedVersion = isNonEmptyString(normalizedVersion)
    ? normalizedVersion
    : normalizeVersionPrefix(PACKAGE_META.version);

  /** Build default formatted CLI title. */
  const defaultTitleFormatted = joinInline(
    picocolors.blueBright(
      (isNonEmptyString(_internal.packageName)
        ? _internal.packageName
        : PACKAGE_META.name) +
        "@" +
        normalizedVersion
    ),
    isDiffCommandName
      ? `${picocolors.magentaBright(ICONS.arrowRight)} ${picocolors.yellowBright(resolvedCliName)}`
      : false
  );

  /** Resolve dynamic usage string. */
  const dynamicUsage = isNonEmptyString(_internal.manualUsage)
    ? _internal.manualUsage
    : isNonEmptyString(_internal.ui?.usage)
      ? _internal.ui.usage
      : (isDiffCommandName
          ? `${picocolors.cyanBright(resolvedCliName)} `
          : "") +
        (isNonEmptyString(program.usage())
          ? styleUsage(
              reorderUsage(program.usage(), {
                errorConfig: {
                  field: "`program.usage()`",
                  context:
                    "resolveCliPresentationMeta (by `program.usage()` at const variable 'dynamicUsage')"
                }
              }),
              {
                errorConfig: {
                  field: "`reorderUsage(program.usage())`",
                  context:
                    "resolveCliPresentationMeta (by `reorderUsage(program.usage())` at const variable 'dynamicUsage')"
                }
              }
            )
          : "");

  /** Resolve Package name. */
  const resolvedPackageName = isNonEmptyString(packageName)
    ? packageName
    : PACKAGE_META.name;

  /** Resolve Package name with formatted colors. */
  const resolvedPackageNameFormatted = `${picocolors.blueBright(resolvedPackageName)}${isDiffCommandName ? ` ${picocolors.cyanBright(`(${resolvedCliName})`)}` : ""}`;

  /** Resolve help metadata. */
  const helpMeta = _internal.help;
  const isHelpDisabled = helpMeta?.disabled === true;
  const helpFlags = helpMeta?.flags ?? FLAGS.HELP;
  const helpDesc = helpMeta?.description ?? DESCRIPTIONS.HELP;

  return Object.freeze({
    resolvedCliName,
    resolvedPackageName,
    resolvedPackageNameFormatted,
    isDiffCommandName,
    commandTitle,
    normalizedVersion,
    defaultTitleFormatted,
    dynamicUsage,
    help: {
      meta: helpMeta,
      disabled: isHelpDisabled,
      flags: helpFlags,
      description: helpDesc
    }
  });
}
