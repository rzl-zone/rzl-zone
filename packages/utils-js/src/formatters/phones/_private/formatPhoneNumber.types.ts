import type { CountryCode, NumberFormat } from "libphonenumber-js";
import type {
  ExtractStrict,
  OverrideTypes,
  Prettify
} from "@rzl-zone/ts-types-plus";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { formatPhoneNumber } from "../formatPhoneNumber";

/** -------------------------------------------------------
 * * ***Output format mode for {@link formatPhoneNumber|`formatPhoneNumber`}.***
 * -------------------------------------------------------
 * - `'E.164'`      ➔ `+6281234567890`
 * - `'RFC3966'`    ➔ `tel:+62-812-3456-7890`
 * - `'NATIONAL'`   ➔ `0812 3456 7890`
 * - `'INTERNATIONAL'` ➔ `+62 812 3456 7890`
 */
export type OutputFormat = ExtractStrict<
  NumberFormat,
  "INTERNATIONAL" | "NATIONAL" | "RFC3966" | "E.164"
>;

/** -------------------------------------------------------
 * * ***Single input value for {@link formatPhoneNumber|`formatPhoneNumber`}.***
 * -------------------------------------------------------
 * - **Accepts:**
 *    - `string` — e.g. `"0812 3456 7890"`
 *    - `number` — e.g. `81234567890`
 *    - `null` or `undefined` — represents no input
 * - **ℹ️ Notes**
 *    - The function normalizes all **non-digit characters** (spaces, dots, dashes,
 *      parentheses, etc.) before validation/formatting.
 *    - When you pass a `number`, any **leading zeros are lost by JavaScript**.
 *      - Prefer using a `string` if the number may begin with `0`.
 *    - E.164 international standard allows **up to 15 digits** (not counting `+`).
 */
export type ValueFormatPhoneNumber = string | number | null | undefined;

/** -------------------------------------------------------
 * * ***Base option set for {@link formatPhoneNumber|`formatPhoneNumber`}.***
 * -------------------------------------------------------
 * **All properties are optional.**
 * @description
 * Defaults apply when a property is omitted or `undefined`.
 *
 * **⚠️ Overload-aware notes:**
 *    - If `checkValidOnly` is `true`, **all other properties are ignored**.
 *    - If `takeNumberOnly` is `true`, **all formatting properties are ignored**.
 *    - The leading `+` is **recommended** but not required;
 *      the regex will still validate numbers without `+`
 *      as long as the digit count ≤ **15**.
 */
