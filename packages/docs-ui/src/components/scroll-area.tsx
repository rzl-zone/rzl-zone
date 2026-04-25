"use client";

import { type ComponentProps, type ComponentPropsWithRef } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/utils";

function ScrollArea({
  className,
  children,
  cornerOptions,
  viewPortOptions,
  scrollBarOptions,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  cornerOptions?: ComponentPropsWithRef<typeof ScrollAreaPrimitive.Corner>;
  viewPortOptions?: ComponentPropsWithRef<typeof ScrollAreaPrimitive.Viewport>;
  scrollBarOptions?: ComponentPropsWithRef<typeof ScrollBar>;
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        {...viewPortOptions}
        tabIndex={viewPortOptions?.tabIndex || -1}
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit]",
          viewPortOptions?.className
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar {...scrollBarOptions} />

      <ScrollAreaPrimitive.Corner {...cornerOptions} />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: Omit<
  ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  "orientation"
> & {
  orientation?: "horizontal" | "vertical" | "all";
}) {
  if (orientation === "all") {
    return (
      <>
        <ScrollBar
          {...props}
          orientation="vertical"
        />
        <ScrollBar
          {...props}
          orientation="horizontal"
        />
      </>
    );
  }

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px select-none transition-opacity duration-500 ease-linear",
        "flex select-none data-[state=visible]:animate-fd-fade-in data-[state=hidden]:animate-fd-fade-out",
        orientation === "vertical" &&
          "h-full w-1.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-1.5 flex-col border-t border-t-transparent",
        "data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100",
        "data-[state=hidden]:pointer-events-none",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          "hover:cursor-grab active:cursor-grabbing",
          "relative flex-1 rounded bg-fd-border"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
