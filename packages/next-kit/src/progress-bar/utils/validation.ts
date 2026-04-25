import {
  isBoolean,
  isInteger,
  isNonEmptyString,
  isNumber,
  isPlainObject,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { defaultPropsInitRzlNextProgressBar as defaultProps } from "../constants";
import { isValidEasingValue } from "./rzlProgress";
import type {
  ProgressBarPagesComponentProps,
  RzlNextProgressBarProps
} from "../types";

/** @internal */
export const validationPropsPgBar = (
  props: RzlNextProgressBarProps &
    Pick<
      ProgressBarPagesComponentProps,
      "disableSameURL" | "shallowRouting"
    > = defaultProps
) => {
  if (!isPlainObject(props)) props = {};

  let {
    id,
    name,
    nonce,
    style,
    colorSpinner,
    classNameIfLoading = defaultProps.classNameIfLoading,
    spinnerSpeed = defaultProps.spinnerSpeed,
    spinnerSize = defaultProps.spinnerSize,
    spinnerEase = defaultProps.spinnerEase,
    color = defaultProps.color,
    height = defaultProps.height,
    zIndex = defaultProps.zIndex,
    showAtBottom = defaultProps.showAtBottom,
    startPosition = defaultProps.startPosition,
    delay = defaultProps.delay,
    stopDelay = defaultProps.stopDelay,
    showForHashAnchor = defaultProps.showForHashAnchor,
    options = defaultProps.options,
    disableSameURL = defaultProps.disableSameURL,
    shallowRouting = defaultProps.shallowRouting
  } = props;

  if (!isUndefined(id) && !isNonEmptyString(id)) id = undefined;
  if (!isUndefined(name) && !isNonEmptyString(name)) name = undefined;
  if (!isUndefined(nonce) && !isString(nonce)) nonce = undefined;
  if (!isUndefined(style) && !isNonEmptyString(style)) style = undefined;

  if (
    !isUndefined(classNameIfLoading) &&
    !isNonEmptyString(classNameIfLoading)
  ) {
    classNameIfLoading = defaultProps.classNameIfLoading;
  }

  if (
    !isUndefined(colorSpinner) &&
    (!isPlainObject(colorSpinner) ||
      (colorSpinner.type !== "base" && colorSpinner.type !== "advance") ||
      (colorSpinner.type === "base" &&
        !isUndefined(colorSpinner.ValueBase) &&
        !isString(colorSpinner.ValueBase)) ||
      (colorSpinner.type === "advance" &&
        !isUndefined(colorSpinner.ValueAdvance) &&
        !isString(colorSpinner.ValueAdvance)))
  ) {
    colorSpinner = undefined;
  }

  if (!isInteger(spinnerSpeed)) spinnerSpeed = defaultProps.spinnerSpeed;
  if (!isNonEmptyString(spinnerSize)) spinnerSize = defaultProps.spinnerSize;
  if (!isValidEasingValue(spinnerEase)) spinnerEase = defaultProps.spinnerEase;
  if (!isNonEmptyString(color)) color = defaultProps.color;
  if (!isNonEmptyString(height)) height = defaultProps.height;
  if (!isInteger(zIndex)) zIndex = defaultProps.zIndex;
  if (!isBoolean(showAtBottom)) showAtBottom = defaultProps.showAtBottom;
  if (!isNumber(startPosition)) startPosition = defaultProps.startPosition;
  if (!isInteger(delay)) delay = defaultProps.delay;
  if (!isInteger(stopDelay)) stopDelay = defaultProps.stopDelay;
  if (!isBoolean(showForHashAnchor))
    showForHashAnchor = defaultProps.showForHashAnchor;
  if (!isPlainObject(options)) options = defaultProps.options;

  if (!isBoolean(disableSameURL)) disableSameURL = defaultProps.disableSameURL;
  if (!isBoolean(shallowRouting)) shallowRouting = defaultProps.shallowRouting;

  return {
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
    options,

    disableSameURL,
    shallowRouting
  };
};
