import type { ComponentProps } from "react";

import { I18nLabel } from "fumadocs-ui/contexts/i18n";

import { cn } from "@rzl-zone/docs-ui/utils";
import { Edit } from "@rzl-zone/docs-ui/components/icons/lucide";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";
import type { PageSchemaType } from "@/configs/source/schema";

export function EditOnGitHub(props: ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      {...props}
      className={cn(
        buttonVariants({
          variant: "secondary",
          size: "sm",
          className: "gap-1.5 not-prose"
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

export type SubTitleDocsProps = {
  titlePage: Exclude<PageSchemaType["pageData"], undefined>["title"];
  descriptionPage: Exclude<
    PageSchemaType["pageData"],
    undefined
  >["description"];
};
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
          <DocsDescription className="w-full leading-5 mb-1.5">
            {descriptionPage}
          </DocsDescription>
          <DividerDocsHeader />
        </div>
      )}
    </div>
  );
};

export {
  DocsPage,
  type DocsPageProps,
  type DocsPageSlots,
  PageLastUpdate,
  useDocsPage
} from "./client";
export {
  type BreadcrumbProps,
  Breadcrumb as PageBreadcrumb
} from "./slots/breadcrumb";
export { type FooterProps, Footer as PageFooter } from "./slots/footer";
export {
  MarkdownCopyButton,
  ViewOptionsPopover
} from "../../../components/ai/page-actions";
