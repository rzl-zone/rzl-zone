import { assertIsString } from "@rzl-zone/utils-js/assertions";
import { hasOwnProp, isPlainObject } from "@rzl-zone/utils-js/predicates";
import { removeSpaces } from "@rzl-zone/utils-js/strings";
import { formatEnvPort } from "@rzl-zone/utils-js/urls";

type OptionsGetBeApiUrl = {
  /** * ***The Suffix origin base api url, e.g:`http://localhost.com/api`, default: `"/"`.***
   *
   * @default "/"
   */
  suffix?: string;
};

/** ---------------------------------------------------
 * * ***Utility for NextJS: `getBeApiUrl`.***
 * ---------------------------------------------------
 *
 * **This function determines the backend API base URL from the `NEXT_PUBLIC_BACKEND_API_URL` environment variable (retrieves the base API URL of the backend).**
 * - **Behavior:**
 *    - If the variable is not set, it defaults to `"http://localhost:8000"`.
 *    - It also allows adding an optional suffix to the returned URL.
 * - ***⚠️ Warning:***
 *    - ***This function only support when using ***[`NextJS`](https://nextjs.org/)***.***
 *
 * @description
 * This function determines the backend API base URL from the `NEXT_PUBLIC_BACKEND_API_URL` environment variable.
 * - If `NEXT_PUBLIC_BACKEND_API_URL` is not set, it defaults to `"http://localhost:8000"`.
 * - If `NEXT_PUBLIC_BACKEND_API_URL` does **not** contain a port, it appends one from `NEXT_PUBLIC_PORT_BE` if available.
 * - Supports appending optional suffix (like `"/api"`).
 *
 * @param {OptionsGetBeApiUrl|undefined} options - Configuration options.
 * @param {OptionsGetBeApiUrl["suffix"]} [options.suffix="/"] - The suffix to append to the base API URL.
 *
 * @returns {string} The formatted backend API base URL.
 *
 * @throws **{@link TypeError | `TypeError`}** if `suffix` is not a `string`.
 * @throws **{@link Error | `Error`}** if `NEXT_PUBLIC_BACKEND_API_URL` is invalid.
 *
 * @example
 * // With NEXT_PUBLIC_BACKEND_API_URL set at `*.env` file
 * NEXT_PUBLIC_BACKEND_API_URL = "https://api.example.com";
 * getBeApiUrl();
 * // ➔ "https://api.example.com/"
 *
 * // With NEXT_PUBLIC_BACKEND_API_URL but no port, using NEXT_PUBLIC_PORT_BE at `*.env` file
 * NEXT_PUBLIC_BACKEND_API_URL = "http://localhost";
 * NEXT_PUBLIC_PORT_BE = "5000";
 * getBeApiUrl({ suffix: "/api" });
 * // ➔ "http://localhost:5000/api"
 *
 * // Without NEXT_PUBLIC_BACKEND_API_URL at `*.env` file (defaults to localhost:8000)
 * delete NEXT_PUBLIC_BACKEND_API_URL;
 * getBeApiUrl({ suffix: "/v1" });
 * // ➔ "http://localhost:8000/v1"
 */
export const getBeApiUrl = (options: OptionsGetBeApiUrl = {}): string => {
  if (!isPlainObject(options)) options = {};

  let suffix = hasOwnProp(options, "suffix") ? options.suffix : "/";

  // Ensure suffix is a string
  assertIsString(suffix, {
    message({ currentType, validType }) {
      return `Parameter \`suffix\` property of the first parameter must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  try {
    let rawBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL?.trim();

    if (rawBaseUrl) {
      rawBaseUrl = removeSpaces(rawBaseUrl);

      const urlObj = new URL(rawBaseUrl);
      const hasPort = !!urlObj.port;

      if (!hasPort && process.env.NEXT_PUBLIC_PORT_BE) {
        rawBaseUrl =
          urlObj.origin +
          formatEnvPort(process.env.NEXT_PUBLIC_PORT_BE, {
            prefixColon: true
          });
      }
    } else {
      // fallback
      rawBaseUrl =
        "http://localhost" +
        formatEnvPort(process.env.NEXT_PUBLIC_PORT_BE || "8000", {
          prefixColon: true
        });
    }

    suffix = removeSpaces(suffix).length ? removeSpaces(suffix) : "/";
    const baseApiUrl = new URL(rawBaseUrl.replace(/\/+$/, "")).origin;

    const finalSuffix =
      suffix === "/"
        ? "/"
        : `${suffix.startsWith("/") ? "" : "/"}${suffix.replace(/\/+$/, "")}`;

    return `${baseApiUrl}${finalSuffix}`;
  } catch (error) {
    throw new Error(
      "Invalid `NEXT_PUBLIC_BACKEND_API_URL`, failed to generate from `getBeApiUrl()`, Error:" +
        error,
      { cause: error }
    );
  }
};
