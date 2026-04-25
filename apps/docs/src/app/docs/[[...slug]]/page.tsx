import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { isDate, isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { gitConfig } from "@/lib/layout.shared";
import { getPageImage, source } from "@/lib/source";

import {
  DividerDocsHeader,
  DocsBody,
  DocsHeader,
  DocsPage,
  MarkdownCopyButton,
  PageFooter,
  PageLastUpdate,
  ViewOptionsPopover
} from "@/layouts/notebook/page";

import { env } from "@/utils/env";
import { generatePageData } from "@/utils/meta-data";
import { getPackageData } from "@/utils/packages/docs";
import { pageMdxDataToClient } from "@/utils/fumadocs";

import { getMDXComponents } from "@/components/mdx/mdx";
import FooterPage from "@/components/footer/footer-page";

import { PageDocsClient } from "./page.client";
import { SharePopover } from "@/components/ai/page-actions";
import { SeparatorSection } from "@rzl-zone/docs-ui/components/separator";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const dataPackage = getPackageData(page.slugs[0]);

  const dataToc = page.data.toc;
  const MdxComponent = page.data.body;

  if (!dataToc.some((item) => item.url === "#page-top")) {
    dataToc.unshift({ depth: 1, url: "#page-top", title: "Page Top" });
  }

  const { pageData } = generatePageData(page.data);

  return (
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
        toc={dataToc}
        full={page.data.full || dataToc.length == 1}
        footer={{
          component: (
            <PageFooter
              className="pb-0 gap-2 [&>a]:py-2 [&>a]:gap-0.5"
              bottomComponent={<FooterPage />}
            />
          )
        }}
      >
        <DocsHeader
          titlePage={pageData.title}
          descriptionPage={pageData.description}
        />

        {isNonEmptyString(pageData.title) &&
          isNonEmptyString(pageData.description) && (
            <>
              <div className="flex flex-row gap-2 items-center -my-2">
                <MarkdownCopyButton markdownUrl={`${page.url}.mdx`} />
                <ViewOptionsPopover
                  markdownUrl={`${page.url}.mdx`}
                  githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
                />

                <div className="ml-auto">
                  <SharePopover />
                </div>
              </div>

              <DividerDocsHeader className="opacity-75" />
            </>
          )}

        <DocsBody>
          <MdxComponent
            components={getMDXComponents({
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(source, page)
            })}
          />
        </DocsBody>

        <SeparatorSection className="my-0" />
        <div className="flex justify-between">
          <PageLastUpdate
            date={
              isDate(page.data.lastModified)
                ? page.data.lastModified
                : page.data.lastUpdateData
            }
          />
        </div>
      </DocsPage>
    </PageDocsClient>
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
      index: true,
      follow: true,
      googleBot: { follow: true, index: true }
    }
  };
}
