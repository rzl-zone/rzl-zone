/* eslint-disable @typescript-eslint/no-explicit-any */
(async () => {
  // override console.warn
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      args.length > 0 &&
      typeof args[0] === "string" &&
      args[0].includes("@fumadocs/ui/provider export will be removed")
    ) {
      return;
    }
    originalWarn(...args);
  };

  const cp = await import("child_process");
  cp.execSync("next build", { stdio: "inherit" });
})();
