/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IsAny } from "@rzl-zone/ts-types-plus";
import type { ParseParsedDataOptions } from "./_private/types/ParseParsedDataOptions";
import type {
  SafeJsonParseResult,
  UnknownValue
} from "./_private/types/safeJsonParse";

import { isNaN } from "@/predicates/is/isNaN";
import { isNull } from "@/predicates/is/isNull";
import { isError } from "@/predicates/is/isError";
import { isNumber } from "@/predicates/is/isNumber";
import { isString } from "@/predicates/is/isString";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { cleanParsedData } from "./cleanParsedData";
import { extractDigits } from "../numerics/extractDigits";
import { validateJsonParsingOptions } from "./_private/utils/validateJsonParsingOptions";
import { fixSingleQuotesEscapeBackslash } from "./_private/utils/fixSingleQuotesEscapeBackslash";

/** --------------------------------------------------
 * * ***Utility: `safeJsonParse`.***
 * ---------------------------------------------
 * **Safely parses JSON while handling errors and applying transformations.**
 * - **Supports generics** to ensure accurate return type inference.
 *    - Always provide both `<TData, TInput>` for best results.
 *    - ℹ️ ***Scroll down for full generic behavior explanation.***
 * - Automatically parses valid JSON strings into `objects`, `arrays`, `numbers`, etc.
 * - Supports data transformation via options (e.g., convert strings to `numbers`, `booleans`, or `dates`).
 * - **Returns:**
 *    1. `null` ➔ if input is explicitly `null`.
 *    2. `undefined` ➔ if input is `undefined`, not a `string`, or if parsing fails.
 *    3. Parsed and cleaned result (`TData`) ➔ if input is a valid JSON string.
 * - ⚠️ **JSON.stringify note**:
 *    - _If the input JSON string was created using `JSON.stringify()`, any properties with `undefined`
 *      values would have been automatically removed or converted to `null` depending on the serializer, example:_
 *      ```ts
 *      JSON.stringify({ a: undefined, b: 1 }); // ➔ '{"b":1}'
 *      JSON.parse('{"a": undefined, "b": 1}')  // ❌ invalid JSON
 *      ```
 *      _Therefore, if you see `undefined` in raw input, it will likely throw unless pre-cleaned or replaced with `null`._
 *
 *      ```ts
 *      safeJsonParse('{"name": "John", "score": undefined}');
 *      // result ➔ { name: "John", score: null } <- because `undefined` is not valid JSON, gets replaced to null.
 *      ```
 * - ℹ️ **Additionally:**
 *    - This function normalizes single quotes (`'`) to double quotes (`"`) before parsing,
 *      so JSON strings using single quotes will be converted to valid JSON format, example:
 *      ```ts
 *      safeJsonParse("{'name': 'John', 'age': 30}");
 *      // result ➔ { name: "John", age: 30 }
 *
 *      safeJsonParse("{'string\\'s': 'abc', \"quote's\": 'It\\'s awesome!', 'aNumber\\'s': 123, 'keyWith\\'Backslash\\'s': 'value\\'s'}");
 *      // result ➔ { "string's": "abc", "quote's": "It's awesome!", "aNumber's": 123, "keyWith'Backslash's": "value's" }
 *      ```
 * @template TData - The expected output type after parsing and cleaning.
 * @template TInput - The input value type, used for advanced type inference and return typing.
 * @param {TInput} [value] - The JSON string or value to parse.
 * @param {ParseParsedDataOptions} [options] - Options to clean, convert types, enable strict mode,
 *   support custom date formats, enable logging, or handle errors via callback.
 * @returns {SafeJsonParseResult<TData, TInput>} Parsed and optionally cleaned result, or `null`/`undefined`.
 * @throws **{@link TypeError | `TypeError`}** if `options` is provided but not a valid object.
 * @example
 * 1. ***Basic parse with number & boolean conversion:***
 *  ```ts
 *    const result = safeJsonParse(30);
 *    // result ➔ undefined
 *    const result = safeJsonParse(30, {
 *      convertNumbers: true
 *    });
 *    // result ➔ 30
 *
 *    const result = safeJsonParse('{"age": "30", "isActive": "true"}', {
 *      convertNumbers: true,
 *      convertBooleans: true
 *    });
 *    // result ➔ { age: 30, isActive: true }
 *  ```
 * 2. ***Handling `undefined` in input string (manually written, not JSON.stringify):***
 *  ```ts
 *    const result = safeJsonParse('{"score": undefined}');
 *    // result ➔ { score: null } <- because `undefined` is not valid JSON, gets replaced
 *  ```
 *
 * 3. ***Handling `NaN` in input string (manually written, not JSON.stringify):***
 *  ```ts
 *    const value = NaN; // <- value is NaN or "NaN";
 *    const result = safeJsonParse(value);
 *    // result ➔ undefined <- will return as undefined, because options `convertNaN` is false (default),
 *    const result2 = safeJsonParse(value, { convertNaN: true });
 *    // result2 ➔ NaN <- will return as undefined because options `convertNaN` is false,
 *
 *    const result4 = safeJsonParse('{"strNan": "NaN", "pureNan": NaN}');
 *    // NaN will convert to string (NaN ➔ "NaN") because options `convertNaN` is false (default),
 *    // result4 ➔ { strNan: "NaN", pureNan: "NaN" }
 *
 *    const result3 = safeJsonParse('{"strNan": "NaN", "pureNan": NaN}', {
 *      convertNaN: true
 *    });
 *    // String "NaN" will convert to NaN ("NaN" ➔ NaN) because options `convertNaN` is true,
 *    // result3 ➔ { strNan: NaN, pureNan: NaN }
 *  ```
 *
 * 4. ***Strict mode (removes invalid values):***
 *  ```ts
 *    const result = safeJsonParse('{"name": "   ", "score": "99abc"}', {
 *      convertNumbers: true,
 *      strictMode: true
 *    });
 *    // result ➔ {}
 *
 *    const result2 = safeJsonParse('{"name": "   ", "score": undefined}');
 *    // result2 ➔ { name: "",score: null }
 *  ```
 *
 * 5. ***Custom date format parsing:***
 *  ```ts
 *    const result = safeJsonParse('{"birthday": "25/12/2000"}', {
 *      convertDates: true,
 *      customDateFormats: ["DD/MM/YYYY"]
 *    });
 *    // result ➔ { birthday: new Date("2000-12-25T00:00:00.000Z") }
 *  ```
 *
 * 6. ***Invalid JSON with custom error handling:***
 *  ```ts
 *    safeJsonParse("{invalid}", {
 *      loggingOnFail: true,
 *      onError: (err) => console.log("Custom handler:", err.message)
 *    });
 *    // ➔ Logs parsing error and invokes handler
 *  ```
 *
 * 7. ***Null or non-string input returns null/undefined (default options):***
 *  ```ts
 *    safeJsonParse(123); // ➔ undefined
 *    safeJsonParse(null); // ➔ null
 *    safeJsonParse(undefined); // ➔ undefined
 *  ```
 *
 * 8. ***Generic usage: Provide both output and input type to ensure correct return typing:***
 *  ```ts
 *    type UserType = { name: string };
 *
 *    const obj = JSON.stringify({
 *      name: "John"
 *    });
 *
 *    const toParse = isAuth() ? obj : null;
 *    const toParse2 = isAuth() ? obj : undefined;
 *
 *    // * `Without Generic`:
 *      const parsed = safeJsonParse(toParse);
 *      //- runtime: { name: "John" } | undefined | null
 *      //- type: Record<string, unknown> | undefined | null
 *      const parsed2 = safeJsonParse(toParse);
 *      //- runtime: { name: "John" } | undefined
 *      //- type: Record<string, unknown> | undefined
 *
 *    // * `With Generic`:
 *      const parsed = safeJsonParse<UserType>(toParse);
 *      //- runtime: { name: "John" } | undefined | null
 *      //- type: undefined  <- (⚠️ unexpected!)
 *      const parsed2 = safeJsonParse<UserType>(toParse);
 *      //- runtime: { name: "John" } | undefined
 *      //- type: undefined  <- (⚠️ unexpected!)
 *      const parsed = safeJsonParse<UserType, typeof toParse>(toParse);
 *      //- runtime: { name: "John" } | null | undefined
 *      //- type: UserType | null | undefined
 *      const parsed2 = safeJsonParse<UserType, typeof toParse>(toParse);
 *      //- runtime: { name: "John" } | undefined
 *      //- type: UserType | undefined
 *  ```
 * @note
 * ⚠️ **Generic Behavior:**
 * - This function supports advanced generic inference for clean, type-safe return values.
 * - If only the first generic (`TData`) is provided and the second (`TInput`) is omitted,
 *   then `TInput` defaults to `undefined`, resulting in a return type of `undefined`.
 * - To ensure correct return typing, **always pass both generics** when `value` is dynamic,
 *   nullable, or unioned: `safeJsonParse<TData, typeof value>(value)`.
 * - This makes the returned type exactly match your expectation: `TData | null | undefined`.
 */
