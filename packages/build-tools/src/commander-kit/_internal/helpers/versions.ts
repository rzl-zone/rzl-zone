import "@rzl-zone/node-only";

import type { CommandContext } from "@/commander-kit/types";

import { Argument } from "commander";

import {
  isUndefined,
  isNonEmptyString,
  isNull,
  isNil
} from "@/_internal/utils/helper";

import {
  ConfigurationError,
  joinInline,
  joinLinesLoose,
  picocolors
} from "@/utils/client";
import { ICONS } from "@/utils/server";

import { CliArgument } from "@/commander-kit/core/argument";
import { COMMANDER_UI_DEFAULTS } from "@/commander-kit/constants";

import { getInternalState } from "../state";

const { DESCRIPTIONS, FLAGS } = COMMANDER_UI_DEFAULTS;

/** ------------------------------------------------------------------------
 * * Composes a normalized version description string.
 * ------------------------------------------------------------------------
 *
 * Generates a standardized version description sentence.
 *
 * If a valid `packageName` is provided, the resulting string will follow:
 *
 *   "The version package of \<packageName\>."
 *
 * Otherwise, a fallback description from `DESCRIPTIONS.VERSION`
 * from {@link COMMANDER_UI_DEFAULTS| `COMMANDER_UI_DEFAULTS`}
 * will be used.
 *
 * ------------------------------------------------------------------------
 * #### 🔎 Normalization Rules.
 * ------------------------------------------------------------------------
 *
 * - **The returned string is always:**
 *      - Trimmed.
 *      - Guaranteed to end with exactly one trailing period.
 *      - Normalized to prevent duplicate trailing dots.
 *
 * ------------------------------------------------------------------------
 *
 * @param packageName - Optional package name used to compose
 * a contextual version description.
 *
 * @returns A normalized sentence ending with a single period.
 *
 * @throws {ConfigurationError}
 * Thrown when `packageName` is provided but is not a non-empty string.
 *
 * ------------------------------------------------------------------------
 *
 * @example
 * ```ts
 * composeVersionDescription("my-cli");
 * // ➔ "The version package of my-cli."
 * ```
 *
 * @example
 * ```ts
 * composeVersionDescription();
 * // ➔ Falls back to `DESCRIPTIONS.VERSION` from `COMMANDER_UI_DEFAULTS` (normalized)
 * ```
 *
 * @internal
 */
export const composeVersionDescription = (packageName?: string): string => {
  const isPkgNameEmptyString = !isNonEmptyString(packageName);

  if (!isUndefined(packageName) && isPkgNameEmptyString) {
    throw ConfigurationError.type(
      "packageName",
      "a non-empty string",
      packageName,
      "composeVersionDescription"
    );
  }

  const text = !isPkgNameEmptyString
    ? `The version package of ${packageName}.`
    : DESCRIPTIONS.VERSION;

  const trimmed = text.trim().replace(/\.*$/, "");
  return trimmed + ".";
};

/** Takes an argument and returns its human readable equivalent for help usage command.
 *
 * @internal
 */
export function humanReadableArgName(arg: Argument | CliArgument): string {
  if (!(arg instanceof Argument)) {
    throw ConfigurationError.type(
      "arg",
      "instanceof Argument or CliArgument",
      arg,
      "humanReadableArgName"
    );
  }

  const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");

  return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
}

/** Removes a leading `"v"` from a version string only if it is
 * immediately followed by a digit.
 *
 * - ***This safely normalizes common semver formats like:***
 *    - `v1.2.3` ➔ `1.2.3`.
 *    - `1.2.3`  ➔ unchanged.
 *    - `vbeta`  ➔ unchanged.
 *    - `null` | `undefined`  ➔ unchanged.
 *
 * The function avoids naive slicing and ensures
 * non-semver strings are not modified.
 *
 * @param version - The version string to normalize.
 * @returns The normalized version string.
 *
 * @internal
 */
export function normalizeVersionPrefix(version: string): string;
export function normalizeVersionPrefix(version: string | null): string | null;
export function normalizeVersionPrefix(version?: string): string | undefined;
export function normalizeVersionPrefix(version?: null): null | undefined;
export function normalizeVersionPrefix(version: null): null;
export function normalizeVersionPrefix(
  version?: string | null
): string | null | undefined;
export function normalizeVersionPrefix(
  version: string | null | undefined
): string | null | undefined {
  if (!isNil(version) && !isNonEmptyString(version)) {
    throw ConfigurationError.type(
      "version",
      "a non-empty string, null or undefined",
      version,
      "composeVersionDescription"
    );
  }

  if (isNull(version)) return null;
  return version?.replace(/^v(?=\d)/, "");
}

/** Options for {@link ensureVersionInjected | `ensureVersionInjected`}.
 *
 * @internal
 */
export type EnsureVersionInjectedOptions = {
  /** Pre-formatted package name used in the styled version output. */
  pkgNameFormatted?: string;

  /** Normalized package version (without leading `"v"`). */
  normalizedVersion: string;
};

/** Ensures the version option is lazily injected into the command
 * before parsing occurs.
 *
 * - **This helper mirrors the default `.version()` behavior but allows
 *   custom styled output to be injected only if:**
 *      - The user did NOT explicitly call `.version()`.
 *      - The version has NOT already been injected.
 *
 * The injection is intentionally deferred until `parse()` /
 * `parseAsync()` time to avoid interfering with user-land
 * configuration order.
 *
 * This function is idempotent and safe to call multiple times.
 *
 * @internal
 */
export function ensureVersionInjected(
  cmd: CommandContext,
  options: EnsureVersionInjectedOptions
): void {
  const { pkgNameFormatted, normalizedVersion } = options;
  const _internal = getInternalState(cmd);

  if (!_internal.versionSetByUser && !_internal.versionInjected) {
    const _isNonEmptyString = isNonEmptyString(pkgNameFormatted);

    const _pkgName = _isNonEmptyString ? pkgNameFormatted : undefined;

    const _subTitle = _isNonEmptyString
      ? `${pkgNameFormatted} ${picocolors.reset("version")}:`
      : `${picocolors.blueBright("Version")}:`;

    _internal.versionOriginal?.(
      joinLinesLoose(
        _subTitle,
        joinInline(
          `${picocolors.magentaBright(ICONS.arrowRight)}`,
          `${picocolors.gray(`v${normalizedVersion}`)}`
        )
      ),
      FLAGS.VERSION,
      composeVersionDescription(_pkgName)
    );

    _internal.versionInjected = true;
  }
}
