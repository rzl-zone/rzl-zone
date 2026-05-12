import type { Stringify } from "@rzl-zone/ts-types-plus";

import { isString } from "@/predicates/is/isString";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { assertIsArray } from "@/assertions/objects/assertIsArray";

/** ----------------------------------------------------------
 * * ***Utility: `shouldForwardProp`.***
 * ----------------------------------------------------------
 * **Creates a helper for styled-components `shouldForwardProp`.**
 *
 * @description
 * 1. Returns a **predicate function** that determines whether a given prop
 * should be forwarded to the DOM.
 * 2. Useful for filtering out internal props (e.g., `$size`, `$active`)
 * so they don't become invalid HTML attributes.
 *
 * - **Behavior:**
 *    - Accepts a strict tuple of **string keys** to exclude from forwarding.
 *    - Every key is validated as a **non-empty string** at runtime.
 *    - Throws a `TypeError` if:
 *      - `props` is not an array, or
 *      - any item is not a non-empty string.
 *    - Automatically coerces the tested prop name to string for matching.
 *
 * @template CustomProps
 *   The component props type to validate against.
 *
 * @param {readonly Stringify<keyof CustomProps>[]}
 *   props
 *   The list of prop names (keys of `CustomProps`) to exclude from forwarding.
 *
 * @returns {(propName: keyof CustomProps | ({} & string)) => boolean}
 *   A function that receives a prop name and returns:
 *   - `true`  ➔ the prop **will** be forwarded to the DOM.
 *   - `false` ➔ the prop **will not** be forwarded.
 *
 * @throws **{@link TypeError | `TypeError`}**
 *   when:
 *   - `props` is not an array, or
 *   - any item is not a non-empty string.
 *
 * @example
 * // Basic usage
 * type Props = { $size: string; color: string; visible: boolean };
 * const filter = shouldForwardProp<Props>(["$size"]);
 *
 * filter("$size");   // ➔ false (blocked).
 * filter("color");   // ➔ true  (forwarded).
 * filter("visible"); // ➔ true  (forwarded).
 *
 * @example
 * // With styled-components
 * type CustomProps = { $internal: boolean; public: string; another: boolean };
 *
 * styled.div.withConfig({
 *   shouldForwardProp: shouldForwardProp<CustomProps>(["$internal"])
 * });
 */
export const shouldForwardProp = <CustomProps extends Record<string, unknown>>(
  props: readonly Stringify<keyof CustomProps>[]
  // props: Partial<UnionToTupleStrict<keyof CustomProps>>
): ((propName: keyof CustomProps | ({} & string)) => boolean) => {
  assertIsArray(props, {
    message: ({ currentType, validType }) =>
      `First parameter (\`props\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const invalidItems: { index: number; reason: string }[] = [];

  props.forEach((p, idx) => {
    if (!isString(p)) {
      invalidItems.push({
        index: idx,
        reason: `Expected a non-empty string, but received ${getPreciseType(p, {
          formatCase: "toPascalCaseSpace"
        })}.`
      });
    } else if (isEmptyString(p)) {
      invalidItems.push({
        index: idx,
        reason: "Expected a non-empty string, but received EmptyString."
      });
    }
  });

  if (isNonEmptyArray(invalidItems)) {
    const maxWidth = Math.max(
      ...invalidItems.map((item) => String(item.index).length)
    );

    const details = invalidItems
      .map(
        (item) =>
          `• [Index ${String(item.index).padStart(maxWidth, "0")}] ${item.reason}`
      )
      .join("\n");

    throw new TypeError(
      `First parameter (\`props\`) contains invalid entries:\n${details}`
    );
  }

  return (propName): boolean => {
    return !props.map(String).includes(String(propName));
  };
};
