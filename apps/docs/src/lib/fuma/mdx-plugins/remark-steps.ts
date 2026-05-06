import type { Transformer } from "unified";
import type { MdxJsxFlowElement } from "mdast-util-mdx";
import type { BlockContent, Heading, Root, RootContent } from "mdast";

import { visit } from "unist-util-visit";
import { handleTag } from "./utils";

export interface RemarkStepsOptions {
  steps?: string;
  step?: string;
}

const StepRegex = /^(\d+)\.\s(.+)$/;
const StepTag = "[step]";
const StepStartTag = "[step-start]";
const StepEndTag = "[step-end]";

function isHeading(node: RootContent): node is Heading {
  return node.type === "heading";
}

function isTagNode(node: RootContent, tag: string): boolean {
  return (
    node.type === "paragraph" &&
    node.children.length === 1 &&
    node.children[0]?.type === "text" &&
    node.children[0].value.trim() === tag
  );
}

export function remarkSteps({
  steps = "fd-steps",
  step = "fd-step"
}: RemarkStepsOptions = {}): Transformer<Root, Root> {
  function isStepHeading(node: Heading): boolean {
    const head = node.children[0];

    if (head?.type === "text") {
      const match = StepRegex.exec(head.value);
      if (match?.[2]) {
        head.value = match[2];
        return true;
      }
    }

    const tail = node.children.at(-1);
    if (tail?.type === "text") {
      const res = handleTag(tail.value, StepTag);
      if (res !== false) {
        tail.value = res;
        return true;
      }
    }

    return false;
  }

  function buildSteps(nodes: RootContent[]): MdxJsxFlowElement {
    const depth = (nodes[0] as Heading).depth;

    const items: MdxJsxFlowElement[] = [];
    let current: MdxJsxFlowElement | null = null;

    for (const node of nodes) {
      if (isHeading(node) && node.depth === depth) {
        current = {
          type: "mdxJsxFlowElement",
          name: "div",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "className",
              value: step
            }
          ],
          children: [node]
        };
        items.push(current);
      } else {
        current?.children.push(node as BlockContent);
      }
    }

    return {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "className",
          value: steps
        }
      ],
      children: items
    };
  }

  return (tree) => {
    visit(tree, (parent) => {
      if (!("children" in parent) || parent.type === "heading") return;

      const result: RootContent[] = [];

      let buffer: RootContent[] = [];
      let collecting = false;
      let anchorDepth: number | null = null;
      let stepIndex = 1;

      const flush = () => {
        if (buffer.length > 0) {
          result.push(buildSteps(buffer));
          buffer = [];
          anchorDepth = null;
          stepIndex = 1;
        }
      };

      for (const node of parent.children) {
        // start boundary
        if (isTagNode(node, StepStartTag)) {
          collecting = true;
          buffer = [];
          anchorDepth = null;
          stepIndex = 1;
          continue;
        }

        // end boundary
        if (isTagNode(node, StepEndTag)) {
          flush();
          collecting = false;
          continue;
        }

        // outside step block → passthrough
        if (!collecting) {
          result.push(node);
          continue;
        }

        if (isHeading(node)) {
          const isStep = isStepHeading(node);

          if (!isStep) {
            buffer.push(node);
            continue;
          }

          if (anchorDepth === null) {
            anchorDepth = node.depth;
          }

          if (node.depth > anchorDepth) {
            buffer.push(node);
            continue;
          }

          if (node.depth < anchorDepth) {
            flush();
            anchorDepth = node.depth;
          }

          node.data = node.data ?? {};
          node.data.hProperties = node.data.hProperties ?? {};
          node.data.hProperties["data-fd-step"] = stepIndex++;

          buffer.push(node);
          continue;
        }

        buffer.push(node);
      }

      flush();
      parent.children = result;
    });
  };
}
