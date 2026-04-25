"use client";

// import "@rzl-zone/click-feedback/styles";

import {
  type ButtonHTMLAttributes,
  cloneElement,
  type FC,
  Fragment,
  isValidElement,
  memo,
  type ReactElement,
  type ReactNode,
  type Ref,
  useMemo
} from "react";

import { Slot } from "@/components/radix-ui-slot";

import { noop } from "@rzl-zone/utils-js/generators";
import { ClickFeedback } from "@rzl-zone/click-feedback";
import { mergeProps } from "@rzl-zone/core-react/utils/merge-props";

import { cn, type VariantProps } from "@/utils";

import { buttonVariants } from "./cva";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "color"> {
  /**
   * Allows rendering a custom child element instead of the default `<button>`
   * while preserving the Button component's styling, variants, sizing, and behavior.
   *
   * When `asChild` is set to `true`, the Button will not render its own native
   * `<button>` element. Instead, it will pass its computed props to its direct child
   * using a Slot-like mechanism.
   *
   * Props that are commonly forwarded include:
   * - `className`
   * - `onClick`
   * - `onMouseEnter`
   * - `onMouseLeave`
   * - `disabled` (if supported by the child element)
   * - `data-*` attributes
   * - other presentation and interaction props
   *
   * This is useful when you want the Button to visually and behaviorally act like
   * a button, but render as another element such as an anchor (`<a>`) or a custom component.
   *
   * ---
   *
   * @remarks
   *
   * #### How it works
   *
   * - `asChild={false}` (default):
   *   the component renders a native `<button>`.
   *
   * - `asChild={true}`:
   *   the component renders **only the provided child element** and forwards Button props to it.
   *
   * ---
   *
   * #### Child requirements
   *
   * The child passed to `asChild` must be:
   *
   * - a **single**
   * - **valid React element**
   * - capable of receiving forwarded props
   *
   * Valid examples:
   * - `<a />`
   * - `<span />`
   * - `<div />`
   * - custom React components that forward props correctly
   *
   * Invalid examples:
   * - plain text: `"Click me"`
   * - number: `{123}`
   * - multiple children: `<><span>A</span><span>B</span></>`
   * - `React.Fragment`
   * - `null` / `undefined`
   *
   * `React.Fragment` is not supported because it does not render a real DOM node
   * and cannot accept arbitrary props such as `className`, `onClick`, or `type`.
   *
   * ---
   *
   * @accessibility
   *
   * Using `asChild` changes the rendered element, so semantic behavior is no longer
   * guaranteed automatically.
   *
   * Prefer semantic interactive elements whenever possible:
   *
   * - Use `<button>` for actions
   * - Use `<a>` for navigation
   *
   * If you render a non-interactive element such as `<div>` or `<span>`, you are
   * responsible for making it accessible.
   *
   * Recommended accessibility additions for non-interactive elements:
   * - `role="button"`
   * - `tabIndex={0}`
   * - keyboard handlers for `Enter` and `Space`
   * - proper disabled handling if needed
   *
   * Example:
   *
   * ```tsx
   * <Button asChild>
   *   <div
   *     role="button"
   *     tabIndex={0}
   *     onKeyDown={(e) => {
   *       if (e.key === "Enter" || e.key === " ") {
   *         e.preventDefault();
   *         e.currentTarget.click();
   *       }
   *     }}
   *   >
   *     Open dialog
   *   </div>
   * </Button>
   * ```
   *
   * ---
   *
   * @warning
   *
   * #### 1. Invalid child types
   *
   * The following will cause runtime issues or explicit validation errors:
   *
   * ```tsx
   * <Button asChild>
   *   Click me
   * </Button>
   * ```
   *
   * Reason:
   * plain text is not a React element and cannot receive forwarded props.
   *
   * ---
   *
   * #### 2. Fragment is not supported
   *
   * ```tsx
   * <Button asChild>
   *   <>Click me</>
   * </Button>
   * ```
   *
   * Reason:
   * `React.Fragment` does not render a DOM node and cannot receive forwarded props.
   *
   * Use this instead:
   *
   * ```tsx
   * <Button asChild>
   *   <span>Click me</span>
   * </Button>
   * ```
   *
   * ---
   *
   * #### 3. Multiple children are not allowed
   *
   * ```tsx
   * <Button asChild>
   *   <span>Save</span>
   *   <span>Now</span>
   * </Button>
   * ```
   *
   * Reason:
   * `asChild` expects exactly one direct child element.
   *
   * Wrap them in a single element:
   *
   * ```tsx
   * <Button asChild>
   *   <span>
   *     <span>Save</span>
   *     <span>Now</span>
   *   </span>
   * </Button>
   * ```
   *
   * ---
   *
   * #### 4. Avoid invalid DOM nesting
   *
   * Do not nest interactive elements in invalid ways, such as:
   *
   * ```tsx
   * <Button asChild>
   *   <button>Inner button</button>
   * </Button>
   * ```
   *
   * This may create:
   * - invalid HTML
   * - hydration mismatch warnings
   * - broken keyboard behavior
   * - unexpected click handling
   *
   * ---
   *
   * #### 5. Accessibility is not enforced automatically
   *
   * When using `asChild`, this component forwards props, but it does not automatically
   * guarantee semantic correctness or keyboard accessibility for custom child elements.
   *
   * ---
   *
   * @example
   *
   * #### Default button behavior
   *
   * ```tsx
   * <Button>Submit</Button>
   * ```
   *
   * Renders roughly as:
   *
   * ```tsx
   * <button type="button">Submit</button>
   * ```
   *
   * ---
   *
   * #### Render as anchor for navigation
   *
   * ```tsx
   * <Button asChild>
   *   <a href="/home">Go to home</a>
   * </Button>
   * ```
   *
   * Useful when the UI should look like a button but behave like a link.
   *
   * ---
   *
   * #### Render as a Next.js link
   *
   * ```tsx
   * <Button asChild>
   *   <Link href="/dashboard">Dashboard</Link>
   * </Button>
   * ```
   *
   * Make sure the child component properly forwards props to the underlying rendered element.
   *
   * ---
   *
   * #### Render as a custom component
   *
   * ```tsx
   * function CustomLink(props: React.ComponentProps<"a">) {
   *   return <a {...props} />;
   * }
   *
   * <Button asChild>
   *   <CustomLink href="/profile">Profile</CustomLink>
   * </Button>
   * ```
   *
   * This works because `CustomLink` forwards its props to a real DOM element.
   *
   * ---
   *
   * #### Render as non-interactive element with accessibility support
   *
   * ```tsx
   * <Button asChild>
   *   <span
   *     role="button"
   *     tabIndex={0}
   *     onKeyDown={(e) => {
   *       if (e.key === "Enter" || e.key === " ") {
   *         e.preventDefault();
   *         e.currentTarget.click();
   *       }
   *     }}
   *   >
   *     Open menu
   *   </span>
   * </Button>
   * ```
   *
   * ---
   *
   * #### Forwarding className and event handlers
   *
   * ```tsx
   * <Button asChild onClick={() => console.log("clicked")}>
   *   <a href="/settings">Settings</a>
   * </Button>
   * ```
   *
   * The child receives Button styling and forwarded interaction props.
   *
   * ---
   *
   * #### Valid: wrapping complex content in one element
   *
   * ```tsx
   * <Button asChild>
   *   <span className="inline-flex items-center gap-2">
   *     <Icon />
   *     <span>Download</span>
   *   </span>
   * </Button>
   * ```
   *
   * ---
   *
   * #### Invalid: plain text child
   *
   * ```tsx
   * <Button asChild>
   *   Download
   * </Button>
   * ```
   *
   * ---
   *
   * #### Invalid: fragment child
   *
   * ```tsx
   * <Button asChild>
   *   <>
   *     <Icon />
   *     <span>Download</span>
   *   </>
   * </Button>
   * ```
   *
   * Use:
   *
   * ```tsx
   * <Button asChild>
   *   <span className="inline-flex items-center gap-2">
   *     <Icon />
   *     <span>Download</span>
   *   </span>
   * </Button>
   * ```
   *
   * ---
   *
   * #### Invalid: null child
   *
   * ```tsx
   * <Button asChild>{null}</Button>
   * ```
   *
   * ---
   *
   * #### Invalid: boolean child
   *
   * ```tsx
   * <Button asChild>{false}</Button>
   * ```
   *
   * ---
   *
   * @defaultValue false
   */
  asChild?: boolean;

  /**
   * Enables a visual click/tap animation effect when the button is pressed.
   *
   * This effect is typically used to provide tactile feedback (e.g. scale down,
   * ripple, or press animation) when users interact with the button.
   *
   * ---
   *
   * @remarks
   *
   * - The effect runs on pointer interactions such as `click`, `mousedown`, or `tap`.
   * - This setting can be overridden by `clickEffectForce`.
   *
   * ---
   *
   * @behavior
   *
   * - `clickEffect = true` → animation runs normally
   * - `clickEffect = false` → animation is disabled
   * - `clickEffectForce = true` → animation **always runs**, regardless of `clickEffect`
   *
   * ---
   *
   * @example
   *
   * ```tsx
   * // Default behavior (animation enabled)
   * <Button>Click me</Button>
   *
   * // Disable animation
   * <Button clickEffect={false}>No animation</Button>
   *
   * // Force animation even if disabled elsewhere
   * <Button clickEffect={false} clickEffectForce>
   *   Still animates
   * </Button>
   * ```
   *
   * ---
   *
   * @default true
   */
  clickEffect?: boolean;

  /**
   * Forces the click animation to run even when:
   * - `clickEffect` is set to `false`
   * - the button is in a disabled state
   *
   * Useful for maintaining visual feedback in edge cases where interaction
   * is restricted but UI feedback is still desired.
   *
   * ---
   *
   * @warning
   *
   * Use carefully:
   * - Forcing animation on a disabled button may confuse users
   *   because the UI appears interactive but does not perform actions.
   *
   * ---
   *
   * @example
   *
   * ```tsx
   * <Button disabled clickEffectForce>
   *   Looks clickable but is disabled
   * </Button>
   * ```
   *
   * ---
   *
   * @default false
   */
  clickEffectForce?: boolean;

  /**
   * Manually applies a `data-disabled` attribute to the button.
   *
   * This is primarily used for styling purposes (e.g. Tailwind or CSS selectors),
   * especially when you need more control than the native `disabled` attribute provides.
   *
   * ---
   *
   * @remarks
   *
   * - This does **not** automatically disable interactions.
   * - It is purely a styling/state indicator.
   *
   * ---
   *
   * @example
   *
   * ```tsx
   * <Button data-disabled>
   *   Styled as disabled, but still clickable
   * </Button>
   *
   * // CSS example
   * [data-disabled] {
   *   opacity: 0.5;
   *   pointer-events: none;
   * }
   * ```
   *
   * ---
   *
   * @default false
   */
  "data-disabled"?: boolean;

  /**
   * Prevents forwarding the `type` attribute to the rendered element.
   *
   * By default, the Button sets `type="button"` to avoid unintended form submissions.
   *
   * ---
   *
   * @remarks
   *
   * Useful when:
   * - using `asChild` with non-button elements (e.g. `<a>`, `<div>`)
   * - avoiding invalid DOM attributes
   *
   * ---
   *
   * @example
   *
   * ```tsx
   * // Default (safe)
   * <Button />
   * // renders: <button type="button" />
   *
   * // Without type
   * <Button withoutType />
   * // renders: <button />
   *
   * // With asChild
   * <Button asChild withoutType>
   *   <a href="/home">Home</a>
   * </Button>
   * ```
   *
   * ---
   *
   * @default false
   */
  withoutType?: boolean;

  /**
   * Prevents forwarding the `role` attribute to the rendered element.
   *
   * Normally, a `role="button"` may be applied when rendering non-semantic elements
   * (e.g. `<div>`, `<span>`).
   *
   * ---
   *
   * @remarks
   *
   * Use this when:
   * - you want full control over accessibility roles
   * - the child element already defines its own role
   *
   * ---
   *
   * @example
   *
   * ```tsx
   * <Button asChild withoutRole>
   *   <div role="menuitem">Item</div>
   * </Button>
   * ```
   *
   * ---
   *
   * @default false
   */
  withoutRole?: boolean;

  /**
   * Prevents automatically adding `aria-disabled="true"` when the button is disabled.
   *
   * ---
   *
   * @remarks
   *
   * By default:
   * - `disabled` → adds `aria-disabled="true"` for accessibility consistency
   *
   * Disable this if:
   * - you want to manage ARIA attributes manually
   * - you have a custom accessibility pattern
   *
   * ---
   *
   * @warning
   *
   * Removing `aria-disabled` may negatively impact accessibility for screen readers.
   *
   * ---
   *
   * @example
   *
   * ```tsx
   * <Button disabled withoutDefaultAriaDisabled>
   *   No aria-disabled attribute
   * </Button>
   * ```
   *
   * ---
   *
   * @default false
   */
  withoutDefaultAriaDisabled?: boolean;

  /**
   * Prevents automatically adding `data-disabled` when the button is disabled.
   *
   * ---
   *
   * @remarks
   *
   * By default:
   * - `disabled` → also sets `data-disabled` for styling hooks
   *
   * Disable this if:
   * - you want to fully control styling states
   * - you are using a different state system
   *
   * ---
   *
   * @example
   *
   * ```tsx
   * <Button disabled withoutDefaultDataDisabled>
   *   No data-disabled attribute
   * </Button>
   * ```
   *
   * ---
   *
   * @default false
   */
  withoutDefaultDataDisabled?: boolean;

  /**
   * A reference to the underlying `<button>` element.
   *
   * ---
   *
   * @remarks
   *
   * - Allows direct DOM access (e.g. focus, click, measurement)
   * - When using `asChild`, the ref will point to the rendered child element instead
   *
   * ---
   *
   * @example
   *
   * ```tsx
   * const ref = useRef<HTMLButtonElement>(null);
   *
   * <Button ref={ref}>
   *   Focus me
   * </Button>
   *
   * // later
   * ref.current?.focus();
   * ```
   *
   * ---
   *
   * @default undefined
   */
  ref?: Ref<HTMLButtonElement>;
}

