import "./global.css";

import type { Metadata } from "next";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { env } from "@/utils/env";
import { getCachedJsonLD } from "@/utils/fumadocs";

import JsonLD from "@/components/seo/JsonLD";
import { GlobalProvider } from "@/providers/GlobalProvider";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"]
  // weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
  // weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: {
    default: env.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`
  },
  metadataBase:
    env.NEXT_PUBLIC_APP_ENV !== "production"
      ? env.NEXT_PUBLIC_BASE_URL_LOCAL
      : env.NEXT_PUBLIC_BASE_URL
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