export type FormatPhoneNumberMain = {
  /** -------------------------------------------------------
   * * ***Separator for formatted output.***
   * -------------------------------------------------------
   * **Defines the string used to separate groups of digits**
   * in the formatted phone number.
   * - **Default:** `" "`.
   * - **Executed only when:**
   *    - Parameter options `checkValidOnly` and `takeNumberOnly` are both `false`.
   *      - (This option is ignored if either `checkValidOnly` or `takeNumberOnly` is `true`.)
   * - **Behavior:**
   *    - The formatter inserts this separator between number blocks
   *      according to the selected `outputFormat`.
   * @default " "
   * @example
   * ```ts
   * // Using dash as separator
   * formatPhoneNumber("081234567890", { defaultCountry: "ID", separator: "-" });
   * // ➔ "+62 812-3456-7890"
   *
   * // Using space as separator
   * formatPhoneNumber("(151) 2345-6789", { defaultCountry: "DE", separator: " " });
   * // ➔ "+49 1512 3456789"
   * ```
   */
  separator?: string;

  /** -------------------------------------------------------
   * * ***Output format style for the returned phone number.***
   * -------------------------------------------------------
   * **Determines how the formatted phone number string is returned.**
   *
   * - **Default:** `"INTERNATIONAL"`.
   * - **Applicable only when:**
   *    - Parameter options `checkValidOnly` and `takeNumberOnly`
   *      are both **`false`**.
   *      - (Ignored if either of those options is `true`.)
   *
   * - **Supported values (from {@link NumberFormat}):**
   *    - `"NATIONAL"` – Local/national format, e.g. `0812 3456 7890`.
   *    - `"INTERNATIONAL"` – International format with leading plus, e.g. `+62 812 3456 7890`.
   *    - `"E.164"` – Compact E.164 format, e.g. `+6281234567890`.
   *    - `"RFC3966"` – RFC 3966 URI format, e.g. `tel:+62-812-3456-7890`.
   *
   * @default "INTERNATIONAL"
   * @example
   * ```ts
   * // Returns a national-format string
   * formatPhoneNumber("+62 81234567890", { outputFormat: "NATIONAL" });
   * // ➔ "0812 3456 7890"
   *
   * // Returns an E.164-format string
   * formatPhoneNumber("+62 81234567890", { outputFormat: "E.164" });
   * // ➔ "+6281234567890"
   * ```
   */
  outputFormat?: OutputFormat;

  /** -------------------------------------------------------
   * * ***Prepend a plus sign and country calling code.***
   * -------------------------------------------------------
   * **Forces the returned phone number to start with a leading `+`
   * followed by the detected country calling code (e.g. `+63`, `+1`).**
   * - **Default:** `true`.
   * - **Executed only when:**
   *    - Parameter options `outputFormat` is set to `"INTERNATIONAL"`.
   *      - (This option is ignored for `"NATIONAL"`, `"E.164"` or `"RFC3966"` formats.).
   * - **Applicable when:**
   *    - You want to guarantee that the result
   *      always contains a plus sign and country code, regardless of
   *      the selected `outputFormat`.
   * - **Behavior:**
   *    - When `true`, the formatter ensures the output begins with
   *      a `+` and the correct country code.
   *    - When `false`, the output follows the chosen `outputFormat`
   *      without forcing a `+` prefix.
   * @default true
   * @example
   * ```ts
   * // Automatically adds +63 (default: `true`) even if input is local format
   * formatPhoneNumber("09171234567", {
   *   country: "PH",
   *   prependPlusCountryCode: true
   * });
   * // ➔ "+63 917 123 4567"
   *
   * formatPhoneNumber("09171234567", {
   *   country: "PH",
   *   prependPlusCountryCode: false
   * });
   * // ➔ "63 917 123 4567"
   *
   * // Leaves number in national format (no plus sign)
   * formatPhoneNumber("+63 9171234567", {
   *   country: "PH",
   *   prependPlusCountryCode: false,
   *   outputFormat: "NATIONAL"
   * });
   * // ➔ "0917 123 4567"
   * ```
   */
  prependPlusCountryCode?: boolean;

  /** -------------------------------------------------------
   * * ***Characters before the country code (e.g. `"("`).***
   * -------------------------------------------------------
   * **Adds a custom string that appears **immediately before** the
   * international country calling code when formatting.**
   * - **Default:** `""` (empty string).
   * - **Behavior:**
   *    - **Active only when:**
   *        - `checkValidOnly` is **false**,
   *        - `takeNumberOnly` is **false**, **and**
   *        - `outputFormat` is `"INTERNATIONAL"`.
   *    - **Ignored if:**
   *        - The value is an empty string (after trimming),
   *        - `checkValidOnly` or `takeNumberOnly` is `true`,
   *        - `outputFormat` is not `"INTERNATIONAL"`,
   *        - `closingNumberCountry` is `undefined` or an empty string (after trimming).
   * - **Invalid input:**
   *    - Returns no effect if the phone number is invalid or not compatible
   *      with the selected `defaultCountry`.
   * @default ""
   * @example
   * ```ts
   * formatPhoneNumber("+63 9171234567", {
   *   outputFormat: "INTERNATIONAL",
   *   openingNumberCountry: "(",
   *   closingNumberCountry: ")"
   * });
   * // ➔ "(+63) 917 123 4567"
   * ```
   */
  openingNumberCountry?: string;

  /** -------------------------------------------------------
   * * ***Characters after the country code (e.g. `")"`).***
   * -------------------------------------------------------
   * **Adds a custom string that appears **immediately after** the
   * international country calling code when formatting.**
   * - **Default:** `""` (empty string).
   * - **Behavior:**
   *    - **Active only when:**
   *        - `checkValidOnly` is **false**,
   *        - `takeNumberOnly` is **false**, **and**
   *        - `outputFormat` is `"INTERNATIONAL"`.
   *    - **Ignored if:**
   *        - The value is an empty string (after trimming),
   *        - `checkValidOnly` or `takeNumberOnly` is `true`,
   *        - `outputFormat` is not `"INTERNATIONAL"`,
   *        - `openingNumberCountry` is `undefined` or an empty string (after trimming).
   * - **Invalid input:**
   *   Returns no effect if the phone number is invalid or not compatible
   *   with the selected `defaultCountry`.
   * @default ""
   * @example
   * ```ts
   * formatPhoneNumber("+63 9171234567", {
   *   outputFormat: "INTERNATIONAL",
   *   openingNumberCountry: "(",
   *   closingNumberCountry: ")"
   * });
   * // ➔ "(+63) 917 123 4567"
   * ```
   */
  closingNumberCountry?: string;

  /** -------------------------------------------------------
   * * ***Return only a boolean validity flag.***
   * -------------------------------------------------------
   * - ***Behavior:***
   *    - **Exclusive mode:**
   *      - ⚠️ When `true`, all formatting options and `takeNumberOnly` must be omitted or are ignored.
   *    - Conflicts with `takeNumberOnly`:
   *      - ⚠️ When `checkValidOnly` is `true` and all formatting options and `takeNumberOnly` must be
   *        omitted or are ignored.
   *      - But if mistake passing props:
   *        - ⚠️ When `checkValidOnly` is `true` and other of formatting options was passing:
   *          - If `takeNumberOnly` is `true` or `false`:
   *            - Will return a `boolean` because `checkValidOnly` is prioritize first.
   *    - Output:
   *      - Boolean ➔ (`true` or `false`).
   * - ***DefaultValue: false***
   * @default false
   * @example
   * ```ts
   * // Returns `true` if valid number and number with country code (no need `defaultCountry`)
   * formatPhoneNumber("+63 912-123-4567", { checkValidOnly: true });
   * // ➔ true
   *
   * // Returns `true` if valid number and number without country code but with `defaultCountry`
   * formatPhoneNumber("213-373-4253", { defaultCountry: "US", checkValidOnly: true });
   * // ➔ true
   *
   * // Returns `false` if without country code.
   * formatPhoneNumber("213-373-4253", { checkValidOnly: true });
   * // ➔ false
   *
   * // Returns `false` for invalid number.
   * formatPhoneNumber("abcd", { checkValidOnly: true });
   * // ➔ false
   * ```
   */
  checkValidOnly?: boolean;

  /** -------------------------------------------------------
   * * ***Return only the digits of the phone number (local number only).***
   * -------------------------------------------------------
   * **Returns a string containing only numeric characters** from the **local number**,
   * ignoring any country code, spaces, plus signs, or separators.
   * - **Default:** `false`
   * - **Behavior:**
   *    - **Exclusive mode:**
   *        - ⚠️ When set to `true`, all formatting options
   *          (`outputFormat`, `prependPlusCountryCode`, etc.)
   *          and `checkValidOnly` **must be omitted** or will be **ignored**.
   *    - **Conflict handling with `checkValidOnly`:**
   *        - If both `takeNumberOnly` and `checkValidOnly` are `true`,
   *          `checkValidOnly` takes priority and the function
   *          returns a `boolean`.
   *        - If `checkValidOnly` is `false` (or not provided),
   *          and `takeNumberOnly` is `true`,
   *          the function returns a **numeric string of the local number**.
   *    - **Invalid input:**
   *        - If the input is invalid or cannot be parsed
   *          (e.g. not matching the `defaultCountry`),
   *          the function returns an **empty string** (`""`).
   * - **Output example:**
   *   - Valid input ➔ `"81234567890"`  // country code removed
   *   - Invalid input ➔ `""`
   * @default false
   * @example
   * ```ts
   * // Returns only digits of the local number with country code (no need `defaultCountry`)
   * formatPhoneNumber("+63 912-123-4567", { takeNumberOnly: true });
   * // ➔ "09121234567"
   *
   * // Returns only digits of the local number without country code but with `defaultCountry`
   * formatPhoneNumber("213-373-4253", { defaultCountry: "US", takeNumberOnly: true });
   * // ➔ "2133734253"
   *
   * // Returns empty string if without country code.
   * formatPhoneNumber("213-373-4253", { takeNumberOnly: true });
   * // ➔ ""
   *
   * // Returns empty string for invalid number.
   * formatPhoneNumber("abcd", { takeNumberOnly: true });
   * // ➔ ""
   * ```
   */
  takeNumberOnly?: boolean;

  /** -------------------------------------------------------
   * * ***A "country code" is a two-letter ISO ([`ISO-3166-1 alpha-2`](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements)) country code (like `"US"` | `"ID"` | `"DE"`).***
   * -------------------------------------------------------
   * **Used to interpret numbers without an explicit `+<countryCode>`.**
   * - ***Behavior:***
   *    - Required if the input without country code (`+`).
   *    - Ignored if the input already starts with `+`.
   * - ***Examples:***
   *      - `"ID"` ➔ Indonesian.
   *      - `"US"` ➔ United States.
   *      - `"GB"` ➔ United Kingdom.
   * - ***DefaultValue: `undefined`***.
   * @example
   * formatPhoneNumber("081234567890", { defaultCountry: "ID" });
   * @default undefined
   */
  defaultCountry?: CountryCode;
};

