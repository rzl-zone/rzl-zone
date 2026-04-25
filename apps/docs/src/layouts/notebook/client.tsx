"use client";

import { type ComponentProps, createContext, type FC, use } from "react";

import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { useIsScrollTop } from "fumadocs-ui/utils/use-is-scroll-top";

import { useMainRzlFumadocs } from "@/context/main-rzl-fumadocs";
import {
  type LinkItemType,
  baseSlots,
  type BaseSlots,
  type BaseSlotsProps,
  type LayoutTab,
  useLinkItems
} from "@/layouts/shared";
import { type DocsLayoutProps } from "@/layouts/notebook";

import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  type SidebarProps,
  type SidebarProviderProps
} from "@/layouts/notebook/slots/sidebar";
import { Header } from "@/layouts/notebook/slots/header";
import { Container } from "@/layouts/notebook/slots/container";

export interface DocsSlots extends BaseSlots {
  container?: FC<ComponentProps<"div">>;
  header?: FC<ComponentProps<"header">>;
  sidebar?: {
    provider: FC<SidebarProviderProps>;
    root: FC<SidebarProps>;
    trigger: FC<ComponentProps<"button">>;
    collapseTrigger: FC<ComponentProps<"button">>;
    useSidebar: () => {
      collapsed: boolean;
      open: boolean;
      setOpen: (V: boolean) => void;
    };
  };
}

const { useProvider } = baseSlots({
  useProps() {
    return useNotebookLayout().props;
  }
});

interface SlotsProps extends BaseSlotsProps<DocsLayoutProps> {
  sidebar: SidebarProps;
  tabMode: NonNullable<DocsLayoutProps["tabMode"]>;
  tabs: LayoutTab[];
}

const LayoutContext = createContext<{
  props: SlotsProps;
  isNavTransparent: boolean;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: DocsSlots;
} | null>(null);

export function useNotebookLayout() {
  const context = use(LayoutContext);
  if (!context)
    throw new Error(
      "Please use <DocsPage /> (`fumadocs-ui/layouts/notebook/page`) under <DocsLayout /> (`fumadocs-ui/layouts/notebook`)."
    );
  return context;
}

export function LayoutBody(
  props: Omit<DocsLayoutProps, "tabs"> & {
    tabs: LayoutTab[];
  }
) {
  const { link } = useMainRzlFumadocs();

  const {
    nav: {
      enabled: navEnabled = true,
      transparentMode: navTransparentMode = "none"
    } = {},
    sidebar: {
      defaultOpenLevel,
      prefetch = link.prefetch,
      ...sidebarProps
    } = {},
    slots: defaultSlots,
    tabMode = "sidebar",
    tabs,
    tree,
    containerProps,
    children
  } = props;
  const isTop =
    useIsScrollTop({ enabled: navTransparentMode === "top" }) ?? true;
  const isNavTransparent =
    navTransparentMode === "top" ? isTop : navTransparentMode === "always";
  const { baseSlots, baseProps } = useProvider(props);
  const linkItems = useLinkItems(props);
  const slots: DocsSlots = {
    ...baseSlots,
    header: navEnabled ? (defaultSlots?.header ?? Header) : undefined,
    container: defaultSlots?.container ?? Container,
    sidebar: defaultSlots?.sidebar ?? {
      provider: SidebarProvider,
      root: Sidebar,
      trigger: SidebarTrigger,
      collapseTrigger: SidebarCollapseTrigger,
      useSidebar
    }
  };

  let content = (
    <>
      {slots.header && <slots.header />}
      {slots.sidebar && <slots.sidebar.root {...sidebarProps} />}
      {children}
    </>
  );

  if (slots.container) {
    content = <slots.container {...containerProps}>{content}</slots.container>;
  }

  if (slots.sidebar) {
    content = (
      <slots.sidebar.provider
        defaultOpenLevel={defaultOpenLevel}
        prefetch={prefetch}
      >
        {content}
      </slots.sidebar.provider>
    );
  }

  return (
    <TreeContextProvider tree={tree}>
      <LayoutContext
        value={{
          props: {
            tabs,
            tabMode,
            sidebar: sidebarProps,
            ...baseProps
          },
          isNavTransparent,
          slots,
          ...linkItems
        }}
      >
        {/* <AiSearchProvider /> */}
        {content}
      </LayoutContext>
    </TreeContextProvider>
  );
}
