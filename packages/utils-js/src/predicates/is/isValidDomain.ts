import { punycodeUtilsJS } from "@/urls/utils/punyCode";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import sldMap from "./_private/data/domain/sldMap.json";
import ccTldMap from "./_private/data/domain/ccTldMap.json";

import { isString } from "./isString";
import { isBoolean } from "./isBoolean";

import { getPreciseType } from "../type/getPreciseType";

/** ---------------------------------------------------------
 * * ***Options for `isValidDomain` predicate.***
 * ---------------------------------------------------------
 * **Customize the behavior of domain validation.**
 */
type IsValidDomainOptions = {
  /** * ***Enable conversion of Unicode domains (IDN) to ASCII (punycode).***
   *
   * - Example: `"пример.рф"` ➔ `"xn--e1afmkfd.xn--p1ai"`
   * - Allows validating Unicode domains correctly.
   * - Default: `false`
   *
   * @defaultValue `false`.
   */
  allowUnicode?: boolean;

  /** * ***If `true`, validates **only top-level domains (TLDs)** that are not part of any SLD/second-level domain.***
   *
   * - Accepts country-code TLDs like `"ai"` or `"ai."` ✅
   * - Rejects common TLDs that are part of SLDs like `"com"` ❌
   * - Only the final label is checked; subdomains are ignored.
   * - Default: `false`
   *
   * @defaultValue `false`.
   */
  topLevel?: boolean;

  /** * ***Allow or disallow subdomains.***
   *
   * - Example: `"sub.example.com"` ✅ if `subdomain` is `true`, ❌ if `false`
   * - Wildcards and SLDs are considered when evaluating subdomains.
   * - Default: `true`
   *
   * @defaultValue `true`.
   */
  subdomain?: boolean;

  /** * ***Allow a wildcard `*` in the left-most label.***
   *
   * - Example: `"*.example.com"` ✅ if `wildcard` is `true`, ❌ if `false`
   * - Wildcards are only valid in the first label and require at least one additional label.
   * - Default: `false`
   *
   * @defaultValue `false`.
   */
  wildcard?: boolean;

  /** * ***Allow a port after the domain.***
   *
   * - Example: `"localhost:3000"` or `"example.com:8080"` ✅ if `allowPort` is `true`
   * - Validates that the port is a number between `1` and `65535`.
   * - Does not affect domain validation rules otherwise.
   * - Default: `false`
   *
   * @defaultValue `false`.
   */
  allowPort?: boolean;

  /** * ***Allow special domains like `localhost`.***
   *
   * - Example: `"localhost"` ✅ if `allowLocalhost` is `true`
   * - Works with or without a port if `allowPort` is enabled.
   * - Default: `false`
   *
   * @defaultValue `false`.
   */
  allowLocalhost?: boolean;

  /** * ***Allow URLs with protocol (`http`/`https`) and automatically extract the hostname.***
   *
   * - Example: `"https://example.com/foo/bar"` ➔ `"example.com"`
   * - The function will validate only the hostname part and ignore the path, query, and fragment.
   * - Default: `false`
   *
   * @defaultValue `false`.
   */
  allowProtocol?: boolean;
};

/** ---------------------------------------------------------
 * * ***Predicate: `isValidDomain`.***
 * ---------------------------------------------------------
 * **Validates whether a given string is a properly formatted domain name.**
 *
 * - **Supports options for:**
 *    - `allowUnicode` ➔ allows internationalized domain names (IDN) with Unicode characters.
 *    - `topLevel` ➔ validates **only top-level domains (TLDs)**; ignores subdomains and SLDs.
 *    - `subdomain` ➔ allows or disallows subdomains.
 *    - `wildcard` ➔ allows wildcard (`*`) in the left-most label.
 *    - `allowPort` ➔ allows a port number after the domain (e.g., `example.com:8080`).
 *    - `allowLocalhost` ➔ allows the special domain `"localhost"`.
 *    - `allowProtocol` ➔ allows a URL with protocol (`http`/`https`) and extracts the hostname.
 *
 * - **Behavior:**
 *    - ✅ Converts Unicode to ASCII (punycode) if `allowUnicode` is `true`.
 *    - ✅ Checks label lengths (≤63 chars), valid characters, and punycode consistency.
 *    - ✅ Validates port if `allowPort` is `true` (must be 1–65535).
 *    - ✅ Accepts `"localhost"` if `allowLocalhost` is `true`.
 *    - ✅ Extracts hostname from URLs if `allowProtocol` is `true`.
 *    - ❌ Rejects invalid domains, labels starting/ending with `-`, double dots, malformed TLDs, or invalid port numbers.
 *    - ✅ Handles both standard domains (example.com), URLs with protocols (https://example.com/foo), and IDNs (пример.рф).
 *
 * @param {*} value - The value to validate; only strings are valid domains.
 * @param {IsValidDomainOptions} [options] - Optional configuration for domain validation.
 * @param {boolean} [options.allowUnicode=false] - Enable punycode conversion for Unicode domains.
 * @param {boolean} [options.topLevel=false] - Validate only TLDs (e.g., `ai`, `uk.`); ignores SLDs like `com`.
 * @param {boolean} [options.subdomain=true] - Allow subdomains; set `false` to reject any subdomain.
 * @param {boolean} [options.wildcard=false] - Allow wildcard `*` in the left-most label (e.g., `*.example.com`).
 * @param {boolean} [options.allowPort=false] - Allow port number after domain (e.g., `:3000`); must be 1–65535.
 * @param {boolean} [options.allowLocalhost=false] - Allow special domain `"localhost"`.
 * @param {boolean} [options.allowProtocol=false] - Allow URLs with protocol (`http`/`https`) and extract hostname only.
 * @returns {boolean} Returns `true` if the value is a valid domain according to the rules and options; otherwise `false`.
 *
 * @example
 * isValidDomain("google.com");
 * // ➔ true
 * isValidDomain("пример.рф", { allowUnicode: true });
 * // ➔ true
 * isValidDomain("sub.example.com", { subdomain: false });
 * // ➔ false
 * isValidDomain("*.example.com", { wildcard: true });
 * // ➔ true
 * isValidDomain("com", { topLevel: true });
 * // ➔ false (common TLD rejected because it's part of SLD)
 * isValidDomain("ai.", { topLevel: true });
 * // ➔ true (country-code TLD accepted)
 * isValidDomain("localhost", { allowLocalhost: true });
 * // ➔ true
 * isValidDomain("localhost:3000", { allowLocalhost: true, allowPort: true });
 * // ➔ true
 * isValidDomain("example.com:8080", { allowPort: true });
 * // ➔ true
 * isValidDomain("https://example.com/foo/bar", { allowProtocol: true });
 * // ➔ true (protocol stripped and hostname validated)
 * isValidDomain("invalid_domain.com");
 * // ➔ false
 */