/** -------------------------------------------------------
 * * ***Specialized options for the `transformPhoneNumber` variant of {@link formatPhoneNumber|`formatPhoneNumber`}.***
 * -------------------------------------------------------
 * **Ensures that `checkValidOnly` and `takeNumberOnly` are both
 * forced to `false` when transforming/formatting.**
 *
 * This type is intended for scenarios where you **must** receive a formatted
 * string as output and never a `boolean` or digit-only result.
 *
 * **Example Output:** `+62 812 3456 7890`
 */
export type FormatPhoneNumberTransform = OverrideTypes<
  FormatPhoneNumberMain,
  {
    /** -------------------------------------------------------
     * * ***Return only a boolean validity flag.***
     * -------------------------------------------------------
     * - ***Behavior:***
     *    - **Exclusive mode:**
     *      - ⚠️ When `true`, all formatting options and `takeNumberOnly` must be omitted or are ignored.
     *    - Conflicts with `takeNumberOnly`:
     *      - ⚠️ When `checkValidOnly` is `true` and all formatting options and `takeNumberOnly` must be
     *        omitted or are ignored.
     *      - But if mistake passing props:
     *        - ⚠️ When `checkValidOnly` is `true` and other of formatting options was passing:
     *          - If `takeNumberOnly` is `true` or `false`:
     *            - Will return a `boolean` because `checkValidOnly` is prioritize first.
     *    - Output:
     *      - Boolean ➔ (`true` or `false`).
     * - ***DefaultValue: false***
     * @default false
     * @requires `false` or `undefined`
     */
    checkValidOnly?: never;
    /** -------------------------------------------------------
     * * ***Return only the digits of the phone number (local number only).***
     * -------------------------------------------------------
     * **Returns a string containing only numeric characters** from the **local number**,
     * ignoring any country code, spaces, plus signs, or separators.
     * - **Default:** `false`
     * - **Behavior:**
     *    - **Exclusive mode:**
     *        - ⚠️ When set to `true`, all formatting options
     *          (`outputFormat`, `prependPlusCountryCode`, etc.)
     *          and `checkValidOnly` **must be omitted** or will be **ignored**.
     *    - **Conflict handling with `checkValidOnly`:**
     *        - If both `takeNumberOnly` and `checkValidOnly` are `true`,
     *          `checkValidOnly` takes priority and the function
     *          returns a `boolean`.
     *        - If `checkValidOnly` is `false` (or not provided),
     *          and `takeNumberOnly` is `true`,
     *          the function returns a **numeric string of the local number**.
     *    - **Invalid input:**
     *        - If the input is invalid or cannot be parsed
     *          (e.g. not matching the `defaultCountry`),
     *          the function returns an **empty string** (`""`).
     * - **Output example:**
     *   - Valid input ➔ `"81234567890"`  // country code removed
     *   - Invalid input ➔ `""`
     * @default false
     * @requires `false` or `undefined`
     */
    takeNumberOnly?: never;
  }
