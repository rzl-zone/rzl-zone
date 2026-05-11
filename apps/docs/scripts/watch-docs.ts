import { promisify } from "node:util";
import { exec as execCb } from "node:child_process";

import { ZodError } from "zod";
import chokidar from "chokidar";
import { delay } from "@rzl-zone/utils-js/promises";
import { isError } from "@rzl-zone/utils-js/predicates";
import { normalizePathname } from "@rzl-zone/utils-js/urls";

import { SOURCE_CONFIG } from "@/configs/source/package";

/** Promisified child process executor.
 *
 * Used for running cache rebuild commands sequentially.
 *
 * @internal
 */
const execAsync = promisify(execCb);

/** Active debounce timer for rebuild scheduling.
 *
 * Prevents duplicate rebuilds during rapid filesystem changes.
 *
 * @internal
 */
let rebuildTimeout: NodeJS.Timeout | null = null;

/** Docs cache rebuild commands executed by the watcher.
 *
 * Commands are executed sequentially to preserve build order consistency.
 *
 * @internal
 */
const REBUILD_COMMANDS = ["pnpm run generate:all-docs-cache"] as const;

/** Execute docs cache rebuild commands.
 *
 * Triggered by filesystem watcher events.
 *
 * @param filePath - Changed filesystem path.
 * @param reason - Watcher event type.
 *
 * @internal
 */
async function runDocsCacheRebuild(filePath: string, reason: string) {
  console.log(`🌀 Rebuilding docs cache due to ${reason}: ${filePath}`);

  try {
    for (const command of REBUILD_COMMANDS) {
      const { stdout, stderr } = await execAsync(command);
      if (stderr) console.error(stderr);
      if (stdout) console.log(stdout);

      await delay(50);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("⚠️ Rebuild failed:", error);
    } else {
      console.error("⚠️ Rebuild failed:", error);
    }
  }
}

/** Schedule a debounced docs cache rebuild.
 *
 * Prevents excessive rebuild executions during rapid file changes.
 *
 * @param filePath - Changed filesystem path.
 * @param reason - Watcher event type.
 *
 * @internal
 */
function scheduleDocsCacheRebuild(filePath: string, reason: string) {
  if (rebuildTimeout) clearTimeout(rebuildTimeout);

  rebuildTimeout = setTimeout(() => {
    runDocsCacheRebuild(filePath, reason);
    rebuildTimeout = null;
  }, 500);
}

/** Normalized docs content directory path used by the filesystem watcher.
 *
 * Leading slashes are removed to ensure compatibility with chokidar.
 *
 * @internal
 */
const docsContentPath = normalizePathname(
  SOURCE_CONFIG.DOCS.DEFINE_DOCS.DIR
).replace(/^\/+/, "");

/** Filesystem watcher for documentation content changes.
 *
 * Automatically triggers docs cache rebuilds on supported file events.
 *
 * @internal
 */
const watcher = chokidar.watch(docsContentPath, {
  persistent: true,
  ignoreInitial: false,
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 1500,
    pollInterval: 100
  },
  depth: 10
});

watcher.on("all", (watcherEvent, filePath) => {
  if (
    ["add", "change", "unlink", "addDir", "unlinkDir"].includes(watcherEvent)
  ) {
    scheduleDocsCacheRebuild(filePath, watcherEvent);
  }
});

watcher.on("error", (error) => {
  console.error("⚠️ Watcher crashed:", isError(error) ? error.message : error);
});

console.log("👀 Watching content/docs for changes...");
