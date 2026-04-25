// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanJsBuildArtifacts } from "../clean-js-build-artifacts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanTypesBuildArtifacts } from "../clean-types-build-artifacts";

import {
  defaultPatternOptions,
  type PatternOptions,
  type PatternRuntimePolicy,
  resolvePatternOptions
} from "@/_internal/libs/fast-globe-options";

import { DEFAULT_LOG_LEVEL } from "@/_internal/utils/log-level";

import type { CleanCoreOptions } from "./clean-build-artifacts-types";

/** ----------------------------------------------------------------
 * * ***Default Pattern Policy for **clean build artifact** operations.***
 * ----------------------------------------------------------------
 *
 * Defines the runtime behavior for pattern resolution used by:
 * - {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`}.
 * - {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}.
 *
 * @remarks
 * - `filesOnly`: Ensures only files are matched.
 * - `forceUnique`: Deduplicates matched results.
 */
export const DEFAULT_CLEAN_PATTERN_POLICY = {
  filesOnly: true,
  forceUnique: true
} as const satisfies PatternRuntimePolicy<boolean, boolean>;

/** ----------------------------------------------------------------
 * * ***Resolved Pattern Options for **clean build artifact** operations.***
 * ----------------------------------------------------------------
 *
 * Pattern options used by:
 * - {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`}.
 * - {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}.
 */
export const resolvedCleanPatternOption: PatternOptions<true, true> =
  resolvePatternOptions(defaultPatternOptions, DEFAULT_CLEAN_PATTERN_POLICY);

/** @internal Default Options for {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`} and {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}. */
export const DEFAULT_CLEAN_OPTION = {
  removeSourceMap: false,
  removeRegion: true,
  removeAdjacentEmptyLines: false,
  patternOptions: resolvedCleanPatternOption,
  logLevel: DEFAULT_LOG_LEVEL
} as const satisfies CleanCoreOptions;
