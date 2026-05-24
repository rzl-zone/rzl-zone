import type { ParseParsedDataOptions } from "./_private/types/ParseParsedDataOptions";

import { isNull } from "@/predicates/is/isNull";
import { isArray } from "@/predicates/is/isArray";
import { isString } from "@/predicates/is/isString";
import { isObject } from "@/predicates/is/isObject";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";
import { isEmptyObject } from "@/predicates/is/isEmptyObject";

import { parseCustomDate } from "./parseCustomDate";
import { validateJsonParsingOptions } from "./_private/utils/validateJsonParsingOptions";

/** --------------------------------------------------------------------------------------------
 * * ***Utility: `cleanParsedData`.***
 * ---------------------------------------------------------------------------------------------
 * **Cleans parsed JSON data based on provided options.**
 *
 * ---
 * @template T - Expected output type.
 *
 * ---
 * @param {*} data - The parsed JSON data.
 * @param {ParseParsedDataOptions} [options] - The cleaning options.
 *
 * ---
 * @returns {T | null | undefined} The cleaned data.
 * - ***⚠️ Notice:*** _If data is JSON string, we recommend use ***`safeJsonParse` utility
 *   function*** for more safe._
 * - ***⚠️ Note:*** _If using **`convertDates`** **options**, result may contain Date objects,
 *   you may need type assertions in strict TypeScript settings._
 *
 * ---
 * @example
 * 1. #### Convert numbers and remove null values:
 *    ```ts
 *    const result = cleanParsedData(
 *      { age: "25", name: null },
 *      { convertNumbers: true, removeNulls: true }
 *    );
 *
 *    console.log(result);
 *    // ➔ { age: 25 }
 *    ```
 *    ---
 * 2. #### Convert boolean strings:
 *    ```ts
 *    const result = cleanParsedData(
 *      { isActive: "true" },
 *      { convertBooleans: true }
 *    );
 *
 *    console.log(result);
 *    // ➔ { isActive: true }
 *    ```
 */
export const cleanParsedData = <T = unknown>(
  data: T,
  options?: ParseParsedDataOptions
): T | undefined | null => {
  const validOptions = validateJsonParsingOptions(
    options ?? {},
    "cleanParsedData"
  );

  if (isNull(data)) return validOptions.removeNulls ? undefined : null;
  if (isUndefined(data))
    return validOptions.removeUndefined ? undefined : undefined;

  if (isString(data)) {
    const trimmed = data.trim();

    if (validOptions.convertNaN && trimmed === "NaN") return NaN as T;

    if (validOptions.convertNumbers && !isNaN(Number(trimmed))) {
      return Number(trimmed) as T;
    }

    if (validOptions.convertBooleans) {
      if (trimmed === "true") return true as T;
      if (trimmed === "false") return false as T;
    }

    if (validOptions.convertDates) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(trimmed)) {
        return new Date(trimmed) as T;
      }

      if (validOptions.customDateFormats?.length) {
        for (const format of validOptions.customDateFormats) {
          const date = parseCustomDate(trimmed, format);
          if (date) return date as T;
        }
      }
    }

    return validOptions.strictMode ? undefined : (trimmed as T);
  }

  if (isArray(data)) {
    const cleanedArray = data
      .map((item) => cleanParsedData(item, validOptions))
      .filter((item) => !isUndefined(item));

    return validOptions.removeEmptyArrays && isEmptyArray(cleanedArray)
      ? undefined
      : (cleanedArray as T);
  }

  if (isObject(data)) {
    const cleanedObject: Record<string, unknown> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const cleanedValue = cleanParsedData(data[key], validOptions);
        if (!isUndefined(cleanedValue)) {
          cleanedObject[key] = cleanedValue;
        }
      }
    }

    return validOptions.removeEmptyObjects &&
      isEmptyObject(cleanedObject, { checkSymbols: validOptions.checkSymbols })
      ? undefined
      : (cleanedObject as T);
  }

  return validOptions.strictMode ? undefined : data;
};
