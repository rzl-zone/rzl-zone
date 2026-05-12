import { isNull } from "@/predicates/is/isNull";
import { isInteger } from "@/predicates/is/isInteger";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

/** -------------------------------------------------------------------
 * * ***Custom `AbortError` for cross-runtime delay cancellation.***
 * -------------------------------------------------------------------
 */
class AbortError extends Error {
  constructor(
    message: string = "The operation was aborted",
    name: string = "AbortError"
  ) {
    super(message);
    this.name = name;
  }
}

/** ------------------------------------------------------------
 * * ***Utility: `delay`.***
 * ------------------------------------------------------------
 * **Creates a Promise-based delay that resolves after a given number
 * of milliseconds, optionally supports cancellation with `AbortSignal`.**
 * - **Behavior:**
 *    - Validates `milliSeconds` is a non-zero, non-negative integer.
 *    - Validates `signal` is an `AbortSignal` instance when provided.
 *    - Cleans up event listeners and timers properly.
 * @param {number} [milliSeconds=1000]
 *  The duration of the delay in milliseconds, default is `1000`.
 * @param {AbortSignal} [signal]
 *  An optional `AbortSignal` that can cancel the delay.
 * @returns {Promise<void>}
 *  A promise that resolves after the specified delay or
 *  rejects with an `AbortError` if aborted.
 * @throws **{@link TypeError | `TypeError`}** while validates `milliSeconds` and `signal`:
 *  - If `milliSeconds` **is not a valid** an `integer-number`, `NaN`, `negative-number`, or `≤ 0`.
 *  - If `signal` **is not a valid** an`AbortSignal`.
 * @throws **{@link DOMException | `DOMException`}** if the delay is aborted using the signal, rejects with `AbortError`.
 * @example
 * // Waits for 2 seconds
 * await delay(2000);
 *
 * // Delay with AbortSignal
 * const controller = new AbortController();
 * delay(5000, controller.signal).catch(err => console.log(err.name)); // "AbortError"
 * controller.abort();
 */
export const delay = (
  milliSeconds: number = 1000,
  signal?: AbortSignal
): Promise<void> => {
  if (!isInteger(milliSeconds) || milliSeconds <= 0) {
    throw new TypeError(
      `First parameter (\`milliSeconds\`) must be of type \`number\` and value must be a \`non-zero\`, \`non-NaN\`, \`non-negative\`, and \`integer-number\`, but received: \`${getPreciseType(
        milliSeconds
      )}\`, with value: \`${safeStableStringify(milliSeconds, {
        keepUndefined: true
      })}\`.`
    );
  }

  if (isNull(signal) || (signal && !(signal instanceof AbortSignal))) {
    throw new TypeError(
      "Second parameter (`signal`) must be an `instance of AbortSignal` if provided."
    );
  }

  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, milliSeconds);

    const cleanup = () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      cleanup();
      reject(
        new AbortError(
          "Function `delay` from `@rzl-zone/utils-js` was aborted.",
          "AbortError"
        )
      );
    };

    if (signal) {
      if (signal.aborted) {
        onAbort();
      } else {
        signal.addEventListener("abort", onAbort, { once: true });
      }
    }
  });
};
