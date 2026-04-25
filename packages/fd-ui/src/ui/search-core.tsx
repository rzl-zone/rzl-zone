"use client";

import {
  type ComponentProps,
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState
} from "react";

import type {
  HighlightedText,
  ReactSortedResult as BaseResultType
} from "fumadocs-core/search";

import { I18nLabel, useI18n } from "@fumadocs/base-ui/contexts/i18n";

import { useRouter } from "@rzl-zone/next-kit/progress-bar/app";

import { useOnChange } from "@rzl-zone/core-react/hooks";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { cn, cva } from "@rzl-zone/docs-ui/utils";
import { scrollIntoView } from "@rzl-zone/docs-ui/utils";

import {
  ChevronRight,
  Hash,
  Search as SearchIcon
} from "@rzl-zone/docs-ui/components/icons/lucide";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle
} from "@rzl-zone/docs-ui/components/radix-ui-dialog";
import { Button } from "@rzl-zone/docs-ui/components/button";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";

import { type SharedProps } from "@/context/search";

// import { useOnChange } from "@/core/hooks/use-on-change";

export type SearchItemType =
  | (BaseResultType & {
      external?: boolean;
    })
  | {
      id: string;
      type: "action";
      node: ReactNode;
      onSelect: () => void;
    };

export interface SearchDialogProps extends SharedProps {
  search: string;
  onSearchChange: (v: string) => void;
  isLoading?: boolean;

  children: ReactNode;
}

const SearchDialogContext = createRequiredContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: string;
  onSearchChange: (v: string) => void;
  isLoading: boolean;
}>("SearchDialogContext");

const ListContext = createRequiredContext<{
  active: string | null;
  setActive: (v: string | null) => void;
}>("ListContext");

const TagsListContext = createRequiredContext<{
  value?: string;
  onValueChange: (value: string | undefined) => void;
  allowClear: boolean;
}>("TagsListContext");

export function SearchDialog({
  open,
  onOpenChange,
  search,
  onSearchChange,
  isLoading = false,
  children
}: SearchDialogProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <SearchDialogContext.Provider
        value={useMemo(
          () => ({
            open,
            onOpenChange,
            search,
            onSearchChange,
            active,
            setActive,
            isLoading
          }),
          [active, isLoading, onOpenChange, onSearchChange, open, search]
        )}
      >
        {children}
      </SearchDialogContext.Provider>
    </Dialog>
  );
}

export function SearchDialogHeader(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-row items-center gap-2 p-3", props.className)}
    />
  );
}

export function SearchDialogInput(props: ComponentProps<"input">) {
  const { text } = useI18n();
  const { search, onSearchChange } = useSearch();

  return (
    <input
      {...props}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={text.search}
      className="w-0 flex-1 bg-transparent text-lg placeholder:text-fd-muted-foreground focus-visible:outline-none"
    />
  );
}

