import { createMessage } from "@/_private/logger";

import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { _censor, hashSeedGenerate } from "./_private/censorEmail.utils";

type CensorEmailOptions = {
  /** ----------------------------------------------------------
   * * ***Censorship Mode.***
   * -----------------------------------------------------------
   * - **Valid value:**
   *     - `"random"` – Each character is randomly replaced every time the function is called.
   *     - `"fixed"` ***(default)*** – Deterministic censorship based on a hash of the email, same input always produces the same output.
   *
   * ---
   * @default "fixed"
   */
  mode?: "random" | "fixed";
};

/** ----------------------------------------------------------
 * * ***Utility: `censorEmail`.***
 * -----------------------------------------------------------
 * **Censors an email by replacing characters with `"*"` while supporting random or fixed mode.**
 *
 * ---
 * - **This function replaces parts of an email with asterisks to protect privacy.**
 *      - **Modes:**
 *          - `"fixed"` **(default)** – Deterministic censorship based on a hash of the email, same input always produces the same output.
 *          - `"random"` – Each character is randomly replaced every time the function is called.
 *      - **Note:**
 *          - Invalid emails or non-string input will return an empty-string (`""`).
 *
 * ---
 * @param {string | null | undefined} email - The email address to censor.
 * @param {CensorEmailOptions} [options={}] - Options object for mode.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `options` is not a plain object or `mode` is invalid.
 *
 * ---
 * @returns {string} The censored email, or an empty string if input is invalid.
 *
 * ---
 * @example
 *
 * 1. #### Fixed mode (default, deterministic):
 *    ```ts
 *    censorEmail("john.doe@gmail.com");
 *    // ➔ "j**n.**e@g***l.com"
 *    ```
 *    ---
 * 2. #### Fixed mode explicitly:
 *    ```ts
 *    censorEmail("john.doe@gmail.com", { mode: "fixed" });
 *    // ➔ "j**n.**e@g***l.com"
 *    ```
 *    ---
 * 3. #### Random mode (output may vary each time):
 *    ```ts
 *    censorEmail("john.doe@gmail.com", { mode: "random" });
 *    // ➔ "j*hn.***e@g***l.com" (random)
 *    ```
 *    ---
 * 4. #### Invalid email returns empty string:
 *    ```ts
 *    censorEmail("invalid-email");
 *    // ➔ ""
 *    ```
 */
export const censorEmail = (
  email: string | null | undefined,
  options?: CensorEmailOptions
): string => {
  if (!isNonEmptyString(email)) return "";
  if (!isPlainObject(options)) options = {};

  const mode = options.mode ?? "fixed";

  // Ensure mode is either "random" or "fixed"
  if (mode !== "random" && mode !== "fixed") {
    throw new TypeError(
      createMessage(
        "censorEmail",
        `Parameter \`mode\` property of the \`options\` (second parameter) must be one of "fixed" or "random", but received: \`${getPreciseType(
          mode
        )}\`, with value: \`${safeStableStringify(mode, {
          keepUndefined: true
        })}\`.`
      )
    );
  }

  // Strict email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "";

  const [local, domain] = email.split("@");
  const domainParts = domain?.split("."); // Handle multi-level domain (e.g., example.co.uk)
  if (!local || !domainParts || domainParts.length < 2) return ""; // Invalid domain structure

  const [domainName, ...tldParts] = domainParts;

  if (!domainName) return "";

  const tld = tldParts.join(".");

  const hashSeed = hashSeedGenerate(mode, email);

  const localMinCensor = local.length < 4 ? 1 : 2;
  const domainMinCensor = domainName.length < 4 ? 1 : 2;

  const censoredLocal = _censor(local, localMinCensor, 0.6, hashSeed);
  const censoredDomain = _censor(domainName, domainMinCensor, 0.5, hashSeed);
  const censoredTLD = tld.length <= 2 ? tld : _censor(tld, 1, 0.4, hashSeed);

  return `${censoredLocal}@${censoredDomain}.${censoredTLD}`;
};
