import "@rzl-zone/node-only";

import type { StringCollection } from "@/types";
import type { CleanCoreOptions } from "./_internal/clean-build-artifacts-types";

import { isNonEmptyString } from "@/_internal/utils/helper";
import { JS_OUTPUT_FILE_RE } from "@/_internal/utils/source";
import { resolveLogVerbosity } from "@/_internal/utils/log-level";

import { CommandIdentity } from "@/commander-kit/identity";

import { DEFAULT_CLEAN_OPTION } from "./_internal/clean-build-artifacts-constant";
import { runCleanBuildArtifacts } from "./_internal/clean-build-artifacts-runner";

/** Command identity associated with {@link cleanJsBuildArtifacts | **`clean-js-build-artifacts`**}. */
export const commandCjbaIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "clean-js-build-artifacts"
});

/** ----------------------------------------------------------------
 * * ***Configuration options for {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`}.***
 * ----------------------------------------------------------------
 */
export type CleanJsArtifactsOptions = CleanCoreOptions;

/** ----------------------------------------------------------------
 * * ***Removes build artifact comments from compiled JavaScript files.***
 * ----------------------------------------------------------------
 *
 * This function scans files matching the provided glob pattern(s) and removes:
 * - Source path comments.
 * - Source region comments.
 * - ESLint directive comments.
 * - Optional source map references.
 *
 * It can also remove empty lines adjacent to those comments to keep
 * output files tidy.
 *
 * @param {string | string[] | Set<string>} pattern - Glob pattern or list of patterns pointing to JS output files.
 * @param {CleanJsArtifactsOptions} options - Cleanup configuration options, see {@link CleanJsArtifactsOptions | **`CleanJsArtifactsOptions`**}.
 *
 * @example
 * ```ts
 * await cleanJsBuildArtifacts("dist/**\/*.js");
 * await cleanJsBuildArtifacts("dist/**\/*.{js,cjs,mjs}");
 * ```
 *
 * @example
 * ```ts
 * await cleanJsBuildArtifacts(["dist/**\/*.js", "build/*\/*.mjs"], {
 *   removeSourceMap: false,
 *   removeRegionComment: false,
 *   removeAdjacentEmptyLines: true
 * });
 * ```
 */
export const cleanJsBuildArtifacts = async (
  pattern: StringCollection,
  options: CleanJsArtifactsOptions = {}
): Promise<void> => {
  const logLevel = resolveLogVerbosity(options, DEFAULT_CLEAN_OPTION.logLevel);

  return await runCleanBuildArtifacts({
    patterns: pattern,
    options: { ...options, logLevel },
    fileTest: JS_OUTPUT_FILE_RE,
    logAction: {
      actionName: "Cleaning JS Build Artifacts",
      title: isNonEmptyString(options.__commandTitle)
        ? options.__commandTitle
        : commandCjbaIdentity.utility()
    }
  });
};
