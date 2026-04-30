import type {
  InjectBannerOptions,
  InjectDirectiveOptions,
  StringCollection
} from "@rzl-zone/build-tools";
import type { Prettify } from "@rzl-zone/ts-types-plus";

//! injectBanner
/** @version 0.0.7 */
export type InjectBanner = Prettify<
  {
    /** **Glob pattern or list of patterns pointing to JS output files.**
     *
     * @default -
     *
     * @link [`InjectBanner-pattern`](#pattern)
     */
    pattern: StringCollection;

    /** **Banner string(s) to inject.**
     *
     * @default -
     *
     * @link [`InjectBanner-bannerText`](#banner-text)
     */
    bannerText: StringCollection;

    /** **Optional configuration:**
     *
     *   - [`replaceBanner`](#replace-banner): Replace existing banner block(s).
     *   - [`removeDuplicate`](#remove-duplicate): Remove duplicated banner blocks.
     *   - [`bannerPosition`](#banner-position): Control where new banner block(s) are injected.
     *   - [`logLevel`](#log-level): Controls how verbose the logger output should be.
     *   - [`patternOptions`](#pattern-options): Optional configuration for controlling file pattern resolution.
     *
     * @default { replaceBanner: false; removeDuplicate: true; bannerPosition: "after-existing"; logLevel: "info"; patternOptions: { absolute: false, baseNameMatch: false, caseSensitiveMatch: true, concurrency: os.cpus().length, dot: true, followSymbolicLinks: true, globstar: true, ignore: [], markDirectories: false, objectMode: false, onlyDirectories: false, onlyFiles: true, unique: true, throwErrorOnBrokenSymbolicLink: false } }
     * @link [`InjectBannerOptions-options`](#options)
     */
    options?: InjectBannerOptions;
  },
  { recursive: true }
>;

//! injectDirective
/** @version 0.0.7 */
export type InjectDirective = Prettify<
  {
    /** **Glob pattern or list of patterns pointing to JS output files.**
     *
     * @default -
     *
     * @link [`InjectDirective-pattern`](#pattern)
     */
    pattern: StringCollection;

    /** **Directive string(s) to inject.**
     *
     * @default -
     *
     * @link [`InjectDirective-directive`](#banner-text)
     */
    directive: StringCollection;

    /** **Optional configuration:**
     *
     *   - [`logLevel`](#log-level): Controls how verbose the logger output should be.
     *   - [`patternOptions`](#pattern-options): Optional configuration for controlling file pattern resolution.
     *
     * @default { logLevel: "info"; patternOptions: { absolute: false, baseNameMatch: false, caseSensitiveMatch: true, concurrency: os.cpus().length, dot: true, followSymbolicLinks: true, globstar: true, ignore: [], markDirectories: false, objectMode: false, onlyDirectories: false, onlyFiles: true, unique: true, throwErrorOnBrokenSymbolicLink: false } }
     * @link [`InjectDirectiveOptions-options`](#options)
     */
    options?: InjectDirectiveOptions;
  },
  { recursive: true }
>;
