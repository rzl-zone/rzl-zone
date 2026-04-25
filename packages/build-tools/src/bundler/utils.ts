import {
  generatePackageBanner,
  type GeneratePackageBannerOptions
} from "@/core/generate/package-banner";

/** ----------------------------------------------------------------
 * * ***External modules matching patterns.***
 * ----------------------------------------------------------------
 *
 * Regular expressions used to mark modules as external during bundling.
 *
 * - *Included by default:*
 *      - `node:` prefixed built-in modules.
 *      - legacy `node` imports.
 *      - `fs` and its subpaths.
 *
 * @remarks This is an internal constant used to identify node built-in modules during bundling.
 */
export const nodeExternalPatterns: Array<string | RegExp> = [
  /^node:/,
  /^node/,
  /^fs/
] as const;

type GetBannerBuildOutputOptions = GeneratePackageBannerOptions;

/** ----------------------------------------------------------------
 * * ***Get a Generated package banner.***
 * ----------------------------------------------------------------
 *
 * Banner string injected into the output bundle.
 *
 * The value is generated dynamically from **`generatePackageBanner`**.
 *
 * @deprecated Use `import { generatePackageBanner } from "@rzl-zone/build-tools";` instead.
 */
export const getBannerBuildOutput = async (
  options?: GetBannerBuildOutputOptions
): Promise<string> => {
  return await generatePackageBanner(options);
};
