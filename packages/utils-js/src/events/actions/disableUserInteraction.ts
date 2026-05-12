import { isServer } from "@/predicates/is/isServer";
import { assertIsString } from "@/assertions/strings/assertIsString";

/** ----------------------------------------------------------
 * * ***Utility: `disableUserInteraction`.***
 * ----------------------------------------------------------
 * **Disables user interaction by adding a CSS class to the `<html>` element.**
 * - **Key points**:
 *    - Works **only in browser environments**.
 *    - Safely adds the specified CSS class to `<html>`.
 *    - Prevents multiple additions of the same class.
 *    - Useful to indicate that a process is ongoing
 *   (e.g., loading or processing state).
 * - **Using custom CSS classes:**
 *    - You can pass any class name that exists in your CSS.
 *    - Example: if you have `.loading` in your styles, passing `"loading"`
 *   will add it and disable interactions accordingly.
 * - **Validation:**
 *    - Throws `TypeError` if the `className` parameter is not a string.
 * @defaultValue `"on_processing"`
 * @param {string} [className="on_processing"] - The CSS class to add, defaults to `"on_processing"`.
 * @returns {void} Does not return anything (void).
 * @throws **{@link TypeError | `TypeError`}** if `className` is not a string.
 * @example
 * * ***Example in your code:***
 * ```ts
 * disableUserInteraction();          // ➔ Adds "on_processing" class
 * disableUserInteraction("loading"); // ➔ Adds "loading" class
 * // ❌ Invalid value:
 * disableUserInteraction(123);       // ➔ Throws TypeError
 * ```
 * * ***Example in your css file (with defaultValue `className` props [on_processing]):***
 * ```css
 * .on_processing {
 *   cursor: wait;
 *   touch-action: none;
 *   user-select: none;
 * }
 *
 * .on_processing > * {
 *   pointer-events: none;
 *   touch-action: none;
 *   user-select: none;
 * }
 * ```
 */
export const disableUserInteraction = (
  className: string = "on_processing"
): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  assertIsString(className, {
    message({ validType, currentType }) {
      return `First parameter \`className\` must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  const { documentElement } = document;

  if (documentElement && !documentElement.classList.contains(className)) {
    documentElement.classList.add(className);
  }
};