export function isValidDomain(
  value: unknown,
  options: IsValidDomainOptions = {}
): boolean {
  if (!isString(value)) return false;

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const {
    subdomain = true,
    topLevel = false,
    wildcard = false,
    allowUnicode = false,
    allowPort = false,
    allowLocalhost = false,
    allowProtocol = false
  } = options;

  // Validate Options:
  const invalid = Object.entries({
    subdomain,
    topLevel,
    wildcard,
    allowUnicode,
    allowProtocol,
    allowPort,
    allowLocalhost
  }).filter(([, value]) => !isBoolean(value));

  if (invalid.length) {
    const msg = invalid
      .map(
        ([key, value], i) =>
          `   ${i + 1}. option: "${key}"\n` +
          "      expected: boolean\n" +
          `      received: ${getPreciseType(value)} (${safeStableStringify(
            value,
            {
              keepUndefined: true
            }
          )})`
      )
      .join("\n");

    throw new TypeError(
      `\n> Invalid options detected in second parameter of \`isValidDomain\`:\n${msg}`
    );
  }
  // -----------------

  let _value = value.toLowerCase();

  if (allowProtocol) {
    try {
      const url = new URL(value); // use original input
      if (url.protocol !== "http:" && url.protocol !== "https:") return false; // reject non-http(s)
      if (!allowPort && url.port) return false; // reject port if allowPort=false
      _value = url.hostname.toLowerCase(); // extract only hostname

      // wildcard check
      const labels = _value.split(".");
      if (labels[0] === "*" && !wildcard) return false;
    } catch {
      // if parsing fails, leave _value unchanged
    }
  }

  if (value.endsWith(".")) {
    _value = _value.slice(0, _value.length - 1);
  }

  // Handle port
  let port: string;
  if (allowPort) {
    const portMatch = _value.match(/:(\d{1,5})$/);
    if (portMatch) {
      port = portMatch[0];
      _value = _value.slice(0, -port.length);
      const portNum = Number(portMatch[1]);
      if (portNum < 1 || portNum > 65535) return false;
    }
  }

  // Allow localhost
  if (allowLocalhost && _value === "localhost") return true;

  if (allowUnicode) {
    try {
      _value = punycodeUtilsJS.toASCII(_value);
    } catch {
      return false;
    }
  }

  if (_value.length > 253) return false;

  const validChars = /^([\u0E00-\u0E7Fa-z0-9-._*]+)$/g;
  if (!validChars.test(_value)) return false;

  if (topLevel) {
    if (ccTldMap[_value.replace(/\.$/, "") as keyof typeof ccTldMap]) {
      return true;
    }
  }

  const sldRegex = /(.*)\.(([\u0E00-\u0E7Fa-z0-9]+)(\.[a-z0-9]+))/;
  const matches = _value.match(sldRegex);
  // eslint-disable-next-line no-useless-assignment
  let tld: string | null = null;
  let labels: string[] | null = null;

  if (matches && matches.length > 2) {
    if (sldMap[matches[2] as keyof typeof sldMap]) {
      // eslint-disable-next-line no-useless-assignment
      tld = matches[2] || null;
      labels = matches[1]?.split(".") || null;
    }
  }

  if (!labels) {
    labels = _value.split(".");
    if (labels.length <= 1) return false;

    tld = labels.pop()!;
    const tldRegex = /^(?:xn--)?(?!^\d+$)[\u0E00-\u0E7Fa-z0-9]+$/gi;
    if (!tldRegex.test(tld)) return false;
  }

  if (subdomain === false && labels.length > 1) return false;

  return labels.every((label, index) => {
    if (wildcard && index === 0 && label === "*" && labels.length > 1) {
      return true;
    }

    let validLabelChars = /^([\u0E00-\u0E7Fa-zA-Z0-9-_]+)$/g;
    if (index === labels.length - 1) {
      validLabelChars = /^([\u0E00-\u0E7Fa-zA-Z0-9-]+)$/g;
    }

    const doubleDashCount = (label.match(/--(--)?/g) || []).length;
    const xnDashCount = (label.match(/xn--/g) || []).length;
    if (index === labels.length - 1 && doubleDashCount !== xnDashCount) {
      return false;
    }

    return (
      validLabelChars.test(label) &&
      label.length < 64 &&
      !label.startsWith("-") &&
      !label.endsWith("-")
    );
  });
}
