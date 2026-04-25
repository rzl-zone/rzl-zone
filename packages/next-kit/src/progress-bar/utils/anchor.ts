import { isString } from "@rzl-zone/utils-js/predicates";
import { DATA_ATTRIBUTE } from "../constants";

/** @internal */
function parsePath(path: string) {
  if (!isString(path)) path = "";

  const hashIndex = path.indexOf("#");
  const queryIndex = path.indexOf("?");
  const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);

  if (hasQuery || hashIndex > -1) {
    return {
      pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
      query: hasQuery
        ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined)
        : "",
      hash: hashIndex > -1 ? path.slice(hashIndex) : ""
    };
  }

  return { pathname: path, query: "", hash: "" };
}

/** @internal */
function addPathPrefix(path: string, prefix?: string) {
  if (!path.startsWith("/") || !prefix) {
    return path;
  }

  const { pathname, query, hash } = parsePath(path);
  return `${prefix}${pathname}${query}${hash}`;
}

/** @internal */
export function getAnchorProperty<
  T extends HTMLAnchorElement | SVGAElement,
  K extends keyof T,
  P extends T[K]
>(a: T, key: K): P extends SVGAnimatedString ? string : P {
  if (typeof key === "string" && key === DATA_ATTRIBUTE.PREVENT_RZL_PROGRESS) {
    const dataKey = key.substring(5) as keyof DOMStringMap;
    return a.dataset[dataKey] as P extends SVGAnimatedString ? string : P;
  }

  const prop = a[key];

  if (prop instanceof SVGAnimatedString) {
    const value = prop.baseVal;

    if (key === "href")
      return addPathPrefix(
        value,
        location.origin
      ) as P extends SVGAnimatedString ? string : P;

    return value as P extends SVGAnimatedString ? string : P;
  }

  return prop as P extends SVGAnimatedString ? string : P;
}

/** * Find the closest anchor to trigger
 *
 * @param element {HTMLElement | null}
 * @returns element {Element}
 *
 * @internal
 */
export function findClosestAnchor(
  element: HTMLElement | null
): HTMLAnchorElement | null {
  while (element && element.tagName.toLowerCase() !== "a") {
    element = element.parentElement;
  }
  return element as HTMLAnchorElement;
}
