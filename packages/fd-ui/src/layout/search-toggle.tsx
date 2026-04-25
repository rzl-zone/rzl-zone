"use client";

import type { ComponentProps } from "react";
import { useI18n } from "@fumadocs/base-ui/contexts/i18n";

import { isString } from "@rzl-zone/utils-js/predicates";

import { cn } from "@rzl-zone/docs-ui/utils";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { Search } from "@rzl-zone/docs-ui/components/icons/lucide";
import { Button, type ButtonProps } from "@rzl-zone/docs-ui/components/button";

import { useSearchContext } from "@/context/search";

type SearchToggleProps = Omit<ComponentProps<"button">, "color"> &
  ButtonProps & {
    hideIfDisabled?: boolean;
  };

export function SearchToggle({
  hideIfDisabled,
  size = "icon-sm",
  variant = "ghost",
  ...props
}: SearchToggleProps) {
  const { setOpenSearch, enabled } = useSearchContext();
  if (hideIfDisabled && !enabled) return null;

  return (
    <Button
      type="button"
      className={cn(
        buttonVariants({
          size,
          variant,
          className: "bg-transparent"
        }),
        props.className
      )}
      data-search=""
      aria-label="Open Search"
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <Search />
    </Button>
  );
}

export function LargeSearchToggle({
  hideIfDisabled,
  ...props
}: ComponentProps<"button"> & {
  hideIfDisabled?: boolean;
}) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const { text } = useI18n();
  if (hideIfDisabled && !enabled) return null;

  return (
    <Button
      type="button"
      data-search-full=""
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
        props.className
      )}
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <Search className="size-4" />
      {text.search}
      <div className="ms-auto inline-flex gap-0.5">
        {hotKey.map((k, i) => (
          <kbd
            key={i}
            className={cn(
              "rounded-md border bg-fd-background",
              isString(k.key) && "px-1.5"
            )}
          >
            {k.display}
          </kbd>
        ))}
      </div>
    </Button>
  );
}
