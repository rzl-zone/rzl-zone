"use client";

import { useCallback, useEffect, useMemo } from "react";
import { validateHTMLColor } from "validate-color";
import { isNonEmptyString, isUndefined } from "@rzl-zone/utils-js/predicates";

import type { UseCssTopLoader } from "../types";
import { isValidEasingValue } from "../utils/rzlProgress";
import {
  DATA_RZL_PROGRESS,
  defaultPropsInitRzlNextProgressBar
} from "../constants";

const { MAIN_IDENTITY, KEY_DATA } = DATA_RZL_PROGRESS.STYLE_ELEMENT;

/** @internal */
export const useCssTopLoader = ({
  id,
  name,
  nonce,
  style,
  color,
  height,
  spinnerEase,
  colorSpinner,
  zIndex,
  spinnerSize,
  spinnerSpeed,
  showAtBottom,
  classNameIfLoading = defaultPropsInitRzlNextProgressBar["classNameIfLoading"]
}: UseCssTopLoader) => {
  const positionStyle = showAtBottom ? "bottom: 0;" : "top: 0;";
  const spinnerPositionStyle = showAtBottom ? "bottom: 15px;" : "top: 15px;";

  const validationEaseSpinner = useCallback(() => {
    if (isValidEasingValue(spinnerEase)) return spinnerEase;

    return "linear";
  }, [spinnerEase]);

  const typeColorBase =
    colorSpinner?.type === "base" && isNonEmptyString(colorSpinner.ValueBase)
      ? colorSpinner.ValueBase
      : undefined;
  const typeColorHex =
    colorSpinner?.type === "advance" &&
    isNonEmptyString(colorSpinner.ValueAdvance)
      ? colorSpinner.ValueAdvance
      : undefined;

  if (!isUndefined(classNameIfLoading) && !isNonEmptyString(classNameIfLoading))
    classNameIfLoading =
      defaultPropsInitRzlNextProgressBar["classNameIfLoading"];

  const validationOfColorSpinner = useCallback(() => {
    if (typeColorBase && typeColorHex) {
      return "#29f";
    } else {
      if (typeColorBase) return typeColorBase;
      if (typeColorHex && validateHTMLColor(typeColorHex)) return typeColorHex;
      return "#29f";
    }
  }, [
    typeColorBase, // Use individual properties
    typeColorHex // Use individual properties
  ]);

  const styles = useMemo(() => {
    return (
      typeof style === "string" && style.trim().length
        ? style.replace(/\s\s+/g, "").trim()
        : `
        #rzl-progress {
          pointer-events: none;
          position: fixed;
          z-index: ${zIndex};
          top: 0;
          left: 0;
          width: 100%;height: ${height};
        }

        #rzl-progress .bar {
          position: fixed;
          width: 100%;
          left: 0;
          ${positionStyle}
          height: ${height};
          z-index: ${zIndex};
          background: ${color};
        }
        
        #rzl-progress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          opacity: 1.0;
          box-shadow: 0 0 10px ${color}, 0 0 5px ${color};

          -webkit-transform: rotate(3deg) translate(0px, -4px);
              -ms-transform: rotate(3deg) translate(0px, -4px);
                  transform: rotate(3deg) translate(0px, -4px);
        }
        
        #rzl-progress .spinner {
          display: block;
          position: fixed;
          z-index: ${zIndex};
          ${spinnerPositionStyle}
          right:15px;
        }

        #rzl-progress .spinner-icon {
          width: 18px;
          height: 18px;
          box-sizing: border-box;
          border: solid ${spinnerSize} transparent;
          border-top-color: ${validationOfColorSpinner()};
          border-left-color: ${validationOfColorSpinner()};
          border-radius: 50%;
          -webkit-animation: rzl-progress-spinner ${spinnerSpeed}ms ${validationEaseSpinner()} infinite;
                  animation: rzl-progress-spinner ${spinnerSpeed}ms ${validationEaseSpinner()} infinite;
        }

        .rzl-progress-custom-parent {
          overflow: hidden;
          position: relative;
        }

        .rzl-progress-custom-parent #rzl-progress .spinner,
        .rzl-progress-custom-parent #rzl-progress .bar {
          position: absolute;
        }

        @-webkit-keyframes rzl-progress-spinner {
          0%   { -webkit-transform: rotate(0deg); }
          100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes rzl-progress-spinner {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `
    )
      .replace(/\s\s+/g, "")
      .trim();
  }, [
    style,
    color,
    zIndex,
    height,
    positionStyle,
    spinnerPositionStyle,
    spinnerSize,
    spinnerSpeed,
    validationEaseSpinner,
    validationOfColorSpinner
  ]);

  useEffect(() => {
    // Create a new <style> element
    const styleElement = document.createElement("style");

    styleElement.setAttribute("type", "text/css");
    styleElement.setAttribute(MAIN_IDENTITY.KEY, MAIN_IDENTITY.VALUE);

    // Set the 'id' only if it's provided, otherwise it will be undefined
    if (id) styleElement.id = id;

    // Conditionally set the 'name' attributes if they are defined
    if (name) styleElement.setAttribute("name", name);

    // Conditionally set the 'nonce' attributes if they are defined
    if (nonce) styleElement.setAttribute("nonce", nonce);

    // Force set
    if (classNameIfLoading)
      styleElement.setAttribute(
        KEY_DATA.CLASS_NAME_LOADING,
        classNameIfLoading
      );

    // Set the CSS content inside the <style> element
    styleElement.innerHTML = styles;

    // Append the style element to the head
    document.head.appendChild(styleElement);

    // Cleanup when the component is unmounted
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};
