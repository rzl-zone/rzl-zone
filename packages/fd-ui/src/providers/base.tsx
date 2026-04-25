"use client";

import { lazy, type ReactNode } from "react";

import type * as PageTree from "fumadocs-core/page-tree";

import { I18nProvider } from "@fumadocs/base-ui/contexts/i18n";
import { TreeContextProvider } from "@fumadocs/base-ui/contexts/tree";
import { type Translations } from "@fumadocs/base-ui/contexts/i18n";
import { type DefaultSearchDialogProps } from "@fumadocs/base-ui/components/dialog/search-default";

import { type RzlThemeProviderProps } from "@rzl-zone/next-kit/themes";
import { RzlThemeAppProvider } from "@rzl-zone/next-kit/themes/app";

import {
  MetaOrControl,
  SearchProvider,
  type SearchProviderProps
} from "@/context/search";

import { DirectionProvider } from "@rzl-zone/docs-ui/components/radix-ui-direction";

interface LocaleItem {
  name: string;
  locale: string;
}

interface SearchOptions extends Omit<
  SearchProviderProps,
  "options" | "children"
> {
  options?: Partial<DefaultSearchDialogProps>;

  /**
   * Enable search functionality
   *
   * @default `true`
   */
  enabled?: boolean;
}

export interface RootProviderProps<EnabledSystem extends boolean> {
  tree: PageTree.Root;

  /**
   * `dir` option for Radix UI
   */
  dir?: "rtl" | "ltr";

  /**
   * @remarks `SearchProviderProps`
   */
  search?: Partial<SearchOptions>;

  /**
   * Customize options of `next-themes`
   */
  theme?: Partial<RzlThemeProviderProps<EnabledSystem>> & {
    /**
     * Enable `next-themes`
     *
     * @default true
     */
    enabled?: boolean;
    enableSystem?: EnabledSystem;
  };

  i18n?: Omit<I18nProviderProps, "children">;

  children?: ReactNode;
}

export interface I18nProviderProps {
  /**
   * Current locale
   */
  locale: string;

  /**
   * Handle changes to the locale, redirect user when not specified.
   */
  onLocaleChange?: (v: string) => void;

  /**
   * Translations of current locale
   */
  translations?: Partial<Translations>;

  /**
   * Available languages
   */
  locales?: LocaleItem[];

  children?: ReactNode;
}

const DefaultSearchDialog = lazy(
  // () => import("@fumadocs/base-ui/components/dialog/search-default")
  () => import("@fumadocs/base-ui/components/dialog/search-default")
);

export function RootProvider<EnabledSystemTheme extends boolean = true>({
  children,
  dir = "ltr",
  theme = {},
  search,
  tree,
  i18n
}: RootProviderProps<EnabledSystemTheme>) {
  let body = children;

  if (search?.enabled !== false)
    body = (
      <SearchProvider
        hotKey={[
          {
            key: (e) => e.metaKey || e.ctrlKey,
            display: <MetaOrControl />
          },
          {
            key: "k",
            display: "K"
          }
        ]}
        SearchDialog={DefaultSearchDialog}
        {...search}
      >
        {body}
      </SearchProvider>
    );

  if (theme?.enabled !== false)
    body = <RzlThemeAppProvider {...theme}>{body}</RzlThemeAppProvider>;

  if (i18n) {
    body = <I18nProvider {...i18n}>{body}</I18nProvider>;
  }

  return (
    <TreeContextProvider tree={tree}>
      <DirectionProvider dir={dir}>{body}</DirectionProvider>
    </TreeContextProvider>
  );
}
