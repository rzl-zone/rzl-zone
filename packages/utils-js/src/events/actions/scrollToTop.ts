import { isNumber } from "@/predicates/is/isNumber";
import { isServer } from "@/predicates/is/isServer";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/**
 * ***Types options for {@link scrollToTop | `scrollToTop`}.***
 */
type ScrollToTopOptions = {
  /** ----------------------------------------------------------
   * * ***Scroll animation type.***
   * -----------------------------------------------------------
   * - ***Behavior:***
   *      - Valid values: `"auto"`, `"instant"`, `"smooth"`.
   *      - Default force to `"smooth"` if missing or invalid.
   *
   * ---
   * @default "smooth"
   */
  behavior?: ScrollBehavior | undefined;

  /** ----------------------------------------------------------
   * * ***Delay before scrolling (in milliseconds).***
   * -----------------------------------------------------------
   * - ***Behavior:***
   *      - Default value is `1`.
   *      - Valid values: any number `≥` `1`.
   *      - Non-integer number are truncated to an integer.
   *      - Force to `2147483647` if number is larger than `2147483647`.
   *      - Default force to `1` if `missing`, `NaN`, `invalid-type`, or `less-than` `1`.
   *
   * ---
   * @default 1
   */
  timeout?: number | undefined;
};

/** ----------------------------------------------------------
 * * ***Utility: `scrollToTop`.***
 * -----------------------------------------------------------
 * **Scrolls the page to the top with optional smooth animation and delay.**
 *
 * ---
 * - **Features**:
 *     - This function works **only in browser environments** (no effect on server-side).
 *     - It leverages the native `window.scrollTo()` API with support for smooth scrolling
 *       and an optional timeout delay before executing the scroll.
 *     - Each option has strict valid values:
 *         - If an invalid value is provided, the function **automatically falls back to its default**.
 *
 * ---
 * @param {ScrollToTopOptions} [options] - Optional settings for scroll behavior.
 * @param {ScrollToTopOptions["behavior"]} [options.behavior="smooth"] - Scroll animation type.
 *   - Valid values: `"auto"`, `"instant"`, `"smooth"`.
 *   - Default force to `"smooth"` if missing or invalid.
 * @param {ScrollToTopOptions["timeout"]} [options.timeout=1] - Delay before scrolling (in milliseconds).
 *   - Default value is `1`.
 *   - Valid values: any number `≥` `1`.
 *   - Non-integer number are truncated to an integer.
 *   - Force to `2147483647` if number is larger than `2147483647`.
 *   - Default force to `1` if `missing`, `NaN`, `invalid`, or `less-than` `1`.
 *
 * ---
 * @returns {void} Does not return anything, only scrolling to top (void).
 *
 * ---
 * @example
 *
 * 1. #### Default behavior:
 *    ```ts
 *    scrollToTop();
 *    // ➔ Scroll smoothly to the top after 1ms delay
 *    ```
 *    ---
 * 2. #### Instant scroll:
 *    ```ts
 *    scrollToTop({
 *      behavior: "instant"
 *    });
 *    // ➔ Jump instantly to the top
 *    ```
 *    ---
 * 3. #### Custom timeout:
 *    ```ts
 *    scrollToTop({
 *      timeout: 500
 *    });
 *    // ➔ Scroll smoothly to the top after 500ms
 *    ```
 *    ---
 * 4. #### Invalid options with fallback values:
 *    ```ts
 *    scrollToTop({
 *      behavior: "fly",
 *      timeout: -100
 *    });
 *    // ➔ Fallback: behavior="smooth", timeout=1
 *    ```
 *    ---
 * 5. #### Invalid behavior with decimal timeout:
 *    ```ts
 *    scrollToTop({
 *      behavior: "fly",
 *      timeout: 123.55
 *    });
 *    // ➔ Fallback: behavior="smooth", timeout=123
 *    ```
 */
export const scrollToTop = (options?: ScrollToTopOptions): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  // Ensure options is an object and Defensive options check
  if (!isPlainObject(options)) options = {};

  const behavior: ScrollBehavior =
    options.behavior &&
    isNonEmptyString(options.behavior) &&
    ["auto", "instant", "smooth"].includes(options.behavior)
      ? options.behavior
      : "smooth";
  let timeout =
    options.timeout && isNumber(options.timeout) && options.timeout >= 1
      ? options.timeout
      : 1;

  timeout = timeout > 2147483647 ? 2147483647 : timeout;

  setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior }), timeout);
};
