"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@fumadocs/base-ui/components/ui/collapsible";
import { Link } from "fumadocs-core/framework";

import { normalizeSpaces } from "@rzl-zone/utils-js/strings";
import {
  isNil,
  isNonEmptyString,
  isString
} from "@rzl-zone/utils-js/predicates";

import { type TypeNode } from ".";

import { cn, cva } from "@rzl-zone/docs-ui/utils";
import { ChevronDown } from "@rzl-zone/docs-ui/components/icons/lucide";
import {
  IconIsNonOptional,
  IconIsOptional
} from "@rzl-zone/docs-ui/components/icons/lucide";

const fieldVariants = cva("text-fd-muted-foreground not-prose pe-2");

const keyVariants = cva("text-fd-primary", {
  variants: {
    deprecated: {
      true: "line-through text-fd-primary/50"
    }
  }
});

export function ItemTypeTableClient({
  name,
  item,
  open,
  onOpenChange
}: {
  name: string;
  item: TypeNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    parameters = [],
    description,
    required = false,
    deprecated,
    typeDescription,
    default: defaultValue,
    type,
    typeDescriptionLink,
    returns
  } = item;
  // const [open, setOpen] = useState(false);
  // console.debug({ item, asd: item.description });

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className={cn(
        "rounded-xl border overflow-hidden transition-all",
        open
          ? "shadow-sm bg-fd-background not-last:mb-2"
          : "border-transparent not-last:mb-0.5"
      )}
    >
      <CollapsibleTrigger
        className={cn(
          "relative flex flex-row items-center w-full group text-start px-3 py-2 not-prose hover:bg-fd-accent",
          // "bg-fd-muted dark:bg-fd-foreground/10",
          "bg-fd-secondary"
        )}
      >
        <code
          className={cn(
            keyVariants({
              deprecated,
              className: "min-w-fit w-[25%] font-medium"
            })
          )}
        >
          {name}
          {!required && "?"}
        </code>
        {isNonEmptyString(typeDescriptionLink) ? (
          <Link
            href={typeDescriptionLink}
            className="underline @max-xl:hidden"
          >
            {type}
          </Link>
        ) : (
          <span className="@max-xl:hidden">{type}</span>
        )}
        <ChevronDown className="absolute end-2 size-4 text-fd-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent
        className="bg-fd-card/70"
        // className="bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)"
        // style={
        //   {
        //     "--shiki-light": "#0e1116",
        //     "--shiki-dark": "#D5CED9",
        //     "--shiki-light-bg": "#ffffff",
        //     "--shiki-dark-bg": "#23262E"
        //   } as React.CSSProperties
        // }
      >
        <div className="grid grid-cols-[1fr_3fr] gap-y-4 text-sm p-3 overflow-auto fd-scroll-container border-t">
          <div className="text-sm prose text-fd-accent-foreground/80 col-span-full prose-no-margin empty:hidden">
            {description}
          </div>
          <>
            <p className={cn(fieldVariants())}>Required</p>
            <p className={cn("my-auto not-prose")}>
              {required ? <IconIsOptional /> : <IconIsNonOptional />}
            </p>
          </>
          {typeDescription && (
            <>
              <p className={cn(fieldVariants())}>Type</p>
              <p className="my-auto not-prose">{typeDescription}</p>
            </>
          )}
          {defaultValue && (
            <>
              <p className={cn(fieldVariants())}>Default</p>
              <p className={cn("my-auto not-prose")}>
                {isString(defaultValue)
                  ? normalizeSpaces(defaultValue)
                  : defaultValue}
              </p>
            </>
          )}
          {parameters.length > 0 && (
            <>
              <p className={cn(fieldVariants())}>Parameters</p>
              <div className="flex flex-col gap-2">
                {parameters.map(
                  (param) =>
                    !isNil(param.name) && (
                      <div
                        key={param.name}
                        className="flex flex-col flex-wrap gap-0.5"
                      >
                        <p className="font-medium not-prose text-nowrap">
                          {param.name}
                        </p>
                        {!isNil(param.description) && (
                          <div className="text-sm prose text-fd-muted-foreground col-span-full prose-no-margin empty:hidden">
                            {param.description}
                          </div>
                          // <div className="text-sm prose prose-no-margin">
                          //   {param.description}
                          // </div>
                        )}
                      </div>
                    )
                )}
              </div>
            </>
          )}
          {returns && (
            <>
              <p className={cn(fieldVariants())}>Returns</p>
              <div className="my-auto text-sm prose prose-no-margin">
                {returns}
              </div>
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
