import { type HighlightedText } from "fumadocs-core/search";
import {
  normalizeContentAndQuery,
  levenshtein
} from "./normalize-content-query";

/** --------------------------------------------------------------------------
 * * ***Highlight fuzzy-matched words inside a text content.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Normalizes content and query for consistent matching.
 *    - Supports **multi-word queries**.
 *    - Performs both **exact** and **fuzzy (Levenshtein)** matching.
 *    - Highlights matched ranges while preserving original text.
 *
 * ---
 *
 * ⚙️ ***Matching behavior:***
 * - Exact matches are detected first.
 * - Fuzzy matches are detected using edit distance (`levenshtein`).
 * - Overlapping matches are merged automatically.
 *
 * ---
 *
 * ✂️ ***Context trimming:***
 * - Long content is trimmed around matches.
 * - Balanced context is added before and after highlights.
 * - Ellipsis (`...`) is inserted between separated ranges.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Returns the **entire content unmodified** if no match is found.
 * - Matching is **case-insensitive** after normalization.
 * - Designed for search previews, not full-text rendering.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Search result previews
 *    - Fuzzy highlighting in documentation
 *    - Text snippets with contextual emphasis
 *
 * @template Content - Original content string type.
 *
 * @param content - Original text content.
 * @param query - Search query string.
 * @param threshold - Maximum allowed Levenshtein distance, default `1`.
 *
 * @param contextWindow - Total amount of characters shown around highlights, default `150`.
 *
 * @returns
 * An array of {@link HighlightedText | **`HighlightedText`**} segments with highlight metadata.
 *
 * @example
 * ```ts
 * highlightMatch(
 *   "Node.js is a JavaScript runtime built on V8",
 *   "javascrpt"
 * );
 * ```
 *
 * @example
 * ```ts
 * highlightMatch(
 *   longContent,
 *   "react suspense",
 *   1,
 *   200
 * );
 * ```
 */
export function highlightMatch<Content extends string = string>(
  content: Content,
  query: string,
  threshold = 1,
  // amount of character around highlight (before and after)
  contextWindow = 150
): HighlightedText<Content>[] {
  const normalizedContent = normalizeContentAndQuery(content);
  const normalizedQuery = normalizeContentAndQuery(query);

  if (!normalizedQuery || !normalizedContent) {
    return [{ type: "text", content, styles: { highlight: false } }];
  }

  const queryParts = normalizedQuery.split(/\s+/).filter(Boolean);
  if (queryParts.length === 0) {
    return [{ type: "text", content, styles: { highlight: false } }];
  }

  let normalized = "";
  const indexMap: number[] = [];
  for (let i = 0; i < content.length; i++) {
    const ch = content[i]!;
    const n = normalizeContentAndQuery(ch);
    if (n) {
      normalized += n;
      indexMap.push(i);
    }
  }

  const matchRanges: [number, number][] = [];

  for (const q of queryParts) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");

    for (const m of normalized.matchAll(regex)) {
      const start = m.index ?? 0;
      const end = start + q.length - 1;
      const origStart = indexMap[start] ?? 0;
      const origEnd = indexMap[end] ?? origStart;
      matchRanges.push([origStart, origEnd]);
    }

    const words = normalized.split(/\s+/).filter(Boolean);
    for (const word of words) {
      if (levenshtein(word, q) <= threshold) {
        const fuzzyRegex = new RegExp(
          word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi"
        );
        for (const m of normalized.matchAll(fuzzyRegex)) {
          const start = m.index ?? 0;
          const end = start + word.length - 1;
          const origStart = indexMap[start] ?? 0;
          const origEnd = indexMap[end] ?? origStart;
          matchRanges.push([origStart, origEnd]);
        }
      }
    }
  }

  if (matchRanges.length === 0) {
    return [{ type: "text", content, styles: { highlight: false } }];
  }

  matchRanges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const range of matchRanges) {
    const last = merged[merged.length - 1];
    if (!last || range[0] > last[1] + 1) merged.push(range);
    else last[1] = Math.max(last[1], range[1]);
  }

  // add context (window) around highlight, but with few offset to avoid to midly
  const contextRanges: [number, number][] = merged.map(([start, end]) => {
    const extraBefore = Math.floor(contextWindow * 0.4);
    const extraAfter = Math.floor(contextWindow * 0.6);
    return [
      Math.max(0, start - extraBefore),
      Math.min(content.length - 1, end + extraAfter)
    ];
  });

  // add more if context is overlap
  const finalRanges: [number, number][] = [];
  for (const range of contextRanges) {
    const last = finalRanges[finalRanges.length - 1];
    if (!last || range[0] > last[1] + 1) finalRanges.push(range);
    else last[1] = Math.max(last[1], range[1]);
  }

  const result: HighlightedText<Content>[] = [];
  let isFirst = true;

  for (const [start, end] of finalRanges) {
    if (!isFirst) {
      result.push({
        type: "text",
        content: " ... " as Content,
        styles: { highlight: false }
      });
    }

    if (isFirst && start > 0) {
      result.push({
        type: "text",
        content: "... " as Content,
        styles: { highlight: false }
      });
    }

    let lastEnd = start;

    for (const [hStart, hEnd] of merged) {
      if (hEnd < start || hStart > end) continue;
      const realStart = Math.max(hStart, start);
      const realEnd = Math.min(hEnd, end);
      if (realStart > lastEnd) {
        result.push({
          type: "text",
          content: content.slice(lastEnd, realStart) as Content,
          styles: { highlight: false }
        });
      }
      result.push({
        type: "text",
        content: content.slice(realStart, realEnd + 1) as Content,
        styles: { highlight: true }
      });
      lastEnd = realEnd + 1;
    }

    if (lastEnd <= end) {
      result.push({
        type: "text",
        content: content.slice(lastEnd, end + 1) as Content,
        styles: { highlight: false }
      });
    }

    if (end < content.length - 1) {
      result.push({
        type: "text",
        content: " ..." as Content,
        styles: { highlight: false }
      });
    }

    isFirst = false;
  }

  return result;
}
