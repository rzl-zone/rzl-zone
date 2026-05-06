"use client";

import React, {
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

import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { createMarkdownRenderer } from "fumadocs-core/content/md";
import {
  type HighlightedText,
  type ReactSortedResult
} from "fumadocs-core/search";

import type { Root } from "hast";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import { type Transformer } from "unified";

import { type SharedProps } from "fumadocs-ui/contexts/search";
import { I18nLabel, useI18n } from "fumadocs-ui/contexts/i18n";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
// import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { Dialog } from "@base-ui/react/dialog";

import {
  ChevronRight,
  Hash,
  SearchIcon
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { cva, scrollIntoView } from "@rzl-zone/docs-ui/utils";

import { useRouter } from "@rzl-zone/next-kit/progress-bar/app";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import type { Awaitable } from "@rzl-zone/ts-types-plus";

import { cn } from "@/lib/cn";

export type SearchItemType =
  | (ReactSortedResult & {
      external?: boolean;
    })
  | {
      id: string;
      type: "action";
      node: ReactNode;
      onSelect: () => void;
    };

// needed for backward compatible since some previous guides referenced it
export type { SharedProps };

export interface SearchDialogProps extends SharedProps {
  search: string;
  onSearchChange: (v: string) => void;
  onSelect?: Awaitable<(item: SearchItemType) => void>;
  isLoading?: boolean;

  children: ReactNode;
}

const RootContext = createRequiredContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (item: SearchItemType) => void;
  isLoading: boolean;
}>("RootContext");

const ListContext = createRequiredContext<{
  active: string | null;
  setActive: (v: string | null) => void;
}>("ListContext");

const TagsListContext = createRequiredContext<{
  value?: string;
  onValueChange: (value: string | undefined) => void;
  allowClear: boolean;
}>("TagsListContext");

const PreContext = createRequiredContext("PreContext", false);

const mdRenderer = createMarkdownRenderer({
  remarkRehypeOptions: {
    allowDangerousHtml: true
  },
  rehypePlugins: [rehypeRaw, rehypeCustomElements]
});

const mdComponents = {
  mark(props: ComponentProps<"mark">) {
    return (
      <span
        {...props}
        className="text-fd-primary underline"
      />
    );
  },
  a: "span",
  p(props: ComponentProps<"p">) {
    if (React.Children.count(props.children) === 0) return null;
    return (
      <p
        {...props}
        className="min-w-0"
      />
    );
  },
  strong(props: ComponentProps<"strong">) {
    return (
      <strong
        {...props}
        className="text-fd-accent-foreground font-medium"
      />
    );
  },
  code(props: ComponentProps<"code">) {
    if (React.Children.count(props.children) === 0) return null;
    return (
      <code
        {...props}
        className={cn(
          "px-1 py-0.5 rounded-md font-mono text-[0.85em] transition-all border",
          "bg-fd-secondary/50 text-fd-secondary-foreground border-fd-border",
          "group-aria-selected:bg-fd-popover",
          "group-aria-selected:text-fd-accent-foreground",
          "group-aria-selected:border-fd-accent-foreground/30",
          "group-aria-selected:shadow-sm"
        )}
        // className="px-1 py-0.5 rounded-md bg-fd-secondary border border-fd-border text-fd-secondary-foreground font-mono text-[0.85em] shadow-sm"
      />
    );
  },
  custom({
    _tagName = "fragment",
    children,
    ...rest
  }: Record<string, unknown> & { _tagName: string; children: ReactNode }) {
    return (
      <span className="inline-flex max-w-full items-center border p-0.5 rounded-md bg-fd-card text-fd-card-foreground divide-x divide-fd-border">
        <code className="rounded-sm px-0.5 me-1 bg-fd-primary font-medium text-xs text-fd-primary-foreground border-none">
          {_tagName}
        </code>
        {Object.entries(rest).map(([k, v]) => {
          if (typeof v !== "string") return;

          return (
            <code
              key={k}
              className="truncate text-xs text-fd-muted-foreground px-1"
            >
              <span className="text-fd-card-foreground">{k}: </span>
              {v}
            </code>
          );
        })}
        {children && <span className="ps-1">{children}</span>}
      </span>
    );
  },
  pre(props: ComponentProps<"pre">) {
    if (!props.children) return null;
    return (
      <pre
        {...props}
        className={cn(
          "flex flex-col border rounded-md my-0.5 p-2 bg-fd-secondary text-fd-secondary-foreground max-h-20 overflow-hidden",
          props.className
        )}
      >
        <PreContext.Provider value={true}>{props.children}</PreContext.Provider>
      </pre>
    );
  }
};

function rehypeCustomElements(): Transformer<Root, Root> {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "element" &&
        document.createElement(node.tagName) instanceof HTMLUnknownElement
      ) {
        node.properties._tagName = node.tagName;
        node.tagName = "custom";
      }
    });
  };
}

