import { isNull } from "@/predicates/is/isNull";
import { isArray } from "@/predicates/is/isArray";
import { isString } from "@/predicates/is/isString";
import { isInteger } from "@/predicates/is/isInteger";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import { normalizePathname } from "./normalizePathname";

type GetPrefixPathnameOptions = {
  /** The number of levels to include in the prefix (default is `1`).
   *
   * - For example, with `levels = 2`, the function will return the first two parts of the URL.
   *
   * @default 1
   */
  levels?: number;
  /** Whether to remove duplicates from the result if multiple URLs are passed (default is `true`).
   *
   * @default true
   */
  removeDuplicates?: boolean;
};

/** --------------------------------------------------------
 * * ***Utility: `getPrefixPathname`.***
 * --------------------------------------------------------
 * **Get Prefix from URL with Optional Base or Auto-detection (Supports String or Array of URLs).**
 * - **This function extracts the prefix from one or more URLs. It can either:**
 *    - Use a provided `base` string or an array of strings to check and return the matching prefix.
 *    - Automatically detect the prefix if no `base` is provided by analyzing the first part of the URL.
 * - **The function is flexible and can handle both scenarios:**
 *    1. **When the base is provided as a single string or an array of strings**:
 *        - The function will check if the URL starts with one of the provided base(s) and return the matching base.
 *    2. **When the base is not provided**:
 *        - The function will automatically detect the prefix by splitting the URL or using a regex.
 * - **Important Notes**:
 *    - If a base (or an array of bases) is provided, the URL must start with one of the given base(s).
 *    - If no base is provided, the function will attempt to detect the prefix automatically.
 *    - The `url` parameter can be either a string or an array of strings.
 *    - Supports deduplication of results (enabled by default).
 *    - Automatically returns a single string if only one unique result exists after processing.
 * @param {string|string[]} url
 *  ***The full URL(s) from which the prefix should be extracted, can be a `string` or an `array of strings`.***
 * @param {string|string[]|null} [base=null]
 *  ***The base URL(s) (e.g., `"/settings"`), behavior:***
 *    - It can be a `string`, an `array of strings`, or `null`.
 *    - If `provided`, it will be used to check the URL(s).
 *    - If `not provided`, the prefix will be auto-detected.
 * @param {GetPrefixPathnameOptions} [options]
 *  ***Additional options object:***
 *    - `levels` (default `1`): The number of segments to include when auto-detecting the prefix (e.g. `/foo/bar` for `levels: 2`).
 *    - `removeDuplicates` (default `true`): Whether to remove duplicate prefixes from the final array result.
 * @returns {string|string[]|null}
 *  ***Returns one of:***
 *    - A single string if only one unique prefix/base is found.
 *    - An array of strings if multiple different prefixes/bases are found.
 *    - `null` if no matching base is found when using `base`.
 * @throws **{@link TypeError | `TypeError`}**
 *  ***if:***
 *    - `url` is `not a string` or `not an array of strings`.
 *    - `base` is `not a string`, `array of strings`, or `null`.
 *    - `options` is `not an object`.
 *    - `levels` is `not a number`.
 *    - `removeDuplicates` is `not a boolean`.
 * @example
 * - #### ✅ **Correct Usage (With an Array of URLs and Base):**
 * ```ts
 *    const routes = [
 *      "/settings/profile",
 *      "/settings/password",
 *      "/settings/other-path",
 *      "/other-path/xyz",
 *    ];
 *
 *    // With base provided as a string
 *    routes.forEach(route => {
 *      console.log(getPrefixPathname(route, '/settings'));
 *      // ➔ "/settings"
 *    });
 *
 *    // With base provided as an array
 *    routes.forEach(route => {
 *      console.log(getPrefixPathname(route, ['/settings', '/admin']));
 *      // ➔ "/settings" or "/admin" depending on the current URL.
 *    });
 * ```
 * - #### ✅ **Correct Usage (With Single URL and Single Base):**
 * ```ts
 *    const result = getPrefixPathname("/settings/profile", "/settings");
 *    console.log(result); // ➔ "/settings"
 * ```
 * - #### ✅ **Correct Usage (With Multiple URLs and Single Base):**
 * ```ts
 *    const result = getPrefixPathname(
 *      ["/settings/profile", "/settings/password"],
 *      "/settings"
 *    );
 *    console.log(result); // ➔ "/settings"
 *
 *    const result2 = getPrefixPathname(
 *      ["/settings/profile", "/other/password"],
 *      "/other"
 *    );
 *    console.log(result2); // ➔ "/other"
 * ```
 * - #### ✅ **Correct Usage (With Multiple URLs and Multiple Bases)**
 * ```ts
 *    const result = getPrefixPathname(
 *      ["/settings/profile", "/admin/password"],
 *      ["/settings", "/admin"]
 *    );
 *    console.log(result); // ➔ ["/settings", "/admin"]
 * ```
 * - #### ✅ **Auto-detection of Prefix**
 * ```ts
 *    const result = getPrefixPathname("/settings/profile");
 *    console.log(result); // ➔ "/settings"
 *
 *    const result2 = getPrefixPathname(
 *      "/settings/profile/info",
 *      null,
 *      { levels: 2 }
 *    );
 *    console.log(result2); // ➔ "/settings/profile"
 * ```
 * - #### ✅ **Multiple URLs with Auto-detection**
 * ```ts
 *    const result = getPrefixPathname(["/admin/profile", "/settings/password"]);
 *    console.log(result); // ➔ ["/admin", "/settings"]
 * ```
 * - #### ✅ **Handling Duplicates**
 * ```ts
 *    const result = getPrefixPathname(
 *      ["/settings/profile", "/settings/password"],
 *      "/settings"
 *    );
 *    console.log(result); // ➔ "/settings" (deduped to single string)
 *
 *    const result2 = getPrefixPathname(
 *      ["/settings/profile", "/settings/profile"],
 *      "/settings",
 *      { removeDuplicates: false }
 *    );
 *    console.log(result2); // ➔ ["/settings", "/settings"]
 * ```
 * - #### ❌ **Incorrect Usage (URL Does Not Match Base)**
 * ```ts
 *    const result = getPrefixPathname("/other-path/profile", "/settings");
 *    console.log(result); // ➔ null
 * ```
 */
