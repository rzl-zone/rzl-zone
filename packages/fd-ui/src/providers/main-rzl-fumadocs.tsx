"use client";

import type { z } from "zod";
import type { Prettify } from "@rzl-zone/ts-types-plus";

import { useState, type ReactNode, useEffect, useMemo } from "react";

import { createRequiredContext } from "@rzl-zone/core-react/context";
import { type StandardBehaviorOptions } from "@rzl-zone/docs-ui/utils";

import { Banner } from "@workspace/fd-core/components/banner";
import { docsSchema } from "@workspace/fd-core/configs/source-schema";

import { type FumaNextLinkType } from "@/next-js/link";

export type PageMdxDataType = Prettify<
  z.infer<typeof docsSchema> & {
    docsUnderConstruction?: boolean | string;
  }
>;

type RzlFumadocsContext = {
  link: {
    setPrefetch: (prefetch: FumaNextLinkType["prefetch"]) => void;
  } & Pick<FumaNextLinkType, "prefetch">;
  scrollBehavior: {
    toTop: ScrollToOptions;
    toHash: ScrollToOptions;
    intoView: ScrollIntoViewOptions;
    intoViewFromIfNeed: Omit<StandardBehaviorOptions, "boundary">;
  };
  pageMdx: Prettify<{
    data?:
      | Prettify<
          PageMdxDataType & {
            currentDocsIsOldVersion: boolean;
            currentDocsUnderConstruction: boolean;
          }
        >
      | undefined;
    setPageMdxData: (pageMdxData: PageMdxDataType) => void;
  }>;
  github: {
    url?: string | null;
    setGithubUrl: (url?: string | null) => void;
  };
};

const RzlFumadocsContext = createRequiredContext<
  RzlFumadocsContext | undefined
>("RzlFumadocsContext");

type MainRzlFumadocsProviderProps = {
  children: ReactNode;
  scrollBehavior?: {
    /**
     * @default
     * {
     *    behavior: "auto",
     *    top: 0,
     *    left: undefined
     * } */
    toTop?: ScrollToOptions;
    /**
     * @default
     * {
     *    behavior: "auto",
     *    top: 0,
     *    left: undefined
     * } */
    toHash?: ScrollToOptions;
    /**
     * @default
     * {
     *    behavior: "auto",
     *    block: "start",
     *    inline: undefined
     * } */
    intoView?: ScrollIntoViewOptions;
    /**
     * @default
     * {
     *    behavior: "instant",
     *    block: "start",
     *    inline: "start",
     *    scrollMode: "if-needed"
     * } */
    intoViewFromIfNeed?: Omit<StandardBehaviorOptions, "boundary">;
  };
  /**
   * @default false
   */
  defaultPrefetch?: FumaNextLinkType["prefetch"];
};

const defaultScroll: Required<MainRzlFumadocsProviderProps["scrollBehavior"]> =
  {
    toTop: {
      behavior: "auto",
      top: 0,
      left: undefined
    },
    toHash: {
      behavior: "auto",
      top: 0,
      left: undefined
    },
    intoView: {
      behavior: "auto",
      block: "start",
      inline: undefined
    },
    intoViewFromIfNeed: {
      behavior: "instant",
      block: "start",
      inline: "start",
      scrollMode: "if-needed"
    }
  };

export const MainRzlFumadocsProvider = ({
  children,
  defaultPrefetch = false,
  scrollBehavior
}: MainRzlFumadocsProviderProps) => {
  const [prefetch, setPrefetch] =
    useState<FumaNextLinkType["prefetch"]>(defaultPrefetch);
  const [githubUrl, setGithubUrl] = useState<string | undefined | null>(
    undefined
  );
  const [pageMdxData, setPageMdxData] = useState<PageMdxDataType | undefined>();
  const {
    toTop = defaultScroll.toTop,
    toHash = defaultScroll.toHash,
    intoView = defaultScroll.intoView,
    intoViewFromIfNeed = defaultScroll.intoViewFromIfNeed
  } = scrollBehavior || defaultScroll;

  useEffect(() => {
    const handlePseudoElementError = (event: ErrorEvent) => {
      if (event.message?.includes("nodeType")) {
        event.preventDefault();
        console.warn(
          "[SafeGuard] Ignored harmless 'nodeType' access error from pseudo-element click."
        );
      }
    };

    window.addEventListener("error", handlePseudoElementError);
    return () => window.removeEventListener("error", handlePseudoElementError);
  }, []);

  const pageMdx = useMemo(
    () => ({
      data: pageMdxData,
      setPageMdxData
    }),
    [pageMdxData]
  );

  const valueContext = useMemo(() => {
    return {
      scrollBehavior: {
        toTop,
        toHash,
        intoView,
        intoViewFromIfNeed
      },
      link: {
        prefetch,
        setPrefetch
      },
      pageMdx: {
        data: pageMdx.data
          ? {
              ...pageMdx.data,
              currentDocsUnderConstruction:
                !!pageMdx.data.docsUnderConstruction,
              currentDocsIsOldVersion:
                !!pageMdx.data.packageMeta?.version &&
                pageMdx.data.packageMeta.version !== "latest"
            }
          : undefined,
        setPageMdxData: pageMdx.setPageMdxData
      },
      github: {
        url: githubUrl,
        setGithubUrl
      }
    } satisfies RzlFumadocsContext;
  }, [
    toTop,
    toHash,
    intoView,
    intoViewFromIfNeed,
    prefetch,
    githubUrl,
    pageMdx
  ]);

  return (
    <RzlFumadocsContext.Provider value={valueContext}>
      {!!pageMdx.data?.docsUnderConstruction && (
        <>
          <Banner
            variant="rainbow"
            className="flex flex-col justify-center items-center gap-0"
          >
            <div className="font-bold text-black dark:text-fd-foreground">
              Full documentation
              {typeof pageMdx.data.docsUnderConstruction === "string"
                ? ` ${pageMdx.data.docsUnderConstruction} `
                : ""}
              is currently under construction.
            </div>
          </Banner>
        </>
      )}
      {pageMdx.data?.packageMeta &&
        pageMdx.data.packageMeta.version &&
        pageMdx.data.packageMeta.version !== "latest" && (
          <Banner variant="rainbow">
            <span className="font-semibold text-black dark:text-fd-foreground">
              You are currently viewing documentation for{" "}
              <span className="underline font-semibold">
                Version{" "}
                {pageMdx.data.packageMeta.version.split("v")[1] ||
                  pageMdx.data.packageMeta.version}
              </span>{" "}
              of {pageMdx.data.packageMeta.name}.
            </span>
          </Banner>
        )}
      {children}
    </RzlFumadocsContext.Provider>
  );
};

export const useMainRzlFumadocs = () => RzlFumadocsContext.use();