export function SearchDialog({
  open,
  onOpenChange,
  search,
  onSearchChange,
  isLoading = false,
  onSelect: onSelectProp,
  children
}: SearchDialogProps) {
  const router = useRouter();

  const onOpenChangeCallback = useRef(onOpenChange);
  const onSearchChangeCallback = useRef(onSearchChange);

  // // eslint-disable-next-line react-hooks/refs
  // onOpenChangeCallback.current = onOpenChange;
  // // eslint-disable-next-line react-hooks/refs
  // onSearchChangeCallback.current = onSearchChange;

  useEffect(() => {
    onSearchChangeCallback.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    onOpenChangeCallback.current = onOpenChange;
  }, [onOpenChange]);

  const cooldownRef = useRef(false);
  const selectingRef = useRef(false);

  const onSelect = async (item: SearchItemType) => {
    if (selectingRef.current) return;
    selectingRef.current = true;
    cooldownRef.current = true;

    onOpenChange(false);

    requestAnimationFrame(() => {
      if (item.type !== "action" && !item.external) {
        router.push(item.url);
      }
      selectingRef.current = false;

      setTimeout(() => {
        cooldownRef.current = false;
      }, 200);
    });

    if (item.type === "action") item.onSelect();
    if (item.type !== "action" && item.external)
      window.open(item.url, "_blank")?.focus();

    (await onSelectProp)?.(item);
  };

  const onSelectCallback = useRef(onSelect);

  // // eslint-disable-next-line react-hooks/refs
  // onSelectCallback.current = onSelect;
  useEffect(() => {
    onSelectCallback.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    selectingRef.current = false;
  }, [open]);

  return (
    <Dialog.Root
      open={open}
      // onOpenChange={onOpenChange}
      onOpenChange={(v) => {
        if (selectingRef.current || cooldownRef.current) return;
        onOpenChangeCallback.current(v);
      }}
    >
      <RootContext.Provider
        value={useMemo(
          () => ({
            open,
            search,
            isLoading,
            onOpenChange: (v) => onOpenChangeCallback.current(v),
            onSearchChange: (v) => onSearchChangeCallback.current(v),
            onSelect: (v) => onSelectCallback.current(v)
          }),
          [isLoading, open, search]
        )}
      >
        {children}
      </RootContext.Provider>
    </Dialog.Root>
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
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      className={cn(
        buttonVariants({
          variant: "outline",
          size: "sm",
          className: "font-mono text-fd-muted-foreground"
        }),
        className
      )}
      {...props}
    >
      {children}
    </button>
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

export function SearchDialogOverlay({
  className,
  ...props
}: ComponentProps<typeof Dialog.Backdrop>) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop
        {...props}
        className={(s) =>
          cn(
            "fixed inset-0 z-50 backdrop-blur-xs bg-fd-overlay data-open:animate-fd-fade-in data-closed:animate-fd-fade-out",
            typeof className === "function" ? className(s) : className
          )
        }
      />
    </Dialog.Portal>
  );
}

