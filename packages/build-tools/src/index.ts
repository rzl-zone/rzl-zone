import "@rzl-zone/node-only";

export type {
  Collection,
  StringCollection,
  InternalOptions,
  LogLevel,
  LoggingOptions,
  PatternConfig,
  PatternOptions,
  BaseOptions
} from "@/types";

export {
  type CleanJsArtifactsOptions,
  type CleanTypesArtifactsOptions,
  cleanJsBuildArtifacts,
  cleanTypesBuildArtifacts,
  commandCjbaIdentity,
  commandCtbaIdentity,
  DEFAULT_CLEAN_PATTERN_POLICY,
  resolvedCleanPatternOption
} from "@/core/clean";

export {
  type CopyFileToDestOptions,
  type CopyFileToDestParam,
  commandCftdIdentity,
  copyFileToDest,
  createCopyFileToDestParameterSet
} from "@/core/copy";

export {
  type EnsureCssImportOptions,
  type EnsureFinalNewlineOptions,
  commandEciIdentity,
  commandEfnIdentity,
  ensureCssImport,
  ensureFinalNewline,
  DEFAULT_ECI_PATTERN_POLICY,
  resolvedEciPatternOption,
  DEFAULT_EFN_PATTERN_POLICY,
  resolvedEfnPatternOption
} from "@/core/ensure";

export {
  type GeneratePackageBannerOptions,
  type GenerateReferenceOptions,
  commandGriIdentity,
  generatePackageBanner,
  generateReferenceIndex,
  DEFAULT_GRI_PATTERN_POLICY,
  resolvedGriPatternOption
} from "@/core/generate";

export { getPackageJson, type GetPackageJsonOptions } from "@/core/get";

export {
  type InjectBannerOptions,
  type InjectDirectiveOptions,
  commandIbIdentity,
  commandIdIdentity,
  injectBanner,
  injectDirective,
  DEFAULT_IB_PATTERN_POLICY,
  DEFAULT_ID_PATTERN_POLICY,
  resolvedIbPatternOption,
  resolvedIdPatternOption
} from "@/core/inject";

export {
  type NormalizeJsBuildNewlinesOptions,
  commandNjbnIdentity,
  normalizeJsBuildNewlines,
  DEFAULT_NJBN_PATTERN_POLICY,
  resolvedNjbnPatternOption
} from "@/core/normalize";

export {
  type StripJsCommentsOptions,
  commandSjcIdentity,
  stripJsComments,
  DEFAULT_SJC_PATTERN_POLICY,
  resolvedSjcPatternOption
} from "@/core/strip";

export {
  type RunCommandCaptureOptions,
  type RunCommandCaptureResult,
  type RunCommandOptions,
  CommandProcessError,
  isCommandProcessError,
  runCommand,
  runCommandCapture
} from "@/core/run";
