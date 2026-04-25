/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AsyncLocalStorage } from "node:async_hooks";

import { safeImport } from "@/extra/utils/dynamic-import";
import { RZL_NEXT_KIT_EXTRA } from "./constants";

const { FLAG_MESSAGE } = RZL_NEXT_KIT_EXTRA.ERROR;

/** @internal */
export function getExpectedRequestStore(callingExpression: string) {
  const workUnitStoreModule = safeImport<
    | {
        getExpectedRequestStore: any;
      }
    | {
        workUnitAsyncStorage: AsyncLocalStorage<any>;
      }
  >("next/dist/server/app-render/work-unit-async-storage.external");
  if (workUnitStoreModule) {
    if ("getExpectedRequestStore" in workUnitStoreModule) {
      return workUnitStoreModule.getExpectedRequestStore();
    }

    return workUnitStoreModule.workUnitAsyncStorage.getStore();
  }

  const requestStoreModule = safeImport<{
    requestAsyncStorage: AsyncLocalStorage<any>;
  }>("next/dist/client/components/request-async-storage.external");
  if (requestStoreModule) {
    const store = requestStoreModule.requestAsyncStorage.getStore();
    if (store) return store;
    throw new Error(
      FLAG_MESSAGE(
        `Function \`${callingExpression}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`
      )
    );
  }

  throw new Error(
    FLAG_MESSAGE(
      `Variant \`${callingExpression}\` expects to have requestAsyncStorage, none available.`
    )
  );
}

/** @internal */
export function getStaticGenerationStore(callingExpression: string) {
  const staticGenerationStoreModule = safeImport<{
    staticGenerationAsyncStorage: any;
  }>("next/dist/client/components/static-generation-async-storage.external");
  if (staticGenerationStoreModule) {
    const staticGenerationStore =
      (fetch as any).__nextGetStaticStore?.() ??
      staticGenerationStoreModule.staticGenerationAsyncStorage;

    const store = staticGenerationStore.getStore();
    if (!store) {
      throw new Error(
        FLAG_MESSAGE(
          `Variant \`${callingExpression}\` expects to have staticGenerationAsyncStorage, none available.`
        )
      );
    }

    return store;
  }
}
