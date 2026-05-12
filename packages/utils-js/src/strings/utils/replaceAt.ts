import { isNumber } from "@/predicates/is/isNumber";
import { isString } from "@/predicates/is/isString";
import { getPreciseType } from "@/predicates/type/getPreciseType";

/** ----------------------------------------------------------
 *  * ***Utility: `replaceAt`.***
 * ----------------------------------------------------------
 * **Replaces exactly one character at the specified index in the original string
 * with the provided `replaceTo` string.**
 * - **Behavior:**
 *    - If `replaceTo` has more than one character,
 * the result will expand accordingly.
 * @param {number} index - The starting index where the replacement should occur.
 * @param {string} originalString - The original string to modify.
 * @param {string} replaceTo - The string to insert at the specified index.
 * @returns {string} The modified string with the replacement applied.
 * @example
 * replaceAt(3, "hello", "X");
 * // ➔ "helXo"
 * replaceAt(1, "world", "AB");
 * // ➔ "wABrld"
 * replaceAt(0, "cat", "br");
 * // ➔ "brat"
 * replaceAt(2, "12345", "-");
 * // ➔ "12-45"
 * replaceAt(4, "ABCDE", "Z");
 * // ➔ "ABCDZ"
 * // ❌ Examples that throw:
 * replaceAt(10, "short", "X");
 * // ➔ ❌ RangeError: First parameter (`index`) is out of range from second parameter `originalString`.
 * replaceAt(-1, "test", "X");
 * // ➔ ❌ RangeError: First parameter (`index`) is out of range from second parameter `originalString`.
 * replaceAt("1", "test", "X");
 * // ➔ ❌ TypeError: First parameter `index` must be of type `number`, second parameter `originalString` and third parameter `replaceTo` must be of type `string`, but received: "['index': `string`,...]."
 * replaceAt(2, null, "X");
 * // ➔ ❌ TypeError: First parameter `index` must be of type `number`, second parameter `originalString` and third parameter `replaceTo` must be of type `string`, but received: "['index': `string`,...]."
 */
export const replaceAt = (
  index: number,
  originalString: string,
  replaceTo: string
): string => {
  if (!isNumber(index) || !isString(replaceTo) || !isString(originalString)) {
    throw new TypeError(
      `First parameter (\`index\`) must be of type \`number\`, second parameter (\`originalString\`) and third parameter (\`replaceTo\`) must be of type \`string\`, but received: "['index': \`${getPreciseType(
        index
      )}\`, 'originalString': \`${getPreciseType(
        originalString
      )}\`, 'replaceTo': \`${getPreciseType(replaceTo)}\`]".`
    );
  }

  // Handle edge cases
  if (index < 0 || index >= originalString.length) {
    throw new RangeError(
      "First parameter (`index`) is out of range from second parameter (`originalString`)."
    );
  }

  return (
    originalString.slice(0, index) + // Extract before the index
    replaceTo + // Insert replacement
    originalString.slice(index + 1) // Extract after replacement
  );
};
