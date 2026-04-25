import type {
  AnchorHTMLAttributes,
  FC,
  HTMLAttributes,
  ImgHTMLAttributes,
  TableHTMLAttributes
} from "react";

import { Image as FrameworkImage } from "fumadocs-core/framework";

import { cn } from "@rzl-zone/docs-ui/utils";

import { FumaNextLink } from "@/next-js/link";

import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre
} from "../components/codeblock";
import { Heading } from "../components/heading";
import { Callout } from "../components/callout";
import { Step, Steps } from "../components/steps";
import { Card, type CardProps, Cards } from "../components/card";
import { DynamicCodeBlock } from "../components/dynamic-codeblock";

function Image(
  props: ImgHTMLAttributes<HTMLImageElement> & {
    sizes?: string;
  }
) {
  return (
    <FrameworkImage
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
      {...props}
      src={props.src as unknown as string}
      className={cn("rounded-lg", props.className)}
    />
  );
}

function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative overflow-auto prose-no-margin my-6">
      <table {...props} />
    </div>
  );
}

const defaultMdxComponents = {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  DynamicCodeBlock,
  CodeBlock,
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  ),
  Card: (props: CardProps) => {
    return (
      <Card
        href={props.href}
        {...props}
      />
    );
  },
  Cards: (props: HTMLAttributes<HTMLDivElement>) => <Cards {...props} />,
  Step,
  Steps,
  a: FumaNextLink as FC<AnchorHTMLAttributes<HTMLAnchorElement>>,
  img: Image,
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading
      as="h1"
      {...props}
    />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading
      as="h2"
      {...props}
    />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading
      as="h3"
      {...props}
    />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading
      as="h4"
      {...props}
    />
  ),
  h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading
      as="h5"
      {...props}
    />
  ),
  h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading
      as="h6"
      {...props}
    />
  ),
  table: Table,
  Callout
};

/** Extend the default Link component to resolve relative file paths in `href`.
 *
 * @param page the current page
 * @param source the source object
 * @param OverrideLink The component to override from, default using **`FumaNextLink`**
 */
export const createRelativeLink: typeof import("./server").createRelativeLink =
  () => {
    throw new Error(
      "`createRelativeLink` is only supported in Node.js environment"
    );
  };

export const pageMdxDataToClient: typeof import("./server").pageMdxDataToClient =
  () => {
    throw new Error(
      "`pageMdxDataToClient` is only supported in Node.js environment"
    );
  };

export { defaultMdxComponents as default };
