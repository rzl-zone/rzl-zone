import type {
  NormalizeJsBuildNewlinesOptions,
  StringCollection
} from "@rzl-zone/build-tools";
import type { Prettify } from "@rzl-zone/ts-types-plus";

//! normalizeJsBuildNewlines
/** @version 0.0.7 */
export type NormalizeJsBuildNewlines = Prettify<
  {
    /** **Glob pattern or list of patterns pointing to JS output files.**
     *
     * @default -
     *
     * @link [`NormalizeJsBuildNewlines-pattern`](#pattern)
     */
    pattern: StringCollection;

    /** **Optional configuration:**
     *
     *   - [`logLevel`](#log-level): Controls how verbose the logger output should be.
     *   - [`patternOptions`](#pattern-options): Optional configuration for controlling file pattern resolution.
     *
     * @default { logLevel: "info"; patternOptions: { absolute: false, baseNameMatch: false, caseSensitiveMatch: true, concurrency: os.cpus().length, dot: true, followSymbolicLinks: true, globstar: true, ignore: [], markDirectories: false, objectMode: false, onlyDirectories: false, onlyFiles: true, unique: true, throwErrorOnBrokenSymbolicLink: false } }
     * @link [`NormalizeJsBuildNewlinesOptions-options`](#options)
     */
    options?: NormalizeJsBuildNewlinesOptions;
  },
  { recursive: true }
>;
