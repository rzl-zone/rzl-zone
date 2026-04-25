/** -------------------------------------------------------------------
 * * ***Safely resolves a string or `URL` input into a valid `URL` instance,
 * returning `null` when resolution fails.***
 * --------------------------------------------------------------------
 *
 * This helper attempts to construct a `URL` object from a potentially
 * unsafe or optional input.
 *
 * It gracefully handles invalid URLs and environment differences
 * between browser and server runtimes.
 *
 * - **Behavior:**
 *      - Returns `null` when `href` is `undefined` or empty
 *      - Returns the original value when `href` is already a `URL` instance
 *      - Resolves relative URLs using `window.location.origin` in the browser
 *      - Falls back to `"http://localhost"` as the base in non-browser environments
 *      - Returns `null` if URL construction throws
 *
 * This is useful when working with user-provided links or optional
 * navigation targets where safety is required.
 *
 * @param href - A URL represented as a string, a `URL` instance,
 * or `undefined`.
 *
 * @returns A valid `URL` instance when resolution succeeds,
 * otherwise `null`.
 *
 * @example
 * ```ts
 * getSafeUrl("/dashboard");
 * // => URL { href: "http://localhost/dashboard" }
 *
 * getSafeUrl("https://example.com");
 * // => URL { href: "https://example.com/" }
 *
 * getSafeUrl("::::");
 * // => null
 * ```
 */
export const getSafeUrl = (href: string | URL | undefined): URL | null => {
  if (!href) return null;

  try {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost";
    return href instanceof URL ? href : new URL(href, base);
  } catch {
    return null;
  }
};
