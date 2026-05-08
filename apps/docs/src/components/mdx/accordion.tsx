"use client";

import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";

import { mergeRefs } from "@rzl-zone/core-react/utils";
import { useEffectEvent } from "@rzl-zone/core-react/hooks";

import {
  CheckSquare,
  LinkIcon
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { Button } from "@rzl-zone/docs-ui/components/button";
import { Transition } from "@rzl-zone/docs-ui/components/headless-ui-react";

import { delay } from "@rzl-zone/utils-js/promises";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { cn } from "@/lib/cn";
import { copyText } from "@/utils/clipboard/copyText";
import { useCopyButton } from "@/hooks/use-copy-button";
import { useMainRzlFumadocs } from "@/context/main-rzl-fumadocs";

import {
  Accordion as Root,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger
} from "../ui/accordion";

export function Accordions({
  type = "multiple",
  ref,
  className,
  defaultValue,
  ...props
}: Omit<ComponentProps<typeof Root>, "type"> & {
  /**
   * @default "multiple"
   */
  type?: "single" | "multiple";
}) {
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
      {...props}
      type={type}
      ref={composedRef}
      value={value}
      onValueChange={setValue}
      collapsible={type === "single" ? true : undefined}
      className={cn(
        "divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card",
        className
      )}
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
            const content = header.nextElementSibling;
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
  const [checked, onClick] = useCopyButton({
    onCopy: async () => {
      const url = new URL(window.location.href);
      url.hash = id;

      return void (await copyText(url.toString()));
      // return navigator.clipboard.writeText(url.toString());
    }
  });

  return (
    <Button
      type="button"
      aria-label="Copy Link"
      onClick={onClick}
      className={cn(
        buttonVariants({
          variant: "ghost",
          className: "text-fd-muted-foreground me-2"
        })
      )}
    >
      <div className="relative size-3 min-w-3 min-h-3">
        <Transition
          show={!checked}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 scale-75"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-300 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <LinkIcon className="size-3.5" />
            <span className="sr-only">Copy</span>
          </div>
        </Transition>

        <Transition
          show={checked}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 scale-75"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-300 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckSquare className="size-3.5" />
            <span className="sr-only">Copied!</span>
          </div>
        </Transition>
      </div>
    </Button>
  );
}
