"use client";

import {
  type ComponentPropsWithRef,
  type ComponentType,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useMemo,
  useState
} from "react";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { cn } from "@rzl-zone/docs-ui/utils";

declare global {
  interface Navigator {
    userAgentData?: {
      platform?: string;
      brands?: Array<{ brand: string; version: string }>;
      mobile?: boolean;
    };
  }
}

type HotKey = {
  display: ReactNode;

  /**
   * Key code or a function determining whether the key is pressed.
   */
  key: string | ((e: KeyboardEvent) => boolean);
};

export type SharedProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type SearchLink = [name: string, href: string];

export type TagItem = {
  name: string;
  value: string;
};

export type SearchProviderProps = {
  /**
   * Preload search dialog before opening it
   *
   * @default `true`
   */
  preload?: boolean;

  /**
   * Custom links to be displayed if search is empty
   */
  links?: SearchLink[];

  /**
   * Hotkeys for triggering search dialog
   *
   * @default Meta/Ctrl + K
   */
  hotKey?: HotKey[];

  /**
   * Replace default search dialog, allowing you to use other solutions such as Algolia Search
   *
   * It receives the `open` and `onOpenChange` prop, can be lazy loaded with `next/dynamic`
   */
  SearchDialog: ComponentType<SharedProps>;

  /**
   * Additional props to the dialog
   */
  options?: Partial<SharedProps & Record<string, unknown>>;

  children?: ReactNode;
};

type SearchContextType = {
  enabled: boolean;
  hotKey: HotKey[];
  setOpenSearch: (value: boolean) => void;
};

const SearchContext = createRequiredContext<SearchContextType>("SearchContext");

export function useSearchContext(errorMessage?: string) {
  return SearchContext.use(errorMessage);
}

export function MetaOrControl({
  nodeOnLoading,
  nodeOnReady
}: {
  nodeOnLoading?: {
    component?: ReactNode;
    overrideProps?: Omit<ComponentPropsWithRef<"span">, "children">;
  };
  nodeOnReady?: {
    component?: ReactNode;
    overrideProps?: Omit<ComponentPropsWithRef<"span">, "children">;
  };
}) {
  const [key, setKey] = useState<ReactNode>(null);

  const setTheKey = useEffectEvent((newKey = "Ctrl") => {
    setKey(newKey);
  });

  useEffect(() => {
    const getPlatform = () => {
      // Prefer modern API
      if (navigator.userAgentData?.platform) {
        return navigator.userAgentData.platform;
      }

      // Fallback for old versions
      return navigator.platform || navigator.userAgent;
    };

    const platform = getPlatform().toLowerCase();

    if (
      platform.includes("mac") ||
      platform.includes("iphone") ||
      platform.includes("ipad") ||
      platform.includes("ios")
    ) {
      setTheKey("⌘"); // for iOS, command-equivalent
      return;
    }

    if (platform.includes("win")) {
      setTheKey("Ctrl");
      return;
    }

    if (platform.includes("android")) {
      setTheKey("⎋"); // or "ctrl"
      return;
    }

    // Linux & unknown = Ctrl
    setTheKey("Ctrl");
  }, []);

  if (!key) {
    return (
      <span
        {...nodeOnLoading?.overrideProps}
        className={cn(
          "w-5 px-0 h-full inline-block rounded-md bg-fd-muted animate-pulse",
          nodeOnLoading?.overrideProps?.className
        )}
      >
        {null}
      </span>
    );
  }

  return (
    <span
      {...nodeOnReady?.overrideProps}
      className={cn("px-1.5", nodeOnReady?.overrideProps?.className)}
    >
      {key}
    </span>
  );
}

export function SearchProvider({
  SearchDialog,
  children,
  preload = true,
  options,
  hotKey = [
    {
      key: (e) => e.metaKey || e.ctrlKey,
      display: <MetaOrControl />
    },
    {
      key: "k",
      display: "K"
    }
  ],
  links
}: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(preload ? false : undefined);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        hotKey.every((v) =>
          typeof v.key === "string" ? e.key === v.key : v.key(e)
        )
      ) {
        setIsOpen(true);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [hotKey]);

  return (
    <SearchContext.Provider
      value={useMemo(
        () => ({
          enabled: true,
          hotKey,
          setOpenSearch: setIsOpen
        }),
        [hotKey]
      )}
    >
      {isOpen !== undefined && (
        <SearchDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          // @ts-expect-error -- insert prop for official UIs
          links={links}
          {...options}
        />
      )}
      {children}
    </SearchContext.Provider>
  );
}

/**
 * Show children only when search is enabled via React Context
 */
export function SearchOnly({
  children,
  forceHidden
}: {
  children: ReactNode;
  forceHidden?: boolean;
}) {
  const search = useSearchContext();

  if (forceHidden ?? !search.enabled) return null;

  return children;
}
