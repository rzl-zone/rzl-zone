import type { UrlObject } from "url";
import type { ReactNode } from "react";

export type CachedDoc = {
  key: string;
  slug: string;
  name: string | null;
  description: string | null;
  versions: string[];
  // latest: string | null;
  githubUrl?: string;
  actualVersionLatest: Record<string, string>;
};

export type CachedJsonLD = {
  "@context": string;
  "@type": string;
  headline: string;
  description: string | undefined;
  url: string;
  image: string;
  publisher: {
    "@type": string;
    name: string;
    url: string;
  };
};

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
