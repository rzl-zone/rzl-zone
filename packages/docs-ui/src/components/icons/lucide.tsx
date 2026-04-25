import { type ComponentProps } from "react";
import { Check, X, type LucideIcon } from "lucide-react";

import { cn } from "@/utils";

export const IconIsOptional = (props: ComponentProps<LucideIcon>) => {
  return (
    <Check
      size={18}
      {...props}
      className={cn("text-green-600 dark:text-green-500", props.className)}
    />
  );
};

export const IconIsNonOptional = (props: ComponentProps<LucideIcon>) => {
  return (
    <X
      size={18}
      {...props}
      className={cn("text-red-600 dark:text-red-500", props.className)}
    />
  );
};

export * from "lucide-react";
