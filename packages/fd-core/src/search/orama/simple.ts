import { type Orama, search, type SearchParams } from "@orama/orama";
import {
  createContentHighlighter,
  type SortedResult
} from "fumadocs-core/search";

import { type SimpleDocument, simpleSchema } from "./create-db";

export async function searchSimple(
  db: Orama<typeof simpleSchema>,
  query: string,
  params: Partial<SearchParams<Orama<typeof simpleSchema>, SimpleDocument>> = {}
): Promise<SortedResult[]> {
  const highlighter = createContentHighlighter(query);
  const result = await search(db, {
    term: query,
    tolerance: 1,
    ...params,
    boost: {
      title: 2,
      ...("boost" in params ? params.boost : undefined)
    }
  });

  return result.hits.map<SortedResult>((hit) => ({
    type: "page",
    content: hit.document.title,
    breadcrumbs: hit.document.breadcrumbs,
    contentWithHighlights: highlighter.highlight(hit.document.title),
    id: hit.document.url,
    url: hit.document.url
  }));
}
