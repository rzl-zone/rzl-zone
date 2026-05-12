import { isNonEmptyString } from "./isNonEmptyString";

/** ---------------------------------------------------------
 * * ***Predicate: `isValidURL`.***
 * ---------------------------------------------------------
 * **Validates whether a given string is a properly formatted URL.**
 * - **Ensures that the input is:**
 *    - A non-empty string.
 *    - A valid **[`URL`](https://developer.mozilla.org/docs/Web/API/URL)** with `http://` or `https://` scheme.
 * - **Behavior:**
 *    - ✅ Includes decoding for percent-encoded URLs (e.g., `https%3A%2F%2F...`).
 *    - ❌ Rejects invalid strings, unsupported schemes, and malformed domains.
 * @param {*} url - The value to validate.
 * @returns {boolean} Return `true` if the value is a **valid URL string**, otherwise `false`.
 * @example
 * isValidURL("https://example.com");
 * // ➔ true
 * isValidURL("ftp://example.com");
 * // ➔ false
 * isValidURL("not-a-url");
 * // ➔ false
 */
export const isValidURL = (url: unknown): boolean => {
  if (!isNonEmptyString(url)) return false;

  // Attempt to decode the entire URL, including domain and query parameters
  let decodedUrl: string;

  try {
    // Decode the URL (to handle cases like https%3A%2F%2F becoming https://)
    decodedUrl = decodeURIComponent(url);
  } catch {
    // If decoding fails, return false as it indicates an invalid encoded URL
    return false;
  }

  // Check if the decoded URL starts with http:// or https://
  if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
    return false;
  }

  // the original more extra
  const urlPattern = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^https?:\/\/(?:localhost(?::\d+)?(?:[\/?#][^\s]*)?|(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}(?::\d+)?(?:[\/?#][^\s]*)?)$/

    //! DEPRECATED
    // /^https?:\/\/(?:localhost(?::\d+)?(?:[/?#][^\s]*)?|(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})(?:[/?#][^\s]*)?$/
    // /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/
  );

  // Test the decoded URL against the regex pattern
  return urlPattern.test(decodedUrl);
};
