"use client";

import {
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useState
} from "react";

import { minifyInnerHTMLScript } from "@rzl-zone/core/minifier/minify-script-inline";
import { createRequiredContext } from "@rzl-zone/core-react/context";

/** --------------------------------------------------------------------------
 * * ***Internal context for `HideIfEmpty`.***
 * --------------------------------------------------------------------------
 *
 * - ***Purpose:***
 *    - Provides shared configuration for `HideIfEmpty`.
 *    - Currently used to pass a CSP `nonce` to inline hydration scripts.
 *
 * - ⚠️ ***Internal API:***
 *    - This context is **not** intended for direct consumption.
 *    - Do **not** call `.use()` or `.Provider` manually.
 *
 * ---
 *
 * ℹ️ Use {@link HideIfEmptyProvider | **`HideIfEmptyProvider`**} instead.
 */
export const HideIfEmptyContext = createRequiredContext<{
  /** Content Security Policy nonce used for inline scripts. */
  nonce: string | undefined;
}>("HideIfEmpty");

/** --------------------------------------------------------------------------
 * * ***Provide configuration for `HideIfEmpty`.***
 * --------------------------------------------------------------------------
 *
 * - ***This Provider supplies:***
 *    - A CSP `nonce` used for inline scripts during hydration.
 *
 * - ⚠️ ***Important:***
 *    - Required when your application enforces a strict
 *      **Content Security Policy (CSP)**.
 *    - If no CSP is used, this Provider is optional.
 *
 * ---
 *
 * ℹ️ The value is memoized to avoid unnecessary re-renders.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Applications using CSP with `nonce`.
 *    - Shared UI libraries that inject inline hydration scripts.
 *
 * @param {string?} props.nonce - Optional CSP nonce for inline scripts.
 * @param {ReactNode} props.children - React children.
 *
 * @example
 * ```tsx
 * <HideIfEmptyProvider nonce={cspNonce}>
 *   <HideIfEmpty as="div">
 *     {children}
 *   </HideIfEmpty>
 * </HideIfEmptyProvider>
 * ```
 */
export function HideIfEmptyProvider({
  nonce,
  children
}: {
  nonce?: string;
  children: ReactNode;
}) {
  return (
    <HideIfEmptyContext.Provider value={useMemo(() => ({ nonce }), [nonce])}>
      {children}
    </HideIfEmptyContext.Provider>
  );
}

function getElement(id: string) {
  return document.querySelector<HTMLElement>(`[data-fd-if-empty="${id}"]`);
}

function isEmpty(node: HTMLElement) {
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes.item(i);

    if (
      child.nodeType === Node.TEXT_NODE ||
      (child.nodeType === Node.ELEMENT_NODE &&
        window.getComputedStyle(child as HTMLElement).display !== "none")
    ) {
      return false;
    }
  }

  return true;
}

/** --------------------------------------------------------------------------
 * * ***Hide an element when its children are visually empty.***
 * --------------------------------------------------------------------------
 *
 * - ***Why this exists:***
 *    - The native CSS `:empty` selector **fails** when:
 *      - Children exist but are hidden (`display: none`)
 *      - Responsive utilities are used (e.g. `md:hidden`)
 *
 * - ***This component fixes that by:***
 *    - Treating text nodes as content
 *    - Ignoring elements with `display: none`
 *    - Re-evaluating visibility on window resize
 *
 * ---
 *
 * - ⚠️ ***Performance warning:***
 *    - Performs DOM queries
 *    - Uses `getComputedStyle`
 *    - Listens to the `resize` event
 *
 * - ❗***Avoid usage in:***
 *    - Large lists
 *    - Frequently re-rendered layouts
 *
 * ---
 *
 * - ⚙️ ***Hydration behavior:***
 *    - On initial render, an inline script:
 *        - Computes the empty state
 *        - Sets the `hidden` attribute
 *        - Removes itself immediately
 *
 * - Requires {@link HideIfEmptyProvider | **`HideIfEmptyProvider`**} when CSP is enabled.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Conditional layout wrappers
 *    - Responsive UI edge cases
 *    - Enhancing `empty:hidden` behavior
 *
 * @typeParam Props - HTML attributes supported by the rendered element.
 *
 * @param props.as - Component or element to render.
 * @param props - Standard HTML attributes forwarded to the component.
 *
 * @example
 * **1. Basic usage.**
 * ```tsx
 * <HideIfEmpty as="div">
 *   {content}
 * </HideIfEmpty>
 * ```
 *
 * @example
 * **2. Responsive children (CSS-hidden).**
 * ```tsx
 * <HideIfEmpty as="section">
 *   <div className="hidden md:block">
 *     Desktop only
 *   </div>
 * </HideIfEmpty>
 * ```
 *
 * @example
 * **3. With CSP nonce.**
 * ```tsx
 * <HideIfEmptyProvider nonce={nonce}>
 *   <HideIfEmpty as="div">
 *     {children}
 *   </HideIfEmpty>
 * </HideIfEmptyProvider>
 * ```
 */
export function HideIfEmpty<Props extends HTMLAttributes<HTMLElement>>({
  as: Comp,
  ...props
}: Props & {
  as: FC<Props>;
}) {
  const id = useId();
  const { nonce } = HideIfEmptyContext.use();
  const [empty, setEmpty] = useState(() => {
    const element = typeof window !== "undefined" ? getElement(id) : null;
    if (element) return isEmpty(element);
  });

  useEffect(() => {
    const handleResize = () => {
      const element = getElement(id);
      if (element) setEmpty(isEmpty(element));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  const init = (id: string) => {
    const element = getElement(id);
    if (element) element.hidden = isEmpty(element);

    const script = document.currentScript;
    if (script) script.parentNode?.removeChild(script);
  };

  return (
    <>
      <Comp
        {...(props as unknown as Props)}
        data-fd-if-empty={id}
        suppressHydrationWarning
        hidden={empty ?? false}
      />

      {empty === undefined && (
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `{${minifyInnerHTMLScript(getElement)};${minifyInnerHTMLScript(
              isEmpty
            )};(${minifyInnerHTMLScript(init)})("${id}")}`
          }}
        />
      )}
    </>
  );
}
