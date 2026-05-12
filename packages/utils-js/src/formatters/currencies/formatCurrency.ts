import type { FormatCurrencyOptions } from "@/formatters/currencies/formatCurrency.types";

import { isNaN } from "@/predicates/is/isNaN";
import { isFinite } from "@/predicates/is/isFinite";
import { isString } from "@/predicates/is/isString";
import { isInteger } from "@/predicates/is/isInteger";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isFunction } from "@/predicates/is/isFunction";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";

import { assertIsString } from "@/assertions/strings/assertIsString";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

import { parseCurrencyString } from "@/conversions/currency/parsing";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

/** ***Util helper for {@link formatCurrency}.***
 *
 * @internal
 */
const formatIndianNumber = ({
  numStr,
  separator
}: {
  numStr?: string;
  separator: string;
}) => {
  const lastThree = numStr?.slice(-3);
  const rest = numStr?.slice(0, -3);
  if (!rest) return lastThree;
  return (
    rest.replace(/\B(?=(\d{2})+(?!\d))/g, separator) + separator + lastThree
  );
};

/** -------------------------------------------------------
 * * ***Utility: `formatCurrency`.***
 * -------------------------------------------------------
 * **Formats a number or messy currency string into a
 *   beautifully formatted currency string, with highly
 *   customizable separators, decimal control, rounding,
 *   currency symbols, and negative styling.**
 * - **✅ Highlights:**
 *    - ***Accepts:***
 *        - Pure numbers: `15300.95`.
 *        - Messy currency strings from **any locale**:
 *          - `"Rp 15.000,21"` ***(Indonesian / Euro)***.
 *          - `"$12,345.60"` ***(US)***.
 *          - `"CHF 12'345.60"` ***(Swiss)***.
 *          - `"1,23,456.78"` ***(Indian)***.
 * - Auto extracts numeric value with smart multi-locale parsing
 *   via ***`parseCurrencyString` utility function***.
 * - Strong type checks & clear errors for misconfigured options.
 * - **Handles:**
 *    - Thousands separators: `.`, `,`, `'`, ` `.
 *    - Decimal separators: `,`, `.`.
 *    - Decimal suffix (eg. `".-"`, `" USD"`).
 *    - Currency prefix (eg. `"Rp "`, `"$ "`).
 *    - Rounding: `"round"`, `"ceil"`, `"floor"`, or truncate.
 *    - Negative styling: dash `-`, brackets `( )`, absolute, or custom.
 * - **✅ How input is parsed:**
 *    - Removes all non-digit except `.`, `,`, `'` and spaces.
 *    - Detects bracket negatives: `"(15.000,10)"` ➔ `-15000.10`.
 *    - Uses last `,` or `.` as decimal separator (others are thousands).
 *    - Ignores currency symbols like `Rp`, `$` (must re-apply with `suffixCurrency`).
 * - **ℹ️ Note:**
 *    - Always re-apply symbols via `suffixCurrency`.
 *    - `parseCurrencyString` smartly detects last decimal,
 *   so `"1.121.234,56"` and `"1,121,234.56"` both parsed correctly.
 * @param {string|number} value
 *  ***The input value to format, examples:***
 *    - `"Rp 15.000,21"`.
 *    - `"$12,345.60"`.
 *    - `"CHF 12'345.60"`.
 *    - `15300.95`.
 * @param {FormatCurrencyOptions} [options] ***Optional configuration object.***
 * @param {FormatCurrencyOptions["separator"]} [options.separator]
 *  ***Thousands separator:***
 *    - `{ separator: "." }` ➔ `1.000.000`.
 *    - *DefaultValue: `"."`.*
 * @param {FormatCurrencyOptions["separatorDecimals"]} [options.separatorDecimals]
 *  ***Decimal separator:***
 *    - `{ separatorDecimals: "," }` ➔ `1.000,10`.
 *    - *DefaultValue: `","`.*
 * @param {FormatCurrencyOptions["suffixCurrency"]} [options.suffixCurrency]
 *  ***Prefix currency string:***
 *    - Does **not auto-keep input symbols**.
 *    - Must set manually e.g: `{ suffixCurrency: "Rp " }`.
 *        - `{ suffixCurrency: "Rp " }` ➔ `Rp 1.000`.
 *    - *DefaultValue: `""`.*
 * @param {FormatCurrencyOptions["decimal"]} [options.decimal]
 *  ***Whether to show decimals. If `false`, decimals are truncated:***
 *    - If `false`, cut the decimal.
 *    - *DefaultValue: `false`.*
 * @param {FormatCurrencyOptions["totalDecimal"]} [options.totalDecimal]
 *  ***Total decimal digits:***
 *    - If `decimal: true` & `roundedDecimal: false`, simply cuts.
 *    - *DefaultValue: `2`.*
 * @param {FormatCurrencyOptions["separatorDecimals"]} [options.suffixDecimal]
 *  ***Text appended after decimals:***
 *    - E.g: (`".-"`, `" USD"`).
 *    - Example 1: `".-"` ➔ `1.000,00.-`.
 *    - Example 2: `" USD"` ➔ `1.000,00 USD`.
 *    - *DefaultValue: `""`.*
 * @param {FormatCurrencyOptions["endDecimal"]} [options.endDecimal]
 *  ***Actually append `suffixDecimal`:***
 *    - *DefaultValue: `true`.*
 * @param {FormatCurrencyOptions["roundedDecimal"]} [options.roundedDecimal]
 *  ***Rounding mode:***
 *    - `"round"` ➔ nearest.
 *    - `"ceil"` ➔ always up.
 *    - `"floor"` ➔ always down.
 *    - `false` ➔ truncate.
 *    - *DefaultValue: `"round"`.*
 * @param {FormatCurrencyOptions["negativeFormat"]} [options.negativeFormat]
 *  ***How to format negatives:***
 *    - `"dash"` ➔ `-15.000`.
 *    - `"brackets"` ➔ `(15.000)`.
 *    - `"abs"` ➔ `15.000` (always positive).
 *    - Or object: `{ style: "dash" | "brackets" | "abs", space: true | false, custom: (formatted) => string }`.
 *    - *DefaultValue: `"dash"`.*
 * @param {FormatCurrencyOptions["indianFormat"]} [options.indianFormat]
 *  ***Applies Indian Format:***
 *    - If `true`, formats as Indian: `12,34,567`.
 *    - Also forces `separator: ","`, `separatorDecimals: "."`.
 * @returns {string}
 *  ***Nicely formatted currency string, examples:***
 *    - `"15.000,10"`.
 *    - `"Rp 15.000,10.-"`.
 *    - `"15'000.10 USD"`.
 *    - `"12,34,567.89"`.
 * @throws **{@link TypeError | `TypeError`}** ***If:***
 *    - The `value` is not string or number.
 *    - Cannot parse to valid number.
 *    - Options have invalid types.
 * @example
 * // --- Number input (default, decimals off) ---
 * formatCurrency(1234567.89);
 * // ➔ "1.234.567"
 *
 * // --- Decimals enabled ---
 * formatCurrency(1234567.89, { decimal: true });
 * // ➔ "1.234.567,89"
 *
 * // --- Indian format ---
 * formatCurrency(1234567.89, { decimal: true, indianFormat: true });
 * // ➔ "12,34,567.89"
 *
 * // --- String input (Indonesian style) ---
 * formatCurrency("Rp 15.000,21", { decimal: true });
 * // ➔ "15.000,21"
 *
 * // --- String input (US style) ---
 * formatCurrency("$12,345.60", { decimal: true });
 * // ➔ "12.345,60"
 *
 * // --- String input (Swiss style) ---
 * formatCurrency("CHF 12'345.60", { decimal: true });
 * // ➔ "12'345,60"
 *
 * // --- String input (Indian style) ---
 * formatCurrency("1,23,456.78", { decimal: true, indianFormat: true });
 * // ➔ "12,34,567.78"
 *
 * // --- Negative numbers (dash) ---
 * formatCurrency(-1234.56, { decimal: true });
 * // ➔ "-1.234,56"
 *
 * // --- Negative numbers (brackets) ---
 * formatCurrency(-1234.56, {
 *   decimal: true,
 *   negativeFormat: "brackets"
 * });
 * // ➔ "(1.234,56)"
 *
 * // --- Negative numbers (custom object style) ---
 * formatCurrency(-1234.56, {
 *   decimal: true,
 *   negativeFormat: { style: "brackets", space: true }
 * });
 * // ➔ "( 1.234,56 )"
 *
 * // --- Negative numbers (custom function) ---
 * formatCurrency(-1234.56, {
 *   decimal: true,
 *   negativeFormat: { custom: (val) => `NEGATIVE[${val}]` }
 * });
 * // ➔ "NEGATIVE[1.234,56]"
 *
 * // --- With prefix currency ---
 * formatCurrency(1234.56, {
 *   decimal: true,
 *   suffixCurrency: "Rp "
 * });
 * // ➔ "Rp 1.234,56"
 *
 * // --- With suffix decimal ---
 * formatCurrency(1234.56, {
 *   decimal: true,
 *   suffixDecimal: ".-"
 * });
 * // ➔ "1.234,56.-"
 *
 * // --- With suffix currency + suffix decimal ---
 * formatCurrency(1234.56, {
 *   decimal: true,
 *   suffixCurrency: "Rp ",
 *   suffixDecimal: ".-"
 * });
 * // ➔ "Rp 1.234,56.-"
 *
 * // --- Custom separators ---
 * formatCurrency(1234567.89, {
 *   decimal: true,
 *   separator: "'",
 *   separatorDecimals: "."
 * });
 * // ➔ "1'234'567.89"
 *
 * // --- Rounding: ceil ---
 * formatCurrency(1234.561, {
 *   decimal: true,
 *   roundedDecimal: "ceil"
 * });
 * // ➔ "1.234,57"
 *
 * // --- Rounding: floor ---
 * formatCurrency(1234.569, {
 *   decimal: true,
 *   roundedDecimal: "floor"
 * });
 * // ➔ "1.234,56"
 *
 * // --- Rounding: truncate (false) ---
 * formatCurrency(1234.569, {
 *   decimal: true,
 *   roundedDecimal: false
 * });
 * // ➔ "1.234,56"
 *
 * // --- Force no decimals (decimal: false) ---
 * formatCurrency(1234.567, { decimal: false });
 * // ➔ "1.235"
 *
 * // --- Edge case: messy input with dots & commas ---
 * formatCurrency("1.121.234,561", {
 *   decimal: true,
 *   totalDecimal: 2,
 *   roundedDecimal: "ceil",
 *   suffixCurrency: "Rp ",
 *   negativeFormat: { style: "brackets" }
 * });
 * // ➔ "(Rp 1.121.234,57)"
 *
 * // --- Edge case: integer string input ---
 * formatCurrency("1.121.234", {
 *   decimal: true,
 *   suffixCurrency: "Rp ",
 *   roundedDecimal: "ceil"
 * });
 * // ➔ "Rp 1.121.234,00"
 */
