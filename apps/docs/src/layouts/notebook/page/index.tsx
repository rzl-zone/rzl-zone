"use client";

import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useEffect,
  useState
} from "react";

import type { TOCItemType } from "fumadocs-core/toc";
import { I18nLabel, useI18n } from "fumadocs-ui/contexts/i18n";

import { useEffectEvent } from "@rzl-zone/core-react/hooks";
import { createRequiredContext } from "@rzl-zone/core-react/context";
import { Edit } from "@rzl-zone/docs-ui/components/icons/lucide";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { cn } from "@/lib/cn";
import { gitConfig } from "@/lib/layout.shared";
import type { PageSchemaType } from "@/configs/source/schema";

import {
  MarkdownCopyButton,
  SharePopover,
  ViewOptionsPopover
} from "@/components/ai/page-actions";
import { buttonVariants } from "@/components/ui/button";

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

export interface DocsPageProps extends ComponentProps<"article"> {
  toc?: TOCItemType[];
  /**
   * Extend the page to fill all available space
   *
   * @defaultValue false
   */
  full?: boolean;
  slots?: Partial<DocsPageSlots>;

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

type TableOfContentOptions = Pick<TOCProviderProps, "single"> &
  TOCProps & {
    enabled?: boolean;
    /**
     * @deprecated use `slots.toc` instead.
     */
    component?: ReactNode;
  };

type TableOfContentPopoverOptions = TOCPopoverProps & {
  enabled?: boolean;
  /**
   * @deprecated use `slots.tocPopover` instead.
   */
  component?: ReactNode;
};

interface DocsPageSlots {
  toc: {
    provider: FC<TOCProviderProps>;
    main: FC<TOCProps>;
    popover: FC<TOCPopoverProps>;
  };
  container: FC<ComponentProps<"article">>;
  footer: FC<FooterProps>;
  breadcrumb: FC<BreadcrumbProps>;
}

type PageSlotsProps = Pick<DocsPageProps, "full">;

const PageContext = createRequiredContext<{
  props: PageSlotsProps;
  slots: DocsPageSlots;
}>("PageContext");

export function useDocsPage() {
  return PageContext.useSuspense(
    "Please use page components under <DocsPage /> (`@/layouts/notebook/page`)."
  );
}

export function DocsPage({
  tableOfContent: { enabled: tocEnabled, single, ...tocProps } = {},
  tableOfContentPopover: {
    enabled: tocPopoverEnabled,
    ...tocPopoverProps
  } = {},
  breadcrumb: { enabled: breadcrumbEnabled = true, ...breadcrumb } = {},
  footer: { enabled: footerEnabled = true, ...footer } = {},
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
    breadcrumb: defaultSlots.breadcrumb ?? Breadcrumb,
    footer: defaultSlots.footer ?? Footer,
    toc: defaultSlots.toc ?? {
      provider: TOCProvider,
      main: TOC,
      popover: TOCPopover
    },
    container: defaultSlots.container ?? Container
  };

  return (
    <PageContext.Provider
      value={{
        props: { full },
        slots
      }}
    >
      <slots.toc.provider
        single={single}
        toc={tocEnabled || tocPopoverEnabled ? toc : []}
      >
        {tocPopoverEnabled &&
          (tocPopoverProps.component ?? (
            <slots.toc.popover {...tocPopoverProps} />
          ))}
        <slots.container {...containerProps}>
          {breadcrumbEnabled &&
            (breadcrumb.component ?? <slots.breadcrumb {...breadcrumb} />)}
          {children}
          {footerEnabled && (footer.component ?? <slots.footer {...footer} />)}
        </slots.container>
        {tocEnabled && (tocProps.component ?? <slots.toc.main {...tocProps} />)}
      </slots.toc.provider>
    </PageContext.Provider>
  );
}

export function EditOnGitHub(props: ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      {...props}
      className={cn(
        buttonVariants({
          color: "secondary",
          size: "sm"
        }),
        "gap-1.5 not-prose",
        props.className
      )}
    >
      {props.children ?? (
        <>
          <Edit className="size-3.5" />
          <I18nLabel label="editOnGithub" />
        </>
      )}
    </a>
  );
}

/**
 * Add typography styles
 */
export function DocsBody({
  children,
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn("prose flex-1", className)}
    >
      {children}
    </section>
  );
}

export function DocsDescription({
  children,
  className,
  ...props
}: ComponentProps<"p">) {
  // Don't render if no description provided
  if (children === undefined) return null;

  return (
    <p
      {...props}
      className={cn("mb-8 text-lg text-fd-muted-foreground", className)}
    >
      {children}
    </p>
  );
}

export function DocsTitle({
  children,
  className,
  ...props
}: ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={cn("text-[1.75em] font-semibold", className)}
    >
      {children}
    </h1>
  );
}

export const DividerDocsHeader = (
  props: React.ComponentPropsWithRef<"div">
) => (
  <div
    {...props}
    className={cn(
      "h-0.5 bg-fd-accent-foreground/20 rounded-2xl w-full",
      props.className
    )}
  />
);

type TitlePage = Exclude<PageSchemaType["pageData"], undefined>["title"];
type DecsPage = Exclude<PageSchemaType["pageData"], undefined>["description"];

export type SubTitleDocsProps = {
  titlePage: TitlePage;
  descriptionPage: DecsPage;
};

export const DocsHeader = ({
  titlePage,
  descriptionPage
}: SubTitleDocsProps) => {
  if (!isNonEmptyString(titlePage) && !isNonEmptyString(descriptionPage)) {
    return null;
  }

  return (
    <header className={cn("flex flex-col gap-3.5")}>
      {isNonEmptyString(titlePage) && (
        <div className="flex flex-col items-center w-full gap-1">
          <DocsTitle className="text-3xl w-full leading-6.5">
            {titlePage}
          </DocsTitle>
          {!isNonEmptyString(descriptionPage) && (
            <DividerDocsHeader className="mt-1" />
          )}
        </div>
      )}

      {isNonEmptyString(descriptionPage) && (
        <div className="flex flex-col items-center w-full gap-1">
          <DocsDescription className="w-full leading-5 mb-1.5">
            {descriptionPage}
          </DocsDescription>
          <DividerDocsHeader />
        </div>
      )}
    </header>
  );
};

export type DocsActionProps = {
  pagePath: string;
  pageUrl: string;
  isMainRootPage?: boolean;
};

export const DocsAction = ({
  isMainRootPage,
  pagePath,
  pageUrl
}: DocsActionProps) => {
  return (
    <section aria-label="Actions">
      <div className="flex flex-row gap-0 items-center mb-2">
        <MarkdownCopyButton
          markdownUrl={`${pageUrl}.mdx`}
          className="rounded-l-md! rounded-r-none! min-h-8.5"
        />
        <ViewOptionsPopover
          className="rounded-r-md! rounded-l-none! min-w-8 min-h-8.5 border-l-0!"
          markdownUrl={`${pageUrl}.mdx`}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/apps/docs/content/docs/${pagePath}`}
        />

        <div className="ml-auto">
          <SharePopover className="min-h-8.5" />
        </div>
      </div>

      {!isMainRootPage && <DividerDocsHeader className="opacity-75" />}
    </section>
  );
};

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

export {
  type BreadcrumbProps,
  Breadcrumb as PageBreadcrumb
} from "./slots/breadcrumb";
export { type FooterProps, Footer as PageFooter } from "./slots/footer";
export { MarkdownCopyButton, SharePopover, ViewOptionsPopover };
