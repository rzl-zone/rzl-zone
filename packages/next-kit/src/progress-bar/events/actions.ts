import {
  enableUserInteraction,
  disableUserInteraction,
  removeElementFocus
} from "@rzl-zone/utils-js/events";
import {
  isBoolean,
  isNonEmptyString,
  isNumber,
  isPlainObject,
  isUndefined
} from "@rzl-zone/utils-js/predicates";

import { RzlProgress } from "../utils/rzlProgress";
import {
  defaultOptionsProgressBar,
  defaultPropsInitRzlNextProgressBar
} from "../constants";

import type { RzlNextProgressBarProps, RzlProgressType } from "../types";

type ClassNameIfLoading = Pick<RzlNextProgressBarProps, "classNameIfLoading">;

type StartRzlProgressProps = {
  /** * Disabled and prevent any actions.
   *
   * @default true
   */
  withDisableAnyAction?: boolean;
  /** * Remove focus (blur) from all element actions.
   *
   * @default true
   */
  withRemoveAllFocusElement?: boolean;
  optionsProgressBar?: RzlProgressType;
  withStopDelay?: {
    /** @default false */
    enable?: boolean;
    /** @default 1000 */
    delayStop?: number;
  };
} & ClassNameIfLoading;

type StopRzlProgressProps = {
  /** @default false */
  force?: boolean;
} & ClassNameIfLoading;

const defaultWithStopDelay = {
  enable: false,
  delayStop: 1000
} as const satisfies Required<StartRzlProgressProps["withStopDelay"]>;

/** ----------------------------------------------------------
 * * ***Utility: `startRzlProgress`.***
 * ----------------------------------------------------------
 * **Starts the `RzlProgress` (bar-loader) with optional configurations.**
 *
 * - **⚠️ Important Usage Requirement:**
 *    - This utility **only works if your Next.js layout has one of the Rzl progress bar components mounted**:
 *      - **App Router** ➔ Must include `RzlNextAppProgressBar` in your root layout.
 *      - **Pages Router** ➔ Must include `RzlNextPagesProgressBar` in `_app.tsx`.
 *
 * - **Features**:
 *    - Automatically disables user interaction and removes focus from elements if enabled.
 *    - Configures and starts the progress bar according to provided options.
 *    - Optionally auto-stops the progress bar after a delay.
 * - All options have strict fallback/default values if invalid or missing.
 * @param {StartRzlProgressProps} [props] - Optional settings for starting the progress bar.
 * @param {boolean} [props.withDisableAnyAction=true] - If `true`, disables all user interactions while progress is running.
 * @param {boolean} [props.withRemoveAllFocusElement=true] - If `true`, removes focus from all actionable elements.
 * @param {RzlProgressType} [props.optionsProgressBar=defaultOptionsProgressBar] - Configuration object for the progress bar.
 * @param {ClassNameIfLoading["classNameIfLoading"]} [props.classNameIfLoading] - Optional CSS class applied during loading.
 * @param {StartRzlProgressProps["withStopDelay"]} [props.withStopDelay] - Optional auto-stop settings.
 * @param {boolean} [props.withStopDelay.enable=false] - If `true`, automatically stops the progress bar after delay.
 * @param {number} [props.withStopDelay.delayStop=1000] - Delay (ms) before automatically stopping the progress bar. Must be ≥ 0.
 * @returns {(forceStop?: boolean) => void} Returns a function to force stop the progress bar immediately.
 * @example
 * // ✅ Valid usage:
 * startRzlProgress();
 * startRzlProgress({ withDisableAnyAction: false });
 * startRzlProgress({ withStopDelay: { enable: true, delayStop: 2000 } });
 *
 * // ❌ Invalid usage (fallback applied):
 * startRzlProgress({ withDisableAnyAction: "yes" as any, withStopDelay: { enable: "true" as any, delayStop: -50 } });
 * // ➔ Fallback to: withDisableAnyAction=true, withStopDelay.enable=false, delayStop=1000
 */
export const startRzlProgress = (
  props: StartRzlProgressProps = {}
): ((forceStop?: boolean) => void) => {
  if (!isPlainObject(props)) props = {};

  const {
    withDisableAnyAction = true,
    optionsProgressBar = defaultOptionsProgressBar,
    withRemoveAllFocusElement = true
  } = props;

  let { classNameIfLoading, withStopDelay = defaultWithStopDelay } = props;

  if (!isUndefined(classNameIfLoading) && !isNonEmptyString(classNameIfLoading))
    classNameIfLoading =
      defaultPropsInitRzlNextProgressBar["classNameIfLoading"];

  if (!isPlainObject(props)) withStopDelay = defaultWithStopDelay;
  let { delayStop, enable } = withStopDelay;

  if (!isBoolean(enable)) enable = defaultWithStopDelay.enable;
  if (!isNumber(delayStop)) delayStop = defaultWithStopDelay.delayStop;

  let timeOut: NodeJS.Timeout | null = null;

  if (!RzlProgress.isRendered() || !RzlProgress.isStarted()) {
    RzlProgress.configure(optionsProgressBar);

    if (withRemoveAllFocusElement) {
      removeElementFocus();
    }

    if (withDisableAnyAction) {
      disableUserInteraction(
        classNameIfLoading || RzlProgress.getClassNameIfLoading() || undefined
      );
    }

    RzlProgress.start();

    if (enable) {
      if (timeOut) clearTimeout(timeOut);

      timeOut = setTimeout(() => {
        stopRzlProgress();
      }, delayStop);
    }
  }

  // ✅ return stop function
  return (forceStop?: boolean) => {
    if (timeOut) clearTimeout(timeOut);

    if (forceStop) stopRzlProgress();
  };
};

