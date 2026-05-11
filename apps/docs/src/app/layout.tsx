import "./global.css";

import type { Metadata } from "next";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { APP_CONFIG } from "@/constants/app";
import { getCachedJsonLD } from "@/utils/fumadocs";

import JsonLD from "@/components/seo/JsonLD";
import { GlobalProvider } from "@/providers/GlobalProvider";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"]
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.APP_NAME,
    template: `%s | ${APP_CONFIG.APP_NAME}`
  },
  metadataBase: APP_CONFIG.URL.BASE_URL_APP_BY_ENVIRONMENT
};

export default async function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="google-site-verification"
          content="YJ8bVTEZALFb4zNMeFeiNpZ2JU5IULIroCbUSr4_11M"
        />
        <JsonLD jsonLdData={await getCachedJsonLD()} />
      </head>
      <body className="flex flex-col min-h-screen rzl-primary">
        <div
          id="page-top"
          aria-hidden="true"
        />
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
