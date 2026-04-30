"use client";

import {
  type ComponentProps,
  createContext,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  use,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { usePathname } from "fumadocs-core/framework";

import { useMediaQuery, useOnChange } from "@rzl-zone/core-react/hooks";

import {
  ChevronDown,
  ExternalLink
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { Button } from "@rzl-zone/docs-ui/components/button";
import { cn, scrollIntoView } from "@rzl-zone/docs-ui/utils";
import { Presence } from "@rzl-zone/docs-ui/components/radix-ui-presence";

import {
  Collapsible,
  CollapsibleContent,
  type CollapsibleContentProps,
  CollapsibleTrigger,
  type CollapsibleTriggerProps
} from "../ui/collapsible";
import { FumaNextLink, type FumaNextLinkType } from "../link";
import { useMainRzlFumadocs } from "@/context/main-rzl-fumadocs";

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
   * @defaultValue 0
   */
  defaultOpenLevel?: number;

  /**
   * Prefetch links, default behavior depends on your React.js framework.
   */
  prefetch?: FumaNextLinkType["prefetch"];

  children?: ReactNode;
}

type Mode = "drawer" | "full";

const SidebarContext = createContext<SidebarContext | null>(null);

const FolderContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  depth: number;
  collapsible: boolean;
} | null>(null);

export function SidebarProvider({
  defaultOpenLevel = 0,
  prefetch,
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
    <SidebarContext
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
    </SidebarContext>
  );
}

export function useSidebar(): SidebarContext {
  const ctx = use(SidebarContext);
  if (!ctx)
    throw new Error(
      "Missing SidebarContext, make sure you have wrapped the component in <DocsLayout /> and the context is available."
    );

  return ctx;
}

export function useFolder() {
  return use(FolderContext);
}

export function useFolderDepth() {
  return use(FolderContext)?.depth ?? 0;
}

export function SidebarContent({
  mode: allowedMode = "full",
  children
}: {
  mode?: Mode | true;
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

  if (allowedMode !== true && allowedMode !== mode) return;

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
  const { bodyScroll } = useMainRzlFumadocs();
  const { setDisableBodyScroll } = bodyScroll;
  const { open, mode } = useSidebar();
  const state = open ? "open" : "closed";

  useEffect(() => {
    const isOpenDrawer = open && mode === "drawer";

    if (isOpenDrawer) {
      setDisableBodyScroll(isOpenDrawer);
    } else {
      setDisableBodyScroll(false);
    }

    return () => {};
  }, [open, mode]);

  // useEffect(() => {
  //   const body = document.body;

  //   if (open && mode === "drawer") {
  //     body.dataset.mobileSidebar = "open";
  //   } else {
  //     delete body.dataset.mobileSidebar;
  //   }

  //   return () => {
  //     delete body.dataset.mobileSidebar;
  //   };
  // }, [open, mode]);

  if (mode !== "drawer") return;
  return (
    <Presence present={open}>
      {({ present }) => (
        <aside
          id="nd-sidebar-mobile"
          data-state={state}
          className={cn(!present && "invisible", className)}
          {...props}
        >
          {children}
        </aside>
      )}
    </Presence>
  );
}

export function SidebarSeparator(props: ComponentProps<"p">) {
  return <p {...props} />;
}

export function SidebarItem({
  icon,
  active = false,
  children,
  ...props
}: FumaNextLinkType & {
  active?: boolean;
  icon?: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { prefetch } = useSidebar();

  useAutoScroll(active, ref);

  return (
    <FumaNextLink
      ref={ref}
      data-active={active}
      prefetch={prefetch}
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
      <FolderContext
        value={useMemo(
          () => ({ open, setOpen, depth, collapsible }),
          [collapsible, depth, open]
        )}
      >
        {children}
      </FolderContext>
    </Collapsible>
  );
}

export function SidebarFolderTrigger({
  children,
  ...props
}: CollapsibleTriggerProps) {
  const { open, collapsible } = use(FolderContext)!;

  if (collapsible) {
    return (
      <CollapsibleTrigger {...props}>
        {children}
        <ChevronDown
          data-icon
          className={cn(
            "ms-auto transition-transform",
            !open && "-rotate-90 rtl:rotate-90"
          )}
        />
      </CollapsibleTrigger>
    );
  }

  return <div {...(props as ComponentProps<"div">)}>{children}</div>;
}

export function SidebarFolderLink({
  children,
  active = false,
  ...props
}: FumaNextLinkType & {
  active?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { open, setOpen, collapsible } = use(FolderContext)!;
  const { prefetch } = useSidebar();

  useAutoScroll(active, ref);

  return (
    <FumaNextLink
      ref={ref}
      data-active={active}
      onClick={(e) => {
        if (!collapsible) return;

        if (
          e.target instanceof Element &&
          e.target.matches("[data-icon], [data-icon] *")
        ) {
          setOpen(!open);
          e.preventDefault();
        } else {
          setOpen(active ? !open : true);
        }
      }}
      prefetch={prefetch}
      {...props}
    >
      {children}
      {collapsible && (
        <ChevronDown
          data-icon
          className={cn(
            "ms-auto transition-transform",
            !open && "-rotate-90 rtl:rotate-90"
          )}
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

/**
 * scroll to the element if `active` is true
 */
export function useAutoScroll(
  active: boolean,
  ref: RefObject<HTMLElement | null>
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
