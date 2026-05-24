import { isPlainObject, isServer } from "@/predicates";

type CopyMethod = "clipboard" | "fallback" | "manual";
type CopyStatus = "success" | "error";

type CopyResult = {
  /** ---------------------------------------------------------
   * * ***Final operation status.***
   * ----------------------------------------------------------
   *
   * ---
   * Usually `"success"` when copy succeeds, otherwise `"error"`.
   */
  status: CopyStatus;

  /** ---------------------------------------------------------
   * * ***Indicates whether the operation succeeded.***
   * ----------------------------------------------------------
   *
   * Usually `true` on successful copy operations.
   */
  success: boolean;

  /** ---------------------------------------------------------
   * * ***Copy mechanism that was used.***
   * ----------------------------------------------------------
   *
   * - **Possible values:**
   *     - `"clipboard"`.
   *     - `"fallback"`.
   *     - `"manual"`.
   */
  method: CopyMethod;

  /**
   * * ***Optional error object captured during execution.***
   */
  error?: unknown;

  /** ---------------------------------------------------------
   * * ***Optional failure or fallback reason.***
   * ----------------------------------------------------------
   *
   * - **Possible values:**
   *     - `"no-browser"`.
   *     - `"no-clipboard"`.
   *     - `"clipboard-error"`.
   *     - `"timeout"`.
   *     - `"fallback-failed"`.
   */
  reason?:
    | "no-browser"
    | "no-clipboard"
    | "clipboard-error"
    | "timeout"
    | "fallback-failed";

  /**
   * * ***Total number of attempts performed.***
   */
  attempts: number;

  /**
   * * ***Total execution duration in milliseconds.***
   */
  duration: number;

  /**
   * * ***Unix timestamp of execution completion.***
   */
  timestamp: number;
};

/** ----------------------------------------------------------------------
 * * ***Type: `CopyOptions`.***
 * -----------------------------------------------------------------------
 * **Configuration options for the `copyText` utility.**
 *
 * ---
 * - **Behavior:**
 *     - Controls retry attempts and timeout handling.
 *     - Enables optional debug logging.
 *     - All properties are optional.
 */
type CopyOptions = {
  /** -----------------------------------------------------------------------
   * * ***Enables internal debug logging.***
   * ------------------------------------------------------------------------
   *
   * @default false
   */
  debug?: boolean;

  /** -----------------------------------------------------------------------
   * * ***Number of retry attempts before fallback.***
   * ------------------------------------------------------------------------
   *
   * @default 1
   */
  retries?: number;

  /** -----------------------------------------------------------------------
   * * ***Timeout duration (in milliseconds) for each Clipboard API attempt.***
   * ------------------------------------------------------------------------
   *
   * @default 2000
   */
  timeout?: number;
};

/** ----------------------------------------------------------------------
 * * ***Utility: `copyText`.***
 * -----------------------------------------------------------------------
 * **Copies text to the user's clipboard with robust fallback handling.**
 *
 * ---
 * - **Behavior:**
 *     - Attempts to use the modern
 *       ***`navigator.clipboard.writeText`*** Clipboard API.
 *     - Automatically retries clipboard operations when configured.
 *     - Falls back to legacy
 *       ***`document.execCommand("copy")`***
 *       if the Clipboard API is unavailable or fails.
 *     - As a last resort, programmatically selects the text
 *       to allow manual copying by the user.
 *     - Detects non-browser environments and safely exits
 *       without accessing browser-only APIs.
 *     - Returns detailed operation metadata including method,
 *       duration, attempts, and failure reason.
 *     - Does **not throw** on copy failure;
 *       instead returns a structured
 *       ***{@link CopyResult | `CopyResult`}*** object.
 *
 * ---
 * @param {string} text
 * The text content to copy to the clipboard.
 *
 * @param {CopyOptions} [options={}]
 * Optional configuration object.
 *
 * @param {boolean} [options.debug=false]
 * Enables internal debug logging.
 *
 * @param {number} [options.retries=1]
 * Number of additional retry attempts
 * after the initial Clipboard API attempt.
 *
 * @param {number} [options.timeout=2000]
 * Timeout duration (in milliseconds)
 * for each Clipboard API attempt.
 *
 * ---
 * @returns {Promise<CopyResult>}
 * A promise resolving to a
 * ***{@link CopyResult | `CopyResult`}*** object containing:
 *  - `status` ➔ `"success"` or `"error"`.
 *  - `success` ➔ Indicates whether the operation succeeded.
 *  - `method` ➔ Copy mechanism used
 *    (`"clipboard"`, `"fallback"`, or `"manual"`).
 *  - `reason` ➔ Optional failure or fallback reason.
 *  - `error` ➔ Optional thrown error object.
 *  - `attempts` ➔ Total number of attempts performed.
 *  - `duration` ➔ Execution duration in milliseconds.
 *  - `timestamp` ➔ Unix timestamp of execution.
 *
 * ---
 * @remarks
 * - The Clipboard API requires a secure context
 *   (`HTTPS` or `localhost`).
 * - Some browsers or mobile environments may restrict
 *   clipboard access without direct user interaction.
 * - Clipboard operations may fail due to browser permission
 *   policies or missing user interaction.
 * - Manual selection mode is only triggered when all
 *   programmatic copy strategies fail.
 * - In server-side environments,
 *   the utility returns `"no-browser"`
 *   without attempting DOM access.
 *
 * ---
 * @example
 * ```ts
 * const result = await copyText("Hello world");
 *
 * if (result.success) {
 *   console.log(`Copied using ${result.method}`);
 * } else {
 *   console.error(result.reason);
 * }
 * ```
 *
 * ---
 * @example
 * ```ts
 * await copyText("Debug mode", {
 *   debug: true,
 *   retries: 2
 * });
 * ```
 */
