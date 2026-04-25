import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { isProdEnv } from "@rzl-zone/core/env/node";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert
} from "@rzl-zone/docs-ui/components/icons/lucide";

type CalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "type" | "icon"
> & {
  title?: ReactNode;
  /**
   * @default info
   */
  type?: "info" | "warn" | "error" | "success" | "warning";

  /**
   * Force an icon
   */
  icon?: ReactNode;
};

const iconClass = "size-5.5 -me-0.5 fill-(--callout-color) text-fd-card my-0.5";

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = "info", icon, ...props }, ref) => {
    if (type === "warn") type = "warning";
    if ((type as unknown) === "tip") type = "info";

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2 my-2 rounded-xl border bg-fd-card p-3 ps-1 text-sm text-fd-card-foreground shadow-md",
          className
        )}
        {...props}
        style={
          {
            "--callout-color": `var(--color-fd-${type}, var(--color-fd-muted))`,
            ...props.style
          } as object
        }
      >
        <div
          role="none"
          className="w-0.5 bg-(--callout-color)/50 rounded-sm"
        />
        {icon ??
          {
            info: <Info className={iconClass} />,
            warning: <TriangleAlert className={iconClass} />,
            error: <CircleX className={iconClass} />,
            success: <CircleCheck className={iconClass} />
          }[type]}
        <div className="flex flex-col gap-2 min-w-0 flex-1 justify-center">
          {title && <p className="font-medium my-0!">{title}</p>}
          <div className="text-fd-muted-foreground prose-no-margin empty:hidden">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Callout.displayName = isProdEnv() ? undefined : "Callout";
