/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SafeReturn } from "p-safe";

import { headers } from "next/headers";
import { ResponseCookies, RequestCookies } from "@edge-runtime/cookies";
import {
  hasOwnProp,
  isNil,
  isPlainObject,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { assertIsString } from "@rzl-zone/utils-js/assertions";

import { isIP } from "@/extra/utils/ip";
import { getExpectedRequestStore } from "@/extra/utils/async-storages";
import { ActionError, type ActionErrorJson } from "@/extra/utils/errors";

// -- Types ---------------------------

type AnyFn<This = void> = (this: This, ...args: readonly any[]) => unknown;

type ActionFunc<T> = T extends (...args: infer Args) => infer Return
  ? (
      this: any,
      ...args: Args
    ) => Promise<SafeReturn<Awaited<Return>, ActionError>>
  : never;

interface ActionContext<Return> {
  resolve: (result: Return) => never;
  reject: (error: ActionErrorJson | ActionError) => never;
}

// -- Internal ------------------------

class ActionClass<Return extends AnyFn<ActionContext<any>>> {
  #fn: AnyFn<ActionContext<any>> | undefined;
  private fn: AnyFn<ActionContext<any>> | undefined;

  constructor(fn: AnyFn<ActionContext<any>>) {
    if (typeof globalThis?.Reflect?.ownKeys === "function") {
      // ES2022+ environment
      this.#fn = fn;
    } else {
      this.fn = fn;
    }
  }

  resolve(result: Return): never {
    throw { data: result };
  }

  reject(reason: ActionErrorJson | ActionError): never {
    throw reason;
  }

  /** @internal */
  async run(...args: any[]) {
    try {
      const fnToCall = this.#fn ?? this.fn;
      const result_ = await fnToCall?.apply(this, args);
      return !isUndefined(result_) ? { data: result_ } : { data: void 0 };
    } catch (e: unknown) {
      if (!!e && isPlainObject(e) && hasOwnProp(e, "data"))
        return e as {
          data: unknown;
        };
      if (e instanceof ActionError) return { error: e.toJSON() };
      if (
        !!e &&
        isPlainObject(e) &&
        hasOwnProp(e, "code") &&
        hasOwnProp(e, "message")
      ) {
        return {
          error: {
            code: e.code,
            message: e.message,
            stack: e["stack"]
          }
        };
      }
      throw e;
    }
  }
}

/** Parses the `x-forwarded-for` header to extract the client's IP address.
 *
 * This header may contain multiple IP addresses in the format "client IP, proxy 1 IP, proxy 2 IP".
 * This function extracts and returns the first valid IP address.
 *
 * @link https://github.com/pbojinov/request-ip/blob/e1d0f4b89edf26c77cf62b5ef662ba1a0bd1c9fd/src/index.js#L9
 *
 * @internal
 */
function getClientIpFromXForwardedFor(value: null | undefined | string) {
  if (isNil(value)) return null;

  assertIsString(value);

  // x-forwarded-for may return multiple IP addresses in the format:
  // "client IP, proxy 1 IP, proxy 2 IP"
  // Therefore, the right-most IP address is the IP address of the most recent proxy
  // and the left-most IP address is the IP address of the originating client.
  // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
  // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)
  const forwardedIps = value.split(",").map((e) => {
    const ip = e.trim();
    if (ip.includes(":")) {
      const splitted = ip.split(":");
      // make sure we only use this if it's ipv4 (ip:port)
      if (splitted.length === 2) {
        return splitted[0];
      }
    }
    return ip;
  });

  // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
  // Therefore, taking the right-most IP address that is not unknown
  // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)
  for (let i = 0; i < forwardedIps.length; i++) {
    const ip = forwardedIps[i];
    if (ip && isIP(ip)) {
      return ip;
    }
  }

  // If no value in the split list is an ip, return null
  return null;
}

// -- Exported ------------------------

export type Action<Return extends AnyFn<ActionContext<any>>> = InstanceType<
  typeof ActionClass<Return>
>;

/** -------------------------------------------------------------------
 * * ***A helper to simplify creating Next.js Server Actions.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * @example
 * * ***`actions.ts:`***
 * ```tsx
 * "use server";
 *
 * import { actionError, createAction } from "@rzl-zone/next-kit/extra/action";
 *
 * export const hello = createAction(async (name: string) => {
 *    if (!name) {
 *      actionError("NAME_REQUIRED", "Name is required");
 *    }
 *    return `Hello, ${name}!`;
 * });
 * ```
 * ---
 * * ***`page.tsx (server-component):`***
 * ```tsx
 * import { hello } from "./actions";
 *
 * export default async function Page() {
 *    const { data, error } = await hello("John");
 *    if (error) return <h1>ERROR: {error.message}</h1>;
 *    return <h1>{data}</h1>;
 * }
 * ```
 */
export function createAction<T extends AnyFn<ActionContext<any>>>(
  fn: T
): ActionFunc<T> {
  const action = new ActionClass<T>(fn);

  return new Proxy(fn as any, {
    apply: (target, thisArg, argumentsList) => {
      return action.run(...argumentsList);
    }
  });
}

/** -------------------------------------------------------------------
 * * ***This function is for throw error from `createAction`.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * @example
 * * ***`actions.ts:`***
 * ```ts
 * "use server";
 *
 * import { actionError, createAction } from "@rzl-zone/next-kit/extra/action";
 *
 * export const hello = createAction(async (name: string) => {
 *    if (!name) {
 *      actionError("NAME_REQUIRED", "Name is required");
 *    }
 *    return `Hello, ${name}!`;
 * });
 * ```
 * ---
 * * ***`page.tsx (server-component):`***
 * ```tsx
 * import { hello } from "./actions";
 *
 * export default async function Page() {
 *    const { data, error } = await hello("John");
 *    if (error) return <h1>ERROR: {error.message}</h1>;
 *    return <h1>{data}</h1>;
 * }
 * ```
 */
export function actionError(code: string, message: string): never {
  const e = new ActionError(code, message);
  Error.captureStackTrace(e, actionError);
  throw e;
}

/** -------------------------------------------------------------------
 * * ***Handles HTTP cookies for server-side components and actions.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * **This function leverages a shared request storage mechanism to access or modify the cookies.**
 * - ***This function serves two primary purposes:***
 *    1. Reading cookies from an incoming HTTP request when used in a Server Component.
 *    2. Writing cookies to an outgoing HTTP response when used in a Server Component, Server Action, or Route Handler.
 *
 * @returns An object representing the mutable cookies for the current HTTP request context.
 *
 * @throws {Error} Throws an error if the request storage is not available, indicating an internal consistency issue.
 *
 * @example
 * // Reading cookies in a Server Component
 * import { cookies } from "@rzl-zone/next-kit/extra/action";
 *
 * export default function Page() {
 *   const requestCookies = cookies();
 *   console.log(requestCookies.get("sessionId"));
 *
 *   return (
 *     //...
 *   );
 * }
 *
 * @example
 * // Writing cookies in a Server Action
 * import { cookies } from "@rzl-zone/next-kit/extra/action";
 *
 * export function myAction() {
 *   const responseCookies = cookies();
 *   responseCookies.set("sessionId", "abc123", { httpOnly: true });
 * };
 *
 * @example
 * // Modifying cookies in a Route Handler
 * import { cookies } from "@rzl-zone/next-kit/extra/action";
 *
 * export default async function handler(req, res) {
 *   const responseCookies = cookies();
 *   responseCookies.delete("sessionId");
 *   res.end("Cookie deleted");
 * };
 */
export function cookies(): ResponseCookies {
  const expression = "cookies";
  const store = getExpectedRequestStore(expression);

  return store.mutableCookies;
}

/** -------------------------------------------------------------------
 * * ***Retrieves the client's IP address from request headers.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * ***The function checks various headers commonly used by different cloud providers and proxies to find the client's IP address.***
 * ***It prioritizes the `x-forwarded-for` header, which may contain multiple IP addresses, and extracts the first one.***
 *
 * ***If no valid IP is found, it return null.***
 *
 * @returns The client's IP address.
 */
export async function clientIP(): Promise<string | null> {
  const hs = await headers();

  // X-Forwarded-For (Header may return multiple IP addresses in the format: "client IP, proxy 1 IP, proxy 2 IP", so we take the first one.)
  if (hs.has("x-forwarded-for")) {
    const forwardedIp = getClientIpFromXForwardedFor(hs.get("x-forwarded-for"));
    if (forwardedIp) {
      return forwardedIp;
    }
  }

  const headerKeys = [
    // Standard headers used by Amazon EC2, Heroku, and others.
    "x-client-ip",

    // Cloudflare.
    // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
    // CF-Connecting-IP - applied to every request to the origin.
    "cf-connecting-ip",

    // Fastly and Firebase hosting header (When forwarded to cloud function)
    "fastly-client-ip",

    // Akamai and Cloudflare: True-Client-IP.
    "true-client-ip",

    // X-Real-IP (Nginx proxy/FastCGI)
    "x-real-ip",

    // X-Cluster-Client-IP (Rackspace LB, Riverbed Stingray)
    "x-cluster-client-ip",

    // X-Forwarded, Forwarded-For and Forwarded (Variations of #2)
    "x-forwarded",
    "forwarded-for",
    "forwarded",

    // Google Cloud App Engine
    // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers
    "x-appengine-user-ip",

    // Cloudflare fallback
    // https://blog.cloudflare.com/eliminating-the-last-reasons-to-not-enable-ipv6/#introducingpseudoipv4
    "Cf-Pseudo-IPv4"
  ];

  for (const headerKey of headerKeys) {
    if (hs.has(headerKey)) {
      const ip = hs.get(headerKey);
      if (ip && isIP(ip)) {
        return ip;
      }
    }
  }

  return null;
}

// -- Third ---------------------------

export { ResponseCookies, RequestCookies };
