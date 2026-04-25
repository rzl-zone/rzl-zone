"use client";

import { usePathname } from "next/navigation";
import { isArray, isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import type { CachedJsonLD } from "@/utils/fumadocs/types";

const JsonLD = ({ jsonLdData }: { jsonLdData?: CachedJsonLD[] }) => {
  const pathname = usePathname();

  if (!isArray(jsonLdData)) return null;

  const jsonLd = jsonLdData.find((item) => {
    const url = isNonEmptyString(item.url)
      ? new URL(item.url, "http://localhost")
      : undefined;
    return url?.pathname.endsWith(pathname);
  });

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

export default JsonLD;
