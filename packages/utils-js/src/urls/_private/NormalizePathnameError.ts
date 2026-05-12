import { isFunction } from "@/predicates/is/isFunction";

/** ---------------------------------
 * * ***Custom Error for Pathname Normalization Failures***
 * --------------------------------- */
export class NormalizePathnameError extends Error {
  /** * ***The original error that triggered this normalization failure.***
   *
   * **Always available for backward compatibility.**
   */
  public readonly originalError: Error;

  constructor(message: string, originalError: Error) {
    // Pass a `cause` option if the runtime supports it (ignored by older engines).
    super(message, isFunction(Error) ? { cause: originalError } : undefined);

    this.name = "NormalizePathnameError";
    this.originalError = originalError;

    // Preserve stack trace when available (Node.js & modern browsers).
    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, NormalizePathnameError);
    } else {
      // Fallback for very old environments.
      this.stack = new Error(message).stack;
    }
  }

  /** * ***Safe JSON representation for logging or IPC.*** */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      originalError: {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      }
    };
  }
}
