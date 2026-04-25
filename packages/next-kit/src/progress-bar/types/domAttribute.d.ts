/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import "react";

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
  interface ButtonHTMLAttributes<T> extends RzlTopLoaderAttribute {}

  interface AnchorHTMLAttributes<T> extends RzlTopLoaderAttribute {}
}
