import { type ComponentType, memo } from "react";
import { shallowCompareProps } from "@rzl-zone/core/comparison/shallow-compare-props";

/** ------------------------------------------
 * * **Higher-Order Component (HOC): `withMemo`.**
 * ------------------------------------------
 * Enhances any React component with **automatic memoization**
 * using `React.memo`, with additional custom controls:
 *
 * - `memo?: boolean` — Disable memoization per instance
 *   (when set to `false`).
 * - `shouldCompareComplexProps?: boolean` — Enable/disable
 *   detailed shallow comparison for props.
 *
 * This HOC is useful for fine-grained re-render control while
 * keeping the wrapped component's API clean and predictable.
 *
 * @template P - Props type of the wrapped component.
 *               Must include optional `memo` and
 *               `shouldCompareComplexProps`.
 *
 * @param Component - The React component to wrap.
 *
 * @param [ignoreKeys=["memo", "shouldCompareComplexProps"]]
 * Keys that should be excluded from shallow comparison.
 *
 * @returns The memoized version of the component, respecting the
 *          custom memoization rules.
 *
 * @example
 * interface Props {
 *   title: string;
 *   memo?: boolean;
 *   shouldCompareComplexProps?: boolean;
 * }
 *
 * function Title({ title }: Props) {
 *   return <h1>{title}</h1>;
 * }
 *
 * const MemoTitle = withMemo(Title);
 *
 * // Memoization ON (default)
 * <MemoTitle title="Hello" />;
 *
 * // Disable memoization (force re-render)
 * <MemoTitle title="Hello" memo={false} />;
 *
 * // Enable shallow comparison for complex props
 * <MemoTitle title="Hello" shouldCompareComplexProps={true} />;
 */
export function withMemo<
  P extends { memo?: boolean; shouldCompareComplexProps?: boolean }
>(
  Component: ComponentType<P>,
  ignoreKeys: string[] = ["memo", "shouldCompareComplexProps"]
) {
  return memo(Component, (prevProps, nextProps) => {
    if (nextProps.memo === false) return false;
    if (!nextProps.shouldCompareComplexProps) return true;
    return shallowCompareProps(prevProps, nextProps, ignoreKeys);
  });
}
