"use client";

import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useEffect,
  useState
} from "react";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import type { TOCItemType } from "fumadocs-core/toc";

import { cn } from "@rzl-zone/docs-ui/utils";

import {
  TOC,
  TOCPopover,
  TOCProvider,
  type TOCProviderProps,
  type TOCPopoverProps,
  type TOCProps
} from "./slots/toc";
import { Container } from "./slots/container";
import { Footer, type FooterProps } from "./slots/footer";
import { Breadcrumb, type BreadcrumbProps } from "./slots/breadcrumb";
import { useEffectEvent } from "@rzl-zone/core-react/hooks";
import { createRequiredContext } from "@rzl-zone/core-react/context";

export interface DocsPageSlots {
  toc?: {
    provider: FC<TOCProviderProps>;
    main?: FC<TOCProps>;
    popover?: FC<TOCPopoverProps>;
  };
  container?: FC<ComponentProps<"article">>;
  footer?: FC<FooterProps>;
  breadcrumb?: FC<BreadcrumbProps>;
}

export interface DocsPageProps extends ComponentProps<"article"> {
  toc?: TOCItemType[];
  /**
   * Extend the page to fill all available space
   *
   * @defaultValue false
   */
  full?: boolean;
  slots?: DocsPageSlots;

  footer?: FooterOptions;
  breadcrumb?: BreadcrumbOptions;
  tableOfContent?: TableOfContentOptions;
  tableOfContentPopover?: TableOfContentPopoverOptions;
}

interface BreadcrumbOptions extends BreadcrumbProps {
  enabled?: boolean;
  /**
   * @deprecated use `slots.breadcrumb` instead.
   */
  component?: ReactNode;
}

interface FooterOptions extends FooterProps {
  enabled?: boolean;
  /**
   * @deprecated use `slots.footer` instead.
   */
  component?: ReactNode;
}

interface TableOfContentOptions
  extends Pick<TOCProviderProps, "single">, TOCProps {
  enabled?: boolean;
  /**
   * @deprecated use `slots.toc` instead.
   */
  component?: ReactNode;
}

interface TableOfContentPopoverOptions extends TOCPopoverProps {
  enabled?: boolean;
  /**
   * @deprecated use `slots.tocPopover` instead.
   */
  component?: ReactNode;
}

interface PageSlotsProps extends Pick<
  DocsPageProps,
  "full" | "breadcrumb" | "footer"
> {
  tableOfContent: TOCProps & { component?: ReactNode };
  tableOfContentPopover: TOCPopoverProps & { component?: ReactNode };
}

const PageContext = createRequiredContext<{
  props: PageSlotsProps;
  slots: DocsPageSlots;
}>("PageContext");

export function useDocsPage() {
  const context = PageContext.use(
    "Please use page components under <DocsPage /> (`@/layouts/notebook/page`)."
  );
  return context;
}

export function DocsPage({
  tableOfContent: { enabled: tocEnabled, single, ...tocProps } = {},
  tableOfContentPopover: {
    enabled: tocPopoverEnabled,
    ...tocPopoverProps
  } = {},
  footer = {},
  breadcrumb = {},
  full = false,
  toc = [],
  slots: defaultSlots = {},
  children,
  ...containerProps
}: DocsPageProps) {
  tocEnabled ??= Boolean(
    !full && (toc.length > 0 || tocProps.footer || tocProps.header)
  );
  tocPopoverEnabled ??= Boolean(
    toc.length > 0 || tocPopoverProps.header || tocPopoverProps.footer
  );

  const slots: DocsPageSlots = {
    breadcrumb:
      breadcrumb.enabled !== false
        ? (defaultSlots.breadcrumb ?? InlineBreadcrumb)
        : undefined,
    footer:
      footer.enabled !== false
        ? (defaultSlots.footer ?? InlineFooter)
        : undefined,
    toc: defaultSlots.toc ?? {
      provider: TOCProvider,
      main: tocEnabled ? InlineTOC : undefined,
      popover: tocPopoverEnabled ? InlineTOCPopover : undefined
    },
    container: defaultSlots.container ?? Container
  };

  let content = (
    <>
      {slots.toc?.popover && <slots.toc.popover />}
      {slots.container && (
        <slots.container {...containerProps}>
          {slots.breadcrumb && <slots.breadcrumb />}
          {children}
          {slots.footer && <slots.footer />}
        </slots.container>
      )}
      {slots.toc?.main && <slots.toc.main />}
    </>
  );

  if (slots.toc)
    content = (
      <slots.toc.provider
        single={single}
        toc={tocEnabled || tocPopoverEnabled ? toc : []}
      >
        {content}
      </slots.toc.provider>
    );

  return (
    <PageContext.Provider
      value={{
        props: {
          full,
          tableOfContent: tocProps,
          tableOfContentPopover: tocPopoverProps,
          footer,
          breadcrumb
        },
        slots
      }}
    >
      {content}
    </PageContext.Provider>
  );
}

function InlineBreadcrumb(props: BreadcrumbProps) {
  const {
    component,
    enabled: _,
    ...rest
  } = useDocsPage().props.breadcrumb ?? {};
  if (component) return component;
  return (
    <Breadcrumb
      {...props}
      {...rest}
    />
  );
}

function InlineFooter(props: FooterProps) {
  const { component, enabled: _, ...rest } = useDocsPage().props.footer ?? {};
  if (component) return component;
  return (
    <Footer
      {...props}
      {...rest}
    />
  );
}

function InlineTOCPopover(props: TOCPopoverProps) {
  const { tableOfContentPopover } = useDocsPage().props;
  if (tableOfContentPopover.component) return tableOfContentPopover.component;
  return (
    <TOCPopover
      {...props}
      {...tableOfContentPopover}
    />
  );
}

function InlineTOC(props: TOCProps) {
  const { tableOfContent } = useDocsPage().props;
  if (tableOfContent.component) return tableOfContent.component;
  return (
    <TOC
      {...props}
      {...tableOfContent}
    />
  );
}

export function PageLastUpdate({
  date: value,
  ...props
}: Omit<ComponentProps<"p">, "children"> & {
  date: Date | string | number | undefined;
}) {
  const { text } = useI18n();
  const [date, setDate] = useState<string | null>(null);

  const formattedDate = useEffectEvent((formatted: string) =>
    setDate(formatted)
  );

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      const formatted = date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      formattedDate(formatted);
    }
  }, [value]);

  return (
    <div
      {...props}
      className={cn(
        "flex justify-center gap-1 items-center text-sm text-fd-muted-foreground",
        props.className
      )}
    >
      <span>{text.lastUpdate}</span>
      {!date ? (
        <span className="h-4 w-22 rounded-xs animate-pulse bg-fd-accent dark:bg-fd-secondary inline-block" />
      ) : (
        date
      )}
    </div>
  );
}
