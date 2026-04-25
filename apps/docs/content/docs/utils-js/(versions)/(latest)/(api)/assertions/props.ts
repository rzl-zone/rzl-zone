import type { Prettify } from "@rzl-zone/ts-types-plus";

/** @version 3.11.0
 *
 * @default []
 */
type DefaultOptionsAssertion = {
  /** **The value to validate.**
   *
   * @default -
   */
  value: unknown;

  /** **Optional configuration:**
   *
   *   - [`message`](#message): Custom message or message generator function for assertion failure.
   *   - [`errorType`](#error-type): The JavaScript built-in error type to throw.
   *   - [`formatCase`](#format-case): Controls how detected type names are formatted in error messages.
   *   - [`useAcronyms`](#use-acronyms): Control uppercase preservation of recognized acronyms during formatting.
   *
   * @default { message: string; errorType: "TypeError"; formatCase: "toKebabCase"; useAcronyms: false }
   * @link [OptionsAssertIs](#options)
   */
  options?: {
    /**
     * Custom error message or message generator function.
     *
     * @default "Parameter input (`value`) must be of type `<validType>`, but received `<currentType>`."
     */
    message?:
      | string
      | (({
          currentType,
          validType
        }: {
          currentType: string;
          validType: string;
        }) => string);
    /**
     * Type of error to throw when assertion fails.
     *
     * @default "TypeError"
     */
    errorType?:
      | "Error"
      | "EvalError"
      | "RangeError"
      | "ReferenceError"
      | "SyntaxError"
      | "TypeError"
      | "URIError";
    /**
     * Case formatting style for type names in error messages.
     *
     * @default "toKebabCase"
     */
    formatCase?:
      | "toPascalCaseSpace"
      | "toPascalCase"
      | "toCamelCase"
      | "toKebabCase"
      | "toSnakeCase"
      | "toDotCase"
      | "slugify"
      | "toLowerCase";
    /**
     * Control uppercase preservation of recognized acronyms during formatting.
     *
     * @default false
     */
    useAcronyms?: boolean;
  };
};

//! BOOLEAN
/** @version 3.11.0 */
export type AssertIsBoolean = Prettify<DefaultOptionsAssertion>;

//! NUMBER
/** @version 3.11.0 */
export type AssertIsBigInt = Prettify<DefaultOptionsAssertion>;

type OptionsAssertIsNumber = Prettify<
  DefaultOptionsAssertion & {
    includeNaN?: boolean;
  }
>;
/** @version 3.11.0 */
export type AssertIsNumber = Prettify<OptionsAssertIsNumber>;

//! STRING
/** @version 3.11.0 */
export type AssertIsString = Prettify<DefaultOptionsAssertion>;

//! OBJECT
//? Array
/** @version 3.11.0 */
export type AssertIsArray = Prettify<DefaultOptionsAssertion>;
//? Plain-Object
/** @version 3.11.0 */
export type AssertIsPlainObject = Prettify<DefaultOptionsAssertion>;
