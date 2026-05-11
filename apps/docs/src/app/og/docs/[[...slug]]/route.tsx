/* eslint-disable @next/next/no-img-element */
import { NextResponse } from "next/server";
import { ImageResponse } from "@takumi-rs/image-response";

import { env } from "@/utils/env";
import { generatePageData } from "@/utils/meta-data";

import { RzlLogoDataUri } from "@/images/rzl-logo";
import { getPageImage, source } from "@/lib/source";
import { SOURCE_CONFIG } from "@/configs/source/package";

export const revalidate = false;
export const dynamic = "force-static";

function OgLayout({
  orgName,
  disableOrgName,
  title,
  description
}: {
  orgName?: string;
  disableOrgName?: boolean;
  title: string;
  description: string | undefined;
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#000000",
        color: "white",
        padding: "60px",
        fontFamily: "sans-serif"
      }}
    >
      {/* background image */}
      <img
        src={RzlLogoDataUri}
        alt="Rzl Logo"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: 0.9
        }}
      />

      {/* gradient overlay */}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to top, rgb(0,0,0,0.85), rgba(0, 0, 0, 0.2))"
        }}
      />

      {/* Org Name */}
      {!disableOrgName || (orgName && orgName.trim().length) ? (
        <div
          tw="font-bold text-orange-600 underline uppercase"
          style={{
            fontSize: 45,
            fontWeight: 900,
            // outline
            textShadow: `
                8px 8px 12px rgba(0,0,0,1),
                -8px -8px 12px rgba(0,0,0,1),
                8px -8px 12px rgba(0,0,0,1),
                -8px 8px 12px rgba(0,0,0,1),
                0 0 16px rgba(11, 39, 64, 0.8),
                0 0 30px rgba(7, 21, 32, 0.6)
              `
          }}
        >
          {orgName ?? env.NEXT_PUBLIC_APP_NAME}
        </div>
      ) : null}

      {/* title text */}
      <div
        tw={disableOrgName ? "text-orange-600" : "text-slate-100"}
        style={{
          fontSize: 60,
          fontWeight: 700,
          textAlign: "center",
          // outline
          textShadow: `
                2px 2px 8px rgba(0,0,0,1),
                -2px -2px 8px rgba(0,0,0,1),
                2px -2px 8px rgba(0,0,0,1),
                -2px 2px 8px rgba(0,0,0,1),
                0 0 12px rgba(7, 50, 90, 0.8),
                0 0 24px rgba(2, 28, 49, 0.6)
              `
        }}
      >
        {title}
      </div>

      {/* description text */}
      <div
        style={{
          fontSize: 30,
          marginTop: 25,
          color: "#cdc7c7",
          textAlign: "center",
          textShadow: `
                1.5px 1.5px 6px rgba(0,0,0,1),
                -1.5px -1.5px 6px rgba(0,0,0,1),
                1.5px -1.5px 6px rgba(0,0,0,1),
                -1.5px 1.5px 6px rgba(0,0,0,1),
                0 0 12px rgba(7, 43, 58, 0.8),
                0 0 24px rgba(1, 10, 14, 0.6)
              `
        }}
      >
        {description}
      </div>
    </div>
  );
}

const _notFoundResponse = () => {
  return new ImageResponse(
    <OgLayout
      title="Page Not Found"
      description="The documentation page you're looking for doesn't exist or may have been moved."
    />,
    {
      width: 1200,
      height: 630,
      format: "webp"
    }
  );
};

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments
  }));
}

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[[...slug]]">
) {
  const { slug } = await params;

  if (
    !Array.isArray(slug) ||
    slug.at(-1) !== SOURCE_CONFIG.LOADER.OG.IMAGE_NAME
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const cleanSlug = slug.slice(0, -1);
  const page = source.getPage(cleanSlug);

  if (!page) return new NextResponse("Not Found", { status: 404 });

  const { metaSeoData } = generatePageData(page.data);

  return new ImageResponse(
    <OgLayout
      title={metaSeoData.title}
      disableOrgName={page.url === SOURCE_CONFIG.LOADER.BASE_URL}
      description={metaSeoData.description}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp"
    }
  );
}
