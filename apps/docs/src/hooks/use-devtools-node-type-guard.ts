"use client";

import { isDevEnv } from "@rzl-zone/next-kit/utils";
import {
  isError,
  isNonEmptyString,
  isString
} from "@rzl-zone/utils-js/predicates";
import { useEffect } from "react";

// type ConsoleErrorArgs = Parameters<typeof console.error>;

function isNodeTypeError(input: unknown): input is string {
  return (
    isNonEmptyString(input) &&
    input.includes("nodeType") &&
    input.includes("Permission denied")
  );
}

const devEnv = isDevEnv();

/** ------------------------------------------------------------
 * * ***Guards and suppresses harmless 'nodeType' errors in development.***
 * ------------------------------------------------------------
 *
 * This hook listens to global `error` and `unhandledrejection` events
 * and filters out known benign errors related to `nodeType` access,
 * which commonly occur when interacting with pseudo-elements or
 * browser DevTools.
 *
 * These errors are prevented from propagating and cluttering the console.
 * A warning will be logged only once to indicate that the error was ignored.
 *
 * This behavior is applied **only in development mode**.
 *
 * @remarks
 * This hook attaches global event listeners and should be mounted once
 * at the root level of your application (e.g., in a layout or provider).
 *
 * @example
 * ```ts
 * useDevtoolsNodeTypeGuard();
 * ```
 */
export function useDevtoolsNodeTypeGuard() {
  useEffect(() => {
    if (!devEnv) return;

    let warned = false;

    const warnOnce = (message: string) => {
      if (warned) return;
      warned = true;
      console.warn(message);
    };

    // window error
    const onError = (e: ErrorEvent) => {
      if (isNodeTypeError(e.message)) {
        e.preventDefault();
        e.stopImmediatePropagation();

        warnOnce(
          "[SafeGuard] Ignored harmless 'nodeType' error (pseudo-element click / DevTools)."
        );
      }
    };

    // promise rejection
    const onReject = (e: PromiseRejectionEvent) => {
      const reason = isString(e.reason)
        ? e.reason
        : isError(e.reason)
          ? e.reason.message
          : "";

      if (isNodeTypeError(reason)) {
        e.preventDefault();

        warnOnce(
          "[SafeGuard] Ignored harmless promise rejection related to 'nodeType'."
        );
      }
    };

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onReject, true);

    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onReject, true);
    };
  }, []);
}
