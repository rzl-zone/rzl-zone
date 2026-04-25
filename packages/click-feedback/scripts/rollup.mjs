import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const rollupPkgPath = require.resolve("rollup/package.json");
const rollupPkg = JSON.parse(fs.readFileSync(rollupPkgPath, "utf-8"));
const rollupVersion = rollupPkg.version;

/** -------------------------------------------------------
 * * ***Type: `LogLevel`.***
 * -------------------------------------------------------
 * Logging severity level used by virtual build stages
 * and their internal plugins.
 *
 * Levels are ordered from **least verbose** to
 * **most verbose**.
 *
 * -------------------------------------------------------
 *
 * @typedef {"silent" | "error" | "warn" | "info" | "debug"} LogLevel
 *
 * -------------------------------------------------------
 */

/** -------------------------------------------------------
 * * ***Type: `BuildOptions`.***
 * -------------------------------------------------------
 * Stage-level configuration used by `buildStage` and
 * forwarded to its internal plugins (such as
 * `writeBuildInfoPlugin`).
 *
 * This type defines **output location, cleanup behavior,
 * and logging verbosity** for a virtual Rollup build stage and the side-effect
 * plugins executed within it.
 *
 * -------------------------------------------------------
 *
 * - ***This type controls:***
 *    - Where build metadata is written.
 *    - Cleanup behavior.
 *    - Logging verbosity.
 *
 * -------------------------------------------------------
 *
 * @typedef {object} BuildOptions
 *
 * @property {string} [outputPath=".rollup-tmp/build-info.json"]
 * Path where the build metadata JSON file will be written.
 *
 * - This path also determines the **output directory**
 * used by the virtual build stage.
 * - Default the value is **`".rollup-tmp/build-info.json"`**.
 *
 * @property {boolean | ((filePath: string) => boolean)} [clean=false]
 * Controls cleanup behavior for files in the output directory.
 *
 * - `false` ***(default)***: No cleanup is performed.
 * - `true`: Removes **all files** in the directory
 *   except the generated JSON file.
 * - `function(filePath)`: Custom predicate to decide
 *   whether a file should be deleted.
 *
 * @property {boolean} [silent=false] When `true`, suppresses **all log output** emitted by the virtual build stage and its internal plugins, default: ***`false`***.
 *
 * @property {LogLevel} [logLevel="info"]
 * Controls log verbosity when `silent !== true`, available levels (from least to most verbose):
 *  - `"error"`.
 *  - `"warn"`.
 *  - `"info"` ***(default)***.
 *  - `"debug"`.
 *  - `"silent"`.
 *
 * -------------------------------------------------------
 */

//! ============================================================== !//

/** -------------------------------------------------------
 * * ***Rollup Plugin: `writeBuildInfoPlugin`.***
 * -------------------------------------------------------
 * Writes build metadata into a JSON file during the build
 * and optionally cleans files inside the output directory.
 *
 * This plugin is primarily designed to be used inside
 * **virtual Rollup build stages**, but it can also be
 * used as a standalone Rollup plugin.
 *
 * - **Typical use cases:**
 *    - Writing build metadata (CI, versioning, environment info).
 *    - Post-build cleanup.
 *    - Side-effect-only Rollup stages.
 *
 * -------------------------------------------------------
 *
 * @param {object} buildInfo Arbitrary build metadata that will be serialized
 *        and written into the JSON file.
 *
 * @param {BuildOptions} [options] Configuration object for a writeBuildInfoPlugin.
 *
 * -------------------------------------------------------
 *
 * @returns {import("rollup").Plugin} **A Rollup plugin instance.**
 *
 * -------------------------------------------------------
 *
 * @example
 * // Minimal usage
 * writeBuildInfoPlugin({
 *   version: "1.0.0",
 *   env: "production"
 * });
 *
 * @example
 * // Enable cleanup for all generated files
 * writeBuildInfoPlugin(buildInfo, {
 *   clean: true
 * });
 *
 * @example
 * // Custom cleanup logic
 * writeBuildInfoPlugin(buildInfo, {
 *   clean(filePath) {
 *     return filePath.endsWith(".tmp");
 *   }
 * });
 *
 * @example
 * // Fully silent execution
 * writeBuildInfoPlugin(buildInfo, {
 *   silent: true
 * });
 *
 * @example
 * // Verbose debug logging
 * writeBuildInfoPlugin(buildInfo, {
 *   logLevel: "debug"
 * });
 */
export function writeBuildInfoPlugin(buildInfo, options = {}) {
  const {
    outputPath = ".rollup-tmp/build-info.json",
    clean = false,
    silent = false,
    logLevel = "info"
  } = options;
  const outputDir = path.dirname(outputPath);

  /** @param {LogLevel} level */
  function canLog(level) {
    if (silent || logLevel === "silent") return false;

    const order = ["error", "warn", "info", "debug"];
    return order.indexOf(level) <= order.indexOf(logLevel);
  }

  return {
    name: "write-build-info-json",

    generateBundle() {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2), "utf-8");

      if (canLog("info")) {
        this.info(`Build info JSON written to ${outputPath}`);
      }
    },

    writeBundle(_outputOptions, bundle) {
      const dir = path.dirname(outputPath);

      // ALWAYS remove dummy virtual JS output
      for (const fileName of Object.keys(bundle)) {
        if (!fileName.endsWith(".ignore.js")) continue;

        const filePath = path.join(dir, fileName);
        try {
          fs.unlinkSync(filePath);
          if (canLog("debug")) {
            this.debug(`Removed dummy file: ${filePath}`);
          }
        } catch (err) {
          if (canLog("warn")) {
            this.warn(
              `Failed to remove dummy file: ${filePath} (${err.message})`
            );
          }
        }
      }

      // OPTIONAL cleanup
      if (!clean || !fs.existsSync(dir)) return;

      for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);

        if (filePath === outputPath) continue;

        const shouldDelete =
          clean === true
            ? true
            : typeof clean === "function"
              ? clean(filePath)
              : false;

        if (!shouldDelete) continue;

        try {
          fs.unlinkSync(filePath);
          if (canLog("debug")) {
            this.debug(`Cleaned file: ${filePath}`);
          }
        } catch (err) {
          if (canLog("warn") || canLog("info") || canLog("error")) {
            this.error(`Failed to clean file: ${filePath} (${err.message})`);
          }
        }
      }
    }
  };
}

