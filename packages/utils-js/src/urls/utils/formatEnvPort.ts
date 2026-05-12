import { isBoolean } from "@/predicates/is/isBoolean";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type FormatEnvPortOptions = {
  /** Add prefix with a colon, defaultValue: `false`.
   *
   * @default false
   */
  prefixColon?: boolean;
};

/** -----------------------------------------------
 * * ***Utility: `formatEnvPort`.***
 * -----------------------------------------------
 * **Retrieves and formats an environment port variable.**
 * - **Behavior:**
 *    - Extracts only digits from the input.
 *    - If no digits found, returns an empty string.
 *    - By default does NOT prefix with a colon.
 *      - Use `{ prefixColon: true }` to prefix with a colon.
 * @param {string | null | undefined} envVar The environment variable string.
 * @param {FormatEnvPortOptions} [options] Optional object: `{ prefixColon?: boolean }`.
 * @returns {string} A string like `":8080"` or `"8080"`, or `""` if no digits.
 * @throws **{@link TypeError | `TypeError`}** if `options` is not an object or `prefixColon` is not boolean.
 * @example
 * formatEnvPort("port:8080");
 * // ➔ "8080"
 * formatEnvPort("port:8080", { prefixColon: true });
 * // ➔ ":8080"
 */
export const formatEnvPort = (
  envVar: string | null | undefined,
  options: FormatEnvPortOptions = {}
): string => {
  if (!isNonEmptyString(envVar)) return ""; // Handle empty string case

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const prefixColon = hasOwnProp(options, "prefixColon")
    ? options.prefixColon
    : false;

  if (!isBoolean(prefixColon)) {
    throw new TypeError(
      `Parameter \`prefixColon\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: \`${getPreciseType(
        prefixColon
      )}\`.`
    );
  }

  const digitsOnly = envVar.replace(/\D+/g, "");
  if (isEmptyString(digitsOnly)) return "";

  return prefixColon ? `:${digitsOnly}` : digitsOnly;
};
