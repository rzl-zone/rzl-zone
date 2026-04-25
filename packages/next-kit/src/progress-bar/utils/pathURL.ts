/** * Convert the url to Absolute URL based on the current window location.
 *
 * @param url {string}
 * @returns {string}
 *
 * @internal
 */
export const toAbsoluteURL = (url: string): string => {
  return new URL(url, window.location.href).href;
};

/** * Check if it is hash anchor or same page anchor
 *
 * @param currentUrl {string} Current Url Location
 * @param newUrl {string} New Url detected with each anchor
 * @returns {boolean}
 *
 * @internal
 */
export const isHashAnchor = (currentUrl: string, newUrl: string): boolean => {
  const current = new URL(toAbsoluteURL(currentUrl));
  const next = new URL(toAbsoluteURL(newUrl));
  return current.href.split("#")[0] === next.href.split("#")[0];
};

/** * Check if it is Same Host name
 *
 * @param currentUrl {string} Current Url Location
 * @param newUrl {string} New Url detected with each anchor
 * @returns {boolean}
 *
 * @internal
 */
export const isSameHostName = (currentUrl: string, newUrl: string): boolean => {
  const current = new URL(toAbsoluteURL(currentUrl));
  const next = new URL(toAbsoluteURL(newUrl));
  return (
    current.hostname.replace(/^www\./, "") ===
    next.hostname.replace(/^www\./, "")
  );
};

/** * Check if the Current Url is same as New Url
 *
 * @param currentUrl {string}
 * @param newUrl {string}
 * @returns {boolean}
 *
 * @internal
 */
export function isAnchorOfCurrentUrl(
  currentUrl: string,
  newUrl: string
): boolean {
  const currentUrlObj = new URL(currentUrl);
  const newUrlObj = new URL(newUrl);
  // Compare hostname, pathname, and search parameters
  if (
    currentUrlObj.hostname === newUrlObj.hostname &&
    currentUrlObj.pathname === newUrlObj.pathname &&
    currentUrlObj.search === newUrlObj.search
  ) {
    // Check if the new URL is just an anchor of the current URL page
    const currentHash = currentUrlObj.hash;
    const newHash = newUrlObj.hash;
    return (
      currentHash !== newHash &&
      currentUrlObj.href.replace(currentHash, "") ===
        newUrlObj.href.replace(newHash, "")
    );
  }
  return false;
}

/** @internal */
export function isSameURL(target: URL, current: URL) {
  const cleanTarget =
    target.protocol + "//" + target.host + target.pathname + target.search;
  const cleanCurrent =
    current.protocol + "//" + current.host + current.pathname + current.search;

  return cleanTarget === cleanCurrent;
}

/** @internal */
export function isSameURLWithoutSearch(target: URL, current: URL) {
  const cleanTarget = target.protocol + "//" + target.host + target.pathname;
  const cleanCurrent =
    current.protocol + "//" + current.host + current.pathname;

  return cleanTarget === cleanCurrent;
}
