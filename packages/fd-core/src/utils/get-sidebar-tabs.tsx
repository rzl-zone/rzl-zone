import { type UrlObject } from "url";

import type { ReactNode } from "react";
import type * as PageTree from "fumadocs-core/page-tree";

/** --------------------------------------------------------------------------
 * * ***Represents a single sidebar tab item.***
 * --------------------------------------------------------------------------
 *
 * - ***Used for:***
 *    - Sidebar navigation
 *    - Top-level documentation grouping
 *
 * ---
 *
 * ⚠️ ***Important behavior:***
 * - `url` is treated as the primary redirect target.
 * - `urls` is used for active-state detection.
 *
 * ---
 */
export interface SidebarTab {
  /** --------------------------------------------------------------------------
   * * ***Redirect URL of the folder.***
   * --------------------------------------------------------------------------
   *
   * Usually points to the index page of the folder.
   */
  url: UrlObject | string;

  /** --------------------------------------------------------------------------
   * * ***Optional icon rendered in the sidebar tab.***
   * --------------------------------------------------------------------------
   */
  icon?: ReactNode;

  /** --------------------------------------------------------------------------
   * * ***Display title of the tab.***
   * --------------------------------------------------------------------------
   */
  title: ReactNode;

  /** --------------------------------------------------------------------------
   * * ***Optional description shown in the sidebar.***
   * --------------------------------------------------------------------------
   */
  description?: ReactNode;

  /** --------------------------------------------------------------------------
   * * ***A set of URLs used to detect active state.***
   * --------------------------------------------------------------------------
   *
   * If the current route matches any value in this set,
   * the tab is considered active.
   */
  urls?: Set<string>;

  /** --------------------------------------------------------------------------
   * * ***Marks the tab as unlisted.***
   * --------------------------------------------------------------------------
   *
   * Typically used for fallback or hidden sections.
   */
  unlisted?: boolean;
}

/** --------------------------------------------------------------------------
 * * ***Options for `getSidebarTabs`.***
 * --------------------------------------------------------------------------
 *
 * - ***Customization hook:***
 *    - Allows transforming or filtering sidebar tabs.
 *
 * ---
 *
 * ⚠️ ***Important behavior:***
 * - Returning `null` from `transform` will exclude the tab.
 */
export interface GetSidebarTabsOptions {
  /** --------------------------------------------------------------------------
   * * ***Transform or filter a sidebar tab.***
   * --------------------------------------------------------------------------
   *
   * @param option - Generated sidebar tab option.
   * @param node - Source folder node from the page tree.
   *
   * @returns
   * - A modified {@link SidebarTab | **`SidebarTab`**}.
   * - Or `null` to exclude it.
   */
  transform?: (option: SidebarTab, node: PageTree.Folder) => SidebarTab | null;
}

/** --------------------------------------------------------------------------
 * * ***Default sidebar tab transform.***
 * --------------------------------------------------------------------------
 *
 * Wraps folder icons with responsive styles
 * when an icon is present on the node.
 *
 * @internal
 */
const defaultTransform: GetSidebarTabsOptions["transform"] = (option, node) => {
  if (!node.icon) return option;

  return {
    ...option,
    icon: (
      <div className="size-full [&_svg]:size-full max-md:p-1.5 max-md:rounded-md max-md:border max-md:bg-fd-secondary">
        {node.icon}
      </div>
    )
  };
};

/** --------------------------------------------------------------------------
 * * ***Generate sidebar tabs from a Fumadocs page tree.***
 * --------------------------------------------------------------------------
 *
 * - ***What this does:***
 *    - Scans folder nodes recursively.
 *    - Collects all internal URLs under each folder.
 *    - Generates sidebar tab entries.
 *
 * ---
 *
 * ⚙️ ***Behavior details:***
 * - Uses the first discovered URL as the tab redirect.
 * - Tabs with no URLs are ignored.
 * - `fallback` tree nodes are marked as `unlisted`.
 *
 * ---
 *
 * ⚠️ ***Important:***
 * - External pages are excluded.
 * - Transform function can filter tabs by returning `null`.
 *
 * ---
 *
 * @param tree - Root page tree.
 * @param options - Sidebar generation options.
 *
 * @returns A list of sidebar tabs.
 *
 * @example
 * ```ts
 * const tabs = getSidebarTabs(tree, {
 *   transform(tab) {
 *     if (tab.unlisted) return null;
 *     return tab;
 *   }
 * });
 * ```
 */
export function getSidebarTabs(
  tree: PageTree.Root,
  { transform = defaultTransform }: GetSidebarTabsOptions = {}
): SidebarTab[] {
  const results: SidebarTab[] = [];

  function scanOptions(
    node: PageTree.Root | PageTree.Folder,
    unlisted?: boolean
  ) {
    if ("root" in node && node.root) {
      const urls = getFolderUrls(node);

      if (urls.size > 0) {
        const option: SidebarTab = {
          url: urls.values().next().value ?? "",
          title: node.name,
          icon: node.icon,
          unlisted,
          description: node.description,
          urls
        };

        const mapped = transform ? transform(option, node) : option;
        if (mapped) results.push(mapped);
      }
    }

    for (const child of node.children) {
      if (child.type === "folder") scanOptions(child, unlisted);
    }
  }

  scanOptions(tree);
  if (tree.fallback) scanOptions(tree.fallback, true);

  return results;
}

/** --------------------------------------------------------------------------
 * * ***Recursively collect all internal URLs from a folder node.***
 * --------------------------------------------------------------------------
 *
 * @param folder - Folder node to scan.
 * @param output - Accumulator set for URLs.
 *
 * @returns A set of collected URLs.
 *
 * @internal
 */
function getFolderUrls(
  folder: PageTree.Folder,
  output: Set<string> = new Set()
): Set<string> {
  if (folder.index) output.add(folder.index.url);

  for (const child of folder.children) {
    if (child.type === "page" && !child.external) output.add(child.url);
    if (child.type === "folder") getFolderUrls(child, output);
  }

  return output;
}
