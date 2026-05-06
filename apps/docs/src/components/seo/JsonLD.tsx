"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { isArray, isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import type { CachedJsonLD } from "@/utils/fumadocs/types";

const JsonLD = ({ jsonLdData }: { jsonLdData?: CachedJsonLD[] }) => {
  const pathname = usePathname();

  if (!isArray(jsonLdData)) return null;

  // const jsonLd = jsonLdData.find((item) => {
  //   const url = isNonEmptyString(item.url)
  //     ? new URL(item.url, "http://localhost")
  //     : undefined;
  //   return url?.pathname.endsWith(pathname);
  // });

  const map = new Map(
    jsonLdData.map((item) => {
      if (!isNonEmptyString(item.url)) return [null, null];
      const url = new URL(item.url, "http://localhost");
      return [url.pathname, item];
    })
  );

  const jsonLd = map.get(pathname);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")
      }}
    />
  );
};

export default React.memo(JsonLD);
