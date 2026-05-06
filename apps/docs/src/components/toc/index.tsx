"use client";

import { type ComponentPropsWithRef, useRef } from "react";

import * as Primitive from "fumadocs-core/toc";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { cn } from "@/lib/cn";
import { mergeRefs } from "@/lib/merge-refs";
import { ScrollArea } from "@rzl-zone/docs-ui/components/scroll-area";

const TOCContext = createRequiredContext<Primitive.TOCItemType[]>(
  "TOCContext",
  []
);

export const useTOCItems = () => TOCContext.useSuspense();

export type TOCProviderProps = Primitive.AnchorProviderProps;

export const { useActiveAnchor, useActiveAnchors, useItems } = Primitive;

export function TOCProvider({ toc, children, ...props }: TOCProviderProps) {
  return (
    <TOCContext.Provider value={toc}>
      <Primitive.AnchorProvider
        toc={toc}
        {...props}
      >
        {children}
      </Primitive.AnchorProvider>
    </TOCContext.Provider>
  );
}

export function TOCScrollArea({
  ref,
  className,
  tocPopover,
  ...props
}: ComponentPropsWithRef<typeof ScrollArea> & { tocPopover?: boolean }) {
  const viewRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollArea
      {...props}
      scrollBarOptions={{ orientation: "vertical" }}
      scrollHideDelay={props.scrollHideDelay || 25}
      ref={mergeRefs(viewRef, ref)}
      viewPortOptions={{
        className: cn(
          tocPopover
            ? "mask-[linear-gradient(to_bottom,transparent,white_15px,white_calc(100%-15px),transparent)]"
            : "mask-[linear-gradient(to_bottom,transparent,white_17.5px,white_calc(100%-17.5px),transparent)]",
          "size-full rounded-[inherit] relative min-h-0 text-sm pt-3 pb-3"
        )
      }}
      className={cn("overflow-hidden flex flex-col ps-px", className)}
    >
      <Primitive.ScrollProvider containerRef={viewRef}>
        {props.children}
      </Primitive.ScrollProvider>
    </ScrollArea>
  );
}
