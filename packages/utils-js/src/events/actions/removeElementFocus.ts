import { isServer } from "@/predicates/is/isServer";

/** ----------------------------------------------------------
 * * ***Utility: `removeElementFocus`.***
 * ----------------------------------------------------------
 * **Removes focus from the currently active element in the document.**
 * - **Features**:
 *    - This function works **only in browser environments** ***(safely no-ops in server environments)***.
 *    - If an element is focused, it will lose focus by calling `HTMLElement.blur()`.
 *    - If no element is focused or the active element is not an `HTMLElement`, nothing happens.
 * @returns {void} Does not return anything (void).
 * @example
 * removeElementFocus(); // ➔ Removes focus from the currently active element
 */
export const removeElementFocus = (): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  } else {
    // not-support, currently we nothing to do...
    // console.warn("removeElementFocus: No active element to blur or unsupported element type.");
  }
};