export const formatCurrency = (
  value: string | number,
  options: FormatCurrencyOptions = {}
): string => {
  if (!isString(value) && !isFinite(value)) {
    throw new TypeError(
      `First parameter (\`value\`) must be of type \`string\` or \`primitive-number\`, but received: \`${getPreciseType(
        value
      )}\`, with value: \`${safeStableStringify(value, {
        keepUndefined: true
      })}\`.`
    );
  }

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const decimal = hasOwnProp(options, "decimal") ? options.decimal : false;
  const totalDecimal = hasOwnProp(options, "totalDecimal")
    ? options.totalDecimal
    : 2;
  const endDecimal = hasOwnProp(options, "endDecimal")
    ? options.endDecimal
    : true;
  const indianFormat = hasOwnProp(options, "indianFormat")
    ? options.indianFormat
    : false;
  const suffixCurrency = hasOwnProp(options, "suffixCurrency")
    ? options.suffixCurrency
    : "";
  const suffixDecimal = hasOwnProp(options, "suffixDecimal")
    ? options.suffixDecimal
    : "";
  const roundedDecimal = hasOwnProp(options, "roundedDecimal")
    ? options.roundedDecimal
    : "round";
  const negativeFormat = hasOwnProp(options, "negativeFormat")
    ? options.negativeFormat
    : "dash";
  let separatorDecimals = hasOwnProp(options, "separatorDecimals")
    ? options.separatorDecimals
    : ",";
  let separator = hasOwnProp(options, "separator") ? options.separator : ".";

  // validations
  if (
    !isString(separator) ||
    !isString(separatorDecimals) ||
    !isString(suffixCurrency) ||
    !isString(suffixDecimal)
  ) {
    throw new TypeError(
      `Parameter \`separator\`, \`separatorDecimals\`, \`suffixCurrency\` and \`suffixDecimal\` property of the \`options\` (second parameter) must be of type \`string\`, but received: ['separator': \`${getPreciseType(
        separator
      )}\`, 'separatorDecimals': \`${getPreciseType(
        separatorDecimals
      )}\`, 'suffixCurrency': \`${getPreciseType(
        suffixCurrency
      )}\`, 'suffixDecimal': \`${getPreciseType(suffixDecimal)}\`].`
    );
  }

  if (
    !isBoolean(decimal) ||
    !isBoolean(endDecimal) ||
    !isBoolean(indianFormat)
  ) {
    throw new TypeError(
      `Parameter \`decimal\`, \`endDecimal\` and \`indianFormat\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: ['decimal': \`${getPreciseType(
        decimal
      )}\`, 'endDecimal': \`${getPreciseType(
        endDecimal
      )}\`, 'indianFormat': \`${getPreciseType(indianFormat)}\`].`
    );
  }

  if (!isInteger(totalDecimal)) {
    throw new TypeError(
      `Parameter \`totalDecimal\` property of the \`options\` (second parameter) must be of type \`integer-number\`, but received: \`${getPreciseType(
        totalDecimal
      )}\`, with value: \`${safeStableStringify(length, {
        keepUndefined: true
      })}\`.`
    );
  }

  if (
    !(
      roundedDecimal === false ||
      roundedDecimal === "round" ||
      roundedDecimal === "ceil" ||
      roundedDecimal === "floor"
    )
  ) {
    throw new TypeError(
      `Parameter \`roundedDecimal\` property of the \`options\` (second parameter) must be of type \`false\` or \`string\` must be one of "round" | "ceil" | "floor", but received: \`${getPreciseType(
        roundedDecimal
      )}\`, with value: \`${safeStableStringify(roundedDecimal, {
        keepUndefined: true
      })}\`.`
    );
  }

  if (
    !(
      negativeFormat === "abs" ||
      negativeFormat === "brackets" ||
      negativeFormat === "dash" ||
      isPlainObject(negativeFormat)
    )
  ) {
    throw new TypeError(
      `Parameter \`negativeFormat\` property of the \`options\` (second parameter) must be of type \`string\` must be one of "abs" | "brackets" | "dash" or \`plain-object\` type, but received: \`${getPreciseType(
        negativeFormat
      )}\`, with value: \`${safeStableStringify(negativeFormat, {
        keepUndefined: true
      })}\`.`
    );
  }

  // parse number
  const rawNum = isString(value) ? parseCurrencyString(value) : value;
  if (isNaN(rawNum)) {
    throw new TypeError(
      "First parameter (`value`) could not be parsed into a valid `number`."
    );
  }

  let integerPart: string | undefined;
  let decimalPartRaw: string | undefined;
  let num = Math.abs(rawNum);
  const factor = Math.pow(10, totalDecimal);

  if (roundedDecimal) {
    const scaled = num * factor;
    switch (roundedDecimal) {
      case "round":
        num = Math.round(scaled) / factor;
        break;
      case "ceil":
        num = Math.ceil(scaled) / factor;
        break;
      case "floor":
        num = Math.floor(scaled) / factor;
        break;
    }
  }

  if (roundedDecimal) {
    [integerPart, decimalPartRaw] = num.toFixed(totalDecimal).split(".");
    decimalPartRaw = decimalPartRaw ?? "".padEnd(totalDecimal, "0");
  } else {
    // cut decimal manually
    const split = String(num).split(".");
    integerPart = split[0];
    decimalPartRaw = (split[1] || "")
      .slice(0, totalDecimal)
      .padEnd(totalDecimal, "0");
  }

  let formattedInteger: string;

  if (indianFormat) {
    separator = ",";
    separatorDecimals = ".";
    formattedInteger =
      (suffixCurrency.trim().length ? suffixCurrency : "") +
      formatIndianNumber({ numStr: integerPart, separator });
  } else {
    formattedInteger =
      (suffixCurrency.trim().length ? suffixCurrency : "") +
      integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  if (decimal && !isUndefined(decimalPartRaw) && totalDecimal > 0) {
    let formattedDecimal = separatorDecimals + decimalPartRaw;
    if (endDecimal) formattedDecimal += suffixDecimal;
    formattedInteger += formattedDecimal;
  }

  // negative format
  if (rawNum < 0) {
    if (negativeFormat === "dash") {
      formattedInteger = "-" + formattedInteger;
    } else if (negativeFormat === "brackets") {
      formattedInteger = "(" + formattedInteger + ")";
    } else if (negativeFormat === "abs") {
      // no sign
    } else if (isPlainObject(negativeFormat)) {
      if (hasOwnProp(negativeFormat, "custom")) {
        const formatCustomNegative = negativeFormat.custom;

        if (!isFunction(formatCustomNegative)) {
          throw new TypeError(
            `Parameter \`negativeFormat.custom\` property of the \`options\` (second parameter) must be of type function: \`(formatted: string) => string\`, but received: \`${getPreciseType(
              formatCustomNegative
            )}\`.`
          );
        }

        const result = formatCustomNegative(formattedInteger);

        assertIsString(result, {
          message: ({ currentType, validType }) =>
            `Parameter \`negativeFormat.custom\` property of the \`options\` (second parameter) expected return a \`${validType}\` type value, but received: \`${currentType}\`.`
        });

        formattedInteger = result;
      } else {
        const formatStyleNegative = negativeFormat.style || "dash";
        const formatSpaceNegative = !isUndefined(negativeFormat.space)
          ? negativeFormat.space
          : false;

        assertIsBoolean(formatSpaceNegative, {
          message: ({ currentType, validType }) =>
            `Parameter \`negativeFormat.space\` property of the \`options\` (second parameter) must be of type \`${validType} or undefined\`, but received: \`${currentType}\`.`
        });

        if (
          !(
            formatStyleNegative === "abs" ||
            formatStyleNegative === "brackets" ||
            formatStyleNegative === "dash"
          )
        ) {
          throw new TypeError(
            `Parameter \`negativeFormat.style\` property of the \`options\` (second parameter) must be of type \`string\` must be of type "abs" | "brackets" | "dash", but received: \`${getPreciseType(
              formatStyleNegative
            )}\`, with value: \`${safeStableStringify(formatStyleNegative, {
              keepUndefined: true
            })}\`.`
          );
        }

        switch (formatStyleNegative) {
          case "dash":
            formattedInteger =
              "-" + (formatSpaceNegative ? " " : "") + formattedInteger;
            break;
          case "brackets":
            formattedInteger = formatSpaceNegative
              ? `( ${formattedInteger} )`
              : `(${formattedInteger})`;
            break;
          case "abs":
            // no sign
            break;
        }
      }
    }
  }

  return formattedInteger;
};
