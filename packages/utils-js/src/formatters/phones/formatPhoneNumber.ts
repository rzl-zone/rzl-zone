import type {
  FormatPhoneNumberMain,
  FormatPhoneNumberTakeNumberOnly,
  FormatPhoneNumberCheckValidOnly,
  FormatPhoneNumberTransform,
  ValueFormatPhoneNumber,
  FormatPhoneNumberAllPassing,
  FormatPhoneNumberAllPassingValidOnly,
  FormatPhoneNumberAllPassingTakeOnly,
  OutputFormat
} from "./_private/formatPhoneNumber.types";

import { isSupportedCountry } from "libphonenumber-js/max";

import { createMessage } from "@/_private/logger";

import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import { isNil } from "@/predicates/is/isNil";
import { isNumber } from "@/predicates/is/isNumber";
import { isString } from "@/predicates/is/isString";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import {
  parsingAsYouType,
  isValidParseAsYouType
} from "./_private/formatPhoneNumber.utils";

/** -------------------------------------------------------
 * * ***Utility: `formatPhoneNumber`.***
 * --------------------------------------------------------
 * **Formats a phone number into a customizable local or international style.**
 *
 * ---
 * - **Type:** ***`Formatting Number`.***
 * - **Can also:**
 *     - Return only digits string when **digits-only mode** (`takeNumberOnly`):
 *       - Return empty-string (""), if invalid number phone.
 *     - Return boolean when **validity-check mode** (`checkValidOnly`):
 *       - ***Return `true` if:***
 *            - A phone number is "valid" when it has valid length, and the actual phone number digits match the
 *              regular expressions for its country (parameter options `defaultCountry`).
 * - **E.164 compliance:**
 *     - Optional leading `+` is recommended but **not required**.
 *     - If Without leading `+`, you must passing `defaultCountry`.
 *
 * ---
 * @param {ValueFormatPhoneNumber} value
 *  ***Phone number to format, accepts:***
 *     - `string` (recommended to preserve leading zeros).
 *     - `number` (leading zeros will be lost).
 *     - `null` or `undefined` (returns empty string).
 * @param {FormatPhoneNumberMain} [options]
 *  ***Main options object controlling:***
 *     - `separator` (**string**): Group separator, default `" "`.
 *     - `plusNumberCountry` (**string**): Country code with optional leading `+`.
 *     - `openingNumberCountry` (**string**): Characters before the country code, e.g. `"("`.
 *     - `closingNumberCountry` (**string**): Characters after the country code, e.g. `")"`.
 *     - `checkValidOnly` (**boolean**): Return only validity.
 *     - `takeNumberOnly` (**boolean**): Return digits only.
 *     - `defaultCountry` (**string** - **`<ISO-3166-1 alpha-2>`**): Used to interpret numbers without an explicit `+<countryCode>`.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `value` is not string, number, null or undefined.
 * @throws **{@link TypeError | `TypeError`}** if `options` is not an object or contains wrong types.
 *
 * ---
 * @returns {string|boolean} Formatted phone number string, digits-only string, or boolean.
 *
 * ---
 * @example
 *
 * 1. #### *Formatting Phone Number String:*
 *    ```ts
 *    formatPhoneNumber("081234567890");
 *    // ➔ "0812 3456 7890"
 *    formatPhoneNumber("081234567890", {
 *      separator: "-",
 *      plusNumberCountry: "+44",
 *      openingNumberCountry: "(",
 *      closingNumberCountry: ")"
 *    });
 *    // ➔ "(+44) 8123-4567-890"
 *    ```
 *    ---
 * 2. #### *Digits-Only Mode:*
 *    ```ts
 *    formatPhoneNumber("(0812) 3456-7890", {
 *      takeNumberOnly: true,
 *      defaultCountry: "ID"
 *    });
 *    // ➔ "081234567890"
 *    formatPhoneNumber("(0812) 3456-7890", { takeNumberOnly: true });
 *    // ➔ ""
 *    formatPhoneNumber("(63) 917 123 4567", {
 *      takeNumberOnly: true,
 *      defaultCountry: "PH"
 *    });
 *    // ➔ "0917 123 4567"
 *    formatPhoneNumber("(63) 4567-8901", {
 *      takeNumberOnly: true,
 *      defaultCountry: "PH"
 *    });
 *    // ➔ "" // is not valid number from PH.
 *    formatPhoneNumber("(63) 917 123 4567", { takeNumberOnly: true });
 *    // ➔ ""
 *    formatPhoneNumber("49 (151) 2345 6789", {
 *      takeNumberOnly: true,
 *      defaultCountry: "DE"
 *    });
 *    // ➔ "015123456789"
 *    formatPhoneNumber("49 (151) 2345 6789", { takeNumberOnly: true });
 *    // ➔ ""
 *    ```
 *    ---
 * 3. #### *Validity-Check Mode:*
 *    ```ts
 *    formatPhoneNumber("+6281234567890", { checkValidOnly: true });
 *    // ➔ true
 *    formatPhoneNumber("0812-3456-7890", {
 *      checkValidOnly: true,
 *      defaultCountry: "ID"
 *    });
 *    // ➔ true
 *    formatPhoneNumber("0812 3456 7890", { checkValidOnly: true });
 *    // ➔ false
 *    formatPhoneNumber("(0812) 3456-7890", {
 *      checkValidOnly: true,
 *      defaultCountry: "ID"
 *    });
 *    // ➔ true
 *    formatPhoneNumber("(0812) 3456-7890", { checkValidOnly: true});
 *    // ➔ false
 *    formatPhoneNumber("+44 20 7946 0958", { checkValidOnly: true });
 *    // ➔ true
 *    formatPhoneNumber("+1 (800) 123-4567", { checkValidOnly: true });
 *    // ➔ true
 *    formatPhoneNumber("+62.812.3456.7890", { checkValidOnly: true });
 *    // ➔ true
 *    formatPhoneNumber("+62(812)3456-7890", { checkValidOnly: true });
 *    // ➔ true
 *    formatPhoneNumber("+62abc123", { checkValidOnly: true });
 *    // ➔ false
 *    formatPhoneNumber("invalid@@@", { checkValidOnly: true });
 *    // ➔ false
 *    formatPhoneNumber("0812-3456-hello", { checkValidOnly: true });
 *    // ➔ false
 *    ```
 */