export function SearchDialogContent({
  children,
  className,
  ...props
}: ComponentProps<typeof Dialog.Popup>) {
  const { text } = useI18n();

  return (
    <Dialog.Portal>
      <Dialog.Popup
        id="fd-search-dialog-content"
        aria-describedby={undefined}
        {...props}
        className={(s) =>
          cn(
            "fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-2xl overflow-hidden data-closed:animate-fd-dialog-out data-open:animate-fd-dialog-in focus-visible:outline-none",
            "*:border-b *:has-[+:last-child[data-empty=true]]:border-b-0 *:data-[empty=true]:border-b-0 *:last:border-b-0",
            typeof className === "function" ? className(s) : className
          )
        }
      >
        <Dialog.Title className="hidden">{text.search}</Dialog.Title>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}

type ItemTypeProp = {
  item: SearchItemType;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
};
type ItemType = (props: ItemTypeProp) => ReactNode;
const DefaultItem = (props: ItemTypeProp) => (
  <SearchDialogListItem {...props} />
);

export function SearchDialogList({
  items = null,
  Empty = () => (
    <div className="py-3 text-center text-sm text-fd-muted-foreground">
      <I18nLabel label="searchNoResult" />
    </div>
  ),
  Item = DefaultItem,
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
  Item?: ItemType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { onSelect } = useSearch();
  const [active, setActive] = useState<string | null>(() =>
    items && items.length > 0 ? items[0]!.id : null
  );

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

      if (selected) onSelect(selected);
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

    const content: Pick<Window, "addEventListener" | "removeEventListener"> =
      document.getElementById("fd-search-dialog-content") ?? window;
    content.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      content.removeEventListener("keydown", onKey);
    };
  }, []);

  useOnChange(items, () => {
    if (items && items.length > 0) {
      setActive(items[0]!.id);
    }
  });

  const handleMouseEnter = useCallback((id: string) => {
    setActive(id);
  }, []);

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
              {Item({
                item,
                isActive: active === item.id,
                onMouseEnter: () => handleMouseEnter(item.id),
                onClick: () => onSelect(item)
              })}
            </Fragment>
          ))}
          {/* {items?.map((item) => (
            <Fragment key={item.id}>
              {Item({ item, onClick: () => onSelect(item) })}
            </Fragment>
          ))} */}
        </ListContext.Provider>
      </div>
    </div>
  );
}

