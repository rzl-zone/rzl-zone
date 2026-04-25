"use client";

import {
  type ComponentProps,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { usePathname } from "fumadocs-core/framework";

import { useMediaQuery, useOnChange } from "@rzl-zone/core-react/hooks";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { cn, scrollIntoView } from "@rzl-zone/docs-ui/utils";
import { Button } from "@rzl-zone/docs-ui/components/button";
import { Presence } from "@rzl-zone/docs-ui/components/radix-ui-presence";
import {
  ChevronDown,
  ExternalLink
} from "@rzl-zone/docs-ui/components/icons/lucide";

import { isActive } from "@workspace/fd-core/utils";
import { FumaNextLink, type FumaNextLinkType } from "@/next-js/link";

import {
  Collapsible,
  CollapsibleContent,
  type CollapsibleContentProps,
  CollapsibleTrigger,
  type CollapsibleTriggerProps
} from "@/ui/collapsible";
import {
  ScrollArea,
  type ScrollAreaProps,
  ScrollViewport
} from "@/ui/scroll-area";

interface SidebarContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * When set to false, don't close the sidebar when navigate to another page
   */
  closeOnRedirect: RefObject<boolean>;
  defaultOpenLevel: number;
  prefetch?: FumaNextLinkType["prefetch"];
  mode: Mode;
}

export interface SidebarProviderProps {
  /**
   * Open folders by default if their level is lower or equal to a specific level
   * (Starting from 1)
   *
   * @default 0
   */
  defaultOpenLevel?: number;

  /**
   * Prefetch links
   *
   * @default true
   */
  prefetch?: FumaNextLinkType["prefetch"];

  children?: ReactNode;
}

type Mode = "drawer" | "full";

const SidebarContext = createRequiredContext<SidebarContext>("SidebarContext");

const FolderContext = createRequiredContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  depth: number;
  collapsible: boolean;
} | null>("FolderContext", null);

