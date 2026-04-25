import type { ElementContent, Nodes } from "hast";

import { remark } from "remark";
import remarkRehype from "remark-rehype";
// import { highlightHast } from "fumadocs-core/highlight";
import {
  rehypeCode,
  type RehypeCodeOptions,
  remarkGfm
} from "fumadocs-core/mdx-plugins";
import { highlightHast } from "@workspace/fd-core/shiki-core/highlight/shiki";

const shikiOptions = {
  lazy: true,
  // inline: false,
  // transformers: [{ span: () => {} }],
  // mergeWhitespaces: false,

  themes: {
    light: "light-plus",
    dark: "github-dark"
  }
} satisfies RehypeCodeOptions;

const processor = remark()
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeCode, shikiOptions);

export async function renderTypeToHast(type: string): Promise<Nodes> {
  const nodes = await highlightHast(type, {
    ...shikiOptions,
    lang: "ts",
    structure: "inline"
  });

  return {
    type: "element",
    tagName: "span",
    properties: {
      class: "shiki"
    },
    children: [
      {
        type: "element",
        tagName: "code",
        properties: {},
        children: nodes.children as ElementContent[]
      }
    ]
  };
}

export async function renderMarkdownToHast(md: string): Promise<Nodes> {
  md = md.replace(/{@link (?<link>[^}]*)}/g, "$1"); // replace jsdoc links

  return processor.run(processor.parse(md));
}
