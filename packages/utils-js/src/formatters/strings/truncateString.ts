import { createMessage } from "@/_private/logger";

import { assertIsString } from "@/assertions/strings/assertIsString";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import { isInteger } from "@/predicates/is/isInteger";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

type TruncateStringOptions = {
  /** ---------------------------------------------------------
   * * ***Maximum length of the truncated string **(default: `10`)**.***
   * ----------------------------------------------------------
   *
   * @default 10
   */
  length?: number;

  /** ---------------------------------------------------------
   * * ***String to append if truncation occurs.***
   * ----------------------------------------------------------
   *
   * - Will be trimmed first; defaults to `"..."` if empty.
   *
   * @default "..."
   */
  ending?: string;

  /** ---------------------------------------------------------
   * * ***Whether to trim the input string before truncation ***(default: `true`)***.***
   * ----------------------------------------------------------
   *
   * @default true
   */
  trim?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `truncateString`.***
 * -----------------------------------------------------------
 * - **Features:**
 *     - Truncates a string to a specified length and optionally appends an ending.
 *     - Supports trimming the input before truncation.
 *     - If truncation occurs, trailing spaces before the ending are removed.
 *     - The `ending` parameter is always trimmed first; if empty, it defaults to `"..."`.
 *
 * ---
 * @param {string|null|undefined} text
 *  ***The input string to truncate, behavior:***
 *    - If `null`, `undefined`, or empty after trim, returns `""`.
 * @param {TruncateStringOptions} [options]
 *  ***Optional settings:***
 *     - `length` (number, default 10): Maximum length of the truncated string.
 *     - `ending` (string, default `"..."`): String to append if truncation occurs.
 *     - `trim` (boolean, default `true`): Whether to trim the input before truncation.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `options.length` is not a finite number, or if `options.ending` is not a string, or if `options.trim` is not a boolean.
 *
 * ---
 * @returns {string} The truncated string with optional trimming and ending, returns `""` if input is empty or length < 1.
 *
 * ---
 * @example
 * truncateString("hello world", { length: 5 });
 * // ➔ "hello..."
 * truncateString("hello world", { length: 5, ending: "---" });
 * // ➔ "hello---"
 * truncateString("hello world", { length: 5, ending: "   " });
 * // ➔ "hello..." (ending trimmed to default)
 * truncateString("hello world", { length: 5, ending: "   !!!   " });
 * // ➔ "hello!!!" (ending trimmed)
 * truncateString("   long data string   ", { length: 8, ending: "...", trim: true });
 * // ➔ "long dat..."
 * truncateString("   long data string   ", { length: 8, ending: "...", trim: false });
 * // ➔ "   long ..."
 * truncateString(null, { length: 5 });
 * // ➔ ""
 */
export const truncateString = (
  text: string | null | undefined,
  options?: TruncateStringOptions
): string => {
  if (!isNonEmptyString(text)) return "";
  if (!isPlainObject(options)) options = {};

  const trim = options.trim ?? true;
  const length = options.length ?? 10;
  let ending = options.ending ?? "...";

  if (!isInteger(length)) {
    throw new TypeError(
      errorMsg(
        `Parameter \`length\` property of the \`options\` (second parameter) must be of type \`integer-number\`, but received: \`${getPreciseType(
          length
        )}\`, with value: \`${safeStableStringify(length, {
          keepUndefined: true
        })}\`.`
      )
    );
  }

  if (length < 1) return "";

  assertIsString(ending, {
    message: ({ currentType, validType }) =>
      errorMsg(
        `Parameter \`ending\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      )
  });

  assertIsBoolean(trim, {
    message: ({ currentType, validType }) =>
      errorMsg(
        `Parameter \`trim\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      )
  });

  if (isEmptyString(ending)) {
    ending = "...";
  } else {
    ending = ending.trim();
  }

  const original = trim ? text.trim() : text;
  const originalTrimmedLength = original.length;

  if (originalTrimmedLength <= length) return original;

  const sliced = original.slice(0, length);
  const cleanSliced = trim ? sliced : sliced.trimEnd();

  return cleanSliced + ending;
};

/**
 * @internal ***`Not part of the public API.`***
 */
const errorMsg = (msg: string) => createMessage("truncateString", msg);