export async function copyText(
  text: string,
  options?: CopyOptions
): Promise<CopyResult> {
  if (!isPlainObject(options)) options = {};

  const now = () =>
    typeof performance !== "undefined" ? performance.now() : Date.now();
  const start = now();
  const timestamp = Date.now();
  const isBrowser = !isServer();

  if (!isBrowser) {
    return {
      status: "error",
      success: false,
      method: "manual",
      reason: "no-browser",
      attempts: 0,
      duration: now() - start,
      timestamp
    };
  }

  const retries = Math.max(0, options.retries ?? 1);
  const maxAttempts = retries + 1;
  const timeout = options.timeout ?? 2000;

  let attempts = 0;

  const log = (...args: unknown[]) => {
    if (options.debug) console.log("[@rzl-zone/utils-js:copyText]: ", ...args);
  };

  const withTimeout = async <T>(promise: Promise<T>) => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("timeout")), timeout);
        })
      ]);
    } finally {
      clearTimeout(timer);
    }
  };

  const hasClipboard =
    typeof navigator !== "undefined" && !!navigator.clipboard;

  // === TRY CLIPBOARD API ===
  if (hasClipboard) {
    while (attempts < maxAttempts) {
      attempts++;
      try {
        await withTimeout(navigator.clipboard.writeText(text));
        log("Clipboard success", { attempts });

        return {
          status: "success",
          success: true,
          method: "clipboard",
          attempts,
          duration: now() - start,
          timestamp
        };
      } catch (error: unknown) {
        log("Clipboard attempt failed", error);

        if (error instanceof Error && error?.message === "timeout") {
          return {
            status: "error",
            success: false,
            method: "clipboard",
            error,
            reason: "timeout",
            attempts,
            duration: now() - start,
            timestamp
          };
        }
      }
    }

    log("Clipboard exhausted ➔ fallback");
  } else {
    log("No clipboard API");
  }

  // === FALLBACK ===
  attempts++;

  try {
    const ok = fallbackCopy(text);

    if (ok) {
      return {
        status: "success",
        success: true,
        method: "fallback",
        reason: hasClipboard ? "clipboard-error" : "no-clipboard",
        attempts,
        duration: now() - start,
        timestamp
      };
    }
  } catch (error) {
    log("Fallback error", error);
  }

  // === LAST RESORT: MANUAL SELECT ===
  attempts++;

  log("Fallback failed ➔ manual select");

  manualSelect(text);

  return {
    status: "error",
    success: false,
    method: "manual",
    reason: "fallback-failed",
    attempts,
    duration: now() - start,
    timestamp
  };
}

// --- fallback ---
function fallbackCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;

  textarea.setAttribute("readonly", "");

  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  textarea.style.fontSize = "16px";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.blur();

    setTimeout(() => {
      textarea.remove();
    }, 0);
  }
}

// --- manual select ---
function manualSelect(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;

  textarea.setAttribute("readonly", "");

  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  textarea.style.fontSize = "16px";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  setTimeout(() => {
    textarea.blur();

    textarea.remove();
  }, 3000);
}
