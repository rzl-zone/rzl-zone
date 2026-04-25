declare module "fumadocs-core/search" {
  import { ReactNode } from "react";

  interface SortedResult<Content = string> {
    id: string;
    url: string;
    type: "page" | "heading" | "text" | "page-header";
    content: Content;
    description?: string;
    /**
     * breadcrumbs to be displayed on UI
     */
    breadcrumbs?: Content[];
    contentWithHighlights?: HighlightedText<Content>[];
    descriptionWithHighlights?: HighlightedText<Content>[];
  }
  type ReactSortedResult = SortedResult<ReactNode>;
  interface HighlightedText<Content = string> {
    type: "text";
    content: Content;
    styles?: {
      highlight?: boolean;
    };
  }
  declare function createContentHighlighter(query: string | RegExp): {
    highlight(content: string): HighlightedText[];
  };

  export {
    type HighlightedText,
    type ReactSortedResult,
    type SortedResult,
    createContentHighlighter
  };
}