/** -------------------------------------------------------
 * * ***Utility: `buildStage`.***
 * -------------------------------------------------------
 * Creates a **virtual Rollup build stage** that executes
 * Rollup plugins **without producing real JavaScript output**.
 *
 * This utility works by creating a virtual entry module
 * and intentionally emitting an empty chunk, allowing
 * **all Rollup plugin lifecycle hooks** to run normally.
 *
 * The generated dummy output is automatically removed.
 *
 * -------------------------------------------------------
 *
 * - **Key characteristics:**
 *    - Executes plugins in a real Rollup lifecycle.
 *    - Produces no meaningful JS output.
 *    - Does NOT introduce a new plugin system.
 *    - Plugins do NOT need to be aware of `buildStage`.
 *
 * - **Common use cases:**
 *    - Pre-build or post-build steps.
 *    - Writing metadata or build-info files.
 *    - Cleanup and housekeeping tasks.
 *    - CI / automation workflows.
 *
 * -------------------------------------------------------
 *
 * @param {...(
 *   import("rollup").Plugin |
 *   BuildOptions
 * )} pluginsAndOptions
 * One or more **valid Rollup plugins**, optionally followed
 * by a build stage configuration object.
 *
 * - Any valid Rollup plugin is accepted.
 * - Plugins are executed exactly as in a normal Rollup build.
 *
 * - If the **last argument** is a plain object **without**
 *   a `name` property, it is treated as {@link BuildOptions | **`BuildOptions`**}.
 * - **BuildOptions MUST be passed as the last argument.**
 * - Passing BuildOptions in any other position will
 *   result in a runtime error.
 *
 * -------------------------------------------------------
 *
 * @returns {import("rollup").RollupOptions}
 * A **virtual Rollup build stage configuration** suitable
 * for use inside `defineConfig([...])`.
 *
 * -------------------------------------------------------
 *
 * @example
 * // Minimal Rollup plugin (no special awareness required)
 * buildStage({
 *   name: "example-plugin",
 *   buildStart() {
 *     console.log("buildStage executed");
 *   }
 * });
 *
 * @example
 * // Plugins + options (options must be last)
 * buildStage(
 *   del({ targets: "./dist/tmp" }),
 *   { clean: true, logLevel: "silent" }
 * );
 *
 * @example
 * ```js
 * // ❌ Incorrect: options passed before plugins (will throw)
 * buildStage(
 *   { clean: true, logLevel: "silent" },
 *   del({ targets: "./dist/*" })
 * );
 * ```
 *
 * -------------------------------------------------------
 *
 * @example
 * ```js
 * // Full Rollup config with multiple build stages
 * defineConfig([
 *   buildStage(startPlugin()),
 *
 *   mainBuildConfig,
 *
 *   buildStage(endPlugin(), { logLevel: "debug" })
 * ]);
 * ```
 *
 * -------------------------------------------------------
 *
 * @note
 * - This utility intentionally generates an empty chunk.
 * - The associated Rollup warning is silenced internally
 *   and is safe to ignore.
 * - Argument order is strictly validated at runtime.
 */
export function buildStage(...pluginsAndOptions) {
  if (
    pluginsAndOptions.some(
      (arg, i) =>
        i !== pluginsAndOptions.length - 1 &&
        typeof arg === "object" &&
        !("name" in arg)
    )
  ) {
    throw new Error(
      "[buildStage]: BuildOptions must be passed as the last argument."
    );
  }

  const last = pluginsAndOptions.at(-1);

  /** @type {BuildOptions} */
  let options = {};
  if (
    last &&
    typeof last === "object" &&
    !Array.isArray(last) &&
    !("name" in last)
  ) {
    /** @type {BuildOptions} */
    options = pluginsAndOptions.pop();
  }

  const {
    outputPath = ".rollup-tmp/build-info.json",
    clean = false,
    silent = false,
    logLevel = "info"
  } = options;

  const plugins = pluginsAndOptions;

  const buildInfo = {
    buildTimestamp: new Date().toISOString(),
    buildTimestampMs: Date.now(),
    buildId: Math.random().toString(16).slice(2) + Date.now().toString(16),
    nodeVersion: process.version,
    platform: os.platform(),
    arch: os.arch(),
    rollupVersion,
    envNodeEnv: process.env.NODE_ENV || null,
    plugins: plugins.map((p) => p.name || "anonymous-plugin")
  };

  return {
    input: "\0build-stage",

    output: {
      dir: path.dirname(outputPath),
      entryFileNames: "[name].ignore.js",
      manualChunks: () => "empty"
    },

    plugins: [
      {
        name: "virtual-build-stage-entry",
        resolveId(id) {
          return id === "\0build-stage" ? id : null;
        },
        load(id) {
          return id === "\0build-stage" ? "" : null;
        }
      },

      writeBuildInfoPlugin(buildInfo, {
        outputPath,
        clean,
        silent,
        logLevel
      }),

      ...plugins
    ],

    onwarn(warning, warn) {
      if (warning.message?.includes("Generated an empty chunk")) return;
      warn(warning);
    }
  };
}
