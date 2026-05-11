/* eslint-disable quotes */
import "dotenv/config";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { prettifyError, treeifyError, ZodError } from "zod";

import { joinLines } from "@rzl-zone/build-tools/utils";
import { ensureParentDir } from "@rzl-zone/core/node/fs";
import { normalizePathname } from "@rzl-zone/utils-js/urls";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { getBaseUrlByEnvironment } from "@/utils/env";
import { pageSchema } from "@/configs/source/schema";
import { SOURCE_CONFIG } from "@/configs/source/package";

/** Normalized documentation page metadata used for sitemap generation.
 *
 * @internal
 */
type DocsPageMetadata = {
  /**
   * Absolute canonical page URL.
   */
  url: string;

  /**
   * Human-readable page title.
   */
  title: string;

  /**
   * Optional SEO description extracted from frontmatter metadata.
   */
  description?: string;
};

/** Recursively collect all documentation pages from the docs source directory.
 *
 * Features:
 * - Skips hidden files and folders prefixed with `.`
 * - Ignores App Router group folders wrapped in `()`
 * - Resolves `index.mdx` as the parent route
 * - Parses frontmatter metadata using `gray-matter`
 * - Validates frontmatter schema using Zod
 * - Generates normalized canonical URLs
 *
 * @param directoryPath - Absolute directory path to scan.
 * @param parentPath - Current relative route path during recursive traversal.
 *
 * @returns Array of normalized documentation pages.
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

      const fileContent = fs.readFileSync(entryPath, "utf-8");
      const { data: rawData } = matter(fileContent);

      try {
        const parsedFrontmatter = pageSchema.safeParse(rawData);

        if (!parsedFrontmatter.success) {
          throw new Error(prettifyError(parsedFrontmatter.error));
        }

        const title = parsedFrontmatter.data.title || fileName;
        const description = parsedFrontmatter.data.metaSeoData?.description;

        collectedPages.push({
          url: `${getBaseUrlByEnvironment()}${canonicalPathname}`,
          title,
          description
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

/** Collected and normalized documentation pages used for sitemap generation.
 *
 * Source directory is resolved from the configured docs content path.
 *
 * @internal
 */
const collectedDocsPages = collectDocsPages(
  path.join(
    process.cwd(),
    normalizePathname(SOURCE_CONFIG.DOCS.DEFINE_DOCS.DIR)
  )
);

/** Extract the major numeric version from a version-like route segment.
 *
 * Supported formats:
 * - `v2`
 * - `2.x`
 * - `2.0.0`
 * - `2.1.0-beta.1`
 * - `v3-alpha`
 *
 * Only the leading major version number is extracted.
 *
 * Examples:
 * - `v2` → `2`
 * - `2.x` → `2`
 * - `2.1.0-beta.1` → `2`
 *
 * @param segment - Route segment to parse.
 *
 * @returns Parsed major version number or `null` if the segment does not
 * contain a valid major version prefix.
 *
 * @internal
 */
const extractMajorVersion = (segment?: string) => {
  if (!segment) return null;

  const match = segment.match(/^v?(\d+)/i);

  if (!match?.[1]) {
    return null;
  }

  return Number.parseInt(match[1], 10);
};

/** Determine whether a route segment represents a version identifier.
 *
 * Supported formats:
 * - `v2`
 * - `2.x`
 * - `2.1.0`
 * - `1.0.0-beta.1`
 *
 * @param segment - Route segment to validate.
 *
 * @returns `true` if the segment resembles a version identifier.
 *
 * @internal
 */
const isVersionSegment = (segment?: string) => {
  if (!segment) return false;

  // return /^v?\d+(\.\d+(\.\d+)?)?([.-]x)?$/.test(segment);
  return /^v?\d+(\.\d+(\.\d+)?)?([.-](x|[a-z0-9.-]+))?$/i.test(segment);
};

/** Documentation pages enriched with routing metadata and sitemap priority data.
 *
 * Includes:
 * - pathname segments
 * - package identifier
 * - parsed version
 * - calculated sitemap priority
 *
 * @internal
 */
