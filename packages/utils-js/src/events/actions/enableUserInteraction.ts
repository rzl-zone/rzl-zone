import { createMessage } from "@/_private/logger";

import { isServer } from "@/predicates/is/isServer";
import { assertIsString } from "@/assertions/strings/assertIsString";

/** ----------------------------------------------------------
 * * ***Utility: `enableUserInteraction`.***
 * -----------------------------------------------------------
 * **Enables user interaction by removing a CSS class from the `<html>` element.**
 *
 * ---
 * - **Key points**:
 *     - Works **only in browser environments**.
 *     - Safely removes the specified CSS class from `<html>`.
 *     - Does nothing if the class is not present.
 *     - Useful to re-enable user interactions after a process
 *       (e.g., loading or processing) completes.
 * - **Using custom CSS classes:**
 *     - You can pass any class name that exists in your CSS.
 *     - Example: if you have `.loading` in your styles, passing `"loading"`
 *       will remove it and re-enable interactions.
 * - **Validation:**
 *     - Throws `TypeError` if the `className` parameter is not a string.
 *
 * ---
 * @default
 * ```ts
 * "on_processing"
 * ```
 *
 * ---
 * @param {string} [className="on_processing"] - The CSS class to remove, defaults to `"on_processing"`.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `className` is not a string.
 *
 * ---
 * @returns {void} Does not return anything (void).
 *
 * ---
 * @example
 * - ***Example in your code:***
 *      ```ts
 *      enableUserInteraction();
 *      // ➔ Removes "on_processing" class
 *      enableUserInteraction("loading");
 *      // ➔ Removes "loading" class
 *
 *      // ❌ Invalid value:
 *      enableUserInteraction(123);
 *      // ➔ Throws TypeError
 *      ```
 *
 * - ***Example in your css file (with defaultValue `className` props [on_processing]):***
 *      ```css
 *      .on_processing {
 *        cursor: wait;
 *        touch-action: none;
 *        user-select: none;
 *      }
 *
 *      .on_processing > * {
 *        pointer-events: none;
 *        touch-action: none;
 *        user-select: none;
 *      }
 *      ```
 */
export const enableUserInteraction = (
  className: string = "on_processing"
): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  assertIsString(className, {
    message({ validType, currentType }) {
      return createMessage(
        "enableUserInteraction",
        `First parameter \`className\` must be of type \`${validType}\`, but received: \`${currentType}\`.`
      );
    }
  });

  const { documentElement } = document;

  if (documentElement && documentElement.classList.contains(className)) {
    documentElement.classList.remove(className);
  }
};
