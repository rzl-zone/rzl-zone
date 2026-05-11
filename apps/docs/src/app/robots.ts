import type { MetadataRoute } from "next";
import { constructURL } from "@rzl-zone/utils-js/urls";

import { getBaseUrlByEnvironment } from "@/utils/env";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = getBaseUrlByEnvironment();

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
