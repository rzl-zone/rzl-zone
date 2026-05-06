"use client";

import { useEffect, useState, type ComponentPropsWithRef } from "react";

import * as Primitive from "@rzl-zone/docs-ui/components/radix-ui-collapsible";

import { cn } from "@/lib/cn";

export const Collapsible = Primitive.Root;

export const CollapsibleTrigger = Primitive.CollapsibleTrigger;

export function CollapsibleContent({
  children,
  ...props
}: ComponentPropsWithRef<typeof Primitive.CollapsibleContent>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Primitive.CollapsibleContent
      {...props}
      className={cn(
        "overflow-hidden",
        mounted &&
          "data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down",
        props.className
      )}
    >
      {children}
    </Primitive.CollapsibleContent>
  );
}

export type CollapsibleProps = Primitive.CollapsibleProps;
export type CollapsibleContentProps = Primitive.CollapsibleContentProps;
export type CollapsibleTriggerProps = Primitive.CollapsibleTriggerProps;