export const SearchDialogListItem = React.memo(
  function SearchDialogListItem({
    item,
    isActive,
    onMouseEnter,
    className,
    children,
    renderMarkdown = (s) => (
      <mdRenderer.Markdown components={mdComponents}>{s}</mdRenderer.Markdown>
    ),
    renderHighlights: _,
    ...props
  }: ComponentProps<"button"> & {
    isActive: boolean;
    onMouseEnter: () => void;
    renderMarkdown?: (v: string) => ReactNode;
    /** @deprecated highlight blocks is now wrapped in `<mark />`, use `renderMarkdown` to handle instead. */
    renderHighlights?: (blocks: HighlightedText<ReactNode>[]) => ReactNode;
    item: SearchItemType;
  }) {
    // const { active: activeId, setActive } = useSearchList();
    // const active = item.id === activeId;

    const scrollRef = useCallback(
      (element: HTMLButtonElement | null) => {
        if (isActive && element) {
          scrollIntoView(element, {
            scrollMode: "if-needed",
            block: "nearest",
            boundary: element.parentElement
          });
        }
      },
      [isActive]
    );

    const rawContent = item.type !== "action" ? item.content : undefined;
    const breadcrumbs = item.type !== "action" ? item.breadcrumbs : undefined;

    const hasContent =
      typeof rawContent === "string"
        ? rawContent.trim().length > 0
        : !!rawContent;

    const hasBreadcrumbs = !!(breadcrumbs && breadcrumbs.length > 0);

    if (item.type !== "action" && !hasContent && !hasBreadcrumbs && !children) {
      return null;
    }

    let displayContent: ReactNode;

    if (item.type === "action") {
      displayContent = children ?? item.node;
    } else {
      displayContent = children ?? (
        <>
          {hasBreadcrumbs && (
            <div className="inline-flex items-center text-fd-muted-foreground text-xs empty:hidden">
              {breadcrumbs.map((item, i) => (
                <Fragment key={i}>
                  {i > 0 && <ChevronRight className="size-4 rtl:rotate-180" />}
                  {item}
                </Fragment>
              ))}
            </div>
          )}

          {item.type !== "page" && hasContent && (
            <div
              role="none"
              className="absolute inset-s-3 inset-y-0 w-px bg-fd-border"
            />
          )}

          {item.type === "heading" && hasContent && (
            <Hash className="absolute inset-s-6 top-2.5 size-4 text-fd-muted-foreground" />
          )}

          {hasContent && (
            <div
              className={cn(
                "min-w-0",
                item.type === "text" && "ps-4",
                item.type === "heading" && "ps-8",
                item.type === "page" || item.type === "heading"
                  ? "font-medium"
                  : "text-fd-popover-foreground/80"
              )}
            >
              {typeof item.content === "string"
                ? renderMarkdown(item.content)
                : item.content}
            </div>
          )}
        </>
      );
    }

    return (
      <button
        type="button"
        ref={scrollRef}
        aria-selected={isActive}
        className={cn(
          "group relative select-none shrink-0 px-2.5 py-2 text-start text-sm overflow-hidden rounded-lg",
          isActive && "bg-fd-accent text-fd-accent-foreground",
          className
        )}
        // className={cn(
        //   "relative select-none shrink-0 px-2.5 py-2 text-start text-sm overflow-hidden rounded-lg",
        //   isActive && "bg-fd-accent text-fd-accent-foreground",
        //   // active
        //   //   ? "bg-fd-accent text-fd-accent-foreground"
        //   //   : "hover:bg-fd-accent hover:text-fd-accent-foreground",
        //   className
        // )}
        onMouseEnter={onMouseEnter}
        // onMouseEnter={() => setActive(item.id)}

        // onMouseEnter={(e) =>
        //   e.currentTarget.setAttribute("aria-selected", "true")
        // }
        // onMouseLeave={(e) =>
        //   e.currentTarget.setAttribute("aria-selected", "false")
        // }
        // onClick={() => setActive(item.id)}
        {...props}
      >
        {displayContent}
      </button>
    );
  },
  (prev, next) => {
    return (
      prev.isActive === next.isActive &&
      prev.item.id === next.item.id &&
      ("content" in prev.item && "content" in next.item
        ? prev.item.content === next.item.content
        : true)
    );
  }
);

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
  const onTagChangeCallback = useRef(onTagChange);

  // // eslint-disable-next-line react-hooks/refs
  // onTagChangeCallback.current = onTagChange;
  useEffect(() => {
    onTagChangeCallback.current = onTagChange;
  }, [onTagChange]);

  return (
    <div
      {...props}
      className={cn("flex items-center gap-1 flex-wrap", props.className)}
    >
      <TagsListContext.Provider
        value={useMemo(
          () => ({
            value: tag,
            onValueChange: (v) => onTagChangeCallback.current(v),
            allowClear
          }),
          [allowClear, tag]
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
      type="button"
      data-active={selected}
      className={cn(itemVariants({ active: selected, className }))}
      onClick={() => onValueChange(selected && allowClear ? undefined : value)}
      tabIndex={-1}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function useSearch() {
  return RootContext.useSuspense("Missing <SearchDialog />");
}

export function useTagsList() {
  return TagsListContext.useSuspense("Missing <TagsList />");
}

export function useSearchList() {
  return ListContext.useSuspense("Missing <SearchDialogList />");
}
