import { deepFreeze, isNonEmptyString } from "@/_internal/utils/helper";

/** ----------------------------------------------------------------
 * * ***Structured metadata for {@link ConfigurationError | `ConfigurationError`}.***
 * ----------------------------------------------------------------
 *
 * Describes machine-readable contextual information attached to a
 * {@link ConfigurationError | `ConfigurationError`} instance.
 *
 * - ***This structure is designed to:***
 *       - Provide debugging insight without parsing the error message.
 *       - Support structured logging and telemetry pipelines.
 *       - Remain extensible while preserving strong autocomplete support.
 *
 * ----------------------------------------------------------------
 * #### Common Fields:
 * ----------------------------------------------------------------
 *
 * - `received` — The actual value that failed validation.
 * - `context`  — Logical origin of the validation
 *                (e.g. function or factory name).
 *
 * Additional custom metadata may be attached as needed.
 *
 * ----------------------------------------------------------------
 * @remarks
 * - All properties are optional.
 * - This type intentionally allows arbitrary additional keys.
 * - Intended for machine-readable data (not human-facing text).
 */
export interface ConfigurationErrorDetails {
  /** * ***The actual received value that caused the validation failure.***
   *
   */
  readonly received?: unknown;

  /** * ***Logical origin of the validation (e.g. function name).***
   *
   */
  readonly context?: string;

  /** * ***Additional arbitrary metadata.***
   *
   */
  readonly [key: string]: unknown;
}

/** ----------------------------------------------------------------
 * * ***Represents a developer configuration error.***
 * ----------------------------------------------------------------
 *
 * Thrown when invalid, inconsistent, or malformed configuration
 * is detected during application or library initialization.
 *
 * This error indicates a **programmer mistake** in how a component,
 * module, or library has been configured. It should **not** be used
 * for runtime user input validation.
 *
 * ----------------------------------------------------------------
 * #### When to use?
 * ----------------------------------------------------------------
 *
 * Use `ConfigurationError` for configuration-related issues such as:
 *
 * - Invalid initialization or factory options.
 * - Incorrect constructor arguments.
 * - Broken integration or adapter contracts.
 * - Misconfigured environment or setup parameters.
 * - Violations of expected configuration schemas.
 *
 * Do **not** use this error type for runtime user input validation
 * (such as request payloads, form data, or command arguments).
 * Those scenarios should use domain-specific validation errors instead.
 *
 * ----------------------------------------------------------------
 * #### Behavior
 * ----------------------------------------------------------------
 *
 * - Extends the native {@link Error | `Error`}.
 * - Sets `.name` to `"ConfigurationError"`.
 * - Preserves the original stack trace.
 * - Supports contextual metadata via `details`.
 * - Exposes a stable `code` identifier for programmatic handling.
 *
 * ----------------------------------------------------------------
 * #### Handling
 * ----------------------------------------------------------------
 *
 * Consumers may safely narrow using `instanceof`
 * or {@link ConfigurationError.is | `ConfigurationError.is`}
 * to access structured metadata.
 *
 * @example
 * ```ts
 * try {
 *   initializeSetup(options);
 * } catch (err) {
 *   if (err instanceof ConfigurationError) {
 *     console.error(err.message);
 *     console.error("Code:", err.code);
 *     console.error("Details:", err.details);
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * throw ConfigurationError.invalid(
 *   "options.timeout",
 *   "must be a positive number",
 *   { received: value },
 *   "createComponent"
 * );
 * ```
 *
 * @example
 * ```ts
 * throw ConfigurationError.type(
 *   "config.adapter",
 *   "function",
 *   value
 * );
 * ```
 *
 * ----------------------------------------------------------------
 * @remarks
 * - Represents a **programmer-level configuration mistake**.
 * - Typically indicates a **non-recoverable initialization failure**.
 * - Intended for validating configuration in libraries or frameworks.
 */
