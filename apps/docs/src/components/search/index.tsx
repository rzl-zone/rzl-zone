"use client";

import {
  useSearch,
  SearchDialog,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps
} from "fumadocs-ui/components/dialog/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "fumadocs-ui/components/ui/popover";
// import { ArrowRight, ChevronDown } from "lucide-react";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
// import { cn } from "@/lib/cn";
import { useTreeContext } from "fumadocs-ui/contexts/tree";
import type { Item, Node } from "fumadocs-core/page-tree";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { cn } from "@rzl-zone/docs-ui/utils";
import { SEARCH_TAGS, type TagsOptions } from "@/utils/packages/docs-search";
import { Button } from "@rzl-zone/docs-ui/components/button";

const AllPackageOption: NonNullable<TagsOptions[number]> = {
  label: "All Package",
  value: -1
};

export default function CustomSearchDialog(props: SharedProps) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | undefined | -1>();

  const [items, setItems] = useState<TagsOptions>([AllPackageOption]);

  useEffect(() => {
    SEARCH_TAGS().then((res) => {
      setItems([AllPackageOption, ...res]);
    });
  }, []);

  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    delayMs: 750,
    // client: orama,
    tag: typeof tag === "number" ? undefined : tag
  });
  const { full } = useTreeContext();
  const router = useRouter();
  const searchMap = useMemo(() => {
    const map = new Map<string, Item>();

    function onNode(node: Node) {
      if (node.type === "page" && typeof node.name === "string") {
        map.set(node.name.toLowerCase(), node);
      } else if (node.type === "folder") {
        if (node.index) onNode(node.index);
        for (const item of node.children) onNode(item);
      }
    }

    for (const item of full.children) onNode(item);
    return map;
  }, [full]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const pageTreeAction = useMemo<SearchItemType | undefined>(() => {
    if (search.length === 0) return;

    const normalized = search.toLowerCase();
    for (const [k, page] of searchMap) {
      if (!k.startsWith(normalized)) continue;

      return {
        id: "quick-action",
        type: "action",
        node: (
          <div className="inline-flex items-center gap-2 text-fd-muted-foreground">
            <ArrowRight className="size-4" />
            <p>
              Jump to{" "}
              <span className="font-medium text-fd-foreground">
                {page.name}
              </span>
            </p>
          </div>
        ),
        onSelect: () => router.push(page.url)
      };
    }
  }, [router, search, searchMap]);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <CloseButton />
        </SearchDialogHeader>
        <SearchDialogList
          items={
            query.data !== "empty" || pageTreeAction
              ? [
                  ...(pageTreeAction ? [pageTreeAction] : []),
                  ...(Array.isArray(query.data) ? query.data : [])
                ]
              : null
          }
        />
        <SearchDialogFooter
          className="flex flex-row flex-wrap gap-2 items-center"
          suppressHydrationWarning
        >
          <Popover
            open={open}
            onOpenChange={setOpen}
          >
            <PopoverTrigger
              className={buttonVariants({
                size: "sm",
                color: "ghost",
                className: "-m-1.5 me-auto"
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">Filter</span>
              {items.find((item) => item?.value === tag)?.label ||
                AllPackageOption.label}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent
              className="flex flex-col p-1 gap-1"
              align="start"
            >
              {items.map((item, i) => {
                const isSelected = item?.value === tag;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTag(item?.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-lg text-start px-2 py-1.5",
                      isSelected
                        ? "text-fd-primary bg-fd-primary/10"
                        : "hover:text-fd-accent-foreground hover:bg-fd-accent"
                    )}
                  >
                    <p className="font-medium mb-0.5">{item?.label}</p>
                    {/* <p className="text-xs opacity-70">{item?.description}</p> */}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
          {/* <a
            href="https://orama.com"
            rel="noreferrer noopener"
            className="text-xs text-nowrap text-fd-muted-foreground"
          >
            Powered by Orama
          </a> */}
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}

const CloseButton = () => {
  const { onOpenChange } = useSearch();
  return (
    <Button
      onClick={() => onOpenChange(false)}
      variant={"ghost"}
      className={buttonVariants({
        color: "outline",
        size: "sm",
        className: "font-mono text-fd-muted-foreground"
      })}
    >
      Esc
    </Button>
  );
};
