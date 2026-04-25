import "@rzl-zone/node-only";

import type { PackageJson } from "type-fest";

import { isNonEmptyString, isPlainObject } from "@/_internal/utils/helper";

import { joinLinesLoose } from "@/utils/helper/formatter";
import { getPackageJson } from "../../get/package-json";

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link generatePackageBanner | **`generate-package-banner`**}.***
 * ----------------------------------------------------------------
 */
export type GeneratePackageBannerOptions = {
  /** ----------------------------------------------------------------
   * * ***Display title shown in the banner.***
   * ----------------------------------------------------------------
   *
   * Defaults to the `name` field from `package.json`
   * when available.
   */
  title?: string;

  /** ----------------------------------------------------------------
   * * ***Author name displayed in the banner.***
   * ----------------------------------------------------------------
   *
   * When omitted, attempts to resolve from:
   * - `author.name`.
   * - `author` (*string*).
   */
  author?: string;

  /** ----------------------------------------------------------------
   * * ***Custom package metadata override.***
   * ----------------------------------------------------------------
   *
   * When provided, this object will be used instead of
   * reading from the filesystem.
   *
   * - Useful for testing or advanced build pipelines.
   */
  packageJson?: PackageJson;

  /** ----------------------------------------------------------------
   * * ***Append an end-of-file newline to the banner output.***
   * ----------------------------------------------------------------
   *
   * Controls whether the generated banner is terminated with
   * an end-of-file (EOF) newline character.
   *
   * When enabled, a trailing newline is appended to ensure:
   * - POSIX-compliant text files.
   * - Clean concatenation with subsequent source content.
   * - Consistent formatting during code injection.
   *
   * @default true
   */
  withEof?: boolean;
};

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Generate a standardized top banner from `package.json`.***
 * ----------------------------------------------------------------
 *
 * This utility generates a formatted banner comment suitable
 * for insertion at the top of bundled output files.
 *
 * - *Banner features:*
 *     - Reads metadata from the nearest `package.json`.
 *     - Provides safe fallbacks for missing fields.
 *     - Produces a consistent, readable comment block.
 *
 * - *This function is intended for:*
 *     - Bundler banners (tsdown, tsup, rollup, esbuild, etc).
 *     - Generated build artifacts.
 *     - Distributed library outputs.
 *
 * @param {GeneratePackageBannerOptions} [options]
 * Optional banner configuration.
 *
 * @returns {string}
 * A formatted banner comment string.
 *
 * @example
 * ```ts
 * const banner = await generatePackageBanner({
 *   title: "Rzl Build Tools",
 *   author: "Rzl"
 * });
 * ```
 *
 * @example
 * ```ts
 * const banner = await generatePackageBanner();
 * ```
 */
export const generatePackageBanner = async (
  options: GeneratePackageBannerOptions = {}
): Promise<string> => {
  const pkg = options.packageJson ?? (await getPackageJson());
  const withEof = options.withEof ?? true;

  const title =
    options.title ??
    (isNonEmptyString(pkg.name) ? pkg.name : "Unknown Package");

  const version = isNonEmptyString(pkg.version) ? pkg.version : "Unknown";

  const author =
    options.author ??
    (isNonEmptyString(pkg.author)
      ? pkg.author
      : isPlainObject(pkg.author) && isNonEmptyString(pkg.author.name)
        ? pkg.author.name
        : "Unknown");

  const repository = isNonEmptyString(pkg.homepage)
    ? pkg.homepage.split("#")[0]
    : isNonEmptyString(pkg.repository)
      ? pkg.repository.replace(/^git\+/, "").replace(/\.git$/, "")
      : isPlainObject(pkg.repository) && isNonEmptyString(pkg.repository.url)
        ? pkg.repository.url.replace(/^git\+/, "").replace(/\.git$/, "")
        : "Unknown";

  return joinLinesLoose(
    "/*!",
    "* ========================================================================",
    `*  ${title}`,
    "* ------------------------------------------------------------------------",
    `*  Version: \`${version}\``,
    `*  Author: \`${author}\``,
    `*  Repository: \`${repository}\``,
    "* ========================================================================",
    "*/",
    withEof ? "" : false
  );
};