const LINK_VARIANTS = ["link", "linkBlue", "linkOrange", "linkGreen"];

const ButtonComponent: FC<ButtonProps> = ({
  ref,
  type,
  size,
  onClick = noop,
  variant,
  children,
  disabled,
  className,
  asChild,
  clickEffect = true,
  clickEffectForce,
  withoutRole,
  withoutType,
  withoutDefaultAriaDisabled,
  withoutDefaultDataDisabled,
  rounded,
  ...props
}) => {
  if (asChild) {
    if (!isValidElement(children) || children.type === Fragment) {
      const childType = !isValidElement(children)
        ? typeof children === "string"
          ? "string"
          : Array.isArray(children)
            ? "array"
            : children === null
              ? "null"
              : typeof children
        : children.type === Fragment
          ? "fragment"
          : typeof children.type;

      throw new Error(
        "[Button]: Invalid `asChild` usage.\n" +
          `Received: ${childType}.\n\n` +
          "Child must be a single React element (not text, array, or fragment).\n\n" +
          "Wrap your content:\n" +
          "  <Button asChild>\n" +
          "    <span>Click me</span>\n" +
          "  </Button>"
      );
    }
  }

  // Ensure the Component is a button or custom child element
  const ComponentButton = asChild ? Slot : "button";

  const isLinkNotButton = variant && LINK_VARIANTS.includes(variant);

  // Handle ripple effect
  const finalClickEffect =
    variant && !clickEffectForce && isLinkNotButton ? false : clickEffect;

  const shouldRenderEffect =
    clickEffectForce || (!disabled && finalClickEffect);

  // Memoize class names to prevent unnecessary re-renders
  const mergedClassName = useMemo(() => {
    return cn(
      buttonVariants({ size, variant, rounded, className }),
      !disabled && finalClickEffect
        ? "relative overflow-hidden isolate"
        : "overflow-hidden"
    );
  }, [size, variant, rounded, className, disabled, finalClickEffect]);

  // Merge onClick event handlers
  const mergePropsButton = useMemo(() => {
    return mergeProps<
      Array<Pick<ButtonProps, "onClick" | "className" | "style">>
    >(
      { onClick },
      {
        onClick: (e) => {
          e.currentTarget.blur();
          if (disabled) return e.preventDefault();
        }
      }
    );
  }, [onClick, disabled]);

  // const content: ReactNode =
  //   clickEffectForce || (!disabled && finalClickEffect) ? (
  //     <>
  //       <ClickFeedback />
  //       {children}
  //     </>
  //   ) : (
  //     children
  //   );

  let content: ReactNode = children;

  if (shouldRenderEffect) {
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ children?: ReactNode }>;

      content = cloneElement(child, {
        children: (
          <>
            <ClickFeedback />
            {child.props.children}
          </>
        )
      });
    } else {
      content = (
        <>
          <ClickFeedback />
          {children}
        </>
      );
    }
  }

  return (
    <ComponentButton
      ref={ref}
      type={
        asChild || withoutType
          ? undefined
          : !disabled && isNonEmptyString(type)
            ? type
            : "button"
      }
      className={mergedClassName}
      disabled={disabled}
      role={
        withoutRole
          ? undefined
          : isNonEmptyString(props.role)
            ? props.role
            : undefined
      }
      {...props}
      aria-disabled={
        props["aria-disabled"] ??
        (!withoutDefaultAriaDisabled && disabled ? disabled : undefined)
      }
      data-disabled={
        props["data-disabled"] ??
        (!withoutDefaultDataDisabled && disabled ? "" : undefined)
      }
      {...mergePropsButton}
    >
      {asChild ? (
        content
      ) : isLinkNotButton ? (
        <div className="inline-flex items-center justify-center">{content}</div>
      ) : (
        content
      )}
      {/* {(asChild && isLinkNotButton) || asChild || isLinkNotButton ? (
        <div className="inline-flex items-center justify-center">{content}</div>
      ) : (
        <>{content}</>
      )} */}
    </ComponentButton>
  );
};

ButtonComponent.displayName =
  process.env.NODE_ENV === "development" ? "Button" : undefined;

/** ------------------------------------
 * * ***Button component is a customizable button element that supports various styles, sizes,***
 * ***ripple effect animations, and handling of different button types (e.g., link, submit, etc.).***
 * * ***It also supports the `asChild` prop to render a child component instead of a native button.***
 * ------------------------------------
 *
 * @returns The rendered JSX button or child component.
 *
 * @example
 * <Button size="sm" variant="linkBlue" onClick={handleClick}>Click Me</Button>
 * <Button asChild={true} variant="linkGreen" clickEffect={false}>Go to Home</Button>
 * <Button disabled={true} onClick={handleClick}>Disabled Button</Button>
 */
export const Button = memo(ButtonComponent);
