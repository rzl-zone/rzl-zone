"use client";

import {
  type ComponentProps,
  Fragment,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState
} from "react";

import type * as PageTree from "fumadocs-core/page-tree";

import {
  type BreadcrumbOptions,
  getBreadcrumbItemsFromPath
} from "fumadocs-core/breadcrumb";
import { useActiveAnchor } from "fumadocs-core/toc";
import { usePathname } from "fumadocs-core/framework";

import { scrollToTop } from "@rzl-zone/utils-js/events";
import { mergeProps } from "@rzl-zone/core-react/utils/merge-props";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { I18nLabel, useI18n } from "@fumadocs/base-ui/contexts/i18n";
import { useFooterItems } from "@fumadocs/base-ui/utils/use-footer-items";
import { useTreeContext, useTreePath } from "@fumadocs/base-ui/contexts/tree";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleArrowUp,
  Text
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { Button } from "@rzl-zone/docs-ui/components/button";

import { isActive } from "@workspace/fd-core/utils";

import { type TableOfContentOptions } from ".";
import { useLayoutNotebook } from "../client";

import { FumaNextLink } from "@/next-js/link";

import * as TocClerk from "@/toc/clerk";
import * as TocDefault from "@/toc/default";
import { TOCScrollArea, useTOCItems } from "@/toc";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/ui/collapsible";
import { useMainRzlFumadocs } from "@/providers/main-rzl-fumadocs";

export const TocPopoverContext = createRequiredContext<{
  open: boolean;
  ref?: React.RefObject<HTMLElement | null>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>("TocPopoverContext");

export const useTocPopover = () => TocPopoverContext.use();

export function PageTOCPopover({
  className,
  children,
  ...rest
}: ComponentProps<"div">) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { isNavTransparent } = useLayoutNotebook();

  const onClick = useEffectEvent((e: Event) => {
    if (!open) return;

    if (ref.current && !ref.current.contains(e.target as HTMLElement))
      setOpen(false);
  });

  useEffect(() => {
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setOpen(false);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <TocPopoverContext.Provider
      value={useMemo(
        () => ({
          open,
          ref,
          setOpen
        }),
        [setOpen, open]
      )}
    >
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        data-toc-popover=""
        className={cn(
          "sticky top-(--fd-docs-row-2) z-10 [grid-area:toc-popover] h-(--fd-toc-popover-height) xl:hidden max-xl:layout:[--fd-toc-popover-height:--spacing(10)]",
          className
        )}
        {...rest}
      >
        <header
          ref={ref}
          className={cn(
            "border-b backdrop-blur-sm transition-transform",
            (!isNavTransparent || open) && "bg-fd-background/80",
            open && "shadow-lg"
          )}
        >
          {children}
        </header>
      </Collapsible>
    </TocPopoverContext.Provider>
  );
}

export function PageTOCPopoverTrigger({
  className,
  ...props
}: ComponentProps<"button">) {
  const { text } = useI18n();
  const { open } = useTocPopover();
  const items = useTOCItems();
  const active = useActiveAnchor();
  const selected = useMemo(
    () => items.findIndex((item) => active === item.url.slice(1)),
    [items, active]
  );
  const path = useTreePath().at(-1);
  const showItem = selected !== -1 && !open;

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full h-10 items-center text-sm text-fd-muted-foreground gap-2.5 px-4 py-2.5 text-start focus-visible:outline-none [&_svg]:size-4 md:px-6",
        className
      )}
      data-toc-popover-trigger=""
      // onPointerEnter={(e) => {
      //   if (e.pointerType === "touch") return;
      //   setOpen(true);
      // }}
      // onPointerLeave={(e) => {
      //   if (e.pointerType === "touch") return;
      //   setOpen(false);
      // }}
      {...props}
    >
      <ProgressCircle
        value={(selected + 1) / Math.max(1, items.length)}
        max={1}
        className={cn("shrink-0", open && "text-fd-primary")}
      />
      <span className="grid flex-1 *:my-auto *:row-start-1 *:col-start-1">
        <span
          className={cn(
            "truncate transition-[opacity,translate,color]",
            open && "text-fd-foreground",
            showItem && "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          {path?.name ?? text.toc}
        </span>
        <span
          className={cn(
            "truncate transition-[opacity,translate]",
            !showItem && "opacity-0 translate-y-full pointer-events-none"
          )}
        >
          {items[selected]?.title}
        </span>
      </span>
      <ChevronDown
        className={cn(
          "shrink-0 transition-transform mx-0.5",
          open && "rotate-180"
        )}
      />
    </CollapsibleTrigger>
  );
}

interface ProgressCircleProps extends Omit<
  React.ComponentProps<"svg">,
  "strokeWidth"
> {
  value: number;
  strokeWidth?: number;
  size?: number;
  min?: number;
  max?: number;
}

function clamp(input: number, min: number, max: number): number {
  if (input < min) return min;
  if (input > max) return max;
  return input;
}

function ProgressCircle({
  value,
  strokeWidth = 2,
  size = 24,
  min = 0,
  max = 100,
  ...restSvgProps
}: ProgressCircleProps) {
  const normalizedValue = clamp(value, min, max);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (normalizedValue / max) * circumference;
  const circleProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: "none",
    strokeWidth
  };

  return (
    <svg
      role="progressbar"
      viewBox={`0 0 ${size} ${size}`}
      aria-valuenow={normalizedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      {...restSvgProps}
    >
      <circle
        {...circleProps}
        className="stroke-current/25"
      />
      <circle
        {...circleProps}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all"
      />
    </svg>
  );
}

