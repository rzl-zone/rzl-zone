import type { IsAny } from "@rzl-zone/ts-types-plus";

import { isNil } from "@/predicates/is/isNil";
import { isString } from "@/predicates/is/isString";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

/** ---------------------------------------------------------
 * * ***Extracts dynamic route parameters from a given route string.***
 * ---------------------------------------------------------
 * **This utility type recursively searches for dynamic segments within a route,
 * extracting each parameter and constructing an object where each key represents
 * a dynamic segment and its value is of type `string`.**
 * - ***⚠️ Warning:***
 *    - ***This types only support when using ***[`NextJS`](https://nextjs.org/)***.***
 * @template T - The route string containing potential dynamic segments.
 * @example
 * ```ts
 * type Params1 = ExtractRouteParams<"/user/[id]">;
 * // ➔ { id: string }
 * type Params2 = ExtractRouteParams<"/post/[slug]/comment/[commentId]">;
 * // ➔ { slug: string; commentId: string }
 * type Params3 = ExtractRouteParams<"/dashboard">;
 * // ➔ {} (no dynamic parameters)
 * ```
 */
export type ExtractRouteParams<T> = T extends string
  ? HasDynamicSegments<T> extends true
    ? T extends `${infer _Start}[${infer Param}]${infer Rest}`
      ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
      : unknown
    : unknown
  : unknown; // Ensures an empty object if no dynamic segments are found.

/** ---------------------------------------------------------
 * * ***Determines whether a given route contains dynamic segments.***
 * ---------------------------------------------------------
 * **This type checks if the route includes at least one `[param]` pattern.
 * If it does, the result is `true`, otherwise `false`.**
 * - ***⚠️ Warning:***
 *    - ***This types only support when using ***[`NextJS`](https://nextjs.org/)***.***
 * @template T - The route string to be evaluated.
 * @example
 * ```ts
 * type HasParams1 = HasDynamicSegments<"/user/[id]">;
 * // ➔ true
 * type HasParams2 = HasDynamicSegments<"/settings/profile">;
 * // ➔ false
 * type HasParams3 = HasDynamicSegments<"/blog/[category]/[slug]">;
 * // ➔ true
 * ```
 */
export type HasDynamicSegments<T> = T extends `${string}[${string}]${string}`
  ? true
  : false;

type GenerateRouteResult<T> =
  true extends IsAny<T> ? unknown : T extends string ? string : unknown;

/** ---------------------------------
 * * ***Utility for NextJS: `generateRoute`.***
 * ---------------------------------
 * **Generates a URL by replacing dynamic route parameters with provided values.**
 * - ***⚠️ Warning:***
 *    - ***This function only support when using ***[`NextJS`](https://nextjs.org/)***.***
 * @template T - The route string containing dynamic segments in the format `[param]`.
 * @param {T} route - The route string containing dynamic segments.
 * @param {ExtractRouteParams<T>} [params] - An object containing key-value pairs that match the dynamic segments in the route.
 * @returns {string} The formatted URL with all dynamic segments replaced.
 * @throws **{@link Error | `Error`}** if the route contains dynamic segments but no parameters object is provided.
 * @throws **{@link Error | `Error`}** if a required parameter is missing from the `params` object.
 * @throws **{@link Error | `Error`}** if a parameter value is an empty string.
 * @throws **{@link Error | `Error`}** if any parameter contains invalid characters like `?`, `&`, `=`, `#`, `/`, spaces, `'`, `"`, `(`, `)`, `+`, `;`, `%`, `@`, or `:`, which can cause URL issues.
 * @example
 * // Basic usage
 * generateRoute("/user/[id]", { id: "123" });
 * // ➔ "/user/123"
 *
 * // No dynamic segments, returns as-is
 * generateRoute("/dashboard");
 * // ➔ "/dashboard"
 *
 * // Throws an error due to missing parameters object
 * generateRoute("/profile/[username]");
 * // ➔ ❌ Error: ❌ Missing parameters object for route: "/profile/[username]"
 *
 * // Throws an error due to an empty parameter value
 * generateRoute("/post/[category]/[slug]", { category: "tech", slug: "" });
 * // ➔ ❌ Error: ❌ Parameter "slug" cannot be empty in route: "/post/[category]/[slug]"
 *
 * // Throws an error due to parameter containing invalid characters
 * generateRoute("/search/[query]", { query: "how to?learn" });
 * // ➔ ❌ Error: ❌ Parameter "query" contains invalid character "?" in route: "/search/[query]"
 *
 * // Handles leading/trailing slashes correctly
 * generateRoute("/blog/[category]/[slug]", { category: "/news/", slug: "/latest-update/" });
 * // ➔ ❌ Error: ❌ Parameter "category" and "slug" contains slashes "/" which is not allowed.
 */
