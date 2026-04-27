import type { HTMLAttributes } from "react";
import type { MDXComponents } from "mdx/types";

import Image from "next/image";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  IconIsNonOptional,
  IconIsOptional
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { SeparatorSection } from "@rzl-zone/docs-ui/components/separator";

import { generatorCreature } from "@/configs/auto-table";

import { PreFdMdx } from "./pre";
import { Heading } from "./heading";
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

import { AutoTypeTable, type AutoTypeTableProps } from "./auto-type-table/ui";

import * as AccordionComponents from "./accordion";
import * as CalloutComponents from "./callout";
import * as CodeBlockComponents from "./codeblock";
import * as FilesComponents from "./files";
import * as StepsComponents from "./steps";
import MadeBy from "../docs/MadeBy";
import { ApiVersionInfoComp } from "../docs/ApiVersionInfoComp";

import { FumaNextLink } from "@/components/link";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props: Partial<AutoTypeTableProps>) => (
      <AutoTypeTable
        {...props}
        generator={generatorCreature}
      />
    ),

    Image,
    FumaNextLink,
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
    /** @deprecated Use `CheckIcon` instead. */
    IconIsOptional,
    /** @deprecated Use `XIcon` instead. */
    IconIsNonOptional,
    SeparatorSection,
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
    // p: (props: HTMLAttributes<HTMLParagraphElement>) => {
    //   return (
    //     <p
    //       {...props}
    //       className={cn(
    //         "in-[.prose]:mt-1 in-[.prose]:mb-1",
    //         "in-[.not-prose]:mt-0 in-[.not-prose]:mb-0",
    //         props.className
    //       )}
    //     />
    //   );
    // },
    // li: (props: HTMLAttributes<HTMLLIElement>) => {
    //   return (
    //     <li
    //       {...props}
    //       className={cn(
    //         "in-[.prose]:mt-1 in-[.prose]:mb-1",
    //         "in-[.prose]:leading-[1.2rem]",
    //         "in-[.not-prose]:mt-0 in-[.not-prose]:mb-0",
    //         props.className
    //       )}
    //     />
    //   );
    // },
    ...components
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
