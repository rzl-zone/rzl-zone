import "@rzl-zone/node-only";

import type { CreateBaseProgramOptions } from "@/commander-kit/types";

import { parse } from "node:path";

import { isNonEmptyString } from "@/_internal/utils/helper";
import { PACKAGE_META } from "@/_internal/constants/package-meta";

import { ICONS } from "@/utils/server";
import { joinInline, picocolors } from "@/utils/client";

import { normalizeVersionPrefix } from "./versions";

/** Parameters accepted by
 * {@link resolveBaseProgramPresentationMeta | `resolveBaseProgramPresentationMeta`}.
 *
 * @internal
 */
export type ResolveBaseProgramPresentationParams = CreateBaseProgramOptions;

/** Fully resolved presentation metadata returned by
 * {@link resolveBaseProgramPresentationMeta | `resolveBaseProgramPresentationMeta`}.
 *
 * - **This object is immutable and safe to reuse across:**
 *    - Header rendering.
 *    - Version wiring.
 *    - Title formatting.
 * ----------------------------------------------------------------
 * @internal
 */
export type BaseProgramPresentationMeta = Readonly<{
  /** Resolved CLI name from override, identity, or argv. */
  readonly resolvedCliName: string | undefined;

  /** Resolved display title. */
  readonly commandTitle: string | undefined;

  /** Resolved package name. */
  readonly resolvedPackageName: string;

  /** Resolved (raw) package version before normalization. */
  readonly resolvedPackageVersion: string;

  /** Normalized version (prefixed if needed). */
  readonly normalizedVersion: string;

  /** Whether CLI name differs from package.json name. */
  readonly isDiffCommandName: boolean;

  /** Formatted package name with optional CLI alias. */
  readonly pkgNameFormatted: string;

  /** Default formatted title (package@version + alias arrow). */
  readonly defaultTitleFormatted: string;
}>;

/** ------------------------------------------------------------------------
 * * Resolves normalized presentation metadata for `createBaseProgram`.
 * ------------------------------------------------------------------------
 *
 * Computes and returns all derived identity and presentation values
 * required during base program construction.
 *
 * - **This helper centralizes resolution logic for:**
 *    - CLI name detection.
 *    - Command title fallback.
 *    - Package name resolution.
 *    - Package version normalization.
 *    - Presentation formatting (colored output).
 *
 * Unlike `resolveCliPresentationMeta`, this resolver operates purely
 * on factory-level inputs and does not depend on Commander internal state.
 *
 * The returned object is immutable.
 *
 * ------------------------------------------------------------------------
 *
 * - ***Resolution Priority:***
 *
 *    - *CLI Name:*
 *        1. Explicit `cliName`.
 *        2. `commandIdentity.commandName`.
 *        3. `process.argv[1]` basename.
 *        4. `undefined`.
 *
 *    - *Command Title:*
 *        1. `commandIdentity.cli()`.
 *        2. UI `title`.
 *        3. `undefined`.
 *
 *    - *Package Name:*
 *        1. Explicit `packageName`.
 *        2. `commandIdentity.packageName`.
 *        3. `package.json` name.
 *
 *    - *Package Version:*
 *        1. Explicit `packageVersion`.
 *        2. `commandIdentity.version`.
 *        3. `package.json` version.
 *
 * ------------------------------------------------------------------------
 *
 * @param params - Resolution parameters.
 * @returns Immutable base program presentation metadata.
 *
 * ------------------------------------------------------------------------
 * @internal
 */
export function resolveBaseProgramPresentationMeta(
  params: ResolveBaseProgramPresentationParams
): BaseProgramPresentationMeta {
  const { cliName, packageName, packageVersion, commandIdentity, ui } = params;

  /** Resolve CLI name. */
  const resolvedCliName = isNonEmptyString(cliName)
    ? cliName
    : isNonEmptyString(commandIdentity?.commandName)
      ? commandIdentity!.commandName
      : isNonEmptyString(process.argv[1])
        ? parse(process.argv[1]).name
        : undefined;

  /** Resolve command title. */
  const identityTitle = commandIdentity?.cli?.();
  const commandTitle = isNonEmptyString(identityTitle)
    ? identityTitle
    : isNonEmptyString(ui?.title)
      ? ui.title
      : undefined;

  /** Resolve package name. */
  const resolvedPackageName = isNonEmptyString(packageName)
    ? packageName
    : isNonEmptyString(commandIdentity?.packageName)
      ? commandIdentity.packageName
      : PACKAGE_META.name;

  /** Resolve package version (raw). */
  const resolvedPackageVersion = isNonEmptyString(packageVersion)
    ? packageVersion
    : isNonEmptyString(commandIdentity?.version)
      ? commandIdentity.version
      : PACKAGE_META.version;

  /** Normalize version prefix. */
  const normalizedVersion = normalizeVersionPrefix(resolvedPackageVersion);

  /** Determine CLI/package name difference. */
  const isDiffCommandName =
    !!resolvedCliName && resolvedCliName !== PACKAGE_META.name;

  /** Build formatted package name. */
  const pkgNameFormatted = `${picocolors.blueBright(resolvedPackageName)}${
    isDiffCommandName ? ` ${picocolors.cyanBright(`(${resolvedCliName})`)}` : ""
  }`;

  /** Build formatted default title. */
  const defaultTitleFormatted = joinInline(
    picocolors.blueBright(PACKAGE_META.name + "@" + normalizedVersion),
    isDiffCommandName
      ? `${picocolors.magentaBright(ICONS.arrowRight)} ${picocolors.yellowBright(resolvedCliName)}`
      : false
  );

  return Object.freeze({
    resolvedCliName,
    commandTitle,
    resolvedPackageName,
    resolvedPackageVersion,
    normalizedVersion,
    isDiffCommandName,
    pkgNameFormatted,
    defaultTitleFormatted
  });
}
