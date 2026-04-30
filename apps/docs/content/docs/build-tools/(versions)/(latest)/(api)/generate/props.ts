import type {
  GeneratePackageBannerOptions,
  StringCollection,
  GenerateReferenceOptions
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
   * @link [`GeneratePackageBannerOptions-options`](#options)
   */
  options?: Prettify<
    OmitStrict<GeneratePackageBannerOptions, "packageJson"> & {
      packageJson?: PackageJson;
    }
  >;
};

//! generateReferenceIndex
/** @version 0.0.7 */
export type GenerateReferenceIndex = Prettify<
  {
    /** **Glob pattern or list of patterns pointing to JS output files.**
     *
     * @default -
     *
     * @link [`GenerateReferenceIndex-pattern`](#pattern)
     */
    pattern: StringCollection;

    /** **Required configuration:**
     *
     *   - [`outDir`](#out-dir): Output directory.
     *   - [`outFileName`](#out-filename): Output index file name.
     *   - [`withExportTypes`](#with-export-types): Enable exported type aggregation.
     *   - [`inputDirReference`](#input-dir-reference): Base directory for resolving reference paths.
     *   - [`onlyDeclarations`](#only-declarations): Restrict input to TypeScript declaration files only.
     *   - [`banner`](#banner): Output banner configuration.
     *   - [`logLevel`](#log-level): Controls how verbose the logger output should be.
     *   - [`patternOptions`](#pattern-options): Optional configuration for controlling file pattern resolution.
     *
     * @default { outDir: "dist/.references"; outFileName: "index.d.ts"; withExportTypes: false; inputDirReference: "dist"; onlyDeclarations: true; banner: true; logLevel: "info"; patternOptions: { absolute: false, baseNameMatch: false, caseSensitiveMatch: true, concurrency: os.cpus().length, dot: true, followSymbolicLinks: true, globstar: true, ignore: [], markDirectories: false, objectMode: false, onlyDirectories: false, onlyFiles: true, unique: true, throwErrorOnBrokenSymbolicLink: false } }
     * @link [`GenerateReferenceOptions-options`](#options)
     */
    options?: GenerateReferenceOptions;
  },
  { recursive: true }
>;
