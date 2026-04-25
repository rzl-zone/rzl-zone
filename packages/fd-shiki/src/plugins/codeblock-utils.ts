import type { BlockContent, Text } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";

/** --------------------------------------------------------------------------
 * * ***Options for generating MDX-based code block tabs.***
 * --------------------------------------------------------------------------
 *
 * - ***What this interface defines:***
 *    - Configuration for rendering a tabbed code block UI in MDX.
 *    - Controls tab triggers, tab contents, persistence behavior, and attributes.
 *
 * ---
 *
 * ⚙️ ***Behavior overview:***
 * - Each tab is identified by a unique `value`.
 * - Triggers define the clickable tab headers.
 * - Tabs define the corresponding content panels.
 * - Supports optional persistence across page reloads or grouped tab syncing.
 *
 * ---
 *
 * 🧩 ***Tabs & triggers structure:***
 * - `triggers`:
 *    - Rendered inside `CodeBlockTabsList`.
 *    - Accepts inline or block MDX children.
 * - `tabs`:
 *    - Rendered as `CodeBlockTab`.
 *    - Holds the actual code block or content.
 *
 * ---
 *
 * ℹ️ ***Persistence modes:***
 * - `false`:
 *    - No persistence.
 * - `true`:
 *    - Persist tab state using implicit group.
 * - `{ id: string }`:
 *    - Persist tab state using explicit `groupId`.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - The number and order of `triggers` **must match** `tabs`.
 * - Values must be unique per tab group.
 * - This interface is framework-agnostic but designed for MDX + unified ecosystem.
 *
 * ---
 *
 * - ***Designed for:***
 *    - MDX documentation systems
 *    - Code snippet language switching
 *    - Fumadocs / custom MDX renderers
 */
export interface CodeBlockTabsOptions {
  /** Additional attributes forwarded to the root `CodeBlockTabs` component. */
  attributes?: MdxJsxAttribute[];

  /** Default active tab value. */
  defaultValue?: string;

  /** Group identifier for synchronizing tabs across the page. */
  groupId?: string;

  /** Persistence configuration for active tab state. */
  persist?:
    | {
        id: string;
      }
    | false
    | true;

  /** Tab trigger definitions (tab headers). */
  triggers: {
    /** Unique identifier for the trigger. */
    value: string;
    /** MDX children rendered inside the trigger. */
    children: (BlockContent | Text)[];
  }[];

  /** Tab content definitions. */
  tabs: {
    /** Unique identifier matching its trigger. */
    value: string;
    /** MDX block content rendered inside the tab panel. */
    children: BlockContent[];
  }[];
}

/** --------------------------------------------------------------------------
 * * ***Generate an MDX JSX tree for tabbed code blocks.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Programmatically constructs an `mdxJsxFlowElement` tree.
 *    - Renders a `CodeBlockTabs` component with triggers and tab panels.
 *    - Supports default tab selection and persistent tab state.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Builds root `<CodeBlockTabs>` element.
 * - Injects attributes based on:
 *    - `attributes`
 *    - `defaultValue`
 *    - `groupId`
 *    - `persist` configuration
 * - Renders:
 *    - `<CodeBlockTabsList>` for triggers
 *    - `<CodeBlockTabsTrigger>` for each tab header
 *    - `<CodeBlockTab>` for each content panel
 *
 * ---
 *
 * ℹ️ ***Attribute resolution order:***
 * - Custom `attributes` are applied first.
 * - `defaultValue` is added if provided.
 * - `persist` object overrides `groupId` if present.
 * - Boolean `persist` is stringified for MDX compatibility.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - This function **does not validate** trigger/tab alignment.
 * - Consumers must ensure `triggers` and `tabs` are consistent.
 * - Output is a raw MDX AST node, not a rendered React component.
 *
 * ---
 *
 * - ***Designed for:***
 *    - MDX AST generation
 *    - Unified / remark / rehype pipelines
 *    - Dynamic documentation tooling
 *
 * @param options - Configuration object for code block tabs generation.
 *
 * @returns
 * An `MdxJsxFlowElement` representing a complete tabbed code block structure.
 *
 * @example
 * ```ts
 * generateCodeBlockTabs({
 *   defaultValue: "ts",
 *   persist: { id: "lang-tabs" },
 *   triggers: [
 *     { value: "ts", children: [{ type: "text", value: "TypeScript" }] },
 *     { value: "js", children: [{ type: "text", value: "JavaScript" }] }
 *   ],
 *   tabs: [
 *     { value: "ts", children: [tsCodeBlock] },
 *     { value: "js", children: [jsCodeBlock] }
 *   ]
 * });
 * ```
 */
export function generateCodeBlockTabs({
  persist = false,
  groupId,
  defaultValue,
  triggers,
  tabs,
  ...options
}: CodeBlockTabsOptions): MdxJsxFlowElement {
  const attributes: MdxJsxAttribute[] = [];
  if (options.attributes) attributes.push(...options.attributes);

  if (defaultValue) {
    attributes.push({
      type: "mdxJsxAttribute",
      name: "defaultValue",
      value: defaultValue
    });
  }

  if (typeof persist === "object") {
    attributes.push(
      {
        type: "mdxJsxAttribute",
        name: "groupId",
        value: persist.id
      },
      {
        type: "mdxJsxAttribute",
        name: "persist",
        value: null
      }
    );
  }

  if (groupId) {
    attributes.push({
      type: "mdxJsxAttribute",
      name: "groupId",
      value: groupId
    });
  }

  if (typeof persist === "boolean") {
    attributes.push({
      type: "mdxJsxAttribute",
      name: "persist",
      value: String(persist)
    });
  }

  const children: MdxJsxFlowElement[] = [
    {
      type: "mdxJsxFlowElement",
      name: "CodeBlockTabsList",
      attributes: [],
      children: triggers.map(
        (trigger) =>
          ({
            type: "mdxJsxFlowElement",
            attributes: [
              { type: "mdxJsxAttribute", name: "value", value: trigger.value }
            ],
            name: "CodeBlockTabsTrigger",
            children: trigger.children
          }) as MdxJsxFlowElement
      )
    }
  ];

  for (const tab of tabs) {
    children.push({
      type: "mdxJsxFlowElement",
      name: "CodeBlockTab",
      attributes: [
        { type: "mdxJsxAttribute", name: "value", value: tab.value }
      ],
      children: tab.children
    });
  }

  return {
    type: "mdxJsxFlowElement",
    name: "CodeBlockTabs",
    attributes,
    children
  };
}

// export interface CodeBlockAttributes<Name extends string = string> {
//   attributes: Partial<Record<Name, string | null>>;
//   rest: string;
// }
