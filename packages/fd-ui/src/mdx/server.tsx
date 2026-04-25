import * as path from "node:path";

import type { AnchorHTMLAttributes, FC } from "react";
import type { Prettify } from "@rzl-zone/ts-types-plus";
import type { DocData, DocMethods } from "fumadocs-mdx/runtime/types";
import type { LoaderConfig, LoaderOutput, Page } from "fumadocs-core/source";

import { formatStringOrUrl } from "@rzl-zone/core/url";
import { removeObjectPaths } from "@rzl-zone/utils-js/conversions";

import { FumaNextLink, type FumaNextLinkType } from "@/next-js/link";

import defaultMdxComponents from "@/mdx";
import { type PageMdxDataType } from "@/providers/main-rzl-fumadocs";

type DefaultDataMdx = PageMdxDataType &
  DocData &
  DocMethods & {
    /** @deprecated In older versions of fumadocs, we still included deleteObjectType just in case it was updated again by the official fumadocs. */
    extractedReferences?: Record<string, unknown>;
  };

export function pageMdxDataToClient(data: PageMdxDataType) {
  return removeObjectPaths(data as Prettify<DefaultDataMdx>, [
    { key: "body" },
    { key: "getMDAST" },
    { key: "getText" },
    { key: "info" },
    { key: "_exports" },
    { key: "toc" },
    { key: "structuredData" },
    { key: "extractedReferences" }
  ]) as PageMdxDataType;
}

/** Extend the default Link component to resolve relative file paths in `href`.
 *
 * @param page the current page
 * @param source the source object
 * @param OverrideLink The component to override from, default using **`FumaNextLink`**
 */
export function createRelativeLink<C extends LoaderConfig>(
  source: LoaderOutput<C>,
  page: Page,
  OverrideLink:
    | FC<FumaNextLinkType>
    | FC<AnchorHTMLAttributes<HTMLAnchorElement>> = FumaNextLink
): FC<AnchorHTMLAttributes<HTMLAnchorElement> | FumaNextLinkType> {
  return async function RelativeLink({ href, children, ...props }) {
    href = href ? formatStringOrUrl(href) : "/";
    // resolve relative href
    if (href?.startsWith(".")) {
      const target = source.getPageByHref(href, {
        dir: path.dirname(page.path),
        language: page.locale
      });

      if (target) {
        href = target.hash
          ? `${target.page.url}#${target.hash}`
          : target.page.url;
      }
    }

    return (
      <OverrideLink
        href={href}
        {...props}
      >
        {children}
      </OverrideLink>
    );
  };
}

export { defaultMdxComponents as default };
