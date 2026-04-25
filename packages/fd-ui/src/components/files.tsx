"use client";

import { type HTMLAttributes, type ReactNode, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@fumadocs/base-ui/components/ui/collapsible";

import { cn, cva } from "@rzl-zone/docs-ui/utils";
import {
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen
} from "@rzl-zone/docs-ui/components/icons/lucide";

const itemVariants = cva(
  "flex flex-row items-center gap-2 rounded-md px-2 py-0.75 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground"
);

export function Files({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn("not-prose rounded-md border bg-fd-card p-2", className)}
      {...props}
    >
      {props.children}
    </div>
  );
}

export interface FileProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: ReactNode;
}

export interface FolderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;

  disabled?: boolean;

  /**
   * Open folder by default
   *
   * @default false
   */
  defaultOpen?: boolean;

  classNameIcon?: {
    iconOpen?: string;
    iconClose?: string;
  };
}

export function File({
  name,
  icon = <FileIcon className="size-4" />,
  className,
  ...rest
}: FileProps): React.ReactElement {
  return (
    <div
      className={cn(itemVariants({ className }))}
      {...rest}
    >
      {icon}
      {name}
    </div>
  );
}

export function Folder({
  name,
  defaultOpen = false,
  classNameIcon,
  ...props
}: FolderProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      <CollapsibleTrigger className={cn(itemVariants({ className: "w-full" }))}>
        {open ? (
          <FolderOpen className={cn("size-4", classNameIcon?.iconOpen)} />
        ) : (
          <FolderIcon className={cn("size-4", classNameIcon?.iconClose)} />
        )}
        {name}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-3.75 flex flex-col border-l ps-2">
          {props.children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
