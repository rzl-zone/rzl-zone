import "@rzl-zone/node-only";

import path from "node:path";

import type { AnyString, Awaitable } from "@/_internal/types/extra";
import type { BaseOptions, PatternOptions, StringCollection } from "@/types";

import {
  defaultPatternOptions,
  type PatternRuntimePolicy,
  resolvePatternOptions,
  sourceOfPatternOptions
} from "@/_internal/libs/fast-globe-options";

import {
  canLog,
  DEFAULT_LOG_LEVEL,
  resolveLogVerbosity,
  VERBOSE_LOG
} from "@/_internal/utils/log-level";
import { TS_DECLARATION_FILE_RE } from "@/_internal/utils/source";
import { BUILD_LOGGER, sourceOf } from "@/_internal/utils/logger-builder";
import { isNonEmptyString, toStringSet } from "@/_internal/utils/helper";

import {
  EOL,
  joinLinesLoose,
  picocolors as pcr
} from "@/utils/helper/formatter";
import { fastGlob, fsExtra } from "@/utils/server";

import { CommandIdentity } from "@/commander-kit/identity";

import { generatePackageBanner } from "../package-banner";

//? Constant -------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Default Pattern Policy for **generate reference index** operations.***
 * ----------------------------------------------------------------
 *
 * Defines the runtime behavior for pattern resolution used by:
 * - {@link generateReferenceIndex | **`generate-reference-index`**}.
 *
 * @remarks
 * - `filesOnly`: Ensures only files are matched.
 * - `forceUnique`: Deduplicates matched results.
 */
export const DEFAULT_GRI_PATTERN_POLICY = {
  filesOnly: true,
  forceUnique: true
} as const satisfies PatternRuntimePolicy<true, true>;

/** ----------------------------------------------------------------
 * * ***Resolved Pattern Options for **generate reference index** operations.***
 * ----------------------------------------------------------------
 *
 * Pattern options used by:
 * - {@link generateReferenceIndex | **`generate-reference-index`**}.
 */
export const resolvedGriPatternOption: PatternOptions<true, true> =
  resolvePatternOptions(defaultPatternOptions, DEFAULT_GRI_PATTERN_POLICY);

/** @internal Default ***Options*** for {@link generateReferenceIndex | **`generate-reference-index`**}. */
const DEFAULT_GRI_OPTIONS = {
  outDir: "dist/.references",
  outFileName: "index.d.ts",
  inputDirReference: "dist",
  withExportTypes: false,
  banner: true,
  onlyDeclarations: true,
  patternOptions: resolvedGriPatternOption,
  logLevel: DEFAULT_LOG_LEVEL
} as const satisfies GenerateReferenceOptions;

//? Utils ----------------------------------------------------------------
/** @internal Util for {@link generateReferenceIndex | **`generate-reference-index`**}. */
function normalizeRelative(from: string, to: string) {
  return path
    .relative(from, to)
    .replace(/\\/g, "/")
    .replace(/^([^./])/, "./$1"); // ensure ./ or ../
}
/** @internal Util for {@link generateReferenceIndex | **`generate-reference-index`**}. */
const resolveExportModulePath = (relativePath: string) => {
  const parsed = path.parse(relativePath);

  let baseName = parsed.name;

  // remove trailing ".d" ONLY for declaration outputs
  if (baseName.endsWith(".d")) {
    baseName = baseName.slice(0, -2);
  }

  return path.join(parsed.dir, baseName).replace(/\\/g, "/");
};
/** ----------------------------------------------------------------
 * * ***Validated output configuration input.***
 * ----------------------------------------------------------------
 *
 * Raw configuration object passed into `validateOut`.
 *
 * - Each field will be normalized and validated before use.
 *
 * @internal Utils for {@link generateReferenceIndex | **`generate-reference-index`**}.
 */
