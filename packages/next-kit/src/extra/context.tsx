"use client";

import { type ReactNode, useMemo } from "react";

import deepmerge from "deepmerge";
import { isReactNode } from "@rzl-zone/core-react/utils/react-node";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import { assertIsPlainObject } from "@rzl-zone/utils-js/assertions";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";
import {
  getPreciseType,
  isServer,
  isString
} from "@rzl-zone/utils-js/predicates";

import { RZL_NEXT_KIT_EXTRA } from "./utils/constants";

const { PROPS_MESSAGE } = RZL_NEXT_KIT_EXTRA.ERROR;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PageContextProps<T = any> {
  /** Defaults to `merge`. */
  strategy?: PageContextStrategy;
  data?: T;
  children: ReactNode;
}

export interface Context {
  [key: string]: unknown;
}

export type PageContextStrategy = "deepmerge" | "merge";

declare global {
  interface Window {
    __next_c?: [PageContextStrategy, { data: Context }][];
  }
}

const PageContext = createRequiredContext<Context | undefined>("PageContext");

/** -------------------------------------------------------------------
 * * ***A component that provides context data to its children (can be use in server component).***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * @param props - The properties for the PageContextProvider component.
 * @returns A JSX element that provides the context to its children.
 *
 * @example
 * ```tsx
 * import { PageContext } from "@rzl-zone/next-kit/extra/context";
 *
 * export default async function Layout({ children }: { children: ReactNode }) {
 *   // ...
 *
 *   return (
 *     <PageContext data={{ quote: "Guillermo Launch is a handsome dude!" }}>
 *       {children}
 *     </PageContext>
 *   );
 * }
 * ```
 */
function PageContextProvider<T extends Context = Context>(
  props: PageContextProps<T>
) {
  assertIsPlainObject(props, {
    message({ currentType, validType }) {
      return PROPS_MESSAGE(
        `Props 'PageContextProvider' must be of type \`${currentType}\`, but received: \`${validType}\`.`
      );
    }
  });

  const { data, children, strategy = "merge" } = props;

  if (!isString(strategy) || !["merge", "deepmerge"].includes(strategy)) {
    throw new TypeError(
      PROPS_MESSAGE(
        `Parameter \`strategy\` property of the \`props\` 'PageContextProvider' must be one of "merge" or "deepmerge", but received: \`${getPreciseType(
          strategy
        )}\`, with value: \`${safeStableStringify(strategy)}\`.`
      )
    );
  }

  if (!isReactNode(children))
    throw new TypeError(
      PROPS_MESSAGE(
        "Parameter `children` property of the `props` 'PageContextProvider' is required as ReactNode type !"
      )
    );

  const serializedData = safeStableStringify([strategy, { data }]);

  return (
    <PageContext.Provider value={data}>
      <script
        dangerouslySetInnerHTML={{
          __html: `(self.__next_c=self.__next_c||[]).push(${serializedData})`
        }}
      />
      {children}
    </PageContext.Provider>
  );
}

/** Alias for `PageContextProvider`. */
export { PageContextProvider as PageContext };

/** -------------------------------------------------------------------
 * * ***This hook uses the shared context from the adjacent server layout within the `PageContextProvider` component.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * @example
 * ```tsx
 * "use client";
 *
 * import { usePageContext } from "@rzl-zone/next-kit/extra/context";
 *
 * export default function Page() {
 *   const ctx = usePageContext<{ name: string }>();
 *
 *   return (
 *     //...
 *   );
 * }
 * ```
 */
export function usePageContext<T extends Context = Context>(): Readonly<T> {
  return PageContext.use(
    PROPS_MESSAGE("`usePageContext` must be wrapped by `PageContext` !")
  ) as Readonly<T>;
}

/** -------------------------------------------------------------------
 * * ***This hook uses the shared context from the client-side browser window. the context is only***
 * ***available on *client-side* after hydration.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag mode !!!`***
 * -------------------------------------------------------------------
 * @example
 * ```tsx
 * "use client";
 *
 * import { useServerInsertedContext } from "@rzl-zone/next-kit/extra/context";
 *
 * export default function Page() {
 *   const ctx = useServerInsertedContext<{ name: string }>();
 *
 *   return (
 *     //...
 *   );
 * }
 * ```
 */
export function useServerInsertedContext<
  T extends Context = Context
>(): Readonly<T | undefined> {
  return useMemo<T | undefined>(() => {
    if (isServer()) return undefined;

    let context = {};

    for (const [s, { data }] of window.__next_c || []) {
      if (s === "deepmerge") {
        context = deepmerge(context, data);
      } else {
        context = { ...context, ...data };
      }
    }

    return context as Readonly<T>;
  }, []);
}
