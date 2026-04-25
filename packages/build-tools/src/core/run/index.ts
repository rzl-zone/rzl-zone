import "@rzl-zone/node-only";

export type { typesSpawn } from "./command/types";
export { CommandProcessError, isCommandProcessError } from "./command/utils";

export {
  type RunCommandCaptureOptions,
  type RunCommandCaptureResult,
  runCommandCapture
} from "./command/runCommandCapture";
export { type RunCommandOptions, runCommand } from "./command/runCommand";
