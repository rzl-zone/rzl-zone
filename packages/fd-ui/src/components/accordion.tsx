"use client";

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState
} from "react";

import { isProdEnv } from "@rzl-zone/core/env/node";
import { mergeRefs } from "@rzl-zone/core-react/utils/merge-refs";

import { delay } from "@rzl-zone/utils-js/promises";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  Check,
  ChevronRight,
  Link as LinkIcon
} from "@rzl-zone/docs-ui/components/icons/lucide";
import type {
  AccordionMultipleProps,
  AccordionSingleProps
} from "@rzl-zone/docs-ui/components/radix-ui-accordion";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { SeparatorSection } from "@rzl-zone/docs-ui/components/separator";
import * as AccordionPrimitive from "@rzl-zone/docs-ui/components/radix-ui-accordion";

import { useCopyButtonFD } from "@workspace/fd-core/hooks/use-copy-button-fd";

import { useMainRzlFumadocs } from "@/providers/main-rzl-fumadocs";

export const Accordions = forwardRef<
  HTMLDivElement,
  | Omit<AccordionSingleProps, "value" | "onValueChange">
  | Omit<AccordionMultipleProps, "value" | "onValueChange">
>(({ type = "single", className, defaultValue, ...props }, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const composedRef = mergeRefs(ref, rootRef);
  const [value, setValue] = useState<string | string[]>(() =>
    type === "single" ? (defaultValue ?? "") : (defaultValue ?? [])
  );

  const setNewVal = useEffectEvent((newVal: string) =>
    setValue((prev) => (typeof prev === "string" ? newVal : [newVal, ...prev]))
  );

  useEffect(() => {
    const id = window.location.hash.substring(1);
    const element = rootRef.current;
    if (!element || id.length === 0) return;

    const selected = document.getElementById(id);
    if (!selected || !element.contains(selected)) return;
    const value = selected.getAttribute("data-accordion-value");

    // // eslint-disable-next-line react-hooks/set-state-in-effect
    // if (value) setValue((prev) => (typeof prev === "string" ? value : [value, ...prev]));
    if (value) setNewVal(value);
  }, []);

  return (
    // @ts-expect-error -- Multiple types
    <AccordionPrimitive.Root
      type={type}
      ref={composedRef}
      value={value}
      orientation="horizontal"
      onValueChange={setValue}
      collapsible={type === "single" ? true : undefined}
      className={cn(
        "divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card",
        className
      )}
      {...props}
    />
  );
});

Accordions.displayName = isProdEnv() ? undefined : "Accordions";

export const Accordion = forwardRef<
  HTMLDivElement,
  Omit<
    ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    "value" | "title"
  > & {
    title: string | ReactNode;
    value?: string;
    scrollToId?: boolean;
    titleAsCode?: boolean;
  }
>(
  (
    {
      title,
      className,
      id,
      value = String(id ?? title),
      children,
      scrollToId,
      titleAsCode,
      ...props
    },
    ref
  ) => {
    const { pageMdx } = useMainRzlFumadocs();

    return (
      <AccordionPrimitive.Item
        ref={ref}
        value={value}
        className={cn(className)}
        {...props}
      >
        <AccordionPrimitive.Header
          id={id}
          {...(id && { "data-anchorable": "true" })}
          data-accordion-value={value}
          className={cn(
            "not-prose flex flex-row items-center text-fd-card-foreground font-medium has-focus-visible:bg-fd-accent",
            id &&
              cn(
                !!pageMdx.data?.currentDocsUnderConstruction ||
                  !!pageMdx.data?.currentDocsIsOldVersion
                  ? "scroll-m-37 xl:scroll-m-26"
                  : pageMdx.data?.currentDocsUnderConstruction &&
                      pageMdx.data?.currentDocsIsOldVersion
                    ? "scroll-m-42 xl:scroll-m-31"
                    : "scroll-m-28 xl:scroll-m-17"
              )
          )}
        >
          <AccordionPrimitive.Trigger
            className="group flex flex-1 items-center gap-2 px-3 py-2.5 text-start focus-visible:outline-none"
            onClick={async () => {
              if (!id || !scrollToId) return;
              const target = document.getElementById(id);
              if (!target) return;

              const header = target;
              const content = header.nextElementSibling as HTMLElement | null;
              if (!content) return;

              const startTop =
                header.getBoundingClientRect().top + window.scrollY;

              const parseDuration = (v?: string | null) => {
                if (!v) return 0;
                const first = v.split(",")[0]?.trim();
                if (first && first.endsWith("ms")) return parseFloat(first);
                if (first && first.endsWith("s"))
                  return parseFloat(first) * 1000;
                return first ? parseFloat(first) : 0;
              };

              const style = getComputedStyle(content);
              const anim = Math.max(
                parseDuration(style.animationDuration),
                parseDuration(style.transitionDuration)
              );
              const waitMs = Math.max(200, anim) + 0;

              await delay(waitMs);

              const rect = header.getBoundingClientRect();
              const endTop = rect.top + window.scrollY;
              const diff = endTop - startTop;
              const OFFSET = 100;

              if (Math.abs(diff) > 5) {
                window.scrollTo({
                  top: Math.max(0, endTop - OFFSET),
                  behavior: "smooth"
                });
              }
            }}
          >
            <ChevronRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            {titleAsCode && isNonEmptyString(title) ? (
              <code
                data-code-prose="true"
                className="prose-code"
              >
                {title}
              </code>
            ) : (
              title
            )}
          </AccordionPrimitive.Trigger>
          {id ? <CopyButton id={id} /> : null}
        </AccordionPrimitive.Header>

        <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-fd-accordion-up data-[state=open]:animate-fd-accordion-down">
          <SeparatorSection className="my-0 h-[1.5px]" />
          <div className="px-4 py-2 text-[15px] prose-no-margin">
            {children}
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    );
  }
);

function CopyButton({ id }: { id: string }) {
  const [checked, onClick] = useCopyButtonFD({
    onCopy: () => {
      const url = new URL(window.location.href);
      url.hash = id;

      return navigator.clipboard.writeText(url.toString());
    }
  });

  return (
    <button
      type="button"
      aria-label="Copy Link"
      className={cn(
        buttonVariants({
          size: "icon-xxs",
          className: "text-fd-muted-foreground me-2",
          variant: "ghost"
        })
      )}
      onClick={onClick}
    >
      {checked ? (
        <Check className="size-3.5" />
      ) : (
        <LinkIcon className="size-3.5" />
      )}
    </button>
  );
}

Accordion.displayName = isProdEnv() ? undefined : "Accordion";
