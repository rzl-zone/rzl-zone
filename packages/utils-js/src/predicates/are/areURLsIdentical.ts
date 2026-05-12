import { isURL } from "../is/isURL";

/** ---------------------------------
 * * ***Predicate: `areURLsIdentical`.***
 * ---------------------------------
 * **Checks if two URLs are exactly the same, including protocol, host, pathname, and query parameters.**
 * @param {URL} urlA - The first URL to compare.
 * @param {URL} urlB - The second URL to compare.
 * @returns {boolean} Returns `true` if both URLs are identical, otherwise `false`.
 * @example
 * // Identical URLs -> true
 * areURLsIdentical(
 *   new URL("https://example.com/page?a=1"),
 *   new URL("https://example.com/page?a=1")
 * );
 * // ➔ true
 *
 * // Same path, different query parameter -> false
 * areURLsIdentical(
 *   new URL("https://example.com/page?a=1"),
 *   new URL("https://example.com/page?b=2")
 * );
 * // ➔ false
 *
 * // Same host & query, but different protocol -> false
 * areURLsIdentical(
 *   new URL("http://example.com/page?a=1"),
 *   new URL("https://example.com/page?a=1")
 * );
 * // ➔ false
 *
 * // Same everything except trailing slash -> false
 * areURLsIdentical(
 *   new URL("https://example.com/page"),
 *   new URL("https://example.com/page/")
 * );
 * // ➔ false
 */
export const areURLsIdentical = (urlA: URL, urlB: URL): boolean => {
  if (!isURL(urlA) || !isURL(urlB)) {
    throw new TypeError(
      "Parameters `urlA` and `urlB` (first and second parameter) must be instance of URL."
    );
  }

  return (
    urlA.protocol + "//" + urlA.host + urlA.pathname + urlA.search ===
    urlB.protocol + "//" + urlB.host + urlB.pathname + urlB.search
  );
};