export function PageTOCPopoverContent(props: ComponentProps<"div">) {
  const { setOpen } = useTocPopover();

  const mergeCollapsibleContentProps = useCallback(() => {
    return mergeProps<
      Array<
        Pick<
          ComponentProps<typeof CollapsibleContent>,
          "onClick" | "className" | "style"
        >
      >
    >(
      { onClick: props.onClick },
      {
        onClick: () => {
          setOpen((prev) => !prev);
        }
      }
    );
  }, [props.onClick, setOpen]);

  return (
    <CollapsibleContent
      data-toc-popover-content=""
      {...props}
      {...mergeCollapsibleContentProps()}
      className={cn("flex flex-col px-4 max-h-[50vh] md:px-6", props.className)}
    >
      {props.children}
    </CollapsibleContent>
  );
}

export function PageLastUpdate({
  date: value,
  ...props
}: Omit<ComponentProps<"p">, "children"> & {
  date: Date | string | number | undefined;
}) {
  const { text } = useI18n();
  const [date, setDate] = useState<string | null>(null);

  const formattedDate = useEffectEvent((formatted: string) =>
    setDate(formatted)
  );

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      const formatted = date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      formattedDate(formatted);
    }
  }, [value]);

  return (
    <div
      {...props}
      className={cn(
        "flex justify-center gap-1 items-center text-sm text-fd-muted-foreground",
        props.className
      )}
    >
      <span>{text.lastUpdate}</span>
      {!date ? (
        <span className="h-4 w-22 rounded-xs animate-pulse bg-fd-accent dark:bg-fd-secondary inline-block" />
      ) : (
        date
      )}
    </div>
  );
}

type Item = Pick<PageTree.Item, "name" | "description" | "url">;
export interface FooterProps extends ComponentProps<"div"> {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: Item;
    next?: Item;
  };
}

export function PageFooter({ items, ...props }: FooterProps) {
  const footerList = useFooterItems();
  const pathname = usePathname();
  const { previous, next } = useMemo(() => {
    if (items) return items;

    const idx = footerList.findIndex((item) =>
      isActive(item.url, pathname, false)
    );

    if (idx === -1) return {};
    return {
      previous: footerList[idx - 1],
      next: footerList[idx + 1]
    };
  }, [footerList, items, pathname]);

  return (
    <div
      {...props}
      className={cn(
        "@container grid gap-4",
        previous && next ? "grid-cols-2" : "grid-cols-1",
        props.className
      )}
    >
      {previous ? (
        <FooterItem
          item={previous}
          index={0}
        />
      ) : null}
      {next ? (
        <FooterItem
          item={next}
          index={1}
        />
      ) : null}
    </div>
  );
}

function FooterItem({ item, index }: { item: Item; index: 0 | 1 }) {
  const { text } = useI18n();
  const Icon = index === 0 ? ChevronLeft : ChevronRight;

  return (
    <FumaNextLink
      href={item.url}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground @max-lg:col-span-full",
        index === 1 && "text-end"
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-1.5 font-medium",
          index === 1 && "flex-row-reverse"
        )}
      >
        <Icon className="-mx-1 size-4 shrink-0 rtl:rotate-180" />
        <p>{item.name}</p>
      </div>
      <p className="text-fd-muted-foreground truncate">
        {item.description ?? (index === 0 ? text.previousPage : text.nextPage)}
      </p>
    </FumaNextLink>
  );
}

export type BreadcrumbProps = BreadcrumbOptions & ComponentProps<"div">;

export function PageBreadcrumb({
  includeRoot,
  includeSeparator,
  includePage,
  ...props
}: BreadcrumbProps) {
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = useMemo(() => {
    return getBreadcrumbItemsFromPath(root, path, {
      includePage,
      includeSeparator,
      includeRoot
    });
  }, [includePage, includeRoot, includeSeparator, path, root]);

  if (items.length === 0) return null;

  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-1.5 text-sm text-fd-muted-foreground",
        props.className
      )}
    >
      {items.map((item, i) => {
        const className = cn(
          "truncate",
          i === items.length - 1 && "text-fd-primary font-medium"
        );

        return (
          <Fragment key={i}>
            {i !== 0 && <ChevronRight className="size-3.5 shrink-0" />}
            {item.url ? (
              <FumaNextLink
                href={item.url}
                className={cn(className, "transition-opacity hover:opacity-80")}
              >
                {item.name}
              </FumaNextLink>
            ) : (
              <span className={className}>{item.name}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export const TocAsideScrollToTop = () => {
  const { scrollBehavior } = useMainRzlFumadocs();

  return (
    <Button
      variant={"linkBlue"}
      tabIndex={-1}
      onClick={() => {
        const { pathname, search } = window.location;
        window.history.pushState(null, "", pathname + search);
        return scrollToTop({ ...scrollBehavior.toTop });
      }}
      className="ml-2"
    >
      <div className="flex justify-center items-center gap-1.5 text-fd-muted-foreground hover:text-fd-primary hover:decoration-fd-primary text-sm">
        Scroll to top{" "}
        <CircleArrowUp
          className="size-4"
          strokeWidth={2.5}
        />
      </div>
    </Button>
  );
};

export const TocAsideMain = ({
  style
}: Pick<TableOfContentOptions, "style">) => {
  return (
    <>
      <h3
        id="toc-title"
        className="inline-flex items-center gap-1.75 text-sm text-fd-muted-foreground data-[active=true]:text-fd-primary"
      >
        <Text className="size-4" />
        <I18nLabel label="toc" />
      </h3>

      <TOCScrollArea>
        {style === "normal" ? <TocDefault.TOCItems /> : <TocClerk.TOCItems />}
      </TOCScrollArea>
    </>
  );
};