>;

type NeverForRestFormatPhoneNumberTransform = {
  /** -------------------------------------------------------
   * * ***Not used in this mode **`(Never allowed in this mode)`**.***
   * -------------------------------------------------------
   * - ***Behavior:***
   *    - **Exclusive mode:**
   *      - ⚠️ When `true`, all formatting options must be omitted or are ignored.
   *    - Conflicts with `takeNumberOnly` and `checkValidOnly`:
   *      - If both `takeNumberOnly` and `checkValidOnly` are `true`,
   *        `checkValidOnly` takes priority and the function
   *        returns a `boolean`.
   *      - If `checkValidOnly` is `false` (or not provided),
   *        and `takeNumberOnly` is `true`,
   *        the function returns a **numeric string of the local number**.
   * @requires `undefined`
   */
  separator?: never;
  /** -------------------------------------------------------
   * * ***Not used in this mode **`(Never allowed in this mode)`**.***
   * -------------------------------------------------------
   * - ***Behavior:***
   *    - **Exclusive mode:**
   *      - ⚠️ When `true`, all formatting options must be omitted or are ignored.
   *    - Conflicts with `takeNumberOnly` and `checkValidOnly`:
   *      - If both `takeNumberOnly` and `checkValidOnly` are `true`,
   *        `checkValidOnly` takes priority and the function
   *        returns a `boolean`.
   *      - If `checkValidOnly` is `false` (or not provided),
   *        and `takeNumberOnly` is `true`,
   *        the function returns a **numeric string of the local number**.
   *
   * @requires `undefined`
   */
  openingNumberCountry?: never;
  /** -------------------------------------------------------
   * * ***Not used in this mode **`(Never allowed in this mode)`**.***
   * -------------------------------------------------------
   * - ***Behavior:***
   *    - **Exclusive mode:**
   *      - ⚠️ When `true`, all formatting options must be omitted or are ignored.
   *    - Conflicts with `takeNumberOnly` and `checkValidOnly`:
   *      - If both `takeNumberOnly` and `checkValidOnly` are `true`,
   *        `checkValidOnly` takes priority and the function
   *        returns a `boolean`.
   *      - If `checkValidOnly` is `false` (or not provided),
   *        and `takeNumberOnly` is `true`,
   *        the function returns a **numeric string of the local number**.
   *
   * @requires `undefined`
   */
  closingNumberCountry?: never;
};

