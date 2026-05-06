"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { useDocsPage } from "..";

export function Container(props: ComponentProps<"article">) {
  const {
    props: { full }
  } = useDocsPage();

  return (
    <article
      id="nd-page"
      data-full={full}
      {...props}
      className={cn(
        "flex flex-col [grid-area:main] px-4 py-6 gap-2 md:px-6 md:pt-8 xl:px-8 xl:pt-14 *:max-w-225",
        full && "*:max-w-321.25",
        props.className
      )}
    >
      {props.children}
    </article>
  );
}
