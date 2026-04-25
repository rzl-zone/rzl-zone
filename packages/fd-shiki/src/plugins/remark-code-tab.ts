import type { Processor, Transformer } from "unified";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { BlockContent, Code, DefinitionContent, Root } from "mdast";

import { visit } from "unist-util-visit";
import {
  isBoolean,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";

import { parseCodeBlockAttributes } from "./utils";
import { generateCodeBlockTabs } from "./codeblock-utils";

/** --------------------------------------------------------------------------
 * * ***Available tab rendering strategies.***
 * --------------------------------------------------------------------------
 *
 * - ***What this type represents:***
 *    - A union of supported tab renderer identifiers.
 *    - Derived automatically from the `Types` registry.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Each key corresponds to a converter implementation.
 * - Used to dynamically select tab rendering logic.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Adding a new tab type requires registering it in `Types`.
 */
type TabType = keyof typeof Types;

/** --------------------------------------------------------------------------
 * * ***Configuration options for the `remarkCodeTab` plugin.***
 * --------------------------------------------------------------------------
 *
 * - ***What this interface defines:***
 *    - Controls how code blocks are grouped into tabs.
 *    - Determines which tab rendering strategy to use.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - `Tabs` selects the tab renderer implementation.
 * - `parseMdx` enables MDX parsing inside tab labels.
 *
 * ---
 *
 * ℹ️ ***MDX parsing:***
 * - When enabled, tab names may contain inline MDX.
 * - Automatically disabled for simple `Tabs` mode when unsupported.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Default renderer is `"CodeBlockTabs"`.
 * - MDX parsing increases AST complexity.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Markdown / MDX documentation tooling
 *    - Shiki-powered code blocks
 *    - Tabbed code snippet rendering
 */
export interface RemarkCodeTabOptions {
  /** Tab renderer type. */
  Tabs?: TabType;

  /** Parse MDX in tab values
   *
   * @default false
   */
  parseMdx?: boolean;
}

/** --------------------------------------------------------------------------
 * * ***Extended metadata for MDAST `code` nodes used by tab logic.***
 * --------------------------------------------------------------------------
 *
 * - ***What this module augmentation does:***
 *    - Extends `mdast.CodeData` with tab-related metadata.
 *    - Enables downstream transformers to read tab configuration.
 *
 * ---
 *
 * ⚙️ ***Supported attributes:***
 * - `tab`           ➔ Tab label
 * - `id`            ➔ Code block identifier
 * - `groupId`       ➔ Tab persistence group
 * - `persist`       ➔ Persist active tab state
 * - `defaultValue`  ➔ Default active tab
 * - `updateAnchor`  ➔ Sync URL hash
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - All fields are optional.
 * - Values originate from code block meta attributes.
 */
declare module "mdast" {
  export interface CodeData {
    id?: string;
    tab?: string;
    value?: string;
    groupId?: string;
    persist?: boolean;
    defaultValue?: string;
    updateAnchor?: boolean;
  }
}

/** --------------------------------------------------------------------------
 * * ***Simple Tabs renderer implementation.***
 * --------------------------------------------------------------------------
 *
 * - ***What this converter does:***
 *    - Groups consecutive code blocks into tab panels.
 *    - Produces either:
 *      - A full `<Tabs>` component
 *      - Or a fragment of tab children
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Groups code blocks by `data.tab`.
 * - Generates tab triggers automatically.
 * - Supports MDX or plain text tab labels.
 *
 * ---
 *
 * ℹ️ ***Rendering modes:***
 * - `withMdx = false` ➔ Plain text tab labels
 * - `withMdx = true`  ➔ MDX-parsed tab labels
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - `Tabs` simple mode does not support MDX `items` attribute.
 * - Order of tabs follows source appearance.
 */
const Tabs = {
  convert(
    processor: Processor,
    nodes: Code[],
    withMdx = false,
    withParent = true
  ): MdxJsxFlowElement {
    const tabs = Array.from(processTabValue(nodes).entries());

    // console.debug({ tabs });

    if (!withMdx) {
      const children: MdxJsxFlowElement[] = tabs.map(([name, codes]) => {
        return {
          type: "mdxJsxFlowElement",
          name: "Tab",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "value",
              value: name
            }
          ],
          children: codes
        };
      });

      if (!withParent) return createFragment(children);

      return {
        type: "mdxJsxFlowElement",
        name: "Tabs",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "items",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: tabs.map(([name]) => name).join(", "),
              data: {
                estree: {
                  type: "Program",
                  sourceType: "module",
                  comments: [],
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "ArrayExpression",
                        elements: tabs.map(([name]) => ({
                          type: "Literal",
                          value: name
                        }))
                      }
                    }
                  ]
                }
              }
            }
          }
        ],
        children
      };
    }

    const children: MdxJsxFlowElement[] = [
      {
        type: "mdxJsxFlowElement",
        name: "TabsList",
        attributes: [],
        children: tabs.map(([name]) => ({
          type: "mdxJsxFlowElement",
          name: "TabsTrigger",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "value",
              value: name
            }
          ],
          children: [mdxToAst(processor, name) as unknown as BlockContent]
        }))
      },
      ...tabs.map(
        ([name, codes]) =>
          ({
            type: "mdxJsxFlowElement",
            name: "TabsContent",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "value",
                value: name
              }
            ],
            children: codes
          }) as MdxJsxFlowElement
      )
    ];

    if (!withParent) return createFragment(children);

    return {
      type: "mdxJsxFlowElement",
      name: "Tabs",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "defaultValue",
          value: tabs[0]?.[0]
        }
      ],
      children
    };
  }
};