const validateOut = ({
  outDir,
  outFileName,
  inputDirReference
}: {
  /** --------------------------------------------------------------
   * * ***Output directory path.***
   * --------------------------------------------------------------
   *
   * Base directory where the generated index file will be written.
   *
   * - Leading & trailing whitespace will be trimmed.
   * - Trailing slash will be removed.
   *
   * @example
   * `"dist/"` ➔ `"dist"`
   */
  outDir: string;

  /** --------------------------------------------------------------
   * * ***Output declaration file name.***
   * --------------------------------------------------------------
   *
   * Must be a **file name only**, not a path.
   *
   * - ❌ `"dist/index.d.ts"`.
   * - ❌ `"../index.d.ts"`.
   * - ✅ `"index.d.ts"`.
   *
   * Used together with `outDir` to build the final output path.
   */
  outFileName: string;

  /** --------------------------------------------------------------
   * * ***Input reference base directory.***
   * --------------------------------------------------------------
   *
   * Used to strip the leading path from matched files when
   * generating reference and export paths.
   *
   * - ***Example:***
   *       - inputDirReference: `"dist"`.
   *       - file: `"dist/utils/logger.d.ts"`.
   *       - result: `"utils/logger.d.ts"`.
   */
  inputDirReference: string;
}) => {
  const normalizePath = (value: string) => {
    // if (!value) return undefined;

    const trimmed = value.trim();
    // if (!trimmed) return undefined;

    // remove trailing slash ("/foo/bar/" -> "/foo/bar")
    return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
  };

  const normalizeFileName = (value: string) => {
    // if (!value) return undefined;

    const trimmed = value.trim();
    // if (!trimmed) return undefined;

    // optional: prevent path traversal
    if (trimmed.includes("/") || trimmed.includes("\\")) {
      throw new Error(`Invalid outFileName: "${value}"`);
    }

    return trimmed;
  };

  return {
    outDir: normalizePath(outDir),
    inputDirReference: normalizePath(inputDirReference),
    outFileName: normalizeFileName(outFileName)
  };
};
/** @internal Util for {@link generateReferenceIndex | **`generate-reference-index`**}. */
const resolveBanner = async (banner: BannerInput): Promise<string> => {
  if (banner === false) return "";

  if (banner === true) {
    return (await generatePackageBanner()) + EOL;
  }

  const resolved = await banner;

  return isNonEmptyString(resolved) ? resolved : "";
};

//? Identity -------------------------------------------------------------
/** Command identity associated with {@link generateReferenceIndex | **`generate-reference-index`**}. */
export const commandGriIdentity: CommandIdentity = new CommandIdentity({
  defaultCommandName: "generate-reference-index"
});

//? Types ----------------------------------------------------------------
/** @internal Type for {@link generateReferenceIndex | **`generate-reference-index`**}.*/
type BannerInput = true | AnyString | false | Awaitable<AnyString>;
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link generateReferenceIndex | **`generate-reference-index`**}.***
 * ----------------------------------------------------------------
 */
