import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { isDate } from "@rzl-zone/utils-js/predicates";
import { SeparatorSection } from "@rzl-zone/docs-ui/components/separator";

import { env } from "@/utils/env";
import { generatePageData } from "@/utils/meta-data";
import { getPackageData } from "@/utils/packages/docs";
import { pageMdxDataToClient } from "@/utils/fumadocs";

import { getPageImage, source } from "@/lib/source";

import {
  DocsAction,
  DocsHeader,
  DocsBody,
  DocsPage,
  PageFooter,
  PageLastUpdate
} from "@/layouts/notebook/page";

import { getMDXComponents } from "@/components/mdx/mdx";
import FooterPage from "@/components/footer/footer-page";

import { PageDocsClient } from "./page.client";

export const revalidate = false;
export const dynamic = "force-static";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const dataPackage = getPackageData(page.slugs[0]);

  const { body: MdxComponent, toc: dataToc, lastModified } = page.data;

  const { pageData } = generatePageData(page.data);

  return (
    <>
      <PageDocsClient
        pageMdxData={pageMdxDataToClient({
          ...page.data,
          docsUnderConstruction: params.slug?.includes("utils-js")
            ? "UtilsJS"
            : params.slug?.includes("build-tools")
              ? "Build Tools"
              : undefined
        })}
        githubUrlRepo={dataPackage?.githubUrl}
      >
        <DocsPage
          breadcrumb={{
            includeRoot: true,
            includeSeparator: false,
            includePage: true
          }}
          toc={dataToc}
          full={page.data.full || dataToc.length == 1}
          footer={{
            component: (
              <PageFooter
                className="pb-0 gap-2 [&>a]:py-2 [&>a]:gap-0.5"
                topComponent={
                  <>
                    <SeparatorSection className="mt-2 mb-2" />
                    <div className="flex justify-between mb-2">
                      <PageLastUpdate
                        date={
                          isDate(lastModified)
                            ? lastModified
                            : page.data.lastUpdateData
                        }
                      />
                    </div>
                  </>
                }
                bottomComponent={<FooterPage />}
              />
            )
          }}
        >
          <DocsHeader
            titlePage={pageData.title}
            descriptionPage={pageData.description}
          />

          <>
            <DocsAction
              isMainRootPage={page.data.isMainRootPage}
              pageUrl={page.url}
              pagePath={page.path}
            />

            <DocsBody>
              <MdxComponent
                components={getMDXComponents({
                  a: createRelativeLink(source, page)
                })}
              />
            </DocsBody>
          </>
        </DocsPage>
      </PageDocsClient>
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
  const params = await props.params;

  const page = source.getPage(params.slug);
  if (!page) notFound();

  const { metaSeoData } = generatePageData(page.data);

  return {
    title: metaSeoData.title,
    alternates: {
      canonical: page.url,
      languages: { en: page.url, "x-default": page.url }
    },
    description: metaSeoData.description,
    openGraph: {
      images: {
        width: 1200,
        height: 630,
        url: getPageImage(page).url,
        alt: `${metaSeoData.title} | ${env.NEXT_PUBLIC_APP_NAME}`
      },
      url: page.url,
      siteName: env.NEXT_PUBLIC_APP_NAME,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      site: "@rzlzone",
      creator: "@rzlzone"
    },
    robots: {
      // googleBot: { follow: true, index: true },
      index: true,
      follow: true
    }
  };
}