export class ConfigurationError extends Error {
  /** ----------------------------------------------------------------
   * * ***Stable base label for configuration error messages.***
   * ----------------------------------------------------------------
   *
   * Used as the standardized prefix when composing error messages.
   * Extracted to avoid string duplication and enable future
   * refactoring or localization.
   *
   * @private
   * @internal
   */
  private static readonly _LABEL = "Invalid configuration";

  /** ----------------------------------------------------------------
   * * ***Normalizes a reason fragment for error message composition.***
   * ----------------------------------------------------------------
   *
   * Ensures consistent formatting of message fragments used in
   * factory helpers such as {@link invalid | `ConfigurationError.invalid`}
   * and {@link type | `ConfigurationError.type`}.
   *
   * - Trims surrounding whitespace.
   * - Removes trailing period(s).
   * - Converts the first character to lowercase.
   *
   * This guarantees that reason fragments behave as natural
   * sentence continuations when appended after a field reference.
   *
   * @param reason - Raw reason fragment (may contain punctuation or capitalization).
   * @returns A normalized, lowercase, punctuation-free fragment.
   *
   * @private
   * @internal
   */
  private static _normalizeReason(reason: string): string {
    const trimmed = reason.trim().replace(/\.*$/, "");

    if (trimmed.length === 0) {
      return trimmed;
    }

    return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  }

  /** ----------------------------------------------------------------
   * * ***Composes a standardized configuration error message.***
   * ----------------------------------------------------------------
   *
   * Centralizes message construction logic for all factory helpers.
   *
   * - Applies context prefix when provided.
   * - Wraps field and context in inline-code formatting.
   * - Ensures the final message is normalized via {@link format | `format`}.
   *
   * This prevents duplication and guarantees consistent structure
   * across all configuration-related errors.
   *
   * @param field   - Dot-notated configuration path.
   * @param body    - Already-normalized message fragment.
   * @param context - Optional logical origin of the validation.
   *
   * @returns A fully formatted error message.
   *
   * @private
   * @internal
   */
  private static _compose(
    field: string,
    body: string,
    context?: string
  ): string {
    const prefix = context
      ? `${ConfigurationError._LABEL} in ${ConfigurationError.wrapCode(context)}:`
      : `${ConfigurationError._LABEL}:`;

    return ConfigurationError.format(
      `${prefix} ${ConfigurationError.wrapCode(field)} ${body}`
    );
  }

