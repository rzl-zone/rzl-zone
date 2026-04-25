"use client";

import { type ComponentProps, useMemo } from "react";

import Link from "fumadocs-core/link";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { usePathname } from "fumadocs-core/framework";
import type * as PageTree from "fumadocs-core/page-tree";
import { useFooterItems } from "fumadocs-ui/utils/use-footer-items";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  ChevronLeft,
  ChevronRight
} from "@rzl-zone/docs-ui/components/icons/lucide";

import { isActive } from "@/lib/urls";

type Item = Pick<PageTree.Item, "name" | "description" | "url" | "nameAlias">;

export interface FooterProps extends ComponentProps<"div"> {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: Item;
    next?: Item;
  };
  bottomComponent?: React.ReactNode;
  linkComponentProps?: Omit<
    React.ComponentPropsWithRef<"a">,
    "children" | "href"
  >;
}

export function Footer({
  items,
  bottomComponent,
  linkComponentProps,
  children,
  className,
  ...props
}: FooterProps) {
  const footerList = useFooterItems();
  const pathname = usePathname();
  const { previous, next } = useMemo(() => {
    if (items) return items;

    const idx = footerList.findIndex((item) => isActive(item.url, pathname));

    if (idx === -1) return {};
    return {
      previous: footerList[idx - 1],
      next: footerList[idx + 1]
    };
  }, [footerList, items, pathname]);

  return (
    <>
      {previous || next ? (
        <div
          className={cn(
            "@container grid gap-4",
            previous && next ? "grid-cols-2" : "grid-cols-1",
            className
          )}
          {...props}
        >
          {previous ? (
            <FooterItem
              {...linkComponentProps}
              item={previous}
              index={0}
            />
          ) : null}
          {next ? (
            <FooterItem
              {...linkComponentProps}
              item={next}
              index={1}
            />
          ) : null}
        </div>
      ) : null}

      {children}
      {bottomComponent}
    </>
  );
}

export function FooterItem({ item, index }: { item: Item; index: 0 | 1 }) {
  const { text } = useI18n();
  const Icon = index === 0 ? ChevronLeft : ChevronRight;

  return (
    <Link
      href={item.url}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground @max-lg:col-span-full",
        index === 1 && "text-end"
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-1.5 font-medium",
          index === 1 && "flex-row-reverse"
        )}
      >
        <Icon className="-mx-1 size-4 shrink-0 rtl:rotate-180" />
        <p>{item.nameAlias ?? item.name}</p>
      </div>
      <p className="text-fd-muted-foreground truncate">
        {item.description ?? (index === 0 ? text.previousPage : text.nextPage)}
      </p>
    </Link>
  );
}
