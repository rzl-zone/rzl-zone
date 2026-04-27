import "@rzl-zone/node-only";

import type { PackageJson } from "type-fest";

import path from "node:path";

import { isNonEmptyString } from "@/_internal/utils/helper";

import { fsExtra } from "@/utils/server";
import { EOL } from "@/utils/client";

//? Types ----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Configuration options for {@link getPackageJson | **`get-package-json`**}.***
 * ----------------------------------------------------------------
 */
export type GetPackageJsonOptions = {
  /** ----------------------------------------------------------------
   * * ***Working directory of the target project.***
   * ----------------------------------------------------------------
   *
   * This determines where the lookup for `package.json`
   * will start.
   *
   * - If provided, resolution begins from this directory.
   * - If omitted, defaults to `process.cwd()`.
   *
   * - ***Typical use cases:***
   *       - CLI tools executed in a project directory.
   *       - Monorepo root resolution.
   *       - Custom build pipelines.
   *
   * @default process.cwd()
   *
   * @remarks
   * This should be the directory containing your project's
   * `package.json`, not the directory of this package.
   */
  cwd?: string;
};

//? Main -----------------------------------------------------------------
/** ----------------------------------------------------------------
 * * ***Resolve and read the nearest `package.json`.***
 * ----------------------------------------------------------------
 *
 * This utility locates and loads the closest `package.json`
 * by walking up the directory tree starting from a given
 * working directory.
 *
 * - *Key characteristics:*
 *     - Works in **Node ESM and CJS**.
 *     - Compatible with **tsdown, rolldown, tsup, esbuild, vite, tsx, ts-node, and others**.
 *     - Does **not** rely on JSON module imports.
 *     - Fully typed via {@link PackageJson | **PackageJson**}.
 *
 * - *This function is intended for:*
 *     - Build tools.
 *     - Bundler configuration.
 *     - CLI utilities.
 *     - Monorepo-aware infrastructure code.
 *
 * @param options Optional resolution configuration.
 *
 * @returns The parsed contents of the resolved `package.json`.
 *
 * @example
 * ```ts
 * const pkg = await getPackageJson();
 * console.log(pkg.name, pkg.version);
 * ```
 *
 * @example
 * ```ts
 * const pkg = await getPackageJson({
 *   cwd: process.cwd()
 * });
 * ```
 *
 * @throws If no `package.json` can be found.
 * @throws If the located `package.json` is invalid JSON.
 *
 * @remarks
 * - Resolution always starts from `cwd` or `process.cwd()`.
 * - Results are not cached by default.
 * - Designed for infrastructure-level usage, not hot paths.
 */
export const getPackageJson = async (
  options: GetPackageJsonOptions = {}
): Promise<PackageJson> => {
  const startDir = isNonEmptyString(options.cwd)
    ? path.resolve(options.cwd)
    : process.cwd();

  let current = startDir;

  while (true) {
    const pkgPath = path.join(current, "package.json");

    if (fsExtra.existsSync(pkgPath)) {
      try {
        return JSON.parse(fsExtra.readFileSync(pkgPath, "utf-8"));
      } catch (err) {
        throw new Error(
          `[@rzl-zone/build-tools] - (get-package-json): Invalid package.json at '${pkgPath}'` +
            EOL +
            `Reason: ${(err as Error)?.message || "unknown"}`,
          { cause: err }
        );
      }
    }

    const parent = path.dirname(current);
    if (parent === current) break;

    current = parent;
  }

  throw new Error(
    "[@rzl-zone/build-tools] - (get-package-json): Unable to locate package.json"
  );
};

/** @deprecated Use {@link getPackageJson | `getPackageJson`} instead. */
const _getPackageJson = async (
  options: GetPackageJsonOptions = {}
): Promise<PackageJson> => {
  return await getPackageJson(options);
  // if (options.cwd && options.from) {
  //   throw new Error("Provide either `cwd` or `from`, not both.");
  // }

  // const cwd = isNonEmptyString(options.cwd) ? options.cwd : process.cwd();

  // const baseUrl =
  //   options.from && isNil(options.cwd)
  //     ? options.from
  //     : pathToFileURL(path.resolve(cwd, "__entry__.js"));

  // const createRequire = await getCreateRequire();
  // const reqPkg = createRequire(baseUrl);

  // let current = cwd;

  // while (true) {
  //   const pkgPath = path.join(current, "package.json");

  //   if (fsExtra.existsSync(pkgPath)) return reqPkg(pkgPath);

  //   const parent = path.dirname(current);
  //   if (parent === current) break;
  //   current = parent;
  // }

  // throw new Error(
  //   "[@rzl-zone/build-tools] - (get-package-json): Unable to locate package.json !!!"
  // );
};
