"use client";

import type { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { RzlNextAppProgressBar } from "@rzl-zone/next-kit/progress-bar/app";

import { Toaster } from "@/components/ui/sonner";

import { RootFdBaseProvider } from "./fumadocs/base";

import { MainRzlFumadocsProvider } from "@/context/main-rzl-fumadocs";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { source } from "@/lib/source";
import RootProvider from "./fumadocs/root-provider";

export function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <MainRzlFumadocsProvider defaultPrefetch={"onHover"}>
      <AnimatePresence mode="wait">
        <RootFdBaseProvider search={{ enabled: false }}>
          <TreeContextProvider tree={source.getPageTree()}>
            <RootProvider>
              <RzlNextAppProgressBar showForHashAnchor={false} />
              {children}
              <Toaster
                position="top-center"
                closeButton
                visibleToasts={5}
                gap={14}
                mobileOffset={{ top: 24 }}
                swipeDirections={["left", "right"]}
                containerAriaLabel="Rzl Toaster"
              />
            </RootProvider>
          </TreeContextProvider>
        </RootFdBaseProvider>
      </AnimatePresence>
    </MainRzlFumadocsProvider>
  );
}
