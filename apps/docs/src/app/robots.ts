import type { MetadataRoute } from "next";
import { isDevEnv } from "@rzl-zone/next-kit/utils";
import { constructURL } from "@rzl-zone/utils-js/urls";

import { env } from "@/utils/env";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = isDevEnv()
    ? env.NEXT_PUBLIC_BASE_URL_LOCAL
    : env.NEXT_PUBLIC_BASE_URL;

  const host = constructURL(baseUrl).toString().replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },

    host,
    sitemap: host + "/sitemap.xml" //"https://acme.com/sitemap.xml"
  };
}
