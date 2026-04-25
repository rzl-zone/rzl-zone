/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  type ComponentType,
  type FC,
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  Suspense,
  type SuspenseProps
} from "react";

type SuspensedExoticComponent<P> = FC<P>;
type SuspensedForwardRefExoticComponent<P, R> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<R>
>;

/** -------------------------------------------------------------
 * * ***Higher-Order Component (HOC): `WithSuspense`.***
 * -------------------------------------------------------------
 * Wraps a React component with a `<Suspense>` boundary.
 *
 * This allows the wrapped component to be lazy-loaded or deferred,
 * while providing a configurable `fallback` UI via React Suspense.
 *
 * -------------------------------------------------------------
 * **Type Inference Notes.**
 *
 * `WithSuspense` preserves the original component’s props type (`P`)
 * through generic inference. This works automatically for components
 * with **required** props, for example:
 *
 * ```tsx
 * const UserCard = (props: { id: string }) => <>...</>;
 * const Wrapped = WithSuspense(UserCard);
 * //             ^? FC<{ id: string }>  ✅ inferred correctly
 * ```
 *
 * However, TypeScript may fail to infer `P` precisely if the
 * component’s props are **fully optional**, such as:
 *
 * - `props?: P`
 * - `props: P = defaultValue`
 *
 * In such cases, TypeScript widens the type to `object`, so it is
 * recommended to **pass `<P>` explicitly**:
 *
 * ```tsx
 * const Profile = (props?: ProfileProps) => <>...</>;
 * const Broken = WithSuspense(Profile);
 * //             ^? FC<object>        ❌ incorrect
 *
 * const Fixed = WithSuspense<ProfileProps>(Profile);
 * //             ^? FC<ProfileProps>  ✅ correct
 * ```
 *
 * -------------------------------------------------------------
 * **ForwardRef Support.**
 *
 * `WithSuspense` includes a dedicated overload for components using
 * `React.forwardRef`, the returned HOC preserves:
 *
 * - `P` — the component’s props
 * - `R` — the forwarded ref type
 *
 * Example:
 *
 * ```tsx
 * const Input = React.forwardRef<HTMLInputElement, { label: string }>(
 *   (props, ref) => <input ref={ref} />
 * );
 *
 * const SuspenseInput = WithSuspense(Input);
 * //    ^? ForwardRefExoticComponent<{ label: string } & RefAttributes<HTMLInputElement>>
 * ```
 *
 * -------------------------------------------------------------
 * **React 19 Compatibility.**
 *
 * React 19 introduces automatic ref forwarding for function components, however, for full compatibility with both React 18 *and* React 19,
 * this HOC:
 *
 * - Detects `forwardRef` components via the internal `$$typeof` symbol
 * - Passes refs only when supported
 *
 * This ensures consistent runtime behavior across both versions.
 *
 * -------------------------------------------------------------
 * **Suspense Configuration (`suspenseProps`).**
 *
 * The second argument, `suspenseProps`, allows customizing behavior
 * of the `<Suspense>` boundary used to wrap the component.
 *
 * Example:
 *
 * ```tsx
 * const Wrapped = WithSuspense(UserCard, {
 *   fallback: <Spinner />,
 *   unstable_expectedLoadTime: 300, // React 19+
 * });
 * ```
 *
 * Any prop supported by `React.SuspenseProps` may be passed here.
 *
 * -------------------------------------------------------------
 * @template P - Props type of the wrapped component.
 * @template R - Ref type (only used when `Component` is forwardRef).
 *
 * @param Component - The React component to wrap with `<Suspense>`.
 * @param suspenseProps - Optional props forwarded to the `<Suspense>`
 *   wrapper (e.g. `fallback`, `unstable_expectedLoadTime`).
 *
 * @returns
 * A new component wrapped with `<Suspense>`, preserving its props
 * and (when applicable) its forwarded ref type.
 *
 * -------------------------------------------------------------
 */
export function WithSuspense<P>(
  Component: ComponentType<P>,
  suspenseProps?: Partial<SuspenseProps>
): SuspensedExoticComponent<Exclude<P, undefined>>;

export function WithSuspense<P, R>(
  Component: ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<R>>,
  suspenseProps?: Partial<SuspenseProps>
): SuspensedForwardRefExoticComponent<P, R>;

// Disable lint rule for this line because:
//
// 1. This function implements a Higher-Order Component (HOC) that wraps
//    a given component with React.Suspense and conditionally forwards refs.
//
// 2. The lint rule 'no-react19-api' is designed to forbid usage of React 19
//    APIs to ensure React 18 compatibility.
//
// 3. However, here we intentionally detect at runtime whether the wrapped
//    component supports refs (via internal $$typeof symbol for forwardRef).
//
// 4. The ref forwarding is implemented properly using React.forwardRef,
//    but the lint rule might falsely flag this pattern since it inspects
//    static declarations or certain heuristics that do not recognize
//    this dynamic/ref-forwarding logic.
//
// 5. Disabling the rule here avoids false positives, while keeping
//    the runtime behavior compatible with both React 18 and React 19.
//
// 6. This pattern is deliberate and safe as it maintains correct ref
//    forwarding only when supported, preserving backward compatibility.

// eslint-disable-next-line @rzl-zone/eslint/no-react19-api
export function WithSuspense(Component: any, suspenseProps?: any) {
  const Wrapped = forwardRef((props: any, ref) => {
    const supportsRef =
      Component?.$$typeof === Symbol?.for?.("react.forward_ref");

    return (
      <Suspense {...suspenseProps}>
        {supportsRef ? (
          <Component
            {...props}
            ref={ref}
          />
        ) : (
          <Component {...props} />
        )}
      </Suspense>
    );
  });

  Wrapped.displayName = `RzlzoneWithSuspense(${
    Component.displayName ?? Component.name ?? "Component"
  })`;

  return Wrapped;
}
