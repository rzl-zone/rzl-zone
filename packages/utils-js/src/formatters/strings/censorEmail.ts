import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";
import { _censor, hashSeedGenerate } from "./_private/censorEmail.utils";

type CensorEmailOptions = {
  /** ----------------------------------------------------------
   * * ***Censorship Mode.***
   * ----------------------------------------------------------
   * - **Valid value:**
   *    - `"fixed"` (default) – Deterministic censorship based on a hash of the email, same input always produces the same output.
   *    - `"random"` – Each character is randomly replaced every time the function is called.
   */
  mode?: "random" | "fixed";
};

/** ----------------------------------------------------------
 * * ***Utility: `censorEmail`.***
 * ----------------------------------------------------------
 * **Censors an email by replacing characters with `"*"` while supporting random or fixed mode.**
 * - **This function replaces parts of an email with asterisks to protect privacy.**
 *    - **Modes:**
 *        - `"fixed"` (default) – Deterministic censorship based on a hash of the email, same input always produces the same output.
 *        - `"random"` – Each character is randomly replaced every time the function is called.
 *    - **ℹ️ Note:**
 *        - Invalid emails or non-string input will return an empty-string (`""`).
 * @param {string | null | undefined} email - The email address to censor.
 * @param {CensorEmailOptions} [options={}] - Options object for mode.
 * @returns {string} The censored email, or an empty string if input is invalid.
 * @throws **{@link TypeError | `TypeError`}** if `options` is not a plain object or `mode` is invalid.
 * @example
 * // Fixed mode (default, deterministic)
 * censorEmail("john.doe@gmail.com");
 * // ➔ "j**n.**e@g***l.com"
 *
 * // Fixed mode explicitly
 * censorEmail("john.doe@gmail.com", { mode: "fixed" });
 * // ➔ "j**n.**e@g***l.com"
 *
 * // Random mode (output may vary each time)
 * censorEmail("john.doe@gmail.com", { mode: "random" });
 * // ➔ "j*hn.***e@g***l.com" (random)
 *
 * // Invalid email returns empty string
 * censorEmail("invalid-email");
 * // ➔ ""
 */
export const censorEmail = (
  email: string | null | undefined,
  options: CensorEmailOptions = {}
): string => {
  if (!isNonEmptyString(email)) return "";

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const mode = hasOwnProp(options, "mode") ? options.mode : "fixed";

  // Ensure mode is either "random" or "fixed"
  if (mode !== "random" && mode !== "fixed") {
    throw new TypeError(
      `Parameter \`mode\` property of the \`options\` (second parameter) must be one of "fixed" or "random", but received: \`${getPreciseType(
        mode
      )}\`, with value: \`${safeStableStringify(mode, {
        keepUndefined: true
      })}\`.`
    );
  }

  // Strict email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "";

  const [local, domain] = email.split("@");
  const domainParts = domain.split("."); // Handle multi-level domain (e.g., example.co.uk)
  if (domainParts.length < 2) return ""; // Invalid domain structure

  const [domainName, ...tldParts] = domainParts;
  const tld = tldParts.join(".");

  const hashSeed = hashSeedGenerate(mode, email);

  const localMinCensor = local.length < 4 ? 1 : 2;
  const domainMinCensor = domainName.length < 4 ? 1 : 2;

  const censoredLocal = _censor(local, localMinCensor, 0.6, hashSeed);
  const censoredDomain = _censor(domainName, domainMinCensor, 0.5, hashSeed);
  const censoredTLD = tld.length <= 2 ? tld : _censor(tld, 1, 0.4, hashSeed);

  return `${censoredLocal}@${censoredDomain}.${censoredTLD}`;
};
