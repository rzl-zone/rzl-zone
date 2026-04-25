import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";

import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { transformerTwoslash } from "fumadocs-twoslash";
import { createFileSystemTypesCache } from "fumadocs-twoslash/cache-fs";
import { remarkTypeScriptToJavaScript } from "fumadocs-docgen/remark-ts2js";

import {
  parseCodeBlockAttributes,
  transformerNotationMap,
  transformerTrimTrailingWhitespace,
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationMapOriginalShikiJs,
  transformerNotationWordHighlight,
  transformerRemoveNotationEscape
} from "@workspace/fd-shiki/plugins";

import { generatorCreature } from "@/configs/auto-table";

import { pageSchema, metaSchema } from "@/configs/source/schema";
import { remarkSteps } from "@/lib/fuma/mdx-plugins/remark-steps";
import { remarkAutoTypeTable } from "@/components/mdx/auto-type-table";

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true
    }
  },
  meta: {
    schema: metaSchema
  }
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    rehypeCodeOptions: {
      lazy: true,
      langs: ["php", "ts", "js", "html", "tsx", "mdx", "json", "ts-tags"],
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light-high-contrast",
        dark: "andromeeda"
      },
      parseMetaString(meta) {
        const parsed = parseCodeBlockAttributes(meta, [
          "title",
          "tab",
          "icon",
          "customIcon",
          "noIcon",
          "fileCodeIcon",
          "dtsIcon",
          "groupId",
          "value",
          "allowCopy",
          "disableCopy",
          "persist",
          "defaultValue",
          "updateAnchor",
          "defaultIndex",
          "tabIndex",
          "keepBackground"
        ]);

        const data: Record<string, unknown> = parsed.attributes;

        // const data: Record<string, unknown> = {};

        // const attrs = parsed.attributes;

        // if (attrs.title) data["mdx-title"] = attrs.title;
        // if (attrs.fileCodeIcon !== undefined)
        //   data["mdx-file-code-icon"] = attrs.fileCodeIcon;
        // if (typeof attrs.allowCopy === "boolean") {
        //   data["mdx-allow-copy"] = attrs.allowCopy;
        // }
        // if (attrs.icon) data["mdx-icon"] = attrs.icon;
        // if (attrs.customIcon) data["mdx-custom-icon"] = attrs.customIcon;
        // if (attrs.noIcon !== undefined) data["mdx-no-icon"] = attrs.noIcon;
        // if (attrs.dtsIcon !== undefined) data["mdx-dts-icon"] = attrs.dtsIcon;
        // if (attrs.keepBackground !== undefined)
        //   data["mdx-keep-background"] = attrs.keepBackground;

        function parseLineNumber(str: string, data: Record<string, unknown>) {
          return str.replace(/lineNumbers=(\d+)|lineNumbers/, (_, ...args) => {
            data["data-line-numbers"] = true;

            if (args[0] !== undefined) {
              data["data-line-numbers-start"] = Number(args[0]);
            }

            return "";
          });
        }

        parsed.rest = parseLineNumber(parsed.rest, data);

        return data;
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          typesCache: createFileSystemTypesCache()
        }),
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerRemoveNotationEscape(),
        transformerNotationDiff(),
        transformerNotationFocus(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        {
          name: "@shikijs/transformers:notation-status-level",
          ...transformerNotationMapOriginalShikiJs(
            {
              matchAlgorithm: "v3",
              classMap: {
                error: ["highlighted", "error"],
                warning: ["highlighted", "warning"],
                success: ["highlighted", "success"],
                info: ["highlighted", "info"],
                debug: ["highlighted", "debug"]
              },
              classActivePre: "has-highlighted"
            },
            "@shikijs/transformers:notation-status-level"
          )
        },
        {
          name: "@shikijs/transformers:notation-diff-extra",
          ...transformerNotationMapOriginalShikiJs(
            {
              matchAlgorithm: "v3",
              classMap: {
                "!!": ["diff", "exclamation"],
                "??": ["diff", "question"]
              },
              classActivePre: "has-diff"
            },
            "@shikijs/transformers:notation-diff-extra"
          )
        },
        {
          name: "@shikijs/transformers:notation-special-word",
          ...transformerNotationMap(
            {
              matchAlgorithm: "v3",
              classMap: {
                italic: ["special-word", "italic"],
                underline: ["special-word", "underline"],
                bold: ["special-word", "bold"],
                semiBold: ["special-word", "semi-bold"],
                extraBold: ["special-word", "extra-bold"],
                light: ["special-word", "light"],
                semiLight: ["special-word", "semi-light"],
                extraLight: ["special-word", "extra-light"]
              },
              classActivePre: "has-special-word"
            },
            "@shikijs/transformers:notation-special-word"
          )
        },
        transformerTrimTrailingWhitespace()
      ]
    },
    rehypePlugins: (v) => [rehypeKatex, ...v],
    remarkPlugins: [
      remarkSteps,
      remarkMath,
      remarkAutoTypeTable,
      remarkTypeScriptToJavaScript,
      [remarkAutoTypeTable, { createGenerator: generatorCreature }]
    ],
    remarkCodeTabOptions: {
      parseMdx: true
    },
    remarkNpmOptions: {
      persist: { id: "tabsSelect::package-manager" }
    }
  }
});