export function formatPhoneNumber(
  value: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberTransform
): string;
/** -------------------------------------------------------
 * * ***Utility: `formatPhoneNumber`.***
 * --------------------------------------------------------
 * **Formats a phone number into a customizable local or international style.**
 *
 * ---
 * - **Type:** ***`Digits-only Mode`.***
 * - **Can also:**
 *     - Return only digits string when **digits-only mode** (`takeNumberOnly`).
 *     - Return boolean when **validity-check mode** (`checkValidOnly`) using a
 *       regex for international-style phone numbers:
 *       - ***Valid if:***
 *            - Only contains digits, optional leading `+`, spaces, parentheses `()`,
 *              hyphens `-`, or dots `.`.
 *            - Digits-only length < 16.
 * - **E.164 compliance:**
 *     - Optional leading `+` is recommended but **not required**.
 *     - If Without leading `+`, you must passing `defaultCountry`.
 *
 * ---
 * @param {ValueFormatPhoneNumber} value
 *   Phone number to format. Accepts:
 *    - `string` (recommended to preserve leading zeros).
 *    - `number` (leading zeros will be lost).
 *    - `null` or `undefined` (returns empty string).
 * @param {FormatPhoneNumberTakeNumberOnly} [options] Options to customize format output (country code, separator, etc).
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `value` is not string, number, null or undefined.
 * @throws **{@link TypeError | `TypeError`}** if `options` is not an object or contains wrong types.
 *
 * ---
 * @returns {string} Digits-only mode, return string a digits-only.
 *
 * ---
 * @example
 * ```ts
 * formatPhoneNumber("(0812) 3456-7890", {
 *   takeNumberOnly: true,
 *   defaultCountry: "ID"
 * });
 * // ➔ "081234567890"
 * formatPhoneNumber("(0812) 3456-7890", { takeNumberOnly: true });
 * // ➔ ""
 * formatPhoneNumber("(63) 917 123 4567", {
 *   takeNumberOnly: true,
 *   defaultCountry: "PH"
 * });
 * // ➔ "0917 123 4567"
 * formatPhoneNumber("(63) 4567-8901", {
 *   takeNumberOnly: true,
 *   defaultCountry: "PH"
 * });
 * // ➔ "" // is not valid number from PH.
 * formatPhoneNumber("(63) 917 123 4567", { takeNumberOnly: true });
 * // ➔ ""
 * formatPhoneNumber("49 (151) 2345 6789", {
 *   takeNumberOnly: true,
 *   defaultCountry: "DE"
 * });
 * // ➔ "015123456789"
 * formatPhoneNumber("49 (151) 2345 6789", { takeNumberOnly: true });
 * // ➔ ""
 * ```
 */