const normalizedSitemapPages = collectedDocsPages.map((page) => {
  const pathname = new URL(page.url).pathname;
  const segments = pathname.split("/").filter((p) => isNonEmptyString(p));

  const isDocsRoot = segments.length === 1 && segments[0] === "docs";
  const isPackageRoot = segments.length === 2; // /docs/utils-js (latest)
  const hasVersionSegment =
    segments.length > 2 && isVersionSegment(segments[2]);

  const isVersionedRoot = segments.length === 3 && hasVersionSegment; // /docs/utils-js/2
  const isTopLevelChild = segments.length === 3 && !hasVersionSegment; // /docs/utils-js/changelog
  const isNestedPage = segments.length > 3;

  const isNestedPageVersioned = isNestedPage && hasVersionSegment;
  const isNestedPageLatest = isNestedPage && !hasVersionSegment;

  let priority: `${number}` = "0.5";

  if (isDocsRoot) {
    priority = "1.0";
  } else if (isPackageRoot) {
    priority = "0.95";
  } else if (isTopLevelChild) {
    priority = "0.85";
  } else if (isVersionedRoot) {
    priority = "0.8";
  } else if (isNestedPageLatest) {
    priority = "0.75"; // nested latest deeper pages
  } else if (isNestedPageVersioned) {
    priority = "0.7"; // nested versioned deeper pages
  }

  return {
    ...page,
    pathname,
    segments,
    packageName: segments[1] ?? null,
    version: extractMajorVersion(segments[2]),
    priority
  };
});

/** Sitemap pages sorted for stable XML generation.
 *
 * Sorting strategy:
 * - Docs root first
 * - Package roots before nested routes
 * - Latest routes before versioned routes
 * - Higher versions before lower versions
 * - Shallower routes before deeper routes
 *
 * @internal
 */
const sortedSitemapPages = normalizedSitemapPages.sort((a, b) => {
  if (a.segments.length === 1 && b.segments.length > 1) return -1;
  if (b.segments.length === 1 && a.segments.length > 1) return 1;

  if (a.packageName !== b.packageName) {
    return a.packageName?.localeCompare(b.packageName ?? "") ?? 0;
  }

  const aVersionSegment = a.segments[2];
  const bVersionSegment = b.segments[2];
  const aIsVer = isVersionSegment(aVersionSegment);
  const bIsVer = isVersionSegment(bVersionSegment);

  if (!aIsVer && bIsVer) return -1;
  if (aIsVer && !bIsVer) return 1;

  if (aIsVer && bIsVer && a.version && b.version) {
    const versionDifference = b.version - a.version;
    if (versionDifference !== 0) return versionDifference;
  }

  if (a.segments.length !== b.segments.length)
    return a.segments.length - b.segments.length;

  return a.url.localeCompare(b.url);
});

/** Get the sitemap last modified timestamp.
 *
 * Reuses a cached timestamp for up to 3 hours to avoid unnecessary sitemap
 * churn between builds.
 *
 * Cache file:
 * `data/cache/lastmod.txt`
 *
 * @returns ISO timestamp string.
 *
 * @internal
 */
function getSitemapLastmod() {
  const LASTMOD_CACHE_DURATION_MS = 3 * 60 * 60 * 1000;
  const lastmodPath = path.join(process.cwd(), "data/cache/lastmod.txt");

  try {
    if (fs.existsSync(lastmodPath)) {
      const fileContent = fs.readFileSync(lastmodPath, "utf-8");
      const date = new Date(fileContent);

      if (Date.now() - date.getTime() < LASTMOD_CACHE_DURATION_MS) {
        return fileContent;
      }
    }
  } catch {
    // ignore error
  }

  ensureParentDir(lastmodPath);

  const now = new Date().toISOString();
  fs.writeFileSync(lastmodPath, now);
  return now;
}

/** Cached sitemap last modified timestamp.
 *
 * Reused across all sitemap entries to ensure stable output during generation.
 *
 * @internal
 */
const sitemapLastmod = getSitemapLastmod();

/** Generated XML sitemap content.
 *
 * Includes all normalized documentation routes with:
 * - canonical URL
 * - last modified date
 * - change frequency
 * - calculated priority
 *
 * @internal
 */
const sitemapXml = joinLines(
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sortedSitemapPages.flatMap((sortedPage) => [
    "  <url>",
    `    <loc>${sortedPage.url}</loc>`,
    `    <lastmod>${sitemapLastmod}</lastmod>`,
    `    <changefreq>weekly</changefreq>`,
    `    <priority>${sortedPage.priority}</priority>`,
    "  </url>"
  ]),
  "</urlset>"
);

/** Output file path for the generated sitemap XML.
 *
 * @internal
 */
const outputPath = path.join(process.cwd(), "src/app/sitemap.xml");
ensureParentDir(outputPath);

fs.writeFileSync(outputPath, sitemapXml);

console.log("✅ Sitemap generated & sorted correctly!");
console.log("   ➤ ", outputPath);
