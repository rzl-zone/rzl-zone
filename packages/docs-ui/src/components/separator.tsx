"use client";

import { type ComponentProps, type ComponentPropsWithRef } from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

const SeparatorSection = (props: ComponentPropsWithRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "prose h-0.5 bg-fd-border rounded-2xl w-full mt-4.5 mb-4.5 leading-[1.475rem]",
        props.className
      )}
    />
  );
};

export { Separator, SeparatorSection };
