"use client";

import React, { useEffect, useTransition } from "react";

import { useEffectEvent } from "@rzl-zone/core-react/hooks";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import {
  useMainRzlFumadocs,
  type PageMdxDataType
} from "@/context/main-rzl-fumadocs";
import { usePathname } from "next/navigation";

export const PageDocsClient = ({
  pageMdxData,
  githubUrlRepo,
  children
}: React.PropsWithChildren<{
  pageMdxData: PageMdxDataType;
  githubUrlRepo?: string | null;
}>) => {
  let { pageMdx, github } = useMainRzlFumadocs();

  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const onNavigate = useEffectEvent((pageMdxData: PageMdxDataType) => {
    startTransition(() => {
      pageMdx.setPageMdxData(pageMdxData);

      if (isNonEmptyString(githubUrlRepo)) {
        github.setGithubUrl(githubUrlRepo);
      } else {
        github.setGithubUrl(undefined);
      }
    });
  });

  useEffect(() => {
    onNavigate(pageMdxData);
  }, [pathname]);

  return children;
};
