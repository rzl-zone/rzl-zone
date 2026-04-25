"use client";

import { lazy, type ReactNode } from "react";

import { RootProvider as BaseRootProvider } from "fumadocs-ui/provider/base";

const CustomSearchDialog = lazy(() => import("@/components/search"));

const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BaseRootProvider
      search={{
        SearchDialog: CustomSearchDialog
      }}
      theme={{ enabled: false }}
    >
      {children}
    </BaseRootProvider>
  );
};

export default RootProvider;