export function SearchDialogClose({
  children = "ESC",
  className,
  ...props
}: ComponentProps<"button">) {
  const { onOpenChange } = useSearch();

  return (
    <Button
      type="button"
      onClick={() => onOpenChange(false)}
      className={cn(
        buttonVariants({
          variant: "outline",
          size: "default",
          className: "font-poppins text-fd-muted-foreground bg-transparent"
        }),
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

export function SearchDialogFooter(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("bg-fd-secondary/50 p-3 empty:hidden", props.className)}
    />
  );
}

export function SearchDialogOverlay(
  props: ComponentProps<typeof DialogOverlay>
) {
  return (
    <DialogOverlay
      {...props}
      className={cn(
        "fixed inset-0 z-50 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out",
        props.className
      )}
    />
  );
}

export function SearchDialogContent({
  children,
  ...props
}: ComponentProps<typeof DialogContent>) {
  const { text } = useI18n();

  return (
    <DialogContent
      aria-describedby={undefined}
      {...props}
      className={cn(
        "fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-2xl shadow-black/50 overflow-hidden data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in",
        "*:border-b *:has-[+:last-child[data-empty=true]]:border-b-0 *:data-[empty=true]:border-b-0 *:last:border-b-0",
        props.className
      )}
    >
      <DialogTitle className="hidden">{text.search}</DialogTitle>
      {children}
    </DialogContent>
  );
}

export function SearchDialogList({
  items = null,
  Empty = () => (
    <div className="py-12 text-center text-sm text-fd-muted-foreground">
      <I18nLabel label="searchNoResult" />
    </div>
  ),
  Item = (props) => <SearchDialogListItem {...props} />,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  items: SearchItemType[] | null | undefined;
  /**
   * Renderer for empty list UI
   */
  Empty?: () => ReactNode;
  /**
   * Renderer for items
   */
  Item?: (props: { item: SearchItemType; onClick: () => void }) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(() =>
    items && items.length > 0 ? items?.[0]?.id || null : null
  );
  const { onOpenChange } = useSearch();
  const router = useRouter();

  const onOpen = (item: SearchItemType) => {
    if (item.type === "action") {
      item.onSelect();
    } else if (item.external) {
      window.open(item.url, "_blank")?.focus();
    } else {
      router.push(item.url);
    }

    onOpenChange(false);
  };

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (!items || e.isComposing) return;

    if (e.key === "ArrowDown" || e.key == "ArrowUp") {
      let idx = items.findIndex((item) => item.id === active);
      if (idx === -1) idx = 0;
      else if (e.key === "ArrowDown") idx++;
      else idx--;

      setActive(items.at(idx % items.length)?.id ?? null);
      e.preventDefault();
    }

    if (e.key === "Enter") {
      const selected = items.find((item) => item.id === active);

      if (selected) onOpen(selected);
      e.preventDefault();
    }
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      const viewport = element.firstElementChild!;

      element.style.setProperty(
        "--fd-animated-height",
        `${viewport.clientHeight}px`
      );
    });

    const viewport = element.firstElementChild;
    if (viewport) observer.observe(viewport);

    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useOnChange(items, () => {
    if (items && items.length > 0) {
      setActive(items?.[0]?.id || null);
    }
  });

  return (
    <div
      {...props}
      ref={ref}
      data-empty={items === null}
      className={cn(
        "overflow-hidden h-(--fd-animated-height) transition-[height]",
        props.className
      )}
    >
      <div
        className={cn(
          "w-full flex flex-col overflow-y-auto max-h-115 p-1",
          !items && "hidden"
        )}
      >
        <ListContext.Provider
          value={useMemo(
            () => ({
              active,
              setActive
            }),
            [active]
          )}
        >
          {items?.length === 0 && Empty()}

          {items?.map((item) => (
            <Fragment key={item.id}>
              {Item({ item, onClick: () => onOpen(item) })}
            </Fragment>
          ))}
        </ListContext.Provider>
      </div>
    </div>
  );
}

export function SearchDialogListItem({
  item,
  className,
  children,
  renderHighlights: render = renderHighlights,
  ...props
}: ComponentProps<"button"> & {
  renderHighlights?: typeof renderHighlights;
  item: SearchItemType;
}) {
  const { active: activeId, setActive } = useSearchList();
  const active = item.id === activeId;

  if (item.type === "action") {
    children ??= item.node;
  } else {
    children ??= (
      <>
        <div className="inline-flex items-center text-fd-muted-foreground text-xs empty:hidden">
          {item.breadcrumbs?.map((item, i) => (
            <Fragment key={i}>
              {i > 0 && <ChevronRight className="size-4" />}
              {item}
            </Fragment>
          ))}
        </div>

        {item.type !== "page" && item.type !== "page-header" && (
          <div
            role="none"
            className="absolute start-3 inset-y-0 w-px bg-fd-border"
          />
        )}
        <div
          className={cn(
            "min-w-0 line-clamp-100",
            // "min-w-0 truncate",
            item.type !== "page" && item.type !== "page-header" && "ps-4",
            item.type === "page" ||
              item.type === "heading" ||
              item.type === "page-header"
              ? "font-medium"
              : "text-fd-popover-foreground/80"
          )}
        >
          {item.type === "heading" && (
            <Hash className="inline me-1 size-4 text-fd-muted-foreground" />
          )}

          {item.contentWithHighlights
            ? render(item.contentWithHighlights)
            : item.content}

          {item.description ? (
            <div className="font-light text-fd-muted-foreground italic line-clamp-100">
              {item.descriptionWithHighlights
                ? render(item.descriptionWithHighlights)
                : item.description}
            </div>
          ) : null}
        </div>
      </>
    );
  }

  return (
    <button
      type="button"
      ref={useCallback(
        (element: HTMLButtonElement | null) => {
          if (active && element) {
            scrollIntoView(element, {
              scrollMode: "if-needed",
              block: "nearest",
              boundary: element.parentElement
            });
          }
        },
        [active]
      )}
      aria-selected={active}
      className={cn(
        "relative select-none px-2.5 py-2 text-start text-sm rounded-lg",
        active && "bg-fd-accent text-fd-accent-foreground",
        className
      )}
      onPointerMove={() => setActive(item.id)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SearchDialogIcon(props: ComponentProps<"svg">) {
  const { isLoading } = useSearch();

  return (
    <SearchIcon
      {...props}
      className={cn(
        "size-5 text-fd-muted-foreground",
        isLoading && "animate-pulse duration-400",
        props.className
      )}
    />
  );
}

export interface TagsListProps extends ComponentProps<"div"> {
  tag?: string;
  onTagChange: (tag: string | undefined) => void;
  allowClear?: boolean;
}

const itemVariants = cva(
  "rounded-md border px-2 py-0.5 text-xs font-medium text-fd-muted-foreground transition-colors",
  {
    variants: {
      active: {
        true: "bg-fd-accent text-fd-accent-foreground"
      }
    }
  }
);

export function TagsList({
  tag,
  onTagChange,
  allowClear = false,
  ...props
}: TagsListProps) {
  return (
    <div
      {...props}
      className={cn("flex items-center gap-1 flex-wrap", props.className)}
    >
      <TagsListContext.Provider
        value={useMemo(
          () => ({
            value: tag,
            onValueChange: onTagChange,
            allowClear
          }),
          [allowClear, onTagChange, tag]
        )}
      >
        {props.children}
      </TagsListContext.Provider>
    </div>
  );
}

export function TagsListItem({
  value,
  className,
  ...props
}: ComponentProps<"button"> & {
  value: string;
}) {
  const { onValueChange, value: selectedValue, allowClear } = useTagsList();
  const selected = value === selectedValue;

  return (
    <button
      tabIndex={-1}
      {...props}
      type="button"
      data-active={selected}
      className={cn(itemVariants({ active: selected, className }))}
      onClick={() => {
        onValueChange(selected && allowClear ? undefined : value);
      }}
    >
      {props.children}
    </button>
  );
}

function renderHighlights(highlights: HighlightedText<ReactNode>[]): ReactNode {
  return highlights.map((node, i) => {
    if (node.styles?.highlight) {
      return (
        <span
          key={i}
          className="text-fd-primary underline"
        >
          {node.content}
        </span>
      );
    }

    return <Fragment key={i}>{node.content}</Fragment>;
  });
}

export function useSearch() {
  return SearchDialogContext.use();
}

export function useTagsList() {
  return TagsListContext.use();
}

export function useSearchList() {
  return ListContext.use();
}

export type { SharedProps };
