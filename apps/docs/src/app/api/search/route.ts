import { NextRequest, NextResponse } from "next/server";
import { flexsearchFromSource } from "fumadocs-core/search/flexsearch";

import { source } from "@/lib/source";
import { cleanSpecialAttributeMdx } from "../../../../../../packages/fd-core/src/utils/clean-special-attr";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);

  const rawQuery = url.searchParams.get("query");

  if (typeof rawQuery !== "string") {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: {
        "content-type": "application/json"
      }
    });
  }

  if (rawQuery.trim() === "") {
    return NextResponse.json([{ meta: {} }]);
  }

  const limitedQuery = rawQuery.slice(0, 200);

  const query = normalizeQuery(limitedQuery);

  url.searchParams.set("query", query);

  return base.GET(new Request(url, req));
};

const base = flexsearchFromSource(source, {
  buildIndex(page) {
    const structured = page.data.structuredData;

    return {
      title: cleanSpecialAttributeMdx(page.data.title).trim(),
      description: cleanSpecialAttributeMdx(page.data.description).trim(),
      url: page.url,
      id: page.url,
      structuredData: {
        headings: structured.headings.map((h) => ({
          ...h,
          content: cleanSpecialAttributeMdx(h.content).trim()
        })),
        contents: structured.contents.map((c) => ({
          ...c,
          heading: cleanSpecialAttributeMdx(c.heading).trim(),
          content: cleanSpecialAttributeMdx(c.content).trim()
        }))
      },
      tag: page.data.packageMeta?.tag ?? undefined
    };
  }
});

function normalizeQuery(query: string) {
  return decodeURIComponentSafe(query)
    .replace(/\[!(.*?)\]/g, "$1")
    .replace(/\[#(.*?)\]/g, "$1")
    .replace(/^!+/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeURIComponentSafe(str: string) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