export function formatPhoneNumber(
  value: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberTakeNumberOnly
): string;
/** -------------------------------------------------------
 * * ***Utility: `formatPhoneNumber`.***
 * --------------------------------------------------------
 * **Formats a phone number into a customizable local or international style.**
 *
 * ---
 * - **Type:** ***`Validity-check Mode`.***
 * - **Can also:**
 *     - Return only digits string when **digits-only mode** (`takeNumberOnly`).
 *     - Return boolean when **validity-check mode** (`checkValidOnly`) using a
 *       regex for international-style phone numbers:
 *       - ***Valid if:***
 *            - Only contains digits, optional leading `+`, spaces, parentheses `()`,
 *              hyphens `-`, or dots `.`.
 *            - Digits-only length < 16.
 * - **E.164 compliance:**
 *     - Optional leading `+` is recommended but **not required**.
 *     - If Without leading `+`, you must passing `defaultCountry`.
 *
 * ---
 * @param {ValueFormatPhoneNumber} value
 *  Phone number to format. Accepts:
 *   - `string` (recommended to preserve leading zeros).
 *   - `number` (leading zeros will be lost).
 *   - `null` or `undefined` (returns empty string).
 * @param {FormatPhoneNumberTakeNumberOnly} [options] Options to customize format output (country code, separator, etc).
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `value` is not string, number, null or undefined.
 * @throws **{@link TypeError | `TypeError`}** if `options` is not an object or contains wrong types.
 *
 * ---
 * @returns {boolean} Validity-check mode, return a boolean.
 *
 * ---
 * @example
 * ```ts
 * formatPhoneNumber("+6281234567890", { checkValidOnly: true });
 * // ➔ true
 * formatPhoneNumber("0812-3456-7890", {
 *   checkValidOnly: true,
 *   defaultCountry: "ID"
 * });
 * // ➔ true
 * formatPhoneNumber("0812 3456 7890", { checkValidOnly: true });
 * // ➔ false
 * formatPhoneNumber("(0812) 3456-7890", {
 *   checkValidOnly: true,
 *   defaultCountry: "ID"
 * });
 * // ➔ true
 * formatPhoneNumber("(0812) 3456-7890", { checkValidOnly: true});
 * // ➔ false
 * formatPhoneNumber("+44 20 7946 0958", { checkValidOnly: true });
 * // ➔ true
 * formatPhoneNumber("+1 (800) 123-4567", { checkValidOnly: true });
 * // ➔ true
 * formatPhoneNumber("+62.812.3456.7890", { checkValidOnly: true });
 * // ➔ true
 * formatPhoneNumber("+62(812)3456-7890", { checkValidOnly: true });
 * // ➔ true
 * formatPhoneNumber("+62abc123", { checkValidOnly: true });
 * // ➔ false
 * formatPhoneNumber("invalid@@@", { checkValidOnly: true });
 * // ➔ false
 * formatPhoneNumber("0812-3456-hello", { checkValidOnly: true });
 * // ➔ false
 * ```
 */
