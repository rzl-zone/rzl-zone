import { isDevEnv } from "@rzl-zone/core/env/node";
import { type SortedResult } from "fumadocs-core/search";
import type { ClientSearchParams, OramaClient } from "@oramacloud/client";

import {
  cleanSpecialAttributeMdx,
  highlightMatch,
  isFuzzyMatch,
  removeUndefined
} from "@/utils";
import { type OramaIndex } from "@/search/orama/cloud";
import type { SearchClient } from "@/hooks/use-docs-search";

interface CrawlerIndex {
  path: string;
  title: string;
  content: string;
  section: string;
  category: string;
  breadcrumbs: string[] | undefined;
}

export interface OramaCloudLegacyOptions {
  client: OramaClient;
  /**
   * The type of your index.
   *
   * You can set it to `crawler` if you use crawler instead of the JSON index with schema provided by Fumadocs
   */
  index?: "default" | "crawler";

  /**
   * Note: not included into dependency list.
   */
  params?: ClientSearchParams;

  /**
   * Filter results with specific tag.
   */
  tag?: string;

  /**
   * Filter by locale (unsupported at the moment)
   */
  locale?: string;
}

export function oramaCloudLegacyClient(
  options: OramaCloudLegacyOptions
): SearchClient {
  const { index = "default", client, params: extraParams = {}, tag } = options;

  return {
    deps: [index, client, tag],
    async search(query) {
      try {
        const list: SortedResult[] = [];

        if (index === "crawler") {
          const result = await client.search({
            ...extraParams,
            term: query,
            where: {
              category: tag
                ? {
                    eq: tag.slice(0, 1).toUpperCase() + tag.slice(1)
                  }
                : undefined,
              ...extraParams.where
            },
            limit: 10
          });
          if (!result) return list;

          for (const hit of result.hits) {
            const doc = hit.document as unknown as CrawlerIndex;

            list.push(
              {
                id: hit.id,
                type: "page",
                content: cleanSpecialAttributeMdx(doc.title),
                contentWithHighlights: highlightMatch(
                  cleanSpecialAttributeMdx(doc.title),
                  query
                ),
                url: doc.path
              },
              {
                id: "page" + hit.id,
                type: "text",
                content: cleanSpecialAttributeMdx(doc.content),
                contentWithHighlights: highlightMatch(
                  cleanSpecialAttributeMdx(doc.content),
                  query
                ),
                url: doc.path
              }
            );
          }

          return list;
        }

        const params: ClientSearchParams = {
          ...extraParams,
          offset: 0,

          term: query,
          where: removeUndefined({
            tag,
            ...extraParams.where
          }),

          groupBy: {
            properties: ["page_id"],
            maxResult: 5,
            ...extraParams.groupBy
          }
        };

        let result: Awaited<ReturnType<typeof client.search>> | null = null;

        result = await client.search(params);

        if (!result || !result.groups) return list;

        for (const item of result.groups) {
          let addedHead = false;

          for (const hit of item.result) {
            const doc = hit.document as unknown as OramaIndex;

            if (
              !isFuzzyMatch(doc.title, query) &&
              !isFuzzyMatch(doc.description, query) &&
              !isFuzzyMatch(doc.content, query)
            ) {
              continue;
            }

            if (!addedHead) {
              const contentWithHighlightsTitle = highlightMatch(
                cleanSpecialAttributeMdx(doc.title),
                query
              );
              const contentWithHighlightsDecs = highlightMatch(
                cleanSpecialAttributeMdx(doc.description),
                query,
                2
              );

              list.push({
                id: doc.page_id,
                type: "page",
                content: cleanSpecialAttributeMdx(doc.title),
                description: cleanSpecialAttributeMdx(doc.description),
                breadcrumbs: doc.breadcrumbs,
                contentWithHighlights: contentWithHighlightsTitle,
                descriptionWithHighlights: contentWithHighlightsDecs,
                url: doc.url
              });
              addedHead = true;
            }

            const contentWithHighlightsContent = highlightMatch(
              cleanSpecialAttributeMdx(doc.content),
              query
            );

            // true if there is a highlighted part in the content
            const hasHighlight = contentWithHighlightsContent.some(
              (seg) => seg.styles?.highlight === true
            );

            if (hasHighlight) {
              list.push({
                id: doc.id,
                content: cleanSpecialAttributeMdx(doc.content),
                contentWithHighlights: contentWithHighlightsContent,
                type: doc.content === doc.section ? "heading" : "text",
                url: doc.section_id ? `${doc.url}#${doc.section_id}` : doc.url
              });
            }
          }
        }

        return list;
      } catch (err) {
        if (isDevEnv()) {
          console.error(err);
        }

        throw new Error("Search failed, please try again");
      }
    }
  };
}

