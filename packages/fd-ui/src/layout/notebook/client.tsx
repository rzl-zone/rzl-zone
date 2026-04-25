"use client";

import {
  type ComponentProps,
  Fragment,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { usePathname } from "fumadocs-core/framework";
import { useIsScrollTop } from "@fumadocs/base-ui/utils/use-is-scroll-top";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { cn } from "@rzl-zone/docs-ui/utils";
import { ChevronDown } from "@rzl-zone/docs-ui/components/icons/lucide";

import { isTabActive } from "@workspace/fd-core/utils";
import { FumaNextLink } from "@/next-js/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

import { useSidebar } from "@/layout/sidebar/base";
import { type SidebarTabWithProps } from "@/layout/sidebar/tabs/dropdown";
import {
  LinkItem,
  type LinkItemType,
  type MenuItemType
} from "@/layout/link-item";

export const LayoutNotebookContext = createRequiredContext<
  LayoutNotebookInfo & {
    isNavTransparent: boolean;
  }
>("LayoutNotebookContext");

export const useLayoutNotebook = () => LayoutNotebookContext.useSuspense();

export interface LayoutNotebookInfo {
  tabMode: "sidebar" | "navbar";
  navMode: "top" | "auto";
}

export function LayoutNotebookProvider({
  navTransparentMode = "none",
  navMode,
  tabMode,
  children
}: LayoutNotebookInfo & {
  navTransparentMode?: "always" | "top" | "none";
  children: ReactNode;
}) {
  const isTop =
    useIsScrollTop({ enabled: navTransparentMode === "top" }) ?? true;
  const isNavTransparent =
    navTransparentMode === "top" ? isTop : navTransparentMode === "always";

  return (
    <LayoutNotebookContext.Provider
      value={useMemo(
        () => ({
          isNavTransparent,
          navMode,
          tabMode
        }),
        [isNavTransparent, navMode, tabMode]
      )}
    >
      {children}
    </LayoutNotebookContext.Provider>
  );
}

export function LayoutNotebookHeader(props: ComponentProps<"header">) {
  const { open } = useSidebar();
  const { isNavTransparent } = useLayoutNotebook();

  return (
    <header
      data-transparent={isNavTransparent && !open}
      {...props}
    >
      {props.children}
    </header>
  );
}

export function LayoutNotebookBody({
  className,
  style,
  children,
  ...props
}: ComponentProps<"div">) {
  const { navMode } = useLayoutNotebook();
  const { collapsed } = useSidebar();
  const pageCol =
    "calc(var(--fd-layout-width,97rem) - var(--fd-sidebar-col) - var(--fd-toc-width))";

  return (
    <div
      id="nd-notebook-layout"
      className={cn(
        // " overflow-x-clip ",
        // "overflow-x-hidden",
        "grid min-h-(--fd-docs-height) transition-[grid-template-columns] auto-cols-auto auto-rows-auto [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-toc-popover-height:0px] [--fd-sidebar-width:0px] [--fd-toc-width:0px]",
        className
      )}
      style={
        {
          gridTemplate:
            navMode === "top"
              ? `". header header header ."
        "sidebar sidebar toc-popover toc-popover ."
        "sidebar sidebar main toc ." 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, ${pageCol}) var(--fd-toc-width) minmax(min-content, 1fr)`
              : `"sidebar sidebar header header ."
        "sidebar sidebar toc-popover toc-popover ."
        "sidebar sidebar main toc ." 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, ${pageCol}) var(--fd-toc-width) minmax(min-content, 1fr)`,
          "--fd-docs-row-1": "var(--fd-banner-height, 0px)",
          "--fd-docs-row-2":
            "calc(var(--fd-docs-row-1) + var(--fd-header-height))",
          "--fd-docs-row-3":
            "calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))",
          "--fd-sidebar-col": collapsed ? "0px" : "var(--fd-sidebar-width)",
          ...style
        } as object
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function LayoutNotebookHeaderTabs({
  options,
  className,
  ...props
}: ComponentProps<"div"> & {
  options: SidebarTabWithProps[];
}) {
  const pathname = usePathname();
  const selectedIdx = useMemo(() => {
    return options.findLastIndex((option) => isTabActive(option, pathname));
  }, [options, pathname]);

  return (
    <div
      className={cn("flex flex-row items-end gap-6", className)}
      {...props}
    >
      {options.map((option, i) => {
        const {
          title,
          url,
          unlisted,
          props: { className, ...rest } = {}
        } = option;
        const isSelected = selectedIdx === i;

        return (
          <FumaNextLink
            key={i}
            href={url}
            className={cn(
              "inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground",
              unlisted && !isSelected && "hidden",
              isSelected && "border-fd-primary text-fd-primary",
              className
            )}
            {...rest}
          >
            {title}
          </FumaNextLink>
        );
      })}
    </div>
  );
}

export function NavbarLinkItem({
  item,
  className,
  ...props
}: { item: LinkItemType } & HTMLAttributes<HTMLElement>) {
  if (item.type === "custom") return item.children;

  if (item.type === "menu") {
    return (
      <NavbarLinkItemMenu
        item={item}
        className={className}
        {...props}
      />
    );
  }

  return (
    <LinkItem
      item={item}
      className={cn(
        "text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary",
        className
      )}
      {...props}
    >
      {item.text}
    </LinkItem>
  );
}

function NavbarLinkItemMenu({
  item,
  hoverDelay = 50,
  className,
  ...props
}: { item: MenuItemType; hoverDelay?: number } & HTMLAttributes<HTMLElement>) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<number>(null);
  const freezeUntil = useRef<number>(null);

  const delaySetOpen = (value: boolean) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      freezeUntil.current = null;
    }

    timeoutRef.current = window.setTimeout(() => {
      setOpen(value);
      freezeUntil.current = Date.now() + 300;
    }, hoverDelay);
  };

  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    delaySetOpen(true);
  };
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    delaySetOpen(false);
  };
  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (freezeUntil.current) {
        freezeUntil.current = null;
      }
    };
  }, []);

  return (
    <Popover
      open={open}
      // onOpenChange={(value) => {
      //   if (freezeUntil.current === null || Date.now() >= freezeUntil.current)
      //     setOpen(value);
      // }}
      onOpenChange={(value) => {
        if (value === open) return;

        if (freezeUntil.current === null || Date.now() >= freezeUntil.current) {
          setOpen(value);
        }
      }}
    >
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-1.5 p-1 text-sm text-fd-muted-foreground transition-colors has-data-[active=true]:text-fd-primary data-[state=open]:text-fd-accent-foreground focus-visible:outline-none",
          className
        )}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        {...props}
      >
        {item.url ? (
          <LinkItem item={item as { url: string }}>{item.text}</LinkItem>
        ) : (
          item.text
        )}
        <ChevronDown className="size-3" />
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col p-1 text-fd-muted-foreground text-start"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {item.items.map((child, i) => {
          if (child.type === "custom")
            return <Fragment key={i}>{child.children}</Fragment>;

          return (
            <LinkItem
              key={i}
              item={child}
              className="inline-flex items-center gap-2 rounded-md p-2 transition-all hover:bg-fd-accent hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&_svg]:size-4"
              onClick={() => {
                if (isTouchDevice()) setOpen(false);
              }}
            >
              {child.icon}
              {child.text}
            </LinkItem>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
