import "dotenv/config";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { prettifyError, treeifyError, ZodError } from "zod";

import { joinLines } from "@rzl-zone/build-tools/utils";
import { ensureParentDir } from "@rzl-zone/core/node/fs";
import { normalizePathname } from "@rzl-zone/utils-js/urls";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

import { generatePageData } from "@/utils/meta-data";
import { pageSchema } from "@/configs/source/schema";
import { SOURCE_CONFIG } from "@/configs/source/package";
import { getAppNameByEnvironment, getBaseUrlByEnvironment } from "@/utils/env";

import type { CachedJsonLD } from "@/utils/fumadocs/types";

/** Base application URL resolved from the current environment.
 *
 * Used for generating absolute canonical and Open Graph URLs.
 *
 * @internal
 */
const APP_BASE_URL = getBaseUrlByEnvironment();

/** Application display name resolved from the current environment.
 *
 * Used for generated `JSON-LD` metadata titles.
 *
 * @internal
 */
const APP_NAME = getAppNameByEnvironment();

/** Cached docs page metadata used for `JSON-LD` generation.
 *
 * @internal
 */
type DocsPageMetadata = {
  /**
   * Absolute canonical page URL.
   */
  url: string;
  /**
   * Open Graph image metadata.
   */
  og: {
    /**
     * Absolute Open Graph image URL.
     */
    imageUrl: string;
  };
  /**
   * Generated metadata payload from frontmatter.
   */
  metadata: ReturnType<typeof generatePageData>;
};

/** Recursively collect all documentation pages from the docs source directory.
 *
 * Features:
 * - Skips hidden files and folders prefixed with `.`
 * - Ignores App Router group folders wrapped in `()`
 * - Resolves `index.mdx` as the parent route
 * - Parses frontmatter metadata using `gray-matter`
 * - Validates frontmatter schema using Zod
 * - Generates canonical URLs and Open Graph image URLs
 *
 * @param directoryPath - Absolute directory path to scan.
 * @param parentPath - Current relative route path during recursion.
 *
 * @returns Array of normalized docs page metadata.
 *
 * @internal
 */
function collectDocsPages(
  directoryPath: string,
  parentPath = ""
): DocsPageMetadata[] {
  const collectedPages: DocsPageMetadata[] = [];
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      const isGroup = /^\(.*\)$/.test(entry.name);
      const nextParentPath = isGroup
        ? parentPath
        : parentPath
          ? `${parentPath}/${entry.name}`
          : entry.name;

      collectedPages.push(...collectDocsPages(entryPath, nextParentPath));
    } else if (entry.isFile() && path.extname(entry.name) === ".mdx") {
      const fileName = path.basename(entry.name, ".mdx");

      const routePathname =
        fileName === "index"
          ? parentPath
          : normalizePathname(`${parentPath}/${fileName}`);

      const canonicalPathname = normalizePathname(
        `/${SOURCE_CONFIG.LOADER.BASE_URL}/${routePathname}`
      );

      const openGraphPathname = normalizePathname(
        `/${SOURCE_CONFIG.LOADER.OG.IMAGE_URL}/${routePathname}`
      );

      const fileContent = fs.readFileSync(entryPath, "utf-8");
      const { data: rawData } = matter(fileContent);

      try {
        const parsedFrontmatter = pageSchema.safeParse(rawData);
        if (!parsedFrontmatter.success) {
          throw new Error(prettifyError(parsedFrontmatter.error));
        }

        const metadata = generatePageData(parsedFrontmatter.data);

        collectedPages.push({
          url: `${APP_BASE_URL}${canonicalPathname}`,
          og: {
            imageUrl: `${APP_BASE_URL}${normalizePathname(
              openGraphPathname + "/" + SOURCE_CONFIG.LOADER.OG.IMAGE_NAME
            )}`
          },
          metadata
        });
      } catch (error) {
        if (error instanceof ZodError) {
          console.error(treeifyError(error).errors);
        } else {
          console.error(error);
        }
      }
    }
  }

  return collectedPages;
}

/** Normalized filesystem path to the docs content source directory.
 *
 * Leading slashes are removed to ensure compatibility with `path.join`.
 *
 * @internal
 */
const docsContentPath = normalizePathname(
  SOURCE_CONFIG.DOCS.DEFINE_DOCS.DIR
).replace(/^\/+/, "");

/** Collected and normalized documentation pages.
 *
 * Used as the source for `JSON-LD` structured data generation.
 *
 * @internal
 */
const collectedDocsPages = collectDocsPages(
  path.join(process.cwd(), docsContentPath)
);

/** Generate structured `JSON-LD` metadata for documentation pages.
 *
 * Uses the `TechArticle` schema type from Schema.org.
 *
 * @internal
 */
const structuredData = collectedDocsPages.map((page) => {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${page.metadata.metaSeoData.title} | ${APP_NAME}`,
    description: page.metadata.metaSeoData.description,
    url: page.url,
    image: page.og.imageUrl,
    publisher: {
      "@type": "Organization",
      name: "Rzl Zone",
      url: APP_BASE_URL
    }
  } satisfies CachedJsonLD;
});

/** Sort structured data entries by canonical URL.
 *
 * Uses locale-aware numeric sorting for stable output generation.
 *
 * @internal
 */
structuredData.sort((a, b) => {
  return a.url.localeCompare(b.url, undefined, {
    numeric: true,
    sensitivity: "base"
  });
});

/** Generated TypeScript cache file content.
 *
 * Includes a generated file banner and serialized `JSON-LD` payload.
 *
 * @internal
 */
const tsContent = joinLines(
  "/** ----------------------------------------------------",
  "* * ***DO NOT EDIT MANUALLY !!!***",
  "* ----------------------------------------------------",
  "* ***Auto-generated by `generate-json_ld-docs.ts` or `pnpm run generate:json_ld-docs`.***",
  "*/",
  `export const cacheJsonLD = ${safeStableStringify(structuredData, { sortArray: true, pretty: true })};`
);

/** Output file path for the generated `JSON-LD` cache.
 *
 * @internal
 */
const outputPath = path.join(process.cwd(), "data/cache/jsonLD.ts");
ensureParentDir(outputPath);

fs.writeFileSync(outputPath, tsContent);

console.log("✅ Structured Data JSON-LD generated!");
console.log("   ➤ ", outputPath);
