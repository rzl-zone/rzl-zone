import type {
  ColorCssNamed,
  PickStrict,
  Prettify
} from "@rzl-zone/ts-types-plus";

export type ElementProgress = HTMLElement | HTMLAnchorElement;

export type UseCssTopLoader = Prettify<
  {
    color: string;
    height: string;
    zIndex: number;
    spinnerSize: string;
    spinnerSpeed: number;
    showAtBottom: boolean;
    spinnerEase: RzlProgressEasing;
    colorSpinner: ColorBase | ColorAdvance | undefined;
  } & Pick<
    RzlNextProgressBarProps,
    "id" | "name" | "nonce" | "style" | "classNameIfLoading"
  >
>;

export type RzlProgressDirection = "ltr" | "rtl";
export type RzlProgressEasing =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

export type RzlProgressOptions = Prettify<
  Pick<RzlNextProgressBarProps, "classNameIfLoading"> & {
    /** * ***The initial position for the Progress Bar Loader in percentage, 0.08 is 8%.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type number, otherwise will return default value.
     * @default 0.08
     */
    minimum?: number;
    /** * ***The the maximum percentage used upon finishing, 1 is 100%.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type number, otherwise will return default value.
     * @default 1
     */
    maximum?: number;
    /** * ***Defines a template for the Progress Bar Loader.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type string, otherwise will return default value.
     * @default
     * ```jsx
     * `<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`
     * ```
     */
    template?: string;
    /** * ***Animation settings using easing (a CSS easing string).***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type {@link RzlProgressEasing | *`RzlProgressEasing`*}, otherwise will return default value.
     * @default "linear"
     */
    easing?: RzlProgressEasing;
    /** * ***Animation speed in ms for the Progress Bar Loader.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type integer number, otherwise will return default value.
     * @default 200
     */
    speed?: number;
    /** * ***Auto incrementing behavior for the Progress Bar Loader.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type boolean, otherwise will return default value.
     * @default true
     */
    trickle?: boolean;
    /** * ***The increment delay speed in milliseconds.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type integer number, otherwise will return default value.
     * @default 200
     */
    trickleSpeed?: number;
    /** * ***To show spinner or not.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type boolean, otherwise will return default value.
     * @default true
     */
    showSpinner?: boolean;
    /** * ***Specify this to change the parent container.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type {@link HTMLElement | *`HTMLElement`*} or string, otherwise will return default value.
     * @default "body"
     */
    parent?: HTMLElement | string;
    /**
     * - **⚠️ Warning:**
     *    - The value must be of type string, otherwise will return default value.
     * @default ""
     */
    positionUsing?: string;
    /** * ***The selector attribute position.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type string, otherwise will return default value.
     * @default '[role="bar"]'
     */
    barSelector?: string;
    /** * ***The selector attribute spinner.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type string, otherwise will return default value.
     * @default '[role="spinner"]'
     */
    spinnerSelector?: string;
    /** * ***The direction bar.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type {@link RzlProgressDirection | *`RzlProgressDirection`*}, otherwise will return default value.
     * @default 'ltr'
     */
    direction?: RzlProgressDirection;
  }
>;

type RzlTopLoaderAttribute = {
  /** * Force trigger loader bar on action.
   *
   * @deprecated Unused anymore.
   * @description It will trigger if button type is submit and has valid form action.
   * @default false
   */
  "data-submit-rzl-progress-bar"?: boolean;
  /** * Prevent triggering loader bar on action.
   *
   * @note Only work for ***`App Router`*** only.
   * @default false
   */
  "data-prevent-rzl-progress-bar"?: boolean;
};

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> extends RzlTopLoaderAttribute {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface AnchorHTMLAttributes<T> extends RzlTopLoaderAttribute {}
}

export type SpinnerPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type ColorBase = {
  type: "base";
  /** * ***Support only Valid Color CSS.***
   *
   */
  ValueBase?: ColorCssNamed;
};
export type ColorAdvance = {
  type: "advance";
  /** * ***Support only HEX, RGB, RGBA, HSL, HSLA, HWB, LAB, LCH.***
   *
   */
  ValueAdvance?: string;
};

export type RzlProgressType = Prettify<
  {
    /** * ***Animation settings using easing (a CSS easing string).***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type {@link RzlProgressEasing}, otherwise will return default value.
     * @default "ease"
     */
    easing?: RzlProgressEasing;
  } & RzlProgressOptions
>;

