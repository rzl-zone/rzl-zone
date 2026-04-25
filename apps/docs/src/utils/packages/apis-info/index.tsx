import { apiVersionEntries } from "@/configs/packages/docs";
import { formatApisVersInfo } from "./formatting";
import type {
  ApiVersionEntries,
  ApiVersionInfoFormattedResult,
  ApiVersionInfoType,
  ApiVersionInfoUnFormattedResult
} from "./types";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

import { ErrorWithStack } from "@rzl-zone/core/errors/prop-validation";

export function apiVersionInfo<
  P extends keyof ApiVersionEntries,
  C extends keyof ApiVersionEntries[P],
  N extends keyof ApiVersionEntries[P][C]
>(
  packageName: P,
  categoryApi: C,
  nameApi: N,
  options?: { format?: false }
): ApiVersionInfoUnFormattedResult<P, C, N>;
export function apiVersionInfo<
  P extends keyof ApiVersionEntries,
  C extends keyof ApiVersionEntries[P],
  N extends keyof ApiVersionEntries[P][C]
>(
  packageName: P,
  categoryApi: C,
  nameApi: N,
  options?: { format?: true }
): ApiVersionInfoFormattedResult<P, C, N>;

export function apiVersionInfo<
  P extends keyof ApiVersionEntries,
  C extends keyof ApiVersionEntries[P],
  N extends string | undefined
>(
  packageName: P,
  categoryApi: C,
  nameApi?: N,
  options?: { format?: false }
): never;

export function apiVersionInfo<
  P extends keyof ApiVersionEntries,
  C extends keyof ApiVersionEntries[P],
  N extends keyof ApiVersionEntries[P][C]
>(
  packageName: P,
  categoryApi: C,
  nameApi: N,
  options?: { format?: boolean }
): unknown {
  // eslint-disable-next-line no-useless-catch
  try {
    const inputName = apiVersionEntries[packageName];
    const inputCategory = apiVersionEntries[packageName]?.[categoryApi];
    const inputNameApi =
      apiVersionEntries[packageName]?.[categoryApi]?.[nameApi];

    // eslint-disable-next-line prefer-rest-params
    const argsForLog = Array.from(arguments).map((arg) =>
      arg === undefined
        ? "undefined"
        : safeStableStringify(arg, { keepUndefined: true, pretty: true })
    );
    const formatterLogErrorFunction = `apiVersionInfo(${argsForLog
      .map((v) => {
        return v;
      })
      .join(", ")})`;

    if (!inputName) {
      throw new ErrorWithStack(
        `Invalid \`packageName\` \`${safeStableStringify(packageName, {
          keepUndefined: true
        })}\` at \`${formatterLogErrorFunction}\`.`
      );
    }
    if (!inputCategory) {
      throw new ErrorWithStack(
        `Invalid \`categoryApi\` \`${safeStableStringify(categoryApi, {
          keepUndefined: true
        })}\` at \`${formatterLogErrorFunction}\`.`
      );
    }
    if (!inputNameApi) {
      throw new ErrorWithStack(
        `Invalid \`nameApi\` \`${safeStableStringify(nameApi, {
          keepUndefined: true
        })}\` at \`${formatterLogErrorFunction}\`.`
      );
    }

    const entry = inputNameApi as unknown as ApiVersionInfoType;

    if (options?.format) {
      return {
        since: formatApisVersInfo.since(entry.since),
        category: formatApisVersInfo.category(entry.category),
        stability: formatApisVersInfo.stability(entry.stability)
      };
    }

    return entry;
  } catch (error) {
    throw error;
  }
}
