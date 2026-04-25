"use client";

import {
  type ReactNode,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useState
} from "react";
import { isProdEnv } from "@rzl-zone/core/env/node";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { cn } from "@rzl-zone/docs-ui/utils";

import {
  UnstyledTabs,
  UnstyledTabsList,
  UnstyledTabsContent,
  UnstyledTabsTrigger,
  type UnstyledTabsProps,
  type UnstyledTabsListProps,
  type UnstyledTabsTriggerProps,
  type UnstyledTabsContentProps
} from "./tabs.unstyled";
type CollectionKey = string | symbol;

export interface TabsProps extends Omit<
  UnstyledTabsProps,
  "value" | "onValueChange"
> {
  /**
   * Use simple mode instead of advanced usage as documented in https://radix-ui.com/primitives/docs/components/tabs.
   */
  items?: string[];

  /**
   * Shortcut for `defaultValue` when `items` is provided.
   *
   * @default 0
   */
  defaultIndex?: number;

  /**
   * Additional label in tabs list when `items` is provided.
   */
  label?: ReactNode;
}

const TabsContext = createRequiredContext<{
  items?: string[];
  collection: CollectionKey[];
}>("TabsContext");

function useTabContext() {
  return TabsContext.use();
}

export const TabsList = forwardRef<
  HTMLDivElement,
  Omit<UnstyledTabsListProps, "ref">
>((props, ref) => (
  <UnstyledTabsList
    ref={ref}
    {...props}
    className={cn(
      "flex gap-3.5 text-fd-secondary-foreground overflow-x-auto px-4 not-prose",
      props.className
    )}
  />
));
TabsList.displayName = isProdEnv() ? undefined : "TabsList";

export const TabsTrigger = forwardRef<
  HTMLButtonElement,
  Omit<UnstyledTabsTriggerProps, "ref">
>((props, ref) => (
  <UnstyledTabsTrigger
    tabIndex={-1}
    {...props}
    ref={ref}
    className={cn(
      "inline-flex items-center gap-2 whitespace-nowrap text-fd-muted-foreground border-b border-transparent py-2 text-sm font-medium transition-colors [&_svg]:size-4 hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-fd-primary data-[state=active]:text-fd-primary",
      props.className
    )}
  />
));
TabsTrigger.displayName = isProdEnv() ? undefined : "TabsTrigger";

export function Tabs({
  ref,
  className,
  items,
  label,
  defaultIndex = 0,
  defaultValue = items ? escapeValue(items[defaultIndex] || "") : undefined,
  ...props
}: TabsProps) {
  const [value, setValue] = useState(defaultValue);
  const collection = useMemo<CollectionKey[]>(() => [], []);

  return (
    <UnstyledTabs
      ref={ref}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-fd-secondary my-2 shadow-md",
        className
      )}
      value={value}
      onValueChange={(v: string) => {
        if (items && !items.some((item) => escapeValue(item) === v)) return;
        setValue(v);
      }}
      {...props}
    >
      {items && (
        <TabsList>
          {label && (
            <span className="text-sm font-medium my-auto me-auto">{label}</span>
          )}
          {items.map((item) => (
            <TabsTrigger
              key={item}
              value={escapeValue(item)}
            >
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      <TabsContext.Provider
        value={useMemo(() => ({ items, collection }), [collection, items])}
      >
        {props.children}
      </TabsContext.Provider>
    </UnstyledTabs>
  );
}

export interface TabProps extends Omit<UnstyledTabsContentProps, "value"> {
  /**
   * Value of tab, detect from index if unspecified.
   */
  value?: string;
}

export function Tab({ value, ...props }: TabProps) {
  const { items } = useTabContext();
  const resolved =
    value ??
    // eslint-disable-next-line react-hooks/rules-of-hooks -- `value` is not supposed to change
    items?.at(useCollectionIndex());
  if (!resolved)
    throw new Error(
      "Failed to resolve tab `value`, please pass a `value` prop to the Tab component."
    );

  return (
    <TabsContent
      value={escapeValue(resolved)}
      {...props}
    >
      {props.children}
    </TabsContent>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TabsContentProps extends UnstyledTabsContentProps {}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  return (
    <UnstyledTabsContent
      value={value}
      className={cn(
        "p-4 text-[15px] bg-fd-background outline-none prose-no-margin data-[state=inactive]:hidden [&>figure:only-child]:-m-4 [&>figure:only-child]:border-none [&>figure:only-child]:rounded-none",
        className
      )}
      {...props}
    >
      {props.children}
    </UnstyledTabsContent>
  );
}

/** Inspired by Headless UI.
 *
 * Return the index of children, this is made possible by registering the order of render from children using React context.
 * This is supposed by work with pre-rendering & pure client-side rendering.
 */
function useCollectionIndex() {
  const key = useId();
  const { collection } = useTabContext();

  useEffect(() => {
    return () => {
      const idx = collection.indexOf(key);
      if (idx !== -1) collection.splice(idx, 1);
    };
  }, [key, collection]);

  if (!collection.includes(key)) collection.push(key);
  return collection.indexOf(key);
}

/** only escape whitespaces in values in simple mode */
function escapeValue(v: string): string {
  return v.toLowerCase().replace(/\s/, "-");
}