export function generateRoute<T extends string>(
  route: T extends string
    ? HasDynamicSegments<T> extends true
      ? T
      : never
    : never,
  params: T extends string ? ExtractRouteParams<T> : undefined
): GenerateRouteResult<T>;
export function generateRoute<T extends string>(
  route: T extends string ? T : never,
  params?: Extract<ExtractRouteParams<T>, Record<string, unknown>>
): GenerateRouteResult<T>;
export function generateRoute<T = unknown>(
  route: T extends string
    ? HasDynamicSegments<T> extends true
      ? T
      : unknown
    : unknown,
  params?: T extends string ? ExtractRouteParams<T> : undefined
): unknown;
export function generateRoute<T>(
  route: T,
  params?: ExtractRouteParams<T>
): string | unknown {
  //todo: Validate the route string
  if (!isString(route) || isEmptyString(route)) {
    throw new TypeError(
      `❌ 'generateRoute' Failed:\n- Invalid 'route' value.\n- Must be of type \`string\` and non-empty string, but received: "${getPreciseType(
        route
      )}": \`${safeStableStringify(route, {
        keepUndefined: true
      })}\`.`
    );
  }

  //todo: If no dynamic segments exist, return the route as-is immediately
  if (!/[\\[\]]/.test(route)) {
    return route;
  }

  //todo: Validate that params is a plain object
  assertIsPlainObject(params, {
    message: ({ validType }) =>
      `❌ 'generateRoute' Failed cause in route "${route}":\n- Missing or invalid parameters \`${validType}\` for route: "${route}", must be of type \`${validType}\` mapping parameters.`
  });

  //todo: Ensure parameters are provided for dynamic routes.
  if (isNil(params)) {
    throw new TypeError(
      `❌ 'generateRoute' Failed cause in route "${route}":\n- Missing parameters \`plain-object\` for route: "${route}".`
    );
  }

  //todo: Check for invalid characters that can break the URL format
  const invalidChars = [
    "?",
    "&",
    "#",
    "=",
    "/",
    // "`",
    // " ",
    // ".",
    "'",
    // eslint-disable-next-line quotes
    '"',
    "(",
    ")",
    "+",
    ";",
    "%",
    "@",
    ":"
  ];

  const errors: string[] = [];

  const requiredKeys = Array.from(route.matchAll(/\[(\w+)\]/g)).map(
    (m) => m[1] || ""
  );

  for (const key of requiredKeys) {
    const value = params[key];

    if (!isString(value)) {
      errors.push(
        `- Invalid parameter: "${key}" must be of type \`string\`, but received: \`${getPreciseType(
          value
        )}\`.`
      );
      continue;
    }

    if (isEmptyString(value)) {
      errors.push(`- Parameter "${key}" cannot be empty string.`);
      continue;
    }

    const foundInvalidChars = invalidChars.filter((char) =>
      value.includes(char)
    );

    if (/\s/.test(value)) {
      foundInvalidChars.push("white-space(s)");
    }

    if (foundInvalidChars.length > 0) {
      const formattedChars = foundInvalidChars.map((c) =>
        c === "`" ? "backtick - (`)" : `\`${c}\``
      );

      if (!invalidChars.includes("white-space(s)"))
        invalidChars.push("white-space(s)");

      const formattedInvalidChars = invalidChars.map((c) =>
        c === "`" ? "backtick - (`)" : `\`${c}\``
      );

      errors.push(
        `- Parameter "${key}" contains invalid characters (${formattedChars.join(
          ", "
        )}). These characters are not allowed because they could cause issues in URL structure. The following characters are forbidden in route parameters: (${formattedInvalidChars.join(
          ", "
        )}).`
      );
    }
  }

  if (isNonEmptyArray(errors)) {
    throw new Error(
      `❌ 'generateRoute' Failed cause in route "${route}":\n${errors.join("\n")}.`
    );
  }

  return route
    .replace(/\[(\w+)\]/g, (_, key) => {
      const paramKey = isNonEmptyString(params[key]) ? params[key] : "";

      return paramKey.trim().replace(/^\/+|\/+$/g, "");
    })
    .replace(/\/+/g, "/");
}
