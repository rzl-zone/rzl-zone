import { apiBuildTools } from "@/utils/packages/apis-info/data/build-tools";
import { apisNextKit } from "@/utils/packages/apis-info/data/next-kit";
import { apisUtilsJS } from "@/utils/packages/apis-info/data/utils-js";
import { type ApiVersionInfoType } from "@/utils/packages/apis-info/types";
import {
  getLinkUrl,
  type PackagesConfigs,
  type PackagesName
} from "@/utils/packages/docs";

export const apiVersionEntries = {
  "build-tools": apiBuildTools,
  "utils-js": apisUtilsJS,
  "next-kit": apisNextKit
} satisfies Record<
  PackagesName,
  Record<string, Record<string, ApiVersionInfoType>>
>;

export const PACKAGES_CONFIGS: PackagesConfigs = {
  URL_DOCS: "docs",
  ["build-tools"]: {
    name: "Build Tools",
    githubUrl:
      "https://github.com/rzl-zone/rzl-zone/tree/main/packages/build-tools",
    actualVersionLatest: {
      // beta: "1.0.0-beta.1",
      latest: "0.0.1"
    },
    description: "Build tools Rzl Zone.",
    url: function (toPath: string, version?: string) {
      return getLinkUrl({ packageName: "build-tools", toPath, version });
    }
  },
  ["utils-js"]: {
    name: "UtilsJS",
    githubUrl:
      "https://github.com/rzl-zone/rzl-zone/tree/main/packages/utils-js",
    actualVersionLatest: {
      latest: "3.11.0",
      "2": "2.25.10"
    },
    description: "Utility Packages JS/TS.",
    url: function (toPath: string, version?: string) {
      return getLinkUrl({ packageName: "utils-js", toPath, version });
    }
  },
  ["next-kit"]: {
    name: "Next Kit",
    githubUrl:
      "https://github.com/rzl-zone/rzl-zone/tree/main/packages/next-kit",
    actualVersionLatest: {},
    description: "Extra Type/Interface TS.",
    url: function (toPath: string, version?: string) {
      return getLinkUrl({ packageName: "next-kit", toPath, version });
    }
  }
};
