import "@rzl-zone/node-only";

import type { StringCollection } from "@/types";
import type { CleanCoreOptions } from "./_internal/clean-build-artifacts-types";

import { isNonEmptyString } from "@/_internal/utils/helper";
import { resolveLogVerbosity } from "@/_internal/utils/log-level";
import { TS_DECLARATION_FILE_RE } from "@/_internal/utils/source";

import { CommandIdentity } from "@/commander-kit/identity";

import { DEFAULT_CLEAN_OPTION } from "./_internal/clean-build-artifacts-constant";
import { runCleanBuildArtifacts } from "./_internal/clean-build-artifacts-runner";

/** Command identity associated with {@link cleanTypesBuildArtifacts | **`clean-types-build-artifacts`**}. */
export const commandCtbaIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "clean-types-build-artifacts"
});

/** ----------------------------------------------------------------
 * * ***Configuration options for {@link cleanTypesBuildArtifacts | **`cleanTypesBuildArtifacts`**}.***
 * ----------------------------------------------------------------
 */
export type CleanTypesArtifactsOptions = CleanCoreOptions;

/** ----------------------------------------------------------------
 * * ***Removes build artifact comments from compiled Types files.***
 * ----------------------------------------------------------------
 *
 * This function scans files matching the provided glob pattern(s) and removes:
 * - Source path comments.
 * - ESLint directive comments.
 * - Optional source map references.
 *
 * It can also remove empty lines adjacent to those comments to keep
 * output files tidy.
 *
 * @param pattern - Glob pattern or list of patterns pointing to Types output files.
 * @param options - Cleanup configuration options, see {@link CleanTypesArtifactsOptions | **`CleanTypesArtifactsOptions`**}.
 *
 * @example
 * ```ts
 * await cleanTypesBuildArtifacts("dist/**\/*.d.ts");
 * await cleanTypesBuildArtifacts("dist/**\/*.d.{ts,cts,mts}");
 * ```
 *
 * @example
 * ```ts
 * await cleanTypesBuildArtifacts(["dist/**\/*.d.ts", "build/*\/*.mts"], {
 *   removeSourceMap: false,
 *   removeAdjacentEmptyLines: true
 * });
 * ```
 */
export const cleanTypesBuildArtifacts = async (
  pattern: StringCollection,
  options: CleanTypesArtifactsOptions = {}
): Promise<void> => {
  const logLevel = resolveLogVerbosity(options, DEFAULT_CLEAN_OPTION.logLevel);

  return await runCleanBuildArtifacts({
    patterns: pattern,
    options: { ...options, logLevel },
    fileTest: TS_DECLARATION_FILE_RE,
    logAction: {
      actionName: "Cleaning Types Build Artifacts",
      title: isNonEmptyString(options.__commandTitle)
        ? options.__commandTitle
        : commandCtbaIdentity.utility()
    }
  });
};
