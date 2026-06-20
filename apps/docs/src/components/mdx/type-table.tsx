"use client";

import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";

import Link from "fumadocs-core/link";

import { cva } from "@rzl-zone/docs-ui/utils";
import {
  ChevronDown,
  IconIsNonOptional,
  IconIsOptional
} from "@rzl-zone/docs-ui/components/icons/lucide";
import {
  isNil,
  isNonEmptyString,
  isString
} from "@rzl-zone/utils-js/predicates";
import { normalizeSpaces } from "@rzl-zone/utils-js/strings";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

import { cn } from "@/lib/cn";

export interface ParameterNode {
  name: string;
  description: ReactNode;
}

export interface TypeNode {
  /**
   * Additional description of the field
   */
  description?: ReactNode;

  /**
   * type signature (short)
   */
  type: ReactNode;

  /**
   * type signature (full)
   */
  typeDescription?: ReactNode;

  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string;

  default?: ReactNode;

  required?: boolean;
  deprecated?: boolean;

  /**
   * a list of parameters info if the type is a function.
   */
  parameters?: ParameterNode[];

  returns?: ReactNode;
}

const fieldVariants = cva("text-fd-muted-foreground not-prose pe-2");

export type TypeTableMainOptions = {
  /**
   * @default "Prop"
   */
  textParam?: string;
  /**
   * @default "Type"
   */
  textType?: string;

  /** Determines whether multiple items can be open at the same time.
   *
   * - If `true` (default): multiple sections can be expanded simultaneously.
   * - If `false`: only one section stays open at a time.
   *
   * @default true
   */
  allowMultiple?: boolean;

  /**
   * @default false
   */
  updateHashInHistory?: boolean;
};

export function TypeTable({
  id,
  type,
  className,
  textParam = "Prop",
  textType = "Type",
  allowMultiple = true,
  updateHashInHistory = false,
  hashUrl,
  ...props
}: {
  type: Record<string, TypeNode>;
  hashUrl?: string;
} & ComponentProps<"div"> &
  TypeTableMainOptions) {
  /** Tracks which item keys are currently open. */
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  /** Handles when an item's open state changes.
   *
   * @param key - The unique key of the item.
   * @param isOpen - Whether the item is being opened or closed.
   */
  const handleOpenChange = useCallback((key: string, isOpen: boolean) => {
    setOpenKeys((prev) => {
      if (allowMultiple) {
        if (isOpen && prev.includes(key)) return prev;
        if (!isOpen && !prev.includes(key)) return prev;

        return isOpen ? [...prev, key] : prev.filter((k) => k !== key);
      }

      if (isOpen && prev[0] === key) return prev;
      if (!isOpen && prev.length === 0) return prev;

      return isOpen ? [key] : [];
    });
  }, []);

  useEffect(() => {
    if (!id || !updateHashInHistory) return;

    const hash = window.location.hash;
    if (!hash) return;

    const clean = hash.replace("#", "");

    const match = Object.keys(type).find((key) => `${id}-${key}` === clean);

    if (match) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenKeys((prev) => (prev[0] === match ? prev : [match]));
    }
  }, [id, type]);

  // useEffect(() => {
  //   if (!id || !updateHashInHistory) return;

  //   const active = openKeys[0];
  //   if (!active) return;

  //   const newHash = `${id}-${active}`;

  //   if (window.location.hash === `#${newHash}`) return;

  //   window.history.pushState(null, "", `#${newHash}`);
  // }, [openKeys, id]);

  return (
    <div
      id={id}
      className={cn(
        "@container flex flex-col p-1 bg-fd-card text-fd-card-foreground rounded-2xl border my-6 text-sm overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="flex font-medium items-center px-3 py-1 not-prose text-fd-muted-foreground">
        <p className="w-1/4">{textParam}</p>
        <p className="@max-xl:hidden">{textType}</p>
      </div>

      {Object.entries(type).map(([key, value]) => (
        <Item
          allowMultiple={allowMultiple}
          key={key}
          keyElement={key}
          parentId={id}
          name={key}
          item={value}
          hashUrl={hashUrl}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          updateHashInHistory={updateHashInHistory}
        />
      ))}
    </div>
  );
}

function Item({
  keyElement,
  // parentId,
  name,
  allowMultiple = false,
  item,
  onOpenChange,
  openKeys,
  updateHashInHistory = false,
  hashUrl
}: {
  keyElement: string;
  parentId?: string;
  name: string;
  item: TypeNode;
  /** Determines whether multiple items can be open at the same time.
   *
   * - If `true`: multiple sections can be expanded simultaneously.
   * - If `false`: only one section stays open at a time (default).
   *
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * @default false
   */
  updateHashInHistory?: boolean;

  openKeys: string[];
  onOpenChange: (key: string, isOpen: boolean) => void;

  hashUrl?: string;
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

  const idHashUrl = isNonEmptyString(hashUrl)
    ? `${hashUrl}-${name}`
    : undefined;

  const handleChange = useCallback(
    (isOpen: boolean) => {
      onOpenChange(keyElement, isOpen);

      if (isOpen && !!idHashUrl && updateHashInHistory) {
        const newHash = `#${idHashUrl}`;
        if (window.location.hash === newHash) return;
        window.history.pushState(null, "", newHash);
      }
    },
    [keyElement, idHashUrl]
  );

  return (
    <Collapsible
      id={idHashUrl}
      open={
        allowMultiple
          ? openKeys.includes(keyElement)
          : openKeys[0] === keyElement
      }
      onOpenChange={handleChange}
      className={cn(
        "rounded-xl border overflow-hidden transition-all",
        openKeys.includes(keyElement)
          ? "shadow-sm bg-fd-background not-last:mb-2"
          : "border-transparent not-last:mb-0.5",
        "scroll-m-37 xl:scroll-m-26"
      )}
      onClick={() => {}}
    >
      <CollapsibleTrigger
        className={cn(
          "relative flex flex-row items-center w-full group text-start px-3 py-2 not-prose hover:bg-fd-accent dark:hover:bg-fd-accent/75",
          "bg-fd-secondary"
        )}
      >
        <code
          className={cn(
            "text-fd-primary min-w-fit w-1/4 font-mono font-medium pe-2",
            deprecated && "line-through text-fd-primary/50"
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
        <ChevronDown className="absolute inset-e-2 size-4 text-fd-muted-foreground transition-transform group-data-open:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-[1fr_3fr] gap-y-4 text-sm p-3 overflow-auto fd-scroll-container border-t">
          <div className="text-sm prose col-span-full prose-no-margin empty:hidden">
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
                        className="inline-flex items-center flex-wrap gap-1"
                      >
                        <p className="font-medium not-prose text-nowrap">
                          {param.name} -
                        </p>
                        {!isNil(param.description) && (
                          <div className="text-sm prose prose-no-margin">
                            {param.description}
                          </div>
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
