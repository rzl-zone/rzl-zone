"use client";

import { type ComponentProps, useMemo, Fragment } from "react";

import {
  type BreadcrumbOptions,
  getBreadcrumbItemsFromPath
} from "fumadocs-core/breadcrumb";
import Link from "fumadocs-core/link";
import { useTreeContext, useTreePath } from "fumadocs-ui/contexts/tree";

import { ChevronRight } from "@rzl-zone/docs-ui/components/icons/lucide";

import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";

export type BreadcrumbProps = BreadcrumbOptions & ComponentProps<"div">;

export function Breadcrumb({
  includeRoot,
  includeSeparator,
  includePage,
  ...props
}: BreadcrumbProps) {
  const pathname = usePathname();
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = useMemo(() => {
    return getBreadcrumbItemsFromPath(root, path, {
      includePage,
      includeSeparator,
      includeRoot
    });
  }, [includePage, includeRoot, includeSeparator, path, root]);

  if (items.length === 0) return null;

  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-1.5 text-sm text-fd-muted-foreground mb-2",
        props.className
      )}
    >
      {items.map((item, i) => {
        const className = cn(
          "truncate",
          i === items.length - 1 && "text-fd-primary font-medium"
        );

        return (
          <Fragment key={i}>
            {i !== 0 && <ChevronRight className="size-3.5 shrink-0" />}
            {item.url && item.url !== pathname ? (
              <Link
                href={item.url}
                className={cn(className, "transition-opacity hover:opacity-80")}
              >
                {item.name}
              </Link>
            ) : (
              <span className={className}>{item.name}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