  /** ----------------------------------------------------------------
   * * ***Creates a new `ConfigurationError` instance.***
   * ----------------------------------------------------------------
   *
   * @param message - Fully formatted error message.
   * @param details - Optional structured metadata describing the error.
   *
   * @remarks
   * - The message is expected to be finalized (including punctuation).
   * - Restores the prototype chain for ES5 targets.
   * - Captures a clean stack trace in Node.js environments.
   */
  public constructor(
    message: string,
    details?: Readonly<ConfigurationErrorDetails>
  ) {
    super(message);

    this.name = ConfigurationError.NAME;
    this.code = ConfigurationError.CODE;

    // Deep-ish metadata immutability guard
    this.details = details ? deepFreeze({ ...details }) : undefined;

    // Fix prototype chain (important for TS + ES5 targets)
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture clean stack (Node.js environments)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigurationError);
    }

    // Freeze instance to prevent runtime mutation
    if (Object.getPrototypeOf(this) === ConfigurationError.prototype) {
      Object.freeze(this);
    }
  }

  /** ----------------------------------------------------------------
   * * ***Stable runtime name for this error type.***
   * ----------------------------------------------------------------
   *
   * - ***Mirrors the class identifier and is used to:***
   *       - Set the `.name` property consistently.
   *       - Provide cross-runtime identification.
   *       - Avoid hardcoded string duplication.
   *
   * This value should remain stable across versions.
   */
  public static readonly NAME = "ConfigurationError" as const;

  /** ----------------------------------------------------------------
   * * ***Stable error identifier for `ConfigurationError`.***
   * ----------------------------------------------------------------
   *
   * Can be used for:
   * - Programmatic error discrimination.
   * - Cross-bundle or cross-runtime error detection.
   * - Structured logging and telemetry systems.
   *
   * This identifier is guaranteed to remain stable across versions.
   */
  public static readonly CODE = "CONFIGURATION_ERROR" as const;

  /** ----------------------------------------------------------------
   * * ***Stable error code associated with this instance.***
   * ----------------------------------------------------------------
   *
   * Mirrors {@link CODE | `ConfigurationError.CODE`}.
   *
   * Useful when `instanceof` checks are not reliable
   * across different runtime contexts.
   */
  public readonly code: "CONFIGURATION_ERROR" = ConfigurationError.CODE;

  /** ----------------------------------------------------------------
   * * ***Optional structured metadata associated with this error.***
   * ----------------------------------------------------------------
   *
   * Provides additional contextual information useful for:
   *
   * - Debugging.
   * - Structured logging.
   * - Programmatic error handling.
   *
   * The structure of this object is defined by
   * {@link ConfigurationErrorDetails| `ConfigurationErrorDetails`}.
   *
   * ----------------------------------------------------------------
   * #### Common Usage
   * ----------------------------------------------------------------
   *
   * @example
   * ```ts
   * try {
   *   throw ConfigurationError.type(
   *     "options.myFunction",
   *     "myFunction",
   *     value
   *   );
   * } catch (err) {
   *   if (err instanceof ConfigurationError) {
   *     console.log(err.details?.received);
   *     console.log(err.details?.context);
   *   }
   * }
   * ```
   * ----------------------------------------------------------------
   * @remarks
   * - Intended for machine-readable data.
   * - Immutable (`readonly`) to prevent accidental mutation.
   * - May contain additional custom metadata fields.
   */
  public readonly details?: Readonly<ConfigurationErrorDetails>;

  /** ----------------------------------------------------------------
   * * ***Normalizes an error message to ensure a single trailing period.***
   * ----------------------------------------------------------------
   *
   * - Trims surrounding whitespace.
   * - Removes any existing trailing period(s).
   * - Appends exactly one `.` at the end.
   *
   * This guarantees consistent punctuation regardless of how
   * the message fragments are constructed.
   *
   * ----------------------------------------------------------------
   * @example
   * ```ts
   * ConfigurationError.format("Invalid value")
   * // ➔ "Invalid value."
   * ```
   *
   * @example
   * ```ts
   * ConfigurationError.format("Invalid value.")
   * // ➔ "Invalid value."
   * ```
   *
   * @example
   * ```ts
   * ConfigurationError.format("  Invalid value...  ")
   * // ➔ "Invalid value."
   * ```
   * ----------------------------------------------------------------
   */
  static format(message: string): string {
    if (typeof message !== "string" || message.trim().length === 0) {
      throw new TypeError(
        `${this._LABEL}: ${ConfigurationError.NAME}.format(message) expects a non-empty string.`
      );
    }

    const trimmed = message.trim().replace(/\.*$/, "");
    return trimmed + ".";
  }

  /** ----------------------------------------------------------------
   * * ***Safely wraps a string in a single pair of backticks.***
   * ----------------------------------------------------------------
   *
   * Ensures consistent inline-code formatting while preventing
   * duplicated or nested backticks.
   *
   * - Removes any existing backticks from the input.
   * - Trims surrounding whitespace.
   * - Wraps the cleaned value in exactly one pair of backticks.
   *
   * This prevents malformed output such as:
   *
   * ```text
   * ``validateConfig``
   * ```
   *
   * ----------------------------------------------------------------
   * @param value - Raw string to be formatted as inline code.
   * @returns The sanitized value wrapped in a single pair of backticks.
   *
   * ----------------------------------------------------------------
   * @example
   * ```ts
   * ConfigurationError.wrapCode("fieldName")
   * // ➔ "`fieldName`"
   * ```
   *
   * @example
   * ```ts
   * ConfigurationError.wrapCode("`fieldName`")
   * // ➔ "`fieldName`"
   * ```
   *
   * @example
   * ```ts
   * ConfigurationError.wrapCode("  ``fieldName``  ")
   * // ➔ "`fieldName`"
   * ```
   * ----------------------------------------------------------------
   */
  static wrapCode(value: string): string {
    if (!isNonEmptyString(value)) {
      throw new TypeError(
        `${this._LABEL}: ${ConfigurationError.NAME}.wrapCode(value) expects a non-empty string.`
      );
    }

    const cleaned = value.replace(/`+/g, "").trim();
    return `\`${cleaned}\``;
  }

  /** ----------------------------------------------------------------
   * * ***Type guard for `ConfigurationError`.***
   * ----------------------------------------------------------------
   *
   * Provides a robust alternative to `instanceof`,
   * especially across bundle boundaries or mixed module systems.
   *
   * @param value - Unknown value to test.
   * @returns `true` if the value is a {@link ConfigurationError | `ConfigurationError`}.
   *
   * @example
   * if (ConfigurationError.is(err)) {
   *   console.error(err.code);
   * }
   */
  static is(value: unknown): value is ConfigurationError {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    if (!("code" in value) || !("name" in value)) {
      return false;
    }

    const { code, name } = value as {
      code?: unknown;
      name?: unknown;
    };

    return code === ConfigurationError.CODE && name === ConfigurationError.NAME;
  }

  /** ----------------------------------------------------------------
   * * ***Serializes the error into a structured JSON representation.***
   * ----------------------------------------------------------------
   *
   * Provides a stable, machine-readable representation of the error,
   * suitable for:
   *
   * - Structured logging.
   * - Transport across process boundaries.
   * - Diagnostics.
   * - JSON.stringify().
   *
   * Unlike the native `Error` object, this method ensures that:
   *
   * - `name`, `message`, and `code` are always included.
   * - `details` is preserved (if provided).
   * - `stack` is included only when available.
   *
   * This guarantees predictable output when serializing errors.
   *
   * ----------------------------------------------------------------
   * @returns A plain JSON-safe object describing the error.
   *
   * ----------------------------------------------------------------
   * @example
   * ```ts
   * const err = ConfigurationError.invalid(
   *   "options.title",
   *   "must be a non-empty string",
   *   { received: "" }
   * );
   *
   * console.log(JSON.stringify(err, null, 2));
   * ```
   *
   * Possible output:
   *
   * ```json
   * {
   *   "name": "ConfigurationError",
   *   "message": "Invalid configuration: `options.title` must be a non-empty string.",
   *   "code": "CONFIGURATION_ERROR",
   *   "details": { "received": "" },
   *   "stack": "ConfigurationError: ..."
   * }
   * ```
   * ----------------------------------------------------------------
   */
  toJSON(): {
    /** ----------------------------------------------------------------
     * * ***Runtime identifier of the error instance.***
     * ----------------------------------------------------------------
     *
     * Mirrors {@link ConfigurationError.NAME | `ConfigurationError.NAME`}.
     *
     * - ***Intended for:***
     *       - Programmatic error discrimination.
     *       - Logging and diagnostic pipelines.
     *       - Cross-runtime error identification.
     *
     * This property is useful when `instanceof` checks are unreliable
     * across module boundaries or bundled execution contexts.
     */
    name: string;

    /** ----------------------------------------------------------------
     * * ***Fully formatted error message.***
     * ----------------------------------------------------------------
     *
     * The message is guaranteed to be normalized by internal factory helpers.
     *
     * - ***Guarantees:***
     *       - Consistent punctuation rules.
     *       - Safe inline-code formatting.
     *       - Stable human-readable output.
     *
     * The message is expected to represent a finalized diagnostic string
     * suitable for display, logging, or transport.
     */
    message: string;

    /** ----------------------------------------------------------------
     * * ***Stable machine-readable error code.***
     * ----------------------------------------------------------------
     *
     * Mirrors {@link ConfigurationError.CODE | `ConfigurationError.CODE`}.
     *
     * - ***Intended for:***
     *       - Cross-runtime error identification.
     *       - Structured logging systems.
     *       - Type-safe error discrimination without relying on `instanceof`.
     *
     * This identifier is guaranteed to remain stable across versions.
     */
    code: typeof ConfigurationError.CODE;

    /** ----------------------------------------------------------------
     * * ***Optional structured debugging metadata attached to the error.***
     * ----------------------------------------------------------------
     *
     * #### Contains machine-readable contextual information such as:
     * - Validation input values that caused the error.
     * - Logical origin or execution context.
     * - Custom diagnostic extensions.
     *
     * #### This field is designed for:
     *    - Developer debugging.
     *    - Telemetry collection.
     *    - Internal system analysis.
     *
     * The structure is defined by
     * {@link ConfigurationErrorDetails | `ConfigurationErrorDetails`}.
     */
    details?: Readonly<ConfigurationErrorDetails>;

    /** ----------------------------------------------------------------
     * * ***Optional stack trace captured at the error creation site.***
     * ----------------------------------------------------------------
     *
     * May be undefined in environments where stack capture is unavailable.
     *
     * Stack traces are preserved primarily for debugging and
     * post-mortem diagnostics.
     */
    stack?: string;
  } {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      stack: this.stack
    };
  }

  /** ----------------------------------------------------------------
   * * ***Factory helper for generic configuration validation errors.***
   * ----------------------------------------------------------------
   *
   * Produces a standardized error when a configuration field
   * fails validation.
   *
   * @param field    - Dot-notated configuration path (e.g. `"ui.usage"`).
   * @param reason   - Short descriptive phrase explaining the issue
   *                   (without trailing period).
   * @param details  - Optional structured metadata for debugging.
   * @param context  - Optional logical origin of the validation
   *                   (e.g. `"validateConfig"`), when provided,
   *                   it is included in {@link details | `details`}
   *                   under the `context` key and reflected in the error message.
   *
   * @returns A `ConfigurationError` instance with a normalized message.
   *
   * @example
   * ConfigurationError.invalid(
   *   "ui.usage",
   *   "must be a non-empty string",
   *   { received: usage },
   *   "validateConfig"
   * );
   *
   * // ➔ Invalid configuration in `validateConfig`:
   * //   `ui.usage` must be a non-empty string.
   */
  static invalid(
    field: string,
    reason: string,
    details?: Record<string, unknown>,
    context?: string
  ): ConfigurationError {
    const body = ConfigurationError._normalizeReason(reason);

    return new ConfigurationError(
      ConfigurationError._compose(field, body, context),
      {
        ...details,
        ...(context ? { context } : {})
      }
    );
  }

  /** ----------------------------------------------------------------
   * * ***Factory helper for configuration type mismatch errors.***
   * ----------------------------------------------------------------
   *
   * Produces a standardized error when a configuration field
   * does not match the expected type or structural contract.
   *
   * @param field    - Dot-notated configuration path.
   * @param expected - Short description of the expected type or shape
   *                   (without trailing period).
   * @param received - The actual received value.
   * @param context  - Optional logical origin of the validation
   *                   (e.g. `"myFunction"`), when provided,
   *                   it is included in {@link details | `details`}
   *                   under the `context` key and reflected in the error message.
   *
   * @returns A `ConfigurationError` instance including the received value.
   *
   * @example
   * ConfigurationError.type(
   *   "options.myMainFunction",
   *   "MyMainFunction",
   *   value,
   *   "myFunction"
   * );
   *
   * // ➔ Invalid configuration in `myFunction`:
   * //   `options.myMainFunction` must be MyMainFunction.
   */
  static type(
    field: string,
    expected: string,
    received: unknown,
    context?: string
  ): ConfigurationError {
    const body = `must be ${expected}`;

    return new ConfigurationError(
      ConfigurationError._compose(field, body, context),
      {
        received,
        ...(context ? { context } : {})
      }
    );
  }
}
