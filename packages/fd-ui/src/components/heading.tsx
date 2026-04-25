"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@rzl-zone/docs-ui/utils";
import { Link } from "@rzl-zone/docs-ui/components/icons/lucide";

import { useMainRzlFumadocs } from "@/providers/main-rzl-fumadocs";

type Types = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingProps<T extends Types> = Omit<ComponentPropsWithoutRef<T>, "as"> & {
  as?: T;
};

export function Heading<T extends Types = "h1">({
  as,
  className,
  ...props
}: HeadingProps<T>): React.ReactElement {
  const As = as ?? "h1";
  const { pageMdx } = useMainRzlFumadocs();

  if (!props.id)
    return (
      <As
        className={className}
        {...props}
        tabIndex={props.tabIndex || -1}
      />
    );

  return (
    <As
      className={cn(
        "flex flex-row items-center gap-2",
        "leading-[1.475rem] mt-4.5 mb-4.5",
        "xl:scroll-m-24",
        !!pageMdx.data?.currentDocsUnderConstruction ||
          !!pageMdx.data?.currentDocsIsOldVersion
          ? "scroll-m-37 xl:scroll-m-26"
          : pageMdx.data?.currentDocsUnderConstruction &&
              pageMdx.data?.currentDocsIsOldVersion
            ? "scroll-m-42 xl:scroll-m-31"
            : "scroll-m-28 xl:scroll-m-17",
        className
      )}
      {...props}
      tabIndex={props.tabIndex || -1}
    >
      <a
        data-card=""
        href={`#${props.id}`}
        tabIndex={props.tabIndex || -1}
        className="peer"
      >
        {props.children}
      </a>
      <Link
        aria-label="Link to section"
        className="size-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity peer-hover:opacity-100"
        tabIndex={props.tabIndex || -1}
      />
    </As>
  );
}
