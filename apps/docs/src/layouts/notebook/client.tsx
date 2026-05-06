"use client";

import { type ComponentProps, type FC } from "react";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { useIsScrollTop } from "@/hooks/use-is-scroll-top";

import { type DocsLayoutProps } from "./index";

import {
  baseSlots,
  type BaseSlots,
  type BaseSlotsProps,
  type LayoutTab,
  useLinkItems
} from "../shared";
import { type LinkItemType } from "../shared";

import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  type SidebarProps,
  type SidebarProviderProps
} from "./slots/sidebar";
import { Header } from "./slots/header";
import { Container } from "./slots/container";

export interface DocsSlots extends BaseSlots {
  container: FC<ComponentProps<"div">>;
  header: FC<ComponentProps<"header">>;
  sidebar: {
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

const LayoutContext = createRequiredContext<{
  props: SlotsProps;
  isNavTransparent: boolean;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: DocsSlots;
}>("LayoutContext");

export function useNotebookLayout() {
  return LayoutContext.useSuspense(
    "Please use <DocsPage /> (`@/layouts/notebook/page`) under <DocsLayout /> (`@/layouts/notebook`)."
  );
}

export function LayoutBody(
  props: Omit<DocsLayoutProps, "tabs"> & {
    tabs: LayoutTab[];
  }
) {
  const {
    nav: {
      enabled: navEnabled = true,
      transparentMode: navTransparentMode = "none"
    } = {},
    sidebar: { defaultOpenLevel, prefetch, ...sidebarProps } = {},
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
    header: defaultSlots?.header ?? Header,
    container: defaultSlots?.container ?? Container,
    sidebar: defaultSlots?.sidebar ?? {
      provider: SidebarProvider,
      root: Sidebar,
      trigger: SidebarTrigger,
      collapseTrigger: SidebarCollapseTrigger,
      useSidebar
    }
  };

  return (
    <>
      <TreeContextProvider tree={tree}>
        <LayoutContext.Provider
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
          <slots.sidebar.provider
            defaultOpenLevel={defaultOpenLevel}
            prefetch={prefetch}
          >
            <slots.container {...containerProps}>
              {navEnabled && <slots.header />}

              <slots.sidebar.root {...sidebarProps} />

              {children}
            </slots.container>
          </slots.sidebar.provider>
        </LayoutContext.Provider>
      </TreeContextProvider>
    </>
  );
}
