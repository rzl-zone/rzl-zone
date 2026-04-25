"use client";

import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";

import {
  Accordion as Root,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger
} from "../ui/accordion";
import { mergeRefs } from "@rzl-zone/core-react/utils";
import { cn } from "@rzl-zone/docs-ui/utils";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { useCopyButtonFD } from "@/hooks/use-copy-button-fd";
import {
  Check,
  ChevronRight,
  LinkIcon
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { Button } from "@rzl-zone/docs-ui/components/button";
import { useEffectEvent } from "@rzl-zone/core-react/hooks";
import { useMainRzlFumadocs } from "@/context/main-rzl-fumadocs";
import { delay } from "@rzl-zone/utils-js/promises";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

export function Accordions({
  type = "single",
  ref,
  className,
  defaultValue,
  ...props
}: ComponentProps<typeof Root>) {
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

    if (value) setNewVal(value);
  }, []);

  return (
    // @ts-expect-error -- Multiple types
    <Root
      type={type}
      ref={composedRef}
      value={value}
      onValueChange={setValue}
      collapsible={type === "single" ? true : undefined}
      className={cn(
        "divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card",
        className
      )}
      {...props}
    />
  );
}

export function Accordion({
  ref,
  title,
  id,
  value = String(id ?? title),
  className,
  children,
  titleAsCode,
  scrollToId,
  ...props
}: Omit<ComponentProps<typeof AccordionItem>, "value" | "title"> & {
  title: string | ReactNode;
  value?: string;
  scrollToId?: boolean;
  titleAsCode?: boolean;
}) {
  const { pageMdx } = useMainRzlFumadocs();

  return (
    <AccordionItem
      ref={ref}
      value={value}
      className={cn(className)}
      {...props}
    >
      <AccordionHeader
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
            ),
          "relative",
          "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-(--color-fd-border)",
          "after:scale-x-0 after:origin-left",
          "after:transition-transform after:duration-250",
          "data-[state=open]:after:scale-x-100"
        )}
      >
        <AccordionTrigger
          className={cn(
            "group flex flex-1 items-center gap-2 px-3 py-3.25 text-start focus-visible:outline-none"
          )}
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
              if (first && first.endsWith("s")) return parseFloat(first) * 1000;
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
          {/* <ChevronRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" /> */}
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
          {/* {title} */}
        </AccordionTrigger>
        {id ? <CopyButton id={id} /> : null}
      </AccordionHeader>
      <AccordionContent>
        <div className="px-4 py-2 text-[0.9375rem] prose-no-margin">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function CopyButton({ id }: { id: string }) {
  const [checked, onClick] = useCopyButtonFD({
    onCopy: () => {
      const url = new URL(window.location.href);
      url.hash = id;

      return navigator.clipboard.writeText(url.toString());
    }
  });

  return (
    <Button
      type="button"
      aria-label="Copy Link"
      className={cn(
        buttonVariants({
          variant: "ghost",
          className: "text-fd-muted-foreground me-2"
        })
      )}
      onClick={onClick}
    >
      {checked ? (
        <Check className="size-3.5" />
      ) : (
        <LinkIcon className="size-3.5" />
      )}
    </Button>
  );
}
