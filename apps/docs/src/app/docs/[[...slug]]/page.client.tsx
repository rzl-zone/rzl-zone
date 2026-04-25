"use client";

import React, { useEffect } from "react";

import { useEffectEvent } from "@rzl-zone/core-react/hooks";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

import {
  useMainRzlFumadocs,
  type PageMdxDataType
} from "@/context/main-rzl-fumadocs";

export const PageDocsClient = ({
  pageMdxData,
  githubUrlRepo,
  children
}: React.PropsWithChildren<{
  pageMdxData: PageMdxDataType;
  githubUrlRepo?: string | null;
}>) => {
  let { pageMdx, github } = useMainRzlFumadocs();

  const mdxDataString = safeStableStringify(pageMdxData);

  const newDataMdx = React.useMemo(() => pageMdxData, [mdxDataString]);

  const onNavigate = useEffectEvent((pageMdxData: PageMdxDataType) => {
    pageMdx.setPageMdxData(pageMdxData);
    if (isNonEmptyString(githubUrlRepo)) {
      github.setGithubUrl(githubUrlRepo);
    } else {
      github.setGithubUrl(undefined);
    }
  });

  useEffect(() => {
    onNavigate(newDataMdx);
  }, [mdxDataString]);

  return children;
};