export async function oramaCloudLegacyClient2(
  query: string,
  options: OramaCloudLegacyOptions
): Promise<SortedResult[]> {
  try {
    const list: SortedResult[] = [];
    const {
      index = "default",
      client,
      params: extraParams = {},
      tag
    } = options;

    if (index === "crawler") {
      const result = await client.search({
        ...extraParams,
        term: query,
        where: {
          category: tag
            ? {
                eq: tag.slice(0, 1).toUpperCase() + tag.slice(1)
              }
            : undefined,
          ...extraParams.where
        },
        limit: 10
      });
      if (!result) return list;

      for (const hit of result.hits) {
        const doc = hit.document as unknown as CrawlerIndex;

        list.push(
          {
            id: hit.id,
            type: "page",
            content: cleanSpecialAttributeMdx(doc.title),
            contentWithHighlights: highlightMatch(
              cleanSpecialAttributeMdx(doc.title),
              query
            ),
            url: doc.path
          },
          {
            id: "page" + hit.id,
            type: "text",
            content: cleanSpecialAttributeMdx(doc.content),
            contentWithHighlights: highlightMatch(
              cleanSpecialAttributeMdx(doc.content),
              query
            ),
            url: doc.path
          }
        );
      }

      return list;
    }

    const params: ClientSearchParams = {
      ...extraParams,
      offset: 0,

      term: query,
      where: removeUndefined({
        tag,
        ...extraParams.where
      }),

      groupBy: {
        properties: ["page_id"],
        maxResult: 5,
        ...extraParams.groupBy
      }
    };

    let result: Awaited<ReturnType<typeof client.search>> | null = null;

    result = await client.search(params);

    if (!result || !result.groups) return list;

    for (const item of result.groups) {
      let addedHead = false;

      for (const hit of item.result) {
        const doc = hit.document as unknown as OramaIndex;

        if (
          !isFuzzyMatch(doc.title, query) &&
          !isFuzzyMatch(doc.description, query) &&
          !isFuzzyMatch(doc.content, query)
        ) {
          continue;
        }

        if (!addedHead) {
          const contentWithHighlightsTitle = highlightMatch(
            cleanSpecialAttributeMdx(doc.title),
            query
          );
          const contentWithHighlightsDecs = highlightMatch(
            cleanSpecialAttributeMdx(doc.description),
            query,
            2
          );

          list.push({
            id: doc.page_id,
            type: "page",
            content: cleanSpecialAttributeMdx(doc.title),
            description: cleanSpecialAttributeMdx(doc.description),
            breadcrumbs: doc.breadcrumbs,
            contentWithHighlights: contentWithHighlightsTitle,
            descriptionWithHighlights: contentWithHighlightsDecs,
            url: doc.url
          });
          addedHead = true;
        }

        const contentWithHighlightsContent = highlightMatch(
          cleanSpecialAttributeMdx(doc.content),
          query
        );

        // true if there is a highlighted part in the content
        const hasHighlight = contentWithHighlightsContent.some(
          (seg) => seg.styles?.highlight === true
        );

        if (hasHighlight) {
          list.push({
            id: doc.id,
            content: cleanSpecialAttributeMdx(doc.content),
            contentWithHighlights: contentWithHighlightsContent,
            type: doc.content === doc.section ? "heading" : "text",
            url: doc.section_id ? `${doc.url}#${doc.section_id}` : doc.url
          });
        }
      }
    }

    return list;
  } catch (err) {
    if (isDevEnv()) {
      console.error(err);
    }

    throw new Error("Search failed, please try again");
  }
}
