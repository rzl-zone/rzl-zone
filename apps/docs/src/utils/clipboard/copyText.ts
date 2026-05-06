type CopyMethod = "clipboard" | "fallback" | "manual";
type CopyStatus = "success" | "error";

type CopyResult = {
  status: CopyStatus;
  success: boolean;
  method: CopyMethod;
  error?: unknown;
  reason?: "no-clipboard" | "clipboard-error" | "timeout" | "fallback-failed";
  attempts: number;
  duration: number;
  timestamp: number;
};

type CopyOptions = {
  debug?: boolean;
  retries?: number;
  timeout?: number;
};

/** ---------------------------------------------------------------------------
 * * ***Copy text to the user's clipboard with robust fallback handling.***
 * ---------------------------------------------------------------------------
 *
 * This function attempts to use the modern Clipboard API (`navigator.clipboard.writeText`).
 * If unavailable or if the operation fails (e.g. due to permissions, insecure context, or timeout),
 * it falls back to a legacy `document.execCommand("copy")` approach.
 *
 * As a last resort, it will programmatically select the text in a visible textarea,
 * allowing the user to manually copy it.
 *
 * @param text - The text content to be copied to the clipboard.
 * @param options - Optional configuration to control behavior.
 * @param options.debug - Enables console logging for debugging purposes.
 * @param options.retries - Number of retry attempts for the Clipboard API before falling back. Default is `1`.
 * @param options.timeout - Timeout in milliseconds for each Clipboard API attempt. Default is `2000`.
 *
 * @returns A promise that resolves to a {@link CopyResult|`CopyResult`} object containing:
 * - `status`: `"success"` or `"error"`
 * - `success`: boolean indicating if the operation succeeded
 * - `method`: the method used (`"clipboard"`, `"fallback"`, or `"manual"`)
 * - `reason`: optional reason for fallback or failure
 * - `error`: optional error object if an exception occurred
 * - `attempts`: number of attempts made
 * - `duration`: time taken in milliseconds
 * - `timestamp`: when the operation was executed
 *
 * @remarks
 * - The Clipboard API requires a secure context (HTTPS or localhost).
 * - On mobile devices or insecure environments, the fallback mechanism will be used.
 * - Manual selection is used only when all programmatic copy methods fail.
 *
 * @example
 * ```ts
 * const result = await copyText("Hello world");
 *
 * if (result.success) {
 *   console.log(`Copied using ${result.method}`);
 * } else {
 *   console.error("Copy failed:", result.reason);
 * }
 * ```
 *
 * @example
 * ```ts
 * await copyText("Debug mode", { debug: true, retries: 2 });
 * ```
 */
export async function copyText(
  text: string,
  options: CopyOptions = {}
): Promise<CopyResult> {
  const start = performance.now();
  const timestamp = Date.now();

  const retries = options.retries ?? 1;
  const timeout = options.timeout ?? 2000;

  let attempts = 0;

  const log = (...args: unknown[]) => {
    if (options.debug) console.log("[copyText]", ...args);
  };

  const withTimeout = <T>(promise: Promise<T>) => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeout)
      )
    ]);
  };

  // === TRY CLIPBOARD API ===
  if (navigator?.clipboard) {
    while (attempts <= retries) {
      attempts++;
      try {
        await withTimeout(navigator.clipboard.writeText(text));
        log("clipboard success", { attempts });

        return {
          status: "success",
          success: true,
          method: "clipboard",
          attempts,
          duration: performance.now() - start,
          timestamp
        };
      } catch (error: unknown) {
        log("clipboard attempt failed", error);

        if (error instanceof Error && error?.message === "timeout") {
          return {
            status: "error",
            success: false,
            method: "clipboard",
            error,
            reason: "timeout",
            attempts,
            duration: performance.now() - start,
            timestamp
          };
        }
      }
    }

    log("clipboard exhausted → fallback");
  } else {
    log("no clipboard API");
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
        reason: navigator?.clipboard ? "clipboard-error" : "no-clipboard",
        attempts,
        duration: performance.now() - start,
        timestamp
      };
    }
  } catch (error) {
    log("fallback error", error);
  }

  // === LAST RESORT: MANUAL SELECT ===
  log("fallback failed → manual select");

  manualSelect(text);

  return {
    status: "error",
    success: false,
    method: "manual",
    reason: "fallback-failed",
    attempts,
    duration: performance.now() - start,
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
  textarea.style.left = "-9999px"; // move off-screen
  textarea.style.opacity = "0";
  textarea.style.fontSize = "16px"; // prevent zoom on iOS

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.blur();

    setTimeout(() => {
      if (textarea.parentNode) {
        document.body.removeChild(textarea);
      }
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

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  setTimeout(() => {
    textarea.blur();

    if (textarea.parentNode) {
      document.body.removeChild(textarea);
    }
  }, 3000);
}
