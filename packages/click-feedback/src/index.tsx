"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import styles from "./main.module.css";
const interactiveElementSelector = "a, button" as const;

/** ----------------------------------------------------------------
 * * ***Global click ripple / pointer feedback overlay for interactive elements.***
 * ----------------------------------------------------------------
 *
 * `ClickFeedback` is a client-side React component that renders
 * animated visual feedback (ripple-like effect) when the user
 * interacts with supported interactive elements.
 *
 * Without this import, the feedback animation will not render
 * or behave correctly.
 *
 * Supported interactive elements:
 * - **`<a>`**.
 * - **`<button>`** (excluding disabled buttons).
 *
 * The component works by:
 * - Listening to global `pointerdown` events on `document.body`.
 * - Detecting whether the interaction originated from a valid
 *   interactive element using `closest()`.
 * - Calculating the feedback size based on the target element’s
 *   bounding box diagonal.
 * - Positioning the animation precisely at the pointer coordinates.
 *
 * Each feedback instance:
 * - Uses CSS custom properties for size and position.
 * - Is uniquely identified using the pointer event timestamp.
 * - Automatically removes itself when the animation completes.
 *
 * @remarks
 * - Designed for Next.js App Router and requires `"use client"`.
 * - The wrapper element must be positioned relative for correct
 *   coordinate calculation.
 * - Safe against interactions with nested elements and SVG nodes.
 *
 * @example
 * ```tsx
 * export default function Page() {
 *   return (
 *     <button className="relative">
 *       Click me
 *       <ClickFeedback />
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * <a href="/profile" className="relative">
 *   Profile
 *   <ClickFeedback />
 * </a>
 * ```
 */
export const ClickFeedback = () => {
  const [clickFeedbacks, setClickFeedback] = useState<
    Array<{
      id: number;
      size: number;
      x: number;
      y: number;
    }>
  >([]);
  const ref = useRef<HTMLSpanElement>(null);
  const handlePointerDown = useCallback((event: PointerEvent) => {
    const clickFeedbackElement = ref.current;
    if (!clickFeedbackElement) {
      return;
    }
    const parent = clickFeedbackElement.parentElement?.closest(
      interactiveElementSelector
    );
    if (!parent) {
      return;
    }
    if (
      !(event.target instanceof HTMLElement) &&
      !(event.target instanceof SVGElement)
    ) {
      return;
    }
    const interactedWithElement = event.target.closest(
      interactiveElementSelector
    );
    if (interactedWithElement !== parent) {
      return;
    }
    if (
      interactedWithElement instanceof HTMLButtonElement &&
      interactedWithElement.disabled
    ) {
      return;
    }
    const rect = parent.getBoundingClientRect();
    const size =
      2 * Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2));
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickFeedback((clickFeedbacks) => [
      ...clickFeedbacks,
      {
        id: event.timeStamp,
        size,
        x,
        y
      }
    ]);
  }, []);

  useEffect(() => {
    document.body.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.body.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handlePointerDown]);

  const discardClickFeedback = useCallback((clickFeedbackId: number) => {
    setClickFeedback((clickFeedbacks) =>
      clickFeedbacks.filter(
        (clickFeedback) => clickFeedback.id !== clickFeedbackId
      )
    );
  }, []);

  return (
    <span
      ref={ref}
      className={styles.wrapper}
    >
      {clickFeedbacks.map((clickFeedback) => (
        <span
          className={styles["click-feedback"]}
          key={clickFeedback.id}
          style={
            {
              "--Click-feedback-size": `${clickFeedback.size}px`,
              "--Click-feedback-x": `${clickFeedback.x}px`,
              "--Click-feedback-y": `${clickFeedback.y}px`
            } as CSSProperties
          }
          onAnimationEnd={() => {
            discardClickFeedback(clickFeedback.id);
          }}
        />
      ))}
    </span>
  );
};
