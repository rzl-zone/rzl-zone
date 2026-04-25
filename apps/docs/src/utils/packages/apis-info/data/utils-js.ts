import type { ApiVersionInfoType } from "../types";

export const apisUtilsJS = {
  assertions: {
    assertIsBoolean: {
      since: "v3.10.0",
      category: "assertions",
      stability: "stable"
    },
    assertIsString: {
      since: "v3.10.0",
      category: "assertions",
      stability: "stable"
    },
    assertIsBigInt: {
      since: "v3.10.0",
      category: "assertions",
      stability: "stable"
    },
    assertIsNumber: {
      since: "v3.10.0",
      category: "assertions",
      stability: "stable"
    },
    assertIsArray: {
      since: "v3.10.0",
      category: "assertions",
      stability: "stable"
    },
    assertIsPlainObject: {
      since: "v3.10.0",
      category: "assertions",
      stability: "stable"
    }
  }
} satisfies Record<string, Record<string, ApiVersionInfoType>>;
