import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef
} from "react";

import { cn } from "@rzl-zone/docs-ui/utils";
import * as Primitive from "@rzl-zone/docs-ui/components/radix-ui-scroll-area";

const ScrollArea = forwardRef<
  ComponentRef<typeof Primitive.Root>,
  ComponentPropsWithoutRef<typeof Primitive.Root>
>(({ className, children, ...props }, ref) => (
  <Primitive.Root
    ref={ref}
    type="scroll"
    className={cn("overflow-hidden", className)}
    {...props}
  >
    {children}
    <Primitive.Corner />
    <ScrollBar orientation="vertical" />
  </Primitive.Root>
));
ScrollArea.displayName = Primitive.Root.displayName;

const ScrollViewport = forwardRef<
  ComponentRef<typeof Primitive.Viewport>,
  ComponentPropsWithoutRef<typeof Primitive.Viewport>
>(({ className, children, ...props }, ref) => (
  <Primitive.Viewport
    ref={ref}
    className={cn("size-full rounded-[inherit]", className)}
    {...props}
  >
    {children}
  </Primitive.Viewport>
));
ScrollViewport.displayName = Primitive.Viewport.displayName;

const ScrollBar = forwardRef<
  ComponentRef<typeof Primitive.Scrollbar>,
  ComponentPropsWithoutRef<typeof Primitive.Scrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <Primitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex select-none data-[state=hidden]:animate-fd-fade-out",
      orientation === "vertical" && "h-full w-1.5",
      orientation === "horizontal" && "h-1.5 flex-col",
      className
    )}
    {...props}
  >
    <Primitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-fd-border" />
  </Primitive.Scrollbar>
));
ScrollBar.displayName = Primitive.Scrollbar.displayName;

export { ScrollArea, ScrollBar, ScrollViewport };
export type ScrollAreaProps = Primitive.ScrollAreaProps;
