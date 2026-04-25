import { headers } from "next/headers";

import {
  getExpectedRequestStore,
  getStaticGenerationStore
} from "@/extra/utils/async-storages";
import { ReadonlyURLSearchParams } from "@/extra/utils/search-params";

import { RZL_NEXT_KIT_EXTRA } from "./utils/constants";

const { FLAG_MESSAGE } = RZL_NEXT_KIT_EXTRA.ERROR;

// -- Internal ------------------------

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get("x-forwarded-proto") || "http";
  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "localhost:3000";
  return `${protocol}://${host}`;
}

async function getRequestURL(callingExpression: string): Promise<URL> {
  const origin = await getRequestOrigin();
  const staticStore = getStaticGenerationStore(callingExpression);

  if (
    staticStore &&
    "urlPathname" in staticStore &&
    !!staticStore.urlPathname
  ) {
    return new URL(staticStore.urlPathname, origin);
  }

  const requestStore = getExpectedRequestStore(callingExpression);
  if (requestStore && "url" in requestStore && !!requestStore.url) {
    return new URL(
      `${requestStore.url.pathname}${requestStore.url.search}`,
      origin
    );
  }

  // We should never get here.
  throw new Error(
    FLAG_MESSAGE(
      `Function \`${callingExpression}\` could not access the request URL. Probably you should report this as a bug. GitHub: https://github.com/rzl-zone/next-kit/issues`
    )
  );
}

// -- Exported ------------------------

/** -------------------------------------------------------------------
 * * ***This function lets you read the current URL's pathname.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * @example
 * ```ts
 * import { getPathname } from "@rzl-zone/next-kit/extra/pathname";
 *
 * type LayoutProps = Readonly<{ children: React.ReactNode }>;
 * export default async function Layout({ children }: LayoutProps) {
 *   const pathname = await getPathname();
 *   // ➔ returns "/dashboard" on /dashboard?foo=bar
 *
 *   return (
 *     //...
 *   );
 * };
 * ```
 */
export async function getPathname(): Promise<string> {
  const expression = "getPathname";
  const url = await getRequestURL(expression);

  return url.pathname;
}

/** -------------------------------------------------------------------
 * * ***This function lets you *read* the current URL's search parameters.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * **Learn more about [`URLSearchParams` on MDN](https://developer.mozilla.org/docs/Web/API/URLSearchParams).**
 *
 * @example
 * ```ts
 * import { getSearchParams } from "@rzl-zone/next-kit/extra/pathname";
 *
 * type LayoutProps = Readonly<{ children: React.ReactNode }>;
 * export default async function Layout({ children }: LayoutProps) {
 *   const params = await getSearchParams();
 *   params.get("foo");
 *   // ➔ returns "bar" when ?foo=bar
 *
 *   return (
 *     //...
 *   );
 * };
 * ```
 */
export async function getSearchParams(): Promise<ReadonlyURLSearchParams> {
  const expression = "getSearchParams";
  const url = await getRequestURL(expression);

  return new ReadonlyURLSearchParams(url.searchParams);
}