export function SidebarProvider({
  defaultOpenLevel = 0,
  prefetch = true,
  children
}: SidebarProviderProps) {
  const closeOnRedirect = useRef(true);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const mode: Mode = useMediaQuery("(width < 768px)") ? "drawer" : "full";

  useOnChange(pathname, () => {
    if (closeOnRedirect.current) {
      setOpen(false);
    }
    closeOnRedirect.current = true;
  });

  return (
    <SidebarContext.Provider
      value={useMemo(
        () => ({
          open,
          setOpen,
          collapsed,
          setCollapsed,
          closeOnRedirect,
          defaultOpenLevel,
          prefetch,
          mode
        }),
        [open, collapsed, defaultOpenLevel, prefetch, mode]
      )}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContext {
  return SidebarContext.useSuspense();
}
export function useFolderContext() {
  return FolderContext.useSuspense();
}

export function useFolder() {
  return FolderContext.useSuspense();
}

export function useFolderDepth() {
  return FolderContext.useSuspense()?.depth ?? 0;
}

export function SidebarContent({
  children
}: {
  children: (state: {
    ref: RefObject<HTMLElement | null>;
    collapsed: boolean;
    hovered: boolean;
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
  }) => ReactNode;
}) {
  const { collapsed, mode } = useSidebar();
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timerRef = useRef(0);

  useOnChange(collapsed, () => {
    if (collapsed) setHover(false);
  });

  if (mode !== "full") return;

  function shouldIgnoreHover(e: PointerEvent): boolean {
    const element = ref.current;
    if (!element) return true;

    return (
      !collapsed ||
      e.pointerType === "touch" ||
      element.getAnimations().length > 0
    );
  }

  // eslint-disable-next-line react-hooks/refs
  return children({
    ref,
    collapsed,
    hovered: hover,
    onPointerEnter(e) {
      if (shouldIgnoreHover(e)) return;
      window.clearTimeout(timerRef.current);
      setHover(true);
    },
    onPointerLeave(e) {
      if (shouldIgnoreHover(e)) return;
      window.clearTimeout(timerRef.current);

      timerRef.current = window.setTimeout(
        () => setHover(false),
        // if mouse is leaving the viewport, add a close delay
        Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100
          ? 0
          : 500
      );
    }
  });
}

export function SidebarDrawerOverlay(props: ComponentProps<"div">) {
  const { open, setOpen, mode } = useSidebar();

  if (mode !== "drawer") return;
  return (
    <Presence present={open}>
      <div
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen(false)}
        {...props}
      />
    </Presence>
  );
}

export function SidebarDrawerContent({
  className,
  children,
  ...props
}: ComponentProps<"aside">) {
  const { open, mode } = useSidebar();
  const state = open ? "open" : "closed";

  useEffect(() => {
    const body = document.body;

    if (open && mode === "drawer") {
      body.dataset.mobileSidebar = "open";
    } else {
      delete body.dataset.mobileSidebar;
    }

    return () => {
      delete body.dataset.mobileSidebar;
    };
  }, [open, mode]);

  if (mode !== "drawer") return;

  return (
    <>
      {/* {open && (
        <style jsx global data-style-jsx="sidebar-mobile">{`
          body[data-mobile-sidebar="open"] {
            overflow: hidden !important;
            overscroll-behavior: contain;
            position: relative !important;
            padding-left: 0;
            padding-top: 0;
            padding-right: 0;
            margin-left: 0;
            margin-top: 0;
            margin-right: 0 !important;
            --removed-body-scroll-bar-size: 0px;
          }
        `}</style>
      )} */}

      <Presence present={open}>
        {({ present }) => (
          <aside
            id="nd-sidebar-mobile"
            {...props}
            data-state={state}
            className={cn(!present && "invisible", className)}
          >
            {children}
          </aside>
        )}
      </Presence>
    </>
  );
}

export function SidebarViewport(props: ScrollAreaProps) {
  return (
    <ScrollArea
      {...props}
      className={cn("min-h-0 flex-1", props.className)}
    >
      <ScrollViewport
        className="p-4 overscroll-contain"
        style={
          {
            maskImage:
              "linear-gradient(to bottom, transparent, white 12px, white calc(100% - 12px), transparent)"
          } as object
        }
      >
        {props.children}
      </ScrollViewport>
    </ScrollArea>
  );
}

export function SidebarSeparator(props: ComponentProps<"p">) {
  const depth = useFolderDepth();
  return (
    <p
      {...props}
      className={cn(
        "inline-flex items-center gap-2 mb-1.5 px-2 first:mt-3 mt-6 empty:mb-0",
        depth === 0 && "first:mt-0",
        props.className
      )}
    >
      {props.children}
    </p>
  );
}

export function SidebarItem({
  icon,
  children,
  ...props
}: FumaNextLinkType & {
  icon?: ReactNode;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLAnchorElement>(null);
  const { prefetch } = useSidebar();
  const active =
    props.href !== undefined && isActive(props.href, pathname, false);

  useAutoScroll(active, ref);

  return (
    <FumaNextLink
      tabIndex={props.tabIndex || -1}
      ref={ref}
      data-active={active}
      prefetch={prefetch}
      onClick={(e) => {
        if (active) return e.preventDefault();
        return props.onClick?.(e);
      }}
      {...props}
    >
      {icon ?? (props.external ? <ExternalLink /> : null)}
      {children}
    </FumaNextLink>
  );
}

export function SidebarFolder({
  defaultOpen: defaultOpenProp,
  collapsible = true,
  active = false,
  children,
  ...props
}: ComponentProps<"div"> & {
  active?: boolean;
  defaultOpen?: boolean;
  collapsible?: boolean;
}) {
  const { defaultOpenLevel } = useSidebar();
  const depth = useFolderDepth() + 1;
  const defaultOpen =
    collapsible === false ||
    active ||
    (defaultOpenProp ?? defaultOpenLevel >= depth);
  const [open, setOpen] = useState(defaultOpen);

  useOnChange(defaultOpen, (v) => {
    if (v) setOpen(v);
  });

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      disabled={!collapsible}
      {...props}
    >
      <FolderContext.Provider
        value={useMemo(
          () => ({ open, setOpen, depth, collapsible }),
          [collapsible, depth, open]
        )}
      >
        {children}
      </FolderContext.Provider>
    </Collapsible>
  );
}

export function SidebarFolderTrigger({
  children,
  ...props
}: CollapsibleTriggerProps) {
  const { open, collapsible } = useFolderContext() || {};

  if (collapsible) {
    return (
      <CollapsibleTrigger
        {...props}
        tabIndex={props.tabIndex || -1}
      >
        {children}
        <ChevronDown
          data-icon
          className={cn("ms-auto transition-transform", !open && "-rotate-90")}
        />
      </CollapsibleTrigger>
    );
  }

  return <div {...(props as ComponentProps<"div">)}>{children}</div>;
}

export function SidebarFolderLink({ children, ...props }: FumaNextLinkType) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { open, setOpen, collapsible } = useFolderContext() || {};
  const { prefetch } = useSidebar();
  const pathname = usePathname();
  const active =
    props.href !== undefined && isActive(props.href, pathname, false);

  useAutoScroll(active, ref);

  return (
    <FumaNextLink
      ref={ref}
      tabIndex={props.tabIndex || -1}
      data-active={active}
      onClick={(e) => {
        if (!collapsible) return;

        if (
          e.target instanceof Element &&
          e.target.matches("[data-icon], [data-icon] *")
        ) {
          setOpen?.(!open);
          e.preventDefault();
        } else {
          setOpen?.(active ? !open : true);
          if (active) return e.preventDefault();
        }
      }}
      prefetch={prefetch}
      {...props}
    >
      {children}
      {collapsible && (
        <ChevronDown
          data-icon
          className={cn("ms-auto transition-transform", !open && "-rotate-90")}
        />
      )}
    </FumaNextLink>
  );
}

export function SidebarFolderContent(props: CollapsibleContentProps) {
  return <CollapsibleContent {...props}>{props.children}</CollapsibleContent>;
}

export function SidebarTrigger({
  children,
  ...props
}: ComponentProps<"button">) {
  const { setOpen } = useSidebar();

  return (
    <button
      aria-label="Open Sidebar"
      onClick={() => setOpen((prev) => !prev)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarCollapseTrigger(props: ComponentProps<"button">) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <Button
      type="button"
      aria-label="Collapse Sidebar"
      data-collapsed={collapsed}
      onClick={() => {
        setCollapsed((prev) => !prev);
      }}
      {...props}
    >
      {props.children}
    </Button>
  );
}

function useAutoScroll(
  active: boolean,
  ref: RefObject<HTMLAnchorElement | null>
) {
  const { mode } = useSidebar();

  useEffect(() => {
    if (active && ref.current) {
      scrollIntoView(ref.current, {
        boundary: document.getElementById(
          mode === "drawer" ? "nd-sidebar-mobile" : "nd-sidebar"
        ),
        scrollMode: "if-needed"
      });
    }
  }, [active, mode, ref]);
}
