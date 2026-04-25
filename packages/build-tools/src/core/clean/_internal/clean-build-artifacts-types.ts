import type { Prettify } from "@/_internal/types/extra";
import type { BaseOptions } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanJsBuildArtifacts } from "../clean-js-build-artifacts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanTypesBuildArtifacts } from "../clean-types-build-artifacts";

import type { DEFAULT_CLEAN_PATTERN_POLICY } from "./clean-build-artifacts-constant";

/** Type Options for {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`} and {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}. */
export type CleanCoreOptions = Prettify<
  {
    /** ----------------------------------------------------------------
     * * ***Whether to remove `sourceMappingURL` comments.***
     * ----------------------------------------------------------------
     *
     * @default false
     */
    removeSourceMap?: boolean;
    /** ----------------------------------------------------------------
     * * ***Whether to remove `region` comments.***
     * ----------------------------------------------------------------
     *
     * @default true
     */
    removeRegion?: boolean;
    /** ----------------------------------------------------------------
     * * ***Whether to remove empty lines adjacent to removed comments.***
     * ----------------------------------------------------------------
     * Useful for keeping output files compact and visually clean.
     *
     * @default false
     */
    removeAdjacentEmptyLines?: boolean;
  } & BaseOptions<
    typeof DEFAULT_CLEAN_PATTERN_POLICY.filesOnly,
    typeof DEFAULT_CLEAN_PATTERN_POLICY.forceUnique
  >
>;
