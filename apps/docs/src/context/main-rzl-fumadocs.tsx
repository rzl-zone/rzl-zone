"use client";

import type { Prettify } from "@rzl-zone/ts-types-plus";
import type { FumaNextLinkType } from "@/components/link";
import type { PageSchemaType } from "@/configs/source/schema";

import { useState, type ReactNode, useEffect, useMemo } from "react";

import { createRequiredContext } from "@rzl-zone/core-react/context";
import { type StandardBehaviorOptions } from "@rzl-zone/docs-ui/utils";

import { Banner } from "@/components/ui/banner";
import { usePathname } from "next/navigation";
import { SOURCE_CONFIG } from "@/configs/source/package";

export type PageMdxDataType = Prettify<
  PageSchemaType & {
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
  defaultPrefetch?: FumaNextLinkType["prefetch"];
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
  const [prefetch, setPrefetch] =
    useState<FumaNextLinkType["prefetch"]>(defaultPrefetch);
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

  useEffect(() => {
    let styleEl = document.getElementById("lock-body-scroll");

    if (disableBodyScroll) {
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "lock-body-scroll";
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
      }
    } else {
      styleEl?.remove();
    }

    return () => {
      styleEl?.remove();
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
