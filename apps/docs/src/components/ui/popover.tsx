"use client";

import type { ComponentPropsWithRef } from "react";
import * as PopoverPrimitive from "@rzl-zone/docs-ui/components/radix-ui-popover";

import { cn } from "@/lib/cn";

export const Popover = PopoverPrimitive.Root;

export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  arrowPadding = 0,
  disableArrow = false,
  ...props
}: ComponentPropsWithRef<typeof PopoverPrimitive.Content> & {
  /**
   * @default false
   */
  disableArrow?: boolean;
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        side="bottom"
        className={cn(
          "z-50 origin-(--radix-popover-content-transform-origin) max-h-(--radix-popover-content-available-height) min-w-60 max-w-[98vw] rounded-xl border bg-fd-popover/75 backdrop-blur-lg p-2 text-sm text-fd-popover-foreground shadow-lg focus-visible:outline-none data-[state=closed]:animate-fd-popover-out data-[state=open]:animate-fd-popover-in",
          disableArrow === true && "overflow-y-auto",
          className
        )}
        arrowPadding={arrowPadding}
        {...props}
      >
        {!disableArrow && (
          <>
            <PopoverPrimitive.Arrow className="w-4 h-2.5 fill-fd-popover stroke-fd-border stroke-1 m-0.5" />
          </>
        )}
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export const PopoverClose = PopoverPrimitive.PopoverClose;
