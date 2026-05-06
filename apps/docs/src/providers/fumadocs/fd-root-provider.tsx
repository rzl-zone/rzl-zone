"use client";

import { type ReactNode } from "react";

import dynamic from "next/dynamic";
import { RootProvider as BaseRootProvider } from "fumadocs-ui/provider/base";

// import SearchDialog from "fumadocs-ui/components/dialog/search-default";
// import SearchDialog from "@/components/search";

const SearchDialog = dynamic(() => import("@/components/search"), {
  ssr: false,
  loading: () => null
});

export const FdRootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BaseRootProvider
      search={{ SearchDialog }}
      theme={{ enabled: false }}
    >
      {children}
    </BaseRootProvider>
  );
};
