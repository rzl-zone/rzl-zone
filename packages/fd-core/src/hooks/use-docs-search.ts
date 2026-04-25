"use client";

import { use, useRef, useState, type DependencyList } from "react";

import {
  type AlgoliaOptions,
  type ClientPreset,
  type FetchOptions,
  type OramaCloudOptions,
  type StaticOptions
} from "fumadocs-core/search/client";
import { type SortedResult } from "fumadocs-core/search";
import { useOnChange } from "@rzl-zone/core-react/hooks";

import { useDebounceFD } from "./use-debounce-fd";
import type { Awaitable } from "@rzl-zone/ts-types-plus";

interface UseDocsSearch {
  search: string;
  setSearch: (v: string) => void;
  query: {
    isLoading: boolean;
    data?: SortedResult[] | "empty";
    error?: Error;
  };
}

function _isDifferentDeep(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.length !== a.length || a.some((v, i) => _isDifferentDeep(v, b[i]));
  }

  if (typeof a === "object" && a && typeof b === "object" && b) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    return (
      aKeys.length !== bKeys.length ||
      aKeys.some((key) =>
        _isDifferentDeep(a[key as keyof object], b[key as keyof object])
      )
    );
  }

  return a !== b;
}

export interface SearchClient {
  search: (query: string) => Awaitable<SortedResult[]>;
  deps?: DependencyList;
}

const promiseMap: Record<string, Promise<unknown>> = {};

/**
 * Provide a hook to query different official search clients.
 *
 * Note: it will re-query when its parameters changed, make sure to use `useCallback()` on functions passed to this hook.
 */
export function useDocsSearch(
  clientOptions: ClientPreset & {
    /**
     * The debounced delay for performing a search (in ms).
     * .
     * @default 500
     */
    delayMs?: number;

    /**
     * still perform search even if query is empty.
     *
     * @default false
     */
    allowEmpty?: boolean;
  },
  deps?: DependencyList
): UseDocsSearch {
  // handle deprecated params
  const { delayMs = 500, allowEmpty = false, ...clientRest } = clientOptions;

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SortedResult[] | "empty">("empty");
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const debouncedValue = useDebounceFD(search, delayMs);
  const onStart = useRef<() => void>(undefined);

  let client: SearchClient;

  if ("type" in clientRest) {
    switch (clientRest.type) {
      case "fetch": {
        const res = (promiseMap[clientRest.type] ??=
          import("../search/client/fetch")) as Promise<
          typeof import("../search/client/fetch")
        >;
        const { fetchClient } = use(res);
        client = fetchClient(clientRest);
        break;
      }
      case "algolia": {
        const res = (promiseMap[clientRest.type] ??=
          import("../search/client/algolia")) as Promise<
          typeof import("../search/client/algolia")
        >;
        const { algoliaClient } = use(res);
        client = algoliaClient(clientRest);
        break;
      }
      case "orama-cloud": {
        const res = (promiseMap[clientRest.type] ??=
          import("../search/client/orama-cloud")) as Promise<
          typeof import("../search/client/orama-cloud")
        >;
        const { oramaCloudClient } = use(res);
        client = oramaCloudClient(clientRest);
        break;
      }
      case "orama-cloud-legacy": {
        const res = (promiseMap[clientRest.type] ??=
          import("../search/client/orama-cloud-legacy")) as Promise<
          typeof import("../search/client/orama-cloud-legacy")
        >;
        const { oramaCloudLegacyClient } = use(res);
        client = oramaCloudLegacyClient(clientRest);
        break;
      }
      case "mixedbread": {
        const res = (promiseMap[clientRest.type] ??=
          import("../search/client/mixedbread")) as Promise<
          typeof import("../search/client/mixedbread")
        >;
        const { mixedbreadClient } = use(res);
        client = mixedbreadClient(clientRest);
        break;
      }
      case "static": {
        const res = (promiseMap[clientRest.type] ??=
          import("../search/client/orama-static")) as Promise<
          typeof import("../search/client/orama-static")
        >;
        const { oramaStaticClient } = use(res);
        client = oramaStaticClient(clientRest);
        break;
      }
      default:
        throw new Error("unknown search client");
    }
  } else {
    client = clientRest.client;
  }

  useOnChange([deps ?? client.deps, debouncedValue], () => {
    if (onStart.current) {
      onStart.current();
      onStart.current = undefined;
    }

    setIsLoading(true);
    let interrupt = false;
    onStart.current = () => {
      interrupt = true;
    };

    async function run(): Promise<SortedResult[] | "empty"> {
      if (debouncedValue.length === 0 && !allowEmpty) return "empty";
      return client.search(debouncedValue);
    }

    void run()
      .then((res) => {
        if (interrupt) return;

        setError(undefined);
        setResults(res);
      })
      .catch((err: Error) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  });

  return { search, setSearch, query: { isLoading, data: results, error } };

  // useOnChange(
  //   [clientRest, debouncedValue],
  //   () => {
  //     if (onStart.current) {
  //       onStart.current();
  //       onStart.current = undefined;
  //     }

  //     setIsLoading(true);
  //     let interrupt = false;
  //     onStart.current = () => {
  //       interrupt = true;
  //     };

  //     async function run(): Promise<SortedResult[] | "empty"> {
  //       if (debouncedValue.length === 0 && !allowEmpty) return "empty";

  //       if ("type" in clientRest) {
  //         if (clientRest.type === "fetch") {
  //           const { fetchDocs } = await import("../search/client/fetch");
  //           return fetchDocs(debouncedValue, clientRest);
  //         }

  //         if (clientRest.type === "algolia") {
  //           const { searchDocs } = await import("../search/client/algolia");
  //           return searchDocs(debouncedValue, clientRest);
  //         }

  //         if (clientRest.type === "orama-cloud") {
  //           const { searchDocs } = await import("../search/client/orama-cloud");
  //           return searchDocs(debouncedValue, clientRest);
  //         }

  //         if (clientRest.type === "static") {
  //           const { search } = await import("../search/client/static");
  //           return search(debouncedValue, clientRest);
  //         }

  //         if (clientRest.type === "mixedbread") {
  //           const { search } = await import("../search/client/mixedbread");
  //           return search(debouncedValue, clientRest);
  //         }
  //       } else {
  //         client = clientRest.client;
  //       }

  //       throw new Error("unknown search client");
  //     }

  //     void run()
  //       .then((res) => {
  //         if (interrupt) return;

  //         setError(undefined);
  //         setResults(res);
  //       })
  //       .catch((err: Error) => {
  //         setError(err);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   },
  //   _isDifferentDeep
  // );

  // return { search, setSearch, query: { isLoading, data: results, error } };
}

export type { OramaCloudOptions, FetchOptions, StaticOptions, AlgoliaOptions };
