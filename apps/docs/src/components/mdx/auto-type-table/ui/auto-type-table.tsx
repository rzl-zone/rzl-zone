import type { Nodes } from "hast";

import { type ComponentProps, type ReactNode } from "react";

import * as JsxRuntime from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";

import {
  type ParameterNode,
  type TypeNode,
  TypeTable
} from "@/components/mdx/type-table";
import { getMDXComponents } from "@/components/mdx/mdx";

import {
  type BaseTypeTableProps,
  type GenerateTypeTableOptions
} from "../lib/type-table";
import { type Generator } from "../lib/base";
import { parseTags } from "../lib/parse-tags";
import { markdownRenderer, type ShikiOptions } from "../markdown";

export interface AutoTypeTableProps
  extends BaseTypeTableProps, ComponentProps<"div"> {
  generator: Generator;

  /** Shiki configuration when using default `renderMarkdown` & `renderType` */
  shiki?: ShikiOptions;
  options?: GenerateTypeTableOptions;

  renderMarkdown?: (md: string) => Promise<ReactNode>;
  renderType?: (type: string) => Promise<ReactNode>;
}

export async function AutoTypeTable({
  generator,
  options,
  renderType,
  renderMarkdown,
  shiki,
  name,
  path,
  type,
  ...props
}: AutoTypeTableProps) {
  if (!renderType || !renderMarkdown) {
    const renderer = markdownRenderer(shiki);
    renderType ??= async (v) => toJsx(await renderer.renderTypeToHast(v));
    renderMarkdown ??= async (v) =>
      toJsx(await renderer.renderMarkdownToHast(v));
  }

  const output = await generator.generateTypeTable(
    { name, path, type },
    options
  );

  return output.map(async (item) => {
    const entries = item.entries.map(
      async (entry): Promise<[string, TypeNode]> => {
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
            typeDescriptionLink: tags.typeDecsLink ?? entry.typeHref,
            description: await renderMarkdown(entry.description),
            default: tags.default ? await renderType(tags.default) : undefined,
            parameters: paramNodes,
            required: entry.required,
            deprecated: entry.deprecated,
            returns: tags.returns
              ? await renderMarkdown(tags.returns)
              : undefined
          } satisfies TypeNode
        ];
      }
    );

    return (
      <TypeTable
        key={item.name}
        id={`type-table-${item.id}`}
        type={Object.fromEntries(await Promise.all(entries))}
        {...props}
      />
    );
  });
}

const customDefaultMdxComponents = getMDXComponents();
function toJsx(hast: Nodes) {
  return toJsxRuntime(hast, {
    ...JsxRuntime,
    components: { ...customDefaultMdxComponents, img: undefined }
  });
}
