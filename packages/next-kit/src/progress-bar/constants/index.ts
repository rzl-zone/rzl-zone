import type { RzlProgressType, ElementProgress } from "../types";

/** @internal */
export const defaultOptionsProgressBar = {
  easing: "ease",
  showSpinner: true,
  minimum: 0.08,
  maximum: 1,
  // eslint-disable-next-line quotes
  template: `<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`,
  positionUsing: "",
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  // eslint-disable-next-line quotes
  barSelector: '[role="bar"]',
  // eslint-disable-next-line quotes
  spinnerSelector: '[role="spinner"]',
  parent: "body",
  direction: "ltr"
} as const satisfies RzlProgressType;

/** @internal */
export const DATA_ATTRIBUTE = {
  BUTTON_SUBMIT: "data-submit-rzl-progress-bar",
  CHILD_BUTTON_SUBMIT: "data-child-submit-rzl-progress-bar",
  PREVENT_RZL_PROGRESS: "data-prevent-rzl-progress-bar",
  IS_PREVENT_RZL_PROGRESS: (element?: ElementProgress | null) => {
    return (
      element?.getAttribute(DATA_ATTRIBUTE.PREVENT_RZL_PROGRESS) === "true"
    );
  },
  IS_BTN_SUBMIT_RZL_PROGRESS: (element?: ElementProgress | null) => {
    return element?.getAttribute(DATA_ATTRIBUTE.BUTTON_SUBMIT) === "true";
  },
  IS_CHILD_BTN_SUBMIT_RZL_PROGRESS: (
    element?: Element | ElementProgress | null
  ) => {
    return element?.getAttribute(DATA_ATTRIBUTE.CHILD_BUTTON_SUBMIT) === "true";
  },
  IS_VALID_BTN_SUBMIT_RZL_PROGRESS: (
    element?: Element | ElementProgress | null
  ): element is HTMLButtonElement => {
    if (!element) return false;

    return (
      element &&
      element instanceof HTMLButtonElement &&
      element.tagName.toLowerCase() == "button" &&
      element.getAttribute(DATA_ATTRIBUTE.BUTTON_SUBMIT) === "true"
    );
  },
  FORM: {
    IS_METHOD_POST_FORM: (form?: HTMLFormElement | null) => {
      return form?.getAttribute("method")?.toLowerCase() === "post";
    },
    IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION: (
      form?: HTMLFormElement | null
    ) => {
      return (
        form?.getAttribute("action")?.toLowerCase().replace("\\'r", "'r") ===
        DATA_ATTRIBUTE.FORM.ERROR_NEXTJS_SERVER_ACTION
      );
    },
    FIXING_AND_LOWERCASE_TEXT: (value?: string) => {
      return value?.toLowerCase().replace("\\'r", "'r").trim();
    },
    ERROR_NEXTJS_SERVER_ACTION:
      "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you're trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
        .toLowerCase()
        .replace("\\'r", "'r")
  }
} as const;

/** @internal */
export const SETTING_CONFIGS_PROGRESS_BAR = {
  MAXIMUM_COUNT_LIMIT_INTERVAL: 200
} as const;

/** @internal */
export const defaultPropsInitRzlNextProgressBar = {
  // showProgressOnInitial = {
  //   delay: 100,
  //   enabled: true
  // },
  classNameIfLoading: "on_processing",
  spinnerSpeed: 400,
  spinnerSize: "3px",
  spinnerEase: "linear",
  color: "linear-gradient(45deg, #b656cb, #29f)",
  height: "3px",
  zIndex: 9999,
  showAtBottom: false,
  startPosition: 0,
  delay: 0,
  stopDelay: 0,
  showForHashAnchor: true,
  options: defaultOptionsProgressBar,

  //? Options for PagesDir type.
  disableSameURL: false,
  shallowRouting: false
} as const;

/** @internal */
export const DATA_RZL_PROGRESS = {
  MAIN_ID: "rzl-progress",
  ON_BUSY: "rzl-progress-busy",
  CUSTOM_PARENT: "rzl-progress-custom-parent",
  STYLE_ELEMENT: {
    MAIN_IDENTITY: { KEY: "data-styles", VALUE: "rzlzone-progress_bar" },
    KEY_DATA: {
      CLASS_NAME_LOADING: "data-classname-loading"
    }
  }
} as const;
