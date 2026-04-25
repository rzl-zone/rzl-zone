"use client";

import * as Primitive from "fumadocs-core/toc";
import {
  type ComponentProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { type ExtraTOCPopover, TocThumb, useTOCItems } from "./index";
import { useI18n } from "@fumadocs/base-ui/contexts/i18n";

import { scrollToTop } from "@rzl-zone/utils-js/events";
import { mergeRefs } from "@rzl-zone/core-react/utils/merge-refs";

import { cn, scrollIntoView } from "@rzl-zone/docs-ui/utils";

import { useTocPopover } from "@/layout/notebook/page/client";
import { useMainRzlFumadocs } from "@/providers/main-rzl-fumadocs";

export function TOCItems({
  ref,
  className,
  tocPopover = false,
  ...props
}: ComponentProps<"div"> & ExtraTOCPopover) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();
  const { text } = useI18n();

  const ElementTOCItem = tocPopover ? TOCItemPopover : TOCItem;

  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  }>();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    function onResize(): void {
      if (container.clientHeight === 0) return;
      let w = 0,
        h = 0;
      const d: string[] = [];
      for (let i = 0; i < items.length; i++) {
        const element: HTMLElement | null = container.querySelector(
          `a[href="#${items[i]!.url.slice(1)}"]`
        );
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i]?.depth || 1) + 1,
          top = element.offsetTop + parseFloat(styles.paddingTop),
          bottom =
            element.offsetTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom);

        w = Math.max(offset, w);
        h = Math.max(h, bottom);

        d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);
      }

      setSvg({
        path: d.join(" "),
        width: w + 1,
        height: h
      });
    }

    const observer = new ResizeObserver(onResize);
    onResize();

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0)
    return (
      <div className="rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground">
        {text.tocNoHeadings}
      </div>
    );

  return (
    <>
      {svg && (
        <div
          className="absolute start-0 top-0 rtl:-scale-x-100"
          style={{
            width: svg.width,
            height: svg.height,
            maskImage: `url("data:image/svg+xml,${
              // Inline SVG
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`
              )
            }")`
          }}
        >
          <TocThumb
            containerRef={containerRef}
            className="translate-y-(--fd-top) h-(--fd-height) bg-fd-primary transition-[translate,height]"
          />
        </div>
      )}
      <div
        ref={mergeRefs(containerRef, ref)}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {items.map((item, i) => (
          <ElementTOCItem
            key={item.url}
            item={item}
            upper={items[i - 1]?.depth}
            lower={items[i + 1]?.depth}
          />
        ))}
      </div>
    </>
  );
}

function TOCItem({
  item,
  upper = item.depth,
  lower = item.depth
}: {
  item: Primitive.TOCItemType;
  upper?: number;
  lower?: number;
}) {
  const offset = getLineOffset(item.depth),
    upperOffset = getLineOffset(upper),
    lowerOffset = getLineOffset(lower);

  const { scrollBehavior } = useMainRzlFumadocs();
  return (
    <Primitive.TOCItem
      tabIndex={-1}
      href={item.url}
      data-prevent-rzl-progress-bar
      style={{
        paddingInlineStart: getItemOffset(item.depth)
      }}
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
        item.url === "#page-top" && "hidden",
        "prose relative py-0.75 text-sm text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-fd-primary"
      )}
    >
      {offset !== upperOffset ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="absolute -top-1.5 start-0 size-4 rtl:-scale-x-100"
        >
          <line
            x1={upperOffset + 0.65}
            y1="0"
            x2={offset + 1}
            y2="12"
            className="stroke-fd-foreground/10"
            strokeWidth="1.8"
          />
        </svg>
      ) : null}
      <div
        className={cn(
          item.depth === 3 ? "w-0.5" : "w-[0.106rem]",
          "absolute inset-y-0  bg-fd-foreground/10",
          offset !== upperOffset && "top-1.5",
          offset !== lowerOffset && "bottom-1.5"
        )}
        style={{
          insetInlineStart: offset
        }}
      />
      {item.title}
    </Primitive.TOCItem>
  );
}

function TOCItemPopover({
  ref,
  item,
  upper = item.depth,
  lower = item.depth
}: {
  item: Primitive.TOCItemType;
  upper?: number;
  lower?: number;
  ref?: React.RefObject<HTMLAnchorElement> | undefined;
}) {
  const offset = getLineOffset(item.depth),
    upperOffset = getLineOffset(upper),
    lowerOffset = getLineOffset(lower);

  const { scrollBehavior } = useMainRzlFumadocs();
  const { ref: refTocNav } = useTocPopover();

  const anchors = Primitive.useActiveAnchors();
  const anchorRef = useRef<HTMLAnchorElement>(null);
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
      style={{
        paddingInlineStart: getItemOffset(item.depth)
      }}
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
        "prose relative py-1 text-sm text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors wrap-anywhere first:pt-1 last:pb-1 data-[active=true]:text-fd-primary"
      )}
    >
      {offset !== upperOffset ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="absolute -top-1.5 start-0 size-4 rtl:-scale-x-100"
        >
          <line
            x1={upperOffset + 0.65}
            y1="0"
            x2={offset + 1}
            y2="12"
            className="stroke-fd-foreground/10"
            strokeWidth="1.8"
          />
        </svg>
      ) : null}
      <div
        className={cn(
          item.depth === 3 ? "w-0.5" : "w-[0.106rem]",
          "absolute inset-y-0  bg-fd-foreground/10",
          offset !== upperOffset && "top-1.5",
          offset !== lowerOffset && "bottom-1.5"
        )}
        style={{
          insetInlineStart: offset
        }}
      />
      {item.title}
    </Primitive.TOCItem>
  );
}

function getItemOffset(depth: number): number {
  if (depth <= 2) return 10;
  if (depth === 3) return 16;
  return 24;
}

function getLineOffset(depth: number): number {
  if (depth <= 2) return 1;
  if (depth === 3) return 8;
  return 15;
}
