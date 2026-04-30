"use client";

import {
  type EffectCallback,
  memo,
  useCallback,
  useEffect,
  useRef
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { delay as delaying } from "@rzl-zone/utils-js/promises";
import { isBoolean, isString } from "@rzl-zone/utils-js/predicates";
import {
  disableUserInteraction,
  enableUserInteraction
} from "@rzl-zone/utils-js/events";

import {
  DATA_ATTRIBUTE,
  DATA_RZL_PROGRESS,
  SETTING_CONFIGS_PROGRESS_BAR
} from "../constants";
import { RzlProgress } from "../utils/rzlProgress";
import { validationPropsPgBar } from "../utils/validation";
import { useCssTopLoader } from "../hooks/useCssTopLoader";

import type { RzlNextProgressBarProps } from "../types";
import {
  isAnchorOfCurrentUrl,
  isHashAnchor,
  isSameHostName,
  toAbsoluteURL
} from "../utils/pathURL";
import { setAttributeChildSubmitBtn } from "../utils/attributes";
import { findClosestAnchor } from "../utils/anchor";

const {
  FORM,
  BUTTON_SUBMIT,
  IS_BTN_SUBMIT_RZL_PROGRESS,
  IS_PREVENT_RZL_PROGRESS,
  IS_VALID_BTN_SUBMIT_RZL_PROGRESS
} = DATA_ATTRIBUTE;
const { MAXIMUM_COUNT_LIMIT_INTERVAL } = SETTING_CONFIGS_PROGRESS_BAR;
const { IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION, IS_METHOD_POST_FORM } =
  FORM;

/** ------------------------------------------------------------------
 * * ***Don't use import from here, because need Suspense (App Router).***
 * ------------------------------------------------------------------
 * **If you forcing to use from this components, you need wrapping with Suspense.**
 *
 * ⚠️ **Deprecated:**
 *    - Use `import { RzlNextAppProgressBar } from "@rzl-zone/next-kit/progress-bar/app";` instead, because include `WithSuspense` in there.
 */
const InitNextAppProgressBar = memo((props: RzlNextProgressBarProps) => {
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
    showForHashAnchor,
    options
  } = validationPropsPgBar(props);

  const timer = useRef<NodeJS.Timeout | number>(0);
  const searchCounting = useRef<number>(1);

  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    (
      /**
       * @default true
       */
      withDelay = true
    ) => {
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
      /**
       * @default true
       */
      withDelay = true,
      /**
       * @default false
       */
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

  //todo: DEPRECATED - unused anymore
  // const showingInitial = useCallback(async () => {
  //   if (showProgressOnInitial?.enabled) {
  //     await startProgress();
  //     await delaying(showProgressOnInitial.delay);
  //     await stopProgress();
  //   }
  // }, []);

  const setAttrChildSubmitBtn = useCallback(
    (docs: Document, type: "delete" | "add" = "add") => {
      return setAttributeChildSubmitBtn(docs, type);
    },
    []
  );

  useEffect(() => {
    stopProgress();
  }, [pathname, searchParams]);

  useEffect(() => {
    const actionsIdTimeInterval: NodeJS.Timeout | undefined = setInterval(
      () => {
        if (searchCounting.current < MAXIMUM_COUNT_LIMIT_INTERVAL) {
          if (document.querySelectorAll(`[${BUTTON_SUBMIT}]`).length) {
            document
              .querySelectorAll(`[${BUTTON_SUBMIT}]`)
              ?.forEach((button) => {
                if (IS_VALID_BTN_SUBMIT_RZL_PROGRESS(button)) {
                  const isBtnSubmitFormValid =
                    button.form &&
                    (IS_METHOD_POST_FORM(button.form) ||
                      IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION(button.form));

                  if (isBtnSubmitFormValid) {
                    setAttrChildSubmitBtn(document);

                    searchCounting.current = MAXIMUM_COUNT_LIMIT_INTERVAL;

                    return clearInterval(actionsIdTimeInterval);
                  } else {
                    return (searchCounting.current =
                      searchCounting.current + 1);
                  }
                }
              });
          } else {
            return (searchCounting.current = searchCounting.current + 1);
          }
        } else {
          searchCounting.current = MAXIMUM_COUNT_LIMIT_INTERVAL;
          return clearInterval(actionsIdTimeInterval);
        }
      },
      50
    );

    return () => {
      if (actionsIdTimeInterval) {
        clearInterval(actionsIdTimeInterval);
      }

      searchCounting.current = 1;
    };
  }, [pathname, searchParams]);

  //todo: DEPRECATED - unused anymore
  /** * ref for start initial loader only */
  // useEffect(() => {
  //   showingInitial();
  // }, []);

  /** * ClickHandler To Trigger RzlProgress
   *
   * @param event {MouseEvent}
   * @returns {void}
   */
  const handleClick = useCallback(async (event: MouseEvent) => {
    try {
      const target = event.target as HTMLElement;
      const anchor = findClosestAnchor(target);
      const newUrl = anchor?.href;

      let preventProgress =
        IS_PREVENT_RZL_PROGRESS(target) || IS_PREVENT_RZL_PROGRESS(anchor);

      let isButtonSubmitForm = IS_BTN_SUBMIT_RZL_PROGRESS(target);

      //todo: DEPRECATED - unused anymore
      // let isButtonChildSubmitForm = IS_CHILD_BTN_SUBMIT_RZL_PROGRESS(target);

      if (!preventProgress || !isButtonSubmitForm) {
        let element: HTMLButtonElement | HTMLElement | Element | null = target;

        if (isButtonSubmitForm && IS_VALID_BTN_SUBMIT_RZL_PROGRESS(element)) {
          const isBtnSubmitForm =
            IS_METHOD_POST_FORM(element.form) ||
            IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION(element.form);

          while (element) {
            if (isBtnSubmitForm) {
              preventProgress = false;
              isButtonSubmitForm = true;
              break;
            } else {
              preventProgress = true;
              isButtonSubmitForm = false;

              element = element.parentElement as unknown as HTMLButtonElement;
            }
          }
        } else {
          if (element.hasAttribute(DATA_ATTRIBUTE.CHILD_BUTTON_SUBMIT)) {
            while (element && element.tagName.toLowerCase() !== "a") {
              if (IS_BTN_SUBMIT_RZL_PROGRESS(element.parentElement)) {
                if (
                  element.parentElement instanceof HTMLButtonElement &&
                  (IS_METHOD_POST_FORM(element.parentElement.form) ||
                    IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION(
                      element.parentElement.form
                    ))
                ) {
                  preventProgress = false;
                  isButtonSubmitForm = true;
                  // isButtonChildSubmitForm = true;
                  break;
                } else {
                  preventProgress = true;
                  isButtonSubmitForm = false;
                  // isButtonChildSubmitForm = false;
                  break;
                }
              }
              element = element.parentElement;
            }
          } else {
            while (element && element.tagName.toLowerCase() !== "a") {
              if (IS_PREVENT_RZL_PROGRESS(element.parentElement)) {
                preventProgress = true;
                break;
              }
              element = element.parentElement;
            }
          }
        }
      }

      if (preventProgress) return;

      //todo: DEPRECATED - unused anymore
      // if ((isButtonSubmitForm || isButtonChildSubmitForm) && !newUrl) {
      //   await startProgress();
      //   await delaying(30000);
      //   return await stopProgress();
      // }

      if (newUrl && isString(newUrl)) {
        const currentUrl = window.location.href;
        const isExternalLink = anchor.target === "_blank";

        // Check for Special Schemes
        const isSpecialScheme = [
          "tel:",
          "mailto:",
          "sms:",
          "blob:",
          "download:"
        ].some((scheme) => newUrl.startsWith(scheme));

        const notSameHost = !isSameHostName(window.location.href, anchor.href);
        if (notSameHost) return;

        const isAnchorOrHashAnchor =
          isAnchorOfCurrentUrl(currentUrl, newUrl) ||
          isHashAnchor(window.location.href, anchor.href);
        if (!showForHashAnchor && isAnchorOrHashAnchor) return;

        if (
          newUrl === currentUrl ||
          isExternalLink ||
          isSpecialScheme ||
          isAnchorOrHashAnchor ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey ||
          !toAbsoluteURL(anchor.href).startsWith("http")
        ) {
          startProgress();
          await delaying(100);
          stopProgress();
        } else {
          startProgress();
        }
      }
    } catch (err) {
      // Log the error in development only!
      if (process.env["NODE_ENV"] === "development") {
        console.error("ComponentInitRzlNextProgressBar error: ", err);
      }

      startProgress();
      stopProgress();
    } finally {
      // setAttrChildSubmitBtn(document, "delete");
    }
  }, []);

  useEffect((): ReturnType<EffectCallback> => {
    const nProgressClass: NodeListOf<HTMLHtmlElement> =
      document.querySelectorAll("html");

    const removeRzlProgressClass = (): void => {
      return nProgressClass.forEach((el: Element) =>
        el.classList.remove(DATA_RZL_PROGRESS.ON_BUSY)
      );
    };

    /** * Complete TopLoader Progress on adding new entry to history stack
     *
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const pushState = history.pushState;
      history.pushState = (...args) => {
        stopProgress();
        removeRzlProgressClass();
        setAttrChildSubmitBtn(document);
        return pushState.apply(history, args);
      };
    })(window.history);

    /** * Complete TopLoader Progress on replacing current entry of history
     * stack
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const replaceState = history.replaceState;
      history.replaceState = (...args) => {
        stopProgress();
        removeRzlProgressClass();
        setAttrChildSubmitBtn(document);
        return replaceState.apply(history, args);
      };
    })(window.history);

    function handlePageHide() {
      stopProgress();
      removeRzlProgressClass();
    }

    /** * Handle Browser Back and Forth Navigation  */
    function handleBackAndForth() {
      stopProgress();
      setAttrChildSubmitBtn(document);
    }

    // Add the global click event listener
    document.addEventListener("click", handleClick);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("popstate", handleBackAndForth);

    // Clean up the global click event listener when the component is unmounted
    return () => {
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("popstate", handleBackAndForth);
    };
  }, []);

  // No need to return anything since the style is applied directly
  return null;
});

InitNextAppProgressBar.displayName = `InitRzlzoneNextAppProgressBar(${
  InitNextAppProgressBar.displayName ??
  InitNextAppProgressBar.name ??
  "Component"
})`;

export default InitNextAppProgressBar;
