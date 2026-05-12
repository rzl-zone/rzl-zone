import { formatEnvPort } from "@/urls/utils/formatEnvPort";
import { removeSpaces } from "@/strings/sanitizations/removeSpaces";

/** ---------------------------------------------------
 * * ***Utility for NextJS: `getBaseUrl`.***
 * ---------------------------------------------------
 * **Retrieves the base URL of the application.**
 * - **Behavior:**
 *    - It determines the base URL from the `NEXT_PUBLIC_BASE_URL` environment variable.
 *    - If `NEXT_PUBLIC_BASE_URL` is not set, it defaults to `"http://localhost:3000"`.
 *    - If `NEXT_PUBLIC_BASE_URL` does **not** contain a port, it appends one from `NEXT_PUBLIC_PORT_FE` if available.
 *    - Ensures the final URL is valid and normalized (no trailing slashes).
 * - ***⚠️ Warning:***
 *    - ***This function only support when using ***[`NextJS`](https://nextjs.org/)***.***
 * @returns {string} The resolved base URL of the application.
 * @throws **{@link Error | `Error`}** if the constructed URL is invalid or malformed.
 * @example
 * // With environment variable set at `*.env` file
 * NEXT_PUBLIC_BASE_URL = "https://example.com";
 * getBaseUrl();
 * // ➔ "https://example.com"
 *
 * // With custom port via NEXT_PUBLIC_PORT_FE at `*.env` file
 * NEXT_PUBLIC_BASE_URL = "http://localhost";
 * NEXT_PUBLIC_PORT_FE = "4000";
 * getBaseUrl();
 * // ➔ "http://localhost:4000"
 *
 * // Without environment variable at `*.env` file
 * delete NEXT_PUBLIC_BASE_URL;
 * getBaseUrl();
 * // ➔ "http://localhost:3000"
 */
export const getBaseUrl = (): string => {
  try {
    const baseEnv = process.env.NEXT_PUBLIC_BASE_URL?.trim();
    const portEnv = process.env.NEXT_PUBLIC_PORT_FE?.trim();

    let baseUrl = baseEnv || "http://localhost";

    // Always clean trailing slashes first
    baseUrl = removeSpaces(baseUrl).replace(/\/+$/, "");

    // Check if already contains port
    const hasPort = /:\/\/[^/]+:\d+/.test(baseUrl);

    if (!hasPort && portEnv) {
      baseUrl += formatEnvPort(portEnv, { prefixColon: true });
    } else if (!hasPort && !baseEnv) {
      baseUrl += ":3000";
    }

    const url = new URL(baseUrl);
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}`;
  } catch (error) {
    throw new Error(
      "Invalid `NEXT_PUBLIC_BASE_URL`, failed to generate from `getBaseUrl()`, Error:" +
        error,
      { cause: error }
    );
  }
};
