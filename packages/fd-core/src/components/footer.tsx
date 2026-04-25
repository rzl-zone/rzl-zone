"use client";

import {
  type ComponentProps,
  type ComponentPropsWithRef,
  useMemo
} from "react";

import { useI18n } from "@fumadocs/base-ui/contexts/i18n";
import { useTreeContext } from "@fumadocs/base-ui/contexts/tree";

import type * as PageTree from "fumadocs-core/page-tree";
import { Link, usePathname } from "fumadocs-core/framework";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  ChevronLeft,
  ChevronRight
} from "@rzl-zone/docs-ui/components/icons/lucide";

import { isActive } from "@/utils";

function scanNavigationList(tree: PageTree.Node[]) {
  const list: PageTree.Item[] = [];

  tree.forEach((node) => {
    if (node.type === "folder") {
      if (node.index) {
        list.push(node.index);
      }

      list.push(...scanNavigationList(node.children));
      return;
    }

    if (node.type === "page" && !node.external) {
      list.push(node);
    }
  });

  return list;
}

const listCache = new Map<string, PageTree.Item[]>();

type Item = Pick<PageTree.Item, "name" | "description" | "url" | "nameAlias">;

export interface FooterProps extends ComponentProps<"div"> {
  /** Items including information for the next and previous page */
  items?: {
    previous?: Item;
    next?: Item;
  };
  bottomComponent?: React.ReactNode;
  linkComponentProps?: Omit<ComponentPropsWithRef<"a">, "children" | "href">;
}

export function PageFooter({
  items,
  bottomComponent,
  linkComponentProps,
  ...props
}: FooterProps) {
  const { root } = useTreeContext();
  const pathname = usePathname();

  const { previous, next } = useMemo(() => {
    if (items) return items;

    const cached = listCache.get(root.$id);
    const list = cached ?? scanNavigationList(root.children);
    listCache.set(root.$id, list);

    const idx = list.findIndex((item) => isActive(item.url, pathname, false));

    if (idx === -1) return {};
    return {
      previous: list[idx - 1],
      next: list[idx + 1]
    };
  }, [items, pathname, root]);

  return (
    <>
      <div
        {...props}
        className={cn(
          "@container grid gap-4 pb-6",
          previous && next ? "grid-cols-2" : "grid-cols-1",
          props.className
        )}
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

      {bottomComponent}
    </>
  );
}

function FooterItem({
  item,
  index,
  ...restProps
}: { item: Item; index: 0 | 1 } & Omit<
  ComponentPropsWithRef<"a">,
  "children" | "href"
>) {
  const { text } = useI18n();
  const Icon = index === 0 ? ChevronLeft : ChevronRight;

  return (
    <Link
      href={item.url}
      {...restProps}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-2 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground @max-lg:col-span-full",
        restProps.className,
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
