import type { ApiVersionInfoType } from "../types";

export const apiBuildTools = {
  cleaner: {
    cleanJsBuildArtifacts: {
      since: "v0.0.1",
      category: "cleaner",
      stability: "stable"
    },
    cleanTypesBuildArtifacts: {
      since: "v0.0.1",
      category: "cleaner",
      stability: "stable"
    }
  }
} satisfies Record<string, Record<string, ApiVersionInfoType>>;
