"use client";

import { type ComponentProps, useLayoutEffect, useRef } from "react";

import * as Primitive from "fumadocs-core/toc";
import { useI18n } from "@fumadocs/base-ui/contexts/i18n";
import { mergeRefs } from "@rzl-zone/core-react/utils/merge-refs";

import { cn, scrollIntoView } from "@rzl-zone/docs-ui/utils";

import { type ExtraTOCPopover, TocThumb, useTOCItems } from "./index";
import { useMainRzlFumadocs } from "@/providers/main-rzl-fumadocs";
import { useTocPopover } from "@/layout/notebook/page/client";
import { scrollToTop } from "@rzl-zone/utils-js/events";

export function TOCItems({
  ref,
  className,
  tocPopover = false,
  ...props
}: ComponentProps<"div"> & ExtraTOCPopover) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();
  const { text } = useI18n();

  if (items.length === 0)
    return (
      <div className="rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground">
        {text.tocNoHeadings}
      </div>
    );

  const ElementTOCItem = tocPopover ? TOCItemPopover : TOCItem;

  return (
    <>
      <TocThumb
        containerRef={containerRef}
        className="absolute top-0 translate-y-(--fd-top) h-(--fd-height) w-px bg-fd-primary transition-[translate,height]"
      />
      <div
        ref={mergeRefs(ref, containerRef)}
        className={cn(
          "flex flex-col border-s border-fd-foreground/10",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <ElementTOCItem
            key={item.url}
            item={item}
          />
        ))}
      </div>
    </>
  );
}

function TOCItem({ item }: { item: Primitive.TOCItemType }) {
  const { scrollBehavior } = useMainRzlFumadocs();
  return (
    <Primitive.TOCItem
      tabIndex={-1}
      href={item.url}
      data-prevent-rzl-progress-bar
      onClick={(e) => {
        e.preventDefault();
        const { pathname, search } = window.location;
        const newUrl = pathname + search + item.url;
        window.history.pushState(null, "", newUrl);
        const hash = item.url.startsWith("#")
          ? item.url.slice(1)
          : new URL(newUrl, window.location.origin).hash.slice(1);

        const target = hash ? document.getElementById(hash) : null;

        if (target) {
          target.scrollIntoView(scrollBehavior.intoView);
        }
      }}
      className={cn(
        "prose py-1.5 text-sm text-fd-muted-foreground transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-fd-primary",
        item.depth <= 2 && "ps-3",
        item.depth === 3 && "ps-6",
        item.depth >= 4 && "ps-8"
      )}
    >
      {item.title}
    </Primitive.TOCItem>
  );
}
function TOCItemPopover({
  ref,
  item
}: {
  item: Primitive.TOCItemType;
  ref?: React.RefObject<HTMLAnchorElement> | undefined;
}) {
  const { scrollBehavior } = useMainRzlFumadocs();
  const { ref: refTocNav } = useTocPopover();

  const anchors = Primitive.useActiveAnchors();
  const anchorRef = useRef<HTMLAnchorElement>(null);
  // eslint-disable-next-line react-hooks/refs
  const mergedRef = mergeRefs(anchorRef);
  const isPageTop = item.url === "#page-top";

  const isActive = anchors[0]?.includes(item.url.slice(1));

  useLayoutEffect(() => {
    const element = refTocNav?.current;

    if (element && anchorRef.current) {
      scrollIntoView(anchorRef.current, {
        ...scrollBehavior.intoViewFromIfNeed,
        boundary: element
      });
    }
  }, []);

  return (
    <Primitive.TOCItem
      ref={isActive ? mergedRef : ref}
      tabIndex={-1}
      href={item.url}
      data-prevent-rzl-progress-bar
      onClick={(e) => {
        e.preventDefault();
        const { pathname, search } = window.location;

        if (isPageTop) {
          window.history.pushState(null, "", pathname + search);
          return scrollToTop(scrollBehavior.toTop);
        } else {
          const newUrl = pathname + search + item.url;
          window.history.pushState(null, "", newUrl);
          const hash = item.url.startsWith("#")
            ? item.url.slice(1)
            : new URL(newUrl, window.location.origin).hash.slice(1);

          const target = hash ? document.getElementById(hash) : null;

          if (target) {
            target.scrollIntoView(scrollBehavior.intoView);
          }
        }
      }}
      className={cn(
        "prose py-1.5 text-sm text-fd-muted-foreground transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-fd-primary",
        item.depth <= 2 && "ps-3",
        item.depth === 3 && "ps-6",
        item.depth >= 4 && "ps-8"
      )}
    >
      {item.title}
    </Primitive.TOCItem>
  );
}
