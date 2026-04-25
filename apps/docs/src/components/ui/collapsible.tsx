"use client";

import { forwardRef, useEffect, useState } from "react";

import { cn } from "@rzl-zone/docs-ui/utils";
import { useEffectEvent } from "@rzl-zone/core-react/hooks";
import * as Primitive from "@rzl-zone/docs-ui/components/radix-ui-collapsible";

const Collapsible = Primitive.Root;

const CollapsibleTrigger = Primitive.CollapsibleTrigger;

const CollapsibleContent = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive.CollapsibleContent>
>(({ children, ...props }, ref) => {
  const [mounted, setMounted] = useState(false);

  const setMountedEvent = useEffectEvent((value: boolean) => setMounted(value));

  useEffect(() => {
    setMountedEvent(true);
  }, []);

  return (
    <Primitive.CollapsibleContent
      ref={ref}
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
});

CollapsibleContent.displayName = Primitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

export type CollapsibleProps = Primitive.CollapsibleProps;
export type CollapsibleContentProps = Primitive.CollapsibleContentProps;
export type CollapsibleTriggerProps = Primitive.CollapsibleTriggerProps;