export type GenerateReferenceOptions = {
  /** --------------------------------------------------------------
   * * ***Output directory.***
   * --------------------------------------------------------------
   *
   * Directory where the generated index file will be written.
   *
   * @default "dist/.references"
   */
  outDir?: string;

  /** --------------------------------------------------------------
   * * ***Output index file name.***
   * --------------------------------------------------------------
   *
   * Name of the generated `.d.ts` index file.
   *
   * @default "index.d.ts"
   */
  outFileName?: string;

  /** --------------------------------------------------------------
   * * ***Enable exported type aggregation.***
   * --------------------------------------------------------------
   *
   * When enabled, generates:
   *
   * ```ts
   * export * from "./module";
   * ```
   *
   * for each unique declaration entry.
   *
   * @default false
   */
  withExportTypes?: boolean;

  /** --------------------------------------------------------------
   * * ***Base directory for resolving reference paths.***
   * --------------------------------------------------------------
   *
   * Used to compute relative paths inside the generated index file.
   *
   * @default "dist"
   */
  inputDirReference?: string;

  /** --------------------------------------------------------------
   * * ***Restrict input to TypeScript declaration files only.***
   * --------------------------------------------------------------
   *
   * When enabled (`true`), this option filters the input files to include **only**
   * TypeScript declaration files with extensions `.d.ts`, `.d.mts`, and `.d.cts`.
   *
   * This filtering is applied **after** matching files by the provided glob patterns,
   * effectively excluding all other file types, including JavaScript outputs
   * (`.js`, `.mjs`, `.cjs`) and TypeScript source files (`.ts`, `.mts`, `.cts`).
   *
   * - *Examples:*
   *     - With a pattern like `"dist/**\/*.d.ts"`, enabling this option has no practical effect,
   *       since the pattern already matches only declaration files.
   *     - With a broader pattern such as `"dist/**\/*"` or `"dist/**\/*.ts"`,
   *       enabling this option will exclude non-declaration files (e.g., `.ts` source files),
   *       resulting in only declaration files being included.
   *     - If your patterns include JavaScript outputs (`.js`, `.mjs`, `.cjs`),
   *       enabling this option will exclude those files as well.
   *
   * When disabled (`false`), all matched files are included regardless of extension,
   * so JavaScript outputs and source files matching the patterns will be part of
   * the reference and export generation.
   *
   * Use this option and set to `true`, when you want to guarantee that only TypeScript declaration files
   * are included in the generated references and exports, preventing accidental
   * inclusion of source or JavaScript build output files.
   *
   * @default true
   */
  onlyDeclarations?: boolean;

  /** --------------------------------------------------------------
   * * ***Output banner configuration.***
   * --------------------------------------------------------------
   *
   * Controls the banner text prepended to the generated output file.
   *
   * - `true` **(default)** ➔ automatically generates banner from `package.json`
   *    using {@link generatePackageBanner | `generatePackageBanner`}.
   * - `false` ➔ disables banner injection entirely.
   * - `string` ➔ uses the provided custom banner text.
   * - `Promise<string>` ➔ resolved and used as banner text.
   *
   * @default true
   */
  banner?: BannerInput;
} & BaseOptions<
  typeof DEFAULT_GRI_PATTERN_POLICY.filesOnly,
  typeof DEFAULT_GRI_PATTERN_POLICY.forceUnique
