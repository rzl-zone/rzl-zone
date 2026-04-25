"use client";

import React, { createElement } from "react";
import { BiLogoTypescript } from "react-icons/bi";

import { cn } from "@rzl-zone/docs-ui/utils";
import { icons } from "@rzl-zone/docs-ui/components/icons/lucide";
import { isReactNode } from "@rzl-zone/core-react/utils";
import { isBoolean, isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { CodeBlock, Pre } from "./codeblock";

export const PreFdMdx = ({
  ref: _ref,
  icon,
  customIcon,
  noIcon,
  dtsIcon,
  className,
  fileCodeIcon,
  allowCopy = true,
  disableCopy = false,
  keepBackground = false,
  ...props
}: React.ComponentPropsWithRef<typeof CodeBlock> & {
  fileCodeIcon?: boolean;
  dtsIcon?: boolean;
  customIcon?: React.ReactNode;
  /** Disable showing Icon
   *
   * @default false
   */
  noIcon?: boolean;
  /** Disable Copy, if this true, will force `allowCopy` to false, even `allowCopy` is set to `true`.
   *
   * @default false
   */
  disableCopy?: boolean;
}) => {
  const finalAllowCopy =
    disableCopy === true
      ? false
      : typeof allowCopy === "boolean"
        ? allowCopy
        : true;

  let IconNode: React.ReactNode = null;

  if (customIcon || fileCodeIcon || dtsIcon) {
    const defaultIcon = createElement(icons.FileCodeCorner, {
      className: "size-3.5"
    });

    if (dtsIcon) {
      IconNode = (
        <BiLogoTypescript
          size={3.15 * 4}
          className="text-fd-info bg-white rounded-[1.25px] outline-[1.25px] outline-fd-info "
          data-bg="override"
        />
      );
    } else if (isNonEmptyString(customIcon) && customIcon in icons) {
      IconNode = createElement(icons[customIcon as keyof typeof icons], {
        className: "size-3.5"
      });
    } else if (customIcon && isReactNode(customIcon)) {
      IconNode = customIcon;
    } else {
      IconNode = defaultIcon;
    }
  }

  return (
    <CodeBlock
      {...props}
      allowCopy={finalAllowCopy}
      noIcon={isBoolean(noIcon) ? noIcon : undefined}
      icon={IconNode || (isReactNode(icon) ? icon : null)}
      keepBackground={isBoolean(keepBackground) ? keepBackground : undefined}
      className={cn(isNonEmptyString(className) ? className : undefined)}
    >
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
};

// function CopyButton({
//   className,
//   containerRef,
//   ...props
// }: React.ComponentProps<"button"> & {
//   containerRef: React.RefObject<HTMLElement | null>;
// }) {
//   const [checked, onClick] = useCopyButtonFD({
//     onCopy: () => {
//       const pre = containerRef.current?.getElementsByTagName("pre").item(0);
//       if (!pre) return;

//       const clone = pre.cloneNode(true) as HTMLElement;
//       clone.querySelectorAll(".nd-copy-ignore").forEach((node) => {
//         node.replaceWith("\n");
//       });

//       void navigator.clipboard.writeText(clone.textContent ?? "");
//     }
//   });

//   return (
//     <button
//       type="button"
//       data-checked={checked || undefined}
//       className={cn(
//         buttonVariants({
//           className:
//             "hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground",
//           size: "icon-xs"
//         }),
//         className
//       )}
//       aria-label={checked ? "Copied Text" : "Copy Text"}
//       onClick={onClick}
//       {...props}
//     >
//       {checked ? <Check /> : <Clipboard />}
//     </button>
//   );
// }

// function CodeBlockActions(
//   props: React.ComponentProps<"div"> & {
//     children?: React.ReactNode;
//   }
// ) {
//   let containerRef: React.RefObject<HTMLElement> | null = null;

//   if (isReactNode(props.children)) {
//     const child = props.children as React.ReactElement<{
//       containerRef?: React.RefObject<HTMLElement>;
//     }>;

//     containerRef = child?.props?.containerRef ?? null;
//   }

//   return (
//     <div
//       {...props}
//       className={cn("empty:hidden", props.className)}
//     >
//       {containerRef && <CopyButton containerRef={containerRef} />}
//     </div>
//   );
// }
