import type { Prettify } from "@rzl-zone/ts-types-plus";

import type { ParseParsedDataOptions } from "../types/ParseParsedDataOptions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanParsedData } from "../../cleanParsedData";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { parseCustomDate } from "../../parseCustomDate";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { safeJsonParse } from "../../safeJsonParse";

import { isArray } from "@/predicates/is/isArray";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isFunction } from "@/predicates/is/isFunction";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";

import { noop } from "@/generators/utils/noop";
import { createMessage } from "@/_private/logger";

type ValidatedParsedDataOptions = Prettify<Required<ParseParsedDataOptions>>;

/** * ***Private Helper for Options Validation Function: {@link cleanParsedData | `cleanParsedData`}, {@link parseCustomDate | `parseCustomDate`} and {@link safeJsonParse | `safeJsonParse`}.***
 *
 * @internal
 */
export const validateJsonParsingOptions = (
  optionsValue: ParseParsedDataOptions,
  calledFromSource: string
): ValidatedParsedDataOptions => {
  if (!isPlainObject(optionsValue)) optionsValue = {};

  const convertBooleans = optionsValue.convertBooleans ?? false;
  const convertDates = optionsValue.convertDates ?? false;
  const convertNumbers = optionsValue.convertNumbers ?? false;
  const loggingOnFail = optionsValue.loggingOnFail ?? false;
  const removeEmptyArrays = optionsValue.removeEmptyArrays ?? false;
  const removeEmptyObjects = optionsValue.removeEmptyObjects ?? false;
  const removeNulls = optionsValue.removeNulls ?? false;
  const removeUndefined = optionsValue.removeUndefined ?? false;
  const strictMode = optionsValue.strictMode ?? false;
  const checkSymbols = optionsValue.checkSymbols ?? false;
  const convertNaN = optionsValue.convertNaN ?? false;

  const customDateFormats = optionsValue.customDateFormats ?? [];
  const onError = optionsValue.onError ?? noop;

  if (
    !(
      isBoolean(convertBooleans) &&
      isBoolean(convertDates) &&
      isBoolean(convertNumbers) &&
      isBoolean(convertNaN) &&
      isBoolean(checkSymbols) &&
      isBoolean(loggingOnFail) &&
      isBoolean(removeEmptyArrays) &&
      isBoolean(removeEmptyObjects) &&
      isBoolean(removeNulls) &&
      isBoolean(removeUndefined) &&
      isBoolean(strictMode) &&
      isArray(customDateFormats) &&
      isFunction(onError)
    )
  ) {
    throw new TypeError(
      createMessage(
        calledFromSource,
        `Invalid \`options\` parameter (second argument): \`convertBooleans\`, \`convertDates\`, \`convertNumbers\`, \`loggingOnFail\`, \`removeEmptyArrays\`, \`removeEmptyObjects\`, \`removeNulls\`, \`removeUndefined\`, \`strictMode\` expected to be a \`boolean\` type, \`customDateFormats\` expected to be a \`array\` type and \`onError\` expected to be a \`void function\` type. But received: ['convertBooleans': \`${getPreciseType(
          convertBooleans
        )}\`, 'convertDates': \`${getPreciseType(
          convertDates
        )}\`, 'convertNumbers': \`${getPreciseType(
          convertNumbers
        )}\`, 'loggingOnFail': \`${getPreciseType(
          loggingOnFail
        )}\`, 'removeEmptyArrays': \`${getPreciseType(
          removeEmptyArrays
        )}\`, 'removeEmptyObjects': \`${getPreciseType(
          removeEmptyObjects
        )}\`, 'removeNulls': \`${getPreciseType(
          removeNulls
        )}\`, 'removeUndefined': \`${getPreciseType(
          removeUndefined
        )}\`, 'strictMode': \`${getPreciseType(
          strictMode
        )}\`, 'customDateFormats': \`${getPreciseType(
          customDateFormats
        )}\`, 'onError': \`${getPreciseType(onError)}\`].`
      )
    );
  }

  return {
    convertBooleans,
    convertDates,
    convertNumbers,
    convertNaN,
    loggingOnFail,
    removeEmptyArrays,
    removeEmptyObjects,
    removeNulls,
    removeUndefined,
    strictMode,
    customDateFormats,
    onError,
    checkSymbols
  };
};
