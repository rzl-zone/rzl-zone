import "./global.css";

import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { isDevEnv } from "@rzl-zone/next-kit/utils";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { GlobalProvider } from "@/providers/GlobalProvider";

import { APP_CONFIG } from "@/constants/app";
import JsonLD from "@/components/seo/JsonLD";
import { getCachedJsonLD } from "@/utils/fumadocs";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"]
  //   // weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
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
  metadataBase: isDevEnv()
    ? isNonEmptyString(APP_CONFIG.URL.BASE_URL_APP_LOCAL)
      ? new URL(APP_CONFIG.URL.BASE_URL_APP_LOCAL)
      : undefined
    : isNonEmptyString(APP_CONFIG.URL.BASE_URL_APP)
      ? new URL(APP_CONFIG.URL.BASE_URL_APP)
      : undefined
};

export default async function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* <meta
          name="google-site-verification"
          content="YJ8bVTEZALFb4zNMeFeiNpZ2JU5IULIroCbUSr4_11M"
        /> */}
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
