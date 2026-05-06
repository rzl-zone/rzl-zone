"use client";

import { useEffect, useState } from "react";

/** ------------------------------------------------------------
 * * ***Tracks active heading(s) based on full viewport visibility (scroll spy).***
 * ------------------------------------------------------------
 *
 * This hook observes a list of element IDs and determines which ones are
 * currently **fully visible** in the viewport using the Intersection Observer API
 * (`threshold: 1`).
 *
 * It maintains an internal ordered list of visible elements and updates
 * the active anchor(s) accordingly.
 *
 * Behavior differs based on `single` mode:
 *
 * - **`single` = `true`**
 *     - Returns only one active ID (first visible).
 *     - When scrolled to the very top → selects the first item in `watch`.
 *     - When scrolled to the bottom → selects the last item in `watch`.
 *     - Uses a more aggressive `rootMargin` to prioritize top alignment.
 *
 * - **`single` = `false`**
 *     - Returns all currently visible IDs (ordered by detection).
 *     - When reaching the bottom → returns remaining items from the current
 *       active position to the end of `watch`.
 *
 * Additional behavior:
 * - A scroll listener is used to handle edge cases (top & bottom of page).
 * - Elements must exist in the DOM and have matching IDs.
 *
 * @param watch - Ordered list of element IDs to observe.
 * @param single - Whether to limit the result to a single active anchor.
 *
 * @returns Array of active anchor IDs:
 * - Single mode → array with max length of 1
 * - Multi mode → array of visible IDs
 *
 * @remarks
 * - Uses `IntersectionObserver` with `threshold: 1` (fully visible only).
 * - Attaches a global scroll listener for edge detection.
 * - Intended for client-side navigation helpers (e.g., table of contents).
 *
 * @example
 * ```ts
 * const active = useAnchorObserver(["intro", "usage", "api"], true);
 * // => ["usage"]
 * ```
 *
 * @example
 * ```ts
 * const active = useAnchorObserver(headings, false);
 * // => ["intro", "usage"]
 * ```
 */
export function useAnchorObserver(watch: string[], single: boolean): string[] {
  const [activeAnchor, setActiveAnchor] = useState<string[]>([]);

  useEffect(() => {
    let visible: string[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !visible.includes(entry.target.id)) {
            visible = [...visible, entry.target.id];
          } else if (
            !entry.isIntersecting &&
            visible.includes(entry.target.id)
          ) {
            visible = visible.filter((v) => v !== entry.target.id);
          }
        }

        if (visible.length > 0) setActiveAnchor(visible);
      },
      {
        rootMargin: single ? "-80px 0% -70% 0%" : "-20px 0% -40% 0%",
        threshold: 1
      }
    );

    function onScroll(): void {
      const element = document.scrollingElement;
      if (!element) return;
      const top = element.scrollTop;

      if (top <= 0 && single) setActiveAnchor(watch.slice(0, 1));
      else if (top + element.clientHeight >= element.scrollHeight - 6) {
        setActiveAnchor((active) => {
          return active.length > 0 && !single && active[0]
            ? watch.slice(watch.indexOf(active[0]))
            : watch.slice(-1);
        });
      }
    }

    for (const heading of watch) {
      const element = document.getElementById(heading);

      if (element) observer.observe(element);
    }

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [single, watch]);

  return single ? activeAnchor.slice(0, 1) : activeAnchor;
}
