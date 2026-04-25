import { type ComponentProps } from "react";
import { cn } from "@rzl-zone/docs-ui/utils";

import { useDocsPage } from "../client";

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
        "flex flex-col [grid-area:main]",
        "px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14",
        "*:max-w-562.5 *:mx-auto *:w-full",
        // full && "*:max-w-321.25",
        full && "*:max-w-none",
        props.className
      )}
    >
      {props.children}
    </article>
  );
}
