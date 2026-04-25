"use client";
import { lazy } from "react";

import type { OmitStrict } from "@rzl-zone/ts-types-plus";
import type { RootProviderProps } from "fumadocs-ui/provider/base";

import type { Framework } from "fumadocs-core/framework";
import { NextProvider } from "fumadocs-core/framework/next";

import { I18nProvider } from "fumadocs-ui/contexts/i18n";
import { SearchProvider } from "fumadocs-ui/contexts/search";

import { RzlThemeAppProvider } from "@rzl-zone/next-kit/themes/app";
import { type RzlThemeProviderProps } from "@rzl-zone/next-kit/themes";

import { DirectionProvider } from "@rzl-zone/docs-ui/components/radix-ui-direction";

import { FumaNextLink } from "@/components/link";

const DefaultSearchDialog = lazy(
  () => import("fumadocs-ui/components/dialog/search-default")
);

interface RootFdBaseProviderProps extends OmitStrict<
  RootProviderProps,
  "theme"
> {
  /** Custom framework components to override Next.js defaults */
  components?: {
    Link?: Framework["Link"];
    Image?: Framework["Image"];
  };
  theme?: OmitStrict<RzlThemeProviderProps, "children"> & { enabled?: boolean };
}

export function RootFdBaseProvider({
  children,
  dir = "ltr",
  theme = {},
  search,
  components,
  i18n
}: RootFdBaseProviderProps) {
  let body = children;
  if (search?.enabled !== false)
    body = (
      <SearchProvider
        SearchDialog={DefaultSearchDialog}
        {...search}
      >
        {body}
      </SearchProvider>
    );
  if (theme?.enabled !== false)
    body = (
      <RzlThemeAppProvider
        enableSystem
        attribute={"class"}
        defaultTheme="system"
        metaColorSchemeValue={{
          light: "#fafafa",
          dark: "#0569ff26"
        }}
        {...theme}
      >
        {body}
      </RzlThemeAppProvider>
    );
  if (i18n) body = <I18nProvider {...i18n}>{body}</I18nProvider>;

  return (
    <NextProvider
      Link={components?.Link ?? (FumaNextLink as Framework["Link"])}
      Image={components?.Image}
    >
      <DirectionProvider dir={dir}>{body}</DirectionProvider>
    </NextProvider>
  );
}
