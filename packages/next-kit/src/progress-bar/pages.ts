import { memo, useCallback, useEffect, useRef } from "react";

import Router from "next/router";
import { isBoolean } from "@rzl-zone/utils-js/predicates";
import {
  disableUserInteraction,
  enableUserInteraction
} from "@rzl-zone/utils-js/events";

import { RzlProgress } from "./utils/rzlProgress";
import { useCssTopLoader } from "./hooks/useCssTopLoader";
import { validationPropsPgBar } from "./utils/validation";
import { isSameURL, isSameURLWithoutSearch } from "./utils/pathURL";
import { defaultPropsInitRzlNextProgressBar as defaultProps } from "./constants";

import type { ProgressBarPagesComponentProps } from "./types";

const ProgressBarPagesComponent = (
  props: ProgressBarPagesComponentProps = defaultProps
): null => {
  const timer = useRef<NodeJS.Timeout | number>(0);

  const {
    id,
    name,
    nonce,
    style,
    colorSpinner,
    classNameIfLoading,
    spinnerSpeed,
    spinnerSize,
    spinnerEase,
    color,
    height,
    zIndex,
    showAtBottom,
    startPosition,
    delay,
    stopDelay,
    options,

    disableSameURL,
    shallowRouting
  } = validationPropsPgBar(props);

  useCssTopLoader({
    id,
    name,
    nonce,
    style,
    color,
    height,
    colorSpinner,
    spinnerEase,
    zIndex,
    spinnerSize,
    spinnerSpeed,
    showAtBottom
  });

  const startProgress = useCallback(
    (withDelay = true) => {
      if (!isBoolean(withDelay)) withDelay = true;
      if (RzlProgress.isStarted() || RzlProgress.isRendered()) return;

      RzlProgress.configure(options);

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => {
          if (startPosition > 0) RzlProgress.set(startPosition);

          RzlProgress.start();
          disableUserInteraction(classNameIfLoading);
        },
        withDelay ? delay : 1
      );
    },
    [options]
  );

  const stopProgress = useCallback(
    (
      /** @default true */
      withDelay = true,
      /** @default false */
      force?: boolean
    ) => {
      if (!isBoolean(withDelay)) withDelay = true;
      if (!isBoolean(force)) force = false;

      if (timer.current) clearTimeout(timer.current);

      timer.current = setTimeout(
        () => {
          enableUserInteraction(classNameIfLoading);

          if (!(RzlProgress.isStarted() || RzlProgress.isRendered())) return;

          RzlProgress.done(force);
        },
        withDelay ? stopDelay : 1
      );

      RzlProgress.configure(options);
    },
    [options]
  );

  useEffect(() => {
    const handleRouteStart = (url: string) => {
      const targetUrl = new URL(url, location.href);
      const currentUrl = new URL(location.href);

      if (
        shallowRouting &&
        isSameURLWithoutSearch(targetUrl, currentUrl) &&
        disableSameURL
      )
        return;

      // If the URL is the same, we don't want to start the progress bar
      if (isSameURL(targetUrl, currentUrl) && disableSameURL) return;

      startProgress();
    };

    const handleRouteDone = () => {
      stopProgress();
    };

    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);

    return () => {
      if (timer.current) clearTimeout(timer.current);

      // Make sure to remove the event handler on unmount!
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  return null;
};

/** ------------------------------------------------------------------
 * * ***Component: `RzlNextPagesProgressBar`.***
 * ------------------------------------------------------------------
 * **A lightweight progress bar optimized for the Next.js `Pages Router`.**
 *
 * This component memoizes using `React.memo` to prevent unnecessary re-renders and
 * improve performance during client-side navigation events.
 *
 * - **Features**:
 *    - Provides a smooth progress bar for **Pages Directory** apps.
 *    - Automatically reacts to route changes via the Pages Router.
 *    - Improved performance thanks to `React.memo` optimization.
 *    - Works seamlessly with dynamic routes, `next/link`, and `router.push`.
 *
 * @returns {null} This component renders nothing; it only attaches route progress logic **(side-effect only)**.
 *
 * @example
 * * Basic usage inside `_app.tsx`:
 * ```tsx
 * import type { AppProps } from "next/app";
 * import { RzlNextPagesProgressBar } from "@rzl-zone/next-kit/progress-bar/pages";
 *
 * function MyApp({ Component, pageProps }: AppProps) {
 *   return (
 *     <>
 *       <RzlNextPagesProgressBar />
 *       <Component {...pageProps} />
 *     </>
 *   );
 * }
 *
 * export default MyApp;
 * ```
 */
export const RzlNextPagesProgressBar = memo(ProgressBarPagesComponent);

RzlNextPagesProgressBar.displayName = `RzlNextPagesProgressBar(${
  RzlNextPagesProgressBar.displayName ??
  RzlNextPagesProgressBar.name ??
  "Component"
})`;
