import type { ApiVersionInfoType } from "../types";

export const apiBuildTools = {
  clean: {
    cleanJsBuildArtifacts: {
      since: "v0.0.7",
      category: "clean",
      stability: "stable"
    },
    cleanTypesBuildArtifacts: {
      since: "v0.0.7",
      category: "clean",
      stability: "stable"
    }
  },
  copy: {
    copyFileToDest: {
      since: "v0.0.7",
      category: "copy",
      stability: "stable"
    }
  },
  ensure: {
    ensureCssImport: {
      since: "v0.0.7",
      category: "ensure",
      stability: "stable"
    },
    ensureFinalNewline: {
      since: "v0.0.7",
      category: "ensure",
      stability: "stable"
    }
  },
  generate: {
    generatePackageBanner: {
      since: "v0.0.7",
      category: "generate",
      stability: "stable"
    },
    generateReferenceIndex: {
      since: "v0.0.7",
      category: "generate",
      stability: "stable"
    }
  },
  get: {
    getPackageJson: {
      since: "v0.0.7",
      category: "get",
      stability: "stable"
    }
  },
  inject: {
    injectBanner: {
      since: "v0.0.7",
      category: "inject",
      stability: "stable"
    },
    injectDirective: {
      since: "v0.0.7",
      category: "inject",
      stability: "stable"
    }
  },
  normalize: {
    normalizeJsBuildNewlines: {
      since: "v0.0.7",
      category: "normalize",
      stability: "stable"
    }
  }
} satisfies Record<string, Record<string, ApiVersionInfoType>>;