export type RzlNextProgressBarProps = {
  /** * ***CSS class name that will be applied to the loader container
   * **only while the loader is active (loading)**.***
   *
   * **Useful if you need to style or animate the element differently
   * during page transitions.**
   *
   * *By default, a simple ready-to-use style is provided in:*
   * ```ts
   * import "@rzl-zone/next-kit/progress-bar/default.css";
   * ```
   * *This import can be placed in your global stylesheet entry,
   * for example:*
   * 1. At layout.tsx:
   * ```ts
   * import "@rzl-zone/next-kit/progress-bar/default.css";
   * ```
   * 2. At global stylesheet entry (eg: globals.css):
   * **`@import "@rzl-zone/next-kit/progress-bar/default.css";`**
   *
   * Which defines a class named **`on_processing`**.
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string and cant be empty-string, otherwise will
   *      return default value.
   *
   * @default "on_processing"
   */
  classNameIfLoading?: string;
  /** * ***Color for the TopLoader.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string and cant be empty-string, otherwise will return default value.
   * @default "linear-gradient(45deg, #b656cb, #29f)"
   */
  color?: string;
  /** * ***Show Progress Bar At Bottom Page.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type boolean, otherwise will return default value.
   * @default false
   */
  showAtBottom?: boolean;
  /** * ***The position of the progress bar at the start of the page load.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid number, otherwise will return default value.
   * @default 0
   */
  startPosition?: number;
  /** * ***When the page loads faster than the progress bar, it does not display.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 0
   */
  delay?: number;
  /** * ***Delay to stop the progress bar.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 0
   */
  stopDelay?: number;
  /** * ***To show the TopLoader for hash anchors.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type boolean, otherwise will return default value.
   * @default true
   */
  showForHashAnchor?: boolean;
  /** * ***The id attribute to use for the `style` tag.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string and cant be empty-string, otherwise will return default value.
   * @default undefined
   */
  id?: string;
  /** * ***The z-index of the loader.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 9999
   */
  zIndex?: number;
  /** * ***The name attribute to use for the `style` tag.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string and cant be empty-string, otherwise will return default value.
   * @default undefined
   */
  name?: string;
  /** * ***Custom nonce for Content-Security-Policy directives.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   * @default undefined
   */
  nonce?: string;
  /** * ***Custom CSS.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string and cant be empty-string, otherwise will return default value.
   * @default undefined
   */
  style?: string;
  /** * ***Height of the progress bar.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string and cant be empty-string, otherwise will return default value.
   * @default "3px"
   */
  height?: string;
  /** * ***The color of the Spinner. Support only HEX, RGB, RGBA, HSL, HSLA, HWB, LAB, LCH or Valid Color CSS, depends of your type props.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type {@link ColorBase | *`ColorBase`*} or {@link ColorAdvance | *`ColorAdvance`*}, otherwise will return default value.
   * @default hex: "#29f"
   */
  colorSpinner?: Extract<
    ColorBase | ColorAdvance,
    { type: "advance" | "base" }
  >;
  /** * ***The size of the spinner.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string and cant be empty-string, otherwise will return default value.
   * @default "3px"
   */
  spinnerSize?: string;
  /** * ***The speed of the spinner.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 400
   */
  spinnerSpeed?: number;
  /** * ***The ease function of the spinner.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type {@link RzlProgressEasing | *`RzlProgressEasing`*}, otherwise will return default value.
   * @default "linear"
   */
  spinnerEase?: RzlProgressEasing;
  /** * ***Showing Progress Bar On First Initial/Refresh Page.***
   *
   * @deprecated Unused anymore.
   */
  showProgressOnInitial?: {
    /**
     * @default true
     */
    enabled?: boolean;
    /** * ***Delaying Before Trigger Stop Progress Bar.***
     *
     * @default 100
     */
    delay?: number;
  };
  /** * ***Options of `RzlProgress`.***
   *
   */
  options?: RzlProgressType;
};

export type ProgressBarPagesComponentProps = Prettify<
  Omit<RzlNextProgressBarProps, "showForHashAnchor"> & {
    /** Disable triggering progress bar on the same URL
     *
     * - **⚠️ Warning:**
     *    - The value must be of type boolean, otherwise will return default value.
     * @default false
     */
    disableSameURL?: boolean;
    /** If the progress bar is not displayed when you use shallow routing
     *
     * - **⚠️ Warning:**
     *    - The value must be of type boolean, otherwise will return default value.
     * @default false
     */
    shallowRouting?: boolean;
  }
>;

type OptionsRzlProgress = Prettify<
  RzlProgressType &
    Partial<PickStrict<RzlNextProgressBarProps, "startPosition">>
>;

export type OptionsUseRouter = {
  /** * ***Disabling Progress Bar.***.
   *
   * @default false
   */
  disableProgressBar?: boolean;
  /** * ***Disabling on any action.***.
   *
   * @default false
   */
  disablePreventAnyAction?: boolean;
  /** * ***Options of `RzlProgress`.***
   *
   */
  options?: OptionsRzlProgress;
};

export type NavigateOptionsUseRouter = Prettify<
  OptionsUseRouter & {
    /** * ***Scrolling to top of page.***
     *
     * @default true
     */
    scroll?: boolean;
    /**
     * Transition types to apply when navigating. These types are passed to
     * [`React.addTransitionType`](https://react.dev/reference/react/addTransitionType)
     * inside the navigation transition, enabling
     * [`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) components
     * to apply different animations based on the type of navigation.
     *
     * **⚠️ Supported only in (***Next.js >= 16.2.0***) and (***React >= 19.2***).**
     *
     */
    transitionTypes?: string[];
  }
>;
export type NavigateFwdOptionsUseRouter = Prettify<
  OptionsUseRouter & {
    /**
     * @default 100
     */
    delayStops?: number;
  }
>;

export type AppRouterInstance = {
  /** * ***Navigate to the previous history entry.***
   *
   */
  back(options?: OptionsUseRouter): void;
  /** * ***Navigate to the next history entry.***
   *
   */
  forward(options?: NavigateFwdOptionsUseRouter): void;
  /** * ***Refresh the current page.***
   *
   */
  refresh(options?: OptionsUseRouter): void;
  /** * ***Navigate to the provided href.***
   *
   * **Pushes a new history entry.**
   */
  push(href: string, options?: NavigateOptionsUseRouter): void;
  /** * ***Navigate to the provided href.***
   *
   * **Replaces the current history entry.**
   */
  replace(href: string, options?: NavigateOptionsUseRouter): void;
};
