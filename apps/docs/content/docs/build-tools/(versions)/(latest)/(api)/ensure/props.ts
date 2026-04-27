import type {
  EnsureCssImportOptions,
  EnsureFinalNewlineOptions,
  StringCollection
} from "@rzl-zone/build-tools";
import type { Prettify } from "@rzl-zone/ts-types-plus";

//! ensureCssImport
/** @version 0.0.7 */
export type EnsureCssImport = Prettify<
  {
    /** **Glob pattern or list of patterns pointing to JS output files.**
     *
     * @default -
     *
     * @link [EnsureCssImport](#pattern)
     */
    pattern: StringCollection;

    /** **Required configuration:**
     *
     *   - [`cssImportPath`](#css-import-path): CSS import path(s) to ensure exist in JS output.
     *   - [`dedupe`](#dedupe): Remove duplicate CSS imports (recommended).
     *   - [`sort`](#sort): Whether to remove empty lines adjacent to removed comments.
     *   - [`minify`](#minify): Minify JS output (except directive prologue).
     *   - [`logLevel`](#log-level): Controls how verbose the logger output should be.
     *   - [`patternOptions`](#pattern-options): Optional configuration for controlling file pattern resolution.
     *
     * @default -
     * @link [EnsureCssImportOptions](#options)
     */
    options: EnsureCssImportOptions;
  },
  { recursive: true }
>;

//! ensureFinalNewline
/** @version 0.0.7 */
export type EnsureFinalNewline = Prettify<
  {
    /** **Glob pattern or list of patterns pointing to JS output files.**
     *
     * @default -
     *
     * @link [EnsureFinalNewline](#pattern)
     */
    pattern: StringCollection;

    /** **Required configuration:**
     *
     *   - [`logLevel`](#log-level): Controls how verbose the logger output should be.
     *   - [`patternOptions`](#pattern-options): Optional configuration for controlling file pattern resolution.
     *
     * @default -
     * @link [EnsureFinalNewlineOptions](#options)
     */
    options?: EnsureFinalNewlineOptions;
  },
  { recursive: true }
>;