export function formatPhoneNumber(
  value: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberCheckValidOnly
): boolean;
/** -------------------------------------------------------
 * * ***Utility: `formatPhoneNumber`.***
 * --------------------------------------------------------
 * **Formats a phone number into a customizable local or international style.**
 *
 * ---
 * - **Type:** ***Forced to `Validity-check Mode`***, because `checkValidOnly` has set to `true`.
 * - **Can also:**
 *     - Return only digits string when **digits-only mode** (`takeNumberOnly`).
 *     - Return boolean when **validity-check mode** (`checkValidOnly`) using a
 *       regex for international-style phone numbers:
 *       - ***Valid if:***
 *            - Only contains digits, optional leading `+`, spaces, parentheses `()`,
 *              hyphens `-`, or dots `.`.
 *            - Digits-only length < 16.
 * - **E.164 compliance:**
 *     - Optional leading `+` is recommended but **not required**.
 *     - If Without leading `+`, you must passing `defaultCountry`.
 *
 * ---
 * @param {ValueFormatPhoneNumber} value
 *  Phone number to format. Accepts:
 *   - `string` (recommended to preserve leading zeros).
 *   - `number` (leading zeros will be lost).
 *   - `null` or `undefined` (returns empty string).
 * @param {FormatPhoneNumberTakeNumberOnly} [options] Options to customize format output (country code, separator, etc).
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `value` is not string, number, null or undefined.
 * @throws **{@link TypeError | `TypeError`}** if `options` is not an object or contains wrong types.
 *
 * ---
 * @returns {boolean} Validity-check mode, return a boolean.
 *
 * ---
 * @example
 * ```ts
 * formatPhoneNumber("+6281234567890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("0812-3456-7890", {
 *   defaultCountry: "ID",
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("0812 3456 7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 * });
 * // ➔ false
 * formatPhoneNumber("(0812) 3456-7890", {
 *   defaultCountry: "ID",
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("(0812) 3456-7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true
 * });
 * // ➔ false
 * formatPhoneNumber("+44 20 7946 0958", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true
 * });
 * // ➔ true
 * formatPhoneNumber("+1 (800) 123-4567", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true
 * });
 * // ➔ true
 * formatPhoneNumber("+62.812.3456.7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true
 * });
 * // ➔ true
 * formatPhoneNumber("+62(812)3456-7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true
 * });
 * // ➔ true
 * formatPhoneNumber("+62abc123", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true
 * });
 * // ➔ false
 * formatPhoneNumber("invalid@@@", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true
 * });
 * // ➔ false
 * formatPhoneNumber("0812-3456-hello", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true
 * });
 * // ➔ false
 * ```
 */
export function formatPhoneNumber(
  value: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberAllPassingValidOnly
): boolean;
/** -------------------------------------------------------
 * * ***Utility: `formatPhoneNumber`.***
 * --------------------------------------------------------
 * **Formats a phone number into a customizable local or international style.**
 *
 * ---
 * - **Type:** ***Forced to `Digits-only Mode`***, because `takeNumberOnly` has set to `true`.
 * - **Can also:**
 *     - Return only digits string when **digits-only mode** (`takeNumberOnly`).
 *     - Return boolean when **validity-check mode** (`checkValidOnly`) using a
 *       regex for international-style phone numbers:
 *       - ***Valid if:***
 *            - Only contains digits, optional leading `+`, spaces, parentheses `()`,
 *              hyphens `-`, or dots `.`.
 *            - Digits-only length < 16.
 * - **E.164 compliance:**
 *     - Optional leading `+` is recommended but **not required**.
 *     - If Without leading `+`, you must passing `defaultCountry`.
 *
 * ---
 * @param {ValueFormatPhoneNumber} value
 *  Phone number to format. Accepts:
 *   - `string` (recommended to preserve leading zeros)
 *   - `number` (leading zeros will be lost)
 *   - `null` or `undefined` (returns empty string).
 * @param {FormatPhoneNumberTakeNumberOnly} [options] Options to customize format output (country code, separator, etc).
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `value` is not string, number, null or undefined.
 * @throws **{@link TypeError | `TypeError`}** if `options` is not an object or contains wrong types.
 *
 * ---
 * @returns {string} Digits-only mode, return string a digits-only.
 *
 * ---
 * @example
 * ```ts
 * formatPhoneNumber("(0812) 3456-7890", {
 *   defaultCountry: "ID",
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ "081234567890"
 * formatPhoneNumber("(0812) 3456-7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ ""
 * formatPhoneNumber("(63) 917 123 4567", {
 *   defaultCountry: "PH",
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ "0917 123 4567"
 * formatPhoneNumber("(63) 4567-8901", {
 *   defaultCountry: "PH",
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ "" // is not valid number from PH.
 * formatPhoneNumber("(63) 917 123 4567", { takeNumberOnly: true });
 * // ➔ ""
 * formatPhoneNumber("49 (151) 2345 6789", {
 *   defaultCountry: "DE",
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ "015123456789"
 * formatPhoneNumber("49 (151) 2345 6789", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ ""
 * ```
 */
