import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { env } from "@/utils/env";
import type { PageSchemaType } from "@/configs/source/schema";

export const generatePageData = (data: PageSchemaType) => {
  const metaData = {
    title: data.metaSeoData?.title || data.title || env.NEXT_PUBLIC_APP_NAME,
    description: data.metaSeoData?.description || data.description
  };

  const namePkg = isNonEmptyString(data.packageMeta.name)
    ? `${data.packageMeta.name}`
    : undefined;
  const versionPkg =
    isNonEmptyString(data.packageMeta.version) &&
    data.packageMeta.version !== "latest"
      ? `${data.packageMeta.version}`
      : undefined;

  const title = isNonEmptyString(namePkg)
    ? `${metaData.title} - ${namePkg}${
        isNonEmptyString(versionPkg) ? ` (${versionPkg})` : ""
      }`
    : metaData.title;

  return {
    metaSeoData: {
      pureMetaData: metaData,
      title,
      description: metaData.description
    },
    packageMeta: {
      name: namePkg,
      version: versionPkg,
      tag: data.packageMeta.tag,
      keywords: data.packageMeta.keywords
    },
    pageData: {
      ...data.pageData
    }
  };
};
