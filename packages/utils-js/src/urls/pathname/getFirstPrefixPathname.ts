import { isNil } from "@/predicates/is/isNil";
import { isArray } from "@/predicates/is/isArray";
import { isString } from "@/predicates/is/isString";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";
import { normalizePathname } from "./normalizePathname";

/** --------------------------------------------------------
 * * ***Utility: `getFirstPrefixPathname`.***
 * --------------------------------------------------------
 * **Extract First Valid Prefix from Path Array or String.**
 * - **Main Purpose:**
 *    - This function helps extract the first valid URL prefix from various possible inputs.
 *    - It is especially useful in routing systems, middleware, or frontend apps that need to
 *      decide layout, active navigation, or permissions based on the first segment (or prefix) of a pathname.
 * - **Typical uses include:**
 *    - Determining which layout to render (e.g., `/admin` vs `/dashboard` vs `/`).
 *    - Highlighting the active menu item in a sidebar based on the current URL.
 *    - Enforcing route guards or access controls depending on the URL prefix.
 *    - Parsing multi-level route prefixes and selecting the most relevant one.
 * - **Behavior:**
 *    - It works as follows:
 *        - If `result` is an array of strings, it normalizes each element and returns
 *          the first non-root path (i.e., not just `"/"`).
 *        - If all items normalize to `"/"`,
 *          it returns the `defaultValue` (normalized).
 *        - If `result` is a single string, it normalizes it and returns it if valid,
 *          otherwise falls back to the normalized `defaultValue`.
 *        - If `result` is `null` or `undefined`, it returns the normalized `defaultValue`.
 * - **Validation & Errors:**
 *    - Throws a `TypeError` if:
 *      - `defaultValue` is not a string or empty-string.
 *      - `result` is an array that contains non-string elements.
 *      - `result` is a value that is neither `string`, `string[]`, nor `null`.
 * @example
 * 1. #### For React (*Determining layout*):
 * ```ts
 *   const prefix = getFirstPrefixPathname(
 *      getPrefixPathname(
 *        "/admin/settings",
 *        ["/admin", "/dashboard"]
 *      )
 *   );
 *
 *   if (prefix === "/admin") {
 *     renderAdminLayout();
 *   }
 * ```
 *
 * 2. #### Setting active menu state:
 * ```ts
 *   const activeSection = getFirstPrefixPathname(["", "/dashboard", "/profile"]);
 *   // ➔ "/dashboard"
 * ```
 *
 * 3. #### Providing graceful fallback:
 * ```ts
 *   const section = getFirstPrefixPathname([], "/home");
 *   // ➔ "/home"
 * ```
 * 4. #### ✅ Using with an Array of Pathnames:
 * ```ts
 *   const result = getPrefixPathname(["   ", "/dashboard", "/settings"]);
 *   console.log(getFirstPrefixPathname(result));
 *   // ➔ "/dashboard"
 * ```
 *
 * 5. #### ✅ Using with Single String:
 * ```ts
 *   console.log(getFirstPrefixPathname("/profile/settings"));
 *   // ➔ "/profile/settings"
 *   console.log(getFirstPrefixPathname("   "));
 *   // ➔ "/"
 * ```
 *
 * 6. #### ✅ Fallback to Custom Default:
 * ```ts
 *   console.log(getFirstPrefixPathname(["   ", ""], "/home"));
 *   // ➔ "/home"
 *   console.log(getFirstPrefixPathname(null, "/dashboard"));
 *   // ➔ "/dashboard"
 * ```
 *
 * 7. #### ✅ Throws on Invalid Input:
 * ```ts
 *   getFirstPrefixPathname([1, 2] as any); // ➔ ❌ throws TypeError
 *   getFirstPrefixPathname({} as any);     // ➔ ❌ throws TypeError
 *   getFirstPrefixPathname(null, "   ");   // ➔ ❌ throws TypeError
 * ```
 * @param {string | string[] | null | undefined} result
 *  ***The pathname(s) to process, can be:***
 *    - A string path (e.g. `"/profile"`),
 *    - An array of string paths (e.g. `["   ", "/dashboard"]`),
 *    - Or `null`.
 * @param {string} [defaultValue="/"]
 *  ***A custom default path to use if `result` is null or no valid prefix is found, behavior:***
 *      - Must be a string and non-empty string.
 *      - Defaults to `"/"`.
 * @returns {string}
 *   ***The first valid normalized pathname, or the normalized default.***
 * @throws **{@link TypeError | `TypeError`}** ***if `result` is not a valid type, or `defaultValue` is not a string or empty-string.***
 */
export const getFirstPrefixPathname = (
  result: string | string[] | null | undefined,
  defaultValue: string = "/"
): string => {
  if (!isNonEmptyString(defaultValue)) {
    throw new TypeError(
      `Second parameter (\`defaultValue\`) must be of type \`string\` and not an \`empty-string\`, but received: \`${getPreciseType(
        defaultValue
      )}\`, with value: \`${safeStableStringify(defaultValue, {
        keepUndefined: true
      })}\`.`
    );
  }

  if (isArray(result)) {
    if (!result.every((item) => isString(item))) {
      throw new TypeError(
        `First parameter (\`result\`) must be of type \`string\` or \`array of string\`, but received: \`${getPreciseType(
          result
        )}\`, with value: \`${safeStableStringify(result, {
          keepUndefined: true
        })}\`.`
      );
    }

    for (const item of result) {
      const normalized = normalizePathname(item);
      if (normalized !== "/") {
        return normalized;
      }
    }
    return normalizePathname(defaultValue);
  }

  if (isString(result)) {
    const normalized = normalizePathname(result);
    return normalized !== "/" ? normalized : normalizePathname(defaultValue);
  }

  if (!isNil(result)) {
    throw new TypeError(
      `First parameter (\`result\`) must be of type \`string\`, \`array-string\`, \`null\` or \`undefined\`, but received: \`${getPreciseType(
        result
      )}\`.`
    );
  }

  return normalizePathname(defaultValue);
};