export const getPrefixPathname = (
  url: string | string[],
  base: string | string[] | null = null,
  options: GetPrefixPathnameOptions = {}
): string | string[] | null => {
  const errors: string[] = [];

  if (!isString(url) && !isArray(url)) {
    errors.push(
      `First parameter (\`url\`) must be of type \`string\` or \`array-string\`, but received: \`${getPreciseType(
        url
      )}\`.`
    );
  }
  if (!isString(base) && !isArray(base) && !isNull(base)) {
    errors.push(
      `Second parameter (\`base\`) must be of type \`string\`, \`array-string\` or \`null\`, but received: \`${getPreciseType(
        base
      )}\`.`
    );
  }
  if (!isPlainObject(options)) {
    errors.push(
      `Second parameter (\`options\`) must be of type \`plain-object\`, but received: \`${getPreciseType(
        options
      )}\`.`
    );
  }

  const { levels = 1, removeDuplicates = true } = options;

  if (!isInteger(levels) || (isInteger(levels) && levels < 0)) {
    errors.push(
      `Parameter \`levels\` property of the \`options\` (second parameter) must be of type \`integer-number\` and minimum is \`0\`, but received: \`${getPreciseType(
        levels
      )}\`, with value: \`${safeStableStringify(levels, {
        keepUndefined: true
      })}\`.`
    );
  }
  if (!isBoolean(removeDuplicates)) {
    errors.push(
      `Parameter \`removeDuplicates\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: \`${getPreciseType(
        removeDuplicates
      )}\`.`
    );
  }
  if (isNonEmptyArray(errors)) {
    throw new TypeError(
      `Invalid parameter(s) in \`getPrefixPathname\` function:\n- ${errors.join("\n- ")}`
    );
  }

  // Helper function to process a single URL
  function getLevel(singleUrl: string) {
    // If no base is provided, detect the base automatically
    const parts = normalizePathname(singleUrl).split("/").filter(Boolean); // Split URL into parts

    // Return the first `levels` parts as the prefix
    return `/${parts.slice(0, levels).join("/")}`;
  }

  // Helper function to process a single URL
  function processUrl(singleUrl: string): string | null {
    // If a base is provided, check if URL starts with one of the bases
    if (base) {
      singleUrl = normalizePathname(singleUrl);

      if (isArray(base)) {
        // Check if the URL starts with any of the base values in the array
        for (const b of base) {
          if (singleUrl.startsWith(normalizePathname(b))) {
            // return normalizePathname(b); // Return the matching base if URL starts with it
            return getLevel(singleUrl);
          }
        }
      } else if (
        isNonEmptyString(base) &&
        singleUrl.startsWith(normalizePathname(base))
      ) {
        // If base is a single string, check if URL starts with it
        // return normalizePathname(base); // Return the base if URL starts with it
        return getLevel(singleUrl);
      }
      return null; // Return null if the URL does not match any base
    }

    return getLevel(singleUrl);
  }

  // If url is an array, process each URL and return an array of results
  if (isArray(url)) {
    const result = url.map(processUrl).filter((r): r is string => !isNull(r));

    // Remove duplicates if required
    const uniqueResult = removeDuplicates ? [...new Set(result)] : result;

    // If all results are the same, return just the first one
    if (uniqueResult.length === 1) {
      return uniqueResult[0];
    }

    return uniqueResult;
  }

  // If url is a single string, process it and return the result
  return processUrl(url);
};
