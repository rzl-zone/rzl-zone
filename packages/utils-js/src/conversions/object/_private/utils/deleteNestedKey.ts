import { isArray } from "@/predicates/is/isArray";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isObjectOrArray } from "@/predicates/is/isObjectOrArray";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { removeObjectPaths } from "../../removeObjectPaths";

/** ***Util helper for {@link removeObjectPaths | `removeObjectPaths`}.***
 *
 * @internal
 */
export const deleteNestedKey = <T extends Record<string, unknown> | unknown[]>(
  obj: T,
  path: string[]
): T => {
  if (!isObjectOrArray(obj)) return obj;

  const [currentKey, ...rest] = path;

  if (isArray(obj)) {
    for (const item of obj) {
      // recursive pass same path
      if (isObjectOrArray(item)) deleteNestedKey(item, path);
    }
  } else if (isEmptyArray(rest) && isPlainObject(obj) && currentKey) {
    delete obj[currentKey];
  } else if (
    isPlainObject(obj) &&
    currentKey &&
    isObjectOrArray(obj[currentKey])
  ) {
    deleteNestedKey(obj[currentKey], rest);
  }

  return obj;
};