/** -------------------------------------------------------
 * * ***Options subset for **validity-check mode** of
 * {@link formatPhoneNumber|`formatPhoneNumber`}.***
 * -------------------------------------------------------
 * Only `checkValidOnly` is allowed.
 * All formatting-related properties are **intentionally disallowed**
 * to avoid mixing validation with formatting.
 *
 * **Example Usage:**
 * ```ts
 * formatPhoneNumber("+6281234567890", { checkValidOnly: true }) // boolean
 * ```
 */
export type FormatPhoneNumberCheckValidOnly = Prettify<
  OverrideTypes<
    FormatPhoneNumberMain,
    {
      /** -------------------------------------------------------
       * * ***Return only a boolean validity flag.***
       * -------------------------------------------------------
       * - ***Behavior:***
       *    - **Exclusive mode:**
       *      - ⚠️ When `true`, all formatting options and `takeNumberOnly` must be omitted or are ignored.
       *    - Conflicts with `takeNumberOnly`:
       *      - ⚠️ When `checkValidOnly` is `true` and all formatting options and `takeNumberOnly` must be
       *        omitted or are ignored.
       *      - But if mistake passing props:
       *        - ⚠️ When `checkValidOnly` is `true` and other of formatting options was passing:
       *          - If `takeNumberOnly` is `true` or `false`:
       *            - Will return a `boolean` because `checkValidOnly` is prioritize first.
       *    - Output:
       *      - Boolean ➔ (`true` or `false`).
       * - ***DefaultValue: false***
       * @default false
       */
      checkValidOnly: true;
      /** -------------------------------------------------------
       * * ***Return only the digits of the phone number (local number only).***
       * -------------------------------------------------------
       * **Returns a string containing only numeric characters** from the **local number**,
       * ignoring any country code, spaces, plus signs, or separators.
       * - **Default:** `false`
       * - **Behavior:**
       *    - **Exclusive mode:**
       *        - ⚠️ When set to `true`, all formatting options
       *          (`outputFormat`, `prependPlusCountryCode`, etc.)
       *          and `checkValidOnly` **must be omitted** or will be **ignored**.
       *    - **Conflict handling with `checkValidOnly`:**
       *        - If both `takeNumberOnly` and `checkValidOnly` are `true`,
       *          `checkValidOnly` takes priority and the function
       *          returns a `boolean`.
       *        - If `checkValidOnly` is `false` (or not provided),
       *          and `takeNumberOnly` is `true`,
       *          the function returns a **numeric string of the local number**.
       *    - **Invalid input:**
       *        - If the input is invalid or cannot be parsed
       *          (e.g. not matching the `defaultCountry`),
       *          the function returns an **empty string** (`""`).
       * - **Output example:**
       *   - Valid input ➔ `"81234567890"`  // country code removed
       *   - Invalid input ➔ `""`
       * @default false
       * @requires `false` or `undefined`
       */
      takeNumberOnly?: false;
    } & NeverForRestFormatPhoneNumberTransform
  >