export function safeJsonParse<
  TData extends Record<string, any> = Record<string, unknown>,
  TInput extends UnknownValue = UnknownValue
>(
  value: TInput,
  options?: ParseParsedDataOptions
): IsAny<TInput> extends true ? TData | null | undefined : undefined;
export function safeJsonParse<
  TData extends Record<string, any> = Record<string, unknown>,
  TInput extends string | null | undefined | unknown = undefined
>(
  value: TInput,
  options?: ParseParsedDataOptions
): SafeJsonParseResult<TData, TInput>;
//! implement main function
export function safeJsonParse<TData extends Record<string, unknown>>(
  value: unknown,
  options: ParseParsedDataOptions = {}
) {
  if (isNull(value)) return null;
  const validOptions = validateJsonParsingOptions(options);

  if (
    validOptions.convertNaN &&
    (isNaN(value) || (isNonEmptyString(value) && value === "NaN"))
  ) {
    return NaN;
  }
  if (
    validOptions.convertNumbers &&
    !isNaN(Number(value)) &&
    isNumber(extractDigits(value))
  ) {
    return Number(value);
  }

  if (!isString(value)) return undefined;

  try {
    // First, normalize all single quotes to double quotes
    let normalized = fixSingleQuotesEscapeBackslash(value);

    if (validOptions.removeUndefined) {
      normalized = normalized
        .replace(/,\s*"[^"]*"\s*:\s*undefined(?=\s*[},])/g, "")
        // ➔ remove , "key": undefined
        .replace(/"[^"]*"\s*:\s*undefined\s*(,)?/g, "");
      // ➔ remove "key": undefined
    } else {
      normalized = normalized.replace(/:\s*undefined(?=\s*[,}])/g, ":null");
      // ➔ replace :undefined with :null
    }

    if (validOptions.convertNaN) {
      // eslint-disable-next-line quotes
      normalized = normalized.replace(/:\s*NaN(?=\s*[,}])/g, ':"NaN"');
      // ➔ convert :NaN to :"NaN"
    } else {
      normalized = normalized
        // eslint-disable-next-line quotes
        .replace(/:\s*NaN(?=\s*[,}])/g, ':"NaN"')
        // ➔ convert :NaN to :"NaN"
        .replace(/,\s*"[^"]*"\s*:\s*NaN(?=\s*[},])/g, "")
        // ➔ remove , "key": NaN
        .replace(/"[^"]*"\s*:\s*NaN\s*(,)?/g, "");
      // ➔ remove "key": NaN
    }

    normalized = normalized.replace(/,(\s*[}\]])/g, "$1");
    // ➔ remove trailing comma before } or ]

    const parsed = JSON.parse(normalized);
    return cleanParsedData<TData>(parsed, validOptions);
  } catch (error) {
    if (validOptions.loggingOnFail) {
      console.error("Failed to parsing at `safeJsonParse`:", error);
    }

    validOptions.onError(
      isError(error)
        ? new Error(error.message.replace(/^JSON\.parse:/, "Failed to parsing"))
        : new Error(String(error))
    );

    return undefined;
  }
}
