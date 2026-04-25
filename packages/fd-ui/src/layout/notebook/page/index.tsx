import type { ComponentProps, ComponentPropsWithRef, ReactNode } from "react";
import type { AnchorProviderProps, TOCItemType } from "fumadocs-core/toc";

import { I18nLabel } from "@fumadocs/base-ui/contexts/i18n";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { cn } from "@rzl-zone/docs-ui/utils";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { Edit } from "@rzl-zone/docs-ui/components/icons/lucide";

import {
  type BreadcrumbProps,
  type FooterProps,
  PageBreadcrumb,
  PageFooter,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverTrigger,
  TocAsideMain,
  TocAsideScrollToTop
} from "./client";
import * as TocClerk from "@/toc/clerk";
import * as TocDefault from "@/toc/default";
import { TOCProvider, TOCScrollArea } from "@/toc";

interface BreadcrumbOptions extends BreadcrumbProps {
  enabled: boolean;
  component: ReactNode;
}

interface FooterOptions extends FooterProps {
  enabled: boolean;
  component: ReactNode;
}

type EditOnGitHubFormattedOptions = Omit<
  ComponentProps<"a">,
  "href" | "children"
> & {
  owner: string;
  repo: string;
  /**
   * SHA or ref (branch or tag) name.
   *
   * @default main
   */
  sha?: string;
  /**
   * File path in the repo
   */
  path: string;
};

export interface DocsPageProps {
  toc?: TOCItemType[];
  tableOfContent?: Partial<TableOfContentOptions>;
  tableOfContentPopover?: Partial<TableOfContentPopoverOptions>;

  /**
   * Extend the page to fill all available space
   *
   * @default false
   */
  full?: boolean;

  /**
   * Replace or disable breadcrumb
   */
  breadcrumb?: Partial<BreadcrumbOptions>;

  // lastUpdate?: Date | string | number;
  // editOnGithub?: EditOnGitHubOptions;

  /**
   * Footer navigation, you can disable it by passing `false`
   */
  footer?: Partial<FooterOptions>;

  children?: ReactNode;

  /**
   * Apply class names to the `#nd-page` container.
   */
  className?: string;
}

export type TableOfContentOptions = Pick<AnchorProviderProps, "single"> & {
  /**
   * Custom content in TOC container, before the main TOC
   */
  header?: ReactNode;

  /**
   * Custom content in TOC container, after the main TOC
   */
  footer?: ReactNode;

  enabled: boolean;
  component: ReactNode;

  /**
   * @default 'clerk'
   */
  style?: "normal" | "clerk";
};

type TableOfContentPopoverOptions = Omit<TableOfContentOptions, "single">;

export function DocsPage({
  breadcrumb: {
    enabled: breadcrumbEnabled = true,
    component: breadcrumb,
    ...breadcrumbProps
  } = {},
  footer = {},
  full = false,
  tableOfContentPopover: {
    enabled: tocPopoverEnabled,
    component: tocPopover,
    ...tocPopoverOptions
  } = {},
  tableOfContent: {
    enabled: tocEnabled,
    component: tocReplace,
    ...tocOptions
  } = {},
  toc = [],
  children,
  className
}: DocsPageProps) {
  // disable TOC on full mode, you can still enable it with `enabled` option.
  tocEnabled ??=
    !full &&
    (toc.length > 0 ||
      tocOptions.footer !== undefined ||
      tocOptions.header !== undefined);

  tocPopoverEnabled ??=
    toc.length > 0 ||
    tocPopoverOptions.header !== undefined ||
    tocPopoverOptions.footer !== undefined;

  let wrapper = (children: ReactNode) => children;

  if (tocEnabled || tocPopoverEnabled) {
    wrapper = (children) => (
      <TOCProvider
        single={tocOptions.single}
        toc={toc}
      >
        {children}
      </TOCProvider>
    );
  }

  return wrapper(
    <>
      {tocPopoverEnabled &&
        (tocPopover ?? (
          <PageTOCPopover>
            <PageTOCPopoverTrigger />
            <PageTOCPopoverContent>
              {tocPopoverOptions.header}
              <TOCScrollArea tocPopover>
                {tocPopoverOptions.style === "normal" ? (
                  <TocDefault.TOCItems tocPopover />
                ) : (
                  <TocClerk.TOCItems tocPopover />
                )}
              </TOCScrollArea>
              {tocPopoverOptions.footer}
            </PageTOCPopoverContent>
          </PageTOCPopover>
        ))}
      <article
        id="nd-page"
        data-full={full}
        // className={cn(
        //   "flex flex-col [grid-area:main] px-4 py-6 gap-4 md:px-6 md:pt-20 xl:px-8 xl:pt-14 *:max-w-225",
        //   full && "*:max-w-321.25"
        // )}
        className={cn(
          "flex flex-col [grid-area:main] px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14 *:max-w-225",
          full && "*:max-w-321.25",
          className
        )}
      >
        {breadcrumbEnabled &&
          (breadcrumb ?? <PageBreadcrumb {...breadcrumbProps} />)}
        {children}
        {footer.enabled !== false &&
          (footer.component ?? <PageFooter items={footer.items} />)}
      </article>
      {tocEnabled &&
        (tocReplace ?? (
          <div
            id="nd-toc"
            className={cn(
              "sticky top-(--fd-docs-row-3) [grid-area:toc] pt-8 pe-4 xl:layout:[--fd-toc-width:268px] max-xl:hidden",
              "h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))]",
              "flex flex-col justify-between"
            )}
          >
            <div className="flex flex-col w-(--fd-toc-width) max-h-[85%]">
              {tocOptions.header}

              <TocAsideMain style={tocOptions.style} />

              {tocOptions.footer}
            </div>

            <div className="bottom-0 my-2 w-full">
              <hr className="my-0.5" />

              <TocAsideScrollToTop />
            </div>
          </div>
        ))}
    </>
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
          variant: "secondary",
          size: "xxs",
          className: "gap-1.5 not-prose text-xs"
        }),
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
export function EditOnGitHubFormatted(props: EditOnGitHubFormattedOptions) {
  return (
    <EditOnGitHub
      {...props}
      href={`https://github.com/${props.owner}/${props.repo}/blob/${
        props.sha
      }/${props.path.startsWith("/") ? props.path.slice(1) : props.path}`}
    />
  );
}

/**
 * Add typography styles
 */
export function DocsBody({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("prose flex-1", className)}
    >
      {children}
    </div>
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

interface SubTitleDocsProps {
  titlePage: string | undefined;
  descriptionPage: string | undefined;
}

const DividerDocsHeader = (props: ComponentPropsWithRef<"div">) => (
  <div
    {...props}
    className={cn(
      "h-0.5 bg-fd-accent-foreground/20 rounded-2xl w-full",
      props.className
    )}
  />
);

export const DocsHeader = ({
  titlePage,
  descriptionPage
}: SubTitleDocsProps) => {
  if (!isNonEmptyString(titlePage) && !isNonEmptyString(descriptionPage)) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-3.5")}>
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
          <DocsDescription className="mb-0 w-full leading-5">
            {descriptionPage}
          </DocsDescription>
          <DividerDocsHeader />
        </div>
      )}
    </div>
  );
};

export { PageLastUpdate, PageBreadcrumb } from "./client";