>;

/** -------------------------------------------------------
 * * ***Options subset for calling {@link formatPhoneNumber|`formatPhoneNumber`} in
 * **digits-only mode**.***
 * -------------------------------------------------------
 * **Only `takeNumberOnly` is allowed; all other formatting options are
 * intentionally disallowed.**
 *
 * Use this when you want a pure numeric string without any separators or country
 * decorations, but still want the function to normalize the input.
 *
 * **Example Output:** `"6281234567890"`
 */
export type FormatPhoneNumberTakeNumberOnly = Prettify<
  OverrideTypes<
    FormatPhoneNumberMain,
    {
      /** -------------------------------------------------------
       * * ***Return only a boolean validity flag.***
       * -------------------------------------------------------
       * - ***Behavior:***
       *    - **Exclusive mode:**
       *      - ⚠️ When `true`, all formatting options and `takeNumberOnly` must be omitted or are ignored.
       *    - Conflicts with `takeNumberOnly`:
       *      - ⚠️ When `checkValidOnly` is `true` and all formatting options and `takeNumberOnly` must be
       *        omitted or are ignored.
       *      - But if mistake passing props:
       *        - ⚠️ When `checkValidOnly` is `true` and other of formatting options was passing:
       *          - If `takeNumberOnly` is `true` or `false`:
       *            - Will return a `boolean` because `checkValidOnly` is prioritize first.
       *    - Output:
       *      - Boolean ➔ (`true` or `false`).
       * - ***DefaultValue: false***
       * @default false
       * @requires `false` or `undefined`
       */
      checkValidOnly?: false;

      /** -------------------------------------------------------
       * * ***Return only the digits of the phone number (local number only).***
       * -------------------------------------------------------
       * **Returns a string containing only numeric characters** from the **local number**,
       * ignoring any country code, spaces, plus signs, or separators.
       * - **Default:** `false`
       * - **Behavior:**
       *    - **Exclusive mode:**
       *        - ⚠️ When set to `true`, all formatting options
       *          (`outputFormat`, `prependPlusCountryCode`, etc.)
       *          and `checkValidOnly` **must be omitted** or will be **ignored**.
       *    - **Conflict handling with `checkValidOnly`:**
       *        - If both `takeNumberOnly` and `checkValidOnly` are `true`,
       *          `checkValidOnly` takes priority and the function
       *          returns a `boolean`.
       *        - If `checkValidOnly` is `false` (or not provided),
       *          and `takeNumberOnly` is `true`,
       *          the function returns a **numeric string of the local number**.
       *    - **Invalid input:**
       *        - If the input is invalid or cannot be parsed
       *          (e.g. not matching the `defaultCountry`),
       *          the function returns an **empty string** (`""`).
       * - **Output example:**
       *   - Valid input ➔ `"81234567890"`  // country code removed
       *   - Invalid input ➔ `""`
       * @default false
       */
      takeNumberOnly: true;
    } & NeverForRestFormatPhoneNumberTransform
  >
