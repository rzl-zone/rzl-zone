import type { apiVersionEntries } from "@/configs/packages/docs";

type ApiVersionInfoFormatted = {
  since: React.JSX.Element;
  category: React.JSX.Element;
  stability: React.JSX.Element;
};
type ApiVersionInfoUnFormatted = ApiVersionInfoType;

export type ApiVersionEntries = typeof apiVersionEntries;

export type ApiVersionInfoFormattedResult<P, C, N> =
  P extends keyof ApiVersionEntries
    ? C extends keyof ApiVersionEntries[P]
      ? N extends keyof ApiVersionEntries[P][C]
        ? ApiVersionInfoFormatted
        : never
      : never
    : never;

export type ApiVersionInfoUnFormattedResult<P, C, N> =
  P extends keyof ApiVersionEntries
    ? C extends keyof ApiVersionEntries[P]
      ? N extends keyof ApiVersionEntries[P][C]
        ? ApiVersionInfoUnFormatted
        : never
      : never
    : never;

export type ApiVersionInfoType = {
  since: string;
  category: string;
  stability: "stable" | "beta";
};
