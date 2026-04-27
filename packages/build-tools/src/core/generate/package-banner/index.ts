import "@rzl-zone/node-only";

import type { PackageJson } from "type-fest";

import { isNonEmptyString, isPlainObject } from "@/_internal/utils/helper";

import { EOL, joinLinesLoose } from "@/utils/helper/formatter";
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
 * By default, it automatically locates and reads the nearest
 * `package.json` file, you may also provide a custom package object
 * through the options parameter.
 *
 * - *Banner features:*
 *     - Reads metadata from the nearest `package.json`.
 *     - Supports custom package metadata via options.
 *     - Provides safe fallbacks for missing fields.
 *     - Produces a consistent, readable comment block.
 *     - Normalizes repository URLs when possible.
 *
 * - *This function is intended for:*
 *     - Bundler banners (tsdown, tsup, rollup, esbuild, etc).
 *     - Generated build artifacts.
 *     - Distributed library outputs.
 *
 * @param {GeneratePackageBannerOptions} [options]
 * Optional banner configuration.
 *
 * @returns {Promise<string>}
 * A formatted banner comment string.
 *
 * @throws {Error}
 * If no `package.json` can be found.
 *
 * @throws {Error}
 * If the resolved `package.json` contains invalid JSON.
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
  let pkgJson: PackageJson | undefined;

  if (isPlainObject(options.packageJson)) {
    pkgJson = options.packageJson;
  } else {
    try {
      pkgJson = await getPackageJson();
    } catch (error) {
      throw new Error(
        "[@rzl-zone/build-tools] - (generate-package-banner): Failed to resolve package.json" +
          EOL +
          `Reason: ${(error as Error)?.message || "unknown"}`,
        { cause: error }
      );
    }
  }

  const withEof = options.withEof ?? true;

  const title =
    options.title ??
    (isNonEmptyString(pkgJson.name) ? pkgJson.name : "Unknown Package");

  const version = isNonEmptyString(pkgJson.version)
    ? pkgJson.version
    : "Unknown";

  const author =
    options.author ??
    (isNonEmptyString(pkgJson.author)
      ? pkgJson.author
      : isPlainObject(pkgJson.author) && isNonEmptyString(pkgJson.author.name)
        ? pkgJson.author.name
        : "Unknown");

  const repository = isNonEmptyString(pkgJson.homepage)
    ? pkgJson.homepage.split("#")[0]
    : isNonEmptyString(pkgJson.repository)
      ? pkgJson.repository.replace(/^git\+/, "").replace(/\.git$/, "")
      : isPlainObject(pkgJson.repository) &&
          isNonEmptyString(pkgJson.repository.url)
        ? pkgJson.repository.url.replace(/^git\+/, "").replace(/\.git$/, "")
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
