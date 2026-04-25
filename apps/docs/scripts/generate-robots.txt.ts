import "dotenv/config";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { ensureParentDir } from "@rzl-zone/core/node/fs";

import { env } from "@/utils/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL: string = env.NEXT_PUBLIC_BASE_URL;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

const outputPath = path.join(__dirname, "../public/robots.txt");
ensureParentDir(outputPath);

fs.writeFileSync(outputPath, robotsTxt.trim() + "\n");

console.log("✅ Robots.txt generated!");
console.log("   ➤ ", outputPath);
