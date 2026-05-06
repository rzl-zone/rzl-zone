"use client";

import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import {
  toast,
  type ExternalToast,
  type ToastT
} from "@rzl-zone/docs-ui/components/sonner";
import { isProdEnv } from "@rzl-zone/next-kit/utils";
import { getPreciseType, isFunction } from "@rzl-zone/utils-js/predicates";

type ToastOptions = {
  /** * Disable Toast
   *
   * Set to true to prevent toast shows.
   *
   * @default false
   */
  disable?: boolean;
} & ExternalToast & {
    /**
     * @default "success"
     */
    type?: ToastT["type"];

    /**
     * @default "Code copied to clipboard"
     */
    message?: string;

    /**
     * @default 2500
     */
    duration?: number;
  };

type CopyButtonAction = {
  /**
   * @default 1250
   */
  debounceCopy?: number;
  onCopy: () => void | Promise<void>;
  toastOptions?: ToastOptions;
};

const isProd = isProdEnv();

/** ------------------------------------------------------------
 * * ***Handles copy-to-clipboard action with debounce, state, and toast feedback.***
 * ------------------------------------------------------------
 *
 * - This hook provides a click handler for copy actions with built-in:
 *    - Debounce protection (prevents rapid repeated clicks)
 *    - Temporary "checked" state (e.g., for UI feedback like icon toggle)
 *    - Optional toast notifications (success & error)
 *
 * - Flow:
 *    1. When clicked → executes `onCopy`
 *    2. If successful:
 *       - Sets `checked = true`
 *       - Shows success toast (unless disabled)
 *       - Resets `checked` after `debounceCopy` duration
 *    3. If failed:
 *       - Shows error toast(s) (unless disabled)
 *       - Resets state immediately
 *
 * While in `checked` state, further clicks are ignored.
 *
 * @param options - Configuration object.
 * @param options.onCopy - A Required function executed on click (can be async).
 * @param options.debounceCopy - Duration (ms) before allowing next copy action.
 * @defaultValue `1250`
 * @param options.toastOptions - Optional toast configuration.
 *
 * @param options.toastOptions.disable - Disable all toast notifications.
 * @defaultValue `false`
 * @param options.toastOptions.type - Toast type for success state.
 * @defaultValue `"success"`
 * @param options.toastOptions.message - Success message.
 * @defaultValue `"Code copied to clipboard"`
 * @param options.toastOptions.duration - Toast duration (ms).
 * @defaultValue `2500`
 *
 * @returns Tuple:
 * - `checked` → Whether the copy action is currently in "success/locked" state
 * - `onClick` → Click handler to trigger the copy flow
 *
 * @throws Error
 * Throws in development if `onCopy` is not a function.
 *
 * @remarks
 * - In development, this hook throws if `onCopy` is invalid.
 * - In production, it fails silently to prevent runtime crashes.
 * - The click handler is memoized with `useCallback`.
 * - Relies on dependency updates to keep `onCopy` and options fresh.
 * - Prevents duplicate execution while debounce is active.
 * - Safe against unmounted updates (cleans up timeout on unmount).
 *
 * @example
 * ```ts
 * const [checked, onClick] = useCopyButton({
 *   onCopy: () => navigator.clipboard.writeText(code)
 * });
 * ```
 *
 * @example
 * ```ts
 * const [checked, onClick] = useCopyButton({
 *   onCopy: async () => {
 *     await copyToClipboard(code);
 *   },
 *   debounceCopy: 1500,
 *   toastOptions: {
 *     message: "Copied!",
 *     type: "success"
 *   }
 * });
 * ```
 */
export function useCopyButton(
  options: CopyButtonAction
): [checked: boolean, onClick: MouseEventHandler] {
  const checkedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const [checked, setChecked] = useState(false);

  const { onCopy, debounceCopy = 1250, toastOptions } = options || {};

  const isValid = isFunction(onCopy);

  if (!isValid && !isProd) {
    throw new Error(
      "useCopyButton: `onCopy` must be a function. Received: " +
        getPreciseType(onCopy)
    );
  }

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (!isValid) return;

      if (checkedRef.current) {
        e.preventDefault();
        return;
      }

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      void Promise.resolve(onCopy())
        .then(() => {
          setChecked(true);

          if (!toastOptions?.disable) {
            toast(toastOptions?.message ?? "Code copied to clipboard", {
              ...toastOptions,
              // @ts-ignore we ignore because `toast` actually accept type.
              type: toastOptions?.type ?? "success",
              duration: toastOptions?.duration ?? 2500
            });
          }

          timeoutRef.current = window.setTimeout(() => {
            setChecked(false);
          }, debounceCopy);
        })
        .catch((error) => {
          if (!toastOptions?.disable) {
            toast("Some went wrong at copy-event action", {
              ...toastOptions,
              // @ts-ignore we ignore because `toast` actually accept type.
              type: "error",
              duration: toastOptions?.duration ?? 2500
            });
            toast(error?.message, {
              ...toastOptions,
              // @ts-ignore we ignore because `toast` actually accept type.
              type: "error",
              duration: toastOptions?.duration ?? 2500
            });
          }
          setChecked(false);
        });
    },
    [debounceCopy, onCopy, toastOptions, isValid]
  );

  useEffect(() => {
    checkedRef.current = checked;
  }, [checked]);

  // Avoid updates after being unmounted
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      checkedRef.current = false;
    };
  }, []);

  return [checked, onClick];
}
