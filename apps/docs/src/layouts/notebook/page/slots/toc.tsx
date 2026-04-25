"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode
} from "react";

import useDetectScroll from "@smakss/react-scroll-direction";

import { useTreePath } from "fumadocs-ui/contexts/tree";
import { I18nLabel, useI18n } from "fumadocs-ui/contexts/i18n";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  ChevronDown,
  CircleArrowUp,
  Text
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { Button } from "@rzl-zone/docs-ui/components/button";

import { scrollToTop } from "@rzl-zone/utils-js/events";
import { mergeProps } from "@rzl-zone/core-react/utils";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from "@/components/ui/collapsible";
import * as Base from "@/components/toc";
import * as TocClerk from "@/components/toc/clerk";
import * as TocDefault from "@/components/toc/default";
import { useNotebookLayout } from "@/layouts/notebook/client";

import { useMainRzlFumadocs } from "@/context/main-rzl-fumadocs";

export type TOCProviderProps = Base.TOCProviderProps;

export type ExtraTOCPopover = { tocPopover?: boolean };

export function TOCProvider(props: TOCProviderProps) {
  return <Base.TOCProvider {...props} />;
}

export interface TOCProps {
  container?: ComponentProps<"div">;
  /**
   * Custom content in TOC container, before the main TOC
   */
  header?: ReactNode;

  /**
   * Custom content in TOC container, after the main TOC
   */
  footer?: ReactNode;

  /**
   * @defaultValue 'clerk'
   */
  style?: "normal" | "clerk";
}

export function TOC({ container, header, footer, style }: TOCProps) {
  return (
    <div
      id="nd-toc"
      {...container}
      // className={cn(
      //   "sticky top-(--fd-docs-row-3) [grid-area:toc] h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))] flex flex-col w-(--fd-toc-width) pt-12 pe-4 pb-2 xl:layout:[--fd-toc-width:268px] max-xl:hidden",
      //   container?.className
      // )}
      className={cn(
        "sticky top-(--fd-docs-row-3) [grid-area:toc] pt-8 pe-4 xl:layout:[--fd-toc-width:268px] max-xl:hidden",
        "h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))]",
        "flex flex-col justify-between",
        container?.className
      )}
    >
      <div className="flex flex-col w-(--fd-toc-width) max-h-[85%]">
        {header}
        <TocAsideMain style={style} />
        {footer}
      </div>

      <div className="bottom-0 my-2 w-full">
        <hr className="my-0.5" />

        <TocAsideScrollToTop />
      </div>
    </div>
  );
}

export const TocPopoverContext = createRequiredContext<{
  open: boolean;
  ref?: React.RefObject<HTMLElement | null>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>("TocPopoverContext");

export const useTocPopover = () => TocPopoverContext.use();

export interface TOCPopoverProps {
  container?: ComponentProps<"div">;
  trigger?: ComponentProps<"button">;
  content?: ComponentProps<"div">;

  /**
   * Custom content in TOC container, before the main TOC
   */
  header?: ReactNode;

  /**
   * Custom content in TOC container, after the main TOC
   */
  footer?: ReactNode;

  /**
   * @defaultValue 'clerk'
   */
  style?: "normal" | "clerk";
}

export function TOCPopover({
  container,
  trigger,
  content,
  header,
  footer,
  style = "clerk"
}: TOCPopoverProps) {
  return (
    <PageTOCPopover {...container}>
      <PageTOCPopoverTrigger {...trigger} />
      <PageTOCPopoverContent {...content}>
        {header}
        <TocAsideMain
          style={style}
          tocPopover
        />
        {footer}
      </PageTOCPopoverContent>
    </PageTOCPopover>
  );
}

function PageTOCPopover({
  className,
  children,
  ...rest
}: ComponentProps<"div">) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { isNavTransparent } = useNotebookLayout();

  const scrollDir = useDetectScroll();

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
    let id: NodeJS.Timeout | number | undefined = undefined;
    if (open) {
      id = setTimeout(() => setOpen(false), 0);
    }

    return () => {
      if (id) clearTimeout(id);
    };
  }, [scrollDir.scrollDir]);

  return (
    <TocPopoverContext.Provider
      value={useMemo(
        () => ({
          open,
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
            "border-b backdrop-blur-sm transition-colors",
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

function PageTOCPopoverTrigger({
  className,
  ...props
}: ComponentProps<"button">) {
  const { text } = useI18n();
  const { open } = useTocPopover();
  const items = Base.useTOCItems();
  const active = Base.useActiveAnchor();
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

function PageTOCPopoverContent(props: ComponentProps<"div">) {
  const { setOpen, open } = useTocPopover();

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
          if (!open) return;
          setOpen(() => false);
        }
      }
    );
  }, [props.onClick, setOpen, open]);

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
  style = "clerk",
  tocPopover
}: Pick<TOCPopoverProps, "style"> & ExtraTOCPopover) => {
  return (
    <>
      {!tocPopover ? (
        <h3
          id="toc-title"
          className="inline-flex items-center gap-1.75 text-sm text-fd-muted-foreground data-[active=true]:text-fd-primary"
        >
          <Text className="size-4" />
          <I18nLabel label="toc" />
        </h3>
      ) : null}

      <Base.TOCScrollArea>
        {style === "clerk" ? (
          <TocClerk.TOCItems tocPopover={tocPopover} />
        ) : (
          <TocDefault.TOCItems />
        )}
      </Base.TOCScrollArea>
    </>
  );
};
