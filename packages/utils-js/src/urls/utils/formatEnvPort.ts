import { createMessage } from "@/_private/logger";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";

import { isEmptyString } from "@/predicates/is/isEmptyString";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type FormatEnvPortOptions = {
  /** -----------------------------------------------
   * * ***Add prefix with a colon, defaultValue: `false`.***
   * ------------------------------------------------
   *
   * - ***⚠️ Warning***:
   *      - Non-boolean values will throw `TypeError`.
   *
   * ---
   * @default false
   */
  prefixColon?: boolean;
};

/**
 * @internal ***`Not part of the public API.`***
 */
const errorMsg = (msg: string) => createMessage("formatEnvPort", msg);

/** -----------------------------------------------
 * * ***Utility: `formatEnvPort`.***
 * ------------------------------------------------
 * **Retrieves and formats an environment port variable.**
 *
 * ---
 * - **Behavior:**
 *     - Extracts only digits from the input.
 *     - If no digits found, returns an empty string.
 *     - By default does NOT prefix with a colon.
 *       - Use `{ prefixColon: true }` to prefix with a colon, invalid type `prefixColon` will throw **TypeError**.
 *
 * ---
 * @param {string | null | undefined} envVar The environment variable string.
 * @param {FormatEnvPortOptions} [options] Optional object: `{ prefixColon?: boolean }`.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `options` is not an object or `prefixColon` is not boolean.
 *
 * ---
 * @returns {string} A string like `":8080"` or `"8080"`, or `""` if no digits.
 *
 * ---
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
  if (!isNonEmptyString(envVar)) return "";

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      errorMsg(
        `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      )
  });

  const { prefixColon = false } = options;

  assertIsBoolean(prefixColon, {
    message({ currentType, validType }) {
      return errorMsg(
        `Parameter \`prefixColon\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      );
    }
  });

  const digitsOnly = envVar.replace(/\D+/g, "");
  if (isEmptyString(digitsOnly)) return "";

  return prefixColon ? `:${digitsOnly}` : digitsOnly;
};