>;

/** -------------------------------------------------------
 * * ***Options subset for calling {@link formatPhoneNumber|`formatPhoneNumber`} force to **Validity-check Mode**.***
 * -------------------------------------------------------
 */
export type FormatPhoneNumberAllPassing = OverrideTypes<
  FormatPhoneNumberMain,
  {
    /** -------------------------------------------------------
     * * ***Return only a boolean validity flag.***
     * -------------------------------------------------------
     * - ***Behavior:***
     *    - **Exclusive mode:**
     *      - ⚠️ When `true`, all formatting options and `takeNumberOnly` must be omitted or are ignored.
     *    - Conflicts with `takeNumberOnly`:
     *      - ⚠️ When `checkValidOnly` is `true` and all formatting options and `takeNumberOnly` must be
     *        omitted or are ignored.
     *      - But if mistake passing props:
     *        - ⚠️ When `checkValidOnly` is `true` and other of formatting options was passing:
     *          - If `takeNumberOnly` is `true` or `false`:
     *            - Will return a `boolean` because `checkValidOnly` is prioritize first.
     *    - Output:
     *      - Boolean ➔ (`true` or `false`).
     * - ***DefaultValue: false***
     * @default false
     */
    checkValidOnly: true;
    /** -------------------------------------------------------
     * * ***Return only the digits of the phone number (local number only).***
     * -------------------------------------------------------
     * **Returns a string containing only numeric characters** from the **local number**,
     * ignoring any country code, spaces, plus signs, or separators.
     * - **Default:** `false`
     * - **Behavior:**
     *    - **Exclusive mode:**
     *        - ⚠️ When set to `true`, all formatting options
     *          (`outputFormat`, `prependPlusCountryCode`, etc.)
     *          and `checkValidOnly` **must be omitted** or will be **ignored**.
     *    - **Conflict handling with `checkValidOnly`:**
     *        - If both `takeNumberOnly` and `checkValidOnly` are `true`,
     *          `checkValidOnly` takes priority and the function
     *          returns a `boolean`.
     *        - If `checkValidOnly` is `false` (or not provided),
     *          and `takeNumberOnly` is `true`,
     *          the function returns a **numeric string of the local number**.
     *    - **Invalid input:**
     *        - If the input is invalid or cannot be parsed
     *          (e.g. not matching the `defaultCountry`),
     *          the function returns an **empty string** (`""`).
     * - **Output example:**
     *   - Valid input ➔ `"81234567890"`  // country code removed
     *   - Invalid input ➔ `""`
     * @default false
     * @requires `false` or `undefined`
     */
    takeNumberOnly: true;
  }
>;

/** -------------------------------------------------------
 * * ***Options subset for calling {@link formatPhoneNumber|`formatPhoneNumber`} force to **Validity-check Mode**.***
 * -------------------------------------------------------
 */
