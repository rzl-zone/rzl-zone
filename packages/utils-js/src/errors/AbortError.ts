import { isNonEmptyString } from "@/predicates";

type AbortErrorOptions = {
  /** -------------------------------------------------------------------
   * * ***Optional text inserted before `"AbortError"`.***
   * --------------------------------------------------------------------
   * Empty strings and whitespace-only values are ignored.
   *
   * ---
   * @default ""
   */
  prefix?: string;

  /** -------------------------------------------------------------------
   * * ***Optional text inserted after `"AbortError"`.***
   * --------------------------------------------------------------------
   *
   * Empty strings and whitespace-only values are ignored.
   *
   * ---
   * @default ""
   */
  suffix?: string;
};

/** ---------------------------------------------------------------------
 * * ***Class: `AbortError`.***
 * ----------------------------------------------------------------------
 * **Custom error type used for cancellation-related operations.**
 *
 * ---
 * - **Behavior:**
 *     - Extends the native ***`Error`*** class.
 *     - Provides a consistent abort error shape across runtimes.
 *     - Useful for Promise-based utilities that support
 *       cancellation via ***`AbortSignal`***.
 *     - Uses `"AbortError"` as the base error name.
 *     - Supports optional `prefix` and `suffix`
 *       for contextual error naming.
 *
 * ---
 *
 * @extends Error - Extending `Error` Class.
 *
 * ---
 * @param {string} [message="The operation was aborted"]
 * The error message describing the abort reason.
 *
 * @param {object} [options]
 * Optional configuration object.
 *
 * @param {string} [options.prefix]
 * Optional text inserted before `"AbortError"`.
 * Empty strings and whitespace-only values are ignored.
 *
 * @param {string} [options.suffix]
 * Optional text inserted after `"AbortError"`.
 * Empty strings and whitespace-only values are ignored.
 *
 * ---
 * @example
 * ```ts
 * throw new AbortError();
 * ```
 *
 * @example
 * ```ts
 * throw new AbortError(
 *   "Delay cancelled",
 *   {
 *     prefix: "Delay"
 *   }
 * );
 *
 * // Result:
 * // name -> "DelayAbortError"
 * ```
 *
 * @example
 * ```ts
 * throw new AbortError(
 *   "Queue cancelled",
 *   {
 *     suffix: ":Queue"
 *   }
 * );
 *
 * // Result:
 * // name "AbortError:Queue"
 * ```
 *
 * @example
 * ```ts
 * try {
 *   await delay(
 *     5000,
 *     controller.signal
 *   );
 * } catch (error) {
 *   if (error instanceof AbortError) {
 *     console.log(error.message);
 *   }
 * }
 * ```
 */
export class AbortError extends Error {
  /** ------------------------------------------------------------
   * * ***Constructor: `AbortError`.***
   * -------------------------------------------------------------
   * **Creates a new `AbortError` instance with optional
   * contextual error name customization.**
   *
   * ---
   * - **Behavior:**
   *     - Initializes the native ***`Error`*** base class.
   *     - Uses `"AbortError"` as the default error name.
   *     - Automatically trims `prefix` and `suffix` values.
   *     - Ignores empty or whitespace-only values.
   *     - Generates a contextual error name using:
   *       `prefix + "AbortError" + suffix`.
   *
   * ---
   * @param {string} [message="The operation was aborted"]
   * The error message describing the abort reason.
   *
   * @param {AbortErrorOptions} [options]
   * Optional configuration object.
   *
   * @param {string} [options.prefix]
   * Optional text inserted before `"AbortError"`.
   * Empty strings and whitespace-only values are ignored.
   *
   * @param {string} [options.suffix]
   * Optional text inserted after `"AbortError"`.
   * Empty strings and whitespace-only values are ignored.
   *
   * ---
   * @example
   * ```ts
   * new AbortError();
   *
   * // Result:
   * // name -> "AbortError"
   * // message -> "The operation was aborted"
   * ```
   *
   * @example
   * ```ts
   * new AbortError(
   *   "Delay cancelled",
   *   {
   *     prefix: "Delay"
   *   }
   * );
   *
   * // Result:
   * // name -> "DelayAbortError"
   * ```
   *
   * @example
   * ```ts
   * new AbortError(
   *   "Queue cancelled",
   *   {
   *     suffix: ":Queue"
   *   }
   * );
   *
   * // Result:
   * // name -> "AbortError:Queue"
   * ```
   */
  constructor(
    message: string = "The operation was aborted",
    options?: AbortErrorOptions
  ) {
    super(message);

    const prefix = isNonEmptyString(options?.prefix)
      ? `${options.prefix.trim()}`
      : "";

    const suffix = isNonEmptyString(options?.suffix)
      ? `${options.suffix.trim()}`
      : "";

    this.name = `${prefix}AbortError${suffix}`;
  }
}
