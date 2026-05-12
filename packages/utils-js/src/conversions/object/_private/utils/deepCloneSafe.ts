import { isFunction } from "@/predicates/is/isFunction";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { removeObjectPaths } from "../../removeObjectPaths";

/** @private ***Util helper for {@link removeObjectPaths | `removeObjectPaths`}.*** */
export const deepCloneSafe = <U>(obj: U): U => {
  try {
    if (isFunction(structuredClone)) {
      return structuredClone(obj);
    }
    // eslint-disable-next-line no-empty
  } catch {}
  return JSON.parse(JSON.stringify(obj));
};
