import type { NextConfig } from "next";

import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const typeOutput: NextConfig["output"] = undefined;
const isExportOutput = typeOutput === "export";

const config: NextConfig = {
  output: typeOutput,
  reactStrictMode: true,
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "twoslash",
    "shiki",
    "@workspace/fd-shiki",
    "@workspace/fd-core",
    "@takumi-rs/image-response"
  ],
  // experimental: {
  //   staleTimes: {
  //     static: 3600 * 24
  //   }
  // },
  // staticPageGenerationTimeout: 3600 * 24,
  poweredByHeader: false,
  allowedDevOrigins: [
    "192.168.1.*",
    "rzlzone.com",
    "rzlzone.pages.dev",
    "rzlzone.vercel.app"
  ],

  ...(!isExportOutput
    ? {
        async headers() {
          return [
            // 🔒 Security (HSTS)
            {
              source: "/:path*",
              headers: [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload"
                }
              ]
            },

            // 🧊 Cache – Favicon
            {
              source: "/favicon.ico",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable"
                }
              ]
            },

            // 🧊 Cache – Static Orama Logo
            {
              source: "/static/orama-logo.svg",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable"
                }
              ]
            }

            // 📚 Cache Page Docs (Balanced)
            // {
            //   source: "/docs/:path*",
            //   headers: [
            //     {
            //       key: "Cache-Control",
            //       value: "public, max-age=180, stale-while-revalidate=300"
            //     }
            //   ]
            // }
          ];
        },
        async redirects() {
          return [
            // 🔁 Redirect Home ➔ /docs
            {
              source: "/",
              destination: "/docs",
              permanent: false
            }
          ];
        },
        async rewrites() {
          return [
            // 🔂 Rewrite MDX pages
            {
              source: "/docs/:path*.mdx",
              destination: "/llms.mdx/docs/:path*"
            }
          ];
        }
      }
    : {}),

  // htmlLimitedBots: /.*/,

  // Remote Images
  images: {
    unoptimized: isExportOutput,
    remotePatterns: [
      {
        pathname: "/**",
        protocol: "https",
        hostname: "img.shields.io"
      }
    ]
  }
};

export default withMDX(config);