export type FormatPhoneNumberAllPassingValidOnly = OverrideTypes<
  FormatPhoneNumberMain,
  {
    /** -------------------------------------------------------
     * * ***Return only a boolean validity flag.***
     * -------------------------------------------------------
     * - ***Behavior:***
     *    - **Exclusive mode:**
     *      - ⚠️ When `true`, all formatting options and `takeNumberOnly` must be omitted or are ignored.
     *    - Conflicts with `takeNumberOnly`:
     *      - ⚠️ When `checkValidOnly` is `true` and all formatting options and `takeNumberOnly` must be
     *        omitted or are ignored.
     *      - But if mistake passing props:
     *        - ⚠️ When `checkValidOnly` is `true` and other of formatting options was passing:
     *          - If `takeNumberOnly` is `true` or `false`:
     *            - Will return a `boolean` because `checkValidOnly` is prioritize first.
     *    - Output:
     *      - Boolean ➔ (`true` or `false`).
     * - ***DefaultValue: false***
     * @default false
     */
    checkValidOnly: true;
    /** -------------------------------------------------------
     * * ***Return only the digits of the phone number (local number only).***
     * -------------------------------------------------------
     * **Returns a string containing only numeric characters** from the **local number**,
     * ignoring any country code, spaces, plus signs, or separators.
     * - **Default:** `false`
     * - **Behavior:**
     *    - **Exclusive mode:**
     *        - ⚠️ When set to `true`, all formatting options
     *          (`outputFormat`, `prependPlusCountryCode`, etc.)
     *          and `checkValidOnly` **must be omitted** or will be **ignored**.
     *    - **Conflict handling with `checkValidOnly`:**
     *        - If both `takeNumberOnly` and `checkValidOnly` are `true`,
     *          `checkValidOnly` takes priority and the function
     *          returns a `boolean`.
     *        - If `checkValidOnly` is `false` (or not provided),
     *          and `takeNumberOnly` is `true`,
     *          the function returns a **numeric string of the local number**.
     *    - **Invalid input:**
     *        - If the input is invalid or cannot be parsed
     *          (e.g. not matching the `defaultCountry`),
     *          the function returns an **empty string** (`""`).
     * - **Output example:**
     *   - Valid input ➔ `"81234567890"`  // country code removed
     *   - Invalid input ➔ `""`
     * @default false
     * @requires `false` or `undefined`
     */
    takeNumberOnly?: false;
  }
>;

/** -------------------------------------------------------
 * * ***Options subset for calling {@link formatPhoneNumber|`formatPhoneNumber`} force to **Digits-only Mode**.***
 * -------------------------------------------------------
 */
export type FormatPhoneNumberAllPassingTakeOnly = OverrideTypes<
  FormatPhoneNumberMain,
  {
    /** -------------------------------------------------------
     * * ***Return only a boolean validity flag.***
     * -------------------------------------------------------
     * - ***Behavior:***
     *    - **Exclusive mode:**
     *      - ⚠️ When `true`, all formatting options and `takeNumberOnly` must be omitted or are ignored.
     *    - Conflicts with `takeNumberOnly`:
     *      - ⚠️ When `checkValidOnly` is `true` and all formatting options and `takeNumberOnly` must be
     *        omitted or are ignored.
     *      - But if mistake passing props:
     *        - ⚠️ When `checkValidOnly` is `true` and other of formatting options was passing:
     *          - If `takeNumberOnly` is `true` or `false`:
     *            - Will return a `boolean` because `checkValidOnly` is prioritize first.
     *    - Output:
     *      - Boolean ➔ (`true` or `false`).
     * - ***DefaultValue: false***
     * @default false
     * @requires `false` or `undefined`
     */
    checkValidOnly?: false;
    /** -------------------------------------------------------
     * * ***Return only the digits of the phone number (local number only).***
     * -------------------------------------------------------
     * **Returns a string containing only numeric characters** from the **local number**,
     * ignoring any country code, spaces, plus signs, or separators.
     * - **Default:** `false`
     * - **Behavior:**
     *    - **Exclusive mode:**
     *        - ⚠️ When set to `true`, all formatting options
     *          (`outputFormat`, `prependPlusCountryCode`, etc.)
     *          and `checkValidOnly` **must be omitted** or will be **ignored**.
     *    - **Conflict handling with `checkValidOnly`:**
     *        - If both `takeNumberOnly` and `checkValidOnly` are `true`,
     *          `checkValidOnly` takes priority and the function
     *          returns a `boolean`.
     *        - If `checkValidOnly` is `false` (or not provided),
     *          and `takeNumberOnly` is `true`,
     *          the function returns a **numeric string of the local number**.
     *    - **Invalid input:**
     *        - If the input is invalid or cannot be parsed
     *          (e.g. not matching the `defaultCountry`),
     *          the function returns an **empty string** (`""`).
     * - **Output example:**
     *   - Valid input ➔ `"81234567890"`  // country code removed
     *   - Invalid input ➔ `""`
     * @default false
     */
    takeNumberOnly: true;
  }
>;
