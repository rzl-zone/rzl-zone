import { assertIsBoolean, assertIsString } from "@rzl-zone/utils-js/assertions";
import {
  getPreciseType,
  isError,
  isNil,
  isPlainObject,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { normalizePathname } from "@rzl-zone/utils-js/urls";
import { getBeApiUrl } from "./getBeApiUrl";

type OptionsCreateBeApiUrl = {
  /** * The prefix pathname api url, e.g:`"http://localhost.com/your-target-prefix-entri-point-api-is-here"`, default: `"/api"`.
   *
   * @default "/api"
   */
  prefix?: string;
  /** * Option to getting `prefix` and `pathname` of api url only `(removing origin base api url)`, default: `true`.
   *
   * @default true
   */
  withOrigin?: boolean;
};

/** ---------------------------------------------------
 * * ***Utility for NextJS: `createBeApiUrl`.***
 * ---------------------------------------------------
 *
 * **Constructs a backend API URL by appending a given pathname to the base API URL.**
 * - **ℹ️ Note:**
 *    - This function builds on top of `getBeApiUrl()`.
 * - **Determines the base API URL from:**
 *    - `NEXT_PUBLIC_BACKEND_API_URL` environment variable (or defaults to `"http://localhost:8000"`).
 *    - Automatically appends `NEXT_PUBLIC_PORT_BE` if the base URL does not already include a port.
 * - **Features of this function:**
 *    - Allows customizing the API path with an optional `prefix` (defaults to `"/api"`).
 *    - Can include or exclude the origin (protocol + host) via `withOrigin`.
 *    - Normalizes paths to avoid duplicate slashes.
 * - ***⚠️ Warning:***
 *    - ***This function only support when using ***[`NextJS`](https://nextjs.org/)***.***
 *
 * @param {string|null|undefined} pathname - The API endpoint path (e.g., `/users` or `/v1/posts`), defaultValue: `""`.
 * @param {OptionsCreateBeApiUrl} [options] - Configuration options.
 * @param {OptionsCreateBeApiUrl["prefix"]} [options.prefix="/api"] - The prefix for the API path (default is `"/api"`).
 * @param {OptionsCreateBeApiUrl["withOrigin"]} [options.withOrigin=true] - Whether to include the full base URL or return only the API path.
 *
 * @returns {string} The formatted API URL.
 *
 * @throws **{@link TypeError | `TypeError`}** if `withOrigin` is not a boolean.
 * @throws **{@link TypeError | `TypeError`}** if `prefix` and `pathname` is not a string.
 * @throws **{@link Error | `Error`}** if constructing the API URL fails due to an invalid base URL.
 *
 * @example
 * createBeApiUrl("/users");
 * // ➔ "http://localhost:8000/api/users"
 *
 * createBeApiUrl("/api/users");
 * // ➔ "http://localhost:8000/api/users"
 *
 * createBeApiUrl("/v1", { prefix: "/v1" });
 * // ➔ "http://localhost:8000/v1"
 *
 * createBeApiUrl("/v1/users");
 * // ➔ "http://localhost:8000/api/v1/users"
 *
 * createBeApiUrl("/v1/users", { prefix: "/v1" });
 * // ➔ "http://localhost:8000/v1/users"
 *
 * createBeApiUrl("/users", { withOrigin: false });
 * // ➔ "/api/users"
 *
 * createBeApiUrl(null, { withOrigin: false });
 * // ➔ "/api"
 *
 * createBeApiUrl(undefined, { withOrigin: false });
 * // ➔ "/api"
 */
export const createBeApiUrl = (
  /** * The pathname api url, e.g:`"http://localhost.com/your-target-prefix-entri-point-api-is-here/your-target-pathname-is-here"`.
   *
   * @default ""
   */
  pathname: string | null | undefined,
  options: OptionsCreateBeApiUrl = {}
): string => {
  try {
    // ✅ Type checks
    assertIsString(isNil(pathname) ? "" : pathname, {
      message({ currentType, validType }) {
        return `First parameter (\`pathname\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`;
      }
    });

    if (!isPlainObject(options)) {
      options = {};
    }

    let { prefix = "/api", withOrigin = true } = options;

    if (!isUndefined(prefix) && !isString(prefix)) {
      throw new TypeError(
        `Parameter \`prefix\` property of the \`options\` (second parameter) must be of type \`string\`, but received: \`${getPreciseType(
          prefix
        )}\`.`
      );
    }

    assertIsBoolean(withOrigin, {
      message: ({ currentType, validType }) =>
        `Parameter \`withOrigin\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
    });

    // Normalize pathname
    pathname = normalizePathname(pathname);
    // Normalize prefix
    prefix = normalizePathname(prefix);

    const normalizedPrefix = prefix.endsWith("/") ? prefix : prefix + "/";

    // Remove duplicate prefix in pathname
    if (
      pathname === prefix ||
      pathname === prefix + "/" ||
      pathname.startsWith(normalizedPrefix)
    ) {
      pathname = pathname.slice(prefix.length);
      pathname = normalizePathname(pathname);
    }

    // Get the base API URL
    const baseApiUrl = getBeApiUrl({ suffix: prefix });

    function joinPath(a: string, b: string) {
      return `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;
    }

    const fullPath = withOrigin
      ? joinPath(baseApiUrl, pathname)
      : joinPath(new URL(baseApiUrl).pathname, pathname);

    return fullPath.replace(/\/+$/, "");
  } catch (err) {
    if (isError(err)) {
      throw err;
    } else {
      throw new Error(
        "Failed to generate backend API URL in `createBeApiUrl()`, Error: " +
          String(err).trim(),
        { cause: err }
      );
    }
  }
};
