import { type ShikiTransformer } from "shiki";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

/** --------------------------------------------------------------------------
 * * ***Legacy Shiki transformer for tabbed code blocks.***
 * --------------------------------------------------------------------------
 *
 * - ***What this transformer does:***
 *    - Converts a code block with `tab` metadata into an MDX `<Tab>` element.
 *    - Acts as a compatibility layer for older tab-based code block syntax.
 *
 * ---
 *
 * ⚙️ ***Behavior:***
 * - Reads tab-related metadata from `this.options.meta`:
 *    - `tab`
 *    - `groupId`
 *    - `persist`
 *    - `updateAnchor`
 * - Wraps the code block output in an MDX `<Tab>` component.
 *
 * ---
 *
 * ℹ️ ***Deprecation notice:***
 * - This transformer is **deprecated** for new usage.
 * - A runtime warning is emitted recommending the `remarkCodeTab` plugin.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Intended only for backward compatibility.
 * - This transformer mutates the root HAST structure.
 * - Does not support advanced grouping or MDX parsing.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Legacy documentation systems
 *    - Transitional migrations to `remarkCodeTab`
 *
 * @returns
 * A Shiki-compatible transformer that wraps code blocks in `<Tab>` components.
 */
function transformerTab(): ShikiTransformer {
  return {
    name: "rehype-code:tab",
    // @ts-expect-error -- types not compatible with MDX
    root(root) {
      const value = this.options.meta?.tab;
      const groupId = this.options.meta?.groupId;
      const persist = this.options.meta?.persist;
      const updateAnchor = this.options.meta?.updateAnchor;
      if (typeof value !== "string") return root;
      console.warn(
        // eslint-disable-next-line quotes
        '[Fumadocs] For `tab="value"` in codeblocks, please use `remarkCodeTab` plugin instead.'
      );

      return {
        type: "root",
        children: [
          {
            type: "mdxJsxFlowElement",
            name: "Tab",
            data: {
              _codeblock: true
            },
            attributes: [
              { type: "mdxJsxAttribute", name: "value", value },
              { type: "mdxJsxAttribute", name: "groupId", groupId },
              { type: "mdxJsxAttribute", name: "persist", persist },
              { type: "mdxJsxAttribute", name: "updateAnchor", updateAnchor }
            ],
            children: root.children
          } as MdxJsxFlowElement
        ]
      };
    }
  };
}

export { transformerTab };
