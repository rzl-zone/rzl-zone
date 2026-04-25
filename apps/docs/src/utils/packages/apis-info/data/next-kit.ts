import type { ApiVersionInfoType } from "../types";

export const apisNextKit = {
  env: {
    isDevEnv: {
      since: "v1.0.0",
      category: "env",
      stability: "stable"
    }
  }
} satisfies Record<string, Record<string, ApiVersionInfoType>>;
