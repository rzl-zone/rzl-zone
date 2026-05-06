import type { HTMLAttributes } from "react";
import type { MDXComponents } from "mdx/types";

import defaultMdxComponents from "fumadocs-ui/mdx";

import {
  IconIsNonOptional,
  IconIsOptional
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { SeparatorSection } from "@rzl-zone/docs-ui/components/separator";

import { cn } from "@/lib/cn";
import { generatorCreature } from "@/configs/auto-table";
import { CustomNextLink, PackageLink } from "@/components/link";

import { PreFdMdx } from "./pre";
import { Heading } from "./heading";
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

import * as AccordionComponents from "./accordion";
import * as CalloutComponents from "./callout";
import * as CodeBlockComponents from "./codeblock";
import * as FilesComponents from "./files";
import * as StepsComponents from "./steps";
import { AutoTypeTable, type AutoTypeTableProps } from "./auto-type-table/ui";

import MadeBy from "../docs/MadeBy";
import { ApiVersionInfoComp } from "../docs/ApiVersionInfoComp";

const headingComponents = Object.fromEntries(
  (["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((tag) => [
    tag,
    (props: HTMLAttributes<HTMLHeadingElement>) => (
      <Heading
        as={tag}
        {...props}
      />
    )
  ])
);

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props: Partial<AutoTypeTableProps>) => (
      <AutoTypeTable
        {...props}
        generator={generatorCreature}
      />
    ),

    PackageLink,
    CustomNextLink,
    MadeBy,
    ApiVersionInfoComp,
    pre: PreFdMdx,

    ...AccordionComponents,
    ...CalloutComponents,
    ...CodeBlockComponents,
    ...FilesComponents,
    ...StepsComponents,
    Tab,
    Tabs: ({ ref, ...props }: React.ComponentProps<typeof Tabs>) => {
      return (
        <Tabs
          ref={ref}
          {...props}
          className={cn(props?.className)}
        />
      );
    },
    TabsContent,
    TabsList,
    TabsTrigger,

    XIcon: IconIsNonOptional,
    CheckIcon: IconIsOptional,
    SeparatorSection,
    ...headingComponents,
    ...components
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
