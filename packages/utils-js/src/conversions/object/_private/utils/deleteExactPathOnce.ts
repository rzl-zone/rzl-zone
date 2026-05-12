import { isPlainObject } from "@/predicates/is/isPlainObject";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { removeObjectPaths } from "../../removeObjectPaths";

/** @private ***Util helper for {@link removeObjectPaths | `removeObjectPaths`}.*** */
export const deleteExactPathOnce = <T extends Record<string, unknown>>(
  obj: T,
  path: string[]
): T => {
  if (!isPlainObject(obj)) return obj;

  const [currentKey, ...rest] = path;

  if (rest.length === 0) {
    if (isPlainObject(obj)) delete obj[currentKey];
  } else if (isPlainObject(obj[currentKey])) {
    deleteExactPathOnce(obj[currentKey], rest);
  }

  return obj;
};
