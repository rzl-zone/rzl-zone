import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage
} from "ai";
import { z } from "zod";
import { Document, type DocumentData } from "flexsearch";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { source } from "@/lib/source";
import { NextResponse } from "next/server";
import { INTERNAL_CODE } from "@/constants/code";

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

const normalizeUrl = (url: string) => {
  if (url.startsWith("http")) {
    const u = new URL(url);
    return u.pathname;
  }

  return url;
  // // kalau sudah absolute → replace domain
  // if (url.startsWith("http")) {
  //   return url.replace(/^https?:\/\/[^/]+/, BASE_URL);
  // }

  // // kalau relative → gabung
  // return `${BASE_URL.replace(/\/$/, "")}${url}`;
};
const searchServer = createSearchServer();

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: "url",
      index: ["title", "description", "content"],
      store: true
    }
  });

  const docs = await chunkedAll(
    source.getPages()?.map(async (page) => {
      if (!("getText" in page.data)) return null;

      return {
        title: page.data.title,
        description: page.data.description,
        url: normalizeUrl(page.url),
        content: await page.data?.getText?.("raw")
      } as CustomDocument;
    })
  );

  for (const doc of docs) {
    if (doc) search.add(doc);
  }

  return search;
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
  const SIZE = 50;
  const out: O[] = [];
  for (let i = 0; i < promises.length; i += SIZE) {
    out.push(...(await Promise.all(promises.slice(i, i + SIZE))));
  }
  return out;
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

// const systemPrompt = [
//   "You are an AI assistant for a documentation site.",
//   "Use the `search` tool to retrieve relevant docs context before answering when needed.",
//   "The `search` tool returns raw JSON results from documentation. Use those results to ground your answer and cite sources as markdown links using the document `url` field when available.",
//   "If you cannot find the answer in search results, say you do not know and suggest a better search query."
// ].join("\n");

const systemPrompt = [
  "You are a documentation assistant.",
  "You are an AI assistant for a documentation site.",
  "First, call the `search` tool to get relevant documentation.",
  "Then, answer the user's question using ONLY the search results.",
  "The `search` tool returns raw JSON results from documentation. Use those results to ground your answer and cite sources as markdown links using the document `url` field when available.",
  "If you cannot find the answer in search results, say you do not know and suggest a better search query.",
  "If no relevant information is found, say: 'Sorry i only know about Rzl Zone Documentation.'",
  "Always include the URL from the documentation in your answer.",
  "When including links, use markdown format like [title](/path) without domain, because is internal link right?.",
  "Use the URLs exactly as provided in the search results."
].join("\n");

type ErrorResStream = {
  error?: {
    cause?: string;
    url?: string;
    requestBodyValues?: Record<string, unknown>;
    statusCode?: number;
    responseHeaders?: Record<string, unknown>;
    responseBody?: string;
    isRetryAble?: boolean;
    data?: Record<string, unknown>;
  };
};

export async function POST(req: Request) {
  try {
    const reqJson: { messages?: UIMessage[] } = await req.json();

    const result = streamText({
      model: openrouter.chat(
        // process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet"
        process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini"
      ),
      maxOutputTokens: 16,
      stopWhen: stepCountIs(5),
      tools: {
        search: searchTool
      },
      messages: [
        { role: "system", content: systemPrompt },
        ...(await convertToModelMessages(reqJson.messages ?? []))
      ],
      onError: (res) => {
        const err = res.error as ErrorResStream["error"];
        const msg = err?.responseBody;

        if (msg?.includes("This request requires more credits")) {
          return;
        }

        console.error(res);
      },
      toolChoice: "auto"
    });

    const res = result.toUIMessageStreamResponse({
      onError: (error) => {
        const err = error as ErrorResStream["error"];
        const msg = err?.responseBody;

        // console.debug({ msg });

        if (msg?.includes("This request requires more credits")) {
          return `Something when wrong, code:"${INTERNAL_CODE.ERROR.AI.SEARCH.ERROR.CREDIT_API.code}"`;
        }
        if (
          msg?.includes("User not found") ||
          msg?.includes("Missing Authentication header")
        ) {
          return `Something when wrong, code:"${INTERNAL_CODE.ERROR.AI.SEARCH.ERROR.USER_NOT_FOUND.code}"`;
        }

        return msg || "Something when wrong!";
      }
    });

    return res;
  } catch {
    return NextResponse.json(
      { message: "Something when wrong!" },
      { status: 500 }
    );
  }
}

const searchTool = tool({
  description: "Search the docs content and return raw JSON results.",
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10)
  }),
  async execute({ query, limit }) {
    const search = await searchServer;

    const results = await search.searchAsync(query, {
      limit,
      merge: true,
      enrich: true
    });

    return results ?? [];
  }
});

export type SearchTool = typeof searchTool;
