import { isURL } from "../is/isURL";

/** ---------------------------------
 * * ***Predicate: `areURLsEqualPath`.***
 * ---------------------------------
 * **Checks if two URLs are the same, ignoring query parameters, this function compares only the protocol, host, and pathname.**
 * @param {URL} urlA - The first URL to compare.
 * @param {URL} urlB - The second URL to compare.
 * @returns {boolean} Returns `true` if both URLs are the same (ignoring search parameters), otherwise `false`.
 * @example
 * // Same domain, same path, different query -> true
 * areURLsEqualPath(
 *   new URL("https://example.com/page?a=1"),
 *   new URL("https://example.com/page?b=2")
 * );
 * // ➔ true
 *
 * // Same domain, different path -> false
 * areURLsEqualPath(
 *   new URL("https://example.com/page1"),
 *   new URL("https://example.com/page2")
 * );
 * // ➔ false
 *
 * // Different protocol -> false
 * areURLsEqualPath(
 *   new URL("http://example.com/page"),
 *   new URL("https://example.com/page")
 * );
 * // ➔ false
 *
 * // Same protocol, same host, same path (ignores query & hash) -> true
 * areURLsEqualPath(
 *   new URL("https://example.com/page#section"),
 *   new URL("https://example.com/page")
 * );
 * // ➔ true
 */
export const areURLsEqualPath = (urlA: URL, urlB: URL): boolean => {
  if (!isURL(urlA) || !isURL(urlB)) {
    throw new TypeError(
      "Parameters `urlA` and `urlB` (first and second parameter) must be instance of URL."
    );
  }

  return (
    urlA.protocol + "//" + urlA.host + urlA.pathname ===
    urlB.protocol + "//" + urlB.host + urlB.pathname
  );
};
