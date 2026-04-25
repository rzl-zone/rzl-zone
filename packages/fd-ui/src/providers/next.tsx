"use client";

import { type FC, type ReactNode } from "react";

import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FrameworkProvider, type Framework } from "fumadocs-core/framework";

import { FumaNextLink, type FumaNextLinkType } from "@/next-js/link";

import {
  RootProvider as BaseProvider,
  type RootProviderProps as BaseRootProviderProps
} from "@/providers/base";

type NextProviderProps = {
  children: ReactNode;
  /**
   * @default FumaNextLink `from custom-fumadocs`
   */
  Link?: FC<FumaNextLinkType> | Framework["Link"];
  /**
   * @default Image `from next/image`
   */
  Image?: Framework["Image"];
};

export function NextProvider({
  children,
  Link: CustomLink = FumaNextLink,
  Image: CustomImage = Image as Framework["Image"]
}: NextProviderProps) {
  return (
    <FrameworkProvider
      usePathname={usePathname}
      useRouter={useRouter}
      useParams={useParams}
      Link={CustomLink as Framework["Link"]}
      Image={CustomImage as Framework["Image"]}
    >
      {children}
    </FrameworkProvider>
  );
}

export interface RootProviderProps<
  EnabledSystem extends boolean
> extends BaseRootProviderProps<EnabledSystem> {
  /**
   * Custom framework components to override Next.js defaults
   */
  components?: Pick<NextProviderProps, "Link" | "Image">;
}

export function RootProvider<EnabledSystem extends boolean = true>({
  components,
  children,
  ...props
}: RootProviderProps<EnabledSystem>) {
  return (
    <NextProvider
      Link={components?.Link}
      Image={components?.Image}
    >
      <BaseProvider<EnabledSystem> {...props}>{children}</BaseProvider>
    </NextProvider>
  );
}
