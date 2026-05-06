import { toast } from "@rzl-zone/docs-ui/components/sonner";
import type { Awaitable } from "@rzl-zone/ts-types-plus";
import { noop } from "@rzl-zone/utils-js/generators";
import { isError, isNonEmptyString } from "@rzl-zone/utils-js/predicates";

export class UrlEmptyError extends Error {
  constructor() {
    super("URL_EMPTY");
    this.name = "UrlEmptyError";
  }
}

export const assertValidUrl = (url: string) => {
  if (!isNonEmptyString(url)) {
    throw new UrlEmptyError();
  }
};

export class ShareUrlEmptyError extends Error {
  constructor() {
    super("SHARE_URL_EMPTY");
    this.name = "ShareUrlEmptyError";
  }
}

export const assertValidShareUrl = (url: string) => {
  if (!isNonEmptyString(url)) {
    throw new ShareUrlEmptyError();
  }
};

type WithShareUrlGuardOptions = {
  /** Disable showing error toast.
   *
   * When `false`, a toast will be shown immediately after an error is caught.
   *
   * @default true
   */
  enableToast?: boolean;

  /** Enable logging the error to `console.error`.
   *
   * Executed after toast (if enabled).
   *
   * @default true
   */
  enableConsoleError?: boolean;

  /** Callback executed after all built-in error handling is completed.
   *
   * Execution order:
   * 1. Toast (if not disabled)
   * 2. console.error (if enabled)
   * 3. `onError` callback
   *
   * Use this for side-effects like closing modal, resetting state, etc.
   *
   * @default noop
   */
  onError?: () => Awaitable<void>;
};
export const withShareUrlGuard = async (
  fn: () => Awaitable<void>,
  options?: WithShareUrlGuardOptions
) => {
  const {
    enableToast = true,
    enableConsoleError = true,
    onError = noop
  } = options ?? {};

  try {
    await fn();
  } catch (error) {
    if (enableToast) {
      if (error instanceof ShareUrlEmptyError) {
        toast.error("Something went wrong, share `url` is empty.", {
          duration: 2500
        });
      } else {
        toast.error("Something went wrong, please try again.", {
          duration: 2500
        });
      }
    }

    if (enableConsoleError && isError(error)) console.error(error);

    await onError?.();
  }
};
