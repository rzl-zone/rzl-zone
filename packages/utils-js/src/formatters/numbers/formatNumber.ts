import { createMessage } from "@/_private/logger";

import { isFinite } from "@/predicates/is/isFinite";
import { isString } from "@/predicates/is/isString";
import { getPreciseType } from "@/predicates/type/getPreciseType";

/** ----------------------------------------------------------
 * * ***Utility: `formatNumber`.***
 * -----------------------------------------------------------
 * **Formats a number or numeric string by adding a custom separator
 * every three digits (thousands separator), and intelligently flips
 * the decimal separator according to the chosen separator.**
 *
 * ---
 * - **Features:**
 *     - Converts a number to string before formatting.
 *     - Defaults to using `,` as the thousands separator.
 *     - If `.` is used as the separator, the decimal will automatically
 *       become `,`, and vice versa.
 *     - Handles input with existing formatting (e.g. "1,234,567.89") and normalizes it.
 *     - Supports custom separators, including spaces.
 *     - Preserves decimals even if more than 2 digits.
 *
 * ---
 * @param {string | number} value - The numeric value or string to format, can be plain numbers, or already formatted strings like `"1,234,567.89"`.
 * @param {string} [separator=","] - The thousands separator to use, examples: `","` ***(default)***, `"."`, `" "`, etc.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `value` is not a string or number, or `separator` is not a string.
 *
 * ---
 * @returns {string} The formatted string with thousands separators and
 *   appropriate decimal separator.
 *
 * ---
 * @example
 * formatNumber(1000000);
 * // ➔ "1,000,000"
 * formatNumber("987654321");
 * // ➔ "987,654,321"
 * formatNumber(1234567.89);
 * // ➔ "1,234,567.89"
 * formatNumber("1234567,89");
 * // ➔ "1,234,567.89"
 * formatNumber("1234567.892");
 * // ➔ "1,234,567.892"
 * formatNumber("1234567.89", ".");
 * // ➔ "1.234.567,89"
 * formatNumber("1234567,89", ",");
 * // ➔ "1,234,567.89"
 * formatNumber("987654321", " ");
 * // ➔ "987 654 321"
 * formatNumber("1,234,567.89");
 * // ➔ "1,234,567.89"
 * formatNumber("1.234.567,89", ",");
 * // ➔ "1,234,567.89"
 * formatNumber("1.234.567,893", ".");
 * // ➔ "1.234.567,893"
 * formatNumber("1234.56", ".");
 * // ➔ "1.234,56"
 * formatNumber("1234,56", ",");
 * // ➔ "1,234.56"
 */
export const formatNumber = (
  value: string | number,
  separator: string = ","
): string => {
  if (!isString(value) && !isFinite(value)) {
    throw new TypeError(
      errorMsg(
        `First parameter (\`value\`) must be of type \`string\` or \`primitive number\`, but received: \`${getPreciseType(
          value
        )}\`.`
      )
    );
  }

  if (!isString(separator)) {
    throw new TypeError(
      errorMsg(
        `Second parameter (\`separator\`) must be of type \`string\` or empty as \`undefined\`, but received: \`${getPreciseType(
          separator
        )}\`.`
      )
    );
  }

  separator = isString(separator) ? separator : ",";
  const decimalSeparator =
    separator === "." ? "," : separator === "," ? "." : ".";

  // Convert value to string
  const stringValue = value.toString().trim();

  // --- Normalize input ---
  // Find the last decimal separator from the end
  const lastDot = stringValue.lastIndexOf(".");
  const lastComma = stringValue.lastIndexOf(",");

  let actualDecimal = "";
  if (lastDot > lastComma) {
    actualDecimal = ".";
  } else if (lastComma > lastDot) {
    actualDecimal = ",";
  }

  // Split into integer and decimal parts
  let integerPart = stringValue;
  let decimalPart: string | undefined;

  if (actualDecimal) {
    const parts = stringValue.split(actualDecimal);
    integerPart = parts.slice(0, -1).join(actualDecimal); // merge if more than one
    decimalPart = parts.slice(-1)[0];
  }

  // Remove all non-digit characters from the integer part
  integerPart = integerPart.replace(/[^\d]/g, "");

  // Format integer part with thousands separator
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    separator
  );

  // Combine with decimal part if exists
  return decimalPart
    ? `${formattedInteger}${decimalSeparator}${decimalPart}`
    : formattedInteger;
};

/**
 * @internal ***`Not part of the public API.`***
 */
const errorMsg = (msg: string) => createMessage("formatNumber", msg);
