"use client";

import { type ComponentProps } from "react";
import { cn } from "@rzl-zone/docs-ui/utils";

export function Container(props: ComponentProps<"main">) {
  return (
    <main
      id="nd-home-layout"
      {...props}
      className={cn(
        "flex flex-1 flex-col [--fd-layout-width:1400px]",
        props.className
      )}
    />
  );
}
