import "dotenv/config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import z, { ZodError } from "zod";
import { fileURLToPath } from "url";

import { normalizePathname } from "@rzl-zone/utils-js/urls";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { ensureParentDir } from "@rzl-zone/core/node/fs";

import { env } from "@/utils/env";
import { pageSchema } from "@/configs/source/schema";
import { SOURCE_CONFIG } from "@/configs/source/package";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = env.NEXT_PUBLIC_BASE_URL;
const DOCS_DATA = path.join(
  __dirname,
  "..",
  normalizePathname(SOURCE_CONFIG.DOCS.DEFINE_DOCS.DIR)
);

const lastmodPath = path.join(__dirname, "../data/cache/lastmod.txt");
const lastmodDir = path.dirname(lastmodPath);

function getLastModDate() {
  const threeHours = 3 * 60 * 60 * 1000;
  try {
    if (fs.existsSync(lastmodPath)) {
      const content = fs.readFileSync(lastmodPath, "utf-8");
      const date = new Date(content);
      if (Date.now() - date.getTime() < threeHours) {
        return content;
      }
    }
  } catch {
    // ignore error
  }

  ensureParentDir(lastmodDir);

  const now = new Date().toISOString();
  fs.writeFileSync(lastmodPath, now);
  return now;
}

interface PageData {
  url: string;
  title: string;
  description?: string;
}

function getAllDocsPages(dir: string, parentPath = ""): PageData[] {
  const pages: PageData[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const isGroup = /^\(.*\)$/.test(entry.name);
      const newParentPath = isGroup
        ? parentPath
        : parentPath
          ? `${parentPath}/${entry.name}`
          : entry.name;
      pages.push(...getAllDocsPages(fullPath, newParentPath));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      const fileName = entry.name.replace(".mdx", "");
      const urlPath =
        fileName === "index"
          ? parentPath
            ? `/${SOURCE_CONFIG.LOADER.BASE_URL}/${parentPath}`
            : `/${SOURCE_CONFIG.LOADER.BASE_URL}`
          : parentPath
            ? `/${SOURCE_CONFIG.LOADER.BASE_URL}/${parentPath}/${fileName}`
            : `/${SOURCE_CONFIG.LOADER.BASE_URL}/${fileName}`;

      const content = fs.readFileSync(fullPath, "utf-8");
      const { data: rawData } = matter(content);
      try {
        const data = pageSchema.safeParse(rawData);
        if (!data.success) {
          throw new Error(z.prettifyError(data.error));
        }
        const title = data.data.title || fileName;
        const description = data.data.metaSeoData?.description;

        pages.push({
          url: `${BASE_URL}${normalizePathname(urlPath)}`,
          title,
          description
        });
      } catch (error) {
        if (error instanceof ZodError) {
          console.error(z.treeifyError(error).errors);
        } else {
          console.error(error);
        }
      }
    }
  }

  return pages;
}

const docsPages = getAllDocsPages(DOCS_DATA);

const getVersionNumber = (segment?: string) => {
  if (!segment) return null;
  const match = segment.match(/^v?(\d+)(?:[.-]x)?/);
  return match && match[1] ? parseInt(match[1], 10) : null;
};

const isVersionLike = (segment?: string) =>
  segment && /^v?\d+(\.\d+(\.\d+)?)?([.-]x)?$/.test(segment);

const pagesProcessed = docsPages.map((page) => {
  const pathName = new URL(page.url).pathname;
  const segments = pathName.split("/").filter((p) => isNonEmptyString(p));

  const isDocsRoot = segments.length === 1 && segments[0] === "docs";
  const isPkgRoot = segments.length === 2; // /docs/utils-js (latest)
  const hasVersionSegment =
    segments.length > 2 &&
    /^v?\d+(\.\d+(\.\d+)?)?([.-]x)?$/.test(segments[2] || "");

  const isVersionedRoot = segments.length === 3 && hasVersionSegment; // /docs/utils-js/2
  const isTopLevelChild = segments.length === 3 && !hasVersionSegment; // /docs/utils-js/changelog
  const isNestedPage = segments.length > 3;

  const isNestedPageVersioned = isNestedPage && hasVersionSegment;
  const isNestedPageLatest = isNestedPage && !hasVersionSegment;

  let priority = "0.5";

  if (isDocsRoot) {
    priority = "1.0";
  } else if (isPkgRoot) {
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
    pathName,
    segments,
    pkg: segments[1] ?? null,
    version: getVersionNumber(segments[2]),
    priority
  };
});

const sortedPages = pagesProcessed.sort((a, b) => {
  if (a.segments.length === 1 && b.segments.length > 1) return -1;
  if (b.segments.length === 1 && a.segments.length > 1) return 1;

  if (a.pkg !== b.pkg) return a.pkg?.localeCompare(b.pkg ?? "") ?? 0;

  const aVerRaw = a.segments[2];
  const bVerRaw = b.segments[2];
  const aIsVer = isVersionLike(aVerRaw);
  const bIsVer = isVersionLike(bVerRaw);

  if (!aIsVer && bIsVer) return -1;
  if (aIsVer && !bIsVer) return 1;

  if (aIsVer && bIsVer && a.version && b.version) {
    const verDiff = b.version - a.version;
    if (verDiff !== 0) return verDiff;
  }

  if (a.segments.length !== b.segments.length)
    return a.segments.length - b.segments.length;

  return a.url.localeCompare(b.url);
});

// const buildDate = new Date().toISOString();
const buildDate = getLastModDate();

const sitemap = sortedPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap}
</urlset>`;

const outputPath = path.join(__dirname, "../public/sitemap.xml");
ensureParentDir(outputPath);
fs.writeFileSync(outputPath, sitemapXml);

console.log("✅ Sitemap generated & sorted correctly!");
console.log("   ➤ ", outputPath);
