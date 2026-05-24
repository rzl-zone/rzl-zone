import { isFunction } from "@/predicates/is/isFunction";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { removeObjectPaths } from "../../removeObjectPaths";

/** ***Util helper for {@link removeObjectPaths | `removeObjectPaths`}.***
 *
 * @internal
 */
export const deepCloneSafe = <U>(obj: U): U => {
  try {
    if (isFunction(structuredClone)) {
      return structuredClone(obj);
    }
  } catch {
    // skip
  }
  return JSON.parse(JSON.stringify(obj));
};