/** --------------------------------------------------------------------------
 * * ***Advanced CodeBlockTabs renderer implementation.***
 * --------------------------------------------------------------------------
 *
 * - ***What this converter does:***
 *    - Generates a structured `CodeBlockTabs` MDX component.
 *    - Delegates AST construction to `generateCodeBlockTabs`.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Automatically sets `defaultValue` to the first tab.
 * - Enables persistence by default.
 * - Supports MDX or plain text tab triggers.
 *
 * ---
 *
 * ℹ️ ***Use cases:***
 * - Language switchers (TS / JS / PHP)
 * - Multi-variant code examples
 * - Persistent tab state across pages
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Assumes `generateCodeBlockTabs` handles attribute normalization.
 * - Does not validate duplicate tab names.
 */
const CodeBlockTabs = {
  convert(
    processor: Processor,
    nodes: Code[],
    withMdx = false,
    withParent = true
  ): MdxJsxFlowElement {
    const tabs = Array.from(processTabValue(nodes).entries());

    // console.debug({ tabsCDT: tabs });

    const node = generateCodeBlockTabs({
      defaultValue: tabs[0]?.[0],
      persist: true,
      triggers: tabs.map(([name]) => ({
        value: name,
        children: [
          withMdx
            ? (mdxToAst(processor, name) as unknown as BlockContent)
            : {
                type: "text",
                value: name
              }
        ]
      })),
      tabs: tabs.map(([name, codes]) => ({
        value: name,
        children: codes
      }))
    });

    if (!withParent) return createFragment(node.children);
    return node;
  }
};

/** --------------------------------------------------------------------------
 * * ***Tab renderer registry.***
 * --------------------------------------------------------------------------
 *
 * - ***What this object does:***
 *    - Maps tab type identifiers to converter implementations.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Used by `remarkCodeTab` to dynamically resolve renderer.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Keys must align with `TabType`.
 */
const Types = {
  CodeBlockTabs,
  Tabs
};

/** --------------------------------------------------------------------------
 * * ***Remark plugin for grouping code blocks into tabs.***
 * --------------------------------------------------------------------------
 *
 * - ***What this plugin does:***
 *    - Detects consecutive fenced code blocks with `tab` metadata.
 *    - Groups them into tabbed MDX components.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Traverses the MDAST using `unist-util-visit`.
 * - Parses code block meta attributes.
 * - Replaces matching sequences with tab components.
 *
 * ---
 *
 * ℹ️ ***Grouping logic:***
 * - Code blocks must be adjacent.
 * - Each block must declare a `tab` attribute.
 * - Mixed or interrupted blocks terminate grouping.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Mutates the AST in-place.
 * - Uses a `WeakSet` to prevent double-processing.
 * - Does not reorder nodes.
 *
 * ---
 *
 * - ***Designed for:***
 *    - MDX documentation systems
 *    - Shiki-powered code examples
 *    - Tab-based code presentation
 *
 * @param options - Plugin configuration.
 *
 * @returns
 * A unified-compatible transformer.
 */
