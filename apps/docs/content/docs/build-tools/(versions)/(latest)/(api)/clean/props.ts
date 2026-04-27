import type {
  CleanJsArtifactsOptions,
  StringCollection
} from "@rzl-zone/build-tools";
import type { Prettify } from "@rzl-zone/ts-types-plus";

/** @version 0.0.7
 *
 * @default []
 */
type DefaultOptionsCleanBuildArtifacts = {
  /** **Optional configuration:**
   *
   *   - [`removeSourceMap`](#remove-source-map): Whether to remove `sourceMappingURL` comments.
   *   - [`removeRegion`](#remove-region): Whether to remove `region` comments.
   *   - [`removeAdjacentEmptyLines`](#remove-adjacent-empty-lines): Whether to remove empty lines adjacent to removed comments.
   *   - [`logLevel`](#log-level): Controls how verbose the logger output should be.
   *   - [`patternOptions`](#pattern-options): Optional configuration for controlling file pattern resolution.
   *
   * @default { removeSourceMap: false; removeRegion: true; removeAdjacentEmptyLines: false; logLevel: "info"; patternOptions: { absolute: false, baseNameMatch: false, caseSensitiveMatch: true, concurrency: os.cpus().length, dot: true, followSymbolicLinks: true, globstar: true, ignore: [], markDirectories: false, objectMode: false, onlyDirectories: false, onlyFiles: true, unique: true, throwErrorOnBrokenSymbolicLink: false } }
   * @link [CleanJsBuildArtifacts | CleanTypesBuildArtifacts](#options)
   */
  options?: CleanJsArtifactsOptions;
};

//! cleanJsBuildArtifacts
/** @version 0.0.7 */
export type CleanJsBuildArtifacts = Prettify<
  {
    /** **Glob pattern or list of patterns pointing to JS output files.**
     *
     * @default -
     *
     * @link [CleanJsBuildArtifacts](#pattern)
     */
    pattern: StringCollection;
  } & DefaultOptionsCleanBuildArtifacts,
  { recursive: true }
>;

//! cleanTsBuildArtifacts
/** @version 0.0.7 */
export type CleanTypesBuildArtifacts = Prettify<
  {
    /** **Glob pattern or list of patterns pointing to Types output files.**
     *
     * @default -
     *
     * @link [CleanTypesBuildArtifacts](#pattern)
     */
    pattern: StringCollection;
  } & DefaultOptionsCleanBuildArtifacts,
  { recursive: true }
>;
