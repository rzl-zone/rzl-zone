"use client";

import { useCallback } from "react";
import { useRouter as useNextRouter } from "next/navigation";

import { delay } from "@rzl-zone/utils-js/promises";
import { isInteger, isPlainObject } from "@rzl-zone/utils-js/predicates";
import { assertIsBoolean, assertIsString } from "@rzl-zone/utils-js/assertions";
import {
  enableUserInteraction,
  disableUserInteraction
} from "@rzl-zone/utils-js/events";

import { RzlProgress } from "../utils/rzlProgress";
import { defaultOptionsProgressBar } from "../constants";

import type {
  OptionsUseRouter,
  AppRouterInstance,
  NavigateOptionsUseRouter,
  NavigateFwdOptionsUseRouter
} from "../types";

/** ------------------------------------------------------------------
 * * ***Custom useRouter hook to work with `RzlNextAppProgressBar`, compatible with `App Router` only.***
 * ------------------------------------------------------------------
 */
export const useRouter = <
  CustomRouter extends AppRouterInstance = AppRouterInstance
>(
  customRouter?: () => CustomRouter
): AppRouterInstance => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = customRouter ? customRouter() : useNextRouter();

  const startProgress = useCallback(
    ({
      disableProgressBar = false,
      disablePreventAnyAction = false,
      options = defaultOptionsProgressBar
    }: NavigateOptionsUseRouter = {}) => {
      if (!isPlainObject(options)) options = defaultOptionsProgressBar;

      const { startPosition, ...restNpOptions } = options;

      assertIsBoolean(disableProgressBar, {
        message: ({ currentType, validType }) => {
          return `Props \`disableProgressBar\` expected \`${validType}\`, but received: \`${currentType}\`.`;
        }
      });
      assertIsBoolean(disablePreventAnyAction, {
        message: ({ currentType, validType }) => {
          return `Props \`disablePreventAnyAction\` expected \`${validType}\`, but received: \`${currentType}\`.`;
        }
      });

      if (
        !disableProgressBar &&
        !RzlProgress.isStarted() &&
        !RzlProgress.isRendered()
      ) {
        RzlProgress.configure(restNpOptions);

        if (startPosition && startPosition > 0) {
          RzlProgress.set(startPosition);
        }

        if (!disablePreventAnyAction) {
          disableUserInteraction();
        }

        RzlProgress.start();
      }
    },
    [router]
  );

  const stopProgress = useCallback(() => {
    enableUserInteraction();

    if (!RzlProgress.isStarted() || !RzlProgress.isRendered()) return;

    RzlProgress.done();
  }, []);

  const replace = useCallback(
    (href: string, options?: NavigateOptionsUseRouter) => {
      assertIsString(href, {
        message: ({ currentType, validType }) => {
          return `Props \`href\` expected \`${validType}\`, but received: \`${currentType}\`.`;
        }
      });

      if (!isPlainObject(options)) {
        options = { scroll: true, options: defaultOptionsProgressBar };
      }

      startProgress(options);

      router.replace(href, { ...options });
    },
    [router]
  );

  const push = useCallback(
    (href: string, options?: NavigateOptionsUseRouter) => {
      assertIsString(href, {
        message: ({ currentType, validType }) => {
          return `Props \`href\` expected \`${validType}\`, but received: \`${currentType}\`.`;
        }
      });

      if (!isPlainObject(options)) {
        options = { scroll: true, options: defaultOptionsProgressBar };
      }

      startProgress(options);

      router.push(href, { ...options });
    },
    [router]
  );

  const back = useCallback(
    (options?: OptionsUseRouter) => {
      if (!isPlainObject(options)) {
        options = { options: defaultOptionsProgressBar };
      }

      startProgress(options);

      router.back();
    },
    [router]
  );

  const refresh = useCallback(
    (options?: OptionsUseRouter) => {
      if (!isPlainObject(options)) {
        options = { options: defaultOptionsProgressBar };
      }

      startProgress(options);

      router.refresh();
    },
    [router]
  );

  const forward = useCallback(
    async (options?: NavigateFwdOptionsUseRouter) => {
      if (!isPlainObject(options)) {
        options = { options: defaultOptionsProgressBar };
      }

      let { delayStops = 100 } = options;

      if (!isInteger(delayStops)) delayStops = 100;

      startProgress(options);

      router.forward();

      await delay(delayStops);
      stopProgress();
    },
    [router]
  );

  return { ...router, push, replace, back, refresh, forward };
};