>;

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Generates a TypeScript reference index file (.d.ts).***
 * ----------------------------------------------------------------
 *
 * This function resolves files from the given glob pattern(s) and generates
 * a single declaration index file containing:
 *
 * - `/// \<reference path="..." />` directives.
 * - optional `export * from "..."` statements.
 *
 * Supported input files include declaration and JavaScript module outputs:
 * - `.d.ts`.
 * - `.js`.
 * - `.cjs`.
 * - `.mjs`.
 *
 * The output is typically used to aggregate multiple declaration or build
 * artifacts into a single entry point.
 *
 * @param pattern - Glob pattern or list of patterns used to match output files, supports `.d.ts`, `.js`, `.cjs`, and `.mjs` extensions.
 *
 * @param options - Reference index generation options, see {@link GenerateReferenceOptions | **`GenerateReferenceOptions`**}.
 *
 * @example
 * Basic usage with declaration files only:
 * ```ts
 * await generateReferenceIndex("dist/**\/*.d.ts");
 * ```
 *
 * Result (`dist/.references/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../types/user.d.ts" />
 * /// \<reference path="../types/post.d.ts" />
 * ```
 *
 * @example
 * Restrict to declaration files even if pattern matches other files,
 * by default `onlyDeclarations` options is `true`:
 * ```ts
 * await generateReferenceIndex("dist/**\/*", { onlyDeclarations: true });
 * ```
 *
 * Result (`dist/.references/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../types/user.d.ts" />
 * /// \<reference path="../types/post.d.cts" />
 * ```
 *
 * @example
 * Include all matched files (source `.ts` and JS outputs) without filtering declaration files only:
 * ```ts
 * await generateReferenceIndex("dist/**\/*", { onlyDeclarations: false });
 * ```
 *
 * Result (`dist/.references/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../models/order.ts" />
 * /// \<reference path="../models/user.js" />
 * /// \<reference path="../models/another.cjs" />
 * ```
 *
 * (Here, both `.ts` source files and declaration files are
 * included if matched, because `onlyDeclarations` is `false`).
 *
 * @example
 * Include JavaScript build outputs with no declaration-only restriction:
 * ```ts
 * await generateReferenceIndex("dist/**\/*.js", { onlyDeclarations: false });
 * ```
 *
 * Result (`dist/.references/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../runtime/helpers.js" />
 * /// \<reference path="../runtime/constants.js" />
 * ```
 *
 * (JavaScript files are included because `onlyDeclarations` is `false`).
 *
 * @example
 * Restrict to declaration files when pattern includes source `.ts` and JS files:
 * ```ts
 * await generateReferenceIndex("dist/**\/*.ts");
 * ```
 *
 * Result (`dist/.references/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../models/user.d.ts" />
 * /// \<reference path="../models/order.d.ts" />
 * ```
 *
 * (Here `.ts` source files are ignored; only `.d.ts` declarations are included).
 *
 * ----------------------------------------------------------------
 *
 * ***--- Existing examples below remain unchanged ---***
 *
 * @example
 * Generate references from types JavaScript build outputs:
 * ```ts
 * await generateReferenceIndex("dist/**\/*.d.{js,cjs,mjs}");
 * ```
 *
 * Result (`dist/.references/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../runtime/helpers.d.js" />
 * /// \<reference path="../runtime/constants.d.mjs" />
 * ```
 *
 * @example
 * Mix declaration and JavaScript module outputs:
 * ```ts
 * await generateReferenceIndex([
 *   "dist/**\/*.d.ts",
 *   "dist/**\/*.d.{js,cjs,mjs}"
 * ]);
 * ```
 *
 * Result (`dist/.references/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../types/user.d.ts" />
 * /// \<reference path="../types/post.d.mts" />
 * /// \<reference path="../runtime/helpers.d.cjs" />
 * ```
 *
 * @example
 * Generate reference index and export all resolved modules:
 * ```ts
 * await generateReferenceIndex(
 *   "dist/**\/*",
 *   { withExportTypes: true }
 * );
 * ```
 *
 * Result (`dist/.references/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../types/user.d.ts" />
 * /// \<reference path="../types/user.d.cts" />
 * /// \<reference path="../types/post.d.ts" />
 * /// \<reference path="../types/post.d.cts" />
 *
 * // Exported Types:
 * export * from "../types/user";
 * export * from "../types/post";
 * ```
 *
 * @example
 * Use multiple input directories with a shared reference base:
 * ```ts
 * await generateReferenceIndex(
 *   [
 *     "dist/types/**\/*.d.ts",
 *     "dist/generated/**\/*.d.{js,cjs,mjs}"
 *   ],
 *   {
 *     inputDirReference: "dist",
 *     withExportTypes: true
 *   }
 * );
 * ```
 *
 * Result (`dist/index.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../types/user.d.ts" />
 * /// \<reference path="../data/config.d.cjs" />
 * /// \<reference path="../generated/schema.d.js" />
 *
 * // Exported Types:
 * export * from "../types/user";
 * export * from "../generated/schema";
 * ```
 *
 * @example
 * Customize output location and file name:
 * ```ts
 * await generateReferenceIndex(
 *   "build/**\/*",
 *   {
 *     outDir: "build/types",
 *     outFileName: "references-types.d.ts"
 *   }
 * );
 * ```
 *
 * Result (`build/types/references-types.d.ts`):
 * ```ts
 * // References Paths:
 * /// \<reference path="../models/user.d.ts" />
 * /// \<reference path="../models/order.d.cts" />
 * /// \<reference path="../models/account.d.mts" />
 * ```
 */
export const generateReferenceIndex = async (
  pattern: StringCollection,
  options: GenerateReferenceOptions = {}
): Promise<void> => {
  let _withExportTypes: boolean = DEFAULT_GRI_OPTIONS.withExportTypes;
  const loggerLevel = resolveLogVerbosity(
    options,
    DEFAULT_GRI_OPTIONS.logLevel
  );

  try {
    const {
      __commandTitle,
      patternOptions = DEFAULT_GRI_OPTIONS.patternOptions,
      outDir: _outDir = DEFAULT_GRI_OPTIONS.outDir,
      outFileName: _outFileName = DEFAULT_GRI_OPTIONS.outFileName,
      inputDirReference:
        _inputDirReference = DEFAULT_GRI_OPTIONS.inputDirReference,
      withExportTypes = DEFAULT_GRI_OPTIONS.withExportTypes,
      banner = DEFAULT_GRI_OPTIONS.banner,
      onlyDeclarations = DEFAULT_GRI_OPTIONS.onlyDeclarations
    } = options;

    _withExportTypes = withExportTypes;

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      console.log(
        joinLinesLoose(
          isNonEmptyString(__commandTitle)
            ? __commandTitle
            : commandGriIdentity.utility(),
          ""
        )
      );
    }

    const patterns = [...toStringSet(pattern)];
    const cleanPatternOptions = resolvePatternOptions(
      patternOptions,
      DEFAULT_GRI_PATTERN_POLICY
    );

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      BUILD_LOGGER.SECTION("Options", { icon: "⚙️ " });
      BUILD_LOGGER.OPTIONS(
        "pattern",
        patterns,
        BUILD_LOGGER.SOURCE_OF(patterns, undefined),
        true
      );
      BUILD_LOGGER.OPTIONS(
        "outDir",
        _outDir,
        sourceOf(_outDir, DEFAULT_GRI_OPTIONS.outDir)
      );
      BUILD_LOGGER.OPTIONS(
        "options.patternOptions",
        cleanPatternOptions,
        sourceOfPatternOptions(
          cleanPatternOptions,
          DEFAULT_GRI_OPTIONS.patternOptions
        )
      );
      BUILD_LOGGER.OPTIONS(
        "options.outFileName",
        _outFileName,
        sourceOf(_outFileName, DEFAULT_GRI_OPTIONS.outFileName)
      );
      BUILD_LOGGER.OPTIONS(
        "options.inputDirReference",
        _inputDirReference,
        sourceOf(_inputDirReference, DEFAULT_GRI_OPTIONS.inputDirReference)
      );
      BUILD_LOGGER.OPTIONS(
        "options.withExportTypes",
        withExportTypes,
        sourceOf(withExportTypes, DEFAULT_GRI_OPTIONS.withExportTypes)
      );
      BUILD_LOGGER.OPTIONS(
        "options.banner",
        banner,
        sourceOf(banner, DEFAULT_GRI_OPTIONS.banner)
      );
      BUILD_LOGGER.OPTIONS(
        "options.logLevel",
        loggerLevel,
        BUILD_LOGGER.SOURCE_OF(loggerLevel, DEFAULT_GRI_OPTIONS.logLevel)
      );

      BUILD_LOGGER.NEW_LINE();

      BUILD_LOGGER.ON_STARTING({
        actionName: "Generating References"
      });
    }

    let files = (await fastGlob(patterns, cleanPatternOptions)).sort();

    if (onlyDeclarations) {
      files = files.filter((file) => TS_DECLARATION_FILE_RE.test(file));
    }

    const { inputDirReference, outDir, outFileName } = validateOut({
      outDir: _outDir,
      outFileName: _outFileName,
      inputDirReference: _inputDirReference
    });

    const outDirAbs = path.resolve(outDir);
    const outFileAbs = path.join(outDirAbs, outFileName);

    const outFileNormalize = path
      .relative(process.cwd(), outFileAbs)
      .replace(/\\/g, "/");

    const lines = new Set<string>();
    let referenceCount = 0;

    const inputDirRefAbs = path.resolve(inputDirReference);

    const reference = files
      .map((f, i) => {
        const referencedAbs = path.resolve(f);

        if (
          !referencedAbs.startsWith(inputDirRefAbs + path.sep) ||
          referencedAbs === outFileAbs
        ) {
          return;
        }

        const referencePath = normalizeRelative(
          path.dirname(outFileAbs),
          referencedAbs
        );

        const logPath = path
          .relative(inputDirRefAbs, referencedAbs)
          .replace(/\\/g, "/");
        const displayPath = `${inputDirReference}/${logPath}`;

        if (canLog(loggerLevel, VERBOSE_LOG)) {
          BUILD_LOGGER.ON_PROCESS_REFERENCING({
            actionName: "Generated Reference",
            count: i + 1,
            referenceFrom: displayPath,
            referenceTo: outFileNormalize
          });
        }

        referenceCount++;

        return `/// <reference path="${referencePath}" />`;
      })
      .filter(Boolean);

    if (Array.isArray(reference) && reference.length > 0) {
      lines.add("//! References Paths:");
      lines.add(reference.join(EOL));
    }

    if (canLog(loggerLevel, VERBOSE_LOG)) {
      if (referenceCount > 0) {
        BUILD_LOGGER.ON_FINISH({
          actionName: "Generating Reference",
          count: files.length,
          typeCount: "reference"
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Generating References",
          reasonEndText: "referencing",
          reasonType: "references"
        });
      }
    }

    if (withExportTypes) {
      if (canLog(loggerLevel, VERBOSE_LOG)) {
        console.log(
          pcr.bold(
            pcr.magentaBright(
              `${EOL}=======================================================================================${EOL}`
            )
          )
        );

        BUILD_LOGGER.ON_STARTING({
          actionName: "Adding Exported Types"
        });
      }

      const exportLines = new Set<string>();
      let exportCount = 0;

      files.forEach((f) => {
        const referencedAbs = path.resolve(f);

        if (
          !referencedAbs.startsWith(inputDirRefAbs + path.sep) ||
          referencedAbs === outFileAbs
        ) {
          return;
        }

        const relativeToInputDirRef = path
          .relative(inputDirRefAbs, referencedAbs)
          .replace(/\\/g, "/");

        const exportModulePath = resolveExportModulePath(relativeToInputDirRef);

        const exportPath = normalizeRelative(
          path.dirname(outFileAbs),
          path.resolve(inputDirReference, exportModulePath)
        );

        const line = `export * from "${exportPath}";`;

        if (!exportLines.has(line)) {
          exportCount++;

          const logPath = path
            .relative(inputDirRefAbs, referencedAbs)
            .replace(/\\/g, "/");
          const displayPath = `${inputDirReference}/${logPath}`;

          if (canLog(loggerLevel, VERBOSE_LOG)) {
            BUILD_LOGGER.ON_PROCESS_REFERENCING({
              actionName: "Exported Type",
              count: exportCount,
              referenceFrom: displayPath,
              referenceTo: outFileNormalize
            });
          }

          exportLines.add(line);
        }
      });

      if (exportLines.size > 0) {
        if (referenceCount > 0) lines.add("");

        lines.add("//! Exported Types:");
        lines.add([...exportLines].join(EOL));

        if (canLog(loggerLevel, VERBOSE_LOG)) {
          BUILD_LOGGER.ON_FINISH({
            actionName: "Adding Exported Types",
            count: exportLines.size,
            typeCount: "type"
          });
        }
      } else {
        if (canLog(loggerLevel, VERBOSE_LOG)) {
          BUILD_LOGGER.ON_SKIPPING({
            actionName: "Adding Exported Types",
            reasonEndText: "exporting",
            reasonType: "types"
          });
        }
      }
    }

    await fsExtra.ensureDir(outDirAbs);

    if (lines.size === 0) {
      const action = withExportTypes
        ? "reference and type export"
        : "reference";

      lines.add(
        `// No files matched the given patterns and input dir references, skipping ${action} generation.`
      );
    }

    await fsExtra.promises.writeFile(
      outFileAbs,
      (await resolveBanner(banner)) + [...lines].join(EOL) + EOL
    );
  } catch (error) {
    if (loggerLevel !== "silent") {
      BUILD_LOGGER.ON_ERROR({
        actionName:
          "Generating References" +
          (_withExportTypes ? " and Adding Exported Types" : ""),
        error
      });
    }
  }
};
