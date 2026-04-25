import { docs } from "collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

import { normalizePathname } from "@rzl-zone/utils-js/urls";

import type { MetaSchemaType } from "@/configs/source/schema";

import { SOURCE_CONFIG } from "@/configs/source/package";
import { env } from "@/utils/env";
import { gitConfig } from "./layout.shared";

const { LOADER } = SOURCE_CONFIG;

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: LOADER.BASE_URL,
  source: docs.toFumadocsSource(),
  plugins: [
    lucideIconsPlugin(),
    {
      transformPageTree: {
        file(node, file) {
          let name: React.ReactNode | undefined;
          let nameAlias: string | undefined;

          if (file) {
            const dataAsMetaSchema = this.storage.read(file)
              ?.data as MetaSchemaType;

            name =
              dataAsMetaSchema?.pageName ||
              dataAsMetaSchema?.title ||
              node.name;
            nameAlias = dataAsMetaSchema?.pageNameAlias;
          }

          // modify nodes
          node.name = name || node.name;
          node.nameAlias = nameAlias;

          return node;
        }
      }
    }
  ]
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, LOADER.OG.IMAGE_NAME];
  return {
    segments,
    url: normalizePathname(`${LOADER.OG.IMAGE_URL}/${segments.join("/")}`)
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = encodeSpecialChars(await page.data.getText("processed"));

  const description = page.data.description ?? page.data.pageData?.description;

  const lineSeparator =
    "----------------------------------------------------------------------------------------------------------------------------------------";

  const header = `# ${env.NEXT_PUBLIC_APP_NAME}${
    page.data.packageMeta.name ? ` - ${page.data.packageMeta.name}` : ""
  }: ${page.data.title || page.data.pageNameAlias || page.data.pageName}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${gitConfig.user}/${gitConfig.repo}/refs/heads/main/apps/docs/${
    page.absolutePath?.replace(/\\/g, "/") ?? ""
  }${description ? `\n\n${description}\n\n${lineSeparator}` : `\n\n${lineSeparator}`}`;

  return `${header}

${processed.trim()}`;
}

export function findPage(slug: string[]) {
  const page = source.getPage(slug);
  return page ?? null;
}

export function generateAllParams() {
  return source.generateParams();
}

function encodeSpecialChars(text: string) {
  return text
    .replaceAll("–", "&#x2013;") // en dash
    .replaceAll("—", "&#x2014;"); // em dash
}
