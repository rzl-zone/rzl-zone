"use client";

import type { Prettify } from "@rzl-zone/ts-types-plus";
import type { CustomNextLinkType } from "@/components/link";
import type { PageSchemaType } from "@/configs/source/schema";

import { useState, type ReactNode, useEffect, useMemo, useRef } from "react";

import { usePathname } from "next/navigation";

import { createRequiredContext } from "@rzl-zone/core-react/context";
import { type StandardBehaviorOptions } from "@rzl-zone/docs-ui/utils";

import { Banner } from "@/components/ui/banner";
import { SOURCE_CONFIG } from "@/configs/source/package";
import { useDevtoolsNodeTypeGuard } from "@/hooks/use-devtools-node-type-guard";
import { useScrollTopOnRouteChange } from "@/hooks/use-scroll-top-on-route-change";

export type PageMdxDataType = Prettify<
  PageSchemaType & {
    docsUnderConstruction?: boolean | string;
  }
>;

type RzlFumadocsContext = {
  link: {
    setPrefetch: (prefetch: CustomNextLinkType["prefetch"]) => void;
  } & Pick<CustomNextLinkType, "prefetch">;
  scrollBehavior: {
    toTop: ScrollToOptions;
    toHash: ScrollToOptions;
    intoView: ScrollIntoViewOptions;
    intoViewFromIfNeed: Omit<StandardBehaviorOptions, "boundary">;
  };
  bodyScroll: {
    isDisable: boolean;
    setDisableBodyScroll: (pageMdxData: boolean) => void;
  };
  pageMdx: Prettify<{
    data: Prettify<
      PageMdxDataType & {
        currentDocsIsOldVersion: boolean;
        currentDocsUnderConstruction: boolean;
      }
    > | null;
    setPageMdxData: (pageMdxData: PageMdxDataType | null) => void;
  }>;

  github: {
    url?: string | null;
    setGithubUrl: (url?: string | null) => void;
  };
};

const RzlFumadocsContext =
  createRequiredContext<RzlFumadocsContext>("RzlFumadocsContext");

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
  defaultPrefetch?: CustomNextLinkType["prefetch"];
  /**
   * @default false
   */
  defaultDisableBodyScroll?: boolean;
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
  defaultDisableBodyScroll = false,
  scrollBehavior
}: MainRzlFumadocsProviderProps) => {
  useDevtoolsNodeTypeGuard();
  useScrollTopOnRouteChange();

  const [prefetch, setPrefetch] =
    useState<CustomNextLinkType["prefetch"]>(defaultPrefetch);
  const [githubUrl, setGithubUrl] = useState<string | undefined | null>(
    undefined
  );
  const [pageMdxData, setPageMdxData] = useState<PageMdxDataType | null>(null);
  const [disableBodyScroll, setDisableBodyScroll] = useState<boolean>(
    defaultDisableBodyScroll
  );
  const {
    toTop = defaultScroll.toTop,
    toHash = defaultScroll.toHash,
    intoView = defaultScroll.intoView,
    intoViewFromIfNeed = defaultScroll.intoViewFromIfNeed
  } = scrollBehavior || defaultScroll;

  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!disableBodyScroll) {
      styleRef.current?.remove();
      styleRef.current = null;

      return;
    }

    const existingStyle = document.querySelector<HTMLStyleElement>(
      // eslint-disable-next-line quotes
      'style[data-scroll-lock="true"]'
    );

    if (existingStyle) {
      styleRef.current = existingStyle;

      return;
    }

    const styleEl = document.createElement("style");

    styleEl.setAttribute("data-scroll-lock", "true");

    styleEl.innerHTML = `
      body {
        overflow: hidden !important;
        overscroll-behavior: contain;
        position: relative !important;
        margin: 0 !important;
        padding-top: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-top: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    `
      .replace(/\s\s+/g, "")
      .trim();

    document.head.appendChild(styleEl);

    styleRef.current = styleEl;

    return () => {
      styleRef.current?.remove();
      styleRef.current = null;
    };
  }, [disableBodyScroll]);

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
          : null,
        setPageMdxData: pageMdx.setPageMdxData
      },
      github: {
        url: githubUrl,
        setGithubUrl
      },
      bodyScroll: {
        isDisable: disableBodyScroll,
        setDisableBodyScroll
      }
    } satisfies RzlFumadocsContext;
  }, [
    toTop,
    toHash,
    intoView,
    intoViewFromIfNeed,
    prefetch,
    githubUrl,
    pageMdx,
    disableBodyScroll
  ]);

  return (
    <RzlFumadocsContext.Provider value={valueContext}>
      <RenderBanner />
      {children}
    </RzlFumadocsContext.Provider>
  );
};

const RenderBanner = () => {
  const pathname = usePathname();
  const { pageMdx } = useMainRzlFumadocs();
  const data = pageMdx.data;

  useEffect(() => {
    if (!pathname.startsWith(SOURCE_CONFIG.LOADER.BASE_URL) || !pageMdx.data) {
      pageMdx.setPageMdxData(null);
    }
  }, [pathname, data]);

  const isDocsUnderConstruction = data?.docsUnderConstruction;
  const packageMeta = data?.packageMeta;

  const version =
    packageMeta?.version && packageMeta.version !== "latest"
      ? packageMeta.version.replace(/^v/, "")
      : null;

  return (
    <>
      {!!isDocsUnderConstruction && (
        <>
          <Banner
            data-banner
            variant="rainbow"
            className="flex flex-col justify-center items-center gap-0"
          >
            <div className="font-bold text-black dark:text-fd-foreground">
              Full documentation
              {typeof isDocsUnderConstruction === "string" ? (
                <>
                  {" "}
                  <span className="underline font-semibold">
                    {isDocsUnderConstruction}
                  </span>{" "}
                </>
              ) : (
                " "
              )}
              is currently under construction.
            </div>
          </Banner>
        </>
      )}
      {packageMeta && version && (
        <Banner
          variant="rainbow"
          reverseRainbow
        >
          <span className="font-semibold text-black dark:text-fd-foreground">
            You are currently viewing documentation for{" "}
            <span className="underline font-semibold">Version {version}</span>{" "}
            of {packageMeta.name}.
          </span>
        </Banner>
      )}
    </>
  );
};

export const useMainRzlFumadocs = () => RzlFumadocsContext.use();
