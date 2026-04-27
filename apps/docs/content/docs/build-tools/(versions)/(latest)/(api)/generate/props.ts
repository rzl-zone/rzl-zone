import type {
  GeneratePackageBannerOptions,
  EnsureFinalNewlineOptions,
  StringCollection
} from "@rzl-zone/build-tools";
import type { OmitStrict, Prettify } from "@rzl-zone/ts-types-plus";

type PackageJson = Pick<GeneratePackageBannerOptions, "packageJson">;
//! generatePackageBanner
/** @version 0.0.7 */
export type GeneratePackageBanner = {
  /** **Required configuration:**
   *
   *   - [`title`](#title): Display title shown in the banner.
   *   - [`author`](#author): Author name displayed in the banner.
   *   - [`packageJson`](#package-json): Custom package metadata override.
   *   - [`withEof`](#with-eof): Append an end-of-file newline to the banner output.
   *
   * @default { title: string, author: string, packageJson: object, withEof: true }
   * @link [GeneratePackageBannerOptions](#options)
   */
  options?: Prettify<
    OmitStrict<GeneratePackageBannerOptions, "packageJson"> & {
      packageJson?: PackageJson;
    }
  >;
};

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
