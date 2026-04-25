import {
  cleanJsBuildArtifacts,
  ensureFinalNewline,
  generatePackageBanner,
  injectBanner,
  injectDirective,
  stripJsComments
} from "@rzl-zone/build-tools";
import { resolveDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";

export default resolveDefaultConfig({
  entry: ["src/*"],
  format: "cjs",
  dts: false,
  minify: true,
  async onSuccess() {
    await stripJsComments(["dist/**"], {
      logLevel: "error"
    });

    await cleanJsBuildArtifacts(["dist/**"], {
      removeAdjacentEmptyLines: true,
      logLevel: "error"
    });

    await injectDirective("dist/**", ["use strict"], { logLevel: "error" });

    await injectBanner(["dist/**"], [await generatePackageBanner()], {
      logLevel: "error"
    });

    await ensureFinalNewline(["dist/**"], { logLevel: "error" });
  }
});
