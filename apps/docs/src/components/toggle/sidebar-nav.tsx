"use client";

import type { Prettify } from "@rzl-zone/ts-types-plus";
import semver from "semver";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import { LuTags } from "react-icons/lu";
import { GoPackage } from "react-icons/go";
import {
  Check,
  ChevronsUpDown
} from "@rzl-zone/docs-ui/components/icons/lucide";

import { useRouter } from "@rzl-zone/next-kit/progress-bar/app";

import { delay } from "@rzl-zone/utils-js/promises";
import { normalizePathname } from "@rzl-zone/utils-js/urls";
import {
  isArray,
  isNonEmptyString,
  isSet
} from "@rzl-zone/utils-js/predicates";

import { cn } from "@rzl-zone/docs-ui/utils";
import { Button } from "@rzl-zone/docs-ui/components/button";
import { SOURCE_CONFIG } from "@/configs/source/package";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { isTabActive } from "@/utils/fumadocs";
import type { SidebarTab } from "@/utils/fumadocs/types";

export type OptionSideBarNavToggle = Prettify<
  {
    // isPackageSelector?: boolean;
    disableNavIfToPath?: string | string[] | Set<string>;
    props?: ComponentProps<"button">;
  } & SidebarTab
>;

function getDocsSegmentFull(path: string): string | null {
  const clean = path.split(/[?#]/)[0]?.replace(/^\/+|\/+$/g, "");
  const [, rest] = clean?.match(/^docs\/?(.*)$/) || [];
  return rest && rest !== "" ? rest : null;
}

function currentSelectedPackage({
  item,
  typeControl,
  pathname
}: {
  typeControl: "versions" | "packages";
  item?: OptionSideBarNavToggle;
  pathname: string;
}) {
  const value = item?.disableNavIfToPath;
  const map = new Set<string>(
    isNonEmptyString(value)
      ? [value]
      : isArray(value)
        ? value.filter(Boolean)
        : isSet(value)
          ? [...value]
          : []
  );

  const current = getDocsSegmentFull(pathname);
  if (!current) return false;

  for (const key of map) {
    if (key.endsWith("/*")) {
      const prefix = key.slice(0, -2);
      if (!current.startsWith(prefix)) continue;

      const [firstSegment] = current
        .slice(prefix.length)
        .replace(/^\/+/, "")
        .split("/");
      // const MAJOR_X_REGEX = /^\d+\.x$/;
      const MAJOR_X_REGEX = /^v?\d+(?:\.x)?$/;

      if (
        firstSegment &&
        MAJOR_X_REGEX.test(firstSegment) &&
        typeControl === "versions"
      )
        return false;
      if (!semver.valid(firstSegment)) return true;

      return false;
    } else if (key === current) {
      return true;
    }
  }

  return false;
}

export type SidebarNavToggleOptions = Omit<OptionSideBarNavToggle, "props"> & {
  props?: Omit<ComponentProps<"button">, "onClick">;
};

export function SidebarNavToggle({
  options,
  typeControl,
  placeholder = null,
  ...props
}: {
  typeControl: "versions" | "packages";
  placeholder?: ReactNode;
  options: SidebarNavToggleOptions[];
} & ComponentProps<"button">) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const rootDocs = pathname === SOURCE_CONFIG.LOADER.BASE_URL;

  const selected = useMemo(() => {
    return options.findLast((item) => isTabActive(item, pathname));
  }, [options, pathname]);

  const item = selected ? (
    <>
      <div
        className={cn(
          "flex justify-center items-center shrink-0",
          rootDocs
            ? cn(
                "size-6.5 md:size-3.5",
                "[&>svg]:size-3.5 md:[&>svg]:size-3.75"
              )
            : cn("size-7 md:size-5", "[&>svg]:size-4.25 md:[&>svg]:size-3.5")
        )}
      >
        {typeControl === "packages" ? <GoPackage /> : <LuTags />}
      </div>
      <div>
        <div className="text-sm font-medium">{selected?.title}</div>
        <div className="text-xs text-fd-muted-foreground empty:hidden md:hidden">
          {selected?.description}
        </div>
      </div>
    </>
  ) : (
    placeholder
  );

  if (typeControl === "versions" && rootDocs) return null;

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      {item && (
        <PopoverTrigger
          asChild
          {...props}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground",
            "p-0.75 md:py-1.5 md:px-1.5 ",
            props.className
          )}
        >
          <Button>
            {item}
            <ChevronsUpDown className="shrink-0 ms-auto size-4 text-fd-muted-foreground" />
          </Button>
        </PopoverTrigger>
      )}

      <PopoverContent className="flex flex-col gap-1 w-(--radix-popover-trigger-width) overflow-hidden p-1">
        {options.map((item) => {
          const itemUrl = normalizePathname(item.url);
          const selectedUrl = normalizePathname(selected?.url, {
            keepNullable: true
          });

          const isActive = itemUrl === selectedUrl;
          if (!isActive && item.unlisted) return;

          const isSameUrl = itemUrl === pathname;
          const disableNavigationPackage = currentSelectedPackage({
            item,
            pathname,
            typeControl
          });

          return (
            <Button
              key={itemUrl}
              variant={"ghost"}
              tabIndex={-1}
              {...item.props}
              onClick={(e) => {
                e.preventDefault();

                if (isSameUrl || disableNavigationPackage) {
                  setOpen(false);
                  return;
                }

                setOpen(false);

                setTimeout(() => {
                  router.push(itemUrl);
                }, 0);
              }}
              {...(isSameUrl || disableNavigationPackage
                ? { "data-prevent-rzl-progress-bar": true }
                : {})}
              className={cn(
                "select-none",
                "flex items-center gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground",
                item.props?.className
              )}
            >
              <div className="shrink-0 size-9 md:mt-1 md:mb-auto md:size-5 empty:hidden">
                {item.icon}
              </div>
              <div className={cn(!item.description && "py-1.5")}>
                <div
                  className={cn(
                    "text-sm text-start font-medium",
                    !item.icon && "pl-3"
                  )}
                >
                  {item.title}
                </div>
                <div
                  className={cn(
                    "flex items-center text-[.815rem] text-fd-muted-foreground empty:hidden",
                    !item.icon && "pl-3"
                  )}
                >
                  {item.description}
                </div>
              </div>

              <Check
                className={cn(
                  "shrink-0 ms-auto size-5 text-fd-primary",
                  !isActive && "invisible"
                )}
              />
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