export function remarkCodeTab(
  this: Processor,
  options: RemarkCodeTabOptions = {}
): Transformer<Root, Root> {
  const { parseMdx = false, Tabs = "CodeBlockTabs" } = options;

  return (tree) => {
    const ignored = new WeakSet();

    visit(tree, (node) => {
      if (!("children" in node) || ignored.has(node)) return "skip";
      let localTabsName: TabType = Tabs;
      let localParseMdx = parseMdx;
      let withParent = true;

      if (
        node.type === "mdxJsxFlowElement" &&
        node.name &&
        node.name in Types
      ) {
        withParent = false;
        localTabsName = node.name as TabType;

        // for `Tabs` in simple mode, it doesn't support MDX tab names
        if (localTabsName === "Tabs" && localParseMdx) {
          localParseMdx = node.attributes.every(
            (attribute) =>
              attribute.type !== "mdxJsxAttribute" || attribute.name !== "items"
          );
        }
      }

      let start = -1;
      let end = 0;
      const close = () => {
        if (start === -1 || start === end) return;
        const replacement = Types[localTabsName].convert(
          this,
          node.children.slice(start, end) as Code[],
          localParseMdx,
          withParent
        );

        ignored.add(replacement);
        node.children.splice(start, end - start, replacement);
        end = start;
        start = -1;
      };

      for (; end < node.children.length; end++) {
        const child = node.children[end];
        if (child?.type !== "code" || !child.meta) {
          close();
          continue;
        }

        const meta = parseCodeBlockAttributes(child.meta, [
          "id",
          "tab",
          "persist",
          "groupId",
          "updateAnchor",
          "defaultValue"
        ]);

        if (!meta.attributes.tab) {
          close();
          continue;
        }

        if (start === -1) start = end;
        child.meta = meta.rest;
        child.data ??= {};
        if (isString(meta.attributes.tab)) {
          child.data.tab = meta.attributes.tab;
        }
        if (isString(meta.attributes.id) || isUndefined(meta.attributes.id)) {
          child.data.id = meta.attributes.id;
        }
        if (
          isString(meta.attributes.groupId) ||
          isUndefined(meta.attributes.groupId)
        ) {
          child.data.groupId = meta.attributes.groupId;
        }
        if (
          isString(meta.attributes.defaultValue) ||
          isUndefined(meta.attributes.defaultValue)
        ) {
          child.data.defaultValue = meta.attributes.defaultValue;
        }
        if (
          isBoolean(meta.attributes.persist) ||
          isUndefined(meta.attributes.persist)
        ) {
          child.data.persist = meta.attributes.persist;
        }
        if (
          isBoolean(meta.attributes.updateAnchor) ||
          isUndefined(meta.attributes.updateAnchor)
        ) {
          child.data.updateAnchor = meta.attributes.updateAnchor;
        }
      }

      close();
    });
  };
}

/** --------------------------------------------------------------------------
 * * ***Group code blocks by tab value.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Groups `code` nodes by `data.tab`.
 *    - Generates fallback tab names when missing.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Uses insertion order.
 * - Default name format: `Tab N`.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Does not validate tab uniqueness.
 */
function processTabValue(nodes: Code[]) {
  const out = new Map<string, Code[]>();

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const name = node?.data?.tab ?? `Tab ${i + 1}`;
    const li = out.get(name) ?? [];
    if (node) li.push(node);
    out.set(name, li);
  }
  return out;
}

/** --------------------------------------------------------------------------
 * * ***Parse MDX tab label into AST nodes.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Converts a string into MDX AST children.
 *    - Flattens paragraphs into inline content.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Uses the provided unified processor.
 * - Preserves inline formatting.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Intended only for tab labels.
 * - Not suitable for full document parsing.
 */
function mdxToAst(processor: Processor, name: string) {
  const node = processor.parse(name) as Root;

  if (node.type === "root") {
    node.children = node.children.flatMap((child) => {
      if (child.type === "paragraph") return child.children;

      return child;
    });
  }

  return node;
}

/** --------------------------------------------------------------------------
 * * ***Create an MDX fragment wrapper.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Wraps multiple nodes into a fragment-style MDX element.
 *    - Avoids introducing a parent component.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Uses `name: null` to represent a fragment.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Consumers must handle fragment rendering.
 */
function createFragment(
  children: (BlockContent | DefinitionContent)[]
): MdxJsxFlowElement {
  return {
    type: "mdxJsxFlowElement",
    name: null,
    attributes: [],
    children
  };
}
