import "@rzl-zone/node-only";

import { NextRequest } from "next/server";

import { assertIsBoolean } from "@rzl-zone/utils-js/assertions";
import { isFunction } from "@rzl-zone/utils-js/predicates";

/** ------------------------------------------------------------------
 * * ***Utility for NextJS Server: `getClientIpOrUrl`.***
 * -------------------------------------------------------------------
 *
 * **Retrieves the real client IP address and constructs the full URL using headers like `x-forwarded-for`, `x-forwarded-proto`, and `x-forwarded-port`.**
 * - **ℹ️ Note:**
 *    - Only supported in **Next.js** environments (specifically in `server-only` contexts).
 *    - Should be used in **middleware**, **route-handler** or **server actions** that have access to ***[`NextRequest - NextJS`](https://nextjs.org/docs/app/api-reference/functions/next-request)***.
 *
 * @param {NextRequest} request - The incoming ***`NextJS`*** request object, must be instanceof `NextRequest` from `next/server`.
 * @param {boolean|undefined} [includeFullUrl=true] - Whether to return the full URL (`protocol`, `IP`, and `port` like `protocol://ip:port`) or just the IP address, defaultValue: `true`.
 *
 * @returns {string} The extracted client IP address or the full constructed URL.
 *
 * @throws **{@link Error | `Error`}** if the function is used outside a Next.js server environment.
 * @throws **{@link TypeError | `TypeError`}** if the arguments do not match the expected types.
 *
 * @example
 * // Basic usage in Next.js middleware
 * import { NextRequest } from "next/server";
 * import { getClientIpOrUrl } from "@rzl-zone/utils-js/next/server";
 *
 * export function middleware(request: NextRequest) {
 *   const clientIp = getClientIpOrUrl(request, false);
 *   console.log("Client IP:", clientIp);
 * }
 *
 * // Get full URL
 * const url = getClientIpOrUrl(request);
 * console.log("Client full URL:", url);
 */
export const getClientIpOrUrl = (
  request: NextRequest,
  includeFullUrl: boolean = true
): string => {
  // Ensure we're in a Next.js edge/server environment
  if (!isFunction(NextRequest)) {
    throw new Error(
      "Function `getClientIpOrUrl` is designed to be used in a `NextJS` environment."
    );
  }

  if (!(request instanceof NextRequest)) {
    throw new TypeError(
      "First parameter (`request`) must be an `instance of NextRequest` from `NextJS`."
    );
  }

  assertIsBoolean(includeFullUrl, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`includeFullUrl\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const forwardedIps = (request.headers.get("x-forwarded-for") ?? "127.0.0.1")
    .trim()
    .split(",");

  // Normalize IPv6 loopback addresses
  if (forwardedIps[0] === "::ffff:127.0.0.1" || forwardedIps[0] === "::1") {
    forwardedIps[0] = "127.0.0.1";
  }

  // Get the last non-empty IP from the list (more reliable for real client IP)
  const clientIp: string =
    forwardedIps.length > 1
      ? forwardedIps[forwardedIps.length - 1]?.trim() || ""
      : forwardedIps[0] || "";

  if (!includeFullUrl) {
    return clientIp;
  }

  // Construct full URL using protocol, IP, and port
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  // const protocol = "http";
  const port = request.headers.get("x-forwarded-port") || "3000";

  return `${
    process.env.NODE_ENV === "production" ? protocol : "http"
  }://${clientIp}:${port}`;
};