export function formatPhoneNumber(
  value: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberAllPassingTakeOnly
): string;
/** -------------------------------------------------------
 * * ***Utility: `formatPhoneNumber`.***
 * --------------------------------------------------------
 * **Formats a phone number into a customizable local or international style.**
 *
 * ---
 * - **Type:** ***Forced to `Validity-check Mode`***, because `checkValidOnly` and `takeNumberOnly` has set to `true`,
 *   but `checkValidOnly` will prioritize one.
 * - **Can also:**
 *     - Return only digits string when **digits-only mode** (`takeNumberOnly`).
 *     - Return boolean when **validity-check mode** (`checkValidOnly`) using a
 *       regex for international-style phone numbers:
 *       - ***Valid if:***
 *            - Only contains digits, optional leading `+`, spaces, parentheses `()`,
 *              hyphens `-`, or dots `.`.
 *            - Digits-only length < 16.
 * - **E.164 compliance:**
 *     - Optional leading `+` is recommended but **not required**.
 *     - If Without leading `+`, you must passing `defaultCountry`.
 *
 * ---
 * @param {ValueFormatPhoneNumber} value
 *  Phone number to format. Accepts:
 *   - `string` (recommended to preserve leading zeros).
 *   - `number` (leading zeros will be lost).
 *   - `null` or `undefined` (returns empty string).
 * @param {FormatPhoneNumberTakeNumberOnly} [options] Options to customize format output (country code, separator, etc).
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `value` is not string, number, null or undefined.
 * @throws **{@link TypeError | `TypeError`}** if `options` is not an object or contains wrong types.
 *
 * ---
 * @returns {boolean} Validity-check mode, return a boolean.
 *
 * ---
 * @example
 * ```ts
 * formatPhoneNumber("+6281234567890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("0812-3456-7890", {
 *   defaultCountry: "ID",
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("0812 3456 7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ false
 * formatPhoneNumber("(0812) 3456-7890", {
 *   defaultCountry: "ID",
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("(0812) 3456-7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ false
 * formatPhoneNumber("+44 20 7946 0958", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("+1 (800) 123-4567", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("+62.812.3456.7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("+62(812)3456-7890", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ true
 * formatPhoneNumber("+62abc123", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ false
 * formatPhoneNumber("invalid@@@", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ false
 * formatPhoneNumber("0812-3456-hello", {
 *   // Formatting Phone Number Options
 *   separator: "-",
 *   // Validity-check Mode
 *   checkValidOnly: true,
 *   // Digits-only Mode
 *   takeNumberOnly: true,
 * });
 * // ➔ false
 * ```
 */
