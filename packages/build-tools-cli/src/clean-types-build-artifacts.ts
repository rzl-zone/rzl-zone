#!/usr/bin/env node

/* eslint-disable quotes */

import "@rzl-zone/node-only";

import {
  cleanTypesBuildArtifacts,
  commandCtbaIdentity,
  resolvedCleanPatternOption,
  type LogLevel
} from "@rzl-zone/build-tools";
import {
  joinInline,
  joinLinesLoose,
  picocolors
} from "@rzl-zone/build-tools/utils";
import { createBaseProgram } from "@rzl-zone/build-tools/commander-kit";

import {
  resolveGlobPatterns,
  resolveLogLevelOption,
  resolvePatternOptions
} from "./_private/internal";
import { PACKAGE_META } from "./_private/constants";

type CliOptions = {
  removeEmptyLines?: boolean;
  removeSourceMap?: boolean;
  removeRegion?: boolean;
  logLevel?: LogLevel | boolean;
  patternOptions?: string;
};

const cmdIdentity = commandCtbaIdentity
  .setPackageName(PACKAGE_META.name)
  .setVersion(PACKAGE_META.version);

const program = createBaseProgram({
  commandIdentity: cmdIdentity,
  ui: {
    title: cmdIdentity.cli(),
    usage: joinInline(
      picocolors.cyan(cmdIdentity.commandName),
      picocolors.gray("<glob...>"),
      picocolors.blueBright("[options]")
    )
  }
});

program
  .description(
    picocolors.bold(
      picocolors.magentaBright(
        joinLinesLoose(
          "Remove build artifact comments from compiled TypeScript",
          "declaration files (.d.ts, .d.cts, .d.mts).",
          "",
          "All non-flag arguments are treated as glob patterns."
        )
      )
    )
  )
  .argument("[glob...]", "Glob pattern(s) pointing to Types output files.")
  .option(
    "--rel, --remove-empty-lines",
    "Remove blank lines adjacent to removed comments",
    false
  )
  .option(
    "--rsm, --remove-source-map",
    "Remove sourceMappingURL comments from declaration files",
    false
  )
  .option("--nrr, --no-remove-region", "Disable remove region comments")
  .option(
    "--ll, --log-level [level]",
    joinLinesLoose(
      "Set logging verbosity level, available logging levels:",
      "                                  - silent ➔ no output.",
      "                                  - error ➔ errors only.",
      "                                  - info (default) ➔ standard informational logs (include `error`).",
      "                                  - debug ➔ verbose / debug logs (include `error`).",
      picocolors.yellowBright(
        "                                 * Invalid values will fallback to the default level"
      )
    ),
    "info"
  )
  .option(
    "--po, --pattern-options <json>",
    "Pattern matching options in JSON format"
  )
  .addHelpText(
    "after",
    joinLinesLoose(
      "",
      picocolors.bold("# Notes:"),
      `  ${picocolors.dim("• You may provide MULTIPLE glob patterns.")}`,
      `  ${picocolors.dim("• All positional arguments are treated as glob patterns.")}`,
      `  ${picocolors.dim("• Files are modified IN PLACE.")}`,
      `  ${picocolors.dim("• ONLY declaration files are processed.")}`,
      `  ${picocolors.dim("• Invalid --log-level values will fallback to the default level.")}`,
      "",
      picocolors.bold("# Examples:"),
      `  ${picocolors.bold("• Clean declaration files")}`,
      `    ${picocolors.cyan("clean-types-build-artifacts")} ${picocolors.dim('"dist/**/*.d.ts"')}`,
      "",
      `  ${picocolors.bold("• Multiple declaration extensions")}`,
      `    ${picocolors.cyan("clean-types-build-artifacts")} ${picocolors.dim(
        '"dist/**/*.{d.ts,d.cts,d.mts}"'
      )}`,
      "",
      `  ${picocolors.bold("• Remove adjacent empty lines")}`,
      `    ${picocolors.cyan("clean-types-build-artifacts")} ${picocolors.dim('"dist/**/*.d.ts"')} \\`,
      `      ${picocolors.cyanBright("--remove-empty-lines")}`,
      "",
      `  ${picocolors.bold("• Keep source maps & clean layout")}`,
      `    ${picocolors.cyan("clean-types-build-artifacts")} ${picocolors.dim('"dist/**/*.d.ts"')} \\`,
      `      ${picocolors.cyanBright("--remove-empty-lines")}`,
      "",
      `  ${picocolors.bold("• Enable verbose debug logging")}`,
      `    ${picocolors.cyan("clean-types-build-artifacts")} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--log-level debug")}`,
      "",
      `  ${picocolors.bold("• Silent mode (no logs at all)")}`,
      `    ${picocolors.cyan("clean-types-build-artifacts")} ${picocolors.dim('"dist/**/*.js"')} \\`,
      `      ${picocolors.cyanBright("--log-level silent")}`
    )
  )
  .addHelpText(
    "after",
    joinLinesLoose(
      "",
      picocolors.bold("# Pattern Options:"),
      `  ${picocolors.dim("• Must be provided as a JSON string.")}`,
      `  ${picocolors.dim("• Unknown keys are automatically removed (sanitized).")}`,
      `  ${picocolors.dim("• Missing keys fallback to internal defaults.")}`,
      `  ${picocolors.dim("• Use '--pattern-options help' to view full schema.")}`,
      "",
      `  ${picocolors.bold("Examples:")}`,
      `     ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.gray('"dist/**/*.d.{ts,cts}"')} \\`,
      `       ${picocolors.blueBright("--pattern-options")} ${picocolors.dim(picocolors.gray('\'{"dot":true,"onlyFiles":true}\''))}`,
      "",
      `  ${picocolors.bold("Schema Help:")}`,
      `     ${picocolors.cyan(cmdIdentity.commandName)} ${picocolors.blueBright("--pattern-options")} ${picocolors.gray("help")}`,
      "",
      `  ${picocolors.dim("Pattern options are a restricted subset configuration.")}`
    )
  )
  .action(async () => {
    const {
      logLevel,
      removeEmptyLines,
      removeSourceMap,
      removeRegion,
      patternOptions
    } = program.opts<CliOptions>();

    const parsedPatternOptions = resolvePatternOptions(
      patternOptions,
      program,
      cmdIdentity,
      {
        globExample: "dist/**/*.d.{cts,ts}",
        patternOptionValue: resolvedCleanPatternOption
      }
    );

    const patterns = resolveGlobPatterns(program.args, program);
    const resolvedLogLevel = resolveLogLevelOption(logLevel, program);

    try {
      await cleanTypesBuildArtifacts(patterns, {
        removeSourceMap,
        removeRegion,
        removeAdjacentEmptyLines: removeEmptyLines,
        logLevel: resolvedLogLevel,
        patternOptions: parsedPatternOptions,
        __commandTitle: cmdIdentity.cli()
      });
    } catch (err) {
      console.error(picocolors.redBright(String(err)));
      process.exit(1);
    }
  });

program.parseAsync();
