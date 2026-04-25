// import "@rzl-zone/node-only";

import type { Nodes } from "hast";
import type { ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import { Link } from "fumadocs-core/framework";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";

import { cn } from "@rzl-zone/docs-ui/utils";

import defaultMdxComponents from "@/mdx";

import {
  type BaseTypeTableProps,
  type GenerateTypeTableOptions
} from "@/auto-type/lib/type-table";
import { type Generator } from "@/auto-type/lib/base";
import { parseTags } from "@/auto-type/lib/parse-tags";
import { renderMarkdownToHast, renderTypeToHast } from "@/auto-type/markdown";

import {
  type ParameterNode,
  type TypeNode,
  TypeTableCustom
} from "@/components/type-table";
import { ItemTypeTableClientList } from "@/components/type-table/item-client-list";

export type AutoTypeTableCustomProps = BaseTypeTableProps;

export async function AutoTypeTableCustom({
  generator,
  options = {},
  allowMultiple,
  renderType = renderTypeDefault,
  renderMarkdown = renderMarkdownDefault,
  ...props
}: AutoTypeTableCustomProps & {
  generator: Generator;

  renderMarkdown?: typeof renderMarkdownDefault;
  renderType?: typeof renderTypeDefault;
  options?: GenerateTypeTableOptions;
} & Pick<
    React.ComponentPropsWithoutRef<typeof ItemTypeTableClientList>,
    "allowMultiple"
  >) {
  const output = await generator.generateTypeTable(props, options);

  return output.map(async (item, idx) => {
    const entries = item.entries.map(async (entry) => {
      const tags = parseTags(entry.tags);
      const paramNodes: ParameterNode[] = [];

      for (const param of tags.params ?? []) {
        paramNodes.push({
          name: param.name,
          description: param.description
            ? await renderMarkdown(param.description)
            : undefined
        });
      }

      return [
        entry.name,
        {
          type: await renderType(entry.simplifiedType),
          typeDescription: await renderType(entry.type),
          typeDescriptionLink: tags?.typeDecsLink,
          description: await renderMarkdown(entry.description),
          default: tags.default ? await renderType(tags.default) : undefined,
          parameters: paramNodes,
          required: entry.required,
          deprecated: entry.deprecated,
          returns: tags.returns ? await renderMarkdown(tags.returns) : undefined
        } as TypeNode
      ];
    });

    return (
      <TypeTableCustom
        key={item.name + "-" + idx}
        type={Object.fromEntries(await Promise.all(entries))}
        allowMultiple={allowMultiple}
      />
    );
  });
}

function LinkCustomAutoTypeTable(
  params: React.ComponentPropsWithRef<typeof Link>
) {
  return <Link {...params} />;
}

function LiCustomAutoTypeTable(params: React.ComponentPropsWithRef<"li">) {
  return (
    <li
      {...params}
      className={cn(
        "not-has-[code]:leading-4! has-[code]:leading-5!",
        params.className
      )}
    />
  );
}

function toJsx(hast: Nodes) {
  return toJsxRuntime(hast, {
    Fragment: runtime.Fragment,
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
    components: {
      ...defaultMdxComponents,
      a: LinkCustomAutoTypeTable,
      li: LiCustomAutoTypeTable,
      img: undefined
    }
  });
}

export async function renderTypeDefault(type: string): Promise<ReactNode> {
  return toJsx(await renderTypeToHast(type));
}

export async function renderMarkdownDefault(md: string): Promise<ReactNode> {
  return toJsx(await renderMarkdownToHast(md));
}