export function formatPhoneNumber(
  value: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberAllPassing
): boolean;
export function formatPhoneNumber(
  value: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberMain
): string | boolean {
  if (isNil(value)) return "";

  if (!isString(value) && !isNumber(value)) {
    throw new TypeError(
      errorMsg(
        `First parameter (\`value\`) must be of type \`string\`, \`number\`, \`null\` or \`undefined\`, but received: \`${getPreciseType(
          value
        )}\`.`
      )
    );
  }

  if (!isPlainObject(options)) options = {};

  const takeNumberOnly = options.takeNumberOnly ?? false;
  const checkValidOnly = options.checkValidOnly ?? false;
  const defaultCountry: typeof options.defaultCountry =
    options.defaultCountry ?? undefined;

  const separator = options.separator ?? " ";
  const prependPlusCountryCode = options.prependPlusCountryCode ?? true;
  const outputFormat: OutputFormat = options.outputFormat ?? "INTERNATIONAL";
  const openingNumberCountry = options.openingNumberCountry ?? "";
  const closingNumberCountry = options.closingNumberCountry ?? "";

  if (
    !isBoolean(takeNumberOnly) ||
    !isBoolean(checkValidOnly) ||
    !isBoolean(prependPlusCountryCode)
  ) {
    throw new TypeError(
      errorMsg(
        `Parameter \`takeNumberOnly\`, \`checkValidOnly\` and \`prependPlusCountryCode\` property of the \`options\` (second parameter) must be of type \`boolean\` or unset as \`undefined\` value, but received: ['takeNumberOnly': \`${getPreciseType(
          takeNumberOnly
        )}\`, 'checkValidOnly': \`${getPreciseType(
          checkValidOnly
        )}\`, 'prependPlusCountryCode': \`${getPreciseType(prependPlusCountryCode)}\`].`
      )
    );
  }

  if (!isUndefined(defaultCountry) && !isSupportedCountry(defaultCountry)) {
    throw new TypeError(
      errorMsg(
        `Parameter \`defaultCountry\` property of the \`options\` (second parameter) must be of type \`string\` as \`CountryCode\` (ISO-3166-1 alpha-2) or unset as \`undefined\` value, but received: \`${getPreciseType(
          defaultCountry
        )}\`, with value: \`${safeStableStringify(defaultCountry, {
          keepUndefined: true
        })}\`.\n\nSee: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements, for all ISO 3166-1 alpha-2 code.`
      )
    );
  }

  if (
    !["INTERNATIONAL", "NATIONAL", "RFC3966", "E.164"].includes(outputFormat)
  ) {
    throw new TypeError(
      errorMsg(
        `Parameter \`outputFormat\` property of the \`options\` (second parameter) must be of type \`string\` as \`OutputFormat\` ("NATIONAL" | "INTERNATIONAL" | "E.164" | "RFC3966") or unset as \`undefined\` (default value to: \`INTERNATIONAL\`) value, but received: \`${getPreciseType(
          outputFormat
        )}\`, with value: ${safeStableStringify(outputFormat, { keepUndefined: true })}.`
      )
    );
  }

  if (
    !isString(separator) ||
    !isString(openingNumberCountry) ||
    !isString(closingNumberCountry)
  ) {
    throw new TypeError(
      errorMsg(
        `Parameter \`separator\`, \`plusNumberCountry\`, \`openingNumberCountry\` and \`closingNumberCountry\` property of the \`options\` (second parameter) must be of type \`string\` or unset as \`undefined\` value, but received: ['separator': \`${getPreciseType(
          separator
        )}\`,'openingNumberCountry': \`${getPreciseType(
          openingNumberCountry
        )}\`, 'closingNumberCountry': \`${getPreciseType(closingNumberCountry)}\`].`
      )
    );
  }

  if (!isString(value)) value = String(value);

  const parsedPhoneNumber = parsingAsYouType(value, defaultCountry);
  const validPhoneNumber = isValidParseAsYouType(parsedPhoneNumber);

  if (checkValidOnly) return validPhoneNumber;

  // todo: return empty-string is invalid phone-number input.
  if (!validPhoneNumber) return "";

  if (takeNumberOnly) {
    return parsedPhoneNumber.getNumber().formatNational().replace(/\D/g, "");
  }

  const num = parsedPhoneNumber.getNumber();
  // Result example: "+49 1512 3456789"
  const intlNumb = num.format(outputFormat);

  if (outputFormat === "INTERNATIONAL") {
    // Split to: ["+49", "1512", "3456789"]
    const [cc, ...rest] = intlNumb.split(" ");
    const countryCode = prependPlusCountryCode ? cc : cc?.replace(/^\++/, "");
    const restWithSeparator = rest.join(separator);

    if (!countryCode) return restWithSeparator;

    if (
      isNonEmptyString(openingNumberCountry) &&
      isNonEmptyString(closingNumberCountry)
    ) {
      return `${openingNumberCountry}${countryCode}${closingNumberCountry} ${restWithSeparator}`;
    }

    return `${countryCode} ${restWithSeparator}`;
  }

  if (outputFormat === "NATIONAL") {
    const restWithSeparator = intlNumb.split(" ").join(separator);

    return `${restWithSeparator}`;
  }

  return intlNumb;
}

/**
 * @internal ***`Not part of the public API.`***
 */
const errorMsg = (msg: string) => createMessage("formatPhoneNumber", msg);
