import fs from "node:fs";
import path from "node:path";
import semver from "semver";

import { joinLines } from "@rzl-zone/build-tools/utils";
import { ensureParentDir } from "@rzl-zone/core/node/fs";
import { isString } from "@rzl-zone/utils-js/predicates";
import { normalizePathname } from "@rzl-zone/utils-js/urls";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

import { getPackageData } from "@/utils/packages/docs";
import { SOURCE_CONFIG } from "@/configs/source/package";

import type { CachedDoc } from "@/utils/fumadocs/types";

/** Check whether a folder name represents a valid docs version/channel.
 *
 * Supported patterns:
 * - `latest`
 * - Full semver versions (`1.0.0`, `2.1.0-beta.1`)
 * - Major aliases (`v2`, `2.x`)
 * - Release channels (`alpha`, `beta`, `rc`, `dev`, `canary`)
 *
 * @internal
 */
function isValidVersionFolder(name: string) {
  if (name === "latest") return true;

  // semver (1.0.0, 1.0.0-beta.1)
  if (semver.valid(name)) return true;

  // major (2.x, v2)
  if (/^v?\d+(?:\.x)?$/.test(name)) return true;

  // channel (beta, rc, dll)
  if (["alpha", "beta", "rc", "dev", "canary"].includes(name)) return true;

  return false;
}

/** Recursively collect folder names from the docs directory.
 *
 * Features:
 * - Skips hidden/private folders prefixed with `_`
 * - Resolves App Router group folders wrapped in `()`
 * - Converts `(latest)` group folders into `latest`
 * - Supports optional ascending/descending sorting
 * - Supports root-level package discovery mode
 *
 * @param options - Folder traversal options.
 * @param options.folderName - Target subfolder relative to `baseDirectoryPath`.
 * @param options.baseDirectoryPath - Base docs directory path.
 * @param options.sortDescending - Sort results in descending order.
 * @param options.isRoot - When `true`, returns only root package folders.
 *
 * @returns Array of discovered folder names.
 *
 * @internal
 */
function collectDocsFoldersSync({
  folderName = "",
  baseDirectoryPath = normalizePathname(SOURCE_CONFIG.DOCS.DEFINE_DOCS.DIR),
  sortDescending = false,
  isRoot = false
}: {
  /**
   * @default ""
   */
  folderName?: string | undefined | null;
  /**
   * @default SOURCE_CONFIG.DOCS.DEFINE_DOCS.DIR
   */
  baseDirectoryPath?: string;
  /**
   * @default false
   */
  sortDescending?: boolean;
  /**
   * @default false
   */
  isRoot?: boolean;
} = {}): string[] {
  if (!isString(folderName) || !isString(baseDirectoryPath.trim())) return [];

  const normalizedFolderName = folderName.trim();
  const normalizedBaseDirectoryPath = baseDirectoryPath.trim();

  const targetDirectoryPath = path.join(
    process.cwd(),
    normalizedBaseDirectoryPath,
    normalizedFolderName
  );
  if (!fs.existsSync(targetDirectoryPath)) return [];

  const entries = fs.readdirSync(targetDirectoryPath, { withFileTypes: true });
  const collectedFolders: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    if (entry.name.startsWith("_")) continue;

    if (isRoot) {
      collectedFolders.push(entry.name);
      continue;
    }

    if (/^\(latest\)$/.test(entry.name)) {
      collectedFolders.push("latest");
      continue;
    }

    if (/^\((.*)\)$/.test(entry.name)) {
      const nestedFolders = collectDocsFoldersSync({
        folderName: entry.name,
        baseDirectoryPath: path.join(
          normalizedBaseDirectoryPath,
          normalizedFolderName
        )
      });

      collectedFolders.push(...nestedFolders);
      continue;
    }

    if (!isValidVersionFolder(entry.name)) continue;

    collectedFolders.push(entry.name);
  }

  if (sortDescending) {
    collectedFolders.sort((a, b) =>
      b.localeCompare(a, undefined, { numeric: true })
    );
  } else {
    collectedFolders.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }

  return collectedFolders;
}

/** Generate cached package metadata from the docs source directory.
 *
 * Output includes:
 * - package key/slug
 * - display name
 * - description
 * - available versions
 * - GitHub URL
 * - latest stable version metadata
 *
 * The generated cache file is written to:
 * `data/cache/docs-package.ts`
 *
 * @internal
 */
function buildDocsCache() {
  /** Discovered root-level documentation package names.
   *
   * Used as the source for docs package cache generation.
   */
  const packageNames = collectDocsFoldersSync({ isRoot: true });

  /** Generated cached package metadata entries.
   *
   * Includes package metadata, available versions, and repository information.
   */
  const results = packageNames.map((packageName) => {
    const packageData = getPackageData(packageName);

    return {
      key: packageName,
      slug: packageName,
      name: packageData?.name || null,
      description: packageData?.description || null,
      versions: collectDocsFoldersSync({
        folderName: packageName,
        sortDescending: true
      }),
      githubUrl: packageData?.githubUrl,
      actualVersionLatest: packageData?.actualVersionLatest || {}
    } satisfies CachedDoc;
  });

  /**
   * Output file path for the generated docs package cache.
   */
  const outputPath = path.join(process.cwd(), "data/cache/docs-package.ts");
  ensureParentDir(outputPath);

  /** Generated TypeScript cache file content.
   *
   * Includes a generated file banner and serialized package metadata payload.
   */
  const tsContent = joinLines(
    "/** ----------------------------------------------------",
    "* * ***DO NOT EDIT MANUALLY !!!***",
    "* ----------------------------------------------------",
    "* ***Auto-generated by `generate-docs-cache.ts` or `pnpm run generate:docs-cache`.***",
    "*/",
    `export const cacheDocsPackage = ${safeStableStringify(results, { sortArray: true, pretty: true })};`
  );

  fs.writeFileSync(outputPath, tsContent);

  console.log("✅ Docs cache generated:");
  console.log("   ➤ ", outputPath);
}

buildDocsCache();
