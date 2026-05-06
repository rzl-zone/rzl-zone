"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { useTreeContext } from "fumadocs-ui/contexts/tree";

const footerCache = new Map<string, PageTree.Item[]>();

/** ------------------------------------------------------------
 * * ***Flattens page tree into a linear list for footer navigation.***
 * ------------------------------------------------------------
 *
 * This hook traverses the page tree from `useTreeContext()` and returns
 * a flat (linear) list of all internal page items.
 *
 * The result is cached per `root.$id` to avoid recomputation on
 * subsequent renders.
 *
 * Traversal behavior:
 * - Recursively visits all folders and their children
 * - Includes `index` pages inside folders (if present)
 * - Excludes external pages (`node.external === true`)
 *
 * @returns An array of page items in traversal order,
 * suitable for footer navigation (e.g., previous/next links).
 *
 * @remarks
 * - The result is memoized using a module-level cache (`Map`).
 * - Cache is keyed by `root.$id`, so it assumes the tree is stable per ID.
 * - Does not react to dynamic mutations of the tree after initial caching.
 *
 * @example
 * ```ts
 * const items = useFooterItems();
 *
 * const currentIndex = items.findIndex(i => i.url === currentPath);
 * const prev = items[currentIndex - 1];
 * const next = items[currentIndex + 1];
 * ```
 */
export function useFooterItems(): PageTree.Item[] {
  const { root } = useTreeContext();
  const cached = footerCache.get(root.$id);
  if (cached) return cached;

  const list: PageTree.Item[] = [];
  function onNode(node: PageTree.Node) {
    if (node.type === "folder") {
      if (node.index) onNode(node.index);
      for (const child of node.children) onNode(child);
    } else if (node.type === "page" && !node.external) {
      list.push(node);
    }
  }

  for (const child of root.children) onNode(child);
  footerCache.set(root.$id, list);
  return list;
}
