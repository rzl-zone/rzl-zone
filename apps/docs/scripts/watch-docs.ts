import { promisify } from "node:util";
import { exec as execCb } from "node:child_process";

import { ZodError } from "zod";
import chokidar from "chokidar";
import { delay } from "@rzl-zone/utils-js/promises";
import { normalizePathname } from "@rzl-zone/utils-js/urls";

import { SOURCE_CONFIG } from "@/configs/source/package";

const exec = promisify(execCb);

let rebuildTimeout: NodeJS.Timeout | null = null;

async function runRebuild(file: string, reason: string) {
  console.log(`🌀 Rebuilding docs cache due to ${reason}: ${file}`);
  try {
    const cmds: string[] = ["npm run generate:all-docs-cache"];

    for (const cmd of cmds) {
      const { stdout, stderr } = await exec(cmd);
      if (stderr) console.error(stderr);
      if (stdout) console.log(stdout);
      // Optional delay between commands
      await delay(50);
    }
  } catch (err) {
    if (err instanceof ZodError) {
      console.log("⚠️ Rebuild failed:", err);
    } else {
      console.error("⚠️ Rebuild failed:", err);
    }
  }
}

function rebuild(file: string, reason: string) {
  if (rebuildTimeout) clearTimeout(rebuildTimeout);
  // Debounce untuk batch file changes
  rebuildTimeout = setTimeout(() => {
    runRebuild(file, reason);
    rebuildTimeout = null;
  }, 500); // 500ms debounce
}

// Watcher
const watcher = chokidar.watch(
  normalizePathname(SOURCE_CONFIG.DOCS.DEFINE_DOCS.DIR).replace(/^\/+/, ""),
  {
    persistent: true,
    ignoreInitial: false,
    usePolling: false,
    awaitWriteFinish: {
      stabilityThreshold: 1500,
      pollInterval: 100
    },
    depth: 10
  }
);

watcher.on("all", (event, file) => {
  if (["add", "change", "unlink", "addDir", "unlinkDir"].includes(event)) {
    rebuild(file, event);
  }
});

watcher.on("error", (err) => {
  console.error("⚠️ Watcher crashed:", (err as Error)?.message);
});

console.log("👀 Watching content/docs for changes...");
