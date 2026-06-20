import type { ReactNode } from "react";
import type { Framework } from "fumadocs-core/framework";
import { TranslationProvider } from "@fuma-translate/react";

import { NextProvider } from "fumadocs-core/framework/next";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";

import { RzlThemeAppProvider } from "@rzl-zone/next-kit/themes/app";
import { RzlNextAppProgressBar } from "@rzl-zone/next-kit/progress-bar/app";

import { source } from "@/lib/source";
import { translations } from "@/translations";
import { MainRzlFumadocsProvider } from "@/context/main-rzl-fumadocs";

import { Toaster } from "@/components/ui/sonner";
import { CustomNextLink } from "@/components/link";

import { FdRootProvider } from "./fumadocs/fd-root-provider";

export function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <MainRzlFumadocsProvider defaultPrefetch={"onHover"}>
      <NextProvider Link={CustomNextLink as Framework["Link"]}>
        <TreeContextProvider tree={source.getPageTree()}>
          <TranslationProvider translations={translations}>
            <FdRootProvider>
              <RzlThemeAppProvider
                attribute={"class"}
                defaultTheme="system"
                metaColorSchemeValue={{
                  light: "#fafafa",
                  dark: "#0569ff26"
                }}
              >
                {children}
                <RzlNextAppProgressBar showForHashAnchor={false} />
                <Toaster
                  position="top-center"
                  closeButton
                  visibleToasts={5}
                  gap={14}
                  mobileOffset={{ top: 24 }}
                  swipeDirections={["left", "right"]}
                  containerAriaLabel="Rzl Toaster"
                />
              </RzlThemeAppProvider>
            </FdRootProvider>
          </TranslationProvider>
        </TreeContextProvider>
      </NextProvider>
    </MainRzlFumadocsProvider>
  );
}
