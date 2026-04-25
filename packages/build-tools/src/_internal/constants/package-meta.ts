import packageJson from "../../../package.json";

/** ----------------------------------------------------------------
 * * ***Shared package metadata derived from the package manifest.***
 * ----------------------------------------------------------------
 *
 * Centralized access to metadata sourced from the root
 * `package.json` file.
 *
 * - *This utility exists to:*
 *      - Avoid repeated `package.json` imports across Node.js entry points.
 *      - Ensure consistent versioning and naming.
 *      - Provide a single source of truth for package-level metadata.
 *
 * - ⚠️ **Important:**
 *      - This file MUST only be imported in Node.js environments.
 *      - Not intended for browser or edge runtimes.
 *
 * @internal
 *
 */
export const PACKAGE_META = Object.freeze({
  /** Package name. */
  name: packageJson.name,

  /** Current package version. */
  version: packageJson.version
});