/** ----------------------------------------------------------
 * * ***Utility: `stopRzlProgress`.***
 * ----------------------------------------------------------
 * **Stops the `RzlProgress` (bar-loader) and re-enables user interactions.**
 *
 * - **⚠️ Important Usage Requirement:**
 *    - This utility **only works if your Next.js layout has one of the Rzl progress bar components mounted**:
 *      - **App Router** ➔ Must include `RzlNextAppProgressBar` in your root layout.
 *      - **Pages Router** ➔ Must include `RzlNextPagesProgressBar` in `_app.tsx`.
 *
 * - **Features**:
 *    - Stops the progress bar immediately or with force.
 *    - Re-enables user interactions on elements disabled during loading.
 * - Invalid or missing class names are automatically replaced with defaults.
 * @param {StopRzlProgressProps} [props] - Optional settings for stopping the progress bar.
 * @param {boolean} [props.force=false] - If `true`, forces immediate completion of progress bar.
 * @param {ClassNameIfLoading["classNameIfLoading"]} [props.classNameIfLoading] - Optional CSS class applied during loading.
 * @returns {void} Does not return anything.
 * @example
 * stopRzlProgress();
 * stopRzlProgress({ force: true });
 */
export const stopRzlProgress = (props: StopRzlProgressProps = {}): void => {
  if (!isPlainObject(props)) props = {};

  if (RzlProgress.isRendered() || RzlProgress.isStarted()) {
    RzlProgress.done(props.force);
  }

  if (
    !isUndefined(props.classNameIfLoading) &&
    !isNonEmptyString(props.classNameIfLoading)
  ) {
    props.classNameIfLoading =
      defaultPropsInitRzlNextProgressBar["classNameIfLoading"];
  }

  enableUserInteraction(
    props.classNameIfLoading || RzlProgress.getClassNameIfLoading() || undefined
  );
};

/** ----------------------------------------------------------
 * * ***Utility: `isStartedRzlProgress`.***
 * ----------------------------------------------------------
 * **Checks if the `RzlProgress` is currently started.**
 *
 * - **⚠️ Important Usage Requirement:**
 *    - This utility **only works if your Next.js layout has one of the Rzl progress bar components mounted**:
 *      - **App Router** ➔ Must include `RzlNextAppProgressBar` in your root layout.
 *      - **Pages Router** ➔ Must include `RzlNextPagesProgressBar` in `_app.tsx`.
 *
 * @returns {boolean} `true` if progress bar is started, `false` otherwise.
 * @example
 * if (isStartedRzlProgress()) { console.log("Progress is running"); }
 */
export const isStartedRzlProgress = (): boolean => {
  return RzlProgress.isStarted();
};

/** ----------------------------------------------------------
 * * ***Utility: `isRenderedRzlProgress`.***
 * ----------------------------------------------------------
 * **Checks if the `RzlProgress` is rendered in the DOM.**
 *
 * - **⚠️ Important Usage Requirement:**
 *    - This utility **only works if your Next.js layout has one of the Rzl progress bar components mounted**:
 *      - **App Router** ➔ Must include `RzlNextAppProgressBar` in your root layout.
 *      - **Pages Router** ➔ Must include `RzlNextPagesProgressBar` in `_app.tsx`.
 *
 * @returns {boolean} `true` if progress bar exists in the DOM, `false` otherwise.
 * @example
 * if (isRenderedRzlProgress()) { console.log("Progress is in DOM"); }
 */
export const isRenderedRzlProgress = (): boolean => {
  return RzlProgress.isRendered();
};

/** ----------------------------------------------------------
 * * ***Utility: `pauseRzlProgress`.***
 * ----------------------------------------------------------
 * **Pauses the `RzlProgress` bar temporarily.**
 *
 * Can be resumed later using `resumeRzlProgress`.
 *
 * - **⚠️ Important Usage Requirement:**
 *    - This utility **only works if your Next.js layout has one of the Rzl progress bar components mounted**:
 *      - **App Router** ➔ Must include `RzlNextAppProgressBar` in your root layout.
 *      - **Pages Router** ➔ Must include `RzlNextPagesProgressBar` in `_app.tsx`.
 *
 * @returns {void} Does not return anything.
 * @example
 * pauseRzlProgress();
 */
export const pauseRzlProgress = (): void => {
  RzlProgress.pause();
};

/** ----------------------------------------------------------
 * * ***Utility: `resumeRzlProgress`.***
 * ----------------------------------------------------------
 * **Resumes the `RzlProgress` bar if it was paused.**
 *
 * - **⚠️ Important Usage Requirement:**
 *    - This utility **only works if your Next.js layout has one of the Rzl progress bar components mounted**:
 *      - **App Router** ➔ Must include `RzlNextAppProgressBar` in your root layout.
 *      - **Pages Router** ➔ Must include `RzlNextPagesProgressBar` in `_app.tsx`.
 *
 * @returns {void} Does not return anything.
 * @example
 * resumeRzlProgress();
 */
export const resumeRzlProgress = (): void => {
  RzlProgress.resume();
};
